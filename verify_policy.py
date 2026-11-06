#!/usr/bin/env python3
"""
Campus Access Control - Policy & Connectivity Verifier
======================================================
Runs the campus access policy through the OpenFlow 1.3 datapath simulator
(`simulator.py`) and checks:

  * 14 targeted role-based probes (ICMP, HTTP/80, HTTPS/443, SSH/22)
  * the full 6x6 pingall matrix (30 directional pairs)

Outputs:
  * console report
  * verification_report.txt   (same report, UTF-8)
  * verification_results.json (machine-readable results + flow tables)

Exit code is 0 when every check matches the expected policy, 1 otherwise.
"""

import json
import os
import sys

from simulator import CampusSDNSimulator, FlowEntry  # noqa: F401  (re-exported for older imports)
from topology import TOPOLOGY_SPEC

TEAM = [
    {"name": "Rahul Chaube", "reg_id": "RA2311003012372"},
    {"name": "Mayank Shah", "reg_id": "RA2311003012388"},
    {"name": "Neha Mallik", "reg_id": "RA2311003012393"},
]

# (src, dst, protocol, port, expected_allow, description)
CORE_TESTS = [
    ("h1", "srv_acad", "ICMP", 0, True, "Student 1 (h1) -> Academic Server [ICMP echo]"),
    ("h2", "srv_acad", "ICMP", 0, True, "Student 2 (h2) -> Academic Server [ICMP echo]"),
    ("h3", "srv_acad", "ICMP", 0, True, "Faculty 1 (h3) -> Academic Server [ICMP echo]"),
    ("h4", "srv_acad", "ICMP", 0, True, "Faculty 2 (h4) -> Academic Server [ICMP echo]"),
    ("h1", "srv_admin", "ICMP", 0, False, "Student 1 (h1) -> Admin Server [ICMP echo]"),
    ("h2", "srv_admin", "ICMP", 0, False, "Student 2 (h2) -> Admin Server [ICMP echo]"),
    ("h3", "srv_admin", "ICMP", 0, True, "Faculty 1 (h3) -> Admin Server [ICMP echo]"),
    ("h4", "srv_admin", "ICMP", 0, True, "Faculty 2 (h4) -> Admin Server [ICMP echo]"),
    ("h1", "srv_acad", "HTTP", 80, True, "Student 1 (h1) -> Academic Server [TCP/80]"),
    ("h2", "srv_acad", "HTTPS", 443, True, "Student 2 (h2) -> Academic Server [TCP/443]"),
    ("h1", "srv_admin", "HTTP", 80, False, "Student 1 (h1) -> Admin Server [TCP/80]"),
    ("h2", "srv_admin", "SSH", 22, False, "Student 2 (h2) -> Admin Server [TCP/22]"),
    ("h3", "srv_admin", "HTTP", 80, True, "Faculty 1 (h3) -> Admin Server [TCP/80]"),
    ("h4", "srv_admin", "SSH", 22, True, "Faculty 2 (h4) -> Admin Server [TCP/22]"),
]


def expected_allow(src: str, dst: str) -> bool:
    students = {"h1", "h2"}
    return not ((src in students and dst == "srv_admin") or (src == "srv_admin" and dst in students))


def run_core_suite(sim: CampusSDNSimulator, source: str = "suite"):
    results = []
    for src, dst, proto, port, expected, desc in CORE_TESTS:
        res = None
        for _ in range(4):  # like `ping -c 4`
            res = sim.simulate_packet(src, dst, protocol=proto, dst_port=port, source=source)
        results.append({
            "description": desc,
            "src": src,
            "dst": dst,
            "protocol": proto,
            "port": port,
            "expected": "PERMIT" if expected else "DROP",
            "actual": res["verdict"],
            "rule_id": res["rule_id"],
            "rtt_ms": res["rtt_ms"],
            "passed": res["allowed"] == expected,
        })
    return results


def run_pingall(sim: CampusSDNSimulator, source: str = "pingall"):
    names = [h["name"] for h in TOPOLOGY_SPEC["hosts"]]
    matrix = {}
    for src in names:
        matrix[src] = {}
        for dst in names:
            if src == dst:
                matrix[src][dst] = None
                continue
            ev = sim.simulate_packet(src, dst, protocol="ICMP", source=source)
            matrix[src][dst] = {
                "status": ev["verdict"],
                "rtt_ms": ev["rtt_ms"],
                "rule_id": ev["rule_id"],
                "dropped_at": ev["dropped_at"],
                "expected": "PERMIT" if expected_allow(src, dst) else "DROP",
            }
    return names, matrix


def main() -> int:
    sim = CampusSDNSimulator(jitter=False)
    report = []

    def log(line=""):
        print(line)
        report.append(line)

    width = 96
    log("=" * width)
    log("CAMPUS ACCESS CONTROL SDN - POLICY & CONNECTIVITY VERIFICATION")
    log("Team: " + " | ".join(f"{m['name']} ({m['reg_id']})" for m in TEAM))
    log("Controller: Ryu OpenFlow 1.3 (c0 @ 127.0.0.1:6653) | Switches: s1, s2, s3 | simulated datapath")
    log("=" * width)
    log()

    # 1. Targeted probes ----------------------------------------------------
    core = run_core_suite(sim)
    log(f"1. ROLE-BASED SERVER ACCESS PROBES ({len(core)} probes, 4 packets each)")
    log("-" * width)
    log(f"{'Probe':<48} | {'Rule':<14} | {'Verdict':<7} | {'RTT':<9} | Result")
    log("-" * width)
    for r in core:
        rtt = f"{r['rtt_ms']:.2f} ms" if r["rtt_ms"] is not None else "timeout"
        log(f"{r['description']:<48} | {r['rule_id']:<14} | {r['actual']:<7} | {rtt:<9} | "
            f"{'PASS' if r['passed'] else 'FAIL'}")
    core_passed = sum(r["passed"] for r in core)
    log("-" * width)
    log(f"Result: {core_passed}/{len(core)} probes match the policy")
    log()

    # 2. Pingall ------------------------------------------------------------
    names, matrix = run_pingall(sim)
    total = len(names) * (len(names) - 1)
    log(f"2. PINGALL MATRIX ({len(names)} hosts, {total} directional pairs)")
    log("-" * width)
    corner = "src \\ dst"
    header = f"{corner:<11} | " + " | ".join(f"{n:<11}" for n in names)
    log(header)
    log("-" * len(header))
    permitted = blocked = mismatches = 0
    for src in names:
        cells = []
        for dst in names:
            cell = matrix[src][dst]
            if cell is None:
                cells.append(f"{'-':<11}")
                continue
            if cell["status"] == "PERMIT":
                permitted += 1
                cells.append(f"{cell['rtt_ms']:.2f} ms".ljust(11))
            else:
                blocked += 1
                cells.append(f"{'X (acl)':<11}")
            if cell["status"] != cell["expected"]:
                mismatches += 1
        log(f"{src:<11} | " + " | ".join(cells))
    log("-" * len(header))
    log(f"Summary: {permitted}/{total} reachable ({permitted * 100 / total:.1f}%), "
        f"{blocked}/{total} blocked by ACL ({blocked * 100 / total:.1f}%), {mismatches} policy mismatches")
    log()

    # 3. Flow tables --------------------------------------------------------
    log("3. FLOW TABLES (ovs-ofctl -O OpenFlow13 dump-flows)")
    log("-" * width)
    log(sim.format_ovs_dump())

    out_dir = os.path.dirname(os.path.abspath(__file__))
    with open(os.path.join(out_dir, "verification_report.txt"), "w", encoding="utf-8") as f:
        f.write("\n".join(report) + "\n")

    payload = {
        "team": TEAM,
        "topology": TOPOLOGY_SPEC,
        "summary": {
            "targeted_tests_total": len(core),
            "targeted_tests_passed": core_passed,
            "pingall_total_pairs": total,
            "pingall_permitted_pairs": permitted,
            "pingall_blocked_pairs": blocked,
            "pingall_policy_mismatches": mismatches,
            "packet_drop_rate_percent": round(blocked * 100.0 / total, 2),
        },
        "core_tests": core,
        "matrix": matrix,
        "flow_tables": sim.flow_tables_dict(),
        "stats": sim.stats_dict(),
    }
    with open(os.path.join(out_dir, "verification_results.json"), "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)

    ok = core_passed == len(core) and mismatches == 0
    log(f"Overall: {'PASS' if ok else 'FAIL'}  (report: verification_report.txt, verification_results.json)")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
