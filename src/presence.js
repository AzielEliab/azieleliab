/**
 * Concurrent human page-viewer presence for www.azieleliab.com.
 * Operator lock 2026-09-21: Live Nodes includes current website viewers.
 * Pattern from godlock.uk /count site_live_nodes (5-minute heartbeat window).
 * After a local human update, best-effort POST /v1/mesh/site-presence
 * (AZIEL_RUNTIME, else the runtime HTTPS origin). Runtime is the Live Nodes
 * SSoT is runtime live_nodes. The public pill does not add the local count.
 * Never invent viewers. Bots are not counted. Exclude HDJ.
 * Author: Aziel Eliab.
 */
import { clientIp } from "./costGuard.js";
import { RUNTIME } from "./copy.js";
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
/** Runtime SSoT ingest. Latest report per host wins. 5-minute TTL. */
export const SITE_PRESENCE_PATH = "/v1/mesh/site-presence";
export const SITE_PRESENCE_KIND = "human-page";
export const SITE_PRESENCE_CAP = 10000;

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

function finiteViewers(value) {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) return null;
  return value;
}

/** Runtime already folded fleet/site viewers into live_nodes. Do not add local again. */
export function runtimeAggregatesFleetViewers(doc) {
  if (!doc || typeof doc !== "object" || Array.isArray(doc)) return false;
  if (doc.site_presence_local === true) return false;
  if (
    doc.includes_site_viewers === true ||
    doc.live_nodes_includes_viewers === true ||
    doc.live_nodes_includes_site === true
  ) {
    return true;
  }
  if (finiteViewers(doc.site_live_viewers) != null) return true;
  const plane = String(doc.live_nodes_plane || "");
  if (/(viewer|site-live|page-view|website)/i.test(plane)) return true;
  const c = doc.live_nodes_components;
  if (c && typeof c === "object" && c.site_presence_local !== true) {
    if (c.includes_site_viewers === true || c.includes_viewers === true) return true;
    if (finiteViewers(c.site_live_viewers) != null) return true;
    if (c.fleet_viewers != null || c.page_viewers != null || c.website_viewers != null) return true;
    if (c.site_live_nodes != null) return true;
  }
  if (doc.fleet_viewers != null || doc.page_viewers != null || doc.website_viewers != null) return true;
  return false;
}

/** Honest positive integer only. Zero, non-integers, and over-cap counts are not sent. */
export function sitePresencePayload(viewers) {
  const n = finiteViewers(viewers);
  if (n == null || n < 1 || n > SITE_PRESENCE_CAP) return null;
  return {
    host: SITE,
    viewers: n,
    kind: SITE_PRESENCE_KIND,
  };
}

async function cancelResponse(res) {
  try {
    if (res && res.body && typeof res.body.cancel === "function") await res.body.cancel();
  } catch {
    /* best-effort */
  }
}

/**
 * Best-effort hub heartbeat into runtime SSoT.
 * Requires a real local store so an unbound counter cannot POST 0.
 * Failures stay local. Never throws.
 */
export async function publishSiteLiveNodes(env, viewers) {
  try {
    if (!env?.VIEWS) return { ok: false, posted: false, reason: "no-store" };
    const payload = sitePresencePayload(viewers);
    if (!payload) return { ok: false, posted: false, reason: "no-count" };
    const dest = new URL(SITE_PRESENCE_PATH, RUNTIME + "/").toString();
    const init = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
      },
      body: JSON.stringify(payload),
      redirect: "manual",
    };
    if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
      init.signal = AbortSignal.timeout(2500);
    }
    let res;
    if (env.AZIEL_RUNTIME && typeof env.AZIEL_RUNTIME.fetch === "function") {
      res = await env.AZIEL_RUNTIME.fetch(new Request(dest, init));
    } else {
      res = await fetch(dest, init);
    }
    const status = res && typeof res.status === "number" ? res.status : 0;
    await cancelResponse(res);
    return { ok: status >= 200 && status < 300, posted: true, status };
  } catch {
    return { ok: false, posted: false };
  }
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
    live_nodes_includes_viewers: fields.live_nodes_includes_viewers === true || fields.includes_site_viewers === true,
    includes_site_viewers: fields.includes_site_viewers === true || fields.live_nodes_includes_viewers === true,
    note:
      "Live Nodes is runtime GET /v1/mesh live_nodes (human mesh users plus site viewers on godlock.uk, azieleliab.com, and azielcorpuslibrary.net). /count and /heartbeat publish that same number. site_live_nodes is this host's presence report and is not added again. A local human update best-effort POSTs /v1/mesh/site-presence. HDJ is excluded. Bots are not counted.",
    ...fields.extra,
  };
}
