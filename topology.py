#!/usr/bin/env python3
"""
Campus Access Control — Mininet Custom Network Topology (OpenFlow 1.3)
======================================================================
Project Team:
  - Rahul Chaube (RA2311003012372)
  - Mayank Shah  (RA2311003012388)
  - Neha Mallik  (RA2311003012393)

Topology Architecture:
  - 3 OpenFlow 1.3 Switches:
      s1 (dpid=0000000000000001): Student Access Switch
      s2 (dpid=0000000000000002): Faculty Access Switch
      s3 (dpid=0000000000000003): Core & Server Aggregation Switch
  - 4 User Hosts:
      h1 (Student 1) : 10.0.0.1/24   | MAC 00:00:00:00:00:01 -> s1-eth1
      h2 (Student 2) : 10.0.0.2/24   | MAC 00:00:00:00:00:02 -> s1-eth2
      h3 (Faculty 1) : 10.0.0.3/24   | MAC 00:00:00:00:00:03 -> s2-eth1
      h4 (Faculty 2) : 10.0.0.4/24   | MAC 00:00:00:00:00:04 -> s2-eth2
  - 2 Server Hosts:
      srv_acad  (Academic Server)       : 10.0.0.100/24 | MAC 00:00:00:00:01:00 -> s3-eth1
      srv_admin (Administrative Server) : 10.0.0.200/24 | MAC 00:00:00:00:02:00 -> s3-eth2
  - 1 Remote SDN Controller:
      c0 (Ryu OpenFlow 1.3 Controller)  : 127.0.0.1:6653
"""

import argparse
import sys
import time

TOPOLOGY_SPEC = {
    "controller": {"name": "c0", "ip": "127.0.0.1", "port": 6653, "protocol": "OpenFlow 1.3"},
    "switches": [
        {"name": "s1", "dpid": "0000000000000001", "role": "Student Wing Access Switch"},
        {"name": "s2", "dpid": "0000000000000002", "role": "Faculty Wing Access Switch"},
        {"name": "s3", "dpid": "0000000000000003", "role": "Campus Core & Server Switch"},
    ],
    "hosts": [
        {"name": "h1", "role": "student", "label": "Student Host 1", "ip": "10.0.0.1", "cidr": "10.0.0.1/24", "mac": "00:00:00:00:00:01", "switch": "s1", "port": 1},
        {"name": "h2", "role": "student", "label": "Student Host 2", "ip": "10.0.0.2", "cidr": "10.0.0.2/24", "mac": "00:00:00:00:00:02", "switch": "s1", "port": 2},
        {"name": "h3", "role": "faculty", "label": "Faculty Host 1", "ip": "10.0.0.3", "cidr": "10.0.0.3/24", "mac": "00:00:00:00:00:03", "switch": "s2", "port": 1},
        {"name": "h4", "role": "faculty", "label": "Faculty Host 2", "ip": "10.0.0.4", "cidr": "10.0.0.4/24", "mac": "00:00:00:00:00:04", "switch": "s2", "port": 2},
        {"name": "srv_acad", "role": "academic_server", "label": "Academic Server", "ip": "10.0.0.100", "cidr": "10.0.0.100/24", "mac": "00:00:00:00:01:00", "switch": "s3", "port": 1},
        {"name": "srv_admin", "role": "admin_server", "label": "Administrative Server", "ip": "10.0.0.200", "cidr": "10.0.0.200/24", "mac": "00:00:00:00:02:00", "switch": "s3", "port": 2},
    ],
    "inter_switch_links": [
        {"node1": "s1", "port1": 3, "node2": "s3", "port2": 3, "bw_mbps": 100, "delay": "1ms"},
        {"node1": "s2", "port1": 3, "node2": "s3", "port2": 4, "bw_mbps": 100, "delay": "1ms"},
    ],
}


def build_mininet_network(controller_ip="127.0.0.1", controller_port=6653, start_cli=False):
    """Instantiates the Campus Access Control topology in Mininet with OpenFlow 1.3 OVS switches."""
    try:
        from mininet.net import Mininet
        from mininet.node import RemoteController, OVSKernelSwitch
        from mininet.link import TCLink
        from mininet.cli import CLI
        from mininet.log import setLogLevel, info
    except ImportError:
        print("[INFO] Mininet kernel package not detected in current environment.")
        print("[INFO] Falling back to standalone OpenFlow 1.3 Datapath Simulator (`verify_policy.py`).")
        from verify_policy import main as run_standalone_verifier
        run_standalone_verifier()
        return

    setLogLevel("info")
    info("*** Initializing Campus Access Control SDN Network (OpenFlow 1.3)\n")
    net = Mininet(controller=RemoteController, switch=OVSKernelSwitch, link=TCLink, autoSetMacs=False)

    info(f"*** Adding Remote SDN Controller c0 ({controller_ip}:{controller_port})\n")
    c0 = net.addController("c0", controller=RemoteController, ip=controller_ip, port=controller_port)

    info("*** Adding 3 OpenFlow 1.3 Switches (s1, s2, s3)\n")
    switches = {}
    for sw in TOPOLOGY_SPEC["switches"]:
        switches[sw["name"]] = net.addSwitch(sw["name"], dpid=sw["dpid"], protocols="OpenFlow13")

    info("*** Adding 4 User Hosts (h1, h2 Students; h3, h4 Faculty) and 2 Servers (srv_acad, srv_admin)\n")
    hosts = {}
    for h in TOPOLOGY_SPEC["hosts"]:
        hosts[h["name"]] = net.addHost(h["name"], ip=h["cidr"], mac=h["mac"])
        net.addLink(hosts[h["name"]], switches[h["switch"]], port1=0, port2=h["port"], bw=100, delay="1ms")

    info("*** Creating Inter-Switch Trunk Links (s1<->s3, s2<->s3)\n")
    for link in TOPOLOGY_SPEC["inter_switch_links"]:
        net.addLink(
            switches[link["node1"]],
            switches[link["node2"]],
            port1=link["port1"],
            port2=link["port2"],
            bw=link["bw_mbps"],
            delay=link["delay"],
        )

    info("*** Starting Network and Waiting for OpenFlow 1.3 Handshake\n")
    net.build()
    c0.start()
    for sw in switches.values():
        sw.start([c0])

    time.sleep(2.0)

    info("*** Starting HTTP Daemon on Academic Server (10.0.0.100:80) and Admin Server (10.0.0.200:80)\n")
    hosts["srv_acad"].cmd("python3 -m http.server 80 >/tmp/srv_acad.log 2>&1 &")
    hosts["srv_admin"].cmd("python3 -m http.server 80 >/tmp/srv_admin.log 2>&1 &")
    time.sleep(0.5)

    info("\n*** Executing Automated Campus Access Control Policy Verification\n")
    verify_mininet_policy(net, hosts)

    if start_cli:
        info("\n*** Launching Interactive Mininet CLI (type 'exit' to tear down)\n")
        CLI(net)

    info("*** Stopping Campus Access Control Network\n")
    net.stop()


def verify_mininet_policy(net, hosts):
    """Verifies ICMP and HTTP connectivity against the Campus Access Control matrix."""
    test_cases = [
        ("h1", "srv_acad", "ICMP", True, "Student 1 -> Academic Server (Allowed)"),
        ("h2", "srv_acad", "ICMP", True, "Student 2 -> Academic Server (Allowed)"),
        ("h3", "srv_acad", "ICMP", True, "Faculty 1 -> Academic Server (Allowed)"),
        ("h4", "srv_acad", "ICMP", True, "Faculty 2 -> Academic Server (Allowed)"),
        ("h1", "srv_admin", "ICMP", False, "Student 1 -> Administrative Server (Blocked by SDN ACL)"),
        ("h2", "srv_admin", "ICMP", False, "Student 2 -> Administrative Server (Blocked by SDN ACL)"),
        ("h3", "srv_admin", "ICMP", True, "Faculty 1 -> Administrative Server (Allowed)"),
        ("h4", "srv_admin", "ICMP", True, "Faculty 2 -> Administrative Server (Allowed)"),
        ("h1", "srv_acad", "HTTP", True, "Student 1 -> Academic Server HTTP GET :80 (Allowed)"),
        ("h1", "srv_admin", "HTTP", False, "Student 1 -> Administrative Server HTTP GET :80 (Blocked)"),
        ("h3", "srv_admin", "HTTP", True, "Faculty 1 -> Administrative Server HTTP GET :80 (Allowed)"),
    ]

    passed = 0
    for src_name, dst_name, proto, expected_allow, desc in test_cases:
        src = hosts[src_name]
        dst = hosts[dst_name]
        if proto == "ICMP":
            out = src.cmd(f"ping -c 1 -W 1 {dst.IP()}")
            actual_allow = " 0% packet loss" in out
        else:
            out = src.cmd(f"curl -s -o /dev/null -w '%{{http_code}}' --connect-timeout 1 http://{dst.IP()}:80/")
            actual_allow = "200" in out

        ok = actual_allow == expected_allow
        if ok:
            passed += 1
        status = "PASS" if ok else "FAIL"
        verdict = "PERMITTED" if actual_allow else "DROPPED"
        print(f"  [{status}] {desc:<58} | Verdict: {verdict}")

    print(f"\n*** Policy Verification Summary: {passed}/{len(test_cases)} Tests Passed ***")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Campus Access Control Mininet Topology")
    parser.add_argument("--controller-ip", default="127.0.0.1", help="SDN Controller IP")
    parser.add_argument("--controller-port", type=int, default=6653, help="SDN Controller Port")
    parser.add_argument("--cli", action="store_true", help="Drop into interactive Mininet CLI after tests")
    args = parser.parse_args()
    build_mininet_network(args.controller_ip, args.controller_port, args.cli)
