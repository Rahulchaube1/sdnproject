#!/usr/bin/env python3
"""
Campus Access Control - OpenFlow 1.3 datapath simulator
=======================================================
Runs the three campus switches (s1, s2, s3) and the Ryu controller logic from
`controller.py` in-process, so the access policy can be exercised and observed
without a Mininet/OVS VM.

The model follows OpenFlow 1.3 semantics:
  * Table 0 lookup picks the highest-priority entry whose match fields all
    agree with the packet.
  * A table-miss sends the packet to the controller (PACKET_IN). The
    controller evaluates `evaluate_campus_acl()` and installs a reactive flow
    (idle_timeout=60 for permits, 120 for denies) exactly like
    `CampusAccessController._packet_in_handler`.
  * Proactive entries (table-miss, ARP, student<->admin DROP) are installed when
    a switch connects, mirroring `switch_features_handler`.
  * Reactive flows expire after their idle timeout (FLOW_REMOVED).

Latency is modelled from the Mininet link parameters in `topology.py`
(1 ms per link per direction) plus a controller round trip for every
PACKET_IN. It is a model, not a measurement.
"""

import itertools
import random
import threading
import time
from collections import deque
from dataclasses import dataclass, field
from typing import Callable, Dict, List, Optional, Tuple

from controller import (
    evaluate_campus_acl,
    STUDENT_IPS,
    ADMIN_SERVER_IP,
    PRIORITY_DROP_STUDENT_ADMIN,
    PRIORITY_ARP_CONTROL,
    PRIORITY_L2_SWITCHING,
    PRIORITY_TABLE_MISS,
)
from topology import TOPOLOGY_SPEC

ETH_TYPE_IP = 0x0800
ETH_TYPE_ARP = 0x0806

# name -> (ip_proto, default dst port, frame bytes, display label)
PROTOCOLS = {
    "ICMP": (1, 0, 98, "ICMP"),
    "HTTP": (6, 80, 512, "TCP"),
    "HTTPS": (6, 443, 583, "TLS"),
    "SSH": (6, 22, 128, "SSH"),
    "DNS": (17, 53, 82, "DNS"),
    "TCP": (6, 80, 512, "TCP"),
    "UDP": (17, 53, 82, "UDP"),
    "ARP": (None, 0, 42, "ARP"),
}

LINK_DELAY_MS = 1.0          # TCLink delay="1ms" in topology.py
SWITCH_PROC_MS = 0.02        # per-hop OVS processing
CONTROLLER_RTT_MS = 2.4      # PACKET_IN -> FLOW_MOD/PACKET_OUT round trip
ARP_CACHE_TTL = 60.0         # seconds
IDLE_TIMEOUT_PERMIT = 60     # controller.py
IDLE_TIMEOUT_DENY = 120      # controller.py


def resolve_protocol(protocol: str, dst_port: Optional[int] = None):
    name = (protocol or "ICMP").upper()
    if name not in PROTOCOLS:
        raise ValueError(f"unsupported protocol '{protocol}'")
    ip_proto, default_port, nbytes, label = PROTOCOLS[name]
    port = default_port if dst_port in (None, 0) else int(dst_port)
    return name, ip_proto, port, nbytes, label


@dataclass
class FlowEntry:
    switch: str
    dpid: str
    priority: int
    match: Dict
    actions: str
    rule_id: str
    cookie: int
    table_id: int = 0
    idle_timeout: int = 0
    hard_timeout: int = 0
    reactive: bool = False
    installed_at: float = field(default_factory=time.time)
    last_hit: float = 0.0
    n_packets: int = 0
    n_bytes: int = 0

    def matches(self, pkt: Dict) -> bool:
        for key, value in self.match.items():
            if pkt.get(key) != value:
                return False
        return True

    def hit(self, nbytes: int, now: float):
        self.n_packets += 1
        self.n_bytes += nbytes
        self.last_hit = now

    def match_str(self) -> str:
        """ovs-ofctl style match string."""
        parts = []
        eth_type = self.match.get("eth_type")
        if eth_type == ETH_TYPE_IP:
            parts.append("ip")
        elif eth_type == ETH_TYPE_ARP:
            parts.append("arp")
        for key, label in (
            ("in_port", "in_port"),
            ("eth_src", "dl_src"),
            ("eth_dst", "dl_dst"),
            ("ipv4_src", "nw_src"),
            ("ipv4_dst", "nw_dst"),
        ):
            if key in self.match:
                parts.append(f"{label}={self.match[key]}")
        return ",".join(parts)

    def to_dict(self, now: Optional[float] = None) -> Dict:
        now = now or time.time()
        idle_ref = self.last_hit or self.installed_at
        return {
            "switch": self.switch,
            "dpid": self.dpid,
            "table_id": self.table_id,
            "cookie": self.cookie,
            "priority": self.priority,
            "match": self.match_str(),
            "actions": self.actions,
            "rule_id": self.rule_id,
            "reactive": self.reactive,
            "idle_timeout": self.idle_timeout,
            "idle_age": round(now - idle_ref, 1),
            "duration": round(now - self.installed_at, 3),
            "n_packets": self.n_packets,
            "n_bytes": self.n_bytes,
        }

    def ovs_line(self, now: Optional[float] = None) -> str:
        now = now or time.time()
        idle_ref = self.last_hit or self.installed_at
        fields = [
            f"cookie={hex(self.cookie)}",
            f"duration={now - self.installed_at:.3f}s",
            f"table={self.table_id}",
            f"n_packets={self.n_packets}",
            f"n_bytes={self.n_bytes}",
        ]
        if self.idle_timeout:
            fields.append(f"idle_timeout={self.idle_timeout}")
        fields.append(f"idle_age={int(now - idle_ref)}")
        match = self.match_str()
        prio = f"priority={self.priority}" + (f",{match}" if match else "")
        return " " + ", ".join(fields) + f", {prio} actions={self.actions}"


class CampusSDNSimulator:
    def __init__(self, acl_enforced: bool = True, jitter: bool = True, seed: Optional[int] = None):
        self.lock = threading.RLock()
        self.rng = random.Random(seed)
        self.jitter = jitter
        self.hosts_by_name = {h["name"]: h for h in TOPOLOGY_SPEC["hosts"]}
        self.hosts_by_ip = {h["ip"]: h for h in TOPOLOGY_SPEC["hosts"]}
        self.switches = {s["name"]: s for s in TOPOLOGY_SPEC["switches"]}
        self._listeners: List[Callable[[str, Dict], None]] = []
        self.acl_enforced = acl_enforced
        self._init_state()

    # ------------------------------------------------------------------ setup
    def _init_state(self):
        self.started_at = time.time()
        self.flow_tables: Dict[str, List[FlowEntry]] = {name: [] for name in self.switches}
        self.packet_logs: deque = deque(maxlen=500)
        self.controller_log: deque = deque(maxlen=500)
        self.arp_cache: Dict[str, Dict[str, float]] = {h: {} for h in self.hosts_by_name}
        self._packet_seq = itertools.count(1)
        self._cookie_seq = itertools.count(1)
        self.stats = {
            "probes": 0,
            "permitted": 0,
            "dropped": 0,
            "frames": 0,
            "bytes": 0,
            "packet_ins": 0,
            "flow_mods": 0,
            "flows_expired": 0,
            "by_protocol": {},
        }
        self._log("INFO", "campus_access_controller: instantiating app controller.py of CampusAccessController")
        for name in self.switches:
            self._connect_switch(name)

    def add_listener(self, callback: Callable[[str, Dict], None]):
        self._listeners.append(callback)

    def _emit(self, event: str, payload: Dict):
        for callback in list(self._listeners):
            try:
                callback(event, payload)
            except Exception:  # listener failures must never break the datapath
                pass

    def _log(self, level: str, message: str):
        now = time.time()
        entry = {"ts": now, "level": level, "msg": message}
        self.controller_log.append(entry)
        self._emit("log", entry)

    def _connect_switch(self, name: str):
        sw = self.switches[name]
        self._log("INFO", f"switch {name} connected: dpid={sw['dpid']} OFP_VERSION=0x04 (OpenFlow 1.3)")
        self._install(name, PRIORITY_TABLE_MISS, {}, "CONTROLLER:65535", "TABLE-MISS-000")
        self._install(name, PRIORITY_ARP_CONTROL, {"eth_type": ETH_TYPE_ARP}, "NORMAL", "ACL-ARP-100")
        if self.acl_enforced:
            self._install_acl_drops(name)

    def _install_acl_drops(self, name: str):
        for student_ip in sorted(STUDENT_IPS):
            self._install(
                name, PRIORITY_DROP_STUDENT_ADMIN,
                {"eth_type": ETH_TYPE_IP, "ipv4_src": student_ip, "ipv4_dst": ADMIN_SERVER_IP},
                "drop", "ACL-DENY-200",
            )
            self._install(
                name, PRIORITY_DROP_STUDENT_ADMIN,
                {"eth_type": ETH_TYPE_IP, "ipv4_src": ADMIN_SERVER_IP, "ipv4_dst": student_ip},
                "drop", "ACL-DENY-200",
            )

    def _install(self, sw_name: str, priority: int, match: Dict, actions: str, rule_id: str,
                 idle_timeout: int = 0, reactive: bool = False) -> FlowEntry:
        sw = self.switches[sw_name]
        entry = FlowEntry(
            switch=sw_name, dpid=sw["dpid"], priority=priority, match=dict(match),
            actions=actions, rule_id=rule_id, cookie=next(self._cookie_seq),
            idle_timeout=idle_timeout, reactive=reactive,
        )
        table = self.flow_tables[sw_name]
        table.append(entry)
        table.sort(key=lambda e: e.priority, reverse=True)  # stable: older entries win ties
        self.stats["flow_mods"] += 1
        kind = "reactive" if reactive else "proactive"
        self._log(
            "WARN" if actions == "drop" and reactive else "INFO",
            f"FLOW_MOD add {sw_name} ({kind}) priority={priority}"
            f"{',' + entry.match_str() if entry.match_str() else ''} actions={actions}"
            f"{f' idle_timeout={idle_timeout}' if idle_timeout else ''}",
        )
        return entry

    # --------------------------------------------------------------- topology
    def _port_towards(self, sw_name: str, host_name: str) -> int:
        host = self.hosts_by_name[host_name]
        if host["switch"] == sw_name:
            return host["port"]
        for link in TOPOLOGY_SPEC["inter_switch_links"]:
            ends = {link["node1"]: link["port1"], link["node2"]: link["port2"]}
            if sw_name in ends:
                other = link["node2"] if link["node1"] == sw_name else link["node1"]
                # tree topology: s3 is the core, every other switch hangs off it
                if other == host["switch"] or other == "s3":
                    return ends[sw_name]
        raise ValueError(f"no route from {sw_name} towards {host_name}")

    def _path(self, src: Dict, dst: Dict) -> List[str]:
        if src["switch"] == dst["switch"]:
            return [src["switch"]]
        if "s3" in (src["switch"], dst["switch"]):
            return [src["switch"], dst["switch"]]
        return [src["switch"], "s3", dst["switch"]]

    # --------------------------------------------------------------- datapath
    def _lookup(self, sw_name: str, pkt: Dict) -> FlowEntry:
        for entry in self.flow_tables[sw_name]:
            if entry.matches(pkt):
                return entry
        return self.flow_tables[sw_name][-1]

    def _decide(self, src_ip: str, dst_ip: str, ip_proto: int) -> Dict:
        decision = evaluate_campus_acl(src_ip, dst_ip, ETH_TYPE_IP, ip_proto or 0)
        if not decision["allowed"] and not self.acl_enforced:
            decision = {
                "allowed": True,
                "priority": PRIORITY_L2_SWITCHING,
                "rule_id": "L2-FWD-010",
                "action": "OUTPUT:PORT",
                "reason": f"ACL enforcement disabled: {src_ip} -> {dst_ip} forwarded by L2 switching",
            }
        return decision

    def _packet_in(self, sw_name: str, pkt: Dict, src: Dict, dst: Dict) -> Tuple[FlowEntry, Dict]:
        """Controller side of a table-miss (mirrors controller.py)."""
        self.stats["packet_ins"] += 1
        self._log(
            "DEBUG",
            f"PACKET_IN {sw_name} in_port={pkt['in_port']} {src['mac']} -> {dst['mac']} "
            f"ipv4 {pkt['ipv4_src']} -> {pkt['ipv4_dst']}",
        )
        decision = self._decide(pkt["ipv4_src"], pkt["ipv4_dst"], pkt.get("ip_proto"))
        if not decision["allowed"]:
            self._log("WARN", f"[SDN-DENY] {decision['reason']} on {sw_name}")
            entry = self._install(
                sw_name, decision["priority"],
                {"eth_type": ETH_TYPE_IP, "ipv4_src": pkt["ipv4_src"], "ipv4_dst": pkt["ipv4_dst"]},
                "drop", decision["rule_id"], idle_timeout=IDLE_TIMEOUT_DENY, reactive=True,
            )
        else:
            out_port = self._port_towards(sw_name, dst["name"])
            entry = self._install(
                sw_name, decision["priority"],
                {
                    "in_port": pkt["in_port"],
                    "eth_type": ETH_TYPE_IP,
                    "eth_src": src["mac"],
                    "eth_dst": dst["mac"],
                    "ipv4_src": pkt["ipv4_src"],
                    "ipv4_dst": pkt["ipv4_dst"],
                },
                f"output:{out_port}", decision["rule_id"], idle_timeout=IDLE_TIMEOUT_PERMIT, reactive=True,
            )
        return entry, decision

    def _forward(self, src: Dict, dst: Dict, eth_type: int, ip_proto: Optional[int], nbytes: int, now: float) -> Dict:
        """Walks one frame hop by hop. Returns hops, delivery state and decision."""
        path = self._path(src, dst)
        hops, dropped_at, packet_ins, decision = [], None, 0, None
        for sw_name in path:
            in_port = self._port_towards(sw_name, src["name"])
            pkt = {
                "in_port": in_port,
                "eth_type": eth_type,
                "eth_src": src["mac"],
                "eth_dst": dst["mac"],
                "ipv4_src": src["ip"],
                "ipv4_dst": dst["ip"],
                "ip_proto": ip_proto,
            }
            entry = self._lookup(sw_name, pkt)
            entry.hit(nbytes, now)
            self.stats["frames"] += 1
            self.stats["bytes"] += nbytes
            was_packet_in = False
            if entry.actions.startswith("CONTROLLER"):
                was_packet_in = True
                packet_ins += 1
                entry, hop_decision = self._packet_in(sw_name, pkt, src, dst)
                decision = decision or hop_decision
            hops.append({
                "switch": sw_name,
                "in_port": in_port,
                "priority": entry.priority,
                "rule_id": entry.rule_id,
                "match": entry.match_str(),
                "actions": entry.actions,
                "cookie": entry.cookie,
                "packet_in": was_packet_in,
                "dropped": entry.actions == "drop",
            })
            if entry.actions == "drop":
                dropped_at = sw_name
                break
        return {
            "path": path,
            "hops": hops,
            "delivered": dropped_at is None,
            "dropped_at": dropped_at,
            "packet_ins": packet_ins,
        }

    def _one_way_ms(self, path: List[str]) -> float:
        links = len(path) + 1
        return links * LINK_DELAY_MS + len(path) * SWITCH_PROC_MS

    def _jitter(self) -> float:
        return abs(self.rng.gauss(0.0, 0.06)) if self.jitter else 0.0

    def _resolve_arp(self, src: Dict, dst: Dict, now: float, source: str) -> Optional[Dict]:
        cached = self.arp_cache[src["name"]].get(dst["ip"])
        if cached and cached > now:
            return None
        nbytes = PROTOCOLS["ARP"][2]
        request = self._forward(src, dst, ETH_TYPE_ARP, None, nbytes, now)
        reply = self._forward(dst, src, ETH_TYPE_ARP, None, nbytes, now)
        self.arp_cache[src["name"]][dst["ip"]] = now + ARP_CACHE_TTL
        self.arp_cache[dst["name"]][src["ip"]] = now + ARP_CACHE_TTL
        rtt = 2 * self._one_way_ms(request["path"]) + self._jitter()
        return self._record(
            src, dst, "ARP", None, 0, nbytes, request, reply,
            {"allowed": True, "priority": PRIORITY_ARP_CONTROL, "rule_id": "ACL-ARP-100",
             "reason": f"ARP who-has {dst['ip']} tell {src['ip']} (OUTPUT:NORMAL)"},
            round(rtt, 3), source, now,
        )

    def _record(self, src, dst, proto_name, ip_proto, port, nbytes, request, reply, decision, rtt, source, now) -> Dict:
        allowed = request["delivered"] and (reply is None or reply["delivered"])
        deciding_hop = None
        for hop in request["hops"] + (reply["hops"] if reply else []):
            if hop["dropped"]:
                deciding_hop = hop
                break
        if deciding_hop is None and request["hops"]:
            deciding_hop = request["hops"][0]
        if decision is None:
            decision = self._decide(src["ip"], dst["ip"], ip_proto)
        record = {
            "id": next(self._packet_seq),
            "ts": now,
            "timestamp": time.strftime("%H:%M:%S", time.localtime(now)),
            "source": source,
            "src_host": src["name"],
            "src_ip": src["ip"],
            "src_role": src["role"],
            "dst_host": dst["name"],
            "dst_ip": dst["ip"],
            "dst_role": dst["role"],
            "protocol": proto_name,
            "ip_proto": ip_proto,
            "dst_port": port,
            "bytes": nbytes,
            "path": request["path"],
            "hops": request["hops"],
            "reply_hops": reply["hops"] if reply else [],
            "allowed": allowed,
            "verdict": "PERMIT" if allowed else "DROP",
            "dropped_at": request["dropped_at"] or (reply["dropped_at"] if reply else None),
            "priority": deciding_hop["priority"] if deciding_hop else decision["priority"],
            "rule_id": deciding_hop["rule_id"] if deciding_hop else decision["rule_id"],
            "reason": decision["reason"],
            "packet_ins": request["packet_ins"] + (reply["packet_ins"] if reply else 0),
            "rtt_ms": rtt if allowed else None,
        }
        self.stats["probes"] += 1
        self.stats["permitted" if allowed else "dropped"] += 1
        self.stats["by_protocol"][proto_name] = self.stats["by_protocol"].get(proto_name, 0) + 1
        self.packet_logs.append(record)
        self._emit("packet", record)
        return record

    # ---------------------------------------------------------------- public
    def simulate_packet(self, src_name: str, dst_name: str, protocol: str = "ICMP",
                        dst_port: Optional[int] = None, pkt_bytes: Optional[int] = None,
                        source: str = "manual") -> Dict:
        if src_name not in self.hosts_by_name:
            raise ValueError(f"unknown source host '{src_name}'")
        if dst_name not in self.hosts_by_name:
            raise ValueError(f"unknown destination host '{dst_name}'")
        if src_name == dst_name:
            raise ValueError("source and destination must differ")
        proto_name, ip_proto, port, nbytes, _ = resolve_protocol(protocol, dst_port)
        nbytes = pkt_bytes or nbytes

        with self.lock:
            now = time.time()
            self.expire_flows(now)
            src = self.hosts_by_name[src_name]
            dst = self.hosts_by_name[dst_name]

            if proto_name == "ARP":
                self.arp_cache[src_name].pop(dst["ip"], None)
                return self._resolve_arp(src, dst, now, source)

            self._resolve_arp(src, dst, now, source)
            request = self._forward(src, dst, ETH_TYPE_IP, ip_proto, nbytes, now)
            decision = None
            reply = None
            if request["delivered"]:
                reply = self._forward(dst, src, ETH_TYPE_IP, ip_proto, nbytes, now)

            rtt = None
            if request["delivered"] and reply and reply["delivered"]:
                rtt = (
                    self._one_way_ms(request["path"]) + self._one_way_ms(reply["path"])
                    + (request["packet_ins"] + reply["packet_ins"]) * CONTROLLER_RTT_MS
                    + (0.08 if ip_proto == 6 else 0.0)
                    + self._jitter()
                )
                rtt = round(rtt, 3)
            return self._record(src, dst, proto_name, ip_proto, port, nbytes, request, reply,
                                decision, rtt, source, now)

    def expire_flows(self, now: Optional[float] = None) -> int:
        now = now or time.time()
        removed = 0
        with self.lock:
            for sw_name, table in self.flow_tables.items():
                keep = []
                for entry in table:
                    ref = entry.last_hit or entry.installed_at
                    if entry.reactive and entry.idle_timeout and now - ref >= entry.idle_timeout:
                        removed += 1
                        self._log(
                            "INFO",
                            f"FLOW_REMOVED {sw_name} priority={entry.priority},{entry.match_str()} "
                            f"reason=IDLE_TIMEOUT duration={now - entry.installed_at:.1f}s "
                            f"n_packets={entry.n_packets}",
                        )
                    else:
                        keep.append(entry)
                self.flow_tables[sw_name] = keep
            for cache in self.arp_cache.values():
                for ip in [ip for ip, exp in cache.items() if exp <= now]:
                    del cache[ip]
            self.stats["flows_expired"] += removed
        return removed

    def set_acl_enforced(self, enforced: bool):
        with self.lock:
            if enforced == self.acl_enforced:
                return
            self.acl_enforced = enforced
            student_admin = set()
            for s in STUDENT_IPS:
                student_admin.add((s, ADMIN_SERVER_IP))
                student_admin.add((ADMIN_SERVER_IP, s))
            for sw_name, table in self.flow_tables.items():
                keep = []
                for entry in table:
                    pair = (entry.match.get("ipv4_src"), entry.match.get("ipv4_dst"))
                    if pair in student_admin:
                        self.stats["flow_mods"] += 1
                        self._log("INFO", f"FLOW_MOD delete {sw_name} priority={entry.priority},"
                                          f"{entry.match_str()} actions={entry.actions}")
                    else:
                        keep.append(entry)
                self.flow_tables[sw_name] = keep
            if enforced:
                self._log("INFO", "policy: student -> admin server ACL enabled")
                for sw_name in self.switches:
                    self._install_acl_drops(sw_name)
            else:
                self._log("WARN", "policy: student -> admin server ACL DISABLED (testing mode)")

    def reset(self):
        with self.lock:
            self._init_state()

    def clear_capture(self):
        with self.lock:
            self.packet_logs.clear()

    def flow_tables_dict(self) -> Dict[str, List[Dict]]:
        now = time.time()
        with self.lock:
            return {sw: [e.to_dict(now) for e in table] for sw, table in self.flow_tables.items()}

    def format_ovs_dump(self, switch: Optional[str] = None) -> str:
        now = time.time()
        lines = []
        with self.lock:
            for sw_name in self.switches:
                if switch and sw_name != switch:
                    continue
                sw = self.switches[sw_name]
                lines.append(f"$ ovs-ofctl -O OpenFlow13 dump-flows {sw_name}    # dpid={sw['dpid']} ({sw['role']})")
                lines.append("OFPST_FLOW reply (OF1.3) (xid=0x2):")
                for entry in self.flow_tables[sw_name]:
                    lines.append(entry.ovs_line(now))
                lines.append("")
        return "\n".join(lines)

    def snapshot(self, packets: int = 200, logs: int = 300) -> Dict:
        with self.lock:
            return {
                "topology": TOPOLOGY_SPEC,
                "acl_enforced": self.acl_enforced,
                "started_at": self.started_at,
                "server_time": time.time(),
                "stats": self.stats_dict(),
                "flow_tables": self.flow_tables_dict(),
                "packets": list(self.packet_logs)[-packets:],
                "logs": list(self.controller_log)[-logs:],
            }

    def stats_dict(self) -> Dict:
        with self.lock:
            stats = dict(self.stats)
            stats["by_protocol"] = dict(self.stats["by_protocol"])
            stats["active_flows"] = sum(len(t) for t in self.flow_tables.values())
            stats["switch_packets"] = {
                sw: sum(e.n_packets for e in t) for sw, t in self.flow_tables.items()
            }
            stats["switch_flows"] = {sw: len(t) for sw, t in self.flow_tables.items()}
            return stats
