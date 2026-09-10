/**
 * Suite decentralized node mesh doors for www.azieleliab.com.
 * Fetches runtime /v1/mesh/status and /v1/mesh/nodes via AZIEL_RUNTIME
 * (else HTTPS origin). Default off until runtime enables the mesh.
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
  mesh_default: "off",
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
    "QNS-CD-1.0 photon QNS1 packet transfer. Local qnsd is coded in qnm-node. Runtime cites + catalog field live in aziel-runtime. AZInterface has pair custody. Hub cite / Worker mesh cross-map only — not a Softwares-tab product. No public qnsd proxy. No Node Gate. Mesh default OFF. Author Aziel Eliab only.",
});

export const MESH_NOTE =
  "Suite decentralized node mesh. Default off until enabled on runtime. VPN/hop mesh is not claimed on this public surface. Cross-map QNS-CD-1.0 (photon QNS1 packet transfer). Local qnsd is qnm-node only — no public proxy, no Node Gate. Author Aziel Eliab only.";

function qnsCiteFields() {
  return {
    qns_cd_spec: QNS_CD_SPEC,
    qns_cd: QNS_CD,
  };
}

const MESH_OPENAPI_GET = (summary, description) => ({
  get: {
    operationId: summary === "mesh status" ? "getMeshStatus" : "getMeshNodes",
    summary,
    description,
    tags: ["mesh"],
    responses: {
      200: {
        description: summary + " (default off until runtime enables the mesh)",
      },
    },
  },
});

export const MESH_OPENAPI_PATHS = {
  [MESH_STATUS_PATH]: MESH_OPENAPI_GET(
    "mesh status",
    "Suite decentralized node mesh status. Default off until enabled on aziel-runtime. Cites QNS-CD-1.0 (photon QNS1 packet transfer). No public qnsd proxy. No Node Gate. Author Aziel Eliab.",
  ),
  [MESH_NODES_PATH]: MESH_OPENAPI_GET(
    "mesh nodes",
    "Suite decentralized node mesh members / Live Nodes. Empty while default off. Cross-map QNS-CD-1.0. No public qnsd proxy. Author Aziel Eliab.",
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
  return {
    enabled,
    default: "off",
    mesh: enabled ? "on" : "off",
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
  return {
    ok: true,
    author: AUTHOR,
    identity: AUTHOR,
    product: "azieleliab",
    mesh: enabled ? "on" : "off",
    enabled,
    default: "off",
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
  if (!mesh) return "mesh off";
  if (mesh.origin && typeof mesh.origin === "object") {
    return meshEnabled(mesh.origin) ? "mesh on" : "mesh off";
  }
  return meshEnabled(mesh) ? "mesh on" : "mesh off";
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
  if (!doc.mesh_default) doc.mesh_default = "off";
  if (!doc.mesh_note) doc.mesh_note = MESH_NOTE;
  if (!doc.qns_cd_spec) doc.qns_cd_spec = QNS_CD_SPEC;
  if (!doc.qns_cd) doc.qns_cd = QNS_CD;
  return doc;
}

const MESH_LLMS_BLOCK = [
  "",
  "## Mesh",
  "",
  "- GET " + MESH_STATUS_RUNTIME + "  (suite node mesh status; default off)",
  "- GET " + MESH_NODES_RUNTIME + "  (suite node list / Live Nodes; empty while off)",
  "- Origin: " + MESH_STATUS_ORIGIN + " · " + MESH_NODES_ORIGIN,
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
