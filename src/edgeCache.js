/**
 * Edge snapshots for azieleliab.com.
 * Cache API (per-colo) plus one KV key — never list/walk.
 * Rate-limit here means cost/abuse protection, not content rationing.
 * Author: Aziel Eliab.
 */

export const CATALOG_KV_KEY = "software:catalog:v2";
export const CATALOG_CACHE_URL = "https://www.azieleliab.com/__cache/software-catalog-v2";
export const MESH_STATUS_CACHE_URL = "https://www.azieleliab.com/__cache/mesh-status-v1";
export const MESH_NODES_CACHE_URL = "https://www.azieleliab.com/__cache/mesh-nodes-v1";
export const UPDATE_CHECK_CACHE_URL = "https://www.azieleliab.com/__cache/update-check-v1";

export const CATALOG_TTL_SEC = 120;
export const CATALOG_FALLBACK_TTL_SEC = 60;
export const MESH_TTL_SEC = 60;
export const UPDATE_TTL_SEC = 60;
/** Short HTML TTL so title/meta/JSON-LD stay indexable; catalog snapshot is separate. */
export const HTML_CACHE = "public, max-age=0, s-maxage=60, stale-while-revalidate=300";
export const STUB_HTML_CACHE = "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400";
/** Donate HTML must not sit in CF edge after QR asset swaps. */
export const DONATE_HTML_CACHE = "no-store, max-age=0, must-revalidate";
export const DONATE_CACHE_BUST = "png";
export const SEO_CACHE = "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800";
export const JSON_SHORT_CACHE = "public, max-age=60, s-maxage=120, stale-while-revalidate=600";

const catalogMem = new WeakMap();

export function memoryCache() {
  const store = new Map();
  return {
    async match(req) {
      const row = store.get(cacheRequest(req.url || req).url);
      if (!row) return undefined;
      return new Response(row.body, { status: 200, headers: row.headers });
    },
    async put(req, res) {
      const headers = new Headers(res.headers);
      store.set(cacheRequest(req.url || req).url, { body: await res.text(), headers });
    },
  };
}

export function cacheBackend(env) {
  if (env && env.__CACHE) return env.__CACHE;
  if (typeof caches !== "undefined" && caches && caches.default) return caches.default;
  return null;
}

export function cacheRequest(url) {
  return new Request(String(url), { method: "GET" });
}

function parseJson(raw) {
  if (raw && typeof raw === "object") return raw;
  try {
    const doc = JSON.parse(String(raw || ""));
    return doc && typeof doc === "object" ? doc : null;
  } catch {
    return null;
  }
}

export async function readJsonSnapshot(env, { cacheUrl, kvKey, cacheTtl }) {
  const api = cacheBackend(env);
  if (api && typeof api.match === "function") {
    try {
      const hit = await api.match(cacheRequest(cacheUrl));
      if (hit && hit.ok) {
        const doc = parseJson(await hit.text());
        if (doc) return doc;
      }
    } catch {
      /* Cache API is optional in tests / some runtimes */
    }
  }
  if (env && env.VIEWS && kvKey && typeof env.VIEWS.get === "function") {
    try {
      const opts = cacheTtl ? { cacheTtl } : undefined;
      const doc = parseJson(await env.VIEWS.get(kvKey, opts));
      if (doc) return doc;
    } catch {
      /* ignore */
    }
  }
  return null;
}

async function writeJsonSnapshotNow(env, { cacheUrl, kvKey, ttlSec }, doc) {
  const body = JSON.stringify(doc);
  const api = cacheBackend(env);
  if (api && typeof api.put === "function") {
    try {
      await api.put(
        cacheRequest(cacheUrl),
        new Response(body, {
          status: 200,
          headers: {
            "content-type": "application/json; charset=utf-8",
            "cache-control": "public, max-age=" + ttlSec + ", s-maxage=" + ttlSec,
          },
        }),
      );
    } catch {
      /* ignore */
    }
  }
  if (env && env.VIEWS && kvKey && typeof env.VIEWS.put === "function") {
    const expirationTtl = Math.max(60, Number(ttlSec) || 60);
    await env.VIEWS.put(kvKey, body, { expirationTtl });
  }
}

export function writeJsonSnapshot(env, ctx, spec, doc) {
  const job = writeJsonSnapshotNow(env, spec, doc);
  if (ctx && typeof ctx.waitUntil === "function") {
    ctx.waitUntil(job);
    return;
  }
  return job;
}

export function rememberCatalog(env, live) {
  if (env && live) catalogMem.set(env, { at: Date.now(), live });
}

export function recalledCatalog(env, ttlMs) {
  if (!env) return null;
  const row = catalogMem.get(env);
  if (!row || !row.live) return null;
  if (Date.now() - row.at > (ttlMs || CATALOG_TTL_SEC * 1000)) return null;
  return row.live;
}

export async function matchPublicResponse(request, env) {
  const api = cacheBackend(env);
  if (!api || typeof api.match !== "function") return null;
  if (request.method !== "GET" && request.method !== "HEAD") return null;
  try {
    const hit = await api.match(cacheRequest(request.url));
    return hit && hit.ok ? hit : null;
  } catch {
    return null;
  }
}

export function storePublicResponse(request, env, ctx, response) {
  const api = cacheBackend(env);
  if (!api || typeof api.put !== "function") return;
  if (request.method !== "GET") return;
  if (!response || response.status !== 200) return;
  const control = String(response.headers.get("cache-control") || "");
  if (!control || /no-store|no-cache|private/i.test(control)) return;
  try {
    const job = api.put(cacheRequest(request.url), response.clone());
    if (ctx && typeof ctx.waitUntil === "function") {
      ctx.waitUntil(job);
      return;
    }
    return job;
  } catch {
    /* ignore */
  }
}
