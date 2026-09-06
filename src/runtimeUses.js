/**
 * Host-local /runtime API use tracker.
 * Reuses the VIEWS KV namespace with key prefix `runtime_uses|`
 * (no new RUNTIME_USES binding). Author: Aziel Eliab.
 */
import { APEX_HOST, AUTHOR, RUNTIME, RUNTIME_PATH, WWW_HOST } from "./copy.js";

export const USES_KEY_TOTAL = "runtime_uses|total";
export const USES_KEY_BY_PATH = "runtime_uses|by_path";
export const USES_KEY_RECENT = "runtime_uses|recent";
export const USES_RING = 80;
export const USES_HOST = WWW_HOST;
export const USES_VIA = APEX_HOST;
export const RUNTIME_VIA_VALUE = APEX_HOST;
export const RUNTIME_HOST_VALUE = WWW_HOST;

const SKIP_EXACT = new Set([
  "/robots.txt",
  "/sitemap.xml",
  "/sitemap-index.xml",
  "/llms.txt",
  "/ai.txt",
  "/cite.json",
  "/sigil.png",
  "/glama.json",
  "/openapi.json",
]);

const SKIP_GET_EXACT = new Set(["/v1/uses", "/v1/health", "/v1/ready"]);

const STATIC_EXT = /\.(png|jpe?g|gif|svg|webp|ico|css|js|mjs|map|woff2?|ttf|txt|xml)$/i;

export function runtimeDestPath(pathname) {
  let p = String(pathname || "").split("?")[0];
  if (p.startsWith(RUNTIME_PATH + "/")) p = p.slice(RUNTIME_PATH.length);
  else if (p === RUNTIME_PATH || p === RUNTIME_PATH + "/") p = "/";
  p = p.replace(/\/+$/, "") || "/";
  return p.startsWith("/") ? p : "/" + p;
}

export function isLocalUsesPath(pathname) {
  return runtimeDestPath(pathname) === "/v1/uses";
}

export function isSkipRuntimeSurface(pathname) {
  const p = runtimeDestPath(pathname);
  if (SKIP_EXACT.has(p)) return true;
  if (p !== "/" && STATIC_EXT.test(p)) return true;
  return false;
}

function isNamedApiPath(p) {
  if (p === "/mcp" || p.startsWith("/mcp/")) return true;
  if (p === "/v1/fraggate" || p.startsWith("/v1/fraggate/")) return true;
  if (p === "/v1/session" || p.startsWith("/v1/session/")) return true;
  if (p === "/v1/pull" || p.startsWith("/v1/pull/")) return true;
  return false;
}

export function shouldTrackRuntimeUse(pathname, method) {
  const verb = String(method || "GET").toUpperCase();
  if (verb === "HEAD" || verb === "OPTIONS") return false;
  const p = runtimeDestPath(pathname);
  if (isSkipRuntimeSurface(p)) return false;
  if (verb === "GET" && SKIP_GET_EXACT.has(p)) return false;
  if (isNamedApiPath(p)) return true;
  if (p === "/v1" || p.startsWith("/v1/")) return verb !== "GET";
  return false;
}

export function stampRuntimeAttribution(headers) {
  const out = headers instanceof Headers ? headers : new Headers(headers || {});
  out.set("X-Aziel-Runtime-Via", RUNTIME_VIA_VALUE);
  out.set("X-Aziel-Runtime-Host", RUNTIME_HOST_VALUE);
  return out;
}

function asInt(raw) {
  const n = Number.parseInt(String(raw || "0"), 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

async function readInt(env, key) {
  if (!env?.VIEWS) return 0;
  return asInt(await env.VIEWS.get(key));
}

function parseObject(raw) {
  try {
    const v = JSON.parse(raw || "{}");
    if (v && typeof v === "object" && !Array.isArray(v)) return v;
  } catch {
    /* ignore */
  }
  return {};
}

function parseArray(raw) {
  try {
    const v = JSON.parse(raw || "[]");
    if (Array.isArray(v)) return v;
  } catch {
    /* ignore */
  }
  return [];
}

export function usesBody(uses, by_path, recent, extra) {
  return {
    ok: true,
    host: USES_HOST,
    via: USES_VIA,
    uses,
    by_path,
    recent,
    author: AUTHOR,
    ...extra,
  };
}

export async function readUsesDoc(env) {
  let by_path = {};
  let recent = [];
  if (env?.VIEWS) {
    by_path = parseObject(await env.VIEWS.get(USES_KEY_BY_PATH));
    recent = parseArray(await env.VIEWS.get(USES_KEY_RECENT));
  }
  return usesBody(await readInt(env, USES_KEY_TOTAL), by_path, recent);
}

export async function recordRuntimeUse(env, event) {
  if (!env?.VIEWS) return;
  const path = String(event && event.path != null ? event.path : "/").slice(0, 200);
  const method = String((event && event.method) || "GET").toUpperCase();
  const status = Number(event && event.status) || 0;
  const at = (event && event.at) || new Date().toISOString();

  const total = (await readInt(env, USES_KEY_TOTAL)) + 1;
  const by_path = parseObject(await env.VIEWS.get(USES_KEY_BY_PATH));
  by_path[path] = asInt(by_path[path]) + 1;
  const recent = parseArray(await env.VIEWS.get(USES_KEY_RECENT));
  recent.unshift({ path, method, status, at });
  if (recent.length > USES_RING) recent.length = USES_RING;

  await env.VIEWS.put(USES_KEY_TOTAL, String(total));
  await env.VIEWS.put(USES_KEY_BY_PATH, JSON.stringify(by_path));
  await env.VIEWS.put(USES_KEY_RECENT, JSON.stringify(recent));
}

export async function fetchOriginUses(env) {
  try {
    const dest = new URL("/v1/uses", RUNTIME + "/");
    const init = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0",
        "X-Aziel-Runtime-Via": RUNTIME_VIA_VALUE,
        "X-Aziel-Runtime-Host": RUNTIME_HOST_VALUE,
      },
    };
    let res;
    if (env && env.AZIEL_RUNTIME && typeof env.AZIEL_RUNTIME.fetch === "function") {
      res = await env.AZIEL_RUNTIME.fetch(new Request(dest.toString(), init));
    } else {
      res = await fetch(dest.toString(), init);
    }
    if (!res || !res.ok) {
      try {
        if (res && res.body && typeof res.body.cancel === "function") await res.body.cancel();
      } catch {
        /* ignore */
      }
      return null;
    }
    const ct = String(res.headers.get("content-type") || "").toLowerCase();
    if (!ct.includes("json")) return null;
    const doc = await res.json();
    return doc && typeof doc === "object" ? doc : null;
  } catch {
    return null;
  }
}
