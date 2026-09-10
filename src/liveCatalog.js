/**
 * Software doors from the live aziel-runtime catalog.
 * Prefer a packed snapshot (Cache API + KV `software:catalog:v1`).
 * On miss: GET /v1/software once; fall back to GET /v1/fraggate/list.
 * Static SOFTWARE is last resort so the landing still renders.
 * Author: Aziel Eliab.
 */
import {
  AUTHOR,
  CANON_ORIGIN,
  CATALOG_NAMES,
  EMBRYOLOCK_HREF,
  EXTRA_SOFTWARE,
  FRAGGATE_WORKER,
  LIBRARY,
  RUNTIME,
  RUNTIME_LOCAL,
  RUNTIME_NAME,
  RUNTIME_SLUG,
  SOFTWARE,
  canonicalSoftwareSlug,
  catalogHref,
  catalogWorkerHome,
  displaySoftwareName,
  sortSoftware,
} from "./copy.js";
import { allowOriginRefresh } from "./costGuard.js";
import {
  CATALOG_CACHE_URL,
  CATALOG_FALLBACK_TTL_SEC,
  CATALOG_KV_KEY,
  CATALOG_TTL_SEC,
  UPDATE_CHECK_CACHE_URL,
  UPDATE_TTL_SEC,
  readJsonSnapshot,
  recalledCatalog,
  rememberCatalog,
  writeJsonSnapshot,
} from "./edgeCache.js";

export const SOFTWARE_CATALOG_PATH = "/v1/software";
export const FRAGGATE_LIST_PATH = "/v1/fraggate/list";
export const UPDATE_CHECK_PATH = "/v1/update/check";
export const UPDATE_PATH = "/v1/update";
export const UPDATE_CHECK_ORIGIN = RUNTIME + UPDATE_CHECK_PATH;
export const UPDATE_CHECK_LOCAL = CANON_ORIGIN + UPDATE_CHECK_PATH;

const UA = "Mozilla/5.0";
const FETCH_MS = 2500;

function firstArray(value) {
  return Array.isArray(value) ? value : null;
}

export function isHonestStub(product) {
  if (!product || typeof product !== "object") return false;
  const slug = String(product.slug || "").toLowerCase();
  const name = String(product.name || "").toLowerCase();
  return slug === "embryolock" || name === "embryolock";
}

export function extractLiveRows(doc) {
  if (Array.isArray(doc)) return { products: doc, extras: [] };
  if (!doc || typeof doc !== "object") return { products: [], extras: [] };
  const nested = doc.catalog && typeof doc.catalog === "object" ? doc.catalog : null;
  const products =
    firstArray(doc.products) ||
    firstArray(doc.software) ||
    firstArray(doc.entries) ||
    firstArray(doc.items) ||
    (nested && firstArray(nested.products)) ||
    [];
  const extras = firstArray(doc.extras) || firstArray(doc.stubs) || (nested && firstArray(nested.extras)) || [];
  if (!extras.length && doc.fraggate && typeof doc.fraggate === "object" && !Array.isArray(doc.fraggate)) {
    extras.push(doc.fraggate);
  }
  return { products, extras };
}

export function liveProductName(product) {
  const slug = String((product && product.slug) || "").trim();
  return displaySoftwareName(slug, (product && product.name) || CATALOG_NAMES[slug] || slug);
}

export function liveProductHref(product) {
  if (!product || typeof product !== "object") return "";
  if (isHonestStub(product)) return EMBRYOLOCK_HREF;
  const slug = String(product.slug || "").trim();
  for (const key of ["worker_home", "href", "home", "url"]) {
    const value = product[key];
    if (typeof value === "string" && /^https?:\/\//i.test(value)) return value;
  }
  if (slug === "aziel-corpus") return LIBRARY + "/";
  if (slug === RUNTIME_SLUG || slug === "runtime") return RUNTIME_LOCAL;
  if (slug === "fraggate") return FRAGGATE_WORKER;
  if (slug && CATALOG_NAMES[slug]) return catalogHref(slug);
  if (typeof product.github === "string" && /^https?:\/\//i.test(product.github)) return product.github;
  if (slug) return catalogWorkerHome(slug);
  return "";
}

function doorKey(item) {
  const slug = canonicalSoftwareSlug(item && item.slug, item && item.name);
  return String(slug || (item && item.name) || "")
    .trim()
    .toLowerCase();
}

export function softwareFromLiveDoc(doc) {
  const { products, extras } = extractLiveRows(doc);
  const rows = [...products, ...extras].filter((row) => row && typeof row === "object");
  const seen = new Set();
  const out = [];
  const add = (item) => {
    if (!item || !item.name || !item.href) return;
    const key = doorKey(item);
    if (!key || seen.has(key)) return;
    seen.add(key);
    out.push({
      slug: item.slug || undefined,
      name: item.name,
      href: item.href,
    });
  };

  for (const row of rows) {
    const name = liveProductName(row);
    const href = liveProductHref(row);
    if (!name || !href) continue;
    add({
      slug: canonicalSoftwareSlug(row.slug, name) || String(row.slug || "").trim() || undefined,
      name,
      href,
    });
  }

  add({ slug: "embryolock", name: "EmbryoLock", href: EMBRYOLOCK_HREF });
  add({ slug: RUNTIME_SLUG, name: RUNTIME_NAME, href: RUNTIME_LOCAL });
  add({ slug: "fraggate", name: "FragGate", href: FRAGGATE_WORKER });
  for (const extra of EXTRA_SOFTWARE) add(extra);

  if (!out.length) return SOFTWARE;
  return sortSoftware(out);
}

async function cancelBody(res) {
  try {
    if (res && res.body && typeof res.body.cancel === "function") await res.body.cancel();
  } catch {
    /* ignore */
  }
}

export async function fetchRuntimeJson(path, env, opts) {
  const dest = new URL(path, RUNTIME + "/");
  const signal =
    typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function"
      ? AbortSignal.timeout(FETCH_MS)
      : undefined;
  const init = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "User-Agent": UA,
    },
    signal,
  };
  let res;
  try {
    if (env && env.AZIEL_RUNTIME && typeof env.AZIEL_RUNTIME.fetch === "function") {
      res = await env.AZIEL_RUNTIME.fetch(new Request(dest.toString(), init));
    } else {
      res = await fetch(dest.toString(), init);
    }
  } catch {
    return null;
  }
  if (!res || !res.ok) {
    await cancelBody(res);
    return null;
  }
  try {
    const doc = await res.json();
    if (!doc || typeof doc !== "object") return null;
    if (opts && opts.loose) return doc;
    if (doc.error && !firstArray(doc.products) && !firstArray(doc.entries) && !firstArray(doc.software)) {
      return null;
    }
    return doc;
  } catch {
    return null;
  }
}

function catalogTtlSec(live) {
  return live && live.source && live.source !== "fallback" ? CATALOG_TTL_SEC : CATALOG_FALLBACK_TTL_SEC;
}

export async function fetchFreshSoftware(env) {
  const softwareDoc = await fetchRuntimeJson(SOFTWARE_CATALOG_PATH, env);
  if (softwareDoc) {
    const software = softwareFromLiveDoc(softwareDoc);
    if (software.length) {
      return { software, source: "live", via: SOFTWARE_CATALOG_PATH };
    }
  }
  const listDoc = await fetchRuntimeJson(FRAGGATE_LIST_PATH, env);
  if (listDoc) {
    const software = softwareFromLiveDoc(listDoc);
    if (software.length) {
      return { software, source: "fraggate-list", via: FRAGGATE_LIST_PATH };
    }
  }
  return { software: SOFTWARE, source: "fallback", via: null };
}

export async function loadLiveSoftware(env, ctx) {
  const mem = recalledCatalog(env, CATALOG_TTL_SEC * 1000);
  if (mem && mem.software && mem.software.length) return mem;
  const packed = await readJsonSnapshot(env, {
    cacheUrl: CATALOG_CACHE_URL,
    kvKey: CATALOG_KV_KEY,
    cacheTtl: CATALOG_TTL_SEC,
  });
  if (packed && Array.isArray(packed.software) && packed.software.length) {
    rememberCatalog(env, packed);
    return packed;
  }

  const live = await fetchFreshSoftware(env);
  rememberCatalog(env, live);
  const write = writeJsonSnapshot(
    env,
    ctx,
    { cacheUrl: CATALOG_CACHE_URL, kvKey: CATALOG_KV_KEY, ttlSec: catalogTtlSec(live) },
    live,
  );
  if (write && typeof write.then === "function") await write;
  return live;
}

export function softwareIndexBody(live, mesh) {
  const software = (live && live.software) || SOFTWARE;
  return {
    ok: true,
    author: AUTHOR,
    identity: AUTHOR,
    source: (live && live.source) || "fallback",
    via: (live && live.via) || null,
    catalog: RUNTIME + SOFTWARE_CATALOG_PATH,
    catalog_fallback: RUNTIME + FRAGGATE_LIST_PATH,
    mesh: mesh && typeof mesh === "object" ? mesh : undefined,
    software: software.map((item) => {
      const row = { name: item.name, url: item.href };
      if (item.slug) row.slug = item.slug;
      return row;
    }),
  };
}

export function updateCheckBody(originDoc) {
  const body = {
    ok: true,
    product: "azieleliab",
    author: AUTHOR,
    update_check: UPDATE_CHECK_ORIGIN,
    update_check_local: UPDATE_CHECK_LOCAL,
    note: "Quiet pointer for local installers this repo may ship. Runtime /v1/update/check is the authority when it answers.",
  };
  if (originDoc && typeof originDoc === "object") body.origin = originDoc;
  return body;
}

export async function loadUpdateCheck(env, ctx, opts) {
  const packed = await readJsonSnapshot(env, { cacheUrl: UPDATE_CHECK_CACHE_URL });
  if (packed && packed.ok) return packed;
  const request = opts && opts.request;
  const allowFetch = !request || allowOriginRefresh(request, env, "update");
  const body = updateCheckBody(allowFetch ? await fetchRuntimeJson(UPDATE_CHECK_PATH, env) : null);
  const write = writeJsonSnapshot(env, ctx, { cacheUrl: UPDATE_CHECK_CACHE_URL, ttlSec: UPDATE_TTL_SEC }, body);
  if (write && typeof write.then === "function") await write;
  return body;
}
