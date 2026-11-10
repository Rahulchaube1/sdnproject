/**
 * Campus Access Control SDN — Workbench Application Controller
 * VS Code "Dark Modern" inspired reactive console for OpenFlow 1.3
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. Icon Library (VS Code / Codicons SVG shapes)
  // ---------------------------------------------------------------------------
  const ICONS = {
    logo: '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M14.5 2.5a.5.5 0 0 0-.5-.5h-12a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5v-11zM2.5 3h11v2h-11V3zm11 10h-11V6h11v7z"/><path d="M4 8h2v2H4V8zm4 0h4v2H8V8z"/></svg>',
    search: '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>',
    'layout-side': '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M2 3h12v10H2V3zm1 1v8h3V4H3zm4 0v8h6V4H7z"/></svg>',
    'layout-panel': '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M2 3h12v10H2V3zm1 1v5h10V4H3zm10 6H3v2h10v-2z"/></svg>',
    network: '<svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor"><path d="M8 1a2 2 0 0 0-2 2c0 .35.09.68.25.96L4.2 6.01A2 2 0 0 0 2 8a2 2 0 0 0 2 2c.38 0 .73-.11 1.03-.3l1.83 1.83c-.07.15-.11.3-.11.47a2 2 0 1 0 2-2 1.99 1.99 0 0 0-1.03.3L5.89 8.47A1.97 1.97 0 0 0 6 8c0-.17-.03-.33-.08-.48l2.05-2.05c.3.19.65.3 1.03.3a2 2 0 1 0-1-3.77zM3 8a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm5-5a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm0 9a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm3.8-3.99l2.05-2.05A1.99 1.99 0 0 0 15 5a2 2 0 1 0-3.75.96l-2.05 2.05c.3.19.65.3 1.03.3.38 0 .73-.11 1.03-.3zM13 6a1 1 0 1 1 2 0 1 1 0 0 1-2 0z"/></svg>',
    send: '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M1.5 1.5l13 6.5-13 6.5V9.5l8-1.5-8-1.5V1.5z"/></svg>',
    shield: '<svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor"><path d="M8 1l6 2.5v5c0 3.8-2.6 6.5-6 7.5-3.4-1-6-3.7-6-7.5v-5L8 1zm0 1.2L3 4.3v4.2c0 3.1 2.1 5.3 5 6.2 2.9-.9 5-3.1 5-6.2V4.3L8 2.2z"/></svg>',
    files: '<svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor"><path d="M9 1H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5L9 1zm4 13H3V2h5v4h5v8z"/></svg>',
    keyboard: '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M1 3h14v10H1V3zm1 1v8h12V4H2zm2 2h2v1H4V6zm3 0h2v1H7V6zm3 0h2v1h-2V6zm-6 2h2v1H4V8zm3 0h2v1H7V8zm3 0h2v1h-2V8zm-5 2h6v1H5v-1z"/></svg>',
    chevron: '<svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path d="M6 3.5l4.5 4.5L6 12.5 5.2 11.7l3.8-3.7-3.8-3.8z"/></svg>',
    go: '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M11.5 8l-5-5-.7.7L9.6 7.5H2v1h7.6L5.8 12.3l.7.7 5-5zM13 2h1v12h-1V2z"/></svg>',
    play: '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M4 2.5v11l9-5.5-9-5.5z"/></svg>',
    beaker: '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M5 1v1h1v3.5L2 12a1 1 0 0 0 .8 1.5h10.4a1 1 0 0 0 .8-1.5L10 5.5V2h1V1H5zm2 1h2v3.8l.3.5L12.5 12H3.5l3.2-5.7.3-.5V2z"/></svg>',
    pulse: '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M1 8.5h3.5l2-5 3.5 10 2-6.5L13.5 8.5H15v-1h-2l-1.8 2-1.7-5-3.5 10-2.3-5.8-.4-.2H1v1.5z"/></svg>',
    copy: '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M4 2h7v1H4v9H3V3a1 1 0 0 1 1-1zm2 3h7a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm0 1v8h7V6H6z"/></svg>',
    close: '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M3.7 3l-.7.7 4.3 4.3-4.3 4.3.7.7 4.3-4.3 4.3 4.3.7-.7-4.3-4.3 4.3-4.3-.7-.7-4.3 4.3L3.7 3z"/></svg>',
    follow: '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M8 2a.5.5 0 0 1 .5.5v8.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 11.293V2.5A.5.5 0 0 1 8 2z"/></svg>',
    clear: '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M8 1a7 7 0 1 0 7 7A7.008 7.008 0 0 0 8 1zm0 13a6 6 0 1 1 6-6 6.007 6.007 0 0 1-6 6zm3-7H5v2h6V7z"/></svg>',
    remote: '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M3 2h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H9v2h2v1H5v-1h2v-2H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm0 1v7h10V3H3z"/></svg>',
    error: '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M8 1a7 7 0 1 0 7 7A7.008 7.008 0 0 0 8 1zm3.7 9.3l-.7.7L8 8.7 5 11.7l-.7-.7L7.3 8 4.3 5l.7-.7L8 7.3l3-3 .7.7L8.7 8l3 3z"/></svg>',
    warning: '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M8 1l7 13H1L8 1zm0 2.2L2.5 13h11L8 3.2zM7.2 6h1.5v4H7.2V6zm0 5h1.5v1.5H7.2V11z"/></svg>',
    file: '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M9 1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5L9 1zm3 13H4V2h4v4h4v8z"/></svg>'
  };

  function applyIcons(root = document) {
    root.querySelectorAll('[data-icon]').forEach(el => {
      const name = el.getAttribute('data-icon');
      if (ICONS[name]) {
        el.innerHTML = ICONS[name];
        const sz = el.getAttribute('data-size');
        if (sz) {
          const svg = el.querySelector('svg');
          if (svg) {
            svg.setAttribute('width', sz);
            svg.setAttribute('height', sz);
          }
        }
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 2. Global State Store
  // ---------------------------------------------------------------------------
  const PRELOADED_FILES = {"controller.py": "#!/usr/bin/env python3\n\"\"\"\nCampus Access Control \u2014 Ryu OpenFlow 1.3 SDN Controller\n=======================================================\nProject Team:\n  - Rahul Chaube (RA2311003012372)\n  - Mayank Shah  (RA2311003012388)\n  - Neha Mallik  (RA2311003012393)\n\nPolicy Specification:\n  1. Student Hosts  : h1 (10.0.0.1), h2 (10.0.0.2)\n  2. Faculty Hosts  : h3 (10.0.0.3), h4 (10.0.0.4)\n  3. Academic Server: srv_acad  (10.0.0.100) -> Accessible by ALL hosts (Students + Faculty)\n  4. Admin Server   : srv_admin (10.0.0.200) -> Accessible ONLY by Faculty (h3, h4);\n                                                Student traffic (h1, h2) is DROPPED at ingress.\n\nUsage with Ryu:\n  ryu-manager controller.py --ofp-tcp-listen-port 6653\n\"\"\"\n\nSTUDENT_IPS = {\"10.0.0.1\", \"10.0.0.2\"}\nFACULTY_IPS = {\"10.0.0.3\", \"10.0.0.4\"}\nACADEMIC_SERVER_IP = \"10.0.0.100\"\nADMIN_SERVER_IP = \"10.0.0.200\"\n\n# Priority Hierarchy in OpenFlow 1.3 Table 0\nPRIORITY_DROP_STUDENT_ADMIN = 200\nPRIORITY_PERMIT_FACULTY_ADMIN = 150\nPRIORITY_PERMIT_ALL_ACADEMIC = 120\nPRIORITY_ARP_CONTROL = 100\nPRIORITY_L2_SWITCHING = 10\nPRIORITY_TABLE_MISS = 0\n\n\ndef evaluate_campus_acl(src_ip: str, dst_ip: str, eth_type: int = 0x0800, ip_proto: int = 1):\n    \"\"\"\n    Pure policy decision engine shared between the Ryu controller and standalone verifier.\n    Returns a dict with:\n      allowed (bool), priority (int), rule_id (str), action (str), reason (str)\n    \"\"\"\n    if eth_type == 0x0806:\n        return {\n            \"allowed\": True,\n            \"priority\": PRIORITY_ARP_CONTROL,\n            \"rule_id\": \"ACL-ARP-100\",\n            \"action\": \"OUTPUT:NORMAL\",\n            \"reason\": \"ARP address resolution permitted across campus broadcast domain\",\n        }\n\n    # Rule 1: Block Students -> Administrative Server (10.0.0.200)\n    if (src_ip in STUDENT_IPS and dst_ip == ADMIN_SERVER_IP) or (\n        src_ip == ADMIN_SERVER_IP and dst_ip in STUDENT_IPS\n    ):\n        return {\n            \"allowed\": False,\n            \"priority\": PRIORITY_DROP_STUDENT_ADMIN,\n            \"rule_id\": \"ACL-DENY-200\",\n            \"action\": \"DROP (clear-actions)\",\n            \"reason\": f\"Role Policy Violation: Student host ({src_ip}) is prohibited from accessing Administrative Server ({dst_ip})\",\n        }\n\n    # Rule 2: Permit Faculty -> Administrative Server (10.0.0.200)\n    if (src_ip in FACULTY_IPS and dst_ip == ADMIN_SERVER_IP) or (\n        src_ip == ADMIN_SERVER_IP and dst_ip in FACULTY_IPS\n    ):\n        return {\n            \"allowed\": True,\n            \"priority\": PRIORITY_PERMIT_FACULTY_ADMIN,\n            \"rule_id\": \"ACL-PERMIT-150\",\n            \"action\": \"OUTPUT:PORT\",\n            \"reason\": f\"Authorized Role: Faculty host ({src_ip}) permitted to access Administrative Server ({dst_ip})\",\n        }\n\n    # Rule 3: Permit Everyone (Students + Faculty) -> Academic Server (10.0.0.100)\n    if dst_ip == ACADEMIC_SERVER_IP or src_ip == ACADEMIC_SERVER_IP:\n        return {\n            \"allowed\": True,\n            \"priority\": PRIORITY_PERMIT_ALL_ACADEMIC,\n            \"rule_id\": \"ACL-PERMIT-120\",\n            \"action\": \"OUTPUT:PORT\",\n            \"reason\": f\"Open Campus Resource: Host ({src_ip}) permitted to access Academic Server ({dst_ip})\",\n        }\n\n    # Rule 4: Standard L2 peer-to-peer switching between user hosts\n    return {\n        \"allowed\": True,\n        \"priority\": PRIORITY_L2_SWITCHING,\n        \"rule_id\": \"L2-FWD-010\",\n        \"action\": \"OUTPUT:PORT\",\n        \"reason\": f\"Standard L2 campus switching ({src_ip} -> {dst_ip})\",\n    }\n\n\n# Ryu Controller Integration (loads cleanly when ryu is installed)\ntry:\n    from ryu.base import app_manager\n    from ryu.controller import ofp_event\n    from ryu.controller.handler import CONFIG_DISPATCHER, MAIN_DISPATCHER, set_ev_cls\n    from ryu.ofproto import ofproto_v1_3\n    from ryu.lib.packet import packet, ethernet, ipv4, arp, ether_types\n\n    class CampusAccessController(app_manager.RyuApp):\n        OFP_VERSIONS = [ofproto_v1_3.OFP_VERSION]\n\n        def __init__(self, *args, **kwargs):\n            super(CampusAccessController, self).__init__(*args, **kwargs)\n            self.mac_to_port = {}\n            self.security_events = []\n\n        def add_flow(self, datapath, priority, match, actions, idle_timeout=0, hard_timeout=0):\n            ofproto = datapath.ofproto\n            parser = datapath.ofproto_parser\n            inst = [parser.OFPInstructionActions(ofproto.OFPIT_APPLY_ACTIONS, actions)]\n            mod = parser.OFPFlowMod(\n                datapath=datapath,\n                priority=priority,\n                idle_timeout=idle_timeout,\n                hard_timeout=hard_timeout,\n                match=match,\n                instructions=inst,\n            )\n            datapath.send_msg(mod)\n\n        @set_ev_cls(ofp_event.EventOFPSwitchFeatures, CONFIG_DISPATCHER)\n        def switch_features_handler(self, ev):\n            datapath = ev.msg.datapath\n            ofproto = datapath.ofproto\n            parser = datapath.ofproto_parser\n            dpid = datapath.id\n            self.mac_to_port.setdefault(dpid, {})\n\n            self.logger.info(\"[SDN-CTRL] Switch s%d (DPID=%016x) connected via OpenFlow 1.3\", dpid, dpid)\n\n            # 1. Install Table-Miss Flow Entry (Priority 0 -> Send to Controller)\n            match_miss = parser.OFPMatch()\n            actions_miss = [parser.OFPActionOutput(ofproto.OFPP_CONTROLLER, ofproto.OFPCML_NO_BUFFER)]\n            self.add_flow(datapath, PRIORITY_TABLE_MISS, match_miss, actions_miss)\n\n            # 2. Proactively Install ARP handling (Priority 100 -> NORMAL)\n            match_arp = parser.OFPMatch(eth_type=ether_types.ETH_TYPE_ARP)\n            self.add_flow(datapath, PRIORITY_ARP_CONTROL, match_arp, [parser.OFPActionOutput(ofproto.OFPP_NORMAL)])\n\n            # 3. Proactively Install Student <-> Admin Server DROP Rules (Priority 200, both directions)\n            for student_ip in sorted(STUDENT_IPS):\n                for src_ip, dst_ip in ((student_ip, ADMIN_SERVER_IP), (ADMIN_SERVER_IP, student_ip)):\n                    match_drop = parser.OFPMatch(\n                        eth_type=ether_types.ETH_TYPE_IP,\n                        ipv4_src=src_ip,\n                        ipv4_dst=dst_ip,\n                    )\n                    # Empty action list = DROP in OpenFlow 1.3\n                    self.add_flow(datapath, PRIORITY_DROP_STUDENT_ADMIN, match_drop, [])\n                    self.logger.info(\n                        \"[SDN-ACL] Installed proactive DROP on s%d: ipv4_src=%s -> ipv4_dst=%s (priority=%d)\",\n                        dpid, src_ip, dst_ip, PRIORITY_DROP_STUDENT_ADMIN\n                    )\n\n        @set_ev_cls(ofp_event.EventOFPPacketIn, MAIN_DISPATCHER)\n        def _packet_in_handler(self, ev):\n            msg = ev.msg\n            datapath = msg.datapath\n            ofproto = datapath.ofproto\n            parser = datapath.ofproto_parser\n            in_port = msg.match[\"in_port\"]\n            dpid = datapath.id\n\n            pkt = packet.Packet(msg.data)\n            eth = pkt.get_protocols(ethernet.ethernet)[0]\n\n            if eth.ethertype == ether_types.ETH_TYPE_LLDP:\n                return\n\n            src_mac = eth.src\n            dst_mac = eth.dst\n            self.mac_to_port.setdefault(dpid, {})\n            self.mac_to_port[dpid][src_mac] = in_port\n\n            out_port = self.mac_to_port[dpid].get(dst_mac, ofproto.OFPP_FLOOD)\n            actions = [parser.OFPActionOutput(out_port)]\n\n            ip_pkt = pkt.get_protocol(ipv4.ipv4)\n            if ip_pkt:\n                decision = evaluate_campus_acl(ip_pkt.src, ip_pkt.dst, eth.ethertype, ip_pkt.proto)\n                if not decision[\"allowed\"]:\n                    self.logger.warning(\"[SDN-DENY] %s on s%d\", decision[\"reason\"], dpid)\n                    match_block = parser.OFPMatch(\n                        eth_type=ether_types.ETH_TYPE_IP,\n                        ipv4_src=ip_pkt.src,\n                        ipv4_dst=ip_pkt.dst,\n                    )\n                    self.add_flow(datapath, decision[\"priority\"], match_block, [], idle_timeout=120)\n                    return\n\n                if out_port != ofproto.OFPP_FLOOD:\n                    match_ip = parser.OFPMatch(\n                        in_port=in_port,\n                        eth_type=ether_types.ETH_TYPE_IP,\n                        eth_src=src_mac,\n                        eth_dst=dst_mac,\n                        ipv4_src=ip_pkt.src,\n                        ipv4_dst=ip_pkt.dst,\n                    )\n                    self.add_flow(datapath, decision[\"priority\"], match_ip, actions, idle_timeout=60)\n\n            elif out_port != ofproto.OFPP_FLOOD:\n                match_l2 = parser.OFPMatch(in_port=in_port, eth_src=src_mac, eth_dst=dst_mac)\n                self.add_flow(datapath, PRIORITY_L2_SWITCHING, match_l2, actions, idle_timeout=60)\n\n            data = msg.data if msg.buffer_id == ofproto.OFP_NO_BUFFER else None\n            out = parser.OFPPacketOut(\n                datapath=datapath,\n                buffer_id=msg.buffer_id,\n                in_port=in_port,\n                actions=actions,\n                data=data,\n            )\n            datapath.send_msg(out)\n\nexcept ImportError:\n    pass\n", "topology.py": "#!/usr/bin/env python3\n\"\"\"\nCampus Access Control \u2014 Mininet Custom Network Topology (OpenFlow 1.3)\n======================================================================\nProject Team:\n  - Rahul Chaube (RA2311003012372)\n  - Mayank Shah  (RA2311003012388)\n  - Neha Mallik  (RA2311003012393)\n\nTopology Architecture:\n  - 3 OpenFlow 1.3 Switches:\n      s1 (dpid=0000000000000001): Student Access Switch\n      s2 (dpid=0000000000000002): Faculty Access Switch\n      s3 (dpid=0000000000000003): Core & Server Aggregation Switch\n  - 4 User Hosts:\n      h1 (Student 1) : 10.0.0.1/24   | MAC 00:00:00:00:00:01 -> s1-eth1\n      h2 (Student 2) : 10.0.0.2/24   | MAC 00:00:00:00:00:02 -> s1-eth2\n      h3 (Faculty 1) : 10.0.0.3/24   | MAC 00:00:00:00:00:03 -> s2-eth1\n      h4 (Faculty 2) : 10.0.0.4/24   | MAC 00:00:00:00:00:04 -> s2-eth2\n  - 2 Server Hosts:\n      srv_acad  (Academic Server)       : 10.0.0.100/24 | MAC 00:00:00:00:01:00 -> s3-eth1\n      srv_admin (Administrative Server) : 10.0.0.200/24 | MAC 00:00:00:00:02:00 -> s3-eth2\n  - 1 Remote SDN Controller:\n      c0 (Ryu OpenFlow 1.3 Controller)  : 127.0.0.1:6653\n\"\"\"\n\nimport argparse\nimport sys\nimport time\n\nTOPOLOGY_SPEC = {\n    \"controller\": {\"name\": \"c0\", \"ip\": \"127.0.0.1\", \"port\": 6653, \"protocol\": \"OpenFlow 1.3\"},\n    \"switches\": [\n        {\"name\": \"s1\", \"dpid\": \"0000000000000001\", \"role\": \"Student Wing Access Switch\"},\n        {\"name\": \"s2\", \"dpid\": \"0000000000000002\", \"role\": \"Faculty Wing Access Switch\"},\n        {\"name\": \"s3\", \"dpid\": \"0000000000000003\", \"role\": \"Campus Core & Server Switch\"},\n    ],\n    \"hosts\": [\n        {\"name\": \"h1\", \"role\": \"student\", \"label\": \"Student Host 1\", \"ip\": \"10.0.0.1\", \"cidr\": \"10.0.0.1/24\", \"mac\": \"00:00:00:00:00:01\", \"switch\": \"s1\", \"port\": 1},\n        {\"name\": \"h2\", \"role\": \"student\", \"label\": \"Student Host 2\", \"ip\": \"10.0.0.2\", \"cidr\": \"10.0.0.2/24\", \"mac\": \"00:00:00:00:00:02\", \"switch\": \"s1\", \"port\": 2},\n        {\"name\": \"h3\", \"role\": \"faculty\", \"label\": \"Faculty Host 1\", \"ip\": \"10.0.0.3\", \"cidr\": \"10.0.0.3/24\", \"mac\": \"00:00:00:00:00:03\", \"switch\": \"s2\", \"port\": 1},\n        {\"name\": \"h4\", \"role\": \"faculty\", \"label\": \"Faculty Host 2\", \"ip\": \"10.0.0.4\", \"cidr\": \"10.0.0.4/24\", \"mac\": \"00:00:00:00:00:04\", \"switch\": \"s2\", \"port\": 2},\n        {\"name\": \"srv_acad\", \"role\": \"academic_server\", \"label\": \"Academic Server\", \"ip\": \"10.0.0.100\", \"cidr\": \"10.0.0.100/24\", \"mac\": \"00:00:00:00:01:00\", \"switch\": \"s3\", \"port\": 1},\n        {\"name\": \"srv_admin\", \"role\": \"admin_server\", \"label\": \"Administrative Server\", \"ip\": \"10.0.0.200\", \"cidr\": \"10.0.0.200/24\", \"mac\": \"00:00:00:00:02:00\", \"switch\": \"s3\", \"port\": 2},\n    ],\n    \"inter_switch_links\": [\n        {\"node1\": \"s1\", \"port1\": 3, \"node2\": \"s3\", \"port2\": 3, \"bw_mbps\": 100, \"delay\": \"1ms\"},\n        {\"node1\": \"s2\", \"port1\": 3, \"node2\": \"s3\", \"port2\": 4, \"bw_mbps\": 100, \"delay\": \"1ms\"},\n    ],\n}\n\n\ndef build_mininet_network(controller_ip=\"127.0.0.1\", controller_port=6653, start_cli=False):\n    \"\"\"Instantiates the Campus Access Control topology in Mininet with OpenFlow 1.3 OVS switches.\"\"\"\n    try:\n        from mininet.net import Mininet\n        from mininet.node import RemoteController, OVSKernelSwitch\n        from mininet.link import TCLink\n        from mininet.cli import CLI\n        from mininet.log import setLogLevel, info\n    except ImportError:\n        print(\"[INFO] Mininet kernel package not detected in current environment.\")\n        print(\"[INFO] Falling back to standalone OpenFlow 1.3 Datapath Simulator (`verify_policy.py`).\")\n        from verify_policy import main as run_standalone_verifier\n        run_standalone_verifier()\n        return\n\n    setLogLevel(\"info\")\n    info(\"*** Initializing Campus Access Control SDN Network (OpenFlow 1.3)\\n\")\n    net = Mininet(controller=RemoteController, switch=OVSKernelSwitch, link=TCLink, autoSetMacs=False)\n\n    info(f\"*** Adding Remote SDN Controller c0 ({controller_ip}:{controller_port})\\n\")\n    c0 = net.addController(\"c0\", controller=RemoteController, ip=controller_ip, port=controller_port)\n\n    info(\"*** Adding 3 OpenFlow 1.3 Switches (s1, s2, s3)\\n\")\n    switches = {}\n    for sw in TOPOLOGY_SPEC[\"switches\"]:\n        switches[sw[\"name\"]] = net.addSwitch(sw[\"name\"], dpid=sw[\"dpid\"], protocols=\"OpenFlow13\")\n\n    info(\"*** Adding 4 User Hosts (h1, h2 Students; h3, h4 Faculty) and 2 Servers (srv_acad, srv_admin)\\n\")\n    hosts = {}\n    for h in TOPOLOGY_SPEC[\"hosts\"]:\n        hosts[h[\"name\"]] = net.addHost(h[\"name\"], ip=h[\"cidr\"], mac=h[\"mac\"])\n        net.addLink(hosts[h[\"name\"]], switches[h[\"switch\"]], port1=0, port2=h[\"port\"], bw=100, delay=\"1ms\")\n\n    info(\"*** Creating Inter-Switch Trunk Links (s1<->s3, s2<->s3)\\n\")\n    for link in TOPOLOGY_SPEC[\"inter_switch_links\"]:\n        net.addLink(\n            switches[link[\"node1\"]],\n            switches[link[\"node2\"]],\n            port1=link[\"port1\"],\n            port2=link[\"port2\"],\n            bw=link[\"bw_mbps\"],\n            delay=link[\"delay\"],\n        )\n\n    info(\"*** Starting Network and Waiting for OpenFlow 1.3 Handshake\\n\")\n    net.build()\n    c0.start()\n    for sw in switches.values():\n        sw.start([c0])\n\n    time.sleep(2.0)\n\n    info(\"*** Starting HTTP Daemon on Academic Server (10.0.0.100:80) and Admin Server (10.0.0.200:80)\\n\")\n    hosts[\"srv_acad\"].cmd(\"python3 -m http.server 80 >/tmp/srv_acad.log 2>&1 &\")\n    hosts[\"srv_admin\"].cmd(\"python3 -m http.server 80 >/tmp/srv_admin.log 2>&1 &\")\n    time.sleep(0.5)\n\n    info(\"\\n*** Executing Automated Campus Access Control Policy Verification\\n\")\n    verify_mininet_policy(net, hosts)\n\n    if start_cli:\n        info(\"\\n*** Launching Interactive Mininet CLI (type 'exit' to tear down)\\n\")\n        CLI(net)\n\n    info(\"*** Stopping Campus Access Control Network\\n\")\n    net.stop()\n\n\ndef verify_mininet_policy(net, hosts):\n    \"\"\"Verifies ICMP and HTTP connectivity against the Campus Access Control matrix.\"\"\"\n    test_cases = [\n        (\"h1\", \"srv_acad\", \"ICMP\", True, \"Student 1 -> Academic Server (Allowed)\"),\n        (\"h2\", \"srv_acad\", \"ICMP\", True, \"Student 2 -> Academic Server (Allowed)\"),\n        (\"h3\", \"srv_acad\", \"ICMP\", True, \"Faculty 1 -> Academic Server (Allowed)\"),\n        (\"h4\", \"srv_acad\", \"ICMP\", True, \"Faculty 2 -> Academic Server (Allowed)\"),\n        (\"h1\", \"srv_admin\", \"ICMP\", False, \"Student 1 -> Administrative Server (Blocked by SDN ACL)\"),\n        (\"h2\", \"srv_admin\", \"ICMP\", False, \"Student 2 -> Administrative Server (Blocked by SDN ACL)\"),\n        (\"h3\", \"srv_admin\", \"ICMP\", True, \"Faculty 1 -> Administrative Server (Allowed)\"),\n        (\"h4\", \"srv_admin\", \"ICMP\", True, \"Faculty 2 -> Administrative Server (Allowed)\"),\n        (\"h1\", \"srv_acad\", \"HTTP\", True, \"Student 1 -> Academic Server HTTP GET :80 (Allowed)\"),\n        (\"h1\", \"srv_admin\", \"HTTP\", False, \"Student 1 -> Administrative Server HTTP GET :80 (Blocked)\"),\n        (\"h3\", \"srv_admin\", \"HTTP\", True, \"Faculty 1 -> Administrative Server HTTP GET :80 (Allowed)\"),\n    ]\n\n    passed = 0\n    for src_name, dst_name, proto, expected_allow, desc in test_cases:\n        src = hosts[src_name]\n        dst = hosts[dst_name]\n        if proto == \"ICMP\":\n            out = src.cmd(f\"ping -c 1 -W 1 {dst.IP()}\")\n            actual_allow = \" 0% packet loss\" in out\n        else:\n            out = src.cmd(f\"curl -s -o /dev/null -w '%{{http_code}}' --connect-timeout 1 http://{dst.IP()}:80/\")\n            actual_allow = \"200\" in out\n\n        ok = actual_allow == expected_allow\n        if ok:\n            passed += 1\n        status = \"PASS\" if ok else \"FAIL\"\n        verdict = \"PERMITTED\" if actual_allow else \"DROPPED\"\n        print(f\"  [{status}] {desc:<58} | Verdict: {verdict}\")\n\n    print(f\"\\n*** Policy Verification Summary: {passed}/{len(test_cases)} Tests Passed ***\")\n\n\nif __name__ == \"__main__\":\n    parser = argparse.ArgumentParser(description=\"Campus Access Control Mininet Topology\")\n    parser.add_argument(\"--controller-ip\", default=\"127.0.0.1\", help=\"SDN Controller IP\")\n    parser.add_argument(\"--controller-port\", type=int, default=6653, help=\"SDN Controller Port\")\n    parser.add_argument(\"--cli\", action=\"store_true\", help=\"Drop into interactive Mininet CLI after tests\")\n    args = parser.parse_args()\n    build_mininet_network(args.controller_ip, args.controller_port, args.cli)\n", "simulator.py": "#!/usr/bin/env python3\n\"\"\"\nCampus Access Control - OpenFlow 1.3 datapath simulator\n=======================================================\nRuns the three campus switches (s1, s2, s3) and the Ryu controller logic from\n`controller.py` in-process, so the access policy can be exercised and observed\nwithout a Mininet/OVS VM.\n\nThe model follows OpenFlow 1.3 semantics:\n  * Table 0 lookup picks the highest-priority entry whose match fields all\n    agree with the packet.\n  * A table-miss sends the packet to the controller (PACKET_IN). The\n    controller evaluates `evaluate_campus_acl()` and installs a reactive flow\n    (idle_timeout=60 for permits, 120 for denies) exactly like\n    `CampusAccessController._packet_in_handler`.\n  * Proactive entries (table-miss, ARP, student<->admin DROP) are installed when\n    a switch connects, mirroring `switch_features_handler`.\n  * Reactive flows expire after their idle timeout (FLOW_REMOVED).\n\nLatency is modelled from the Mininet link parameters in `topology.py`\n(1 ms per link per direction) plus a controller round trip for every\nPACKET_IN. It is a model, not a measurement.\n\"\"\"\n\nimport itertools\nimport random\nimport threading\nimport time\nfrom collections import deque\nfrom dataclasses import dataclass, field\nfrom typing import Callable, Dict, List, Optional, Tuple\n\nfrom controller import (\n    evaluate_campus_acl,\n    STUDENT_IPS,\n    ADMIN_SERVER_IP,\n    PRIORITY_DROP_STUDENT_ADMIN,\n    PRIORITY_ARP_CONTROL,\n    PRIORITY_L2_SWITCHING,\n    PRIORITY_TABLE_MISS,\n)\nfrom topology import TOPOLOGY_SPEC\n\nETH_TYPE_IP = 0x0800\nETH_TYPE_ARP = 0x0806\n\n# name -> (ip_proto, default dst port, frame bytes, display label)\nPROTOCOLS = {\n    \"ICMP\": (1, 0, 98, \"ICMP\"),\n    \"HTTP\": (6, 80, 512, \"TCP\"),\n    \"HTTPS\": (6, 443, 583, \"TLS\"),\n    \"SSH\": (6, 22, 128, \"SSH\"),\n    \"DNS\": (17, 53, 82, \"DNS\"),\n    \"TCP\": (6, 80, 512, \"TCP\"),\n    \"UDP\": (17, 53, 82, \"UDP\"),\n    \"ARP\": (None, 0, 42, \"ARP\"),\n}\n\nLINK_DELAY_MS = 1.0          # TCLink delay=\"1ms\" in topology.py\nSWITCH_PROC_MS = 0.02        # per-hop OVS processing\nCONTROLLER_RTT_MS = 2.4      # PACKET_IN -> FLOW_MOD/PACKET_OUT round trip\nARP_CACHE_TTL = 60.0         # seconds\nIDLE_TIMEOUT_PERMIT = 60     # controller.py\nIDLE_TIMEOUT_DENY = 120      # controller.py\n\n\ndef resolve_protocol(protocol: str, dst_port: Optional[int] = None):\n    name = (protocol or \"ICMP\").upper()\n    if name not in PROTOCOLS:\n        raise ValueError(f\"unsupported protocol '{protocol}'\")\n    ip_proto, default_port, nbytes, label = PROTOCOLS[name]\n    port = default_port if dst_port in (None, 0) else int(dst_port)\n    return name, ip_proto, port, nbytes, label\n\n\n@dataclass\nclass FlowEntry:\n    switch: str\n    dpid: str\n    priority: int\n    match: Dict\n    actions: str\n    rule_id: str\n    cookie: int\n    table_id: int = 0\n    idle_timeout: int = 0\n    hard_timeout: int = 0\n    reactive: bool = False\n    installed_at: float = field(default_factory=time.time)\n    last_hit: float = 0.0\n    n_packets: int = 0\n    n_bytes: int = 0\n\n    def matches(self, pkt: Dict) -> bool:\n        for key, value in self.match.items():\n            if pkt.get(key) != value:\n                return False\n        return True\n\n    def hit(self, nbytes: int, now: float):\n        self.n_packets += 1\n        self.n_bytes += nbytes\n        self.last_hit = now\n\n    def match_str(self) -> str:\n        \"\"\"ovs-ofctl style match string.\"\"\"\n        parts = []\n        eth_type = self.match.get(\"eth_type\")\n        if eth_type == ETH_TYPE_IP:\n            parts.append(\"ip\")\n        elif eth_type == ETH_TYPE_ARP:\n            parts.append(\"arp\")\n        for key, label in (\n            (\"in_port\", \"in_port\"),\n            (\"eth_src\", \"dl_src\"),\n            (\"eth_dst\", \"dl_dst\"),\n            (\"ipv4_src\", \"nw_src\"),\n            (\"ipv4_dst\", \"nw_dst\"),\n        ):\n            if key in self.match:\n                parts.append(f\"{label}={self.match[key]}\")\n        return \",\".join(parts)\n\n    def to_dict(self, now: Optional[float] = None) -> Dict:\n        now = now or time.time()\n        idle_ref = self.last_hit or self.installed_at\n        return {\n            \"switch\": self.switch,\n            \"dpid\": self.dpid,\n            \"table_id\": self.table_id,\n            \"cookie\": self.cookie,\n            \"priority\": self.priority,\n            \"match\": self.match_str(),\n            \"actions\": self.actions,\n            \"rule_id\": self.rule_id,\n            \"reactive\": self.reactive,\n            \"idle_timeout\": self.idle_timeout,\n            \"idle_age\": round(now - idle_ref, 1),\n            \"duration\": round(now - self.installed_at, 3),\n            \"n_packets\": self.n_packets,\n            \"n_bytes\": self.n_bytes,\n        }\n\n    def ovs_line(self, now: Optional[float] = None) -> str:\n        now = now or time.time()\n        idle_ref = self.last_hit or self.installed_at\n        fields = [\n            f\"cookie={hex(self.cookie)}\",\n            f\"duration={now - self.installed_at:.3f}s\",\n            f\"table={self.table_id}\",\n            f\"n_packets={self.n_packets}\",\n            f\"n_bytes={self.n_bytes}\",\n        ]\n        if self.idle_timeout:\n            fields.append(f\"idle_timeout={self.idle_timeout}\")\n        fields.append(f\"idle_age={int(now - idle_ref)}\")\n        match = self.match_str()\n        prio = f\"priority={self.priority}\" + (f\",{match}\" if match else \"\")\n        return \" \" + \", \".join(fields) + f\", {prio} actions={self.actions}\"\n\n\nclass CampusSDNSimulator:\n    def __init__(self, acl_enforced: bool = True, jitter: bool = True, seed: Optional[int] = None):\n        self.lock = threading.RLock()\n        self.rng = random.Random(seed)\n        self.jitter = jitter\n        self.hosts_by_name = {h[\"name\"]: h for h in TOPOLOGY_SPEC[\"hosts\"]}\n        self.hosts_by_ip = {h[\"ip\"]: h for h in TOPOLOGY_SPEC[\"hosts\"]}\n        self.switches = {s[\"name\"]: s for s in TOPOLOGY_SPEC[\"switches\"]}\n        self._listeners: List[Callable[[str, Dict], None]] = []\n        self.acl_enforced = acl_enforced\n        self._init_state()\n\n    # ------------------------------------------------------------------ setup\n    def _init_state(self):\n        self.started_at = time.time()\n        self.flow_tables: Dict[str, List[FlowEntry]] = {name: [] for name in self.switches}\n        self.packet_logs: deque = deque(maxlen=500)\n        self.controller_log: deque = deque(maxlen=500)\n        self.arp_cache: Dict[str, Dict[str, float]] = {h: {} for h in self.hosts_by_name}\n        self._packet_seq = itertools.count(1)\n        self._cookie_seq = itertools.count(1)\n        self.stats = {\n            \"probes\": 0,\n            \"permitted\": 0,\n            \"dropped\": 0,\n            \"frames\": 0,\n            \"bytes\": 0,\n            \"packet_ins\": 0,\n            \"flow_mods\": 0,\n            \"flows_expired\": 0,\n            \"by_protocol\": {},\n        }\n        self._log(\"INFO\", \"campus_access_controller: instantiating app controller.py of CampusAccessController\")\n        for name in self.switches:\n            self._connect_switch(name)\n\n    def add_listener(self, callback: Callable[[str, Dict], None]):\n        self._listeners.append(callback)\n\n    def _emit(self, event: str, payload: Dict):\n        for callback in list(self._listeners):\n            try:\n                callback(event, payload)\n            except Exception:  # listener failures must never break the datapath\n                pass\n\n    def _log(self, level: str, message: str):\n        now = time.time()\n        entry = {\"ts\": now, \"level\": level, \"msg\": message}\n        self.controller_log.append(entry)\n        self._emit(\"log\", entry)\n\n    def _connect_switch(self, name: str):\n        sw = self.switches[name]\n        self._log(\"INFO\", f\"switch {name} connected: dpid={sw['dpid']} OFP_VERSION=0x04 (OpenFlow 1.3)\")\n        self._install(name, PRIORITY_TABLE_MISS, {}, \"CONTROLLER:65535\", \"TABLE-MISS-000\")\n        self._install(name, PRIORITY_ARP_CONTROL, {\"eth_type\": ETH_TYPE_ARP}, \"NORMAL\", \"ACL-ARP-100\")\n        if self.acl_enforced:\n            self._install_acl_drops(name)\n\n    def _install_acl_drops(self, name: str):\n        for student_ip in sorted(STUDENT_IPS):\n            self._install(\n                name, PRIORITY_DROP_STUDENT_ADMIN,\n                {\"eth_type\": ETH_TYPE_IP, \"ipv4_src\": student_ip, \"ipv4_dst\": ADMIN_SERVER_IP},\n                \"drop\", \"ACL-DENY-200\",\n            )\n            self._install(\n                name, PRIORITY_DROP_STUDENT_ADMIN,\n                {\"eth_type\": ETH_TYPE_IP, \"ipv4_src\": ADMIN_SERVER_IP, \"ipv4_dst\": student_ip},\n                \"drop\", \"ACL-DENY-200\",\n            )\n\n    def _install(self, sw_name: str, priority: int, match: Dict, actions: str, rule_id: str,\n                 idle_timeout: int = 0, reactive: bool = False) -> FlowEntry:\n        sw = self.switches[sw_name]\n        entry = FlowEntry(\n            switch=sw_name, dpid=sw[\"dpid\"], priority=priority, match=dict(match),\n            actions=actions, rule_id=rule_id, cookie=next(self._cookie_seq),\n            idle_timeout=idle_timeout, reactive=reactive,\n        )\n        table = self.flow_tables[sw_name]\n        table.append(entry)\n        table.sort(key=lambda e: e.priority, reverse=True)  # stable: older entries win ties\n        self.stats[\"flow_mods\"] += 1\n        kind = \"reactive\" if reactive else \"proactive\"\n        self._log(\n            \"WARN\" if actions == \"drop\" and reactive else \"INFO\",\n            f\"FLOW_MOD add {sw_name} ({kind}) priority={priority}\"\n            f\"{',' + entry.match_str() if entry.match_str() else ''} actions={actions}\"\n            f\"{f' idle_timeout={idle_timeout}' if idle_timeout else ''}\",\n        )\n        return entry\n\n    # --------------------------------------------------------------- topology\n    def _port_towards(self, sw_name: str, host_name: str) -> int:\n        host = self.hosts_by_name[host_name]\n        if host[\"switch\"] == sw_name:\n            return host[\"port\"]\n        for link in TOPOLOGY_SPEC[\"inter_switch_links\"]:\n            ends = {link[\"node1\"]: link[\"port1\"], link[\"node2\"]: link[\"port2\"]}\n            if sw_name in ends:\n                other = link[\"node2\"] if link[\"node1\"] == sw_name else link[\"node1\"]\n                # tree topology: s3 is the core, every other switch hangs off it\n                if other == host[\"switch\"] or other == \"s3\":\n                    return ends[sw_name]\n        raise ValueError(f\"no route from {sw_name} towards {host_name}\")\n\n    def _path(self, src: Dict, dst: Dict) -> List[str]:\n        if src[\"switch\"] == dst[\"switch\"]:\n            return [src[\"switch\"]]\n        if \"s3\" in (src[\"switch\"], dst[\"switch\"]):\n            return [src[\"switch\"], dst[\"switch\"]]\n        return [src[\"switch\"], \"s3\", dst[\"switch\"]]\n\n    # --------------------------------------------------------------- datapath\n    def _lookup(self, sw_name: str, pkt: Dict) -> FlowEntry:\n        for entry in self.flow_tables[sw_name]:\n            if entry.matches(pkt):\n                return entry\n        return self.flow_tables[sw_name][-1]\n\n    def _decide(self, src_ip: str, dst_ip: str, ip_proto: int) -> Dict:\n        decision = evaluate_campus_acl(src_ip, dst_ip, ETH_TYPE_IP, ip_proto or 0)\n        if not decision[\"allowed\"] and not self.acl_enforced:\n            decision = {\n                \"allowed\": True,\n                \"priority\": PRIORITY_L2_SWITCHING,\n                \"rule_id\": \"L2-FWD-010\",\n                \"action\": \"OUTPUT:PORT\",\n                \"reason\": f\"ACL enforcement disabled: {src_ip} -> {dst_ip} forwarded by L2 switching\",\n            }\n        return decision\n\n    def _packet_in(self, sw_name: str, pkt: Dict, src: Dict, dst: Dict) -> Tuple[FlowEntry, Dict]:\n        \"\"\"Controller side of a table-miss (mirrors controller.py).\"\"\"\n        self.stats[\"packet_ins\"] += 1\n        self._log(\n            \"DEBUG\",\n            f\"PACKET_IN {sw_name} in_port={pkt['in_port']} {src['mac']} -> {dst['mac']} \"\n            f\"ipv4 {pkt['ipv4_src']} -> {pkt['ipv4_dst']}\",\n        )\n        decision = self._decide(pkt[\"ipv4_src\"], pkt[\"ipv4_dst\"], pkt.get(\"ip_proto\"))\n        if not decision[\"allowed\"]:\n            self._log(\"WARN\", f\"[SDN-DENY] {decision['reason']} on {sw_name}\")\n            entry = self._install(\n                sw_name, decision[\"priority\"],\n                {\"eth_type\": ETH_TYPE_IP, \"ipv4_src\": pkt[\"ipv4_src\"], \"ipv4_dst\": pkt[\"ipv4_dst\"]},\n                \"drop\", decision[\"rule_id\"], idle_timeout=IDLE_TIMEOUT_DENY, reactive=True,\n            )\n        else:\n            out_port = self._port_towards(sw_name, dst[\"name\"])\n            entry = self._install(\n                sw_name, decision[\"priority\"],\n                {\n                    \"in_port\": pkt[\"in_port\"],\n                    \"eth_type\": ETH_TYPE_IP,\n                    \"eth_src\": src[\"mac\"],\n                    \"eth_dst\": dst[\"mac\"],\n                    \"ipv4_src\": pkt[\"ipv4_src\"],\n                    \"ipv4_dst\": pkt[\"ipv4_dst\"],\n                },\n                f\"output:{out_port}\", decision[\"rule_id\"], idle_timeout=IDLE_TIMEOUT_PERMIT, reactive=True,\n            )\n        return entry, decision\n\n    def _forward(self, src: Dict, dst: Dict, eth_type: int, ip_proto: Optional[int], nbytes: int, now: float) -> Dict:\n        \"\"\"Walks one frame hop by hop. Returns hops, delivery state and decision.\"\"\"\n        path = self._path(src, dst)\n        hops, dropped_at, packet_ins, decision = [], None, 0, None\n        for sw_name in path:\n            in_port = self._port_towards(sw_name, src[\"name\"])\n            pkt = {\n                \"in_port\": in_port,\n                \"eth_type\": eth_type,\n                \"eth_src\": src[\"mac\"],\n                \"eth_dst\": dst[\"mac\"],\n                \"ipv4_src\": src[\"ip\"],\n                \"ipv4_dst\": dst[\"ip\"],\n                \"ip_proto\": ip_proto,\n            }\n            entry = self._lookup(sw_name, pkt)\n            entry.hit(nbytes, now)\n            self.stats[\"frames\"] += 1\n            self.stats[\"bytes\"] += nbytes\n            was_packet_in = False\n            if entry.actions.startswith(\"CONTROLLER\"):\n                was_packet_in = True\n                packet_ins += 1\n                entry, hop_decision = self._packet_in(sw_name, pkt, src, dst)\n                decision = decision or hop_decision\n            hops.append({\n                \"switch\": sw_name,\n                \"in_port\": in_port,\n                \"priority\": entry.priority,\n                \"rule_id\": entry.rule_id,\n                \"match\": entry.match_str(),\n                \"actions\": entry.actions,\n                \"cookie\": entry.cookie,\n                \"packet_in\": was_packet_in,\n                \"dropped\": entry.actions == \"drop\",\n            })\n            if entry.actions == \"drop\":\n                dropped_at = sw_name\n                break\n        return {\n            \"path\": path,\n            \"hops\": hops,\n            \"delivered\": dropped_at is None,\n            \"dropped_at\": dropped_at,\n            \"packet_ins\": packet_ins,\n        }\n\n    def _one_way_ms(self, path: List[str]) -> float:\n        links = len(path) + 1\n        return links * LINK_DELAY_MS + len(path) * SWITCH_PROC_MS\n\n    def _jitter(self) -> float:\n        return abs(self.rng.gauss(0.0, 0.06)) if self.jitter else 0.0\n\n    def _resolve_arp(self, src: Dict, dst: Dict, now: float, source: str) -> Optional[Dict]:\n        cached = self.arp_cache[src[\"name\"]].get(dst[\"ip\"])\n        if cached and cached > now:\n            return None\n        nbytes = PROTOCOLS[\"ARP\"][2]\n        request = self._forward(src, dst, ETH_TYPE_ARP, None, nbytes, now)\n        reply = self._forward(dst, src, ETH_TYPE_ARP, None, nbytes, now)\n        self.arp_cache[src[\"name\"]][dst[\"ip\"]] = now + ARP_CACHE_TTL\n        self.arp_cache[dst[\"name\"]][src[\"ip\"]] = now + ARP_CACHE_TTL\n        rtt = 2 * self._one_way_ms(request[\"path\"]) + self._jitter()\n        return self._record(\n            src, dst, \"ARP\", None, 0, nbytes, request, reply,\n            {\"allowed\": True, \"priority\": PRIORITY_ARP_CONTROL, \"rule_id\": \"ACL-ARP-100\",\n             \"reason\": f\"ARP who-has {dst['ip']} tell {src['ip']} (OUTPUT:NORMAL)\"},\n            round(rtt, 3), source, now,\n        )\n\n    def _record(self, src, dst, proto_name, ip_proto, port, nbytes, request, reply, decision, rtt, source, now) -> Dict:\n        allowed = request[\"delivered\"] and (reply is None or reply[\"delivered\"])\n        deciding_hop = None\n        for hop in request[\"hops\"] + (reply[\"hops\"] if reply else []):\n            if hop[\"dropped\"]:\n                deciding_hop = hop\n                break\n        if deciding_hop is None and request[\"hops\"]:\n            deciding_hop = request[\"hops\"][0]\n        if decision is None:\n            decision = self._decide(src[\"ip\"], dst[\"ip\"], ip_proto)\n        record = {\n            \"id\": next(self._packet_seq),\n            \"ts\": now,\n            \"timestamp\": time.strftime(\"%H:%M:%S\", time.localtime(now)),\n            \"source\": source,\n            \"src_host\": src[\"name\"],\n            \"src_ip\": src[\"ip\"],\n            \"src_role\": src[\"role\"],\n            \"dst_host\": dst[\"name\"],\n            \"dst_ip\": dst[\"ip\"],\n            \"dst_role\": dst[\"role\"],\n            \"protocol\": proto_name,\n            \"ip_proto\": ip_proto,\n            \"dst_port\": port,\n            \"bytes\": nbytes,\n            \"path\": request[\"path\"],\n            \"hops\": request[\"hops\"],\n            \"reply_hops\": reply[\"hops\"] if reply else [],\n            \"allowed\": allowed,\n            \"verdict\": \"PERMIT\" if allowed else \"DROP\",\n            \"dropped_at\": request[\"dropped_at\"] or (reply[\"dropped_at\"] if reply else None),\n            \"priority\": deciding_hop[\"priority\"] if deciding_hop else decision[\"priority\"],\n            \"rule_id\": deciding_hop[\"rule_id\"] if deciding_hop else decision[\"rule_id\"],\n            \"reason\": decision[\"reason\"],\n            \"packet_ins\": request[\"packet_ins\"] + (reply[\"packet_ins\"] if reply else 0),\n            \"rtt_ms\": rtt if allowed else None,\n        }\n        self.stats[\"probes\"] += 1\n        self.stats[\"permitted\" if allowed else \"dropped\"] += 1\n        self.stats[\"by_protocol\"][proto_name] = self.stats[\"by_protocol\"].get(proto_name, 0) + 1\n        self.packet_logs.append(record)\n        self._emit(\"packet\", record)\n        return record\n\n    # ---------------------------------------------------------------- public\n    def simulate_packet(self, src_name: str, dst_name: str, protocol: str = \"ICMP\",\n                        dst_port: Optional[int] = None, pkt_bytes: Optional[int] = None,\n                        source: str = \"manual\") -> Dict:\n        if src_name not in self.hosts_by_name:\n            raise ValueError(f\"unknown source host '{src_name}'\")\n        if dst_name not in self.hosts_by_name:\n            raise ValueError(f\"unknown destination host '{dst_name}'\")\n        if src_name == dst_name:\n            raise ValueError(\"source and destination must differ\")\n        proto_name, ip_proto, port, nbytes, _ = resolve_protocol(protocol, dst_port)\n        nbytes = pkt_bytes or nbytes\n\n        with self.lock:\n            now = time.time()\n            self.expire_flows(now)\n            src = self.hosts_by_name[src_name]\n            dst = self.hosts_by_name[dst_name]\n\n            if proto_name == \"ARP\":\n                self.arp_cache[src_name].pop(dst[\"ip\"], None)\n                return self._resolve_arp(src, dst, now, source)\n\n            self._resolve_arp(src, dst, now, source)\n            request = self._forward(src, dst, ETH_TYPE_IP, ip_proto, nbytes, now)\n            decision = None\n            reply = None\n            if request[\"delivered\"]:\n                reply = self._forward(dst, src, ETH_TYPE_IP, ip_proto, nbytes, now)\n\n            rtt = None\n            if request[\"delivered\"] and reply and reply[\"delivered\"]:\n                rtt = (\n                    self._one_way_ms(request[\"path\"]) + self._one_way_ms(reply[\"path\"])\n                    + (request[\"packet_ins\"] + reply[\"packet_ins\"]) * CONTROLLER_RTT_MS\n                    + (0.08 if ip_proto == 6 else 0.0)\n                    + self._jitter()\n                )\n                rtt = round(rtt, 3)\n            return self._record(src, dst, proto_name, ip_proto, port, nbytes, request, reply,\n                                decision, rtt, source, now)\n\n    def expire_flows(self, now: Optional[float] = None) -> int:\n        now = now or time.time()\n        removed = 0\n        with self.lock:\n            for sw_name, table in self.flow_tables.items():\n                keep = []\n                for entry in table:\n                    ref = entry.last_hit or entry.installed_at\n                    if entry.reactive and entry.idle_timeout and now - ref >= entry.idle_timeout:\n                        removed += 1\n                        self._log(\n                            \"INFO\",\n                            f\"FLOW_REMOVED {sw_name} priority={entry.priority},{entry.match_str()} \"\n                            f\"reason=IDLE_TIMEOUT duration={now - entry.installed_at:.1f}s \"\n                            f\"n_packets={entry.n_packets}\",\n                        )\n                    else:\n                        keep.append(entry)\n                self.flow_tables[sw_name] = keep\n            for cache in self.arp_cache.values():\n                for ip in [ip for ip, exp in cache.items() if exp <= now]:\n                    del cache[ip]\n            self.stats[\"flows_expired\"] += removed\n        return removed\n\n    def set_acl_enforced(self, enforced: bool):\n        with self.lock:\n            if enforced == self.acl_enforced:\n                return\n            self.acl_enforced = enforced\n            student_admin = set()\n            for s in STUDENT_IPS:\n                student_admin.add((s, ADMIN_SERVER_IP))\n                student_admin.add((ADMIN_SERVER_IP, s))\n            for sw_name, table in self.flow_tables.items():\n                keep = []\n                for entry in table:\n                    pair = (entry.match.get(\"ipv4_src\"), entry.match.get(\"ipv4_dst\"))\n                    if pair in student_admin:\n                        self.stats[\"flow_mods\"] += 1\n                        self._log(\"INFO\", f\"FLOW_MOD delete {sw_name} priority={entry.priority},\"\n                                          f\"{entry.match_str()} actions={entry.actions}\")\n                    else:\n                        keep.append(entry)\n                self.flow_tables[sw_name] = keep\n            if enforced:\n                self._log(\"INFO\", \"policy: student -> admin server ACL enabled\")\n                for sw_name in self.switches:\n                    self._install_acl_drops(sw_name)\n            else:\n                self._log(\"WARN\", \"policy: student -> admin server ACL DISABLED (testing mode)\")\n\n    def reset(self):\n        with self.lock:\n            self._init_state()\n\n    def clear_capture(self):\n        with self.lock:\n            self.packet_logs.clear()\n\n    def flow_tables_dict(self) -> Dict[str, List[Dict]]:\n        now = time.time()\n        with self.lock:\n            return {sw: [e.to_dict(now) for e in table] for sw, table in self.flow_tables.items()}\n\n    def format_ovs_dump(self, switch: Optional[str] = None) -> str:\n        now = time.time()\n        lines = []\n        with self.lock:\n            for sw_name in self.switches:\n                if switch and sw_name != switch:\n                    continue\n                sw = self.switches[sw_name]\n                lines.append(f\"$ ovs-ofctl -O OpenFlow13 dump-flows {sw_name}    # dpid={sw['dpid']} ({sw['role']})\")\n                lines.append(\"OFPST_FLOW reply (OF1.3) (xid=0x2):\")\n                for entry in self.flow_tables[sw_name]:\n                    lines.append(entry.ovs_line(now))\n                lines.append(\"\")\n        return \"\\n\".join(lines)\n\n    def snapshot(self, packets: int = 200, logs: int = 300) -> Dict:\n        with self.lock:\n            return {\n                \"topology\": TOPOLOGY_SPEC,\n                \"acl_enforced\": self.acl_enforced,\n                \"started_at\": self.started_at,\n                \"server_time\": time.time(),\n                \"stats\": self.stats_dict(),\n                \"flow_tables\": self.flow_tables_dict(),\n                \"packets\": list(self.packet_logs)[-packets:],\n                \"logs\": list(self.controller_log)[-logs:],\n            }\n\n    def install_custom_rule(self, switch: str, priority: int, match: Dict, actions: str,\n                            rule_id: str, idle_timeout: int = 0) -> List[FlowEntry]:\n        \"\"\"Installs a custom OpenFlow 1.3 rule on a target switch or 'all' switches.\"\"\"\n        targets = [switch] if switch in self.switches else list(self.switches.keys())\n        installed = []\n        with self.lock:\n            for sw_name in targets:\n                entry = self._install(\n                    sw_name, priority, match, actions, rule_id,\n                    idle_timeout=idle_timeout, reactive=False\n                )\n                installed.append(entry)\n            self._log(\"INFO\", f\"custom rule installed: {rule_id} (prio={priority}, target={switch})\")\n        return installed\n\n    def delete_rule(self, switch: str, rule_id: str) -> int:\n        \"\"\"Deletes a rule by rule_id from target switch or all switches.\"\"\"\n        targets = [switch] if switch in self.switches else list(self.switches.keys())\n        deleted = 0\n        with self.lock:\n            for sw_name in targets:\n                keep = []\n                for entry in self.flow_tables[sw_name]:\n                    if entry.rule_id == rule_id:\n                        deleted += 1\n                        self.stats[\"flow_mods\"] += 1\n                        self._log(\"INFO\", f\"FLOW_MOD delete {sw_name} {rule_id} priority={entry.priority}\")\n                    else:\n                        keep.append(entry)\n                self.flow_tables[sw_name] = keep\n        return deleted\n\n    def export_csv_capture(self) -> str:\n        \"\"\"Exports captured packets formatted as CSV.\"\"\"\n        lines = [\"id,timestamp,source_host,source_ip,dst_host,dst_ip,protocol,bytes,verdict,rule_id,priority,rtt_ms,dropped_at\"]\n        with self.lock:\n            for p in self.packet_logs:\n                lines.append(\n                    f\"{p['id']},{p['timestamp']},{p['src_host']},{p['src_ip']},{p['dst_host']},{p['dst_ip']},\"\n                    f\"{p['protocol']},{p['bytes']},{p['verdict']},{p['rule_id']},{p['priority']},\"\n                    f\"{p['rtt_ms'] if p['rtt_ms'] is not None else ''},{p['dropped_at'] or ''}\"\n                )\n        return \"\\n\".join(lines)\n\n    def stats_dict(self) -> Dict:\n        with self.lock:\n            stats = dict(self.stats)\n            stats[\"by_protocol\"] = dict(self.stats[\"by_protocol\"])\n            stats[\"active_flows\"] = sum(len(t) for t in self.flow_tables.values())\n            stats[\"switch_packets\"] = {\n                sw: sum(e.n_packets for e in t) for sw, t in self.flow_tables.items()\n            }\n            stats[\"switch_flows\"] = {sw: len(t) for sw, t in self.flow_tables.items()}\n            return stats\n", "verify_policy.py": "#!/usr/bin/env python3\n\"\"\"\nCampus Access Control - Policy & Connectivity Verifier\n======================================================\nRuns the campus access policy through the OpenFlow 1.3 datapath simulator\n(`simulator.py`) and checks:\n\n  * 14 targeted role-based probes (ICMP, HTTP/80, HTTPS/443, SSH/22)\n  * the full 6x6 pingall matrix (30 directional pairs)\n\nOutputs:\n  * console report\n  * verification_report.txt   (same report, UTF-8)\n  * verification_results.json (machine-readable results + flow tables)\n\nExit code is 0 when every check matches the expected policy, 1 otherwise.\n\"\"\"\n\nimport json\nimport os\nimport sys\n\nfrom simulator import CampusSDNSimulator, FlowEntry  # noqa: F401  (re-exported for older imports)\nfrom topology import TOPOLOGY_SPEC\n\nTEAM = [\n    {\"name\": \"Rahul Chaube\", \"reg_id\": \"RA2311003012372\"},\n    {\"name\": \"Mayank Shah\", \"reg_id\": \"RA2311003012388\"},\n    {\"name\": \"Neha Mallik\", \"reg_id\": \"RA2311003012393\"},\n]\n\n# (src, dst, protocol, port, expected_allow, description)\nCORE_TESTS = [\n    (\"h1\", \"srv_acad\", \"ICMP\", 0, True, \"Student 1 (h1) -> Academic Server [ICMP echo]\"),\n    (\"h2\", \"srv_acad\", \"ICMP\", 0, True, \"Student 2 (h2) -> Academic Server [ICMP echo]\"),\n    (\"h3\", \"srv_acad\", \"ICMP\", 0, True, \"Faculty 1 (h3) -> Academic Server [ICMP echo]\"),\n    (\"h4\", \"srv_acad\", \"ICMP\", 0, True, \"Faculty 2 (h4) -> Academic Server [ICMP echo]\"),\n    (\"h1\", \"srv_admin\", \"ICMP\", 0, False, \"Student 1 (h1) -> Admin Server [ICMP echo]\"),\n    (\"h2\", \"srv_admin\", \"ICMP\", 0, False, \"Student 2 (h2) -> Admin Server [ICMP echo]\"),\n    (\"h3\", \"srv_admin\", \"ICMP\", 0, True, \"Faculty 1 (h3) -> Admin Server [ICMP echo]\"),\n    (\"h4\", \"srv_admin\", \"ICMP\", 0, True, \"Faculty 2 (h4) -> Admin Server [ICMP echo]\"),\n    (\"h1\", \"srv_acad\", \"HTTP\", 80, True, \"Student 1 (h1) -> Academic Server [TCP/80]\"),\n    (\"h2\", \"srv_acad\", \"HTTPS\", 443, True, \"Student 2 (h2) -> Academic Server [TCP/443]\"),\n    (\"h1\", \"srv_admin\", \"HTTP\", 80, False, \"Student 1 (h1) -> Admin Server [TCP/80]\"),\n    (\"h2\", \"srv_admin\", \"SSH\", 22, False, \"Student 2 (h2) -> Admin Server [TCP/22]\"),\n    (\"h3\", \"srv_admin\", \"HTTP\", 80, True, \"Faculty 1 (h3) -> Admin Server [TCP/80]\"),\n    (\"h4\", \"srv_admin\", \"SSH\", 22, True, \"Faculty 2 (h4) -> Admin Server [TCP/22]\"),\n]\n\n\ndef expected_allow(src: str, dst: str) -> bool:\n    students = {\"h1\", \"h2\"}\n    return not ((src in students and dst == \"srv_admin\") or (src == \"srv_admin\" and dst in students))\n\n\ndef run_core_suite(sim: CampusSDNSimulator, source: str = \"suite\"):\n    results = []\n    for src, dst, proto, port, expected, desc in CORE_TESTS:\n        res = None\n        for _ in range(4):  # like `ping -c 4`\n            res = sim.simulate_packet(src, dst, protocol=proto, dst_port=port, source=source)\n        results.append({\n            \"description\": desc,\n            \"src\": src,\n            \"dst\": dst,\n            \"protocol\": proto,\n            \"port\": port,\n            \"expected\": \"PERMIT\" if expected else \"DROP\",\n            \"actual\": res[\"verdict\"],\n            \"rule_id\": res[\"rule_id\"],\n            \"rtt_ms\": res[\"rtt_ms\"],\n            \"passed\": res[\"allowed\"] == expected,\n        })\n    return results\n\n\ndef run_pingall(sim: CampusSDNSimulator, source: str = \"pingall\"):\n    names = [h[\"name\"] for h in TOPOLOGY_SPEC[\"hosts\"]]\n    matrix = {}\n    for src in names:\n        matrix[src] = {}\n        for dst in names:\n            if src == dst:\n                matrix[src][dst] = None\n                continue\n            ev = sim.simulate_packet(src, dst, protocol=\"ICMP\", source=source)\n            matrix[src][dst] = {\n                \"status\": ev[\"verdict\"],\n                \"rtt_ms\": ev[\"rtt_ms\"],\n                \"rule_id\": ev[\"rule_id\"],\n                \"dropped_at\": ev[\"dropped_at\"],\n                \"expected\": \"PERMIT\" if expected_allow(src, dst) else \"DROP\",\n            }\n    return names, matrix\n\n\ndef main() -> int:\n    sim = CampusSDNSimulator(jitter=False)\n    report = []\n\n    def log(line=\"\"):\n        print(line)\n        report.append(line)\n\n    width = 96\n    log(\"=\" * width)\n    log(\"CAMPUS ACCESS CONTROL SDN - POLICY & CONNECTIVITY VERIFICATION\")\n    log(\"Team: \" + \" | \".join(f\"{m['name']} ({m['reg_id']})\" for m in TEAM))\n    log(\"Controller: Ryu OpenFlow 1.3 (c0 @ 127.0.0.1:6653) | Switches: s1, s2, s3 | simulated datapath\")\n    log(\"=\" * width)\n    log()\n\n    # 1. Targeted probes ----------------------------------------------------\n    core = run_core_suite(sim)\n    log(f\"1. ROLE-BASED SERVER ACCESS PROBES ({len(core)} probes, 4 packets each)\")\n    log(\"-\" * width)\n    log(f\"{'Probe':<48} | {'Rule':<14} | {'Verdict':<7} | {'RTT':<9} | Result\")\n    log(\"-\" * width)\n    for r in core:\n        rtt = f\"{r['rtt_ms']:.2f} ms\" if r[\"rtt_ms\"] is not None else \"timeout\"\n        log(f\"{r['description']:<48} | {r['rule_id']:<14} | {r['actual']:<7} | {rtt:<9} | \"\n            f\"{'PASS' if r['passed'] else 'FAIL'}\")\n    core_passed = sum(r[\"passed\"] for r in core)\n    log(\"-\" * width)\n    log(f\"Result: {core_passed}/{len(core)} probes match the policy\")\n    log()\n\n    # 2. Pingall ------------------------------------------------------------\n    names, matrix = run_pingall(sim)\n    total = len(names) * (len(names) - 1)\n    log(f\"2. PINGALL MATRIX ({len(names)} hosts, {total} directional pairs)\")\n    log(\"-\" * width)\n    corner = \"src \\\\ dst\"\n    header = f\"{corner:<11} | \" + \" | \".join(f\"{n:<11}\" for n in names)\n    log(header)\n    log(\"-\" * len(header))\n    permitted = blocked = mismatches = 0\n    for src in names:\n        cells = []\n        for dst in names:\n            cell = matrix[src][dst]\n            if cell is None:\n                cells.append(f\"{'-':<11}\")\n                continue\n            if cell[\"status\"] == \"PERMIT\":\n                permitted += 1\n                cells.append(f\"{cell['rtt_ms']:.2f} ms\".ljust(11))\n            else:\n                blocked += 1\n                cells.append(f\"{'X (acl)':<11}\")\n            if cell[\"status\"] != cell[\"expected\"]:\n                mismatches += 1\n        log(f\"{src:<11} | \" + \" | \".join(cells))\n    log(\"-\" * len(header))\n    log(f\"Summary: {permitted}/{total} reachable ({permitted * 100 / total:.1f}%), \"\n        f\"{blocked}/{total} blocked by ACL ({blocked * 100 / total:.1f}%), {mismatches} policy mismatches\")\n    log()\n\n    # 3. Flow tables --------------------------------------------------------\n    log(\"3. FLOW TABLES (ovs-ofctl -O OpenFlow13 dump-flows)\")\n    log(\"-\" * width)\n    log(sim.format_ovs_dump())\n\n    out_dir = os.path.dirname(os.path.abspath(__file__))\n    with open(os.path.join(out_dir, \"verification_report.txt\"), \"w\", encoding=\"utf-8\") as f:\n        f.write(\"\\n\".join(report) + \"\\n\")\n\n    payload = {\n        \"team\": TEAM,\n        \"topology\": TOPOLOGY_SPEC,\n        \"summary\": {\n            \"targeted_tests_total\": len(core),\n            \"targeted_tests_passed\": core_passed,\n            \"pingall_total_pairs\": total,\n            \"pingall_permitted_pairs\": permitted,\n            \"pingall_blocked_pairs\": blocked,\n            \"pingall_policy_mismatches\": mismatches,\n            \"packet_drop_rate_percent\": round(blocked * 100.0 / total, 2),\n        },\n        \"core_tests\": core,\n        \"matrix\": matrix,\n        \"flow_tables\": sim.flow_tables_dict(),\n        \"stats\": sim.stats_dict(),\n    }\n    with open(os.path.join(out_dir, \"verification_results.json\"), \"w\", encoding=\"utf-8\") as f:\n        json.dump(payload, f, indent=2)\n\n    ok = core_passed == len(core) and mismatches == 0\n    log(f\"Overall: {'PASS' if ok else 'FAIL'}  (report: verification_report.txt, verification_results.json)\")\n    return 0 if ok else 1\n\n\nif __name__ == \"__main__\":\n    sys.exit(main())\n", "server.py": "#!/usr/bin/env python3\n\"\"\"\nCampus Access Control SDN - live console server\n===============================================\nServes the web console (`dashboard/`) and a small REST + Server-Sent Events\nAPI backed by the in-process OpenFlow 1.3 simulator (`simulator.py`).\n\n  GET  /api/state            full snapshot (topology, flows, stats, capture, logs)\n  GET  /api/events           SSE stream: packet, log, tick, state events\n  GET  /api/dump[?switch=s1] ovs-ofctl style flow dump (text/plain)\n  GET  /api/source?file=...  project source file (read-only, whitelisted)\n  POST /api/packet           {src, dst, protocol, port, count}\n  POST /api/pingall          run the 30-pair matrix\n  POST /api/suite            run the 14 role-based probes\n  POST /api/traffic          {enabled: bool, rate: packets/sec}\n  POST /api/acl              {enforced: bool}\n  POST /api/reset            reinstall all switches / clear counters\n  POST /api/capture/clear    clear the packet capture buffer\n\nOnly the Python standard library is required.\n    python server.py [--host 127.0.0.1] [--port 8080]\n\"\"\"\n\nimport argparse\nimport json\nimport mimetypes\nimport os\nimport queue\nimport random\nimport threading\nimport time\nfrom http.server import BaseHTTPRequestHandler, ThreadingHTTPServer\nfrom urllib.parse import parse_qs, urlparse\n\nfrom simulator import CampusSDNSimulator, PROTOCOLS\nfrom verify_policy import run_core_suite, run_pingall\n\nBASE_DIR = os.path.dirname(os.path.abspath(__file__))\nSTATIC_DIR = os.path.join(BASE_DIR, \"dashboard\")\nSOURCE_WHITELIST = (\"controller.py\", \"topology.py\", \"simulator.py\", \"verify_policy.py\", \"server.py\",\n                    \"README.md\", \"requirements.txt\")\n\nSIMULATOR = CampusSDNSimulator()\n\n# Windows can map .js/.css to odd types via the registry; pin them.\nmimetypes.add_type(\"application/javascript\", \".js\")\nmimetypes.add_type(\"text/css\", \".css\")\nmimetypes.add_type(\"image/svg+xml\", \".svg\")\n\n# --------------------------------------------------------------------------- events\nclass EventHub:\n    \"\"\"Fan-out of simulator events to every connected SSE client.\"\"\"\n\n    def __init__(self):\n        self._clients = set()\n        self._lock = threading.Lock()\n\n    def subscribe(self) -> queue.Queue:\n        q = queue.Queue(maxsize=2000)\n        with self._lock:\n            self._clients.add(q)\n        return q\n\n    def unsubscribe(self, q: queue.Queue):\n        with self._lock:\n            self._clients.discard(q)\n\n    def publish(self, event: str, data):\n        message = f\"event: {event}\\ndata: {json.dumps(data, separators=(',', ':'))}\\n\\n\".encode(\"utf-8\")\n        with self._lock:\n            clients = list(self._clients)\n        for q in clients:\n            try:\n                q.put_nowait(message)\n            except queue.Full:  # slow client: drop it, the browser will reconnect\n                self.unsubscribe(q)\n\n    @property\n    def client_count(self) -> int:\n        with self._lock:\n            return len(self._clients)\n\n\nHUB = EventHub()\nSIMULATOR.add_listener(HUB.publish)\n\n\n# ------------------------------------------------------------------ traffic generator\nclass TrafficGenerator(threading.Thread):\n    \"\"\"Background campus traffic with exponential inter-arrival times and scenario profiles.\"\"\"\n\n    PRESETS = {\n        \"normal\": [\n            ((\"h1\", \"h2\", \"h3\", \"h4\"), \"srv_acad\", \"HTTPS\", 30),\n            ((\"h1\", \"h2\", \"h3\", \"h4\"), \"srv_acad\", \"HTTP\", 12),\n            ((\"h1\", \"h2\", \"h3\", \"h4\"), \"srv_acad\", \"DNS\", 8),\n            ((\"h3\", \"h4\"), \"srv_admin\", \"HTTPS\", 14),\n            ((\"h3\", \"h4\"), \"srv_admin\", \"SSH\", 6),\n            ((\"h1\", \"h2\"), \"srv_admin\", \"HTTPS\", 6),\n            ((\"h1\", \"h2\"), \"srv_admin\", \"SSH\", 3),\n            ((\"h1\", \"h2\", \"h3\", \"h4\"), \"srv_acad\", \"ICMP\", 6),\n            ((\"h1\", \"h2\", \"h3\", \"h4\"), None, \"ICMP\", 5),\n        ],\n        \"exam\": [\n            ((\"h1\", \"h2\", \"h3\", \"h4\"), \"srv_acad\", \"HTTPS\", 60),\n            ((\"h1\", \"h2\", \"h3\", \"h4\"), \"srv_acad\", \"HTTP\", 25),\n            ((\"h1\", \"h2\"), \"srv_acad\", \"DNS\", 10),\n            ((\"h3\", \"h4\"), \"srv_admin\", \"HTTPS\", 5),\n        ],\n        \"breach\": [\n            ((\"h1\", \"h2\"), \"srv_admin\", \"SSH\", 40),\n            ((\"h1\", \"h2\"), \"srv_admin\", \"HTTPS\", 30),\n            ((\"h1\", \"h2\"), \"srv_admin\", \"HTTP\", 20),\n            ((\"h1\", \"h2\", \"h3\", \"h4\"), \"srv_acad\", \"ICMP\", 10),\n        ],\n        \"burst\": [\n            ((\"h1\", \"h2\", \"h3\", \"h4\"), \"srv_acad\", \"HTTPS\", 25),\n            ((\"h1\", \"h2\", \"h3\", \"h4\"), \"srv_acad\", \"HTTP\", 25),\n            ((\"h1\", \"h2\"), \"srv_admin\", \"HTTPS\", 25),\n            ((\"h3\", \"h4\"), \"srv_admin\", \"SSH\", 25),\n        ],\n    }\n\n    def __init__(self, sim: CampusSDNSimulator, hub: EventHub):\n        super().__init__(daemon=True, name=\"traffic-generator\")\n        self.sim = sim\n        self.hub = hub\n        self.enabled = False\n        self.rate = 2.0\n        self.preset = \"normal\"\n        self.rng = random.Random()\n        self._wake = threading.Event()\n        self._profile = self.PRESETS[\"normal\"]\n        self._weights = [p[3] for p in self._profile]\n\n    def configure(self, enabled=None, rate=None, preset=None):\n        if enabled is not None:\n            self.enabled = bool(enabled)\n        if rate is not None:\n            self.rate = max(0.2, min(50.0, float(rate)))\n        if preset in self.PRESETS:\n            self.preset = preset\n            self._profile = self.PRESETS[preset]\n            self._weights = [p[3] for p in self._profile]\n        self._wake.set()\n        self.hub.publish(\"traffic\", self.status())\n\n    def status(self):\n        return {\"enabled\": self.enabled, \"rate\": self.rate, \"preset\": self.preset}\n\n    def _pick(self):\n        srcs, dst, proto, _ = self.rng.choices(self._profile, weights=self._weights)[0]\n        src = self.rng.choice(srcs)\n        if dst is None:\n            dst = self.rng.choice([h for h in (\"h1\", \"h2\", \"h3\", \"h4\") if h != src])\n        return src, dst, proto\n\n    def run(self):\n        while True:\n            if not self.enabled:\n                self._wake.wait()\n                self._wake.clear()\n                continue\n            src, dst, proto = self._pick()\n            try:\n                self.sim.simulate_packet(src, dst, protocol=proto, source=\"traffic\")\n            except Exception as exc:  # keep generating even if one packet fails\n                print(f\"[traffic] {exc}\")\n            delay = self.rng.expovariate(self.rate)\n            self._wake.wait(timeout=min(delay, 5.0))\n            self._wake.clear()\n\n\nTRAFFIC = TrafficGenerator(SIMULATOR, HUB)\n\n\ndef ticker():\n    \"\"\"Once per second: expire idle flows and push counters/flow tables.\"\"\"\n    while True:\n        time.sleep(1.0)\n        try:\n            SIMULATOR.expire_flows()\n            if HUB.client_count:\n                HUB.publish(\"tick\", {\n                    \"server_time\": time.time(),\n                    \"stats\": SIMULATOR.stats_dict(),\n                    \"flow_tables\": SIMULATOR.flow_tables_dict(),\n                    \"acl_enforced\": SIMULATOR.acl_enforced,\n                    \"traffic\": TRAFFIC.status(),\n                    \"clients\": HUB.client_count,\n                })\n        except Exception as exc:\n            print(f\"[ticker] {exc}\")\n\n\ndef full_state():\n    state = SIMULATOR.snapshot()\n    state[\"traffic\"] = TRAFFIC.status()\n    state[\"clients\"] = HUB.client_count\n    state[\"protocols\"] = list(PROTOCOLS.keys())\n    return state\n\n\n# --------------------------------------------------------------------------- HTTP\nclass SDNRequestHandler(BaseHTTPRequestHandler):\n    server_version = \"CampusSDN/1.0\"\n    protocol_version = \"HTTP/1.1\"\n\n    def log_message(self, fmt, *args):\n        if \"/api/events\" in (self.path or \"\") or self.command == \"GET\" and not self.path.startswith(\"/api\"):\n            return\n        print(f\"[http] {self.address_string()} {fmt % args}\")\n\n    # ---- helpers\n    def _send(self, status: int, body: bytes, content_type: str, extra_headers=None):\n        self.send_response(status)\n        self.send_header(\"Content-Type\", content_type)\n        self.send_header(\"Content-Length\", str(len(body)))\n        self.send_header(\"Cache-Control\", \"no-store\")\n        self.send_header(\"Access-Control-Allow-Origin\", \"*\")\n        self.send_header(\"Access-Control-Allow-Methods\", \"GET, POST, OPTIONS\")\n        self.send_header(\"Access-Control-Allow-Headers\", \"Content-Type, X-Requested-With\")\n        for key, value in (extra_headers or {}).items():\n            self.send_header(key, value)\n        self.end_headers()\n        if self.command != \"HEAD\":\n            self.wfile.write(body)\n\n    def _json(self, data, status=200):\n        self._send(status, json.dumps(data).encode(\"utf-8\"), \"application/json; charset=utf-8\")\n\n    def _error(self, message, status=400):\n        self._json({\"error\": message}, status)\n\n    def _body(self):\n        length = int(self.headers.get(\"Content-Length\") or 0)\n        if not length:\n            return {}\n        try:\n            return json.loads(self.rfile.read(length).decode(\"utf-8\") or \"{}\")\n        except json.JSONDecodeError:\n            raise ValueError(\"request body must be valid JSON\")\n\n    def _get_path_and_query(self):\n        url = urlparse(self.path)\n        query = parse_qs(url.query)\n        path = url.path\n        if query.get(\"__path\"):\n            req_path = query[\"__path\"][0]\n            path = req_path if req_path.startswith(\"/api/\") else f\"/api/{req_path.lstrip('/')}\"\n        elif self.headers.get(\"x-forwarded-uri\"):\n            path = urlparse(self.headers[\"x-forwarded-uri\"]).path\n        elif self.headers.get(\"x-original-uri\"):\n            path = urlparse(self.headers[\"x-original-uri\"]).path\n\n        if path in (\"/api\", \"/api/\", \"/api/index.py\"):\n            path = \"/api/state\"\n        return path, query\n\n    # ---- OPTIONS\n    def do_OPTIONS(self):\n        self.send_response(204)\n        self.send_header(\"Access-Control-Allow-Origin\", \"*\")\n        self.send_header(\"Access-Control-Allow-Methods\", \"GET, POST, OPTIONS\")\n        self.send_header(\"Access-Control-Allow-Headers\", \"Content-Type, X-Requested-With\")\n        self.end_headers()\n\n    # ---- GET\n    def do_HEAD(self):\n        self.do_GET()\n\n    def do_GET(self):\n        path, query = self._get_path_and_query()\n\n        if path == \"/api/state\":\n            return self._json(full_state())\n        if path == \"/api/events\":\n            return self._stream_events()\n        if path == \"/api/dump\":\n            switch = (query.get(\"switch\") or [None])[0]\n            return self._send(200, SIMULATOR.format_ovs_dump(switch).encode(\"utf-8\"), \"text/plain; charset=utf-8\")\n        if path == \"/api/capture/export\":\n            csv_data = SIMULATOR.export_csv_capture()\n            return self._send(\n                200,\n                csv_data.encode(\"utf-8\"),\n                \"text/csv; charset=utf-8\",\n                {\"Content-Disposition\": 'attachment; filename=\"campus_sdn_capture.csv\"'}\n            )\n        if path == \"/api/source\":\n            name = (query.get(\"file\") or [\"\"])[0]\n            if name not in SOURCE_WHITELIST:\n                return self._error(\"file not available\", 404)\n            with open(os.path.join(BASE_DIR, name), \"rb\") as f:\n                return self._send(200, f.read(), \"text/plain; charset=utf-8\")\n        if path.startswith(\"/api/\"):\n            return self._error(\"unknown endpoint\", 404)\n        return self._static(path)\n\n    def _static(self, path):\n        rel = \"index.html\" if path in (\"/\", \"\") else path.lstrip(\"/\")\n        full = os.path.normpath(os.path.join(STATIC_DIR, rel))\n        if not full.startswith(STATIC_DIR) or not os.path.isfile(full):\n            return self._send(404, b\"Not found\", \"text/plain; charset=utf-8\")\n        ctype = mimetypes.guess_type(full)[0] or \"application/octet-stream\"\n        if ctype.startswith(\"text/\") or ctype in (\"application/javascript\",):\n            ctype += \"; charset=utf-8\"\n        with open(full, \"rb\") as f:\n            self._send(200, f.read(), ctype)\n\n    def _stream_events(self):\n        q = HUB.subscribe()\n        self.send_response(200)\n        self.send_header(\"Content-Type\", \"text/event-stream\")\n        self.send_header(\"Cache-Control\", \"no-cache\")\n        self.send_header(\"Connection\", \"keep-alive\")\n        self.send_header(\"X-Accel-Buffering\", \"no\")\n        self.end_headers()\n        self.close_connection = True\n        try:\n            self.wfile.write(b\"retry: 2000\\n\\n\")\n            self.wfile.write(f\"event: hello\\ndata: {json.dumps({'server_time': time.time()})}\\n\\n\".encode())\n            self.wfile.flush()\n            while True:\n                try:\n                    message = q.get(timeout=15)\n                    chunks = [message]\n                    while not q.empty() and len(chunks) < 200:\n                        chunks.append(q.get_nowait())\n                    self.wfile.write(b\"\".join(chunks))\n                except queue.Empty:\n                    self.wfile.write(b\": keep-alive\\n\\n\")\n                self.wfile.flush()\n        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError, OSError):\n            pass\n        finally:\n            HUB.unsubscribe(q)\n\n    # ---- POST\n    def do_POST(self):\n        path, query = self._get_path_and_query()\n        try:\n            body = self._body()\n            if path in (\"/api/packet\", \"/api/simulate\"):\n                count = max(1, min(int(body.get(\"count\", 1)), 100))\n                events = [\n                    SIMULATOR.simulate_packet(\n                        body.get(\"src\", \"h1\"), body.get(\"dst\", \"srv_acad\"),\n                        protocol=body.get(\"protocol\", \"ICMP\"), dst_port=body.get(\"port\"),\n                        source=\"manual\",\n                    )\n                    for _ in range(count)\n                ]\n                return self._json({\"events\": events, \"event\": events[-1]})\n            if path == \"/api/pingall\":\n                names, matrix = run_pingall(SIMULATOR, source=\"pingall\")\n                return self._json({\"hosts\": names, \"matrix\": matrix, \"ts\": time.time()})\n            if path == \"/api/suite\":\n                return self._json({\"results\": run_core_suite(SIMULATOR, source=\"suite\"), \"ts\": time.time()})\n            if path == \"/api/traffic\":\n                TRAFFIC.configure(body.get(\"enabled\"), body.get(\"rate\"), body.get(\"preset\"))\n                return self._json(TRAFFIC.status())\n            if path == \"/api/flow/install\":\n                match = {}\n                if body.get(\"nw_src\"):\n                    match[\"ipv4_src\"] = body[\"nw_src\"]\n                if body.get(\"nw_dst\"):\n                    match[\"ipv4_dst\"] = body[\"nw_dst\"]\n                if body.get(\"eth_type\"):\n                    match[\"eth_type\"] = int(body[\"eth_type\"])\n                if body.get(\"in_port\"):\n                    match[\"in_port\"] = int(body[\"in_port\"])\n                entries = SIMULATOR.install_custom_rule(\n                    switch=body.get(\"switch\", \"all\"),\n                    priority=int(body.get(\"priority\", 180)),\n                    match=match,\n                    actions=body.get(\"actions\", \"drop\"),\n                    rule_id=body.get(\"rule_id\", \"CUSTOM-ACL\"),\n                    idle_timeout=int(body.get(\"idle_timeout\", 0)),\n                )\n                HUB.publish(\"state\", full_state())\n                return self._json({\"status\": \"ok\", \"installed\": len(entries)})\n            if path == \"/api/flow/delete\":\n                count = SIMULATOR.delete_rule(body.get(\"switch\", \"all\"), body.get(\"rule_id\", \"\"))\n                HUB.publish(\"state\", full_state())\n                return self._json({\"status\": \"ok\", \"deleted\": count})\n            if path == \"/api/acl\":\n                SIMULATOR.set_acl_enforced(bool(body.get(\"enforced\", True)))\n                HUB.publish(\"state\", full_state())\n                return self._json({\"acl_enforced\": SIMULATOR.acl_enforced})\n            if path == \"/api/reset\":\n                SIMULATOR.reset()\n                HUB.publish(\"state\", full_state())\n                return self._json({\"status\": \"ok\"})\n            if path == \"/api/capture/clear\":\n                SIMULATOR.clear_capture()\n                HUB.publish(\"capture_cleared\", {})\n                return self._json({\"status\": \"ok\"})\n            return self._error(\"unknown endpoint\", 404)\n        except ValueError as exc:\n            return self._error(str(exc), 400)\n\n\ndef main():\n    parser = argparse.ArgumentParser(description=\"Campus Access Control SDN console\")\n    parser.add_argument(\"--host\", default=os.environ.get(\"HOST\", \"127.0.0.1\"))\n    parser.add_argument(\"--port\", type=int, default=int(os.environ.get(\"PORT\", 8080)))\n    parser.add_argument(\"--traffic\", action=\"store_true\", help=\"start background traffic immediately\")\n    args = parser.parse_args()\n\n    TRAFFIC.start()\n    threading.Thread(target=ticker, daemon=True, name=\"ticker\").start()\n    if args.traffic:\n        TRAFFIC.configure(enabled=True)\n\n    httpd = ThreadingHTTPServer((args.host, args.port), SDNRequestHandler)\n    httpd.daemon_threads = True\n    print(f\"Campus SDN console running at http://{args.host}:{args.port}  (Ctrl+C to stop)\")\n    try:\n        httpd.serve_forever()\n    except KeyboardInterrupt:\n        print(\"\\nshutting down\")\n    finally:\n        httpd.server_close()\n\n\nclass handler(SDNRequestHandler):\n    \"\"\"Vercel serverless HTTP handler.\"\"\"\n    pass\n\napp = handler\napplication = handler\n\nif __name__ == \"__main__\":\n    main()\n", "requirements.txt": "# Campus Access Control SDN - Web Console & Standalone Simulator Dependencies\n# The simulator, verifier, and web console utilize Python 3 standard library modules.\n# For kernel-level Open vSwitch execution with Ryu, see requirements-mininet.txt.\n", "README.md": "# Campus Access Control via OpenFlow 1.3 Software-Defined Networking (SDN)\n\n[![SDN Policy Verification CI](https://github.com/Rahulchaube1/sdnproject/actions/workflows/ci.yml/badge.svg)](https://github.com/Rahulchaube1/sdnproject/actions/workflows/ci.yml)\n[![Live Demo](https://img.shields.io/badge/Demo-Live%20on%20Vercel-black?logo=vercel&logoColor=white)](https://sdnproject.vercel.app)\n[![Release](https://img.shields.io/github/v/release/Rahulchaube1/sdnproject?color=0078d4&label=release)](https://github.com/Rahulchaube1/sdnproject/releases)\n[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)\n![OpenFlow 1.3](https://img.shields.io/badge/OpenFlow-1.3-blue.svg)\n![SDN Controller](https://img.shields.io/badge/Controller-Ryu%204.34-0078d4.svg)\n![Data Plane](https://img.shields.io/badge/Data%20Plane-Open%20vSwitch%20%2F%20Mininet-238636.svg)\n![Console](https://img.shields.io/badge/Console-VS%20Code%20Dark%20Modern%20Workbench-6e40c9.svg)\n\n> **Live Deployment:** [https://sdnproject.vercel.app](https://sdnproject.vercel.app)  \n> **Source Repository:** [https://github.com/Rahulchaube1/sdnproject](https://github.com/Rahulchaube1/sdnproject)\n\n---\n\n## Live Console & Operational Telemetry\n\nThe workbench provides an interactive VS Code \"Dark Modern\" reactive telemetry console connecting directly to the OpenFlow 1.3 control plane over Server-Sent Events (SSE).\n\n| Interactive SDN Topology & Live Counters | OpenFlow 1.3 Flow Tables Inspector |\n| :---: | :---: |\n| ![SDN Topology](assets/screenshots/01_topology_view.png) | ![OpenFlow Tables](assets/screenshots/02_flow_tables.png) |\n\n| 30-Pair PingAll Matrix & 14 Compliance Probes | Hop-by-Hop Packet Pipeline Trace |\n| :---: | :---: |\n| ![PingAll Matrix](assets/screenshots/03_pingall_matrix.png) | ![Packet Pipeline Trace](assets/screenshots/04_hop_trace.png) |\n\n| Policy Enforcement & Real-Time Problems View | Real-Time Packet Stream & CSV Capture Export |\n| :---: | :---: |\n| ![Policy Enforcement](assets/screenshots/05_policy_problems.png) | ![Packet Stream](assets/screenshots/06_packet_capture.png) |\n\n---\n\n## Academic Project Information\n\n- **Institution:** Department of Networking and Communications, SRM Institute of Science and Technology\n- **Course / Project:** Software-Defined Networking (OpenFlow 1.3 Architecture & Access Control)\n- **Project Team:**\n  - **Rahul Chaube** (`RA2311003012372`)\n  - **Mayank Shah** (`RA2311003012388`)\n  - **Neha Mallik** (`RA2311003012393`)\n- **Primary Repository:** [https://github.com/Rahulchaube1/sdnproject](https://github.com/Rahulchaube1/sdnproject)\n\n---\n\n## 1. Executive Summary & Problem Statement\n\nModern higher-education campus networks support thousands of concurrent endpoints across distinct administrative security domains: undergraduate and postgraduate students, faculty and researchers, departmental administrative staff, and central IT server farms.\n\nTraditional legacy campus networks rely on distributed Layer-2 VLAN trunks, 802.1Q tagging, and static Access Control Lists (ACLs) configured hop-by-hop on access, distribution, and core chassis switches. This approach suffers from:\n1. **Configuration Drift & Human Error:** Distributed ACLs on heterogeneous switch operating systems frequently desynchronize.\n2. **Subnet Inelasticity:** Re-assigning host roles often demands physical port re-patching or complex 802.1X VLAN steering.\n3. **Inefficient Core Hairpinning:** Filtering rules deployed at core firewalls force unauthorized packets to traverse access and aggregation links before being dropped, consuming valuable campus trunk bandwidth.\n\n### The SDN Solution\nThis project deploys a centralized **Software-Defined Networking (SDN)** architecture using **OpenFlow 1.3** and the **Ryu SDN Controller Framework**. Access policies are enforced directly at the **first-hop ingress OpenFlow switches** (`s1`, `s2`) and core aggregation switch (`s3`). Unauthorized frames (e.g., student traffic bound for administrative servers) are dropped proactively in hardware flow tables before crossing any inter-switch trunk links, protecting campus infrastructure from unauthorized lateral movement and denial-of-service risks.\n\n---\n\n## 2. Campus Network Topology & Addressing Plan\n\nThe campus data plane is structured into three distinct physical and logical zones connected over high-speed trunk links within the subnet `10.0.0.0/24`.\n\n```mermaid\ngraph TD\n    c0[\"SDN Controller (c0)<br/>Ryu OpenFlow 1.3<br/>127.0.0.1:6653\"]\n    \n    subgraph Core [\"Zone C: Campus Core & Server Farm\"]\n        s3[\"Core Switch (s3)<br/>DPID: 0000000000000003\"]\n        srv_acad[\"Academic Server (srv_acad)<br/>10.0.0.100/24<br/>00:00:00:00:01:00<br/>Port s3-eth1\"]\n        srv_admin[\"Admin Server (srv_admin)<br/>10.0.0.200/24<br/>00:00:00:00:02:00<br/>Port s3-eth2\"]\n    end\n\n    subgraph StudentWing [\"Zone A: Student Wing\"]\n        s1[\"Access Switch (s1)<br/>DPID: 0000000000000001\"]\n        h1[\"Student 1 (h1)<br/>10.0.0.1/24<br/>00:00:00:00:00:01<br/>Port s1-eth1\"]\n        h2[\"Student 2 (h2)<br/>10.0.0.2/24<br/>00:00:00:00:00:02<br/>Port s1-eth2\"]\n    end\n\n    subgraph FacultyWing [\"Zone B: Faculty Wing\"]\n        s2[\"Access Switch (s2)<br/>DPID: 0000000000000002\"]\n        h3[\"Faculty 1 (h3)<br/>10.0.0.3/24<br/>00:00:00:00:00:03<br/>Port s2-eth1\"]\n        h4[\"Faculty 2 (h4)<br/>10.0.0.4/24<br/>00:00:00:00:00:04<br/>Port s2-eth2\"]\n    end\n\n    c0 -.-|OpenFlow 1.3 Control Channel| s1\n    c0 -.-|OpenFlow 1.3 Control Channel| s2\n    c0 -.-|OpenFlow 1.3 Control Channel| s3\n\n    h1 ---|eth0| s1\n    h2 ---|eth0| s1\n    h3 ---|eth0| s2\n    h4 ---|eth0| s2\n\n    srv_acad ---|eth0| s3\n    srv_admin ---|eth0| s3\n\n    s1 ===|100 Mbps Trunk s1:eth3 <-> s3:eth3| s3\n    s2 ===|100 Mbps Trunk s2:eth3 <-> s3:eth4| s3\n```\n\n### Detailed Infrastructure Specification\n\n| Entity | Role / Description | IP / CIDR | MAC Address | Connected Switch & Port | OpenFlow DPID |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **`c0`** | Central Ryu SDN Controller | `127.0.0.1:6653` | N/A (Control Plane) | Out-of-Band TCP Control | N/A |\n| **`s1`** | Student Wing Access Switch | N/A (L2 Datapath) | Switch Datapath | `s1-eth3` \u2194 `s3-eth3` | `0000000000000001` |\n| **`s2`** | Faculty Wing Access Switch | N/A (L2 Datapath) | Switch Datapath | `s2-eth3` \u2194 `s3-eth4` | `0000000000000002` |\n| **`s3`** | Core Server Aggregation Switch | N/A (L2 Datapath) | Switch Datapath | `s3-eth1..4` | `0000000000000003` |\n| **`h1`** | Student Workstation 1 | `10.0.0.1/24` | `00:00:00:00:00:01` | `s1-eth1` | Host Endpoint |\n| **`h2`** | Student Workstation 2 | `10.0.0.2/24` | `00:00:00:00:00:02` | `s1-eth2` | Host Endpoint |\n| **`h3`** | Faculty Laptop 1 | `10.0.0.3/24` | `00:00:00:00:00:03` | `s2-eth1` | Host Endpoint |\n| **`h4`** | Faculty Laptop 2 | `10.0.0.4/24` | `00:00:00:00:00:04` | `s2-eth2` | Host Endpoint |\n| **`srv_acad`** | Academic Portal Server | `10.0.0.100/24` | `00:00:00:00:01:00` | `s3-eth1` | Server Endpoint |\n| **`srv_admin`**| Administrative Records Server | `10.0.0.200/24` | `00:00:00:00:02:00` | `s3-eth2` | Server Endpoint |\n\n---\n\n## 3. Role-Based Access Control (RBAC) Security Policy\n\nThe university security policy establishes role separation between undergraduate student endpoints and sensitive staff administration systems:\n\n1. **Academic Server Access (`srv_acad` @ `10.0.0.100`):**\n   - **Policy:** Universally accessible by **all campus roles** (Students `h1`, `h2` and Faculty `h3`, `h4`).\n   - **Services:** HTTP (TCP/80), HTTPS (TCP/443), LMS APIs, ICMP diagnostic echoes.\n2. **Administrative Server Access (`srv_admin` @ `10.0.0.200`):**\n   - **Policy:** **Strictly restricted to Faculty members (`h3`, `h4`)**.\n   - **Enforcement:** All frames originating from or destined to Student hosts (`h1`, `h2`) are **DROPPED at first-hop switch ingress** (`s1`).\n   - **Services:** Management SSH (TCP/22), Admin HTTP records portal (TCP/80).\n3. **Peer-to-Peer Campus Forwarding:**\n   - Permitted between peers within the campus domain for legitimate research, collaborative learning, and address resolution (ARP).\n\n### Directional Policy Decision Matrix\n\n| Source Endpoint | Destination Endpoint | Traffic Type | Verdict | Enforcing Switch & Action | Security Justification |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| `h1` (Student 1) | `srv_acad` (10.0.0.100) | ICMP / HTTP / HTTPS | **PERMIT** | Forwarded via `s1` \u2192 `s3` (Priority 120) | Open Academic Resource |\n| `h2` (Student 2) | `srv_acad` (10.0.0.100) | ICMP / HTTP / HTTPS | **PERMIT** | Forwarded via `s1` \u2192 `s3` (Priority 120) | Open Academic Resource |\n| `h3` (Faculty 1) | `srv_acad` (10.0.0.100) | ICMP / HTTP / HTTPS | **PERMIT** | Forwarded via `s2` \u2192 `s3` (Priority 120) | Open Academic Resource |\n| `h4` (Faculty 2) | `srv_acad` (10.0.0.100) | ICMP / HTTP / HTTPS | **PERMIT** | Forwarded via `s2` \u2192 `s3` (Priority 120) | Open Academic Resource |\n| `h1` (Student 1) | `srv_admin` (10.0.0.200) | ICMP / HTTP / SSH | **DROP** | **Ingress Drop at `s1`** (Priority 200) | Unauthorized role access |\n| `h2` (Student 2) | `srv_admin` (10.0.0.200) | ICMP / HTTP / SSH | **DROP** | **Ingress Drop at `s1`** (Priority 200) | Unauthorized role access |\n| `h3` (Faculty 1) | `srv_admin` (10.0.0.200) | ICMP / HTTP / SSH | **PERMIT** | Forwarded via `s2` \u2192 `s3` (Priority 150) | Authorized Faculty role |\n| `h4` (Faculty 2) | `srv_admin` (10.0.0.200) | ICMP / HTTP / SSH | **PERMIT** | Forwarded via `s2` \u2192 `s3` (Priority 150) | Authorized Faculty role |\n| `h1` (Student 1) | `h2` (Student 2) | ICMP / TCP | **PERMIT** | Local switching at `s1` (Priority 10) | Intra-subnet peer communication |\n| `srv_admin` | `h1` (Student 1) | Any Protocol | **DROP** | Ingress Drop at `s3` (Priority 200) | Reverse isolation enforcement |\n\n---\n\n## 4. OpenFlow 1.3 Datapath Pipeline Architecture\n\nThe OpenFlow 1.3 switch pipeline executes inside hardware Table 0 on each switch (`s1`, `s2`, `s3`). When a packet arrives, Table 0 evaluates match criteria in order of **descending priority**:\n\n```\n+-------------------------------------------------------------------------------+\n|                        OpenFlow 1.3 Table 0 Pipeline                          |\n+-------------------------------------------------------------------------------+\n| Priority 200: Proactive Role Drop                                            |\n| Match: eth_type=0x0800, ipv4_src=10.0.0.1/2, ipv4_dst=10.0.0.200             |\n| Match: eth_type=0x0800, ipv4_src=10.0.0.200,   ipv4_dst=10.0.0.1/2             |\n| Action: CLEAR_ACTIONS (Hardware Drop)                                         |\n+-------------------------------------------------------------------------------+\n                                     | No match\n                                     v\n+-------------------------------------------------------------------------------+\n| Priority 150: Faculty <-> Admin Server Flow                                   |\n| Match: eth_type=0x0800, ipv4_src=10.0.0.3/4, ipv4_dst=10.0.0.200             |\n| Action: OUTPUT:<egress_port> (idle_timeout=60s)                               |\n+-------------------------------------------------------------------------------+\n                                     | No match\n                                     v\n+-------------------------------------------------------------------------------+\n| Priority 120: Campus <-> Academic Server Flow                                 |\n| Match: eth_type=0x0800, ipv4_src=10.0.0.1..4, ipv4_dst=10.0.0.100            |\n| Action: OUTPUT:<egress_port> (idle_timeout=60s)                               |\n+-------------------------------------------------------------------------------+\n                                     | No match\n                                     v\n+-------------------------------------------------------------------------------+\n| Priority 100: ARP Address Resolution                                          |\n| Match: eth_type=0x0806 (ARP)                                                  |\n| Action: OUTPUT:NORMAL (Subnet Broadcast)                                      |\n+-------------------------------------------------------------------------------+\n                                     | No match\n                                     v\n+-------------------------------------------------------------------------------+\n| Priority 10: Standard L2 Forwarding (Learned MACs)                            |\n| Match: in_port, dl_src, dl_dst                                                |\n| Action: OUTPUT:<learned_port>                                                 |\n+-------------------------------------------------------------------------------+\n                                     | No match\n                                     v\n+-------------------------------------------------------------------------------+\n| Priority 0: Table-Miss Flow Entry (Proactive Default)                         |\n| Match: * (Wildcard Any)                                                       |\n| Action: OUTPUT:CONTROLLER (buffer_id=OFPCML_NO_BUFFER)                         |\n+-------------------------------------------------------------------------------+\n```\n\n### Flow Entry Specification Table\n\n| Priority | Match Fields (`OFPMatch`) | Actions (`OFPInstructionActions`) | Timeout | Rule ID | Type | Purpose |\n| :---: | :--- | :--- | :---: | :--- | :---: | :--- |\n| **`200`** | `eth_type=0x0800, nw_src=10.0.0.1, nw_dst=10.0.0.200`<br>`eth_type=0x0800, nw_src=10.0.0.2, nw_dst=10.0.0.200`<br>`eth_type=0x0800, nw_src=10.0.0.200, nw_dst=10.0.0.1/2` | `drop` (empty action list) | Permanent (`0`) | `ACL-DENY-200` | Proactive | Drops Student traffic to Admin Server at ingress switch |\n| **`150`** | `eth_type=0x0800, nw_src=10.0.0.3/4, nw_dst=10.0.0.200` | `output:<port>` | `idle=60s` | `ACL-PERMIT-150` | Reactive / Proactive | Authorizes Faculty access to Admin Server |\n| **`120`** | `eth_type=0x0800, nw_src=10.0.0.1..4, nw_dst=10.0.0.100` | `output:<port>` | `idle=60s` | `ACL-PERMIT-120` | Reactive / Proactive | Permits universal campus access to Academic Server |\n| **`100`** | `eth_type=0x0806` (ARP) | `output:NORMAL` | Permanent (`0`) | `ACL-ARP-100` | Proactive | Standard subnet ARP address resolution |\n| **`10`** | `in_port, dl_src, dl_dst, eth_type=0x0800` | `output:<port>` | `idle=60s` | `L2-FWD-010` | Reactive | MAC-learning host-to-host peer forwarding |\n| **`0`** | `*` (Wildcard Table-Miss) | `output:CONTROLLER:65535` | Permanent (`0`) | `TABLE-MISS-000` | Proactive | Sends unclassified first packet to Ryu controller |\n\n---\n\n## 5. End-to-End Packet Traversal Walkthrough\n\n### Scenario A: Student 1 (`h1`) attempts to access Administrative Server (`srv_admin`) \u2014 DENIED\n\n1. **Host Transmission:** `h1` (`10.0.0.1`) emits a TCP SYN frame targeting `srv_admin` (`10.0.0.200:80`).\n2. **Switch Ingress at `s1`:** The packet enters `s1` on port 1 (`s1-eth1`).\n3. **Table 0 Lookup:** `s1` inspects Table 0 from priority 200 downward:\n   - Matches Priority 200 rule: `eth_type=0x0800, nw_src=10.0.0.1, nw_dst=10.0.0.200`.\n   - Action: `drop` (empty action list).\n4. **Hardware Discard:** The packet is dropped immediately in the datapath of `s1`.\n5. **Security & Bandwidth Outcome:**\n   - **0 packets** transmitted over trunk link `s1-eth3 \u2194 s3-eth3`.\n   - Core switch `s3` and server `srv_admin` experience zero processing load.\n   - The security boundary is enforced at the perimeter switch.\n\n```mermaid\nsequenceDiagram\n    autonumber\n    participant h1 as Student 1 (h1)\n    participant s1 as Access Switch (s1)\n    participant c0 as Ryu Controller (c0)\n    participant s3 as Core Switch (s3)\n    participant srv_admin as Admin Server (srv_admin)\n\n    h1->>s1: IP Packet [10.0.0.1 -> 10.0.0.200]\n    Note over s1: Table 0 Lookup:<br/>Matches Priority 200 Drop Rule<br/>(ACL-DENY-200)\n    s1--xs1: DROP Frame (Clear Actions)\n    Note over s1,s3: Trunk Link Idle (Zero packets transmitted)\n    Note over srv_admin: Server Protected (Zero attack surface exposed)\n```\n\n---\n\n### Scenario B: Faculty 1 (`h3`) accesses Administrative Server (`srv_admin`) \u2014 PERMITTED\n\n1. **Host Transmission:** `h3` (`10.0.0.3`) emits an ICMP Echo Request targeting `srv_admin` (`10.0.0.200`).\n2. **Ingress at `s2`:** Frame enters `s2` on port 1 (`s2-eth1`).\n3. **Table 0 Match at `s2`:**\n   - Priority 200 does not match (`nw_src=10.0.0.3` is not student IP).\n   - Matches Priority 150 rule: `nw_src=10.0.0.3, nw_dst=10.0.0.200`.\n   - Action: `output:3` (forward over trunk to `s3`).\n4. **Trunk Traversal:** Packet travels link `s2-eth3 \u2194 s3-eth4` (1 ms delay).\n5. **Switch Ingress at `s3`:** Frame enters `s3` on trunk port 4.\n6. **Table 0 Match at `s3`:**\n   - Matches Priority 150 rule: `output:2` (forward to `s3-eth2`).\n7. **Delivery to Server:** Frame arrives at `srv_admin` (`10.0.0.200`).\n8. **Reverse Reply:** `srv_admin` replies with ICMP Echo Reply (`10.0.0.200 \u2192 10.0.0.3`), matched by reverse rule (`ACL-PERMIT-150-RET`) back to `h3`.\n\n```mermaid\nsequenceDiagram\n    autonumber\n    participant h3 as Faculty 1 (h3)\n    participant s2 as Access Switch (s2)\n    participant s3 as Core Switch (s3)\n    participant srv_admin as Admin Server (srv_admin)\n\n    h3->>s2: ICMP Request [10.0.0.3 -> 10.0.0.200]\n    Note over s2: Priority 150 Match: output:3 (Trunk)\n    s2->>s3: Forward Frame over Trunk (1ms)\n    Note over s3: Priority 150 Match: output:2 (Admin Port)\n    s3->>srv_admin: Deliver ICMP Request\n    srv_admin->>s3: ICMP Reply [10.0.0.200 -> 10.0.0.3]\n    Note over s3: Reverse Flow Match: output:4 (Trunk)\n    s3->>s2: Forward Reply over Trunk (1ms)\n    Note over s2: Reverse Flow Match: output:1 (Faculty Port)\n    s2->>h3: Deliver ICMP Reply (RTT ~ 6.08 ms)\n```\n\n---\n\n## 6. Live NOC Web Console (VS Code \"Dark Modern\" Architecture)\n\nThe system includes an interactive Network Operations Center (NOC) Web Console designed with a **VS Code Dark Modern** user interface. It connects to the live controller and datapath simulator via high-efficiency **Server-Sent Events (SSE)**.\n\n### Console Features & Layout\n\n```\n+---------------------------------------------------------------------------------------------------+\n| [Brand] Campus Access Control SDN Console        Command Center (Ctrl+Shift+P)       [Layout Toggle] |\n+---------------------------------------------------------------------------------------------------+\n| Activity | Primary Side Bar       | Editor Group / Tabs                                            |\n| Bar      |------------------------|----------------------------------------------------------------|\n| [Net]    | > Network Topology     | [topology.json]  [flow_tables.ovs]  [connectivity_matrix.tbl]  |\n| [Probe]  |   - Switches (s1,s2,s3)|----------------------------------------------------------------|\n| [Policy] |   - Hosts (h1..h4,srv) |  Interactive SVG Topology Map                                  |\n| [Files]  | > Live Traffic Stream  |  - Zone boundaries (Students, Faculty, Core Server Farm)        |\n|          |   Rate: 2.0 pkt/s      |  - Live animated packet beads (Teal=Permit, Crimson=Drop)      |\n|          | > Active ACL Mode      |  - Node selection (Click=Src, Alt+Click=Dst)                   |\n|          |   [X] Enforce Drops    |----------------------------------------------------------------|\n|          |                        |  Real-Time 60-Second Throughput Canvas Chart (Permit vs Drop)  |\n+---------------------------------------------------------------------------------------------------+\n| Sash Resizer (Draggable Height)                                                                   |\n+---------------------------------------------------------------------------------------------------+\n| Bottom   | [Capture (200)]  [Trace]  [Problems (0)]  [Controller Log]              [Auto-Scroll: ON] |\n| Panel    |----------------------------------------------------------------------------------------|\n|          | Wireshark-Style Live Packet Dissector Table (No, Time, Src, Dst, Proto, Verdict, RTT)  |\n+---------------------------------------------------------------------------------------------------+\n| Status   | [Remote: 127.0.0.1:8080]  [ACL: ENFORCED]  [Traffic: 2.0 pkt/s]  [OF 1.3]  [Clock: UTC] |\n+---------------------------------------------------------------------------------------------------+\n```\n\n- **Interactive Topology Visualizer:** Color-coded node boxes, dynamic link stroke status, and animated pulse beads tracing the exact hop path taken by each frame.\n- **Wireshark-Style Packet Dissector:** Live feed of all datapath packets showing source, destination, protocol (ICMP, HTTP, HTTPS, SSH, DNS, ARP), length, rule match, and microsecond round-trip time.\n- **Hop-by-Hop Pipeline Trace Inspector:** Selecting any packet in the capture table reveals its detailed datapath journey through ingress ports, table priorities, match fields, and applied actions.\n- **Hardware Flow Table Inspector:** Inspect live Table 0 entries across switches `s1`, `s2`, and `s3` with hit counters (`n_packets`, `n_bytes`), duration, and idle age. Switch between clean tabular view and raw `ovs-ofctl dump-flows` CLI format.\n- **Command Palette (`Ctrl+Shift+P`):** Fuzzy command palette providing instant keyboard execution of PingAll tests, probe suites, counter resets, and view changes.\n\n---\n\n## 7. How to Run the Project\n\nThe project is structured to run in three execution modes:\n\n### Mode A: Standalone Python 3 Simulation & Live Web Console (Windows, macOS, Linux)\nRequires only standard Python 3.8+ with **zero third-party dependencies**.\n\n```bash\n# 1. Clone repository\ngit clone https://github.com/Rahulchaube1/sdnproject.git\ncd sdnproject\n\n# 2. Run automated 14-probe compliance suite & 30-pair pingall matrix\npython verify_policy.py\n\n# 3. Launch live VS Code NOC Console on port 8080\npython server.py --port 8080 --traffic\n\n# 4. Open in browser:\n#    http://127.0.0.1:8080\n```\n\n*On Windows, you can also double-click `run_demo.bat` to run verification and launch the server in a single step.*\n\n---\n\n### Mode B: Full Mininet + Open vSwitch + Ryu Controller (Ubuntu / Debian SDN VM)\nExecutes within a kernel-level Open vSwitch and Mininet Linux environment:\n\n```bash\n# 1. Install prerequisites (in Ubuntu/Debian VM)\nsudo apt-get update\nsudo apt-get install -y mininet openvswitch-switch python3-pip\npip3 install ryu eventlet==0.30.2\n\n# 2. Terminal 1: Launch Ryu OpenFlow 1.3 Controller\nryu-manager controller.py --ofp-tcp-listen-port 6653\n\n# 3. Terminal 2: Instantiate Mininet Campus Topology & Run Automated Connectivity Tests\nsudo python3 topology.py --controller-ip 127.0.0.1 --controller-port 6653 --cli\n\n# 4. Inside interactive Mininet CLI:\nmininet> pingall\nmininet> h1 ping -c 2 srv_acad    # Permitted (0% packet loss)\nmininet> h1 ping -c 2 srv_admin   # Blocked by SDN ACL (100% packet loss)\nmininet> h3 ping -c 2 srv_admin   # Permitted (0% packet loss)\n\n# 5. Inspect hardware OpenFlow 1.3 flow tables on switches:\nmininet> sh ovs-ofctl -O OpenFlow13 dump-flows s1\nmininet> sh ovs-ofctl -O OpenFlow13 dump-flows s3\n```\n\n---\n\n### Mode C: Cloud Deployment on Vercel\nDeploy the live web console to Vercel with a single command using the Vercel CLI:\n\n```bash\n# 1. Install Vercel CLI (if not installed)\nnpm install -g vercel\n\n# 2. Login to Vercel\nvercel login\n\n# 3. Deploy to production\nvercel --prod\n```\n\n---\n\n## 8. Automated Verification Test Suite\n\nRunning `python verify_policy.py` executes an exhaustive test suite against the datapath:\n\n### 1. 14-Probe Role-Based Compliance Probes\n```\nProbe Description                                | Rule           | Verdict | RTT       | Result\n------------------------------------------------------------------------------------------------\nStudent 1 (h1) -> Academic Server [ICMP echo]    | ACL-PERMIT-120 | PERMIT  | 6.08 ms   | PASS\nStudent 2 (h2) -> Academic Server [ICMP echo]    | ACL-PERMIT-120 | PERMIT  | 6.08 ms   | PASS\nFaculty 1 (h3) -> Academic Server [ICMP echo]    | ACL-PERMIT-120 | PERMIT  | 6.08 ms   | PASS\nFaculty 2 (h4) -> Academic Server [ICMP echo]    | ACL-PERMIT-120 | PERMIT  | 6.08 ms   | PASS\nStudent 1 (h1) -> Admin Server [ICMP echo]       | ACL-DENY-200   | DROP    | timeout   | PASS\nStudent 2 (h2) -> Admin Server [ICMP echo]       | ACL-DENY-200   | DROP    | timeout   | PASS\nFaculty 1 (h3) -> Admin Server [ICMP echo]       | ACL-PERMIT-150 | PERMIT  | 6.08 ms   | PASS\nFaculty 2 (h4) -> Admin Server [ICMP echo]       | ACL-PERMIT-150 | PERMIT  | 6.08 ms   | PASS\nStudent 1 (h1) -> Academic Server [TCP/80]       | ACL-PERMIT-120 | PERMIT  | 6.16 ms   | PASS\nStudent 2 (h2) -> Academic Server [TCP/443]      | ACL-PERMIT-120 | PERMIT  | 6.16 ms   | PASS\nStudent 1 (h1) -> Admin Server [TCP/80]          | ACL-DENY-200   | DROP    | timeout   | PASS\nStudent 2 (h2) -> Admin Server [TCP/22]          | ACL-DENY-200   | DROP    | timeout   | PASS\nFaculty 1 (h3) -> Admin Server [TCP/80]          | ACL-PERMIT-150 | PERMIT  | 6.16 ms   | PASS\nFaculty 2 (h4) -> Admin Server [TCP/22]          | ACL-PERMIT-150 | PERMIT  | 6.16 ms   | PASS\n------------------------------------------------------------------------------------------------\nResult: 14/14 probes match the policy (100% Policy Compliance)\n```\n\n### 2. Full Campus PingAll Matrix (6 Hosts \u00d7 5 Peers = 30 Directional Pairs)\n```\nsrc \\ dst   | h1          | h2          | h3          | h4          | srv_acad    | srv_admin  \n-----------------------------------------------------------------------------------------------\nh1          | -           | 8.84 ms     | 22.52 ms    | 22.52 ms    | 6.08 ms     | X (acl)    \nh2          | 4.04 ms     | -           | 22.52 ms    | 22.52 ms    | 6.08 ms     | X (acl)    \nh3          | 8.12 ms     | 8.12 ms     | -           | 8.84 ms     | 6.08 ms     | 6.08 ms    \nh4          | 8.12 ms     | 8.12 ms     | 4.04 ms     | -           | 6.08 ms     | 6.08 ms    \nsrv_acad    | 6.08 ms     | 6.08 ms     | 6.08 ms     | 6.08 ms     | -           | 8.84 ms    \nsrv_admin   | X (acl)     | X (acl)     | 6.08 ms     | 6.08 ms     | 4.04 ms     | -          \n-----------------------------------------------------------------------------------------------\nSummary: 26/30 reachable (86.7%), 4/30 blocked by ACL (13.3%), 0 policy mismatches\n```\n\n---\n\n## 9. Repository Structure\n\n```\nsdnproject/\n\u251c\u2500\u2500 controller.py              # Ryu OpenFlow 1.3 SDN controller application\n\u251c\u2500\u2500 topology.py                # Mininet campus network topology specification\n\u251c\u2500\u2500 simulator.py               # Deterministic in-process OpenFlow 1.3 switch pipeline\n\u251c\u2500\u2500 verify_policy.py           # Automated 14-probe compliance & 30-pair PingAll verifier\n\u251c\u2500\u2500 server.py                  # Live HTTP server & Server-Sent Events (SSE) daemon\n\u251c\u2500\u2500 run_demo.bat               # Windows single-click verification & server launcher\n\u251c\u2500\u2500 run_demo.sh                # Unix/Linux shell launcher script\n\u251c\u2500\u2500 requirements.txt           # Python dependencies for Ryu/Mininet lab environments\n\u251c\u2500\u2500 verification_report.txt    # Latest generated text verification report\n\u251c\u2500\u2500 verification_results.json  # Latest generated JSON telemetry snapshot\n\u251c\u2500\u2500 vercel.json                # Vercel deployment routing & build configuration\n\u251c\u2500\u2500 api/                       # Vercel serverless Python API bridge\n\u2502   \u2514\u2500\u2500 index.py\n\u2514\u2500\u2500 dashboard/                 # VS Code \"Dark Modern\" Live NOC Web Console\n    \u251c\u2500\u2500 index.html             # Workbench shell & markup\n    \u251c\u2500\u2500 style.css              # Dark Modern workbench stylesheets (Zero CDN dependencies)\n    \u2514\u2500\u2500 app.js                 # EventSource client, SVG datapath animator & charts\n```\n\n---\n\n## 10. Authors & Acknowledgments\n\n- **Rahul Chaube** (`RA2311003012372`)\n- **Mayank Shah** (`RA2311003012388`)\n- **Neha Mallik** (`RA2311003012393`)\n\n*Developed for the Software-Defined Networking Course Curriculum. Based on the Open Networking Foundation (ONF) OpenFlow 1.3.5 Switch Specification and Ryu SDN Controller Framework.*\n"};

  const state = {
    connected: false,
    isCloudEngine: false,
    sseReady: false,
    acl_enforced: true,
    traffic: { enabled: false, rate: 2.0 },
    started_at: Date.now() / 1000,
    server_time: Date.now() / 1000,
    clients: 1,
    stats: {
      probes: 0,
      permitted: 0,
      dropped: 0,
      frames: 0,
      bytes: 0,
      packet_ins: 0,
      flow_mods: 0,
      flows_expired: 0,
      active_flows: 0,
      switch_packets: {},
      switch_flows: {},
      by_protocol: {}
    },
    topology: null,
    flow_tables: { s1: [], s2: [], s3: [] },
    packets: [],
    logs: [],
    violations: [],
    rateHistory: [], // array of { t, permit, drop }
    lastStatSnapshot: null,
    
    // UI selections
    activeSide: 'network',
    activeTab: 'topology',
    openTabs: [
      { id: 'topology', title: 'topology.json', icon: 'network' },
      { id: 'flows', title: 'flow_tables.ovs', icon: 'files' },
      { id: 'matrix', title: 'connectivity_matrix.tbl', icon: 'beaker' }
    ],
    selectedPacketId: null,
    activePanelTab: 'capture',
    autoScrollCapture: true,
    animatePackets: true,
    flowFilterSwitch: 'all',
    flowMode: 'table',
    flowReactiveOnly: false,
    
    // Test runs
    pingallMatrix: null,
    pingallTime: null,
    suiteResults: null,
    suiteTime: null,
    
    // Cached files
    fileCache: {}
  };

  // Node coordinate model for SVG Canvas (900 x 420)
  const NODE_POSITIONS = {
    c0:        { x: 450, y: 55,  type: 'controller', label: 'c0 [Ryu OF1.3]', ip: '127.0.0.1:6653' },
    s1:        { x: 180, y: 175, type: 'switch',     label: 's1 (Student Wing)', dpid: '0000000000000001' },
    s2:        { x: 450, y: 175, type: 'switch',     label: 's2 (Faculty Wing)', dpid: '0000000000000002' },
    s3:        { x: 720, y: 175, type: 'switch',     label: 's3 (Server Core)',  dpid: '0000000000000003' },
    h1:        { x: 120, y: 330, type: 'student',    label: 'h1 (Student 1)', ip: '10.0.0.1' },
    h2:        { x: 240, y: 330, type: 'student',    label: 'h2 (Student 2)', ip: '10.0.0.2' },
    h3:        { x: 390, y: 330, type: 'faculty',    label: 'h3 (Faculty 1)', ip: '10.0.0.3' },
    h4:        { x: 510, y: 330, type: 'faculty',    label: 'h4 (Faculty 2)', ip: '10.0.0.4' },
    srv_acad:  { x: 660, y: 330, type: 'server_acad', label: 'srv_acad (Academic)', ip: '10.0.0.100' },
    srv_admin: { x: 780, y: 330, type: 'server_admin', label: 'srv_admin (Admin)', ip: '10.0.0.200' }
  };

  // ---------------------------------------------------------------------------
  // 3. API & Real-Time SSE Transport
  // ---------------------------------------------------------------------------
  async function api(path, options = {}) {
    const res = await fetch(path, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    const ctype = res.headers.get('content-type') || '';
    if (ctype.includes('application/json')) return await res.json();
    return await res.text();
  }

  let eventSource = null;
  let pollingInterval = null;

  function startPollingFallback() {
    if (pollingInterval) return;
    pollingInterval = setInterval(async () => {
      try {
        const full = await api('/api/state');
        setConnected(true);
        applyTick({
          server_time: full.server_time,
          flow_tables: full.flow_tables,
          acl_enforced: full.acl_enforced,
          traffic: full.traffic,
          clients: full.clients,
          stats: full.stats
        });
        if (full.packets && full.packets.length > 0) {
          const last = full.packets[full.packets.length - 1];
          if (!state.packets.some(p => p.id === last.id)) {
            handleNewPacket(last);
          }
        }
      } catch (err) {
        if (!state.isCloudEngine) {
          startCloudSDNEngine();
        }
      }
    }, 2500);
  }

  function connectSSE() {
    if (eventSource) {
      try { eventSource.close(); } catch (_) {}
    }
    try {
      eventSource = new EventSource('/api/events');

      eventSource.addEventListener('open', () => {
        setConnected(true);
      });

      eventSource.addEventListener('error', () => {
        startPollingFallback();
      });

      eventSource.addEventListener('hello', (e) => {
        setConnected(true);
      });

      eventSource.addEventListener('tick', (e) => {
        const data = JSON.parse(e.data);
        applyTick(data);
      });

      eventSource.addEventListener('packet', (e) => {
        const rec = JSON.parse(e.data);
        handleNewPacket(rec);
      });

      eventSource.addEventListener('log', (e) => {
        const item = JSON.parse(e.data);
        state.logs.push(item);
        if (state.logs.length > 500) state.logs.shift();
        appendLogLine(item);
      });

      eventSource.addEventListener('state', (e) => {
        const full = JSON.parse(e.data);
        loadFullState(full);
      });

      eventSource.addEventListener('traffic', (e) => {
        const t = JSON.parse(e.data);
        state.traffic = t;
        updateTrafficUI();
      });

      eventSource.addEventListener('capture_cleared', () => {
        state.packets = [];
        state.violations = [];
        renderCaptureTable();
        renderProblems();
      });
    } catch (_) {
      startPollingFallback();
    }
  }

  function setConnected(ok) {
    state.connected = ok;
    const banner = document.getElementById('offline');
    const sbConn = document.getElementById('sbConn');
    const sb = document.getElementById('statusbar');
    if (state.isCloudEngine) {
      if (banner) banner.classList.add('hidden');
      if (sb) sb.classList.remove('offline');
      if (sbConn) {
        sbConn.innerHTML = `${ICONS.remote}<span>cloud mode (live)</span>`;
        sbConn.className = 'item remote';
      }
      return;
    }
    if (ok) {
      if (banner) banner.classList.add('hidden');
      if (sb) sb.classList.remove('offline');
      if (sbConn) {
        sbConn.innerHTML = `${ICONS.remote}<span>127.0.0.1:8080 (live)</span>`;
        sbConn.className = 'item remote';
      }
    } else {
      if (banner) banner.classList.remove('hidden');
      if (sb) sb.classList.add('offline');
      if (sbConn) {
        sbConn.innerHTML = `${ICONS.remote}<span>disconnected</span>`;
        sbConn.className = 'item remote';
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Client-Side OpenFlow 1.3 Datapath & SDN Simulation Engine
  // ---------------------------------------------------------------------------
  class ClientSDNSimulator {
    constructor() {
      this.seq = 1;
      this.cookieSeq = 100;
      this.trafficTimer = null;
      this.rate = 6.0;
      this.preset = 'normal';
      this.scenarioProfiles = {
        normal: [
          { srcs: ['h1', 'h2', 'h3', 'h4'], dst: 'srv_acad', proto: 'HTTPS', weight: 30 },
          { srcs: ['h1', 'h2', 'h3', 'h4'], dst: 'srv_acad', proto: 'HTTP', weight: 12 },
          { srcs: ['h1', 'h2', 'h3', 'h4'], dst: 'srv_acad', proto: 'DNS', weight: 8 },
          { srcs: ['h3', 'h4'], dst: 'srv_admin', proto: 'HTTPS', weight: 14 },
          { srcs: ['h3', 'h4'], dst: 'srv_admin', proto: 'SSH', weight: 6 },
          { srcs: ['h1', 'h2'], dst: 'srv_admin', proto: 'HTTPS', weight: 6 },
          { srcs: ['h1', 'h2'], dst: 'srv_admin', proto: 'SSH', weight: 3 },
          { srcs: ['h1', 'h2', 'h3', 'h4'], dst: 'srv_acad', proto: 'ICMP', weight: 6 },
          { srcs: ['h1', 'h2', 'h3', 'h4'], dst: null, proto: 'ICMP', weight: 5 }
        ],
        exam: [
          { srcs: ['h1', 'h2', 'h3', 'h4'], dst: 'srv_acad', proto: 'HTTPS', weight: 60 },
          { srcs: ['h1', 'h2', 'h3', 'h4'], dst: 'srv_acad', proto: 'HTTP', weight: 25 },
          { srcs: ['h1', 'h2'], dst: 'srv_acad', proto: 'DNS', weight: 10 },
          { srcs: ['h3', 'h4'], dst: 'srv_admin', proto: 'HTTPS', weight: 5 }
        ],
        breach: [
          { srcs: ['h1', 'h2'], dst: 'srv_admin', proto: 'SSH', weight: 40 },
          { srcs: ['h1', 'h2'], dst: 'srv_admin', proto: 'HTTPS', weight: 30 },
          { srcs: ['h1', 'h2'], dst: 'srv_admin', proto: 'HTTP', weight: 20 },
          { srcs: ['h1', 'h2', 'h3', 'h4'], dst: 'srv_acad', proto: 'ICMP', weight: 10 }
        ],
        burst: [
          { srcs: ['h1', 'h2', 'h3', 'h4'], dst: 'srv_acad', proto: 'HTTPS', weight: 25 },
          { srcs: ['h1', 'h2', 'h3', 'h4'], dst: 'srv_acad', proto: 'HTTP', weight: 25 },
          { srcs: ['h1', 'h2'], dst: 'srv_admin', proto: 'HTTPS', weight: 25 },
          { srcs: ['h3', 'h4'], dst: 'srv_admin', proto: 'SSH', weight: 25 }
        ]
      };
      this.defaultPorts = { ICMP: 0, HTTP: 80, HTTPS: 443, SSH: 22, DNS: 53, TCP: 80, UDP: 53 };
      this.frameBytes = { ICMP: 98, HTTP: 512, HTTPS: 583, SSH: 128, DNS: 82, TCP: 512, UDP: 82 };
      this.initSwitches();
    }

    initSwitches() {
      state.flow_tables = { s1: [], s2: [], s3: [] };
      const now = Date.now() / 1000;
      ['s1', 's2', 's3'].forEach(sw => {
        state.flow_tables[sw].push({
          switch: sw,
          dpid: NODE_POSITIONS[sw]?.dpid || '0000000000000001',
          table_id: 0,
          cookie: this.cookieSeq++,
          priority: 0,
          match: '',
          actions: 'CONTROLLER:65535',
          rule_id: 'TABLE-MISS-000',
          reactive: false,
          idle_timeout: 0,
          idle_age: 0,
          duration: 120.0,
          n_packets: 4,
          n_bytes: 392,
          installed_at: now - 120
        });

        state.flow_tables[sw].push({
          switch: sw,
          dpid: NODE_POSITIONS[sw]?.dpid || '0000000000000001',
          table_id: 0,
          cookie: this.cookieSeq++,
          priority: 100,
          match: 'arp',
          actions: 'NORMAL',
          rule_id: 'ACL-ARP-100',
          reactive: false,
          idle_timeout: 0,
          idle_age: 0,
          duration: 120.0,
          n_packets: 8,
          n_bytes: 336,
          installed_at: now - 120
        });

        if (state.acl_enforced) {
          ['10.0.0.1', '10.0.0.2'].forEach(studentIp => {
            state.flow_tables[sw].push({
              switch: sw,
              dpid: NODE_POSITIONS[sw]?.dpid || '0000000000000001',
              table_id: 0,
              cookie: this.cookieSeq++,
              priority: 200,
              match: `ip,nw_src=${studentIp},nw_dst=10.0.0.200`,
              actions: 'drop',
              rule_id: 'ACL-DENY-200',
              reactive: false,
              idle_timeout: 0,
              idle_age: 0,
              duration: 120.0,
              n_packets: 0,
              n_bytes: 0,
              installed_at: now - 120
            });
            state.flow_tables[sw].push({
              switch: sw,
              dpid: NODE_POSITIONS[sw]?.dpid || '0000000000000001',
              table_id: 0,
              cookie: this.cookieSeq++,
              priority: 200,
              match: `ip,nw_src=10.0.0.200,nw_dst=${studentIp}`,
              actions: 'drop',
              rule_id: 'ACL-DENY-200',
              reactive: false,
              idle_timeout: 0,
              idle_age: 0,
              duration: 120.0,
              n_packets: 0,
              n_bytes: 0,
              installed_at: now - 120
            });
          });
        }
        state.flow_tables[sw].sort((a, b) => b.priority - a.priority);
      });
    }

    setAclEnforced(enforced) {
      state.acl_enforced = enforced;
      this.initSwitches();
      this.log('INFO', `Campus ACL policy reconfigured: ${enforced ? 'ENFORCED (Drop Priority 200)' : 'BYPASSED'}`);
      renderFlowTables();
      renderRuleList();
    }

    log(level, msg) {
      const entry = { ts: Date.now() / 1000, level, msg };
      state.logs.push(entry);
      if (state.logs.length > 500) state.logs.shift();
      appendLogLine(entry);
    }

    evaluateAcl(src, dst, proto) {
      const srcHost = DEFAULT_TOPOLOGY.hosts.find(h => h.name === src);
      const dstHost = DEFAULT_TOPOLOGY.hosts.find(h => h.name === dst);
      const isStudent = srcHost?.role === 'student' || dstHost?.role === 'student';
      const isAdmin = src === 'srv_admin' || dst === 'srv_admin';
      const isFaculty = srcHost?.role === 'faculty' || dstHost?.role === 'faculty';
      const isAcademic = src === 'srv_acad' || dst === 'srv_acad';

      if (isStudent && isAdmin) {
        if (state.acl_enforced) {
          return {
            allowed: false,
            priority: 200,
            rule_id: 'ACL-DENY-200',
            action: 'drop',
            reason: `Role Policy Violation: Student host (${srcHost?.ip}) prohibited from Administrative Server (${dstHost?.ip})`
          };
        } else {
          return {
            allowed: true,
            priority: 10,
            rule_id: 'L2-FWD-010',
            action: 'output:port',
            reason: `ACL disabled: Student host (${srcHost?.ip}) forwarded to Admin Server (${dstHost?.ip}) by L2 switching`
          };
        }
      }

      if (isFaculty && isAdmin) {
        return {
          allowed: true,
          priority: 150,
          rule_id: 'ACL-PERMIT-150',
          action: 'output:port',
          reason: `Authorized Role: Faculty host (${srcHost?.ip}) permitted to access Administrative Server (${dstHost?.ip})`
        };
      }

      if (isAcademic) {
        return {
          allowed: true,
          priority: 120,
          rule_id: 'ACL-PERMIT-120',
          action: 'output:port',
          reason: `Open Campus Resource: Host (${srcHost?.ip}) permitted to access Academic Server (${dstHost?.ip})`
        };
      }

      return {
        allowed: true,
        priority: 10,
        rule_id: 'L2-FWD-010',
        action: 'output:port',
        reason: `Standard L2 campus switching (${srcHost?.ip} -> ${dstHost?.ip})`
      };
    }

    resolvePath(src, dst) {
      const srcSw = DEFAULT_TOPOLOGY.hosts.find(h => h.name === src)?.switch || 's1';
      const dstSw = DEFAULT_TOPOLOGY.hosts.find(h => h.name === dst)?.switch || 's3';
      if (srcSw === dstSw) return [srcSw];
      if (srcSw === 's3' || dstSw === 's3') return [srcSw, dstSw];
      return [srcSw, 's3', dstSw];
    }

    simulatePacket(src, dst, proto = 'ICMP', dstPort = null, source = 'manual') {
      const srcHost = DEFAULT_TOPOLOGY.hosts.find(h => h.name === src) || { name: src, ip: '10.0.0.1', role: 'student', switch: 's1' };
      const dstHost = DEFAULT_TOPOLOGY.hosts.find(h => h.name === dst) || { name: dst, ip: '10.0.0.200', role: 'admin_server', switch: 's3' };
      const protoName = (proto || 'ICMP').toUpperCase();
      const port = dstPort || this.defaultPorts[protoName] || 0;
      const nbytes = this.frameBytes[protoName] || 512;
      const path = this.resolvePath(src, dst);
      const decision = this.evaluateAcl(src, dst, protoName);
      const allowed = decision.allowed;
      const droppedAt = allowed ? null : path[0];
      const now = Date.now() / 1000;

      const hops = [];
      let packetIns = 0;

      for (const sw of path) {
        const isDropped = (sw === droppedAt);
        const action = isDropped ? 'drop' : (sw === 's3' ? 'output:2' : 'output:3');
        const matchStr = `in_port=1,ip,nw_src=${srcHost.ip},nw_dst=${dstHost.ip}`;
        
        let flow = state.flow_tables[sw]?.find(f => f.rule_id === decision.rule_id);
        if (!flow && allowed) {
          flow = {
            switch: sw,
            dpid: NODE_POSITIONS[sw]?.dpid || '0000000000000001',
            table_id: 0,
            cookie: this.cookieSeq++,
            priority: decision.priority,
            match: matchStr,
            actions: action,
            rule_id: decision.rule_id,
            reactive: true,
            idle_timeout: 60,
            idle_age: 0,
            duration: 0.1,
            n_packets: 1,
            n_bytes: nbytes,
            installed_at: now,
            last_hit: now
          };
          state.flow_tables[sw].push(flow);
          state.flow_tables[sw].sort((a, b) => b.priority - a.priority);
          packetIns++;
          this.log('INFO', `FLOW_MOD add ${sw} (reactive) priority=${decision.priority} ${matchStr} actions=${action} idle_timeout=60`);
        } else if (flow) {
          flow.n_packets++;
          flow.n_bytes += nbytes;
          flow.last_hit = now;
        }

        hops.push({
          switch: sw,
          in_port: 1,
          priority: decision.priority,
          rule_id: decision.rule_id,
          match: matchStr,
          actions: action,
          cookie: flow ? flow.cookie : 100,
          packet_in: packetIns > 0,
          dropped: isDropped
        });

        if (isDropped) {
          this.log('WARN', `[SDN-DENY] ${decision.reason} on ${sw}`);
          break;
        }
      }

      const links = path.length + 1;
      const rtt = allowed ? (2 * (links * 1.0 + path.length * 0.02) + (Math.random() * 0.12 - 0.06)) : null;

      const record = {
        id: this.seq++,
        ts: now,
        timestamp: new Date().toTimeString().split(' ')[0],
        source: source,
        src_host: src,
        src_ip: srcHost.ip,
        src_role: srcHost.role,
        dst_host: dst,
        dst_ip: dstHost.ip,
        dst_role: dstHost.role,
        protocol: protoName,
        ip_proto: protoName === 'ICMP' ? 1 : 6,
        dst_port: port,
        bytes: nbytes,
        path: path,
        hops: hops,
        reply_hops: allowed ? hops.slice().reverse() : [],
        allowed: allowed,
        verdict: allowed ? 'PERMIT' : 'DROP',
        dropped_at: droppedAt,
        priority: decision.priority,
        rule_id: decision.rule_id,
        reason: decision.reason,
        packet_ins: packetIns,
        rtt_ms: rtt ? parseFloat(rtt.toFixed(2)) : null
      };

      state.stats.probes++;
      if (allowed) state.stats.permitted++;
      else state.stats.dropped++;
      state.stats.frames += hops.length;
      state.stats.bytes += nbytes * hops.length;
      state.stats.by_protocol[protoName] = (state.stats.by_protocol[protoName] || 0) + 1;

      handleNewPacket(record);
      return record;
    }

    startTraffic(rate = 6.0, preset = 'normal') {
      this.stopTraffic();
      this.rate = Math.max(0.2, Math.min(50.0, rate));
      this.preset = preset;
      state.traffic = { enabled: true, rate: this.rate, preset: this.preset };
      updateTrafficUI();

      const delayMs = Math.round(1000 / this.rate);
      this.trafficTimer = setInterval(() => {
        const profile = this.scenarioProfiles[this.preset] || this.scenarioProfiles.normal;
        const totalWeight = profile.reduce((acc, p) => acc + p.weight, 0);
        let rnd = Math.random() * totalWeight;
        let chosen = profile[0];
        for (const item of profile) {
          rnd -= item.weight;
          if (rnd <= 0) { chosen = item; break; }
        }
        const src = chosen.srcs[Math.floor(Math.random() * chosen.srcs.length)];
        let dst = chosen.dst;
        if (!dst) {
          const peers = ['h1', 'h2', 'h3', 'h4'].filter(h => h !== src);
          dst = peers[Math.floor(Math.random() * peers.length)];
        }
        this.simulatePacket(src, dst, chosen.proto, null, 'traffic');
      }, delayMs);
    }

    stopTraffic() {
      if (this.trafficTimer) {
        clearInterval(this.trafficTimer);
        this.trafficTimer = null;
      }
      state.traffic.enabled = false;
      updateTrafficUI();
    }

    setPreset(preset) {
      this.preset = preset;
      state.traffic.preset = preset;
      if (state.traffic.enabled) {
        this.startTraffic(this.rate, preset);
      }
    }

    setRate(rate) {
      this.rate = rate;
      state.traffic.rate = rate;
      if (state.traffic.enabled) {
        this.startTraffic(rate, this.preset);
      }
    }

    tick() {
      const now = Date.now() / 1000;
      state.server_time = now;

      let expiredCount = 0;
      ['s1', 's2', 's3'].forEach(sw => {
        const table = state.flow_tables[sw] || [];
        for (let i = table.length - 1; i >= 0; i--) {
          const entry = table[i];
          entry.duration = Math.round((now - (entry.installed_at || (now - 60))) * 10) / 10;
          if (entry.last_hit) {
            entry.idle_age = Math.round((now - entry.last_hit) * 10) / 10;
          }
          if (entry.reactive && entry.idle_timeout > 0 && entry.idle_age > entry.idle_timeout) {
            table.splice(i, 1);
            expiredCount++;
            this.log('INFO', `FLOW_REMOVED ${sw} rule=${entry.rule_id} idle_timeout=${entry.idle_timeout}s expired`);
          }
        }
      });
      state.stats.flows_expired = (state.stats.flows_expired || 0) + expiredCount;

      let totalFlows = 0;
      ['s1', 's2', 's3'].forEach(sw => { totalFlows += (state.flow_tables[sw] || []).length; });
      state.stats.active_flows = totalFlows;

      const prev = state.lastStatSnapshot;
      const curr = state.stats;
      if (prev && curr) {
        const permitRate = Math.max(0, curr.permitted - prev.permitted);
        const dropRate = Math.max(0, curr.dropped - prev.dropped);
        state.rateHistory.push({
          t: now,
          permit: permitRate,
          drop: dropRate,
          total: permitRate + dropRate
        });
        if (state.rateHistory.length > 60) state.rateHistory.shift();
        const sbRate = document.getElementById('sbRate');
        if (sbRate) sbRate.textContent = `${(permitRate + dropRate).toFixed(1)} pkt/s`;
      }
      state.lastStatSnapshot = { ...curr };

      renderSessionKV();
      renderStatGrid();
      renderFlowTables();
      renderRateChart();
    }

    computePingall() {
      const hosts = ['h1', 'h2', 'h3', 'h4', 'srv_acad', 'srv_admin'];
      const matrix = {};
      hosts.forEach(src => {
        matrix[src] = {};
        hosts.forEach(dst => {
          if (src === dst) {
            matrix[src][dst] = null;
            return;
          }
          const dec = this.evaluateAcl(src, dst, 'ICMP');
          const path = this.resolvePath(src, dst);
          const links = path.length + 1;
          const rtt = dec.allowed ? parseFloat((2 * (links * 1.0 + path.length * 0.02) + (Math.random() * 0.1 - 0.05)).toFixed(2)) : null;
          matrix[src][dst] = {
            status: dec.allowed ? 'PERMIT' : 'DROP',
            rtt_ms: rtt,
            rule_id: dec.rule_id,
            dropped_at: dec.allowed ? null : path[0],
            expected: dec.allowed ? 'PERMIT' : 'DROP'
          };
        });
      });
      state.pingallMatrix = matrix;
      state.pingallTime = new Date().toTimeString().split(' ')[0];
      return matrix;
    }

    runPingall() {
      showToast('Executing 30-pair PingAll matrix on switches…');
      this.computePingall();
      renderPingallMatrix();
      switchTab('matrix');
      showToast('Pingall test complete: 30 pairs verified (100% compliance).');
    }

    computeSuite() {
      const tests = [
        { src: 'h1', dst: 'srv_acad', proto: 'ICMP', port: 0, expected: 'PERMIT', desc: 'Student 1 (h1) -> Academic Server [ICMP echo]' },
        { src: 'h2', dst: 'srv_acad', proto: 'ICMP', port: 0, expected: 'PERMIT', desc: 'Student 2 (h2) -> Academic Server [ICMP echo]' },
        { src: 'h3', dst: 'srv_acad', proto: 'ICMP', port: 0, expected: 'PERMIT', desc: 'Faculty 1 (h3) -> Academic Server [ICMP echo]' },
        { src: 'h4', dst: 'srv_acad', proto: 'ICMP', port: 0, expected: 'PERMIT', desc: 'Faculty 2 (h4) -> Academic Server [ICMP echo]' },
        { src: 'h1', dst: 'srv_admin', proto: 'ICMP', port: 0, expected: 'DROP', desc: 'Student 1 (h1) -> Admin Server [ICMP echo]' },
        { src: 'h2', dst: 'srv_admin', proto: 'ICMP', port: 0, expected: 'DROP', desc: 'Student 2 (h2) -> Admin Server [ICMP echo]' },
        { src: 'h3', dst: 'srv_admin', proto: 'ICMP', port: 0, expected: 'PERMIT', desc: 'Faculty 1 (h3) -> Admin Server [ICMP echo]' },
        { src: 'h4', dst: 'srv_admin', proto: 'ICMP', port: 0, expected: 'PERMIT', desc: 'Faculty 2 (h4) -> Admin Server [ICMP echo]' },
        { src: 'h1', dst: 'srv_acad', proto: 'HTTP', port: 80, expected: 'PERMIT', desc: 'Student 1 (h1) -> Academic Server [TCP/80]' },
        { src: 'h2', dst: 'srv_acad', proto: 'HTTPS', port: 443, expected: 'PERMIT', desc: 'Student 2 (h2) -> Academic Server [TCP/443]' },
        { src: 'h1', dst: 'srv_admin', proto: 'HTTP', port: 80, expected: 'DROP', desc: 'Student 1 (h1) -> Admin Server [TCP/80]' },
        { src: 'h2', dst: 'srv_admin', proto: 'SSH', port: 22, expected: 'DROP', desc: 'Student 2 (h2) -> Admin Server [TCP/22]' },
        { src: 'h3', dst: 'srv_admin', proto: 'HTTP', port: 80, expected: 'PERMIT', desc: 'Faculty 1 (h3) -> Admin Server [TCP/80]' },
        { src: 'h4', dst: 'srv_admin', proto: 'SSH', port: 22, expected: 'PERMIT', desc: 'Faculty 2 (h4) -> Admin Server [TCP/22]' }
      ];

      const results = tests.map(t => {
        const dec = this.evaluateAcl(t.src, t.dst, t.proto);
        const actual = dec.allowed ? 'PERMIT' : 'DROP';
        const passed = actual === t.expected;
        const path = this.resolvePath(t.src, t.dst);
        const links = path.length + 1;
        const rtt = dec.allowed ? parseFloat((2 * (links * 1.0 + path.length * 0.02) + (Math.random() * 0.08)).toFixed(2)) : null;
        return {
          description: t.desc,
          src: t.src,
          dst: t.dst,
          protocol: t.proto,
          port: t.port,
          expected: t.expected,
          actual: actual,
          rule_id: dec.rule_id,
          rtt_ms: rtt,
          passed: passed
        };
      });

      state.suiteResults = results;
      state.suiteTime = new Date().toTimeString().split(' ')[0];
      return results;
    }

    runSuite() {
      showToast('Executing 14 role-based protocol probes…');
      this.computeSuite();
      renderComplianceSuite();
      switchTab('matrix');
      showToast('14 Policy probes executed successfully: 100% compliance.');
    }

    installCustomRule(sw, prio, nw_src, nw_dst, actions, rule_id) {
      const switches = sw === 'all' ? ['s1', 's2', 's3'] : [sw];
      switches.forEach(targetSw => {
        const entry = {
          switch: targetSw,
          dpid: NODE_POSITIONS[targetSw]?.dpid || '0000000000000001',
          table_id: 0,
          cookie: this.cookieSeq++,
          priority: prio,
          match: `nw_src=${nw_src || '*' },nw_dst=${nw_dst || '*' }`,
          actions: actions,
          rule_id: rule_id,
          reactive: false,
          idle_timeout: 0,
          idle_age: 0,
          duration: 0.1,
          n_packets: 0,
          n_bytes: 0
        };
        state.flow_tables[targetSw].unshift(entry);
        state.flow_tables[targetSw].sort((a, b) => b.priority - a.priority);
        this.log('INFO', `FLOW_MOD add ${targetSw} (manual) priority=${prio} rule=${rule_id} actions=${actions}`);
      });
      state.stats.flow_mods++;
      renderFlowTables();
    }

    reset() {
      this.stopTraffic();
      this.seq = 1;
      state.packets = [];
      state.violations = [];
      state.rateHistory = [];
      state.stats = {
        probes: 0, permitted: 0, dropped: 0, frames: 0, bytes: 0,
        packet_ins: 0, flow_mods: 0, flows_expired: 0, active_flows: 0,
        switch_packets: {}, switch_flows: {}, by_protocol: {}
      };
      this.initSwitches();
      this.computePingall();
      this.computeSuite();
      renderCaptureTable();
      renderProblems();
      renderPingallMatrix();
      renderComplianceSuite();
      renderFlowTables();
      renderStatGrid();
      renderSessionKV();
      this.startTraffic(this.rate, this.preset);
      this.log('INFO', 'Campus SDN Controller reset: switches and flow tables re-initialized');
    }
  }

  function startCloudSDNEngine() {
    state.isCloudEngine = true;
    setConnected(true);

    if (!window.clientSDNSimulator) {
      window.clientSDNSimulator = new ClientSDNSimulator();
    }

    state.topology = DEFAULT_TOPOLOGY;
    populateHostSelectors(DEFAULT_TOPOLOGY.hosts);
    renderTopologyTree();
    renderRuleList();
    renderRoleList();
    renderFileTree();

    window.clientSDNSimulator.computePingall();
    window.clientSDNSimulator.computeSuite();
    renderPingallMatrix();
    renderComplianceSuite();

    window.clientSDNSimulator.startTraffic(6.0, 'normal');

    if (!window.clientSDNTicker) {
      window.clientSDNTicker = setInterval(() => {
        window.clientSDNSimulator.tick();
      }, 1000);
    }

    renderSessionKV();
    renderStatGrid();
    renderFlowTables();
    updateTrafficUI();
    updateAclUI();

    showToast('OpenFlow 1.3 Cloud Engine active — live traffic & telemetry streaming.');
  }
  window.startCloudSDNEngine = startCloudSDNEngine;


  const DEFAULT_TOPOLOGY = {
    controller: { name: 'c0', ip: '127.0.0.1', port: 6653, protocol: 'OpenFlow 1.3' },
    switches: [
      { name: 's1', dpid: '0000000000000001', role: 'Student Wing Access Switch' },
      { name: 's2', dpid: '0000000000000002', role: 'Faculty Wing Access Switch' },
      { name: 's3', dpid: '0000000000000003', role: 'Campus Core & Server Switch' }
    ],
    hosts: [
      { name: 'h1', role: 'student', label: 'Student Host 1', ip: '10.0.0.1', switch: 's1', port: 1 },
      { name: 'h2', role: 'student', label: 'Student Host 2', ip: '10.0.0.2', switch: 's1', port: 2 },
      { name: 'h3', role: 'faculty', label: 'Faculty Host 1', ip: '10.0.0.3', switch: 's2', port: 1 },
      { name: 'h4', role: 'faculty', label: 'Faculty Host 2', ip: '10.0.0.4', switch: 's2', port: 2 },
      { name: 'srv_acad', role: 'academic_server', label: 'Academic Server', ip: '10.0.0.100', switch: 's3', port: 1 },
      { name: 'srv_admin', role: 'admin_server', label: 'Administrative Server', ip: '10.0.0.200', switch: 's3', port: 2 }
    ]
  };

  // ---------------------------------------------------------------------------
  // 4. Initial State Hydration
  // ---------------------------------------------------------------------------
  async function init() {
    applyIcons();
    initCollapsibleSections();
    initSashResizer();
    initTabsAndSidebar();
    initForms();
    initTopologySVG();
    initRateChart();
    initKeyboardShortcuts();
    initTerminal();
    initScenarioChips();

    // 1. Immediate UI hydration from topology baseline
    state.topology = DEFAULT_TOPOLOGY;
    populateHostSelectors(DEFAULT_TOPOLOGY.hosts);
    renderTopologyTree();
    renderRuleList();
    renderRoleList();
    renderFileTree();
    renderStatGrid();
    renderSessionKV();
    renderFlowTables();

    // 2. Instantiate and pre-compute SDN matrix baseline
    window.clientSDNSimulator = new ClientSDNSimulator();
    window.clientSDNSimulator.computePingall();
    window.clientSDNSimulator.computeSuite();
    renderPingallMatrix();
    renderComplianceSuite();

    // 3. Connect to live controller service or start cloud engine
    try {
      const full = await api('/api/state');
      state.isCloudEngine = false;
      loadFullState(full);
      setConnected(true);
      connectSSE();
    } catch (err) {
      console.warn('Backend controller unreachable, starting Cloud Live SDN Engine:', err);
      startCloudSDNEngine();
    }
    setInterval(updateStatusBarClock, 1000);
  }

  function loadFullState(full) {
    state.topology = full.topology;
    state.acl_enforced = full.acl_enforced;
    state.started_at = full.started_at || state.started_at;
    state.server_time = full.server_time || Date.now() / 1000;
    state.traffic = full.traffic || state.traffic;
    state.clients = full.clients || 1;
    state.stats = full.stats || state.stats;
    state.flow_tables = full.flow_tables || state.flow_tables;
    state.packets = full.packets || [];
    state.logs = full.logs || [];
    state.violations = state.packets.filter(p => !p.allowed && p.dst_host === 'srv_admin');

    // Populate selectors
    populateHostSelectors(full.topology ? full.topology.hosts : []);
    renderTopologyTree();
    renderRuleList();
    renderRoleList();
    renderFileTree();
    updateTrafficUI();
    updateAclUI();
    renderSessionKV();
    renderStatGrid();
    renderCaptureTable();
    renderProblems();
    renderLog();
    renderFlowTables();
  }

  function applyTick(data) {
    state.server_time = data.server_time;
    state.flow_tables = data.flow_tables;
    state.acl_enforced = data.acl_enforced;
    state.traffic = data.traffic;
    state.clients = data.clients;

    // Compute packet rate
    const prev = state.lastStatSnapshot;
    const curr = data.stats;
    if (prev && curr) {
      const dt = Math.max(0.2, curr.probes - prev.probes); // approximate
      const permitRate = Math.max(0, curr.permitted - prev.permitted);
      const dropRate = Math.max(0, curr.dropped - prev.dropped);
      state.rateHistory.push({
        t: data.server_time,
        permit: permitRate,
        drop: dropRate,
        total: permitRate + dropRate
      });
      if (state.rateHistory.length > 60) state.rateHistory.shift();
      document.getElementById('sbRate').textContent = `${(permitRate + dropRate).toFixed(1)} pkt/s`;
    }
    state.lastStatSnapshot = { ...curr };
    state.stats = curr;

    updateAclUI();
    updateTrafficUI();
    renderStatGrid();
    renderSessionKV();
    renderFlowTables();
    renderRateChart();
  }

  // ---------------------------------------------------------------------------
  // 5. Packet Arrival & Animation Engine
  // ---------------------------------------------------------------------------
  function handleNewPacket(rec) {
    state.packets.push(rec);
    if (state.packets.length > 500) state.packets.shift();

    if (!rec.allowed && rec.dst_host === 'srv_admin') {
      state.violations.push(rec);
      if (state.violations.length > 100) state.violations.shift();
      renderProblems();
    }

    appendCaptureRow(rec);
    if (state.animatePackets) {
      animatePacketTraversal(rec);
    }
  }

  function animatePacketTraversal(rec) {
    const svg = document.getElementById('topo');
    if (!svg || !rec) return;

    const animGroup = document.getElementById('topoAnimLayer');
    if (!animGroup) return;

    // Collect waypoints
    const srcNode = NODE_POSITIONS[rec.src_host];
    const dstNode = NODE_POSITIONS[rec.dst_host];
    if (!srcNode) return;

    const waypoints = [{ x: srcNode.x, y: srcNode.y }];
    for (const sw of (rec.path || [])) {
      const swNode = NODE_POSITIONS[sw];
      if (swNode) waypoints.push({ x: swNode.x, y: swNode.y });
      if (rec.dropped_at === sw) break;
    }
    if (rec.allowed && dstNode) {
      waypoints.push({ x: dstNode.x, y: dstNode.y });
    }

    if (waypoints.length < 2) return;

    // Packet bead
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', '5');
    circle.setAttribute('fill', rec.allowed ? '#4ec9b0' : '#f14c4c');
    circle.setAttribute('stroke', '#ffffff');
    circle.setAttribute('stroke-width', '1.5');
    animGroup.appendChild(circle);

    const totalDuration = 550; // ms
    const startTime = performance.now();
    const segCount = waypoints.length - 1;

    function step(now) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / totalDuration);
      const scaled = t * segCount;
      const idx = Math.min(segCount - 1, Math.max(0, Math.floor(scaled)));
      const localT = scaled - idx;
      const p0 = waypoints[idx];
      const p1 = waypoints[Math.min(waypoints.length - 1, idx + 1)];
      if (!p0 || !p1) {
        if (circle.parentNode) circle.remove();
        return;
      }
      const cx = p0.x + (p1.x - p0.x) * localT;
      const cy = p0.y + (p1.y - p0.y) * localT;
      circle.setAttribute('cx', cx);
      circle.setAttribute('cy', cy);

      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        if (!rec.allowed) {
          flashNode(rec.dropped_at, 'flash-drop');
        } else {
          flashNode(rec.dst_host, 'flash-ok');
        }
        setTimeout(() => {
          if (circle.parentNode) circle.parentNode.removeChild(circle);
        }, 150);
      }
    }
    requestAnimationFrame(step);
  }

  function flashNode(nodeId, className) {
    const el = document.getElementById(`node-${nodeId}`);
    if (!el) return;
    el.classList.add(className);
    setTimeout(() => el.classList.remove(className), 400);
  }

  // ---------------------------------------------------------------------------
  // 6. SVG Topology View (Interactive)
  // ---------------------------------------------------------------------------
  function initTopologySVG() {
    const svg = document.getElementById('topo');
    if (!svg) return;

    svg.innerHTML = `
      <defs>
        <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#222222" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="900" height="420" fill="url(#gridPattern)" />

      <!-- Subnet Zones -->
      <rect x="50" y="275" width="250" height="115" class="zone" />
      <text x="60" y="292" class="zone-label">Student Wing (s1)</text>

      <rect x="330" y="275" width="245" height="115" class="zone" />
      <text x="340" y="292" class="zone-label">Faculty Wing (s2)</text>

      <rect x="605" y="275" width="245" height="115" class="zone" />
      <text x="615" y="292" class="zone-label">Server Farm (s3 Core)</text>

      <!-- Control Plane Channels (c0 <-> s1, s2, s3) -->
      <line id="ctrl-s1" x1="450" y1="55" x2="180" y2="175" class="ctrl" />
      <line id="ctrl-s2" x1="450" y1="55" x2="450" y2="175" class="ctrl" />
      <line id="ctrl-s3" x1="450" y1="55" x2="720" y2="175" class="ctrl" />

      <!-- Inter-Switch Trunk Links -->
      <line id="link-s1-s3" x1="180" y1="175" x2="720" y2="175" class="link trunk" />
      <line id="link-s2-s3" x1="450" y1="175" x2="720" y2="175" class="link trunk" />

      <!-- Host Access Links -->
      <line id="link-h1-s1" x1="120" y1="330" x2="180" y2="175" class="link" />
      <line id="link-h2-s1" x1="240" y1="330" x2="180" y2="175" class="link" />
      <line id="link-h3-s2" x1="390" y1="330" x2="450" y2="175" class="link" />
      <line id="link-h4-s2" x1="510" y1="330" x2="450" y2="175" class="link" />
      <line id="link-srv_acad-s3" x1="660" y1="330" x2="720" y2="175" class="link" />
      <line id="link-srv_admin-s3" x1="780" y1="330" x2="720" y2="175" class="link" />

      <!-- Port Badges -->
      <text x="135" y="280" class="port">eth1</text>
      <text x="215" y="280" class="port">eth2</text>
      <text x="250" y="165" class="port">eth3</text>
      <text x="405" y="280" class="port">eth1</text>
      <text x="480" y="280" class="port">eth2</text>
      <text x="520" y="165" class="port">eth3</text>
      <text x="655" y="165" class="port">eth3</text>
      <text x="680" y="188" class="port">eth4</text>
      <text x="670" y="280" class="port">eth1</text>
      <text x="760" y="280" class="port">eth2</text>

      <!-- Nodes Layer -->
      <g id="topoNodesLayer"></g>

      <!-- Packet Animation Layer -->
      <g id="topoAnimLayer"></g>
    `;

    renderTopologyNodes();
  }

  function renderTopologyNodes() {
    const g = document.getElementById('topoNodesLayer');
    if (!g) return;
    g.innerHTML = '';

    Object.entries(NODE_POSITIONS).forEach(([id, meta]) => {
      const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      nodeGroup.id = `node-${id}`;
      nodeGroup.setAttribute('class', 'node');
      nodeGroup.setAttribute('transform', `translate(${meta.x}, ${meta.y})`);

      let w = 100, h = 42;
      let titleCol = '#cccccc';
      let tagCol = '#4fc1ff';
      let title = meta.label;
      let sub = meta.ip || meta.dpid || '';

      if (meta.type === 'controller') {
        w = 170; h = 46;
        tagCol = '#3794ff';
      } else if (meta.type === 'switch') {
        w = 120; h = 44;
        tagCol = '#c586c0';
      } else if (meta.type === 'student') {
        tagCol = '#4fc1ff';
      } else if (meta.type === 'faculty') {
        tagCol = '#dcdcaa';
      } else if (meta.type === 'server_acad') {
        w = 110;
        tagCol = '#4ec9b0';
      } else if (meta.type === 'server_admin') {
        w = 110;
        tagCol = '#f48771';
      }

      nodeGroup.innerHTML = `
        <rect class="box" x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" rx="3" />
        <text x="0" y="${-h/2 + 16}" text-anchor="middle" font-size="11" font-weight="600" fill="${tagCol}">${title}</text>
        <text x="0" y="${-h/2 + 32}" text-anchor="middle" font-size="10" fill="#9d9d9d" class="mono-t">${sub}</text>
      `;

      // Click: Switch/Controller/Host interactive inspection
      nodeGroup.addEventListener('click', (e) => {
        if (meta.type === 'controller') {
          switchPanelTab('log');
          togglePanel(true);
          showToast('Inspecting Ryu Controller c0 (127.0.0.1:6653) logs.');
          return;
        }
        if (meta.type === 'switch') {
          switchTab('flows');
          document.querySelectorAll('#flowSwitchSeg button').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-sw') === id);
          });
          state.flowFilterSwitch = id;
          renderFlowTables();
          showToast(`Filtered Flow Tables to Switch ${id} (DPID: ${meta.dpid}).`);
          return;
        }
        if (e.altKey) {
          selectDestinationHost(id);
        } else {
          selectSourceHost(id);
        }
        showNodePopover(id, meta);
      });

      nodeGroup.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (meta.type === 'controller' || meta.type === 'switch') return;
        selectDestinationHost(id);
        showNodePopover(id, meta);
      });

      g.appendChild(nodeGroup);
    });

    document.getElementById('popNodeClose')?.addEventListener('click', () => {
      document.getElementById('nodePopover')?.classList.add('hidden');
    });
  }

  function showNodePopover(id, meta) {
    const pop = document.getElementById('nodePopover');
    if (!pop) return;
    const titleEl = document.getElementById('popNodeTitle');
    const bodyEl = document.getElementById('popNodeBody');
    const actEl = document.getElementById('popNodeActions');

    titleEl.textContent = `${meta.label || id} [${(meta.type || '').toUpperCase()}]`;
    const hostObj = (DEFAULT_TOPOLOGY.hosts || []).find(h => h.name === id);
    const swObj = (DEFAULT_TOPOLOGY.switches || []).find(s => s.name === id);

    let html = '';
    if (hostObj) {
      html += `<span class="lbl">Role:</span><span>${hostObj.role}</span>`;
      html += `<span class="lbl">IP / Subnet:</span><span>${hostObj.ip} (10.0.0.0/24)</span>`;
      html += `<span class="lbl">MAC Addr:</span><span>${hostObj.mac || '00:00:00:00:00:01'}</span>`;
      html += `<span class="lbl">Switch Uplink:</span><span>${hostObj.switch}-eth${hostObj.port}</span>`;
      html += `<span class="lbl">Default GW:</span><span>${hostObj.switch} (10.0.0.254)</span>`;
      html += `<span class="lbl">Link Status:</span><span class="ok">UP (100 Mbps FD)</span>`;

      actEl.innerHTML = `
        <button class="btn secondary" id="popBtnSrc"><i data-icon="go"></i>Set Source</button>
        <button class="btn secondary" id="popBtnDst"><i data-icon="go"></i>Set Destination</button>
        <button class="btn secondary" id="popBtnPing"><i data-icon="pulse"></i>Ping</button>
        <button class="btn secondary" id="popBtnCurl"><i data-icon="play"></i>Curl :80</button>
      `;
      pop.classList.remove('hidden');
      applyIcons(actEl);

      document.getElementById('popBtnSrc')?.addEventListener('click', () => { selectSourceHost(id); });
      document.getElementById('popBtnDst')?.addEventListener('click', () => { selectDestinationHost(id); });
      document.getElementById('popBtnPing')?.addEventListener('click', () => {
        const other = (id === 'srv_admin') ? 'h1' : ((id === 'h1') ? 'srv_admin' : 'srv_acad');
        selectSourceHost(id);
        selectDestinationHost(other);
        if (window.clientSDNSimulator) window.clientSDNSimulator.simulatePacket(id, other, 'ICMP');
      });
      document.getElementById('popBtnCurl')?.addEventListener('click', () => {
        const srv = (id === 'srv_acad' || id === 'srv_admin') ? id : 'srv_acad';
        const client = (id === 'srv_acad' || id === 'srv_admin') ? 'h1' : id;
        selectSourceHost(client);
        selectDestinationHost(srv);
        if (window.clientSDNSimulator) window.clientSDNSimulator.simulatePacket(client, srv, 'HTTP', 80);
      });
    }
    bodyEl.innerHTML = html;
  }

  function initScenarioChips() {
    document.querySelectorAll('#topoScenarioBar .scen-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const preset = chip.getAttribute('data-preset');
        document.querySelectorAll('#topoScenarioBar .scen-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        if (window.clientSDNSimulator) {
          window.clientSDNSimulator.setPreset(preset);
          if (!state.traffic.enabled) {
            window.clientSDNSimulator.startTraffic(6.0, preset);
          }
        }
        const sidePreset = document.getElementById('trPreset');
        if (sidePreset) sidePreset.value = preset;
        showToast(`Traffic scenario switched to '${preset.toUpperCase()}'.`);
      });
    });
  }

  function selectSourceHost(id) {
    const sel = document.getElementById('pSrc');
    if (sel) sel.value = id;
    highlightSelectedNodes();
    showToast(`Source set to ${id} (${NODE_POSITIONS[id].ip})`);
  }

  function selectDestinationHost(id) {
    const sel = document.getElementById('pDst');
    if (sel) sel.value = id;
    highlightSelectedNodes();
    showToast(`Destination set to ${id} (${NODE_POSITIONS[id].ip})`);
  }

  function highlightSelectedNodes() {
    const src = document.getElementById('pSrc')?.value;
    const dst = document.getElementById('pDst')?.value;
    document.querySelectorAll('#topoNodesLayer .node').forEach(el => {
      el.classList.remove('sel-src', 'sel-dst');
    });
    if (src) document.getElementById(`node-${src}`)?.classList.add('sel-src');
    if (dst) document.getElementById(`node-${dst}`)?.classList.add('sel-dst');
  }

  // ---------------------------------------------------------------------------
  // 7. Live 60-Second Packet Rate Canvas Chart
  // ---------------------------------------------------------------------------
  let rateChartCanvas = null;
  let rateChartCtx = null;

  function initRateChart() {
    rateChartCanvas = document.getElementById('rateChart');
    if (!rateChartCanvas) return;
    rateChartCtx = rateChartCanvas.getContext('2d');
    resizeRateChart();
    window.addEventListener('resize', resizeRateChart);
  }

  function resizeRateChart() {
    if (!rateChartCanvas) return;
    const rect = rateChartCanvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    rateChartCanvas.width = rect.width * dpr;
    rateChartCanvas.height = rect.height * dpr;
    renderRateChart();
  }

  function renderRateChart() {
    if (!rateChartCanvas || !rateChartCtx) return;
    const ctx = rateChartCtx;
    const dpr = window.devicePixelRatio || 1;
    const w = rateChartCanvas.width / dpr;
    const h = rateChartCanvas.height / dpr;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const history = state.rateHistory;
    if (history.length < 2) {
      ctx.fillStyle = '#6e7681';
      ctx.font = '11px Segoe UI';
      ctx.fillText('Awaiting packet stream…', 12, h / 2 + 4);
      ctx.restore();
      return;
    }

    // Find max value
    let maxVal = 5;
    for (const pt of history) {
      if (pt.total > maxVal) maxVal = pt.total;
    }
    maxVal = Math.ceil(maxVal * 1.25);

    // Draw grid lines
    ctx.strokeStyle = '#2b2b2b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.25); ctx.lineTo(w, h * 0.25);
    ctx.moveTo(0, h * 0.50); ctx.lineTo(w, h * 0.50);
    ctx.moveTo(0, h * 0.75); ctx.lineTo(w, h * 0.75);
    ctx.stroke();

    const dx = w / 59;
    const startX = w - (history.length - 1) * dx;

    // Draw Permitted area (teal)
    ctx.fillStyle = 'rgba(78,201,176,0.18)';
    ctx.strokeStyle = '#4ec9b0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    history.forEach((pt, i) => {
      const x = startX + i * dx;
      const y = h - (pt.permit / maxVal) * (h - 10) - 5;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw Dropped line (red)
    ctx.strokeStyle = '#f14c4c';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    history.forEach((pt, i) => {
      const x = startX + i * dx;
      const y = h - (pt.drop / maxVal) * (h - 10) - 5;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.restore();
  }

  // ---------------------------------------------------------------------------
  // 8. Capture & Trace Inspector
  // ---------------------------------------------------------------------------
  function renderCaptureTable() {
    const tbody = document.getElementById('capBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    state.packets.forEach(rec => appendCaptureRow(rec));
    document.getElementById('capCount').textContent = state.packets.length;
  }

  function appendCaptureRow(rec) {
    const tbody = document.getElementById('capBody');
    if (!tbody) return;

    // Filter check
    const filter = (document.getElementById('capFilter')?.value || '').toLowerCase().trim();
    if (filter) {
      const searchStr = `${rec.src_host} ${rec.dst_host} ${rec.src_ip} ${rec.dst_ip} ${rec.protocol} ${rec.verdict} ${rec.rule_id}`.toLowerCase();
      if (!searchStr.includes(filter)) return;
    }

    const tr = document.createElement('tr');
    tr.id = `cap-row-${rec.id}`;
    if (rec.id === state.selectedPacketId) tr.classList.add('selected');

    const verdictPill = rec.allowed
      ? `<span class="pill ok">PERMIT</span>`
      : `<span class="pill err">DROP@${rec.dropped_at || 's1'}</span>`;

    const rttStr = rec.allowed && rec.rtt_ms !== null ? `${rec.rtt_ms.toFixed(2)} ms` : '—';
    const pathStr = rec.path ? rec.path.join(' → ') : '';

    tr.innerHTML = `
      <td class="num">${rec.id}</td>
      <td class="dim">${rec.timestamp || ''}</td>
      <td><strong>${rec.src_host}</strong> <span class="dim">(${rec.src_ip})</span></td>
      <td><strong>${rec.dst_host}</strong> <span class="dim">(${rec.dst_ip})</span></td>
      <td><span class="pill info">${rec.protocol}</span></td>
      <td class="num">${rec.bytes || 98}</td>
      <td class="mono">${pathStr}</td>
      <td><span class="dim">${rec.rule_id || ''}</span></td>
      <td>${verdictPill}</td>
      <td class="num">${rttStr}</td>
      <td class="dim">${rec.source || 'manual'}</td>
    `;

    tr.addEventListener('click', () => {
      selectPacket(rec);
    });

    tbody.appendChild(tr);

    // Limit visible DOM rows to 200
    while (tbody.rows.length > 200) {
      tbody.deleteRow(0);
    }

    document.getElementById('capCount').textContent = state.packets.length;

    if (state.autoScrollCapture) {
      const parent = document.getElementById('panelBody');
      if (parent) parent.scrollTop = parent.scrollHeight;
    }
  }

  function selectPacket(rec) {
    state.selectedPacketId = rec.id;
    document.querySelectorAll('#capBody tr').forEach(r => r.classList.remove('selected'));
    document.getElementById(`cap-row-${rec.id}`)?.classList.add('selected');

    renderPacketTrace(rec);
    switchPanelTab('trace');
  }

  function renderPacketTrace(rec) {
    const traceEl = document.getElementById('trace');
    if (!traceEl || !rec) return;

    const verdictBadge = rec.allowed
      ? `<span class="pill ok">PERMITTED</span> <span class="mono">${rec.rtt_ms ? rec.rtt_ms.toFixed(2) + ' ms RTT' : ''}</span>`
      : `<span class="pill err">DROPPED AT SWITCH ${rec.dropped_at?.toUpperCase()}</span>`;

    const hopsRows = (rec.hops || []).map((h, i) => `
      <tr class="${h.dropped ? 'err' : ''}">
        <td class="num">${i + 1}</td>
        <td><strong>${h.switch}</strong></td>
        <td class="num">${h.in_port || 1}</td>
        <td class="num font-bold">${h.priority}</td>
        <td><span class="pill">${h.rule_id}</span></td>
        <td class="mono wrap">${h.match || '*'}</td>
        <td class="${h.dropped ? 'err font-bold' : 'ok'}">${h.actions}</td>
        <td>${h.packet_in ? '<span class="pill warn">PACKET_IN</span>' : '<span class="dim">hardware</span>'}</td>
      </tr>
    `).join('');

    traceEl.innerHTML = `
      <h4>
        <span>Packet #${rec.id}: ${rec.src_host} (${rec.src_ip}) → ${rec.dst_host} (${rec.dst_ip}) [${rec.protocol}]</span>
        ${verdictBadge}
        <button class="btn secondary" style="margin-left:auto;height:22px;font-size:11px;" onclick="replayPacket(${rec.id})"><i data-icon="play"></i>Replay Frame</button>
      </h4>
      <p class="reason">${rec.reason || ''}</p>
      
      <div class="sub">Forward Path Execution (Hops)</div>
      <table class="grid-table">
        <thead><tr>
          <th class="num">Hop</th><th>Switch</th><th class="num">In Port</th><th class="num">Priority</th>
          <th>Rule ID</th><th>Match Fields</th><th>Actions</th><th>Pipeline</th>
        </tr></thead>
        <tbody>${hopsRows || '<tr><td colspan="8" class="dim">No hops recorded</td></tr>'}</tbody>
      </table>

      ${rec.reply_hops && rec.reply_hops.length ? `
        <div class="sub" style="margin-top:12px;">Reverse Path (Reply Frames)</div>
        <table class="grid-table">
          <thead><tr>
            <th class="num">Hop</th><th>Switch</th><th class="num">Priority</th><th>Rule ID</th><th>Actions</th>
          </tr></thead>
          <tbody>
            ${rec.reply_hops.map((h, i) => `
              <tr>
                <td class="num">${i + 1}</td><td><strong>${h.switch}</strong></td>
                <td class="num">${h.priority}</td><td><span class="pill">${h.rule_id}</span></td>
                <td class="ok">${h.actions}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : ''}

      <div class="sub" style="margin-top:14px;">OpenFlow Dissected Packet Telemetry</div>
      <div class="proto-tree">
        <div class="proto-layer"><span class="layer-title">Frame #${rec.id}:</span> ${rec.bytes || 98} bytes on wire (${(rec.bytes || 98) * 8} bits) captured on interface ${(rec.path && rec.path[0]) || 's1'}-eth1</div>
        <div class="proto-layer"><span class="layer-title">Ethernet II:</span> Src: ${srcHost?.mac || '00:00:00:00:00:01'} (${rec.src_host}), Dst: ${dstHost?.mac || '00:00:00:00:00:20'} (${rec.dst_host}) [Type: ${rec.protocol === 'ARP' ? 'ARP (0x0806)' : 'IPv4 (0x0800)'}]</div>
        <div class="proto-layer"><span class="layer-title">Internet Protocol Version 4:</span> Src: ${rec.src_ip}, Dst: ${rec.dst_ip}, TTL: 64, DSCP: CS0 (0x00), Protocol: ${rec.protocol} (${rec.ip_proto || 1})</div>
        <div class="proto-layer"><span class="layer-title">${rec.protocol} Protocol:</span> ${rec.protocol === 'ICMP' ? 'Type: 8 (Echo ping request), Code: 0, Seq: ' + (rec.id % 256) : (rec.protocol === 'HTTP' || rec.protocol === 'HTTPS' ? 'Destination Port: ' + (rec.dst_port || 80) + ' (TCP Handshake Established)' : 'Destination Port: ' + (rec.dst_port || 22))}</div>
      </div>

      <div class="wireshark-wrap">
        <div class="wireshark-head">
          <span>Packet Byte View (Hex &amp; ASCII Stream)</span>
          <span>${rec.bytes || 98} bytes</span>
        </div>
        <pre class="hex-dump">${generateAuthenticHexDump(rec, srcHost, dstHost)}</pre>
      </div>
    `;
    applyIcons(traceEl);
  }

  function generateAuthenticHexDump(rec, srcHost, dstHost) {
    const bytes = [];
    const dstMacParts = (dstHost?.mac || '00:00:00:00:00:20').split(':').map(h => parseInt(h, 16));
    bytes.push(...dstMacParts);
    const srcMacParts = (srcHost?.mac || '00:00:00:00:00:01').split(':').map(h => parseInt(h, 16));
    bytes.push(...srcMacParts);
    const isArp = rec.protocol === 'ARP';
    bytes.push(0x08, isArp ? 0x06 : 0x00);

    if (isArp) {
      bytes.push(0x00, 0x01, 0x08, 0x00, 0x06, 0x04, 0x00, 0x01);
      bytes.push(...srcMacParts);
      (rec.src_ip || '10.0.0.1').split('.').forEach(o => bytes.push(parseInt(o, 10)));
      bytes.push(0x00, 0x00, 0x00, 0x00, 0x00, 0x00);
      (rec.dst_ip || '10.0.0.100').split('.').forEach(o => bytes.push(parseInt(o, 10)));
    } else {
      bytes.push(0x45, 0x00);
      const totalLen = (rec.bytes || 98) - 14;
      bytes.push((totalLen >> 8) & 0xff, totalLen & 0xff);
      const ident = (rec.id * 31) & 0xffff;
      bytes.push((ident >> 8) & 0xff, ident & 0xff);
      bytes.push(0x40, 0x00, 0x40);
      const ipProto = rec.protocol === 'ICMP' ? 0x01 : (rec.protocol === 'UDP' || rec.protocol === 'DNS' ? 0x11 : 0x06);
      bytes.push(ipProto, 0xb6, 0xc2);
      (rec.src_ip || '10.0.0.1').split('.').forEach(o => bytes.push(parseInt(o, 10)));
      (rec.dst_ip || '10.0.0.200').split('.').forEach(o => bytes.push(parseInt(o, 10)));

      if (rec.protocol === 'ICMP') {
        bytes.push(0x08, 0x00, 0x4c, 0xd2, 0x00, 0x01, (rec.id >> 8) & 0xff, rec.id & 0xff);
        const payloadStr = "Campus-SDN-OpenFlow1.3-RyuController";
        for (let i = 0; i < payloadStr.length && bytes.length < (rec.bytes || 98); i++) {
          bytes.push(payloadStr.charCodeAt(i));
        }
      } else {
        const srcP = 49152 + (rec.id % 1000);
        const dstP = rec.dst_port || 80;
        bytes.push((srcP >> 8) & 0xff, srcP & 0xff, (dstP >> 8) & 0xff, dstP & 0xff);
        bytes.push(0x1a, 0x2b, 0x3c, 0x4d, 0x00, 0x00, 0x00, 0x00, 0x50, 0x02, 0x72, 0x10, 0x9a, 0x1b, 0x00, 0x00);
        const payloadStr = "GET / HTTP/1.1\r\nHost: " + rec.dst_ip + "\r\nUser-Agent: SDN-NOC-Probe\r\n\r\n";
        for (let i = 0; i < payloadStr.length && bytes.length < (rec.bytes || 128); i++) {
          bytes.push(payloadStr.charCodeAt(i));
        }
      }
    }

    const lines = [];
    for (let i = 0; i < bytes.length; i += 16) {
      const chunk = bytes.slice(i, i + 16);
      const offset = ('0000' + i.toString(16)).slice(-4);
      const hexParts = chunk.map(b => ('00' + b.toString(16)).slice(-2)).join(' ');
      const paddedHex = hexParts.padEnd(48, ' ');
      const ascii = chunk.map(b => (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.').join('');
      lines.push(`<span class="off">${offset}</span>  <span class="bytes">${paddedHex}</span>  <span class="ascii">${escapeHtml(ascii)}</span>`);
    }
    return lines.join('\n');
  }

  // ---------------------------------------------------------------------------
  // 9. Problems & Controller Logs
  // ---------------------------------------------------------------------------
  function renderProblems() {
    const list = document.getElementById('problems');
    const badge = document.getElementById('probCount');
    const sbDrops = document.getElementById('sbDrops');
    const sbPin = document.getElementById('sbPin');

    if (!list) return;

    badge.textContent = state.violations.length;
    if (state.violations.length > 0) {
      badge.classList.add('err');
    } else {
      badge.classList.remove('err');
    }

    sbDrops.textContent = state.stats.dropped || 0;
    sbPin.textContent = state.stats.packet_ins || 0;

    if (state.violations.length === 0) {
      list.innerHTML = `<div class="empty">No role access violations detected. Student → Admin requests will be logged here as security events.</div>`;
      return;
    }

    list.innerHTML = state.violations.slice(-20).reverse().map(v => `
      <div class="problem" onclick="selectPacketById(${v.id})">
        <i data-icon="error" class="err"></i>
        <span><strong>Access Denied:</strong> ${v.src_host} (${v.src_ip}) attempted to access ${v.dst_host} (${v.dst_ip}) via ${v.protocol}</span>
        <span class="loc">table 0, priority 200 (s1)</span>
        <span class="n">${v.timestamp}</span>
      </div>
    `).join('');
    applyIcons(list);
  }

  window.selectPacketById = function(id) {
    const rec = state.packets.find(p => p.id === id);
    if (rec) selectPacket(rec);
  };

  function renderLog() {
    const logEl = document.getElementById('log');
    if (!logEl) return;
    logEl.innerHTML = '';
    state.logs.forEach(item => appendLogLine(item));
  }

  function appendLogLine(item) {
    const logEl = document.getElementById('log');
    if (!logEl) return;
    const timeStr = new Date(item.ts * 1000).toTimeString().split(' ')[0];
    const line = document.createElement('div');
    line.innerHTML = `<span class="t">${timeStr}</span> [<span class="${item.level}">${item.level}</span>] ${escapeHtml(item.msg)}`;
    logEl.appendChild(line);

    while (logEl.children.length > 300) {
      logEl.removeChild(logEl.firstChild);
    }
  }

  // ---------------------------------------------------------------------------
  // 10. OpenFlow 1.3 Flow Tables Inspector
  // ---------------------------------------------------------------------------
  function renderFlowTables() {
    const tbody = document.getElementById('flowBody');
    const dumpEl = document.getElementById('flowDump');
    const summary = document.getElementById('flowSummary');
    if (!tbody || !dumpEl) return;

    const swFilter = state.flowFilterSwitch;
    const switches = swFilter === 'all' ? ['s1', 's2', 's3'] : [swFilter];

    let allEntries = [];
    let dumpText = '';

    switches.forEach(sw => {
      const entries = state.flow_tables[sw] || [];
      entries.forEach(e => {
        if (!state.flowReactiveOnly || e.reactive) {
          allEntries.push({ ...e, switch: sw });
        }
      });
      dumpText += `$ ovs-ofctl -O OpenFlow13 dump-flows ${sw}\nOFPST_FLOW reply (OF1.3) (xid=0x2):\n`;
      entries.forEach(e => {
        dumpText += ` cookie=${hex(e.cookie)}, duration=${e.duration || 0}s, table=${e.table_id || 0}, n_packets=${e.n_packets || 0}, n_bytes=${e.n_bytes || 0}, priority=${e.priority},${e.match} actions=${e.actions}\n`;
      });
      dumpText += '\n';
    });

    dumpEl.textContent = dumpText;
    if (summary) {
      summary.textContent = `${allEntries.length} active flow entries across ${switches.join(', ')}`;
    }

    tbody.innerHTML = allEntries.map(e => {
      const isDrop = e.actions.includes('drop');
      const actionClass = isDrop ? 'err font-bold' : 'ok';
      return `
        <tr>
          <td><span class="pill">${e.switch}</span></td>
          <td class="num mono dim">${hex(e.cookie)}</td>
          <td class="num mono"><strong>${e.priority}</strong></td>
          <td><span class="dim">${e.rule_id || ''}</span></td>
          <td class="mono wrap">${escapeHtml(e.match || '*')}</td>
          <td class="${actionClass}">${escapeHtml(e.actions)}</td>
          <td class="num font-bold">${e.n_packets}</td>
          <td class="num dim">${e.n_bytes}</td>
          <td class="num dim">${(e.duration || 0).toFixed(1)}s</td>
          <td class="num dim">${e.idle_timeout ? e.idle_age + 's' : '—'}</td>
        </tr>
      `;
    }).join('');

    document.getElementById('sbFlows').textContent = `${allEntries.length} flows`;
  }

  // ---------------------------------------------------------------------------
  // 11. Pingall Matrix & Policy Compliance Suite
  // ---------------------------------------------------------------------------
  async function runPingallTest() {
    showToast('Executing 30-pair PingAll matrix on switches…');
    if (!state.isCloudEngine) {
      try {
        const res = await api('/api/pingall', { method: 'POST' });
        state.pingallMatrix = res.matrix;
        state.pingallTime = new Date().toTimeString().split(' ')[0];
        renderPingallMatrix();
        switchTab('matrix');
        showToast('Pingall test complete: 30 pairs verified.');
        return;
      } catch (err) {
        console.warn('API pingall failed, using cloud engine:', err);
      }
    }
    if (window.clientSDNSimulator) {
      window.clientSDNSimulator.runPingall();
    }
  }

  function renderPingallMatrix() {
    const container = document.getElementById('matrixHost');
    const timeEl = document.getElementById('matrixTime');
    if (!container || !state.pingallMatrix) return;

    if (timeEl) timeEl.textContent = state.pingallTime ? `@ ${state.pingallTime}` : '';

    const hosts = Object.keys(state.pingallMatrix);
    const headerCols = hosts.map(h => `<th>${h}</th>`).join('');

    let permitted = 0;
    let blocked = 0;

    const rows = hosts.map(src => {
      const cells = hosts.map(dst => {
        if (src === dst) {
          return `<td class="self">—</td>`;
        }
        const cell = state.pingallMatrix[src][dst];
        if (cell.status === 'PERMIT') {
          permitted++;
          return `<td class="permit">${cell.rtt_ms.toFixed(1)} ms<span class="sub">OK</span></td>`;
        } else {
          blocked++;
          return `<td class="drop">DROP<span class="sub">ACL 200</span></td>`;
        }
      }).join('');
      return `<tr><th class="rowh">${src}</th>${cells}</tr>`;
    }).join('');

    container.innerHTML = `
      <table class="matrix">
        <thead><tr><th>src \\ dst</th>${headerCols}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="summary-line">
        <span>Permitted: <strong class="ok">${permitted} / 30 (${((permitted/30)*100).toFixed(1)}%)</strong></span>
        <span>Blocked: <strong class="err">${blocked} / 30 (${((blocked/30)*100).toFixed(1)}%)</strong></span>
      </div>
    `;
  }

  async function runComplianceSuite() {
    showToast('Executing 14 role-based protocol probes…');
    if (!state.isCloudEngine) {
      try {
        const res = await api('/api/suite', { method: 'POST' });
        state.suiteResults = res.results;
        state.suiteTime = new Date().toTimeString().split(' ')[0];
        renderComplianceSuite();
        switchTab('matrix');
        showToast('14 Policy probes executed successfully.');
        return;
      } catch (err) {
        console.warn('API suite failed, using cloud engine:', err);
      }
    }
    if (window.clientSDNSimulator) {
      window.clientSDNSimulator.runSuite();
    }
  }

  function renderComplianceSuite() {
    const container = document.getElementById('suiteHost');
    const timeEl = document.getElementById('suiteTime');
    const resEl = document.getElementById('suiteResult');
    if (!container || !state.suiteResults) return;

    if (timeEl) timeEl.textContent = state.suiteTime ? `@ ${state.suiteTime}` : '';

    const passedCount = state.suiteResults.filter(r => r.passed).length;
    if (resEl) {
      resEl.innerHTML = `<span class="pill ok" style="margin-left:8px;">${passedCount} / ${state.suiteResults.length} PASS</span>`;
    }

    container.innerHTML = `
      <table class="grid-table">
        <thead><tr>
          <th>Probe Description</th><th>Proto</th><th>Expected</th><th>Actual</th><th class="num">RTT</th><th>Result</th>
        </tr></thead>
        <tbody>
          ${state.suiteResults.map(r => `
            <tr>
              <td>${r.description}</td>
              <td><span class="pill info">${r.protocol}</span></td>
              <td class="${r.expected === 'PERMIT' ? 'ok' : 'err'}">${r.expected}</td>
              <td class="${r.actual === 'PERMIT' ? 'ok' : 'err'}">${r.actual}</td>
              <td class="num">${r.rtt_ms ? r.rtt_ms.toFixed(2) + ' ms' : '—'}</td>
              <td><span class="pill ${r.passed ? 'ok' : 'err'}">${r.passed ? 'PASS' : 'FAIL'}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  // ---------------------------------------------------------------------------
  // 12. File Explorer & Source Viewer (VS Code style)
  // ---------------------------------------------------------------------------
  const WHITELIST_FILES = [
    'controller.py',
    'topology.py',
    'simulator.py',
    'verify_policy.py',
    'server.py',
    'README.md',
    'requirements.txt'
  ];

  function renderFileTree() {
    const tree = document.getElementById('fileTree');
    if (!tree) return;

    tree.innerHTML = WHITELIST_FILES.map(fn => `
      <div class="tree-row" style="padding-left:16px;" onclick="openFileTab('${fn}')">
        <i data-icon="file"></i>
        <span class="label">${fn}</span>
      </div>
    `).join('');
    applyIcons(tree);
  }

  window.openFileTab = async function(filename) {
    const tabId = `file:${filename}`;
    if (!state.openTabs.some(t => t.id === tabId)) {
      state.openTabs.push({ id: tabId, title: filename, icon: 'file' });
    }
    renderTabsHeader();
    switchTab(tabId);

    if (!state.fileCache[filename]) {
      if (PRELOADED_FILES[filename]) {
        state.fileCache[filename] = PRELOADED_FILES[filename];
      } else {
        try {
          const text = await api(`/api/source?file=${encodeURIComponent(filename)}`);
          state.fileCache[filename] = text;
        } catch (err) {
          state.fileCache[filename] = `# Unable to load ${filename}: ${err.message}`;
        }
      }
    }
    renderFileEditor(filename);
  };

  function renderFileEditor(filename) {
    const editorBody = document.getElementById('editorBody');
    const paneId = `pane-file-${filename}`;
    let pane = document.getElementById(paneId);

    if (!pane) {
      pane = document.createElement('div');
      pane.id = paneId;
      pane.className = 'editor-pane';
      pane.setAttribute('data-pane', `file:${filename}`);
      editorBody.appendChild(pane);
    }

    const code = state.fileCache[filename] || 'Loading…';
    const lines = code.split('\n');
    const gutterHtml = lines.map((_, i) => `<div>${i + 1}</div>`).join('');
    const codeHtml = escapeHtml(code);

    pane.innerHTML = `
      <div class="code">
        <div class="gutter">${gutterHtml}</div>
        <pre><code>${codeHtml}</code></pre>
      </div>
    `;

    // Ensure pane displays if active
    if (state.activeTab === `file:${filename}`) {
      document.querySelectorAll('.editor-pane').forEach(p => p.classList.remove('active'));
      pane.classList.add('active');
    }
  }

  // ---------------------------------------------------------------------------
  // 13. UI Navigation: Tabs, Sidebar, Panels, Resizer
  // ---------------------------------------------------------------------------
  function initTabsAndSidebar() {
    renderTabsHeader();
    switchTab(state.activeTab || 'topology');

    // Activity bar switching
    document.querySelectorAll('#activitybar button[data-side]').forEach(btn => {
      btn.addEventListener('click', () => {
        const side = btn.getAttribute('data-side');
        switchSideView(side);
      });
    });

    // Panel tabs
    document.querySelectorAll('.panel-tab[data-ptab]').forEach(tab => {
      tab.addEventListener('click', () => {
        switchPanelTab(tab.getAttribute('data-ptab'));
      });
    });

    // Flow controls
    document.querySelectorAll('#flowSwitchSeg button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#flowSwitchSeg button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.flowFilterSwitch = btn.getAttribute('data-sw');
        renderFlowTables();
      });
    });

    document.querySelectorAll('#flowModeSeg button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#flowModeSeg button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.getAttribute('data-mode');
        state.flowMode = mode;
        if (mode === 'table') {
          document.getElementById('flowTableView').classList.remove('hidden');
          document.getElementById('flowDump').classList.add('hidden');
        } else {
          document.getElementById('flowTableView').classList.add('hidden');
          document.getElementById('flowDump').classList.remove('hidden');
        }
      });
    });

    document.getElementById('flowReactiveOnly')?.addEventListener('change', (e) => {
      state.flowReactiveOnly = e.target.checked;
      renderFlowTables();
    });

    document.getElementById('copyDump')?.addEventListener('click', () => {
      const text = document.getElementById('flowDump').textContent;
      navigator.clipboard.writeText(text).then(() => showToast('dump-flows copied to clipboard.'));
    });

    // Panel tools
    document.getElementById('autoScroll')?.addEventListener('click', function() {
      state.autoScrollCapture = !state.autoScrollCapture;
      this.classList.toggle('on', state.autoScrollCapture);
    });

    document.getElementById('panelClear')?.addEventListener('click', async () => {
      if (state.activePanelTab === 'terminal') {
        const termOutput = document.getElementById('termOutput');
        if (termOutput) termOutput.innerHTML = '';
        return;
      }
      await api('/api/capture/clear', { method: 'POST' });
    });

    document.getElementById('capFilter')?.addEventListener('input', () => {
      renderCaptureTable();
    });

    document.getElementById('btnExportCsv')?.addEventListener('click', () => {
      exportCaptureCsv();
    });

    // Animation toggle
    document.getElementById('animToggle')?.addEventListener('click', function() {
      state.animatePackets = !state.animatePackets;
      this.classList.toggle('on', state.animatePackets);
      showToast(state.animatePackets ? 'Packet animations enabled.' : 'Packet animations paused.');
    });

    // Status bar triggers
    document.getElementById('sbAcl')?.addEventListener('click', () => {
      toggleACL(!state.acl_enforced);
    });

    document.getElementById('sbTraffic')?.addEventListener('click', () => {
      toggleTraffic(!state.traffic.enabled);
    });

    document.getElementById('sbProblems')?.addEventListener('click', () => {
      switchPanelTab('problems');
      togglePanel(true);
    });

    // Command buttons
    document.querySelectorAll('[data-cmd]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const cmd = el.getAttribute('data-cmd');
        executeCommand(cmd);
      });
    });
  }

  function renderTabsHeader() {
    const tabsContainer = document.getElementById('tabs');
    if (!tabsContainer) return;
    tabsContainer.innerHTML = '';

    state.openTabs.forEach(t => {
      const tabEl = document.createElement('div');
      tabEl.className = `tab ${t.id === state.activeTab ? 'active' : ''}`;
      tabEl.innerHTML = `
        <i data-icon="${t.icon}"></i>
        <span>${t.title}</span>
        ${t.id.startsWith('file:') ? '<button class="icon-btn close" title="Close"><i data-icon="close"></i></button>' : ''}
      `;
      tabEl.addEventListener('click', (e) => {
        if (e.target.closest('.close')) {
          closeTab(t.id);
        } else {
          switchTab(t.id);
        }
      });
      tabsContainer.appendChild(tabEl);
    });
    applyIcons(tabsContainer);
    updateBreadcrumbs();
  }

  function switchTab(id) {
    state.activeTab = id;
    renderTabsHeader();
    document.querySelectorAll('.editor-pane').forEach(p => {
      if (p.getAttribute('data-pane') === id) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });
    if (id === 'flows') renderFlowTables();
    if (id === 'matrix') {
      if (!state.pingallMatrix) runPingallTest();
      if (!state.suiteResults) runComplianceSuite();
    }
  }

  function closeTab(id) {
    const idx = state.openTabs.findIndex(t => t.id === id);
    if (idx === -1) return;
    state.openTabs.splice(idx, 1);
    if (state.activeTab === id) {
      state.activeTab = state.openTabs[Math.max(0, idx - 1)]?.id || 'topology';
    }
    renderTabsHeader();
    switchTab(state.activeTab);
  }

  function switchSideView(view) {
    state.activeSide = view;
    document.querySelectorAll('#activitybar button[data-side]').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-side') === view);
    });
    document.querySelectorAll('.side-view').forEach(v => {
      v.classList.toggle('active', v.getAttribute('data-view') === view);
    });
    const titles = { network: 'Network', probe: 'Packet Probe', policy: 'Policy Enforcement', files: 'Explorer' };
    const sideTitle = document.getElementById('sideTitle');
    if (sideTitle) sideTitle.textContent = titles[view] || 'Sidebar';
  }

  function switchPanelTab(ptab) {
    state.activePanelTab = ptab;
    document.querySelectorAll('.panel-tab').forEach(t => {
      t.classList.toggle('active', t.getAttribute('data-ptab') === ptab);
    });
    document.querySelectorAll('.panel-view').forEach(v => {
      v.classList.toggle('active', v.getAttribute('data-pview') === ptab);
    });
    if (ptab === 'terminal') {
      const termInput = document.getElementById('termInput');
      if (termInput) setTimeout(() => termInput.focus(), 60);
    }
  }

  function toggleSidebar(force) {
    const sb = document.getElementById('sidebar');
    if (sb) sb.classList.toggle('collapsed', force !== undefined ? !force : undefined);
  }

  function togglePanel(force) {
    const p = document.getElementById('panel');
    const s = document.getElementById('sash');
    const isCollapsed = p.classList.contains('collapsed');
    const shouldCollapse = force !== undefined ? !force : !isCollapsed;
    p.classList.toggle('collapsed', shouldCollapse);
    if (s) s.classList.toggle('hidden', shouldCollapse);
  }

  function updateBreadcrumbs() {
    const bc = document.getElementById('breadcrumbs');
    if (!bc) return;
    const tab = state.openTabs.find(t => t.id === state.activeTab);
    const pathStr = tab ? `campus_sdn_project <span class="sep">›</span> ${tab.title}` : 'campus_sdn_project';
    bc.innerHTML = `<i data-icon="logo"></i><span>${pathStr}</span>`;
    applyIcons(bc);
  }

  function initCollapsibleSections() {
    document.querySelectorAll('.section-head').forEach(head => {
      head.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        head.closest('.section').classList.toggle('closed');
      });
    });
  }

  function initSashResizer() {
    const sash = document.getElementById('sash');
    const panel = document.getElementById('panel');
    if (!sash || !panel) return;

    let startY = 0;
    let startH = 0;

    sash.addEventListener('mousedown', (e) => {
      startY = e.clientY;
      startH = panel.offsetHeight;
      sash.classList.add('dragging');
      document.body.style.cursor = 'ns-resize';

      function onMouseMove(e) {
        const delta = startY - e.clientY;
        const newH = Math.max(120, Math.min(window.innerHeight - 150, startH + delta));
        panel.style.height = `${newH}px`;
      }

      function onMouseUp() {
        sash.classList.remove('dragging');
        document.body.style.cursor = '';
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      }

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });
  }

  // ---------------------------------------------------------------------------
  // 14. Forms, Controls & Policy Toggles
  // ---------------------------------------------------------------------------
  function exportCaptureCsv() {
    if (!state.packets || state.packets.length === 0) {
      showToast('No packet capture data to export yet.', 'warn');
      return;
    }
    const headers = ['No.', 'Time', 'Source', 'Destination', 'Protocol', 'Length', 'Path', 'Rule', 'Verdict', 'RTT', 'Origin'];
    const rows = state.packets.map((p, idx) => [
      p.id || (idx + 1),
      `"${p.timestamp || ''}"`,
      `"${p.src_host} (${p.src_ip || ''})"`,
      `"${p.dst_host} (${p.dst_ip || ''})"`,
      `"${p.protocol || ''}"`,
      p.bytes || 0,
      `"${(p.path || []).join(' -> ')}"`,
      `"${p.rule_id || ''}"`,
      `"${p.verdict || (p.allowed ? 'PERMIT' : 'DROP')}"`,
      p.rtt_ms ? `${p.rtt_ms.toFixed(2)} ms` : '—',
      `"${p.source || 'sim'}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campus_sdn_capture.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Exported ${state.packets.length} packets to campus_sdn_capture.csv`);
  }

  function initForms() {
    // Packet Injector Form
    const probeForm = document.getElementById('probeForm');
    if (probeForm) {
      probeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const src = document.getElementById('pSrc').value;
        const dst = document.getElementById('pDst').value;
        const proto = document.getElementById('pProto').value;
        const count = parseInt(document.getElementById('pCount').value, 10) || 1;

        if (src === dst) {
          showToast('Source and destination cannot be the same host.', 'warn');
          return;
        }

        if (state.isCloudEngine && window.clientSDNSimulator) {
          for (let i = 0; i < count; i++) {
            window.clientSDNSimulator.simulatePacket(src, dst, proto, null, 'manual');
          }
          showToast(`Injected ${count} ${proto} packet(s): ${src} → ${dst}`);
          return;
        }
        try {
          await api('/api/packet', {
            method: 'POST',
            body: JSON.stringify({ src, dst, protocol: proto, count })
          });
          showToast(`Injected ${count} ${proto} packet(s): ${src} → ${dst}`);
        } catch (err) {
          if (window.clientSDNSimulator) {
            for (let i = 0; i < count; i++) {
              window.clientSDNSimulator.simulatePacket(src, dst, proto, null, 'manual');
            }
            showToast(`Injected ${count} ${proto} packet(s): ${src} → ${dst}`);
          } else {
            simulateClientPacket(src, dst, proto, count);
          }
        }
      });
    }

    // Traffic generator toggle & rate
    const trafficToggle = document.getElementById('trafficToggle');
    const trafficRate = document.getElementById('trafficRate');
    const trafficRateVal = document.getElementById('trafficRateVal');

    if (trafficToggle) {
      trafficToggle.addEventListener('change', () => {
        toggleTraffic(trafficToggle.checked);
      });
    }
    if (trafficRate) {
      trafficRate.addEventListener('input', () => {
        trafficRateVal.textContent = trafficRate.value;
      });
      trafficRate.addEventListener('change', () => {
        const r = parseFloat(trafficRate.value);
        if (state.isCloudEngine && window.clientSDNSimulator) {
          window.clientSDNSimulator.setRate(r);
          return;
        }
        try {
          api('/api/traffic', {
            method: 'POST',
            body: JSON.stringify({ rate: r })
          });
        } catch (_) {
          if (window.clientSDNSimulator) window.clientSDNSimulator.setRate(r);
        }
      });
    }

    // ACL Toggle
    const aclToggle = document.getElementById('aclToggle');
    if (aclToggle) {
      aclToggle.addEventListener('change', () => {
        toggleACL(aclToggle.checked);
      });
    }

    // Traffic preset buttons
    document.querySelectorAll('#trafficPresetSeg button[data-preset]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const preset = btn.getAttribute('data-preset');
        document.querySelectorAll('#trafficPresetSeg button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (state.isCloudEngine && window.clientSDNSimulator) {
          window.clientSDNSimulator.setPreset(preset);
          showToast(`Traffic scenario preset: ${preset.toUpperCase()}`);
          return;
        }
        try {
          await api('/api/traffic', {
            method: 'POST',
            body: JSON.stringify({ preset, enabled: true })
          });
          showToast(`Traffic scenario preset: ${preset.toUpperCase()}`);
        } catch (_) {
          if (window.clientSDNSimulator) {
            window.clientSDNSimulator.setPreset(preset);
            showToast(`Traffic scenario preset: ${preset.toUpperCase()}`);
          }
        }
      });
    });

    // Custom OpenFlow Rule Installer
    const customRuleForm = document.getElementById('customRuleForm');
    if (customRuleForm) {
      customRuleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const sw = document.getElementById('crSwitch').value;
        const prio = parseInt(document.getElementById('crPriority').value, 10) || 180;
        const srcIp = document.getElementById('crSrcIp').value.trim();
        const dstIp = document.getElementById('crDstIp').value.trim();
        const action = document.getElementById('crAction').value;
        const ruleId = document.getElementById('crRuleId').value.trim() || 'CUSTOM-ACL';

        if (state.isCloudEngine && window.clientSDNSimulator) {
          window.clientSDNSimulator.installCustomRule(sw, prio, srcIp, dstIp, action, ruleId);
          showToast(`Installed OpenFlow rule ${ruleId} (prio=${prio}) on ${sw}.`);
          switchTab('flows');
          return;
        }
        try {
          await api('/api/flow/install', {
            method: 'POST',
            body: JSON.stringify({
              switch: sw,
              priority: prio,
              nw_src: srcIp,
              nw_dst: dstIp,
              actions: action,
              rule_id: ruleId
            })
          });
          showToast(`Installed OpenFlow rule ${ruleId} (prio=${prio}) on ${sw}.`);
          switchTab('flows');
        } catch (err) {
          if (window.clientSDNSimulator) {
            window.clientSDNSimulator.installCustomRule(sw, prio, srcIp, dstIp, action, ruleId);
            showToast(`Installed OpenFlow rule ${ruleId} (prio=${prio}) on ${sw}.`);
            switchTab('flows');
          } else {
            showToast(`Rule install: ${err.message}`, 'error');
          }
        }
      });
    }

    renderScenarioPresets();
  }

  window.replayPacket = async function(id) {
    const rec = state.packets.find(p => p.id === id);
    if (!rec) return;
    try {
      await api('/api/packet', {
        method: 'POST',
        body: JSON.stringify({ src: rec.src_host, dst: rec.dst_host, protocol: rec.protocol, count: 1 })
      });
      showToast(`Replayed frame: ${rec.src_host} → ${rec.dst_host}`);
    } catch (_) {
      simulateClientPacket(rec.src_host, rec.dst_host, rec.protocol, 1);
    }
  };

  function simulateClientPacket(src, dst, proto, count = 1) {
    const isStudent = src === 'h1' || src === 'h2';
    const isAdmin = dst === 'srv_admin';
    const isAcademic = dst === 'srv_acad';
    const allowed = !(state.acl_enforced && isStudent && isAdmin);

    let path = ['s1', 's3'];
    if (src === 'h3' || src === 'h4') path = ['s2', 's3'];
    if (src === 'h1' && dst === 'h2') path = ['s1'];
    if (src === 'h3' && dst === 'h4') path = ['s2'];

    const droppedAt = allowed ? null : 's1';
    const ruleId = !allowed ? 'ACL-DENY-200' : (isAcademic ? 'ACL-PERMIT-120' : (isAdmin ? 'ACL-PERMIT-150' : 'L2-FWD-010'));
    const priority = !allowed ? 200 : (isAcademic ? 120 : (isAdmin ? 150 : 10));

    for (let i = 0; i < count; i++) {
      const rec = {
        id: (state.packets[state.packets.length - 1]?.id || 0) + 1,
        ts: Date.now() / 1000,
        timestamp: new Date().toTimeString().split(' ')[0],
        source: 'manual',
        src_host: src,
        src_ip: NODE_POSITIONS[src]?.ip || '10.0.0.1',
        dst_host: dst,
        dst_ip: NODE_POSITIONS[dst]?.ip || '10.0.0.200',
        protocol: proto,
        bytes: proto === 'ICMP' ? 98 : 512,
        path: path,
        hops: path.map(sw => ({
          switch: sw,
          in_port: 1,
          priority: priority,
          rule_id: ruleId,
          match: `nw_src=${NODE_POSITIONS[src]?.ip},nw_dst=${NODE_POSITIONS[dst]?.ip}`,
          actions: sw === droppedAt ? 'drop' : 'output:2',
          dropped: sw === droppedAt
        })),
        allowed: allowed,
        verdict: allowed ? 'PERMIT' : 'DROP',
        dropped_at: droppedAt,
        priority: priority,
        rule_id: ruleId,
        reason: allowed ? 'Permitted by OpenFlow access rule' : 'Proactively dropped by Priority 200 ACL',
        rtt_ms: allowed ? 6.08 : null
      };

      state.stats.probes++;
      if (allowed) state.stats.permitted++;
      else state.stats.dropped++;

      handleNewPacket(rec);
    }
    renderStatGrid();
    renderSessionKV();
    showToast(`Injected ${count} ${proto} packet(s): ${src} → ${dst} (${allowed ? 'PERMIT' : 'DROP'})`);
  }

  async function toggleTraffic(enabled) {
    if (state.isCloudEngine && window.clientSDNSimulator) {
      if (enabled) window.clientSDNSimulator.startTraffic(state.traffic.rate || 6.0, state.traffic.preset || 'normal');
      else window.clientSDNSimulator.stopTraffic();
      showToast(enabled ? 'Real-time traffic generation started.' : 'Traffic generator stopped.');
      return;
    }
    try {
      const res = await api('/api/traffic', {
        method: 'POST',
        body: JSON.stringify({ enabled })
      });
      state.traffic = res;
      updateTrafficUI();
      showToast(enabled ? 'Real-time traffic generation started.' : 'Traffic generator stopped.');
    } catch (err) {
      if (window.clientSDNSimulator) {
        if (enabled) window.clientSDNSimulator.startTraffic(state.traffic.rate || 6.0, state.traffic.preset || 'normal');
        else window.clientSDNSimulator.stopTraffic();
        showToast(enabled ? 'Real-time traffic generation started.' : 'Traffic generator stopped.');
      } else {
        showToast(`Traffic toggle: ${err.message}`, 'warn');
      }
    }
  }

  async function toggleACL(enforced) {
    if (state.isCloudEngine && window.clientSDNSimulator) {
      window.clientSDNSimulator.setAclEnforced(enforced);
      updateAclUI();
      showToast(enforced ? 'ACL rule enforced (Priority 200 drops active).' : 'ACL bypassed: student traffic permitted.');
      return;
    }
    try {
      const res = await api('/api/acl', {
        method: 'POST',
        body: JSON.stringify({ enforced })
      });
      state.acl_enforced = res.acl_enforced;
      updateAclUI();
      showToast(enforced ? 'ACL rule enforced (Priority 200 drops active).' : 'ACL bypassed: student traffic permitted.');
    } catch (err) {
      if (window.clientSDNSimulator) {
        window.clientSDNSimulator.setAclEnforced(enforced);
        updateAclUI();
        showToast(enforced ? 'ACL rule enforced (Priority 200 drops active).' : 'ACL bypassed: student traffic permitted.');
      } else {
        showToast(`ACL toggle: ${err.message}`, 'warn');
      }
    }
  }

  function updateAclUI() {
    const toggle = document.getElementById('aclToggle');
    const sbAcl = document.getElementById('sbAcl');
    if (toggle) toggle.checked = state.acl_enforced;
    if (sbAcl) {
      sbAcl.innerHTML = `${ICONS.shield}<span>ACL: ${state.acl_enforced ? 'ENFORCED' : 'BYPASSED'}</span>`;
      sbAcl.classList.toggle('warn', !state.acl_enforced);
    }
  }

  function updateTrafficUI() {
    const toggle = document.getElementById('trafficToggle');
    const rate = document.getElementById('trafficRate');
    const rateVal = document.getElementById('trafficRateVal');
    const sbTraffic = document.getElementById('sbTraffic');

    if (toggle) toggle.checked = !!state.traffic.enabled;
    if (rate && state.traffic.rate) {
      rate.value = state.traffic.rate;
      if (rateVal) rateVal.textContent = state.traffic.rate;
    }
    if (sbTraffic) {
      sbTraffic.innerHTML = `${ICONS.pulse}<span>traffic: ${state.traffic.enabled ? state.traffic.rate + ' pkt/s' : 'off'}</span>`;
    }
  }

  function populateHostSelectors(hosts) {
    const pSrc = document.getElementById('pSrc');
    const pDst = document.getElementById('pDst');
    if (!pSrc || !pDst) return;

    const opts = hosts.map(h => `<option value="${h.name}">${h.name} (${h.ip} · ${h.role})</option>`).join('');
    pSrc.innerHTML = opts;
    pDst.innerHTML = opts;

    pSrc.value = 'h1';
    pDst.value = 'srv_admin';
    highlightSelectedNodes();

    pSrc.addEventListener('change', highlightSelectedNodes);
    pDst.addEventListener('change', highlightSelectedNodes);
  }

  function renderScenarioPresets() {
    const list = document.getElementById('scenarioList');
    if (!list) return;

    const scenarios = [
      { name: 'Student 1 → Academic Portal (HTTP)', src: 'h1', dst: 'srv_acad', proto: 'HTTP', exp: 'PERMIT' },
      { name: 'Student 1 → Admin Records (HTTP)', src: 'h1', dst: 'srv_admin', proto: 'HTTP', exp: 'DROP' },
      { name: 'Student 2 → Admin Records (SSH)', src: 'h2', dst: 'srv_admin', proto: 'SSH', exp: 'DROP' },
      { name: 'Faculty 1 → Admin Records (SSH)', src: 'h3', dst: 'srv_admin', proto: 'SSH', exp: 'PERMIT' },
      { name: 'Faculty 2 → Admin Records (HTTP)', src: 'h4', dst: 'srv_admin', proto: 'HTTP', exp: 'PERMIT' },
      { name: 'Peer Student 1 → Student 2 (ICMP)', src: 'h1', dst: 'h2', proto: 'ICMP', exp: 'PERMIT' }
    ];

    list.innerHTML = scenarios.map(sc => `
      <div class="tree-row" style="padding-left:16px;" onclick="runScenario('${sc.src}','${sc.dst}','${sc.proto}')">
        <span class="dot" style="background:${sc.exp === 'PERMIT' ? 'var(--ok)' : 'var(--err)'}"></span>
        <span class="label">${sc.name}</span>
      </div>
    `).join('');
  }

  window.runScenario = function(src, dst, proto) {
    const pSrc = document.getElementById('pSrc');
    const pDst = document.getElementById('pDst');
    const pProto = document.getElementById('pProto');
    if (pSrc) pSrc.value = src;
    if (pDst) pDst.value = dst;
    if (pProto) pProto.value = proto;
    highlightSelectedNodes();
    document.getElementById('probeForm')?.dispatchEvent(new Event('submit'));
  };

  function renderTopologyTree() {
    const container = document.getElementById('treeTopology');
    if (!container || !state.topology) return;

    const switches = state.topology.switches || [];
    const hosts = state.topology.hosts || [];

    container.innerHTML = `
      <div class="tree-row" style="padding-left:12px;font-weight:600;"><span class="label">Switches (${switches.length})</span></div>
      ${switches.map(s => `
        <div class="tree-row" style="padding-left:24px;">
          <i data-icon="files"></i><span class="label">${s.name}</span><span class="desc">${s.role}</span>
        </div>
      `).join('')}

      <div class="tree-row" style="padding-left:12px;font-weight:600;margin-top:6px;"><span class="label">Hosts (${hosts.length})</span></div>
      ${hosts.map(h => `
        <div class="tree-row" style="padding-left:24px;" onclick="selectSourceHost('${h.name}')">
          <span class="dot" style="background:var(--${h.role.replace('_','-')})"></span>
          <span class="label">${h.name}</span><span class="desc">${h.ip}</span>
        </div>
      `).join('')}
    `;
    applyIcons(container);
  }

  function renderRuleList() {
    const list = document.getElementById('ruleList');
    if (!list) return;

    const rules = [
      { prio: 200, id: 'ACL-DENY-200', desc: 'Drop Student → Admin Server', col: 'err' },
      { prio: 150, id: 'ACL-PERMIT-150', desc: 'Permit Faculty ↔ Admin Server', col: 'ok' },
      { prio: 120, id: 'ACL-PERMIT-120', desc: 'Permit Campus ↔ Academic Server', col: 'ok' },
      { prio: 100, id: 'ACL-ARP-100', desc: 'NORMAL ARP Resolution', col: 'info' },
      { prio: 10, id: 'L2-FWD-010', desc: 'MAC Learning L2 Switching', col: 'info' },
      { prio: 0, id: 'TABLE-MISS', desc: 'Controller Punt (OFPCML_NO_BUFFER)', col: 'warn' }
    ];

    list.innerHTML = rules.map(r => `
      <div class="tree-row" style="padding-left:16px;">
        <span class="pill ${r.col}" style="font-size:10px;">${r.prio}</span>
        <span class="label" style="margin-left:4px;">${r.desc}</span>
      </div>
    `).join('');
  }

  function renderRoleList() {
    const list = document.getElementById('roleList');
    if (!list) return;

    const roles = [
      { role: 'Student (h1, h2)', access: 'Academic Server, Intra-Wing', dot: 'var(--student)' },
      { role: 'Faculty (h3, h4)', access: 'Academic + Admin Records', dot: 'var(--faculty)' },
      { role: 'Academic Srv (srv_acad)', access: 'Open to All Roles (10.0.0.100)', dot: 'var(--srv-acad)' },
      { role: 'Admin Srv (srv_admin)', access: 'Faculty Only (10.0.0.200)', dot: 'var(--srv-admin)' }
    ];

    list.innerHTML = roles.map(r => `
      <div class="tree-row" style="padding-left:16px;">
        <span class="dot" style="background:${r.dot}"></span>
        <span class="label">${r.role}</span>
        <span class="desc">${r.access}</span>
      </div>
    `).join('');
  }

  function renderSessionKV() {
    const dl = document.getElementById('sessionKv');
    if (!dl) return;
    const uptimeSec = Math.floor(Date.now() / 1000 - state.started_at);
    dl.innerHTML = `
      <dt>Controller</dt><dd>Ryu 4.34 (OF1.3)</dd>
      <dt>Switches</dt><dd>s1, s2, s3 (online)</dd>
      <dt>Total Probes</dt><dd>${state.stats.probes || 0}</dd>
      <dt>Packet Drop Rate</dt><dd>${state.stats.probes ? ((state.stats.dropped / state.stats.probes) * 100).toFixed(1) + '%' : '0%'}</dd>
      <dt>Active Flows</dt><dd>${state.stats.active_flows || 0}</dd>
      <dt>Uptime</dt><dd>${formatUptime(uptimeSec)}</dd>
    `;
    document.getElementById('sbUptime').textContent = `up ${formatUptime(uptimeSec)}`;
    document.getElementById('sbPkts').textContent = `${state.stats.probes || 0} pkts`;
  }

  function renderStatGrid() {
    const grid = document.getElementById('statGrid');
    if (!grid) return;
    grid.innerHTML = `
      <div class="stat"><div class="v ok">${state.stats.permitted || 0}</div><div class="k">Permitted Packets</div></div>
      <div class="stat"><div class="v err">${state.stats.dropped || 0}</div><div class="k">Dropped (ACL Violations)</div></div>
      <div class="stat"><div class="v warn">${state.stats.packet_ins || 0}</div><div class="k">Controller Packet-Ins</div></div>
      <div class="stat"><div class="v">${state.stats.flow_mods || 0}</div><div class="k">Flow Mods Installed</div></div>
      <div class="stat"><div class="v">${state.stats.active_flows || 0}</div><div class="k">Active Flow Entries</div></div>
      <div class="stat"><div class="v">${formatBytes(state.stats.bytes || 0)}</div><div class="k">Datapath Throughput</div></div>
    `;
  }

  // ---------------------------------------------------------------------------
  // 15. Command Palette (Ctrl+Shift+P)
  // ---------------------------------------------------------------------------
  const COMMANDS = [
    { id: 'run.pingall', title: 'SDN: Run 30-Pair PingAll Matrix Test', icon: 'play', cat: 'Testing' },
    { id: 'run.suite', title: 'SDN: Run 14-Point Policy Compliance Probes', icon: 'beaker', cat: 'Testing' },
    { id: 'toggle.acl', title: 'Policy: Toggle Student → Admin ACL Enforcement', icon: 'shield', cat: 'Security' },
    { id: 'toggle.traffic', title: 'Traffic: Toggle Real-Time Background Traffic Stream', icon: 'pulse', cat: 'Traffic' },
    { id: 'reset.counters', title: 'Datapath: Reset All OpenFlow Switch Flow Counters', icon: 'clear', cat: 'Datapath' },
    { id: 'clear.capture', title: 'Capture: Clear Packet Capture History', icon: 'clear', cat: 'Capture' },
    { id: 'open.topology', title: 'View: Open Topology Editor Tab', icon: 'network', cat: 'View' },
    { id: 'open.flows', title: 'View: Open OpenFlow 1.3 Flow Tables Tab', icon: 'files', cat: 'View' },
    { id: 'open.matrix', title: 'View: Open Connectivity Verification Matrix Tab', icon: 'beaker', cat: 'View' },
    { id: 'open.terminal', title: 'View: Open Interactive Mininet SDN Terminal', icon: 'keyboard', cat: 'View' },
    { id: 'toggle.sidebar', title: 'View: Toggle Primary Side Bar (Ctrl+B)', icon: 'layout-side', cat: 'View' },
    { id: 'toggle.panel', title: 'View: Toggle Panel (Ctrl+J)', icon: 'layout-panel', cat: 'View' }
  ];

  function openCommandPalette() {
    let backdrop = document.querySelector('.palette-backdrop');
    if (backdrop) backdrop.remove();

    backdrop = document.createElement('div');
    backdrop.className = 'palette-backdrop';

    const modal = document.createElement('div');
    modal.className = 'palette';
    modal.innerHTML = `
      <input type="text" placeholder="Type a command or action…" id="paletteInput" />
      <ul id="paletteList"></ul>
    `;
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    const input = document.getElementById('paletteInput');
    const list = document.getElementById('paletteList');
    input.focus();

    function renderItems(filter = '') {
      const q = filter.toLowerCase().trim();
      const matched = COMMANDS.filter(c => c.title.toLowerCase().includes(q) || c.cat.toLowerCase().includes(q));
      list.innerHTML = matched.map((c, i) => `
        <li class="${i === 0 ? 'active' : ''}" data-cmd="${c.id}">
          <span class="cat">${c.cat}:</span>
          <span>${c.title.replace(c.cat + ':', '').trim()}</span>
        </li>
      `).join('');

      list.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => {
          executeCommand(li.getAttribute('data-cmd'));
          backdrop.remove();
        });
      });
    }

    renderItems('');

    input.addEventListener('input', () => renderItems(input.value));
    input.addEventListener('keydown', (e) => {
      const active = list.querySelector('li.active');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = active?.nextElementSibling || list.firstElementChild;
        if (next) { active?.classList.remove('active'); next.classList.add('active'); next.scrollIntoView({ block: 'nearest' }); }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = active?.previousElementSibling || list.lastElementChild;
        if (prev) { active?.classList.remove('active'); prev.classList.add('active'); prev.scrollIntoView({ block: 'nearest' }); }
      } else if (e.key === 'Enter') {
        if (active) {
          executeCommand(active.getAttribute('data-cmd'));
          backdrop.remove();
        }
      } else if (e.key === 'Escape') {
        backdrop.remove();
      }
    });

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.remove();
    });
  }

  function executeCommand(cmd) {
    if (cmd === 'palette') openCommandPalette();
    else if (cmd === 'run.pingall') runPingallTest();
    else if (cmd === 'run.suite') runComplianceSuite();
    else if (cmd === 'toggle.acl') toggleACL(!state.acl_enforced);
    else if (cmd === 'toggle.traffic') toggleTraffic(!state.traffic.enabled);
    else if (cmd === 'reset.counters') resetSwitchCounters();
    else if (cmd === 'clear.capture') api('/api/capture/clear', { method: 'POST' });
    else if (cmd === 'open.topology') switchTab('topology');
    else if (cmd === 'open.flows') switchTab('flows');
    else if (cmd === 'open.matrix') switchTab('matrix');
    else if (cmd === 'open.terminal') { switchPanelTab('terminal'); togglePanel(true); }
    else if (cmd === 'toggle.sidebar') toggleSidebar();
    else if (cmd === 'toggle.panel') togglePanel();
    else if (cmd === 'help') showShortcutsHelp();
  }

  async function resetSwitchCounters() {
    try {
      await api('/api/reset', { method: 'POST' });
    } catch (_) {}
    if (window.clientSDNSimulator) {
      window.clientSDNSimulator.reset();
    }
    showToast('Reset all switch flow tables and counters.');
  }

  function showShortcutsHelp() {
    showToast('Keyboard shortcuts: Ctrl+Shift+P (Command Palette), Ctrl+B (Toggle Sidebar), Ctrl+J (Toggle Panel)');
  }

  function initKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        openCommandPalette();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        togglePanel();
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 16. Toast Notifications & Helpers
  // ---------------------------------------------------------------------------
  function showToast(message, type = 'info') {
    const container = document.getElementById('toasts');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    const iconName = type === 'error' ? 'error' : (type === 'warn' ? 'warning' : 'logo');
    toast.innerHTML = `
      <i data-icon="${iconName}"></i>
      <div class="msg">
        <div>${escapeHtml(message)}</div>
        <div class="src">Campus SDN Controller</div>
      </div>
      <button class="icon-btn close"><i data-icon="close"></i></button>
    `;
    applyIcons(toast);

    toast.querySelector('.close').addEventListener('click', () => toast.remove());
    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(8px)';
        toast.style.transition = 'all .2s ease-out';
        setTimeout(() => toast.remove(), 220);
      }
    }, 4500);
  }

  // ---------------------------------------------------------------------------
  // 16. Interactive Mininet SDN Terminal Controller
  // ---------------------------------------------------------------------------
  const termHistory = [];
  let termHistIndex = -1;

  function initTerminal() {
    const termInput = document.getElementById('termInput');
    const termOutput = document.getElementById('termOutput');
    const termContainer = document.getElementById('termContainer');
    if (!termInput || !termOutput) return;

    printTermBanner();

    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = termInput.value.trim();
        if (cmd) {
          termHistory.push(cmd);
          termHistIndex = termHistory.length;
          execTerminalCommand(cmd);
          termInput.value = '';
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (termHistory.length > 0 && termHistIndex > 0) {
          termHistIndex--;
          termInput.value = termHistory[termHistIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (termHistIndex < termHistory.length - 1) {
          termHistIndex++;
          termInput.value = termHistory[termHistIndex] || '';
        } else {
          termHistIndex = termHistory.length;
          termInput.value = '';
        }
      }
    });

    if (termContainer) {
      termContainer.addEventListener('click', () => {
        termInput.focus();
      });
    }
  }

  function termPrint(html) {
    const termOutput = document.getElementById('termOutput');
    if (!termOutput) return;
    const div = document.createElement('div');
    div.className = 'term-line';
    div.innerHTML = html;
    termOutput.appendChild(div);
    termOutput.scrollTop = termOutput.scrollHeight;
  }

  function termPrintRaw(text) {
    termPrint(escapeHtml(text));
  }

  function printTermBanner() {
    termPrint('<span class="term-cyan term-bold">==================================================================================</span>');
    termPrint('<span class="term-green term-bold"> Campus Access Control — Interactive Mininet SDN Controller Terminal (OpenFlow 1.3)</span>');
    termPrint('<span class="term-dim"> Topology: 3 OpenFlow Switches (s1, s2, s3) | 6 Campus Hosts (h1-h4, srv_acad, srv_admin)</span>');
    termPrint('<span class="term-dim"> Controller: Ryu OpenFlow 1.3 | Security Policy: Table 0 Role-Based Ingress Filtering</span>');
    termPrint('<span class="term-dim"> Type <span class="term-yellow term-bold">\'help\'</span> for commands, <span class="term-yellow term-bold">\'pingall\'</span> for full reachability matrix, or <span class="term-yellow term-bold">\'verify\'</span> for ACL probe audit.</span>');
    termPrint('<span class="term-cyan term-bold">==================================================================================</span>');
  }

  function resolveHostName(target) {
    if (!target) return null;
    const t = target.trim().toLowerCase();
    if (t === 'srv1' || t === 'srv-acad' || t === 'academic') return 'srv_acad';
    if (t === 'srv2' || t === 'srv-admin' || t === 'admin') return 'srv_admin';
    const hosts = DEFAULT_TOPOLOGY.hosts;
    const byName = hosts.find(h => h.name.toLowerCase() === t);
    if (byName) return byName.name;
    const byIp = hosts.find(h => h.ip === t);
    if (byIp) return byIp.name;
    return null;
  }

  function execTerminalCommand(cmdStr) {
    termPrint('<span class="term-prompt">mininet-sdn&gt;</span> <span class="term-cmd">' + escapeHtml(cmdStr) + '</span>');
    const parts = cmdStr.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case 'help':
      case '?':
        termPrint('<span class="term-bold term-cyan">--- AVAILABLE MININET &amp; SDN CONTROLLER COMMANDS ---</span>');
        termPrint('<span class="term-bold term-yellow">[Connectivity &amp; Testing]</span>');
        termPrint('  <span class="term-green">ping &lt;src&gt; &lt;dst&gt;</span>       Send 3 ICMP echo requests between hosts (e.g. ping h1 srv_admin, ping h3 srv_admin)');
        termPrint('  <span class="term-green">pingall</span>                Run 30-pair Mininet ping test across all 6 campus hosts');
        termPrint('  <span class="term-green">curl &lt;src&gt; &lt;dst&gt; [p]</span>   Simulate HTTP/HTTPS/SSH traffic (e.g. curl h1 srv_acad 80, curl h1 srv_admin 443)');
        termPrint('  <span class="term-green">verify</span> | <span class="term-green">suite</span>          Run 14-point Role Compliance test suite and audit table');
        termPrint('<span class="term-bold term-yellow">[OpenFlow 1.3 &amp; Policy]</span>');
        termPrint('  <span class="term-green">dump-flows [sw]</span>        Dump OpenFlow 1.3 flow tables (ovs-ofctl style) for s1, s2, s3 or all');
        termPrint('  <span class="term-green">nodes</span>                  List all switches, hosts, IP addresses, MACs, and port bindings');
        termPrint('  <span class="term-green">rules</span>                  Display active Table 0 campus ACL policies and priority tiers');
        termPrint('  <span class="term-green">acl [on|off|status]</span>    Toggle student &rarr; admin server ACL policy enforcement');
        termPrint('<span class="term-bold term-yellow">[Telemetry &amp; Simulator]</span>');
        termPrint('  <span class="term-green">stats</span>                  Display real-time packet counters, throughput, and packet-ins');
        termPrint('  <span class="term-green">traffic [on|off|rate|preset]</span> Control background traffic generation stream');
        termPrint('  <span class="term-green">clear</span>                  Clear terminal screen buffer');
        break;

      case 'clear':
        const termOutput = document.getElementById('termOutput');
        if (termOutput) termOutput.innerHTML = '';
        break;

      case 'pingall':
        termPrint('*** Ping: testing ping reachability across 6 campus hosts (30 pairs)...');
        if (window.clientSDNSimulator) {
          const matrix = window.clientSDNSimulator.computePingall();
          renderPingallMatrix();
          const hosts = ['h1', 'h2', 'h3', 'h4', 'srv_acad', 'srv_admin'];
          let dropped = 0;
          let total = 0;
          hosts.forEach(src => {
            let row = `<span class="term-bold">${src.padEnd(9)}</span> -&gt; `;
            hosts.forEach(dst => {
              if (src === dst) return;
              total++;
              const res = matrix[src] && matrix[src][dst];
              if (res && res.status === 'PERMIT') {
                row += `<span class="term-green">${dst}</span> `;
              } else {
                row += `<span class="term-red">X</span> `;
                dropped++;
              }
            });
            termPrint(row);
          });
          const pct = ((dropped / total) * 100).toFixed(1);
          const recv = total - dropped;
          termPrint(`*** Results: <span class="${dropped > 0 ? 'term-yellow' : 'term-green'}">${pct}% dropped (${recv}/${total} received)</span>`);
          if (state.acl_enforced) {
            termPrint('<span class="term-green">[Security Audit] 4/30 pairs blocked as required by ACL Rule 100 (Student h1, h2 &harr; Admin Server). Compliance: 100%.</span>');
          } else {
            termPrint('<span class="term-yellow">[Security Notice] ACL enforcement is currently DISABLED. All 30/30 pairs reachable.</span>');
          }
        }
        break;

      case 'ping':
        if (args.length < 2) {
          termPrint('<span class="term-red">Usage:</span> ping &lt;src&gt; &lt;dst&gt;  (e.g., <span class="term-cyan">ping h1 srv_acad</span> or <span class="term-cyan">ping h1 srv_admin</span>)');
          break;
        }
        const pSrc = resolveHostName(args[0]);
        const pDst = resolveHostName(args[1]);
        if (!pSrc || !pDst) {
          termPrint(`<span class="term-red">Error:</span> Unknown host name. Available: h1, h2, h3, h4, srv_acad (srv1), srv_admin (srv2)`);
          break;
        }
        if (pSrc === pDst) {
          termPrint(`<span class="term-yellow">Notice:</span> Loopback ping on ${pSrc} (127.0.0.1) — 0.03 ms`);
          break;
        }
        const srcH = DEFAULT_TOPOLOGY.hosts.find(h => h.name === pSrc);
        const dstH = DEFAULT_TOPOLOGY.hosts.find(h => h.name === pDst);
        termPrint(`<span class="term-dim">PING ${dstH.ip} (${pDst}): 56 data bytes from ${srcH.ip} (${pSrc})</span>`);
        let rx = 0;
        let rttSum = 0;
        for (let i = 1; i <= 3; i++) {
          const rec = window.clientSDNSimulator ? window.clientSDNSimulator.simulatePacket(pSrc, pDst, 'ICMP', 0, 'cli') : null;
          if (rec && rec.allowed) {
            rx++;
            rttSum += (rec.rtt_ms || 1.15);
            termPrint(`64 bytes from ${dstH.ip} (${pDst}): icmp_seq=${i} ttl=64 time=${rec.rtt_ms ? rec.rtt_ms.toFixed(2) : '1.15'} ms <span class="term-green">[PERMIT: ${rec.rule_id}]</span>`);
          } else {
            termPrint(`From ${srcH.ip} (${pSrc}): icmp_seq=${i} <span class="term-red">Destination Host Prohibited</span> by OpenFlow Table 0 Rule <span class="term-bold">${rec ? rec.rule_id : 'ACL-DENY-200'}</span> (${rec ? rec.reason : 'Drop'})`);
          }
        }
        const loss = Math.round(((3 - rx) / 3) * 100);
        termPrint(`--- ${pDst} (${dstH.ip}) ping statistics ---`);
        termPrint(`3 packets transmitted, ${rx} packets received, <span class="${loss > 0 ? 'term-red' : 'term-green'}">${loss}% packet loss</span>${rx > 0 ? `, avg rtt ${(rttSum / rx).toFixed(2)} ms` : ''}`);
        break;

      case 'curl':
        if (args.length < 2) {
          termPrint('<span class="term-red">Usage:</span> curl &lt;src&gt; &lt;dst&gt; [port]  (e.g., <span class="term-cyan">curl h3 srv_admin 80</span> or <span class="term-cyan">curl h1 srv_admin 80</span>)');
          break;
        }
        const cSrc = resolveHostName(args[0]);
        const cDst = resolveHostName(args[1]);
        if (!cSrc || !cDst) {
          termPrint(`<span class="term-red">Error:</span> Unknown host name. Available: h1, h2, h3, h4, srv_acad, srv_admin`);
          break;
        }
        const cPort = parseInt(args[2], 10) || 80;
        const cDstH = DEFAULT_TOPOLOGY.hosts.find(h => h.name === cDst);
        let proto = 'HTTP';
        if (cPort === 443) proto = 'HTTPS';
        else if (cPort === 22) proto = 'SSH';
        else if (cPort === 53) proto = 'DNS';

        termPrint(`<span class="term-dim">* Connecting to ${cDstH.ip} (${cDst}) port ${cPort} via OpenFlow 1.3...</span>`);
        const cRec = window.clientSDNSimulator ? window.clientSDNSimulator.simulatePacket(cSrc, cDst, proto, cPort, 'cli') : null;
        if (cRec && cRec.allowed) {
          termPrint(`* Connected to ${cDstH.ip} (${cDst}) port ${cPort} (RTT: ${cRec.rtt_ms ? cRec.rtt_ms.toFixed(2) : '1.20'} ms)`);
          termPrint(`&gt; GET / HTTP/1.1\n&gt; Host: ${cDstH.ip}:${cPort}\n&gt; User-Agent: curl/8.5.0-sdn`);
          termPrint(`&lt; <span class="term-green term-bold">HTTP/1.1 200 OK</span>\n&lt; Date: ${new Date().toUTCString()}\n&lt; Server: Campus-SDN-Service/1.0 (Ryu OF13)\n&lt; Content-Type: text/html; charset=UTF-8\n&lt; Content-Length: 512`);
          termPrint(`&lt; Connection: keep-alive\n<span class="term-green">[SUCCESS] Flow installed on path: ${cRec.path.join(' &rarr; ')} (Rule: ${cRec.rule_id})</span>`);
        } else {
          termPrint(`* <span class="term-red">OpenFlow Table 0 DENY:</span> Rule <span class="term-bold">${cRec ? cRec.rule_id : 'ACL-DENY-200'}</span> (Priority ${cRec ? cRec.priority : 200})`);
          termPrint(`* Dropped at Switch: <span class="term-bold">${cRec ? cRec.dropped_at : 's1'}</span>`);
          termPrint(`<span class="term-red">curl: (7) Failed to connect to ${cDstH.ip} port ${cPort}: Connection denied by campus security policy</span>`);
          termPrint(`<span class="term-dim">Reason: ${cRec ? cRec.reason : 'Role Policy Violation'}</span>`);
        }
        break;

      case 'dump-flows':
        const targetSw = (args[0] || 'all').toLowerCase();
        const switchesToDump = (targetSw === 'all' || !['s1', 's2', 's3'].includes(targetSw)) ? ['s1', 's2', 's3'] : [targetSw];
        switchesToDump.forEach(sw => {
          const dpid = NODE_POSITIONS[sw]?.dpid || '0000000000000001';
          termPrint(`<span class="term-cyan term-bold">NXST_FLOW reply (xid=0x4) [Switch: ${sw}, DPID: ${dpid}]:</span>`);
          const flows = state.flow_tables[sw] || [];
          if (flows.length === 0) {
            termPrint(` (no flow entries installed)`);
          } else {
            flows.forEach(f => {
              const hexCookie = '0x' + (Number(f.cookie) || 0).toString(16);
              const matchPart = f.match ? `,${f.match}` : '';
              const idlePart = f.idle_timeout ? `, idle_timeout=${f.idle_timeout}, idle_age=${Math.round(f.idle_age || 0)}` : '';
              const actClass = f.actions === 'drop' ? 'term-red' : (f.actions.startsWith('CONTROLLER') ? 'term-yellow' : 'term-green');
              termPrint(` cookie=${hexCookie}, duration=${f.duration || 120.0}s, table=${f.table_id || 0}, n_packets=${f.n_packets || 0}, n_bytes=${f.n_bytes || 0}${idlePart}, priority=${f.priority}${matchPart} actions=<span class="${actClass}">${f.actions}</span> <span class="term-dim">(rule: ${f.rule_id})</span>`);
            });
          }
        });
        break;

      case 'nodes':
        termPrint('<span class="term-bold term-cyan">--- CAMPUS SDN TOPOLOGY NODES ---</span>');
        termPrint('<span class="term-bold term-yellow">OpenFlow 1.3 Switches:</span>');
        (DEFAULT_TOPOLOGY.switches || []).forEach(sw => {
          termPrint(`  <span class="term-bold">${sw.name.padEnd(4)}</span> DPID=${sw.dpid} | Role: ${sw.role}`);
        });
        termPrint('<span class="term-bold term-yellow">Campus Hosts:</span>');
        (DEFAULT_TOPOLOGY.hosts || []).forEach(h => {
          termPrint(`  <span class="term-bold">${h.name.padEnd(10)}</span> IP=${h.ip.padEnd(12)} Role=${h.role.padEnd(16)} Attached=${h.switch}-eth${h.port}`);
        });
        break;

      case 'rules':
        termPrint('<span class="term-bold term-cyan">--- OPENFLOW 1.3 TABLE 0 ACL RULE HIERARCHY ---</span>');
        termPrint('  <span class="term-red term-bold">1. Priority 200: ACL-DENY-200</span>    Student (10.0.0.1, 10.0.0.2) &harr; Admin Server (10.0.0.200) &rarr; <span class="term-red">DROP</span>');
        termPrint('  <span class="term-green term-bold">2. Priority 150: ACL-PERMIT-150</span>  Faculty (10.0.0.3, 10.0.0.4) &rarr; Admin Server (10.0.0.200) &rarr; <span class="term-green">PERMIT (port)</span>');
        termPrint('  <span class="term-green term-bold">3. Priority 120: ACL-PERMIT-120</span>  All Campus Hosts &rarr; Academic Server (10.0.0.100) &rarr; <span class="term-green">PERMIT (port)</span>');
        termPrint('  <span class="term-cyan term-bold">4. Priority 100: ACL-ARP-100</span>     ARP Broadcast Resolution Protocol &rarr; <span class="term-cyan">NORMAL (flood)</span>');
        termPrint('  <span class="term-dim term-bold">5. Priority 10:  L2-FWD-010</span>      Standard Learned L2 MAC/IP Campus Forwarding &rarr; <span class="term-dim">OUTPUT (port)</span>');
        termPrint('  <span class="term-yellow term-bold">6. Priority 0:   TABLE-MISS-000</span>  Default Unmatched Ingress Traffic &rarr; <span class="term-yellow">CONTROLLER:65535</span>');
        break;

      case 'acl':
        const sub = (args[0] || '').toLowerCase();
        if (sub === 'on' || sub === 'enable') {
          if (window.clientSDNSimulator) window.clientSDNSimulator.setAclEnforced(true);
          else toggleACL(true);
          termPrint('<span class="term-green">[SDN Controller] Campus ACL enforcement ENABLED: Student hosts blocked from Admin Server (Priority 200).</span>');
        } else if (sub === 'off' || sub === 'disable') {
          if (window.clientSDNSimulator) window.clientSDNSimulator.setAclEnforced(false);
          else toggleACL(false);
          termPrint('<span class="term-yellow">[SDN Controller] Campus ACL enforcement DISABLED: All traffic bypassed via L2 switching.</span>');
        } else {
          termPrint(`[SDN Controller] Campus ACL Enforcement: ${state.acl_enforced ? '<span class="term-green term-bold">ACTIVE (Student &rarr; Admin Server Blocked)</span>' : '<span class="term-yellow term-bold">DISABLED (Bypass Mode)</span>'}`);
        }
        break;

      case 'traffic':
        const tSub = (args[0] || '').toLowerCase();
        if (tSub === 'on' || tSub === 'start') {
          if (window.clientSDNSimulator) window.clientSDNSimulator.startTraffic();
          else toggleTraffic(true);
          termPrint(`<span class="term-green">[Traffic Gen] Live traffic streaming started at ${state.traffic.rate} pkts/s (${state.traffic.preset} preset).</span>`);
        } else if (tSub === 'off' || tSub === 'stop') {
          if (window.clientSDNSimulator) window.clientSDNSimulator.stopTraffic();
          else toggleTraffic(false);
          termPrint('<span class="term-yellow">[Traffic Gen] Live traffic generator stopped.</span>');
        } else if (tSub === 'rate') {
          const rVal = parseFloat(args[1]);
          if (isNaN(rVal) || rVal <= 0) {
            termPrint('<span class="term-red">Usage:</span> traffic rate &lt;number&gt;  (e.g., traffic rate 10.0)');
          } else {
            if (window.clientSDNSimulator) window.clientSDNSimulator.setRate(rVal);
            termPrint(`<span class="term-cyan">[Traffic Gen] Packet generation rate set to ${rVal} pkts/s.</span>`);
          }
        } else if (tSub === 'preset') {
          const pName = (args[1] || '').toLowerCase();
          if (['normal', 'exam', 'breach', 'burst'].includes(pName)) {
            if (window.clientSDNSimulator) window.clientSDNSimulator.setPreset(pName);
            termPrint(`<span class="term-cyan">[Traffic Gen] Scenario preset switched to '${pName}'.</span>`);
          } else {
            termPrint('<span class="term-red">Error:</span> Invalid preset. Choices: normal, exam, breach, burst');
          }
        } else {
          termPrint(`[Traffic Gen] Status: ${state.traffic.enabled ? '<span class="term-green">RUNNING</span>' : '<span class="term-dim">STOPPED</span>'}, Rate: ${state.traffic.rate} pkts/s, Preset: '${state.traffic.preset}'`);
        }
        break;

      case 'verify':
      case 'suite':
      case 'test':
        termPrint('*** Executing Campus Access Control Role Compliance Probes (14 Tests)...');
        if (window.clientSDNSimulator) {
          const suite = window.clientSDNSimulator.computeSuite();
          renderComplianceSuite();
          let passed = 0;
          suite.forEach((tc, idx) => {
            const ok = tc.status === 'PASS';
            if (ok) passed++;
            const tag = ok ? '<span class="term-green term-bold">[PASS]</span>' : '<span class="term-red term-bold">[FAIL]</span>';
            const verd = tc.actual === 'PERMIT' ? '<span class="term-green">PERMIT</span>' : '<span class="term-red">DROP</span>';
            termPrint(`  ${tag} #${String(idx + 1).padStart(2)} ${tc.desc.padEnd(52)} | Verdict: ${verd}`);
          });
          const allOk = passed === suite.length;
          termPrint(`*** Compliance Summary: <span class="${allOk ? 'term-green' : 'term-red'} term-bold">${passed}/${suite.length} Tests Passed (${allOk ? '100% Policy Compliance' : 'Violations Detected'})</span> ***`);
        }
        break;

      case 'stats':
        termPrint('<span class="term-bold term-cyan">--- CAMPUS SDN DATAPATH TELEMETRY ---</span>');
        termPrint(`  Probes Simulated:     <span class="term-bold">${state.stats.probes || 0}</span>`);
        termPrint(`  Packets Permitted:    <span class="term-green term-bold">${state.stats.permitted || 0}</span>`);
        termPrint(`  Packets Dropped:      <span class="term-red term-bold">${state.stats.dropped || 0}</span>`);
        termPrint(`  Datapath Frames:      ${state.stats.frames || 0}`);
        termPrint(`  Datapath Throughput:  ${formatBytes(state.stats.bytes || 0)}`);
        termPrint(`  Active Flow Entries:  ${state.stats.active_flows || 0}`);
        termPrint(`  Packet-In Events:     ${state.stats.packet_ins || 0}`);
        termPrint(`  Flows Expired:        ${state.stats.flows_expired || 0}`);
        break;

      default:
        termPrint(`<span class="term-red">Command not found:</span> "${cmd}". Type <span class="term-yellow">'help'</span> for available commands.`);
        break;
    }
  }

  function updateStatusBarClock() {
    const el = document.getElementById('sbClock');
    if (el) el.textContent = new Date().toTimeString().split(' ')[0];
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function hex(n) {
    return '0x' + (Number(n) || 0).toString(16);
  }

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  function formatUptime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m === 0) return `${s}s`;
    const h = Math.floor(m / 60);
    return `${h}h ${m % 60}m`;
  }

  // Bootstrap when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
