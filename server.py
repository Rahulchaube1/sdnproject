#!/usr/bin/env python3
"""
Campus Access Control SDN - live console server
===============================================
Serves the web console (`dashboard/`) and a small REST + Server-Sent Events
API backed by the in-process OpenFlow 1.3 simulator (`simulator.py`).

  GET  /api/state            full snapshot (topology, flows, stats, capture, logs)
  GET  /api/events           SSE stream: packet, log, tick, state events
  GET  /api/dump[?switch=s1] ovs-ofctl style flow dump (text/plain)
  GET  /api/source?file=...  project source file (read-only, whitelisted)
  POST /api/packet           {src, dst, protocol, port, count}
  POST /api/pingall          run the 30-pair matrix
  POST /api/suite            run the 14 role-based probes
  POST /api/traffic          {enabled: bool, rate: packets/sec}
  POST /api/acl              {enforced: bool}
  POST /api/reset            reinstall all switches / clear counters
  POST /api/capture/clear    clear the packet capture buffer

Only the Python standard library is required.
    python server.py [--host 127.0.0.1] [--port 8080]
"""

import argparse
import json
import mimetypes
import os
import queue
import random
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

from simulator import CampusSDNSimulator, PROTOCOLS
from verify_policy import run_core_suite, run_pingall

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "dashboard")
SOURCE_WHITELIST = ("controller.py", "topology.py", "simulator.py", "verify_policy.py", "server.py",
                    "README.md", "requirements.txt")

SIMULATOR = CampusSDNSimulator()

# Windows can map .js/.css to odd types via the registry; pin them.
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/css", ".css")
mimetypes.add_type("image/svg+xml", ".svg")

# --------------------------------------------------------------------------- events
class EventHub:
    """Fan-out of simulator events to every connected SSE client."""

    def __init__(self):
        self._clients = set()
        self._lock = threading.Lock()

    def subscribe(self) -> queue.Queue:
        q = queue.Queue(maxsize=2000)
        with self._lock:
            self._clients.add(q)
        return q

    def unsubscribe(self, q: queue.Queue):
        with self._lock:
            self._clients.discard(q)

    def publish(self, event: str, data):
        message = f"event: {event}\ndata: {json.dumps(data, separators=(',', ':'))}\n\n".encode("utf-8")
        with self._lock:
            clients = list(self._clients)
        for q in clients:
            try:
                q.put_nowait(message)
            except queue.Full:  # slow client: drop it, the browser will reconnect
                self.unsubscribe(q)

    @property
    def client_count(self) -> int:
        with self._lock:
            return len(self._clients)


HUB = EventHub()
SIMULATOR.add_listener(HUB.publish)


# ------------------------------------------------------------------ traffic generator
class TrafficGenerator(threading.Thread):
    """Background campus traffic with exponential inter-arrival times and scenario profiles."""

    PRESETS = {
        "normal": [
            (("h1", "h2", "h3", "h4"), "srv_acad", "HTTPS", 30),
            (("h1", "h2", "h3", "h4"), "srv_acad", "HTTP", 12),
            (("h1", "h2", "h3", "h4"), "srv_acad", "DNS", 8),
            (("h3", "h4"), "srv_admin", "HTTPS", 14),
            (("h3", "h4"), "srv_admin", "SSH", 6),
            (("h1", "h2"), "srv_admin", "HTTPS", 6),
            (("h1", "h2"), "srv_admin", "SSH", 3),
            (("h1", "h2", "h3", "h4"), "srv_acad", "ICMP", 6),
            (("h1", "h2", "h3", "h4"), None, "ICMP", 5),
        ],
        "exam": [
            (("h1", "h2", "h3", "h4"), "srv_acad", "HTTPS", 60),
            (("h1", "h2", "h3", "h4"), "srv_acad", "HTTP", 25),
            (("h1", "h2"), "srv_acad", "DNS", 10),
            (("h3", "h4"), "srv_admin", "HTTPS", 5),
        ],
        "breach": [
            (("h1", "h2"), "srv_admin", "SSH", 40),
            (("h1", "h2"), "srv_admin", "HTTPS", 30),
            (("h1", "h2"), "srv_admin", "HTTP", 20),
            (("h1", "h2", "h3", "h4"), "srv_acad", "ICMP", 10),
        ],
        "burst": [
            (("h1", "h2", "h3", "h4"), "srv_acad", "HTTPS", 25),
            (("h1", "h2", "h3", "h4"), "srv_acad", "HTTP", 25),
            (("h1", "h2"), "srv_admin", "HTTPS", 25),
            (("h3", "h4"), "srv_admin", "SSH", 25),
        ],
    }

    def __init__(self, sim: CampusSDNSimulator, hub: EventHub):
        super().__init__(daemon=True, name="traffic-generator")
        self.sim = sim
        self.hub = hub
        self.enabled = False
        self.rate = 2.0
        self.preset = "normal"
        self.rng = random.Random()
        self._wake = threading.Event()
        self._profile = self.PRESETS["normal"]
        self._weights = [p[3] for p in self._profile]

    def configure(self, enabled=None, rate=None, preset=None):
        if enabled is not None:
            self.enabled = bool(enabled)
        if rate is not None:
            self.rate = max(0.2, min(50.0, float(rate)))
        if preset in self.PRESETS:
            self.preset = preset
            self._profile = self.PRESETS[preset]
            self._weights = [p[3] for p in self._profile]
        self._wake.set()
        self.hub.publish("traffic", self.status())

    def status(self):
        return {"enabled": self.enabled, "rate": self.rate, "preset": self.preset}

    def _pick(self):
        srcs, dst, proto, _ = self.rng.choices(self._profile, weights=self._weights)[0]
        src = self.rng.choice(srcs)
        if dst is None:
            dst = self.rng.choice([h for h in ("h1", "h2", "h3", "h4") if h != src])
        return src, dst, proto

    def run(self):
        while True:
            if not self.enabled:
                self._wake.wait()
                self._wake.clear()
                continue
            src, dst, proto = self._pick()
            try:
                self.sim.simulate_packet(src, dst, protocol=proto, source="traffic")
            except Exception as exc:  # keep generating even if one packet fails
                print(f"[traffic] {exc}")
            delay = self.rng.expovariate(self.rate)
            self._wake.wait(timeout=min(delay, 5.0))
            self._wake.clear()


TRAFFIC = TrafficGenerator(SIMULATOR, HUB)


def ticker():
    """Once per second: expire idle flows and push counters/flow tables."""
    while True:
        time.sleep(1.0)
        try:
            SIMULATOR.expire_flows()
            if HUB.client_count:
                HUB.publish("tick", {
                    "server_time": time.time(),
                    "stats": SIMULATOR.stats_dict(),
                    "flow_tables": SIMULATOR.flow_tables_dict(),
                    "acl_enforced": SIMULATOR.acl_enforced,
                    "traffic": TRAFFIC.status(),
                    "clients": HUB.client_count,
                })
        except Exception as exc:
            print(f"[ticker] {exc}")


def full_state():
    state = SIMULATOR.snapshot()
    state["traffic"] = TRAFFIC.status()
    state["clients"] = HUB.client_count
    state["protocols"] = list(PROTOCOLS.keys())
    return state


# --------------------------------------------------------------------------- HTTP
class SDNRequestHandler(BaseHTTPRequestHandler):
    server_version = "CampusSDN/1.0"
    protocol_version = "HTTP/1.1"

    def log_message(self, fmt, *args):
        if "/api/events" in (self.path or "") or self.command == "GET" and not self.path.startswith("/api"):
            return
        print(f"[http] {self.address_string()} {fmt % args}")

    # ---- helpers
    def _send(self, status: int, body: bytes, content_type: str, extra_headers=None):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        for key, value in (extra_headers or {}).items():
            self.send_header(key, value)
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def _json(self, data, status=200):
        self._send(status, json.dumps(data).encode("utf-8"), "application/json; charset=utf-8")

    def _error(self, message, status=400):
        self._json({"error": message}, status)

    def _body(self):
        length = int(self.headers.get("Content-Length") or 0)
        if not length:
            return {}
        try:
            return json.loads(self.rfile.read(length).decode("utf-8") or "{}")
        except json.JSONDecodeError:
            raise ValueError("request body must be valid JSON")

    # ---- GET
    def do_HEAD(self):
        self.do_GET()

    def do_GET(self):
        raw_path = self.headers.get("x-forwarded-uri") or self.headers.get("x-matched-path") or self.path
        url = urlparse(raw_path)
        path = url.path
        query = parse_qs(url.query)

        if path == "/api/state":
            return self._json(full_state())
        if path == "/api/events":
            return self._stream_events()
        if path == "/api/dump":
            switch = (query.get("switch") or [None])[0]
            return self._send(200, SIMULATOR.format_ovs_dump(switch).encode("utf-8"), "text/plain; charset=utf-8")
        if path == "/api/capture/export":
            csv_data = SIMULATOR.export_csv_capture()
            return self._send(
                200,
                csv_data.encode("utf-8"),
                "text/csv; charset=utf-8",
                {"Content-Disposition": 'attachment; filename="campus_sdn_capture.csv"'}
            )
        if path == "/api/source":
            name = (query.get("file") or [""])[0]
            if name not in SOURCE_WHITELIST:
                return self._error("file not available", 404)
            with open(os.path.join(BASE_DIR, name), "rb") as f:
                return self._send(200, f.read(), "text/plain; charset=utf-8")
        if path.startswith("/api/"):
            return self._error("unknown endpoint", 404)
        return self._static(path)

    def _static(self, path):
        rel = "index.html" if path in ("/", "") else path.lstrip("/")
        full = os.path.normpath(os.path.join(STATIC_DIR, rel))
        if not full.startswith(STATIC_DIR) or not os.path.isfile(full):
            return self._send(404, b"Not found", "text/plain; charset=utf-8")
        ctype = mimetypes.guess_type(full)[0] or "application/octet-stream"
        if ctype.startswith("text/") or ctype in ("application/javascript",):
            ctype += "; charset=utf-8"
        with open(full, "rb") as f:
            self._send(200, f.read(), ctype)

    def _stream_events(self):
        q = HUB.subscribe()
        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("Cache-Control", "no-cache")
        self.send_header("Connection", "keep-alive")
        self.send_header("X-Accel-Buffering", "no")
        self.end_headers()
        self.close_connection = True
        try:
            self.wfile.write(b"retry: 2000\n\n")
            self.wfile.write(f"event: hello\ndata: {json.dumps({'server_time': time.time()})}\n\n".encode())
            self.wfile.flush()
            while True:
                try:
                    message = q.get(timeout=15)
                    chunks = [message]
                    while not q.empty() and len(chunks) < 200:
                        chunks.append(q.get_nowait())
                    self.wfile.write(b"".join(chunks))
                except queue.Empty:
                    self.wfile.write(b": keep-alive\n\n")
                self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError, OSError):
            pass
        finally:
            HUB.unsubscribe(q)

    # ---- POST
    def do_POST(self):
        raw_path = self.headers.get("x-forwarded-uri") or self.headers.get("x-matched-path") or self.path
        path = urlparse(raw_path).path
        try:
            body = self._body()
            if path in ("/api/packet", "/api/simulate"):
                count = max(1, min(int(body.get("count", 1)), 100))
                events = [
                    SIMULATOR.simulate_packet(
                        body.get("src", "h1"), body.get("dst", "srv_acad"),
                        protocol=body.get("protocol", "ICMP"), dst_port=body.get("port"),
                        source="manual",
                    )
                    for _ in range(count)
                ]
                return self._json({"events": events, "event": events[-1]})
            if path == "/api/pingall":
                names, matrix = run_pingall(SIMULATOR, source="pingall")
                return self._json({"hosts": names, "matrix": matrix, "ts": time.time()})
            if path == "/api/suite":
                return self._json({"results": run_core_suite(SIMULATOR, source="suite"), "ts": time.time()})
            if path == "/api/traffic":
                TRAFFIC.configure(body.get("enabled"), body.get("rate"), body.get("preset"))
                return self._json(TRAFFIC.status())
            if path == "/api/flow/install":
                match = {}
                if body.get("nw_src"):
                    match["ipv4_src"] = body["nw_src"]
                if body.get("nw_dst"):
                    match["ipv4_dst"] = body["nw_dst"]
                if body.get("eth_type"):
                    match["eth_type"] = int(body["eth_type"])
                if body.get("in_port"):
                    match["in_port"] = int(body["in_port"])
                entries = SIMULATOR.install_custom_rule(
                    switch=body.get("switch", "all"),
                    priority=int(body.get("priority", 180)),
                    match=match,
                    actions=body.get("actions", "drop"),
                    rule_id=body.get("rule_id", "CUSTOM-ACL"),
                    idle_timeout=int(body.get("idle_timeout", 0)),
                )
                HUB.publish("state", full_state())
                return self._json({"status": "ok", "installed": len(entries)})
            if path == "/api/flow/delete":
                count = SIMULATOR.delete_rule(body.get("switch", "all"), body.get("rule_id", ""))
                HUB.publish("state", full_state())
                return self._json({"status": "ok", "deleted": count})
            if path == "/api/acl":
                SIMULATOR.set_acl_enforced(bool(body.get("enforced", True)))
                HUB.publish("state", full_state())
                return self._json({"acl_enforced": SIMULATOR.acl_enforced})
            if path == "/api/reset":
                SIMULATOR.reset()
                HUB.publish("state", full_state())
                return self._json({"status": "ok"})
            if path == "/api/capture/clear":
                SIMULATOR.clear_capture()
                HUB.publish("capture_cleared", {})
                return self._json({"status": "ok"})
            return self._error("unknown endpoint", 404)
        except ValueError as exc:
            return self._error(str(exc), 400)


def main():
    parser = argparse.ArgumentParser(description="Campus Access Control SDN console")
    parser.add_argument("--host", default=os.environ.get("HOST", "127.0.0.1"))
    parser.add_argument("--port", type=int, default=int(os.environ.get("PORT", 8080)))
    parser.add_argument("--traffic", action="store_true", help="start background traffic immediately")
    args = parser.parse_args()

    TRAFFIC.start()
    threading.Thread(target=ticker, daemon=True, name="ticker").start()
    if args.traffic:
        TRAFFIC.configure(enabled=True)

    httpd = ThreadingHTTPServer((args.host, args.port), SDNRequestHandler)
    httpd.daemon_threads = True
    print(f"Campus SDN console running at http://{args.host}:{args.port}  (Ctrl+C to stop)")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nshutting down")
    finally:
        httpd.server_close()


class handler(SDNRequestHandler):
    """Vercel serverless HTTP handler."""
    pass

app = handler
application = handler

if __name__ == "__main__":
    main()
