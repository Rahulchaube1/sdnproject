#!/usr/bin/env python3
"""
Campus Access Control — Ryu OpenFlow 1.3 SDN Controller
=======================================================
Project Team:
  - Rahul Chaube (RA2311003012372)
  - Mayank Shah  (RA2311003012388)
  - Neha Mallik  (RA2311003012393)

Policy Specification:
  1. Student Hosts  : h1 (10.0.0.1), h2 (10.0.0.2)
  2. Faculty Hosts  : h3 (10.0.0.3), h4 (10.0.0.4)
  3. Academic Server: srv_acad  (10.0.0.100) -> Accessible by ALL hosts (Students + Faculty)
  4. Admin Server   : srv_admin (10.0.0.200) -> Accessible ONLY by Faculty (h3, h4);
                                                Student traffic (h1, h2) is DROPPED at ingress.

Usage with Ryu:
  ryu-manager controller.py --ofp-tcp-listen-port 6653
"""

STUDENT_IPS = {"10.0.0.1", "10.0.0.2"}
FACULTY_IPS = {"10.0.0.3", "10.0.0.4"}
ACADEMIC_SERVER_IP = "10.0.0.100"
ADMIN_SERVER_IP = "10.0.0.200"

# Priority Hierarchy in OpenFlow 1.3 Table 0
PRIORITY_DROP_STUDENT_ADMIN = 200
PRIORITY_PERMIT_FACULTY_ADMIN = 150
PRIORITY_PERMIT_ALL_ACADEMIC = 120
PRIORITY_ARP_CONTROL = 100
PRIORITY_L2_SWITCHING = 10
PRIORITY_TABLE_MISS = 0


def evaluate_campus_acl(src_ip: str, dst_ip: str, eth_type: int = 0x0800, ip_proto: int = 1):
    """
    Pure policy decision engine shared between the Ryu controller and standalone verifier.
    Returns a dict with:
      allowed (bool), priority (int), rule_id (str), action (str), reason (str)
    """
    if eth_type == 0x0806:
        return {
            "allowed": True,
            "priority": PRIORITY_ARP_CONTROL,
            "rule_id": "ACL-ARP-100",
            "action": "OUTPUT:NORMAL",
            "reason": "ARP address resolution permitted across campus broadcast domain",
        }

    # Rule 1: Block Students -> Administrative Server (10.0.0.200)
    if (src_ip in STUDENT_IPS and dst_ip == ADMIN_SERVER_IP) or (
        src_ip == ADMIN_SERVER_IP and dst_ip in STUDENT_IPS
    ):
        return {
            "allowed": False,
            "priority": PRIORITY_DROP_STUDENT_ADMIN,
            "rule_id": "ACL-DENY-200",
            "action": "DROP (clear-actions)",
            "reason": f"Role Policy Violation: Student host ({src_ip}) is prohibited from accessing Administrative Server ({dst_ip})",
        }

    # Rule 2: Permit Faculty -> Administrative Server (10.0.0.200)
    if (src_ip in FACULTY_IPS and dst_ip == ADMIN_SERVER_IP) or (
        src_ip == ADMIN_SERVER_IP and dst_ip in FACULTY_IPS
    ):
        return {
            "allowed": True,
            "priority": PRIORITY_PERMIT_FACULTY_ADMIN,
            "rule_id": "ACL-PERMIT-150",
            "action": "OUTPUT:PORT",
            "reason": f"Authorized Role: Faculty host ({src_ip}) permitted to access Administrative Server ({dst_ip})",
        }

    # Rule 3: Permit Everyone (Students + Faculty) -> Academic Server (10.0.0.100)
    if dst_ip == ACADEMIC_SERVER_IP or src_ip == ACADEMIC_SERVER_IP:
        return {
            "allowed": True,
            "priority": PRIORITY_PERMIT_ALL_ACADEMIC,
            "rule_id": "ACL-PERMIT-120",
            "action": "OUTPUT:PORT",
            "reason": f"Open Campus Resource: Host ({src_ip}) permitted to access Academic Server ({dst_ip})",
        }

    # Rule 4: Standard L2 peer-to-peer switching between user hosts
    return {
        "allowed": True,
        "priority": PRIORITY_L2_SWITCHING,
        "rule_id": "L2-FWD-010",
        "action": "OUTPUT:PORT",
        "reason": f"Standard L2 campus switching ({src_ip} -> {dst_ip})",
    }


# Ryu Controller Integration (loads cleanly when ryu is installed)
try:
    from ryu.base import app_manager
    from ryu.controller import ofp_event
    from ryu.controller.handler import CONFIG_DISPATCHER, MAIN_DISPATCHER, set_ev_cls
    from ryu.ofproto import ofproto_v1_3
    from ryu.lib.packet import packet, ethernet, ipv4, arp, ether_types

    class CampusAccessController(app_manager.RyuApp):
        OFP_VERSIONS = [ofproto_v1_3.OFP_VERSION]

        def __init__(self, *args, **kwargs):
            super(CampusAccessController, self).__init__(*args, **kwargs)
            self.mac_to_port = {}
            self.security_events = []

        def add_flow(self, datapath, priority, match, actions, idle_timeout=0, hard_timeout=0):
            ofproto = datapath.ofproto
            parser = datapath.ofproto_parser
            inst = [parser.OFPInstructionActions(ofproto.OFPIT_APPLY_ACTIONS, actions)]
            mod = parser.OFPFlowMod(
                datapath=datapath,
                priority=priority,
                idle_timeout=idle_timeout,
                hard_timeout=hard_timeout,
                match=match,
                instructions=inst,
            )
            datapath.send_msg(mod)

        @set_ev_cls(ofp_event.EventOFPSwitchFeatures, CONFIG_DISPATCHER)
        def switch_features_handler(self, ev):
            datapath = ev.msg.datapath
            ofproto = datapath.ofproto
            parser = datapath.ofproto_parser
            dpid = datapath.id
            self.mac_to_port.setdefault(dpid, {})

            self.logger.info("[SDN-CTRL] Switch s%d (DPID=%016x) connected via OpenFlow 1.3", dpid, dpid)

            # 1. Install Table-Miss Flow Entry (Priority 0 -> Send to Controller)
            match_miss = parser.OFPMatch()
            actions_miss = [parser.OFPActionOutput(ofproto.OFPP_CONTROLLER, ofproto.OFPCML_NO_BUFFER)]
            self.add_flow(datapath, PRIORITY_TABLE_MISS, match_miss, actions_miss)

            # 2. Proactively Install ARP handling (Priority 100 -> NORMAL)
            match_arp = parser.OFPMatch(eth_type=ether_types.ETH_TYPE_ARP)
            self.add_flow(datapath, PRIORITY_ARP_CONTROL, match_arp, [parser.OFPActionOutput(ofproto.OFPP_NORMAL)])

            # 3. Proactively Install Student <-> Admin Server DROP Rules (Priority 200, both directions)
            for student_ip in sorted(STUDENT_IPS):
                for src_ip, dst_ip in ((student_ip, ADMIN_SERVER_IP), (ADMIN_SERVER_IP, student_ip)):
                    match_drop = parser.OFPMatch(
                        eth_type=ether_types.ETH_TYPE_IP,
                        ipv4_src=src_ip,
                        ipv4_dst=dst_ip,
                    )
                    # Empty action list = DROP in OpenFlow 1.3
                    self.add_flow(datapath, PRIORITY_DROP_STUDENT_ADMIN, match_drop, [])
                    self.logger.info(
                        "[SDN-ACL] Installed proactive DROP on s%d: ipv4_src=%s -> ipv4_dst=%s (priority=%d)",
                        dpid, src_ip, dst_ip, PRIORITY_DROP_STUDENT_ADMIN
                    )

        @set_ev_cls(ofp_event.EventOFPPacketIn, MAIN_DISPATCHER)
        def _packet_in_handler(self, ev):
            msg = ev.msg
            datapath = msg.datapath
            ofproto = datapath.ofproto
            parser = datapath.ofproto_parser
            in_port = msg.match["in_port"]
            dpid = datapath.id

            pkt = packet.Packet(msg.data)
            eth = pkt.get_protocols(ethernet.ethernet)[0]

            if eth.ethertype == ether_types.ETH_TYPE_LLDP:
                return

            src_mac = eth.src
            dst_mac = eth.dst
            self.mac_to_port.setdefault(dpid, {})
            self.mac_to_port[dpid][src_mac] = in_port

            out_port = self.mac_to_port[dpid].get(dst_mac, ofproto.OFPP_FLOOD)
            actions = [parser.OFPActionOutput(out_port)]

            ip_pkt = pkt.get_protocol(ipv4.ipv4)
            if ip_pkt:
                decision = evaluate_campus_acl(ip_pkt.src, ip_pkt.dst, eth.ethertype, ip_pkt.proto)
                if not decision["allowed"]:
                    self.logger.warning("[SDN-DENY] %s on s%d", decision["reason"], dpid)
                    match_block = parser.OFPMatch(
                        eth_type=ether_types.ETH_TYPE_IP,
                        ipv4_src=ip_pkt.src,
                        ipv4_dst=ip_pkt.dst,
                    )
                    self.add_flow(datapath, decision["priority"], match_block, [], idle_timeout=120)
                    return

                if out_port != ofproto.OFPP_FLOOD:
                    match_ip = parser.OFPMatch(
                        in_port=in_port,
                        eth_type=ether_types.ETH_TYPE_IP,
                        eth_src=src_mac,
                        eth_dst=dst_mac,
                        ipv4_src=ip_pkt.src,
                        ipv4_dst=ip_pkt.dst,
                    )
                    self.add_flow(datapath, decision["priority"], match_ip, actions, idle_timeout=60)

            elif out_port != ofproto.OFPP_FLOOD:
                match_l2 = parser.OFPMatch(in_port=in_port, eth_src=src_mac, eth_dst=dst_mac)
                self.add_flow(datapath, PRIORITY_L2_SWITCHING, match_l2, actions, idle_timeout=60)

            data = msg.data if msg.buffer_id == ofproto.OFP_NO_BUFFER else None
            out = parser.OFPPacketOut(
                datapath=datapath,
                buffer_id=msg.buffer_id,
                in_port=in_port,
                actions=actions,
                data=data,
            )
            datapath.send_msg(out)

except ImportError:
    pass
