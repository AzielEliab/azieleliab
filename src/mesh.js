/**
 * Suite decentralized node mesh doors for www.azieleliab.com.
 * Live Nodes SoT is Worker GET /v1/mesh: live_nodes, live_nodes_note,
 * human_mesh_users, human_uses (aziel-runtime#151). software_nodes
 * never feeds the pill. Also fetches /v1/mesh/status and /v1/mesh/nodes
 * via AZIEL_RUNTIME (else HTTPS origin). Read-only suite presence is
 * on — display from runtime. GET never enables.
 * QNS-CD-1.0 is hub cite / mesh.js cross-map only (photon QNS1 packet
 * transfer). Local qnsd lives in qnm-node. No public qnsd proxy.
 * QNS-CD is not Node Gate. Mesh Node Gate is an operator-armed cite
 * (2026-09-17), not a login-recovery panel. Not a Softwares-tab product.
 * Author: Aziel Eliab.
 */
import {
  AUTHOR,
  AZINTERFACE_GITHUB,
  CANON_ORIGIN,
  GITHUB_QNM_NODE,
  GITHUB_RUNTIME,
  RUNTIME,
  RUNTIME_LOCAL,
} from "./copy.js";
import { allowOriginRefresh } from "./costGuard.js";
import { MESH_CACHE_URL, MESH_NODES_CACHE_URL, MESH_STATUS_CACHE_URL, MESH_TTL_SEC, readJsonSnapshot, writeJsonSnapshot } from "./edgeCache.js";
import { fetchRuntimeJson } from "./liveCatalog.js";

export const MESH_PATH = "/v1/mesh";
export const MESH_STATUS_PATH = "/v1/mesh/status";
export const MESH_NODES_PATH = "/v1/mesh/nodes";
export const MESH_ORIGIN = RUNTIME + MESH_PATH;
export const MESH_STATUS_ORIGIN = RUNTIME + MESH_STATUS_PATH;
export const MESH_NODES_ORIGIN = RUNTIME + MESH_NODES_PATH;
export const MESH_LOCAL = CANON_ORIGIN + MESH_PATH;
export const MESH_STATUS_LOCAL = CANON_ORIGIN + MESH_STATUS_PATH;
export const MESH_NODES_LOCAL = CANON_ORIGIN + MESH_NODES_PATH;
export const MESH_RUNTIME = RUNTIME_LOCAL + MESH_PATH;
export const MESH_STATUS_RUNTIME = RUNTIME_LOCAL + MESH_STATUS_PATH;
export const MESH_NODES_RUNTIME = RUNTIME_LOCAL + MESH_NODES_PATH;

export const QNS_CD_SPEC = "QNS-CD-1.0";
export const QNM_SPEC = "QNM-BUILD-1.0";
export const QNM_COMPANION = "AIH-WP-1.1";
/** Example declared bearer for operator enable. GET never enables. */
export const QNM_ENABLE_BEARER = "suite-presence";

/** Hub cite / Worker mesh cross-map. Not a Softwares-tab product. No public qnsd. */
export const QNS_CD = Object.freeze({
  spec: QNS_CD_SPEC,
  name: "QNS-CD-1.0",
  title: "photon QNS1 packet transfer",
  kind: "cite",
  packet: "QNS1",
  transfer: "photon",
  software_tab: false,
  node_gate: false,
  public_proxy: false,
  qnsd: "local",
  mesh_default: "on",
  qnm_node: GITHUB_QNM_NODE,
  qnm_build: GITHUB_QNM_NODE + "/blob/main/docs/QNM-BUILD-1.0.md",
  runtime: GITHUB_RUNTIME,
  runtime_skill: RUNTIME + "/v1/skill",
  runtime_skill_local: RUNTIME_LOCAL + "/v1/skill",
  designs: GITHUB_RUNTIME + "/tree/main/docs/designs",
  qnm_wp: GITHUB_RUNTIME + "/blob/main/docs/designs/QNM-WP-1.0.md",
  node_ops: GITHUB_RUNTIME + "/blob/main/docs/designs/NODE-OPS-1.0.md",
  node_mesh: GITHUB_RUNTIME + "/blob/main/docs/NODE_MESH.md",
  pair_custody: AZINTERFACE_GITHUB,
  author: AUTHOR,
  identity: AUTHOR,
  note:
    "QNS-CD-1.0 photon QNS1 packet transfer. Local qnsd is coded in qnm-node. Runtime cites + catalog field live in aziel-runtime. AZInterface has pair custody. Hub cite / Worker mesh cross-map only. Read-only suite presence is on (display from runtime). Author Aziel Eliab only.",
});

/** Operator-armed mesh cites from runtime GET /v1/mesh (2026-09-17). Not a login panel. */
export const NODE_GATE = true;
export const GET_IS_NODE_GATE = true;
export const NEIGHBOR_HEAL = true;
export const NETWORK_ON = true;
export const NETWORK_CITE = "on";
export const WORKER_HARDWARE = false;
export const INVENTED_HARDWARE = false;

export const CHANNEL_PLANE = Object.freeze({
  spec: "QNM-CHANNEL-PLANE-1.0",
  author: AUTHOR,
  identity: AUTHOR,
  operator_armed: true,
  plane: "channel",
  wifi: "on",
  bluetooth: "on",
  rf: "on",
  photon: "on",
  channels: Object.freeze({ wifi: "on", bluetooth: "on", rf: "on", photon: "on" }),
  bearer: QNM_ENABLE_BEARER,
  worker_bearer: QNM_ENABLE_BEARER,
  worker_hardware: WORKER_HARDWARE,
  invented_hardware: INVENTED_HARDWARE,
  public_proxy: false,
  local_process: "qnm-node / qnsd",
  local: GITHUB_QNM_NODE,
  vpn: true,
  public_vpn: true,
  tunnel_concentrator: true,
  concentrator_slug: "azvpn",
  default_vpn_backend: "azvpn",
  auto_use: true,
  note:
    "Operator-armed communication channel cites (wifi / bluetooth / rf / photon) are ON as a channel plane. Live OS/hardware bearers run on local qnm-node / qnsd. Public VPN auto-binds AZVPN (HTTPS/WS REAL; WireGuard/OpenVPN SLOT; GET cites only). worker_hardware:false. public_proxy false.",
});

export const VPN_CITE = Object.freeze({
  vpn: true,
  public_vpn: true,
  auto_use: true,
  auto_bind: true,
  default_vpn_backend: "azvpn",
  concentrator_slug: "azvpn",
  concentrator_name: "AZVPN",
  kinds: Object.freeze({
    https_ws: "REAL",
    fraggate_envelopes: "REAL",
    websocket_attach: "REAL",
    wireguard: "SLOT",
    openvpn: "SLOT",
    l3_exit_pool: "SLOT",
  }),
  tor: false,
  origin_hiding: false,
  get_never_opens: true,
  note:
    "AZVPN auto_use + vpn:true. HTTPS/WS REAL; WireGuard/OpenVPN/L3 SLOT. GET /v1/mesh cites the bind and never opens a session.",
});

export const MESH_DEFAULT = "on";

/** Public Live Nodes = human mesh users + cited human uses. Never Softwares. Runtime #151 SoT. */
export const LIVE_NODES_PLANE = "human-mesh-users-uses";
export const LIVE_NODES_NOTE =
  "Public Live Nodes (live_nodes / rollup.mesh) count human mesh users (join/heartbeat/presence with human bearers) plus the cited human uses signal (USES / human_uses). Isolated humans stay on isolated_nodes. Not Softwares catalog length. Not downloaded Softwares instances. Not software_nodes. software_nodes is the {slug}-worker roster and never feeds this pill. Uses are interaction counters, not unique people — incomplete or unbound telemetry is reported honestly (0 + complete=false). Live Nodes does not invent users. Zero is honest when no humans are present and uses are 0/unbound.";
export const SOFTWARE_NODES_NOTE =
  "software_nodes / rollup.software count Softwares product Workers ({slug}-worker) from suite-presence fan-out. They may appear in the mesh roster. They must never feed public Live Nodes.";
export const LIVE_NODES_LLMS =
  "live_nodes = human mesh users + cited human uses; software_nodes never feeds Live Nodes; GET never enables";

export const MESH_NOTE =
  "QNM-BUILD-1.0 suite rollup. live_nodes counts human mesh users plus cited human uses (USES). software_nodes is the {slug}-worker roster and never feeds Live Nodes. Read-only suite presence is on — display from runtime GET /v1/mesh. GET never enables. Operator enable requires a declared bearer (example: suite-presence). Mesh ON. Operator-armed Node Gate + neighbor heal + network ON (2026-09-17). AZVPN auto_use + vpn:true (HTTPS/WS REAL; WireGuard/OpenVPN SLOT; GET cites only, never opens a session). Channel plane wifi/bluetooth/rf/photon ON cites; worker_hardware:false. Cross-map QNS-CD-1.0 (photon QNS1 packet transfer). Local qnsd is qnm-node only. Author Aziel Eliab only.";

function qnsCiteFields() {
  return {
    qns_cd_spec: QNS_CD_SPEC,
    qns_cd: QNS_CD,
    qnm_spec: QNM_SPEC,
    qnm_companion: QNM_COMPANION,
    mesh_enable_bearer: QNM_ENABLE_BEARER,
    mesh_get_never_enables: true,
    node_gate: NODE_GATE,
    get_is_node_gate: GET_IS_NODE_GATE,
    neighbor_heal: NEIGHBOR_HEAL,
    network: NETWORK_ON,
    network_cite: NETWORK_CITE,
    worker_hardware: WORKER_HARDWARE,
    invented_hardware: INVENTED_HARDWARE,
    login_mesh: false,
    login_recovery: false,
    ip_panel: false,
    channel_plane: CHANNEL_PLANE,
    vpn: VPN_CITE,
    mesh_live_nodes_are_api: false,
    live_nodes_are_not_live_doors: true,
    live_nodes_plane: LIVE_NODES_PLANE,
    live_nodes_note: LIVE_NODES_NOTE,
    software_nodes_note: SOFTWARE_NODES_NOTE,
    software_nodes_excluded: true,
  };
}

function meshSource(mesh) {
  if (!mesh || typeof mesh !== "object") return null;
  if (mesh.origin && typeof mesh.origin === "object" && !Array.isArray(mesh.origin)) {
    return mesh.origin;
  }
  return mesh;
}

function finiteCount(value) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function liveNodesFromHuman(doc) {
  if (!doc || typeof doc !== "object") return null;
  const users = finiteCount(doc.human_mesh_users);
  const uses = finiteCount(doc.human_uses);
  if (users == null && uses == null) return null;
  return (users || 0) + (uses || 0);
}

export function liveNodesCount(mesh) {
  const src = meshSource(mesh);
  const top = mesh && mesh !== src && typeof mesh === "object" ? mesh : null;
  for (const doc of [src, top]) {
    if (!doc) continue;
    const direct = finiteCount(doc.live_nodes);
    if (direct != null) return direct;
    const meshRollup = doc.rollup && typeof doc.rollup === "object" ? finiteCount(doc.rollup.mesh) : null;
    if (meshRollup != null) return meshRollup;
    const composed = liveNodesFromHuman(doc);
    if (composed != null) return composed;
  }
  return 0;
}

export function liveNodesNote(mesh) {
  const src = meshSource(mesh);
  const top = mesh && mesh !== src && typeof mesh === "object" ? mesh : null;
  for (const doc of [src, top]) {
    if (doc && typeof doc.live_nodes_note === "string" && doc.live_nodes_note.trim()) {
      return doc.live_nodes_note.trim();
    }
  }
  return LIVE_NODES_NOTE;
}

export function humanMeshUsers(mesh) {
  const src = meshSource(mesh);
  const top = mesh && mesh !== src && typeof mesh === "object" ? mesh : null;
  for (const doc of [src, top]) {
    const n = doc ? finiteCount(doc.human_mesh_users) : null;
    if (n != null) return n;
  }
  return 0;
}

export function humanUses(mesh) {
  const src = meshSource(mesh);
  const top = mesh && mesh !== src && typeof mesh === "object" ? mesh : null;
  for (const doc of [src, top]) {
    const n = doc ? finiteCount(doc.human_uses) : null;
    if (n != null) return n;
  }
  return 0;
}

function rollupCounts(origin) {
  const src = origin && typeof origin === "object" ? origin : {};
  const nested = src.rollup && typeof src.rollup === "object" ? src.rollup : {};
  const live = liveNodesCount(src);
  return {
    live,
    mesh: finiteCount(nested.mesh) ?? live,
    locked: finiteCount(src.locked_nodes) ?? finiteCount(nested.locked) ?? 0,
    isolated: finiteCount(src.isolated_nodes) ?? finiteCount(nested.isolated) ?? 0,
  };
}

function liveNodesFields(origin, enabled) {
  const src = origin && typeof origin === "object" ? origin : {};
  const users = enabled ? humanMeshUsers(src) : 0;
  const uses = enabled ? humanUses(src) : 0;
  const components =
    src.live_nodes_components && typeof src.live_nodes_components === "object"
      ? src.live_nodes_components
      : {
          human_mesh_users: users,
          human_uses: uses,
          software_nodes_excluded: true,
          instance_nodes_excluded: true,
          invent_users: false,
        };
  return {
    live_nodes: enabled ? liveNodesCount(src) : 0,
    live_nodes_note: liveNodesNote(src),
    live_nodes_plane: typeof src.live_nodes_plane === "string" && src.live_nodes_plane ? src.live_nodes_plane : LIVE_NODES_PLANE,
    human_mesh_users: users,
    human_uses: uses,
    human_uses_complete: src.human_uses_complete === true,
    human_uses_kv: src.human_uses_kv === true,
    software_nodes: enabled ? finiteCount(src.software_nodes) ?? 0 : 0,
    software_nodes_note: typeof src.software_nodes_note === "string" && src.software_nodes_note ? src.software_nodes_note : SOFTWARE_NODES_NOTE,
    live_nodes_components: components,
  };
}

function declaredBearers(origin) {
  if (!origin || typeof origin !== "object" || !Array.isArray(origin.bearers)) return [];
  return origin.bearers.map((b) => String(b));
}

export function meshIsOn(mesh) {
  if (!mesh) return false;
  if (mesh.origin && typeof mesh.origin === "object") return meshEnabled(mesh.origin);
  return meshEnabled(mesh);
}

export function liveNodesLabel(mesh) {
  return "Live Nodes · " + liveNodesCount(mesh);
}

const MESH_OPENAPI_GET = (id, summary, description) => ({
  get: {
    operationId: id,
    summary,
    description,
    tags: ["mesh"],
    responses: {
      200: {
        description: summary + " (read-only suite presence is on; display from runtime)",
      },
    },
  },
});

export const MESH_OPENAPI_PATHS = {
  [MESH_PATH]: MESH_OPENAPI_GET(
    "getMesh",
    "mesh",
    "QNM-BUILD-1.0 Live Nodes SoT (live_nodes = human mesh users + cited human uses; software_nodes never feeds Live Nodes; not exec API / not live_doors / not Cap-7). Read-only suite presence is on (display from runtime GET /v1/mesh). GET never enables. Operator enable requires a declared bearer (example: suite-presence). Operator-armed Node Gate + neighbor heal + network ON. AZVPN auto_use + vpn:true (HTTPS/WS REAL; WG/OpenVPN SLOT). Channel plane wifi/bt/rf/photon ON cites; worker_hardware:false. Cites QNS-CD-1.0. No public qnsd proxy. Author Aziel Eliab.",
  ),
  [MESH_STATUS_PATH]: MESH_OPENAPI_GET(
    "getMeshStatus",
    "mesh status",
    "QNM-BUILD-1.0 suite rollup status (live_nodes = human mesh users + cited human uses; software_nodes never feeds Live Nodes; not exec API / not live_doors / not Cap-7). Read-only suite presence is on (display from runtime). GET never enables. Operator enable requires a declared bearer (example: suite-presence). Operator-armed Node Gate + neighbor heal + network ON. AZVPN auto_use + vpn:true (HTTPS/WS REAL; WG/OpenVPN SLOT). Channel plane wifi/bt/rf/photon ON cites; worker_hardware:false. Cites QNS-CD-1.0. No public qnsd proxy. Author Aziel Eliab.",
  ),
  [MESH_NODES_PATH]: MESH_OPENAPI_GET(
    "getMeshNodes",
    "mesh nodes",
    "QNM-BUILD-1.0 node roster. Live Nodes number comes from GET /v1/mesh live_nodes (human mesh users + cited uses), not this roster length and not software_nodes. Display from runtime (Live Nodes · 0 when unavailable). GET never enables. Cross-map QNS-CD-1.0. No public qnsd proxy. Author Aziel Eliab.",
  ),
};

export function isMeshPath(pathname) {
  const p = String(pathname || "").replace(/\/+$/, "") || "/";
  return p === MESH_PATH || p === MESH_STATUS_PATH || p === MESH_NODES_PATH;
}

export function meshEnabled(origin) {
  if (!origin || typeof origin !== "object") return false;
  if (origin.enabled === true) return true;
  if (origin.enabled === false) return false;
  const mesh = String(origin.mesh || origin.status || "").toLowerCase();
  if (mesh === "on" || mesh === "enabled" || mesh === "live") return true;
  return false;
}

function originNodes(origin) {
  if (!origin || typeof origin !== "object") return [];
  if (Array.isArray(origin.nodes)) return origin.nodes;
  if (Array.isArray(origin.items)) return origin.items;
  return [];
}

export function meshSnapshot(origin) {
  const enabled = meshEnabled(origin);
  const rollup = rollupCounts(origin);
  return {
    enabled,
    default: MESH_DEFAULT,
    mesh: enabled ? "on" : "off",
    locked_nodes: enabled ? rollup.locked : 0,
    isolated_nodes: enabled ? rollup.isolated : 0,
    rollup: enabled ? rollup : { live: 0, mesh: 0, locked: 0, isolated: 0 },
    bearers: enabled ? declaredBearers(origin) : [],
    path: MESH_LOCAL,
    status: MESH_STATUS_LOCAL,
    nodes: MESH_NODES_LOCAL,
    runtime: MESH_RUNTIME,
    origin: MESH_ORIGIN,
    note: MESH_NOTE,
    ...qnsCiteFields(),
    ...liveNodesFields(origin, enabled),
  };
}

function meshBase(origin) {
  const enabled = meshEnabled(origin);
  const rollup = rollupCounts(origin);
  return {
    ok: true,
    author: AUTHOR,
    identity: AUTHOR,
    product: "azieleliab",
    mesh: enabled ? "on" : "off",
    enabled,
    default: MESH_DEFAULT,
    locked_nodes: enabled ? rollup.locked : 0,
    isolated_nodes: enabled ? rollup.isolated : 0,
    rollup: enabled ? rollup : { live: 0, mesh: 0, locked: 0, isolated: 0 },
    bearers: enabled ? declaredBearers(origin) : [],
    note: MESH_NOTE,
    mesh_origin: MESH_ORIGIN,
    mesh_local: MESH_LOCAL,
    mesh_runtime: MESH_RUNTIME,
    mesh_status: MESH_STATUS_ORIGIN,
    mesh_status_local: MESH_STATUS_LOCAL,
    mesh_status_runtime: MESH_STATUS_RUNTIME,
    mesh_nodes: MESH_NODES_ORIGIN,
    mesh_nodes_local: MESH_NODES_LOCAL,
    mesh_nodes_runtime: MESH_NODES_RUNTIME,
    ...qnsCiteFields(),
    ...liveNodesFields(origin, enabled),
  };
}

export function meshStatusBody(origin) {
  const body = meshBase(origin);
  if (origin && typeof origin === "object") body.origin = origin;
  return body;
}

export function meshNodesBody(origin) {
  const body = meshBase(origin);
  body.nodes = originNodes(origin);
  if (origin && typeof origin === "object") body.origin = origin;
  return body;
}

async function loadMeshDoc(env, ctx, opts, path, cacheUrl, wrap) {
  const packed = await readJsonSnapshot(env, { cacheUrl });
  if (packed && packed.ok) return packed;
  const request = opts && opts.request;
  const allowFetch = !request || allowOriginRefresh(request, env, "mesh");
  const body = wrap(allowFetch ? await fetchRuntimeJson(path, env, { loose: true }) : null);
  const write = writeJsonSnapshot(env, ctx, { cacheUrl, ttlSec: MESH_TTL_SEC }, body);
  if (write && typeof write.then === "function") await write;
  return body;
}

export async function loadMesh(env, ctx, opts) {
  return loadMeshDoc(env, ctx, opts, MESH_PATH, MESH_CACHE_URL, meshStatusBody);
}

export async function loadMeshStatus(env, ctx, opts) {
  return loadMeshDoc(env, ctx, opts, MESH_STATUS_PATH, MESH_STATUS_CACHE_URL, meshStatusBody);
}

export async function loadMeshNodes(env, ctx, opts) {
  return loadMeshDoc(env, ctx, opts, MESH_NODES_PATH, MESH_NODES_CACHE_URL, meshNodesBody);
}

export function meshQuietLabel(mesh) {
  return meshIsOn(mesh) ? "mesh on" : "";
}

export function injectMeshOpenApi(doc) {
  if (!doc || typeof doc !== "object" || !doc.openapi) return doc;
  const paths = doc.paths && typeof doc.paths === "object" ? doc.paths : {};
  doc.paths = paths;
  for (const [path, spec] of Object.entries(MESH_OPENAPI_PATHS)) {
    if (paths[path] || paths["/runtime" + path]) continue;
    paths["/runtime" + path] = spec;
  }
  return doc;
}

export function injectMeshCite(doc) {
  if (!doc || typeof doc !== "object" || Array.isArray(doc)) return doc;
  if (!doc.mesh) doc.mesh = MESH_RUNTIME;
  if (!doc.mesh_status) doc.mesh_status = MESH_STATUS_RUNTIME;
  if (!doc.mesh_nodes) doc.mesh_nodes = MESH_NODES_RUNTIME;
  if (!doc.mesh_default) doc.mesh_default = MESH_DEFAULT;
  if (!doc.mesh_note) doc.mesh_note = MESH_NOTE;
  if (!doc.live_nodes_note) doc.live_nodes_note = LIVE_NODES_NOTE;
  if (!doc.software_nodes_note) doc.software_nodes_note = SOFTWARE_NODES_NOTE;
  if (!doc.live_nodes_plane) doc.live_nodes_plane = LIVE_NODES_PLANE;
  if (!doc.qns_cd_spec) doc.qns_cd_spec = QNS_CD_SPEC;
  if (!doc.qns_cd) doc.qns_cd = QNS_CD;
  if (!doc.qnm_spec) doc.qnm_spec = QNM_SPEC;
  if (!doc.qnm_companion) doc.qnm_companion = QNM_COMPANION;
  if (!doc.mesh_enable_bearer) doc.mesh_enable_bearer = QNM_ENABLE_BEARER;
  if (doc.mesh_get_never_enables == null) doc.mesh_get_never_enables = true;
  if (doc.node_gate == null) doc.node_gate = NODE_GATE;
  if (doc.get_is_node_gate == null) doc.get_is_node_gate = GET_IS_NODE_GATE;
  if (doc.neighbor_heal == null) doc.neighbor_heal = NEIGHBOR_HEAL;
  if (doc.network == null) doc.network = NETWORK_ON;
  if (doc.network_cite == null) doc.network_cite = NETWORK_CITE;
  if (doc.worker_hardware == null) doc.worker_hardware = WORKER_HARDWARE;
  if (doc.channel_plane == null) doc.channel_plane = CHANNEL_PLANE;
  if (doc.vpn == null) doc.vpn = VPN_CITE;
  if (doc.login_mesh == null) doc.login_mesh = false;
  if (doc.mesh_live_nodes_are_api == null) doc.mesh_live_nodes_are_api = false;
  if (doc.live_nodes_are_not_live_doors == null) doc.live_nodes_are_not_live_doors = true;
  if (doc.software_nodes_excluded == null) doc.software_nodes_excluded = true;
  return doc;
}

const MESH_LLMS_BLOCK = [
  "",
  "## Mesh",
  "",
  "- GET " + MESH_RUNTIME + "  (QNM-BUILD-1.0 Live Nodes SoT; " + LIVE_NODES_LLMS + "; not exec API / not live_doors / not Cap-7; read-only suite presence is on)",
  "- GET " + MESH_STATUS_RUNTIME + "  (QNM-BUILD-1.0 suite rollup; " + LIVE_NODES_LLMS + "; not exec API / not live_doors / not Cap-7)",
  "- GET " + MESH_NODES_RUNTIME + "  (suite node list; Live Nodes number is GET /v1/mesh live_nodes, not roster length / not software_nodes; not BAN-SURVIVAL live_doors)",
  "- Origin: " + MESH_ORIGIN + " · " + MESH_STATUS_ORIGIN + " · " + MESH_NODES_ORIGIN,
  "- Operator enable requires a declared bearer (example: suite-presence). Read-only suite presence is on (display from runtime).",
  "- Mesh ON. Operator-armed Node Gate + neighbor heal + network ON (not a login panel).",
  "- AZVPN auto_use + vpn:true (HTTPS/WS REAL; WireGuard/OpenVPN SLOT). GET cites only.",
  "- Channel plane wifi/bluetooth/rf/photon ON cites; worker_hardware:false.",
  "- Cross-map: " + QNS_CD_SPEC + " (photon QNS1 packet transfer). Local qnsd is qnm-node only.",
  "- " + MESH_NOTE,
  "",
].join("\n");

export function injectMeshLlms(text) {
  const s = String(text || "");
  if (!s || /\/v1\/mesh\/status/.test(s)) return s;
  return s.replace(/\s*$/, "") + MESH_LLMS_BLOCK;
}

export function injectMeshDiscovery(text, contentType, pathname) {
  const dest = String(pathname || "").split("?")[0].replace(/\/+$/, "") || "/";
  const ct = String(contentType || "").toLowerCase();
  const raw = String(text == null ? "" : text);
  if (!raw) return raw;
  if (dest === "/openapi.json" || (ct.includes("json") && dest.endsWith("openapi.json"))) {
    try {
      return JSON.stringify(injectMeshOpenApi(JSON.parse(raw)));
    } catch {
      return raw;
    }
  }
  if (dest === "/cite.json") {
    try {
      return JSON.stringify(injectMeshCite(JSON.parse(raw)));
    } catch {
      return raw;
    }
  }
  if (dest === "/llms.txt" || dest === "/ai.txt") {
    return injectMeshLlms(raw);
  }
  return raw;
}
