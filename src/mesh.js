/**
 * Suite decentralized node mesh doors for www.azieleliab.com.
 * Fetches runtime /v1/mesh/status and /v1/mesh/nodes via AZIEL_RUNTIME
 * (else HTTPS origin). Read-only suite presence is on — display from
 * runtime. GET never enables.
 * QNS-CD-1.0 is hub cite / mesh.js cross-map only (photon QNS1 packet
 * transfer). Local qnsd lives in qnm-node. No public qnsd proxy.
 * No Node Gate. Not a Softwares-tab product.
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
import { MESH_NODES_CACHE_URL, MESH_STATUS_CACHE_URL, MESH_TTL_SEC, readJsonSnapshot, writeJsonSnapshot } from "./edgeCache.js";
import { fetchRuntimeJson } from "./liveCatalog.js";

export const MESH_STATUS_PATH = "/v1/mesh/status";
export const MESH_NODES_PATH = "/v1/mesh/nodes";
export const MESH_STATUS_ORIGIN = RUNTIME + MESH_STATUS_PATH;
export const MESH_NODES_ORIGIN = RUNTIME + MESH_NODES_PATH;
export const MESH_STATUS_LOCAL = CANON_ORIGIN + MESH_STATUS_PATH;
export const MESH_NODES_LOCAL = CANON_ORIGIN + MESH_NODES_PATH;
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
    "QNS-CD-1.0 photon QNS1 packet transfer. Local qnsd is coded in qnm-node. Runtime cites + catalog field live in aziel-runtime. AZInterface has pair custody. Hub cite / Worker mesh cross-map only — not a Softwares-tab product. No public qnsd proxy. No Node Gate. Read-only suite presence is on (display from runtime). Author Aziel Eliab only.",
});

export const MESH_DEFAULT = "on";

export const MESH_NOTE =
  "QNM-BUILD-1.0 suite rollup (live/locked/isolated). Read-only suite presence is on — display from runtime. GET never enables. Operator enable requires a declared bearer (example: suite-presence). Display only — not Node Gate, not a Softwares-tab product. VPN/hop mesh is not claimed on this public surface. Cross-map QNS-CD-1.0 (photon QNS1 packet transfer). Local qnsd is qnm-node only — no public proxy. Author Aziel Eliab only.";

function qnsCiteFields() {
  return {
    qns_cd_spec: QNS_CD_SPEC,
    qns_cd: QNS_CD,
    qnm_spec: QNM_SPEC,
    qnm_companion: QNM_COMPANION,
    mesh_enable_bearer: QNM_ENABLE_BEARER,
    mesh_get_never_enables: true,
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

export function liveNodesCount(mesh) {
  const src = meshSource(mesh);
  const top = mesh && mesh !== src && typeof mesh === "object" ? mesh : null;
  for (const doc of [src, top]) {
    if (!doc) continue;
    const direct = finiteCount(doc.live_nodes);
    if (direct != null) return direct;
    const rollup = doc.rollup && typeof doc.rollup === "object" ? finiteCount(doc.rollup.live) : null;
    if (rollup != null) return rollup;
    const named = finiteCount(doc.node_count);
    if (named != null) return named;
    if (Array.isArray(doc.nodes)) return doc.nodes.length;
    if (Array.isArray(doc.items)) return doc.items.length;
  }
  return 0;
}

function rollupCounts(origin) {
  const src = origin && typeof origin === "object" ? origin : {};
  const nested = src.rollup && typeof src.rollup === "object" ? src.rollup : {};
  return {
    live: liveNodesCount(src),
    locked: finiteCount(src.locked_nodes) ?? finiteCount(nested.locked) ?? 0,
    isolated: finiteCount(src.isolated_nodes) ?? finiteCount(nested.isolated) ?? 0,
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

const MESH_OPENAPI_GET = (summary, description) => ({
  get: {
    operationId: summary === "mesh status" ? "getMeshStatus" : "getMeshNodes",
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
  [MESH_STATUS_PATH]: MESH_OPENAPI_GET(
    "mesh status",
    "QNM-BUILD-1.0 suite rollup status (live_nodes). Read-only suite presence is on (display from runtime). GET never enables. Operator enable requires a declared bearer (example: suite-presence). Cites QNS-CD-1.0. No public qnsd proxy. No Node Gate. Author Aziel Eliab.",
  ),
  [MESH_NODES_PATH]: MESH_OPENAPI_GET(
    "mesh nodes",
    "QNM-BUILD-1.0 Live Nodes roster. Display from runtime (Live Nodes · 0 when unavailable). GET never enables. Cross-map QNS-CD-1.0. No public qnsd proxy. Author Aziel Eliab.",
  ),
};

export function isMeshPath(pathname) {
  const p = String(pathname || "").replace(/\/+$/, "") || "/";
  return p === MESH_STATUS_PATH || p === MESH_NODES_PATH;
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
    live_nodes: enabled ? rollup.live : 0,
    locked_nodes: enabled ? rollup.locked : 0,
    isolated_nodes: enabled ? rollup.isolated : 0,
    rollup: enabled ? rollup : { live: 0, locked: 0, isolated: 0 },
    bearers: enabled ? declaredBearers(origin) : [],
    status: MESH_STATUS_LOCAL,
    nodes: MESH_NODES_LOCAL,
    runtime: MESH_STATUS_RUNTIME,
    origin: MESH_STATUS_ORIGIN,
    note: MESH_NOTE,
    ...qnsCiteFields(),
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
    live_nodes: enabled ? rollup.live : 0,
    locked_nodes: enabled ? rollup.locked : 0,
    isolated_nodes: enabled ? rollup.isolated : 0,
    rollup: enabled ? rollup : { live: 0, locked: 0, isolated: 0 },
    bearers: enabled ? declaredBearers(origin) : [],
    note: MESH_NOTE,
    mesh_status: MESH_STATUS_ORIGIN,
    mesh_status_local: MESH_STATUS_LOCAL,
    mesh_status_runtime: MESH_STATUS_RUNTIME,
    mesh_nodes: MESH_NODES_ORIGIN,
    mesh_nodes_local: MESH_NODES_LOCAL,
    mesh_nodes_runtime: MESH_NODES_RUNTIME,
    ...qnsCiteFields(),
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
  if (!doc.mesh_status) doc.mesh_status = MESH_STATUS_RUNTIME;
  if (!doc.mesh_nodes) doc.mesh_nodes = MESH_NODES_RUNTIME;
  if (!doc.mesh_default) doc.mesh_default = MESH_DEFAULT;
  if (!doc.mesh_note) doc.mesh_note = MESH_NOTE;
  if (!doc.qns_cd_spec) doc.qns_cd_spec = QNS_CD_SPEC;
  if (!doc.qns_cd) doc.qns_cd = QNS_CD;
  if (!doc.qnm_spec) doc.qnm_spec = QNM_SPEC;
  if (!doc.qnm_companion) doc.qnm_companion = QNM_COMPANION;
  if (!doc.mesh_enable_bearer) doc.mesh_enable_bearer = QNM_ENABLE_BEARER;
  if (doc.mesh_get_never_enables == null) doc.mesh_get_never_enables = true;
  return doc;
}

const MESH_LLMS_BLOCK = [
  "",
  "## Mesh",
  "",
  "- GET " + MESH_STATUS_RUNTIME + "  (QNM-BUILD-1.0 suite rollup; live_nodes; GET never enables; read-only suite presence is on)",
  "- GET " + MESH_NODES_RUNTIME + "  (suite node list / Live Nodes; display from runtime)",
  "- Origin: " + MESH_STATUS_ORIGIN + " · " + MESH_NODES_ORIGIN,
  "- Operator enable requires a declared bearer (example: suite-presence). Read-only suite presence is on (display from runtime).",
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
