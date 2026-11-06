@echo off
echo ======================================================================
echo  Campus Access Control SDN - Automated Verification and Live Console
echo  Team: Rahul Chaube ^| Mayank Shah ^| Neha Mallik
echo ======================================================================
echo.
python verify_policy.py
echo.
echo [INFO] Verification complete. Report saved to verification_report.txt
echo [INFO] Starting Live SDN Console at http://127.0.0.1:8080 ...
echo [INFO] Press Ctrl+C in this terminal to stop the server.
echo.
python server.py --port 8080
