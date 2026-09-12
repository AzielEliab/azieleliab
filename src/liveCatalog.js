/**
 * Software doors from the live aziel-runtime catalog.
 * Prefer a packed snapshot (Cache API + KV `software:catalog:v2`).
 * On miss: GET /v1/software once; fall back to GET /v1/fraggate/list.
 * Static SOFTWARE is last resort so the landing still renders.
 * Author: Aziel Eliab.
 */
import {
  AUTHOR,
  CANON_ORIGIN,
  CATALOG_NAMES,
  EMBRYOLOCK_WORKER,
  FRAGGATE_WORKER,
  LIBRARY,
  RUNTIME,
  RUNTIME_LOCAL,
  RUNTIME_SLUG,
  RUNTIME_VERSION,
  SOFTWARE,
  SOFTWARE_EXTRAS,
  resolveRuntimeVersion,
  canonicalSoftwareSlug,
  catalogHref,
  catalogWorkerHome,
  displaySoftwareName,
  isSoftwareExtra,
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
  const status = String(product.status || "").toLowerCase();
  if (status === "stub" || product.local_not_hosted === true) return true;
  return false;
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
  return { products, extras };
}

export function liveProductName(product) {
  const slug = String((product && product.slug) || "").trim();
  return displaySoftwareName(slug, (product && product.name) || CATALOG_NAMES[slug] || slug);
}

function firstHttpUrl(product, keys) {
  if (!product || typeof product !== "object") return "";
  for (const key of keys) {
    const value = product[key];
    if (typeof value === "string" && /^https?:\/\//i.test(value)) return value;
  }
  return "";
}

export function liveProductHref(product) {
  if (!product || typeof product !== "object") return "";
  const fromLive = firstHttpUrl(product, ["worker_home", "href", "home", "url"]);
  if (fromLive) return fromLive;
  const slug = String(product.slug || "").trim();
  if (slug === "embryolock") return EMBRYOLOCK_WORKER;
  if (slug === "aziel-corpus") return LIBRARY + "/";
  if (slug === RUNTIME_SLUG || slug === "runtime") return RUNTIME_LOCAL;
  if (slug === "fraggate") return FRAGGATE_WORKER;
  if (slug && CATALOG_NAMES[slug]) return catalogHref(slug);
  if (typeof product.github === "string" && /^https?:\/\//i.test(product.github)) return product.github;
  if (slug) return catalogWorkerHome(slug);
  return "";
}

export function catalogDoorRow(item) {
  if (!item || typeof item !== "object") return null;
  const name = item.name || liveProductName(item);
  const href = item.href || item.url || liveProductHref(item);
  if (!name || !href) return null;
  const slug = canonicalSoftwareSlug(item.slug, name) || String(item.slug || "").trim() || undefined;
  const row = { name, url: href };
  if (slug) row.slug = slug;
  const workerHome = firstHttpUrl(item, ["worker_home"]) || href;
  if (workerHome) row.worker_home = workerHome;
  if (item.status) row.status = item.status;
  if (item.version) row.version = item.version;
  if (item.one_line) row.one_line = item.one_line;
  if (item.github) row.github = item.github;
  if (item.bucket) row.bucket = item.bucket;
  if (item.download_url) row.download_url = item.download_url;
  if (item.surface) row.surface = item.surface;
  if (item.kind) row.kind = item.kind;
  if (item.software_tab === false) row.software_tab = false;
  if (item.enabled_default === false) row.enabled_default = false;
  if (item.path) row.path = item.path;
  if (item.spec) row.spec = item.spec;
  if (item.note) row.note = item.note;
  if (item.local_destructive_boundary != null) {
    row.local_destructive_boundary = item.local_destructive_boundary;
  }
  return row;
}

function doorKey(item) {
  const slug = canonicalSoftwareSlug(item && item.slug, item && item.name);
  return String(slug || (item && item.name) || "")
    .trim()
    .toLowerCase();
}

function mapLiveItem(row) {
  if (!row || typeof row !== "object") return null;
  const name = liveProductName(row);
  const href = liveProductHref(row);
  if (!name) return null;
  const slug = canonicalSoftwareSlug(row.slug, name) || String(row.slug || "").trim() || undefined;
  const item = {
    slug,
    name,
    href: href || undefined,
    url: href || undefined,
  };
  const workerHome = firstHttpUrl(row, ["worker_home"]) || href;
  if (workerHome) item.worker_home = workerHome;
  if (row.status) item.status = row.status;
  if (row.version) item.version = row.version;
  if (row.one_line) item.one_line = row.one_line;
  if (row.github) item.github = row.github;
  if (row.bucket) item.bucket = row.bucket;
  if (row.download_url) item.download_url = row.download_url;
  if (row.surface) item.surface = row.surface;
  if (row.kind) item.kind = row.kind;
  if (row.software_tab === false) item.software_tab = false;
  if (row.enabled_default === false) item.enabled_default = false;
  if (row.path) item.path = row.path;
  if (row.spec) item.spec = row.spec;
  if (row.note) item.note = row.note;
  if (row.local_destructive_boundary != null) {
    item.local_destructive_boundary = row.local_destructive_boundary;
  }
  return item;
}

function extrasFromLiveDoc(doc, seen) {
  const out = [];
  const add = (item) => {
    const mapped = mapLiveItem(item) || (item && typeof item === "object" ? { ...item } : null);
    if (!mapped) return;
    mapped.kind = mapped.kind || "extra";
    mapped.software_tab = false;
    const key = doorKey(mapped);
    if (!key || seen.has(key)) return;
    seen.add(key);
    out.push(mapped);
  };

  const { extras } = extractLiveRows(doc);
  for (const row of extras) {
    if (!row || typeof row !== "object") continue;
    add(row);
  }

  if (doc && typeof doc.fraggate === "string" && /^https?:\/\//i.test(doc.fraggate)) {
    add({ slug: "fraggate", name: "FragGate", worker_home: FRAGGATE_WORKER, url: FRAGGATE_WORKER, href: FRAGGATE_WORKER });
  } else if (doc && doc.fraggate && typeof doc.fraggate === "object" && !Array.isArray(doc.fraggate)) {
    add({ slug: "fraggate", name: "FragGate", ...doc.fraggate, href: liveProductHref(doc.fraggate) || FRAGGATE_WORKER });
  }

  if (doc && doc.mesh && typeof doc.mesh === "object" && !Array.isArray(doc.mesh)) {
    add({
      slug: "mesh",
      name: "mesh",
      enabled_default: doc.mesh.enabled_default === true ? true : false,
      path: doc.mesh.path || "/v1/mesh",
      spec: doc.mesh.spec || "QNM-BUILD-1.0",
      note: doc.mesh.note || "Suite rollup. Not a Softwares-tab product. Read-only suite presence is on (display from runtime). GET never enables.",
    });
  }

  for (const extra of SOFTWARE_EXTRAS) add(extra);
  return out;
}

export function softwareFromLiveDoc(doc) {
  const packed = catalogFromLiveDoc(doc);
  return packed.products;
}

export function catalogFromLiveDoc(doc) {
  const { products } = extractLiveRows(doc);
  const seenProducts = new Set();
  const seenExtras = new Set();
  const productOut = [];

  const addProduct = (row) => {
    const item = mapLiveItem(row);
    if (!item || !item.name || !item.href) return;
    if (isSoftwareExtra(item.slug, item.name)) return;
    const key = doorKey(item);
    if (!key || seenProducts.has(key)) return;
    seenProducts.add(key);
    productOut.push(item);
  };

  for (const row of products) addProduct(row);

  const extras = extrasFromLiveDoc(doc, seenExtras);
  if (!productOut.length) {
    return { products: SOFTWARE, extras };
  }
  return { products: sortSoftware(productOut), extras };
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

function fallbackCatalog(source, via) {
  return {
    software: SOFTWARE,
    products: SOFTWARE,
    extras: SOFTWARE_EXTRAS,
    source,
    via,
    version: RUNTIME_VERSION,
  };
}

function packedCatalog(products, extras, source, via, version) {
  const doors = products && products.length ? products : SOFTWARE;
  return {
    software: doors,
    products: doors,
    extras: extras && extras.length ? extras : SOFTWARE_EXTRAS,
    source,
    via,
    version: resolveRuntimeVersion(version),
  };
}

export async function fetchFreshSoftware(env) {
  const softwareDoc = await fetchRuntimeJson(SOFTWARE_CATALOG_PATH, env);
  if (softwareDoc) {
    const packed = catalogFromLiveDoc(softwareDoc);
    if (packed.products.length) {
      return packedCatalog(
        packed.products,
        packed.extras,
        "live",
        SOFTWARE_CATALOG_PATH,
        softwareDoc.version,
      );
    }
  }
  const listDoc = await fetchRuntimeJson(FRAGGATE_LIST_PATH, env);
  if (listDoc) {
    const packed = catalogFromLiveDoc(listDoc);
    if (packed.products.length) {
      return packedCatalog(
        packed.products,
        packed.extras,
        "fraggate-list",
        FRAGGATE_LIST_PATH,
        listDoc.version,
      );
    }
  }
  return fallbackCatalog("fallback", null);
}

export async function loadLiveSoftware(env, ctx) {
  const mem = recalledCatalog(env, CATALOG_TTL_SEC * 1000);
  if (mem && mem.software && mem.software.length) return normalizePacked(mem);
  const packed = await readJsonSnapshot(env, {
    cacheUrl: CATALOG_CACHE_URL,
    kvKey: CATALOG_KV_KEY,
    cacheTtl: CATALOG_TTL_SEC,
  });
  if (packed && Array.isArray(packed.software) && packed.software.length) {
    const live = normalizePacked(packed);
    rememberCatalog(env, live);
    return live;
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

function normalizePacked(packed) {
  if (!packed || typeof packed !== "object") return fallbackCatalog("fallback", null);
  const products = Array.isArray(packed.products)
    ? packed.products
    : Array.isArray(packed.software)
      ? packed.software
      : SOFTWARE;
  const extras = Array.isArray(packed.extras) ? packed.extras : SOFTWARE_EXTRAS;
  return packedCatalog(products, extras, packed.source || "fallback", packed.via || null, packed.version);
}

export function softwareIndexBody(live, mesh) {
  const packed = normalizePacked(live);
  const products = packed.products.map((item) => catalogDoorRow(item)).filter(Boolean);
  const extras = packed.extras.map((item) => catalogDoorRow(item) || extraCiteRow(item)).filter(Boolean);
  return {
    ok: true,
    author: AUTHOR,
    identity: AUTHOR,
    source: packed.source || "fallback",
    via: packed.via || null,
    catalog: RUNTIME + SOFTWARE_CATALOG_PATH,
    catalog_fallback: RUNTIME + FRAGGATE_LIST_PATH,
    mesh: mesh && typeof mesh === "object" ? mesh : undefined,
    products,
    extras,
    software: products,
    version: resolveRuntimeVersion(packed.version),
  };
}

function extraCiteRow(item) {
  if (!item || typeof item !== "object" || !item.name) return null;
  const row = { name: item.name, kind: item.kind || "extra", software_tab: false };
  if (item.slug) row.slug = item.slug;
  if (item.url || item.href) row.url = item.url || item.href;
  if (item.worker_home) row.worker_home = item.worker_home;
  if (item.status) row.status = item.status;
  if (item.enabled_default === false) row.enabled_default = false;
  if (item.path) row.path = item.path;
  if (item.spec) row.spec = item.spec;
  if (item.note) row.note = item.note;
  return row;
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
