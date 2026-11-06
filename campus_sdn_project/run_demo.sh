#!/usr/bin/env bash
set -e
echo "======================================================================"
echo " Campus Access Control SDN — Automated Verification & Live NOC Server"
echo " Team: Rahul Chaube | Mayank Shah | Neha Mallik"
echo "======================================================================"
python3 verify_policy.py
echo ""
echo "[INFO] Verification complete. Report saved to verification_report.txt"
echo "[INFO] To launch the real-time NOC Web Console on port 8080, run:"
echo "       python3 server.py"
