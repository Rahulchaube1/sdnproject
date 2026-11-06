# Contributing to Campus Access Control SDN

Thank you for your interest in contributing to the **Campus Access Control SDN** project! We welcome contributions from network engineers, researchers, and developers.

---

## Code of Conduct

This project operates under the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

---

## How Can I Contribute?

### Reporting Bugs
If you find a bug in the OpenFlow 1.3 pipeline, packet simulator, or web console:
1. Search the [Issues tab](https://github.com/Rahulchaube1/sdnproject/issues) to verify it hasn't been reported.
2. Open a new issue using our **Bug Report** template.
3. Include:
   - Operating system and Python version
   - Exact CLI commands or web console actions that triggered the issue
   - Relevant terminal output or browser console logs

### Suggesting Enhancements
Feature requests are welcome! Submit a new issue describing:
- The proposed capability (e.g., dynamic QoS metering, multi-table OpenFlow pipelines, 802.1X integration).
- The use case and benefits to campus network operations.

### Pull Requests
1. **Fork** the repository and create a branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Implement your changes**:
   - Maintain PEP 8 coding standards for Python code.
   - Keep the web console lightweight and dependency-free (no external runtime CDN bloat).
3. **Run the Automated Verification Suite**:
   ```bash
   python verify_policy.py
   ```
   Ensure all 14 role-based probes and the 30-pair PingAll matrix pass with **100% compliance**.
4. **Commit and Push**:
   ```bash
   git commit -m "feat(scope): concise description of changes"
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** describing your changes and link any related issues.

---

## Development Guidelines

- **Standard Library First**: The standalone simulator (`simulator.py`) and live server (`server.py`) must run using standard Python 3 with zero required pip installations.
- **Mininet Compatibility**: Any OpenFlow flow modification must strictly adhere to the [ONF OpenFlow 1.3.5 Specification](https://opennetworking.org/wp-content/uploads/2014/10/openflow-switch-v1.3.5.pdf) and be tested against Open vSwitch `2.13+`.
- **VS Code Aesthetic**: Web UI modifications must adhere to the VS Code Dark Modern design language and color tokens in `dashboard/style.css`.
