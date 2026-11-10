# Campus Access Control SDN — Complete Operational Runbook

This single guide provides the complete, end-to-end instructions to run, test, verify, and inspect the **Campus Access Control OpenFlow 1.3 SDN Project**.

---

## 1. Architecture & Policy Specification

### Topology Layout
```
                          +-------------------------------+
                          |  c0: Ryu SDN Controller       |
                          |  (OpenFlow 1.3 / Port 6653)   |
                          +---------------+---------------+
                                          |
                +-------------------------+-------------------------+
                |                         |                         |
        +-------v-------+         +-------v-------+         +-------v-------+
        |   s1 Switch   |<=======>|   s3 Switch   |<=======>|   s2 Switch   |
        | (Student Wing)|  Trunk  |  (Core / DC)  |  Trunk  | (Faculty Wing)|
        +-------+-------+         +-------+-------+         +-------+-------+
                |                         |                         |
        +-------+-------+         +-------+-------+         +-------+-------+
        |               |         |               |         |               |
    +---v---+       +---v---+ +---v---+       +---v---+ +---v---+       +---v---+
    |  h1   |       |  h2   | |srv_   |       |srv_   | |  h3   |       |  h4   |
    |Student|       |Student| |acad   |       |admin  | |Faculty|       |Faculty|
    |10.0.01|       |10.0.02| |10.0.100       |10.0.200 |10.0.03|       |10.0.04|
    +-------+       +-------+ +-------+       +-------+ +-------+       +-------+
```

### Table 0 Flow Priority Hierarchy
| Priority | Rule ID | Match Fields | Action | Policy Rationale |
|:---:|:---:|:---|:---:|:---|
| **200** | `ACL-DENY-200` | `ip, nw_src=10.0.0.1,2, nw_dst=10.0.0.200` | **DROP** | Prohibits Student access to Admin Server |
| **150** | `ACL-PERMIT-150` | `ip, nw_src=10.0.0.3,4, nw_dst=10.0.0.200` | **OUTPUT:PORT** | Authorizes Faculty access to Admin Server |
| **120** | `ACL-PERMIT-120` | `ip, nw_dst=10.0.0.100` | **OUTPUT:PORT** | Public Campus Academic Server for all |
| **100** | `ACL-ARP-100` | `eth_type=0x0806 (ARP)` | **NORMAL** | Broadcast domain address resolution |
| **10** | `L2-FWD-010` | `in_port=X, dl_src=MAC, dl_dst=MAC` | **OUTPUT:PORT** | Reactive intra-campus L2 switching |
| **0** | `TABLE-MISS-000` | `* (wildcard all)` | **CONTROLLER:65535** | Sends unmatched packets as `PACKET_IN` |

---

## 2. Quick Start: Local Web Console (Recommended)

To run the full interactive Network Operations Center (NOC) dashboard locally:

### Step 1: Start the Local SDN Controller Service
From the repository root folder, run:
```bash
python3 server.py --port 8080 --traffic
```
*Options:*
- `--port 8080`: Specifies listening HTTP port.
- `--traffic`: Automatically starts the live background traffic generator stream.

### Step 2: Open the Dashboard in your Browser
Navigate to:
```
http://localhost:8080
```
*(or `http://127.0.0.1:8080`)*

### What You Can Do in the Console:
1. **Interactive SVG Campus Topology**:
   - Click any host (`h1`..`h4`, `srv_acad`, `srv_admin`) to open the **Node Inspector**, set Source/Destination, or fire instant pings and HTTP requests.
   - Click any switch (`s1`, `s2`, `s3`) to immediately inspect its OpenFlow Table 0 flow entries and counters.
   - Click the controller `c0` to view real-time Ryu event logs.
2. **Scenario Preset Buttons** (top toolbar):
   - `Normal`: Standard campus browsing traffic.
   - `Exam Day`: Academic server access spike.
   - `Admin Breach`: Student hosts attempting SSH/HTTPS brute-force to the admin server (instantly blocked with drop counters incrementing).
   - `DDoS Burst`: High-throughput stress test.
3. **Interactive Terminal (`mininet-sdn>`)**:
   - Click the **Terminal** tab in the bottom panel to run Mininet CLI commands (`pingall`, `ping h1 srv_admin`, `curl h3 srv_admin 80`, `dump-flows s1`, `rules`, `verify`).
4. **Wireshark-Style Dissected Packet Trace & Hex Dump**:
   - Click any packet in the **Capture** table, then view the **Trace** tab to see layer-by-layer decoded headers and a byte-level Hex/ASCII stream.
5. **CSV Export**:
   - Click the CSV icon in the Capture panel header to export `campus_sdn_capture.csv`.

---

## 3. Running on Cloud (Vercel)

The project is hosted live on Vercel at:
```
https://sdnproject.vercel.app/
```

- **Zero-Dependency Cloud Engine**: If the local Python server is unreachable, the browser automatically switches to the in-browser **OpenFlow 1.3 ClientSDNSimulator**.
- **Live Real-Time Operation**: Full packet simulation, SVG animations, 30-pair reachability matrix, 14-point probe verification, Wireshark hex dumps, and the interactive terminal work in the browser without requiring local software installation.

---

## 4. Standalone Policy Verification Suite

To run automated policy verification tests without needing Mininet or a GUI:

```bash
python3 verify_policy.py
```

### Expected Output:
```text
======================================================================
 Campus Access Control Policy Verification Suite (OpenFlow 1.3)
 Standalone Datapath Simulator — Verifying Ingress Filtering Rules
======================================================================

Executing 14 Policy Compliance Probes:
  [PASS] # 1 Student 1 (h1) -> Academic Server [ICMP echo]          | Verdict: PERMITTED
  [PASS] # 2 Student 2 (h2) -> Academic Server [ICMP echo]          | Verdict: PERMITTED
  [PASS] # 3 Faculty 1 (h3) -> Academic Server [ICMP echo]          | Verdict: PERMITTED
  [PASS] # 4 Faculty 2 (h4) -> Academic Server [ICMP echo]          | Verdict: PERMITTED
  [PASS] # 5 Student 1 (h1) -> Admin Server [ICMP echo]             | Verdict: DROPPED
  [PASS] # 6 Student 2 (h2) -> Admin Server [ICMP echo]             | Verdict: DROPPED
  [PASS] # 7 Faculty 1 (h3) -> Admin Server [ICMP echo]             | Verdict: PERMITTED
  [PASS] # 8 Faculty 2 (h4) -> Admin Server [ICMP echo]             | Verdict: PERMITTED
  [PASS] # 9 Student 1 (h1) -> Academic Server [HTTP port 80]       | Verdict: PERMITTED
  [PASS] #10 Student 1 (h1) -> Academic Server [HTTPS port 443]     | Verdict: PERMITTED
  [PASS] #11 Student 1 (h1) -> Admin Server [HTTP port 80]          | Verdict: DROPPED
  [PASS] #12 Student 2 (h2) -> Admin Server [SSH port 22]           | Verdict: DROPPED
  [PASS] #13 Faculty 1 (h3) -> Admin Server [HTTP port 80]          | Verdict: PERMITTED
  [PASS] #14 Faculty 2 (h4) -> Admin Server [SSH port 22]           | Verdict: PERMITTED

======================================================================
 Verification Summary: 14/14 Tests Passed (100% Policy Compliance)
 Overall: PASS
======================================================================
```
*Artifacts Generated:*
- `verification_report.txt`: Human-readable test log.
- `verification_results.json`: Machine-readable results and flow table dumps.

---

## 5. Full Mininet & Ryu Controller Environment (Linux VM)

If running in a native Linux VM (Ubuntu/Debian) with Mininet and Ryu installed:

### Prerequisites:
```bash
sudo apt update
sudo apt install -y mininet openvswitch-switch python3-pip
pip install ryu
```

### Step 1: Terminal 1 — Start the Ryu Controller
```bash
ryu-manager controller.py --ofp-tcp-listen-port 6653
```
*Expected log:*
```text
[SDN-CTRL] Switch s1 (DPID=0000000000000001) connected via OpenFlow 1.3
[SDN-ACL] Installed proactive DROP on s1: ipv4_src=10.0.0.1 -> ipv4_dst=10.0.0.200 (priority=200)
[SDN-ACL] Installed proactive DROP on s1: ipv4_src=10.0.0.2 -> ipv4_dst=10.0.0.200 (priority=200)
```

### Step 2: Terminal 2 — Launch Mininet Topology
```bash
sudo python3 topology.py --cli
```

### Step 3: Test Commands inside the Mininet CLI:
```text
mininet> pingall
*** Ping: testing ping reachability
h1 -> h2 h3 h4 srv_acad X
h2 -> h1 h3 h4 srv_acad X
h3 -> h1 h2 h4 srv_acad srv_admin
h4 -> h1 h2 h3 srv_acad srv_admin
srv_acad -> h1 h2 h3 h4 srv_admin
srv_admin -> X X h3 h4 srv_acad
*** Results: 13.3% dropped (26/30 received)

mininet> h1 ping -c 2 10.0.0.100      # Student -> Academic Server: 0% loss (PERMIT)
mininet> h1 ping -c 2 10.0.0.200      # Student -> Admin Server: 100% loss (DROP)
mininet> h3 ping -c 2 10.0.0.200      # Faculty -> Admin Server: 0% loss (PERMIT)

mininet> h1 curl -s http://10.0.0.100:80/   # Allowed -> 200 OK
mininet> h1 curl -s http://10.0.0.200:80/   # Dropped -> Connection refused / timeout
mininet> h3 curl -s http://10.0.0.200:80/   # Allowed -> 200 OK

mininet> dpctl dump-flows -O OpenFlow13 s1  # Inspect Table 0 flows
```

---

## 6. Interactive Terminal Reference (`mininet-sdn>`)

The web dashboard includes a built-in Mininet CLI accessible via the **Terminal** tab:

| Command | Syntax | Example | Description |
|---|---|---|---|
| `help` | `help` or `?` | `help` | Lists all available commands |
| `pingall` | `pingall` | `pingall` | Runs 30-pair matrix reachability test |
| `ping` | `ping <src> <dst>` | `ping h1 srv_admin` | Sends 3 ICMP echo requests |
| `curl` | `curl <src> <dst> [port]` | `curl h3 srv_admin 80` | Simulates HTTP/HTTPS/SSH traffic |
| `dump-flows` | `dump-flows [s1\|s2\|s3\|all]` | `dump-flows s1` | Dumps OpenFlow 1.3 flow table |
| `nodes` | `nodes` | `nodes` | Lists switches, hosts, IPs, and MACs |
| `rules` | `rules` | `rules` | Displays Table 0 priority rules hierarchy |
| `acl` | `acl [on\|off\|status]` | `acl on` | Enables/disables student ACL drop rule |
| `traffic` | `traffic [on\|off\|rate\|preset]` | `traffic preset breach` | Controls live traffic generation stream |
| `verify` | `verify` or `suite` | `verify` | Runs 14-point Role Compliance Probes |
| `stats` | `stats` | `stats` | Displays real-time datapath telemetry |
| `clear` | `clear` | `clear` | Clears terminal screen buffer |

---

## 7. Connectivity & Compliance Verification Matrix

| Source Host | Destination Host | Protocol | Expected Verdict | Rule Enforced |
|---|---|:---:|:---:|:---:|
| `h1` (Student 1) | `srv_acad` (Academic) | ICMP / HTTP | **PERMIT** | `ACL-PERMIT-120` |
| `h2` (Student 2) | `srv_acad` (Academic) | ICMP / HTTP | **PERMIT** | `ACL-PERMIT-120` |
| `h3` (Faculty 1) | `srv_acad` (Academic) | ICMP / HTTP | **PERMIT** | `ACL-PERMIT-120` |
| `h4` (Faculty 2) | `srv_acad` (Academic) | ICMP / HTTP | **PERMIT** | `ACL-PERMIT-120` |
| `h1` (Student 1) | `srv_admin` (Admin) | ICMP / HTTP / SSH | **DROP** | `ACL-DENY-200` |
| `h2` (Student 2) | `srv_admin` (Admin) | ICMP / HTTP / SSH | **DROP** | `ACL-DENY-200` |
| `h3` (Faculty 1) | `srv_admin` (Admin) | ICMP / HTTP / SSH | **PERMIT** | `ACL-PERMIT-150` |
| `h4` (Faculty 2) | `srv_admin` (Admin) | ICMP / HTTP / SSH | **PERMIT** | `ACL-PERMIT-150` |
| `h1` (Student 1) | `h2` (Student 2) | ICMP / TCP | **PERMIT** | `L2-FWD-010` |
| `h3` (Faculty 1) | `h4` (Faculty 2) | ICMP / TCP | **PERMIT** | `L2-FWD-010` |
| Any Host | Any Host | ARP | **PERMIT** | `ACL-ARP-100` |
