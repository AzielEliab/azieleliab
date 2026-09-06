/**
 * Quiet same-origin /runtime door for AI crawlers, MCP, OpenAPI, FragGate.
 * Proxies aziel-runtime (service binding AZIEL_RUNTIME, else HTTPS origin).
 * No human site chrome is injected. Author: Aziel Eliab.
 */
import { AUTHOR, LIBRARY_RUNTIME, RUNTIME, RUNTIME_LOCAL, RUNTIME_PATH } from "./copy.js";
import {
  fetchOriginUses,
  isLocalUsesPath,
  readUsesDoc,
  recordRuntimeUse,
  runtimeDestPath,
  shouldTrackRuntimeUse,
  stampRuntimeAttribution,
} from "./runtimeUses.js";

export const RUNTIME_ORIGIN = RUNTIME;
const UA = "Mozilla/5.0";

const HOP = new Set([
  "host",
  "connection",
  "keep-alive",
  "transfer-encoding",
  "content-length",
  "content-encoding",
  "te",
  "trailer",
  "upgrade",
  "proxy-connection",
]);

const PREFIX_PATHS = [
  "/v1/",
  "/openapi.json",
  "/mcp",
  "/cite.json",
  "/llms.txt",
  "/ai.txt",
  "/robots.txt",
  "/sitemap.xml",
  "/sitemap-index.xml",
  "/p/",
  "/sigil.png",
  "/glama.json",
];

export function isRuntimeRequest(pathname) {
  const raw = String(pathname || "");
  const p = raw.replace(/\/+$/, "") || "/";
  return p === RUNTIME_PATH || raw.startsWith(RUNTIME_PATH + "/");
}

export function destFromRuntimePath(pathname, search) {
  const raw = String(pathname || "");
  const q = search || "";
  if (raw === RUNTIME_PATH || raw === RUNTIME_PATH + "/") return "/" + q;
  if (!raw.startsWith(RUNTIME_PATH + "/")) return null;
  return raw.slice(RUNTIME_PATH.length) + q;
}

export function shouldPrefixRuntimePath(path) {
  const p = String(path || "");
  if (!p.startsWith("/") || p.startsWith("//") || p.startsWith(RUNTIME_PATH + "/") || p === RUNTIME_PATH) {
    return false;
  }
  return PREFIX_PATHS.some((pre) => p === pre || p.startsWith(pre));
}

export function rewriteOriginUrls(text) {
  let s = String(text == null ? "" : text);
  if (!s) return s;
  s = s.split(RUNTIME_ORIGIN + "/").join(RUNTIME_LOCAL + "/");
  s = s.split(RUNTIME_ORIGIN).join(RUNTIME_LOCAL);
  return s;
}

function rewriteRootAbsolute(text, { html = false, json = false } = {}) {
  let s = String(text || "");
  if (html) {
    s = s.replace(/\b(href|src|action)=(["'])(\/[^"']*)\2/gi, (m, attr, q, path) => {
      if (!shouldPrefixRuntimePath(path)) return m;
      return attr + "=" + q + RUNTIME_PATH + path + q;
    });
    s = s.replace(/\bcontent=(["'])(https?:\/\/[^"']+|\/[^"']+)\1/gi, (m, q, val) => {
      if (shouldPrefixRuntimePath(val)) return "content=" + q + RUNTIME_PATH + val + q;
      return m;
    });
  }
  if (json) {
    s = s.replace(/"(\/[^"]*)"/g, (m, path) => {
      if (!shouldPrefixRuntimePath(path)) return m;
      return '"' + RUNTIME_PATH + path + '"';
    });
  }
  return s;
}

export function rewriteRuntimeBody(text, contentType) {
  const ct = String(contentType || "").toLowerCase();
  let s = rewriteOriginUrls(text);
  const html = ct.includes("html");
  const json = ct.includes("json");
  if (html || json) s = rewriteRootAbsolute(s, { html, json });
  return s;
}

export function rewriteLocation(loc) {
  const raw = String(loc || "");
  if (!raw) return raw;
  if (raw.startsWith(RUNTIME_ORIGIN)) return rewriteOriginUrls(raw);
  if (shouldPrefixRuntimePath(raw)) return RUNTIME_PATH + raw;
  return raw;
}

function shouldRewriteType(ct) {
  const t = String(ct || "").toLowerCase();
  return /html|json|xml|text\/plain|text\/markdown|javascript/.test(t);
}

export function runtimeCors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Accept, Authorization, X-Aziel-Runtime-Token, MCP-Protocol-Version, mcp-session-id",
    "Access-Control-Expose-Headers":
      "X-Aziel-Runtime-Version, X-Aziel-Runtime-Role, X-Aziel-Runtime-Root, X-Aziel-Runtime-Via",
  };
}

function dropHopHeaders(headers) {
  const out = new Headers();
  for (const [k, v] of headers) {
    const key = k.toLowerCase();
    if (HOP.has(key) || key.startsWith("cf-")) continue;
    out.set(k, v);
  }
  if (!out.get("User-Agent")) out.set("User-Agent", UA);
  return stampRuntimeAttribution(out);
}

async function cancelBody(res) {
  try {
    if (res && res.body && typeof res.body.cancel === "function") await res.body.cancel();
  } catch {
    /* ignore */
  }
}

export async function proxyOrigin(request, destPathAndQuery, env) {
  const dest = new URL(destPathAndQuery, RUNTIME_ORIGIN + "/");
  const init = {
    method: request.method === "HEAD" && dest.pathname === "/" ? "GET" : request.method,
    headers: dropHopHeaders(request.headers),
    redirect: "manual",
  };
  if (init.method !== "GET" && init.method !== "HEAD") {
    init.body = request.body;
    if (init.body) init.duplex = "half";
  }
  if (env && env.AZIEL_RUNTIME && typeof env.AZIEL_RUNTIME.fetch === "function") {
    return env.AZIEL_RUNTIME.fetch(new Request(dest.toString(), init));
  }
  return fetch(dest.toString(), init);
}

function decorateHeaders(res, via) {
  const headers = new Headers(res.headers);
  headers.set("X-Aziel-Runtime-Root", RUNTIME_LOCAL);
  headers.set("X-Aziel-Runtime-Via", via);
  headers.set("X-Aziel-Runtime-Host", "www.azieleliab.com");
  for (const [k, v] of Object.entries(runtimeCors())) {
    headers.set(k, v);
  }
  const loc = headers.get("Location");
  if (loc) headers.set("Location", rewriteLocation(loc));
  return headers;
}

async function finishProxy(request, res, via) {
  const headers = decorateHeaders(res, via);
  const ct = headers.get("Content-Type") || "";
  if (request.method === "HEAD") {
    await cancelBody(res);
    return new Response(null, { status: res.status, statusText: res.statusText, headers });
  }
  if (!shouldRewriteType(ct)) {
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
  }
  const text = await res.text();
  const rewritten = rewriteRuntimeBody(text, ct);
  headers.delete("content-length");
  return new Response(rewritten, { status: res.status, statusText: res.statusText, headers });
}

function jsonError(body, status) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...runtimeCors() },
  });
}

function usesResponse(doc, method) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...runtimeCors(),
  };
  if (method === "HEAD") return new Response(null, { status: 200, headers });
  return new Response(JSON.stringify(doc, null, 2) + "\n", { status: 200, headers });
}

async function noteUse(request, url, env, ctx, status) {
  if (!shouldTrackRuntimeUse(url.pathname, request.method)) return;
  const job = recordRuntimeUse(env, {
    path: runtimeDestPath(url.pathname),
    method: request.method,
    status,
    at: new Date().toISOString(),
  });
  if (ctx && typeof ctx.waitUntil === "function") ctx.waitUntil(job);
  else await job;
}

export async function handleRuntimeRoot(request, url, env, ctx) {
  if (!isRuntimeRequest(url.pathname)) return null;
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: runtimeCors() });
  }
  if (isLocalUsesPath(url.pathname) && (request.method === "GET" || request.method === "HEAD")) {
    const doc = await readUsesDoc(env);
    const origin = await fetchOriginUses(env);
    if (origin) doc.origin = origin;
    return usesResponse(doc, request.method);
  }
  const dest = destFromRuntimePath(url.pathname, url.search);
  if (dest == null) return null;
  const via = env && env.AZIEL_RUNTIME ? "service-binding" : "origin-fetch";
  let res;
  try {
    res = await proxyOrigin(request, dest, env);
  } catch (err) {
    await noteUse(request, url, env, ctx, 502);
    return jsonError(
      {
        ok: false,
        error: "runtime origin unreachable",
        origin: RUNTIME_ORIGIN + "/",
        door: RUNTIME_LOCAL,
        library: LIBRARY_RUNTIME,
        author: AUTHOR,
        detail: String(err && err.message ? err.message : err),
      },
      502,
    );
  }
  const out = await finishProxy(request, res, via);
  await noteUse(request, url, env, ctx, out.status);
  return out;
}
