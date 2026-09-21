/**
 * Concurrent human page-viewer presence for www.azieleliab.com.
 * Operator lock 2026-09-21: Live Nodes includes current website viewers.
 * Pattern from godlock.uk /count site_live_nodes (5-minute heartbeat window).
 * Prefer runtime GET /v1/mesh live_nodes once it aggregates fleet viewers.
 * Until then local presence + mesh presence. Never invent bots. Exclude HDJ.
 * Author: Aziel Eliab.
 */
import { clientIp } from "./costGuard.js";
import { isBot } from "./views.js";

export const PRESENCE_KEY = "presence|sessions";
export const PRESENCE_TTL_MS = 5 * 60 * 1000;
export const PRESENCE_CLEANUP_MS = 15 * 60 * 1000;
export const PRESENCE_CAP = 400;
export const PRODUCT = "azieleliab";
export const SITE = "azieleliab.com";
export const AUTHOR = "Aziel Eliab";
export const COUNT_PATH = "/count";
export const COUNT_V1_PATH = "/v1/count";
export const HEARTBEAT_PATH = "/heartbeat";
export const HEARTBEAT_V1_PATH = "/v1/heartbeat";

export function isCountPath(pathname) {
  const p = String(pathname || "").replace(/\/+$/, "") || "/";
  return p === COUNT_PATH || p === COUNT_V1_PATH;
}

export function isHeartbeatPath(pathname) {
  const p = String(pathname || "").replace(/\/+$/, "") || "/";
  return p === HEARTBEAT_PATH || p === HEARTBEAT_V1_PATH;
}
/** He Didn't Jump viewers never enter this hub's Live Nodes. */
export const HDJ_EXCLUDED = true;
export const HDJ_HOST = "hedidntjump.com";

const isolateSessions = new WeakMap();

export function presenceCutoff(nowMs = Date.now()) {
  return {
    sinceMs: nowMs - PRESENCE_TTL_MS,
    sinceIso: new Date(nowMs - PRESENCE_TTL_MS).toISOString(),
    cleanupMs: nowMs - PRESENCE_CLEANUP_MS,
    cleanupIso: new Date(nowMs - PRESENCE_CLEANUP_MS).toISOString(),
  };
}

export function liveNodeCountFromMap(sessions, nowMs = Date.now(), justTouched = false) {
  const cutoff = nowMs - PRESENCE_TTL_MS;
  let n = 0;
  if (sessions && typeof sessions === "object" && !Array.isArray(sessions)) {
    for (const raw of Object.values(sessions)) {
      const t = Number(raw);
      if (Number.isFinite(t) && t >= cutoff) n += 1;
    }
  }
  if (justTouched && n < 1) return 1;
  return n;
}

/** FNV-1a 32-bit hex. Hashed IP+UA only — no raw address stored. */
export function sessionFingerprint(parts) {
  const text = String(parts || "");
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

export function sessionIdFrom(request) {
  const ip = clientIp(request);
  const headers = request && request.headers;
  const ua = headers && typeof headers.get === "function" ? String(headers.get("user-agent") || "").slice(0, 180) : "";
  return sessionFingerprint(ip + "|" + ua);
}

function parseSessions(raw) {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) return { ...raw };
  try {
    const doc = JSON.parse(String(raw || ""));
    if (doc && typeof doc === "object" && !Array.isArray(doc)) return { ...doc };
  } catch {
    /* ignore */
  }
  return {};
}

function pruneSessions(sessions, nowMs) {
  const cutoff = nowMs - PRESENCE_CLEANUP_MS;
  const out = {};
  const rows = [];
  for (const [id, raw] of Object.entries(sessions || {})) {
    const t = Number(raw);
    if (!Number.isFinite(t) || t < cutoff) continue;
    rows.push([id, t]);
  }
  rows.sort((a, b) => b[1] - a[1]);
  for (const [id, t] of rows.slice(0, PRESENCE_CAP)) out[id] = t;
  return out;
}

async function loadSessions(env) {
  if (!env?.VIEWS) return {};
  const cached = isolateSessions.get(env.VIEWS);
  if (cached) return cached;
  const sessions = parseSessions(await env.VIEWS.get(PRESENCE_KEY));
  isolateSessions.set(env.VIEWS, sessions);
  return sessions;
}

async function saveSessions(env, sessions) {
  if (!env?.VIEWS) return;
  isolateSessions.set(env.VIEWS, sessions);
  await env.VIEWS.put(PRESENCE_KEY, JSON.stringify(sessions));
}

export async function readSiteLiveNodes(env, nowMs = Date.now()) {
  if (!env?.VIEWS) return 0;
  const sessions = pruneSessions(await loadSessions(env), nowMs);
  isolateSessions.set(env.VIEWS, sessions);
  return liveNodeCountFromMap(sessions, nowMs, false);
}

export function shouldTouchPresence(request) {
  if (!request || request.method === "HEAD" || request.method === "OPTIONS") return false;
  const headers = request.headers;
  const ua = headers && typeof headers.get === "function" ? headers.get("user-agent") : "";
  if (isBot(ua)) return false;
  return true;
}

export async function touchSitePresence(env, request, nowMs = Date.now()) {
  if (!env?.VIEWS) return 0;
  if (!shouldTouchPresence(request)) return readSiteLiveNodes(env, nowMs);
  const sessions = pruneSessions(await loadSessions(env), nowMs);
  sessions[sessionIdFrom(request)] = nowMs;
  const next = pruneSessions(sessions, nowMs);
  await saveSessions(env, next);
  return liveNodeCountFromMap(next, nowMs, true);
}

/** Runtime already folded fleet/site viewers into live_nodes. Do not add local again. */
export function runtimeAggregatesFleetViewers(doc) {
  if (!doc || typeof doc !== "object" || Array.isArray(doc)) return false;
  if (doc.site_presence_local === true) return false;
  if (doc.live_nodes_includes_viewers === true || doc.live_nodes_includes_site === true) return true;
  const plane = String(doc.live_nodes_plane || "");
  if (/(viewer|site-live|page-view|website)/i.test(plane)) return true;
  const c = doc.live_nodes_components;
  if (c && typeof c === "object") {
    if (c.includes_viewers === true || c.fleet_viewers != null || c.page_viewers != null || c.website_viewers != null) {
      return true;
    }
    if (c.site_live_nodes != null && c.site_presence_local !== true) return true;
  }
  if (doc.fleet_viewers != null || doc.page_viewers != null || doc.website_viewers != null) return true;
  return false;
}

export function countBody(fields = {}) {
  const nodes = Number(fields.nodes) || 0;
  const live = Number(fields.live_nodes) || 0;
  const site = Number(fields.site_live_nodes) || 0;
  const meshLive = Number(fields.mesh_live_nodes) || 0;
  return {
    ok: true,
    product: PRODUCT,
    site: SITE,
    author: AUTHOR,
    nodes,
    live_nodes: live,
    site_live_nodes: site,
    mesh_enabled: fields.mesh_enabled === true,
    mesh_nodes: Number(fields.mesh_nodes) || nodes,
    mesh_live_nodes: meshLive,
    mesh_locked: Number(fields.mesh_locked) || 0,
    mesh_isolated: Number(fields.mesh_isolated) || 0,
    software_nodes: Number(fields.software_nodes) || 0,
    uses: Number(fields.uses) || 0,
    views: Number(fields.views) || 0,
    hdj_excluded: HDJ_EXCLUDED,
    hdj: false,
    invent_users: false,
    live_nodes_includes_viewers: fields.live_nodes_includes_viewers === true,
    note:
      "Live Nodes (clock right side) is mesh presence plus current azieleliab.com human page viewers. Prefer runtime /v1/mesh live_nodes once it aggregates fleet viewers. HDJ is excluded. Bots are not invented.",
    ...fields.extra,
  };
}
