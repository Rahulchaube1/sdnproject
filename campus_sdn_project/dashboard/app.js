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
  const state = {
    connected: false,
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
        setConnected(false);
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
    if (ok) {
      banner.classList.add('hidden');
      sb.classList.remove('offline');
      sbConn.innerHTML = `${ICONS.remote}<span>127.0.0.1:8080 (live)</span>`;
      sbConn.className = 'item remote';
    } else {
      banner.classList.remove('hidden');
      sb.classList.add('offline');
      sbConn.innerHTML = `${ICONS.remote}<span>disconnected</span>`;
      sbConn.className = 'item remote';
    }
  }

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

    // 2. Fetch live controller state
    try {
      const full = await api('/api/state');
      loadFullState(full);
      setConnected(true);
    } catch (err) {
      console.warn('Initial state fetch fell back to client mode:', err);
      const banner = document.getElementById('offline');
      if (banner) banner.classList.add('hidden');
      const sbConn = document.getElementById('sbConn');
      if (sbConn) {
        sbConn.innerHTML = `${ICONS.remote}<span>cloud mode</span>`;
        sbConn.className = 'item remote';
      }
    }

    connectSSE();
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
    if (!svg || !rec.path) return;

    const animGroup = document.getElementById('topoAnimLayer');
    if (!animGroup) return;

    // Collect waypoints
    const srcNode = NODE_POSITIONS[rec.src_host];
    const dstNode = NODE_POSITIONS[rec.dst_host];
    if (!srcNode || !dstNode) return;

    const waypoints = [{ x: srcNode.x, y: srcNode.y }];
    for (const sw of rec.path) {
      const swNode = NODE_POSITIONS[sw];
      if (swNode) waypoints.push({ x: swNode.x, y: swNode.y });
      if (rec.dropped_at === sw) break;
    }
    if (rec.allowed) {
      waypoints.push({ x: dstNode.x, y: dstNode.y });
    }

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
      const idx = Math.min(segCount - 1, Math.floor(scaled));
      const localT = scaled - idx;
      const p0 = waypoints[idx];
      const p1 = waypoints[idx + 1];
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
      nodeGroup.className = 'node';
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

      // Click: set source; Alt+Click / Right-Click: set dest
      nodeGroup.addEventListener('click', (e) => {
        if (meta.type === 'controller' || meta.type === 'switch') return;
        if (e.altKey) {
          selectDestinationHost(id);
        } else {
          selectSourceHost(id);
        }
      });
      nodeGroup.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (meta.type === 'controller' || meta.type === 'switch') return;
        selectDestinationHost(id);
      });

      g.appendChild(nodeGroup);
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
      <h4>Packet #${rec.id}: ${rec.src_host} (${rec.src_ip}) → ${rec.dst_host} (${rec.dst_ip}) [${rec.protocol}] ${verdictBadge}</h4>
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
    `;
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
    try {
      const res = await api('/api/pingall', { method: 'POST' });
      state.pingallMatrix = res.matrix;
      state.pingallTime = new Date().toTimeString().split(' ')[0];
      renderPingallMatrix();
      switchTab('matrix');
      showToast('Pingall test complete: 30 pairs verified.');
    } catch (err) {
      showToast(`Pingall failed: ${err.message}`, 'error');
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
    try {
      const res = await api('/api/suite', { method: 'POST' });
      state.suiteResults = res.results;
      state.suiteTime = new Date().toTimeString().split(' ')[0];
      renderComplianceSuite();
      switchTab('matrix');
      showToast('14 Policy probes executed successfully.');
    } catch (err) {
      showToast(`Suite execution failed: ${err.message}`, 'error');
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
      try {
        const text = await api(`/api/source?file=${encodeURIComponent(filename)}`);
        state.fileCache[filename] = text;
      } catch (err) {
        state.fileCache[filename] = `# Unable to load ${filename}: ${err.message}`;
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
      await api('/api/capture/clear', { method: 'POST' });
    });

    document.getElementById('capFilter')?.addEventListener('input', () => {
      renderCaptureTable();
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

        try {
          await api('/api/packet', {
            method: 'POST',
            body: JSON.stringify({ src, dst, protocol: proto, count })
          });
          showToast(`Injected ${count} ${proto} packet(s): ${src} → ${dst}`);
        } catch (err) {
          simulateClientPacket(src, dst, proto, count);
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
        api('/api/traffic', {
          method: 'POST',
          body: JSON.stringify({ rate: parseFloat(trafficRate.value) })
        });
      });
    }

    // ACL Toggle
    const aclToggle = document.getElementById('aclToggle');
    if (aclToggle) {
      aclToggle.addEventListener('change', () => {
        toggleACL(aclToggle.checked);
      });
    }

    renderScenarioPresets();
  }

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
    try {
      const res = await api('/api/traffic', {
        method: 'POST',
        body: JSON.stringify({ enabled })
      });
      state.traffic = res;
      updateTrafficUI();
      showToast(enabled ? 'Real-time traffic generation started.' : 'Traffic generator stopped.');
    } catch (err) {
      showToast(`Traffic toggle failed: ${err.message}`, 'error');
    }
  }

  async function toggleACL(enforced) {
    try {
      const res = await api('/api/acl', {
        method: 'POST',
        body: JSON.stringify({ enforced })
      });
      state.acl_enforced = res.acl_enforced;
      updateAclUI();
      showToast(enforced ? 'ACL rule enforced (Priority 200 drops active).' : 'ACL bypassed: student traffic permitted.');
    } catch (err) {
      showToast(`ACL toggle failed: ${err.message}`, 'error');
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
    else if (cmd === 'toggle.sidebar') toggleSidebar();
    else if (cmd === 'toggle.panel') togglePanel();
    else if (cmd === 'help') showShortcutsHelp();
  }

  async function resetSwitchCounters() {
    await api('/api/reset', { method: 'POST' });
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
