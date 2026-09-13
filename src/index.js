/** azieleliab.com landing Worker. Author: Aziel Eliab. */
import { aboutAliasPath, APEX_HOST, AUTHOR, CANON_ORIGIN, DESCRIPTION, isMissionPath, tabPage } from "./copy.js";
import {
  DONATE_CACHE_BUST,
  DONATE_HTML_CACHE,
  HTML_CACHE,
  JSON_SHORT_CACHE,
  SEO_CACHE,
  STUB_HTML_CACHE,
  matchPublicResponse,
  storePublicResponse,
} from "./edgeCache.js";
import {
  loadLiveSoftware,
  loadUpdateCheck,
  softwareIndexBody,
  UPDATE_CHECK_PATH,
  UPDATE_PATH,
} from "./liveCatalog.js";
import {
  loadMeshNodes,
  loadMeshStatus,
  MESH_NODES_PATH,
  MESH_STATUS_PATH,
  meshSnapshot,
} from "./mesh.js";
import { donateHtml, embryoLockHtml, notFoundHtml, pageHtml, sectionPageHtml, whoHtml } from "./page.js";
import { donateQrResponse } from "./qr.js";
import { sigilResponse } from "./sigil.js";
import { handleRuntimeRoot, isRuntimeRequest } from "./runtimeRoot.js";
import {
  graphJsonLd,
  personJsonLd,
  prettyJson,
  wellKnownAziel,
  whoIsTxt,
} from "./identity.js";
import { aiTxt, citeDoc, CONTENT_SIGNAL, llmsTxt, robotsTxt, sitemapXml } from "./seo.js";
import { incrementViews, isBot, readViews, viewsBody } from "./views.js";

const SECURITY = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "DENY",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

function text(body, type, extra) {
  return new Response(body, {
    status: 200,
    headers: {
      "content-type": type + "; charset=utf-8",
      "cache-control": extra?.cache || "public, max-age=300",
      "Content-Signal": CONTENT_SIGNAL,
      ...SECURITY,
      ...(extra?.cors ? CORS : {}),
    },
  });
}

function html(body, status = 200, cache) {
  return new Response(body, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": status === 200 ? cache || HTML_CACHE : "public, max-age=60",
      "Content-Signal": CONTENT_SIGNAL,
      ...SECURITY,
    },
  });
}

function json(doc, cache) {
  return text(JSON.stringify(doc) + "\n", "application/json", {
    cache: cache || "no-store",
    cors: true,
  });
}

// Door-index files stay off the Worker Cache API so a deploy cannot
// re-pin a pre-cross-tether llms/ai/sitemap after the CDN revalidates.
const PAGE_CACHE_PATHS = new Set([
  "/",
  "/embryolock",
  "/robots.txt",
  "/cite.json",
  "/v1/software",
  "/sigil.png",
]);

export function donateCacheBustLocation(url) {
  return String(url.origin || CANON_ORIGIN) + "/donate?v=" + DONATE_CACHE_BUST;
}

function noteViews(request, env, ctx) {
  if (request.method !== "GET") return;
  const ua = request.headers.get("user-agent") || "";
  if (isBot(ua)) return;
  const job = incrementViews(env);
  if (ctx && typeof ctx.waitUntil === "function") ctx.waitUntil(job);
  else return job;
}

export function apexRedirect(url) {
  const host = String(url.hostname || "").toLowerCase();
  if (host === APEX_HOST) {
    return CANON_ORIGIN + url.pathname + url.search;
  }
  return "";
}

export function routePath(pathname) {
  if (pathname !== "/" && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname || "/";
}

async function pageViews(request, env) {
  const ua = request.headers.get("user-agent") || "";
  if (isBot(ua)) return readViews(env);
  return incrementViews(env);
}

export async function handleRequest(request, env = {}, ctx) {
  const url = new URL(request.url);
  const toWww = apexRedirect(url);
  if (toWww) {
    return Response.redirect(toWww, 301);
  }

  if (isRuntimeRequest(url.pathname)) {
    const runtime = await handleRuntimeRoot(request, url, env, ctx);
    if (runtime) return runtime;
  }

  const path = routePath(url.pathname);
  const jsonGet = new Set([
    "/v1/view",
    "/v1/stats",
    "/v1/software",
    UPDATE_PATH,
    UPDATE_CHECK_PATH,
    MESH_STATUS_PATH,
    MESH_NODES_PATH,
    "/person.jsonld",
    "/identity.jsonld",
    "/graph.jsonld",
    "/.well-known/aziel.json",
    "/.well-known/person.jsonld",
  ]);
  if (request.method === "OPTIONS" && jsonGet.has(path)) {
    return new Response(null, { status: 204, headers: { ...SECURITY, ...CORS } });
  }

  const allowWrite = path === "/v1/view";
  if (request.method !== "GET" && request.method !== "HEAD" && !(allowWrite && request.method === "POST")) {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { allow: allowWrite ? "GET, HEAD, POST, OPTIONS" : "GET, HEAD", ...SECURITY },
    });
  }

  const qrPng = donateQrResponse(url.pathname, SECURITY);
  if (qrPng) {
    if (request.method === "HEAD") {
      return new Response(null, { status: qrPng.status, headers: qrPng.headers });
    }
    return qrPng;
  }

  const sigilPng = sigilResponse(url.pathname, SECURITY);
  if (sigilPng) {
    if (request.method === "HEAD") {
      return new Response(null, { status: sigilPng.status, headers: sigilPng.headers });
    }
    return sigilPng;
  }

  // Bare /donate is still HITing old stroke-SVG HTML at the CF edge
  // (s-maxage=3600). Force a new cache key so PNG <img> rails stick.
  if (path === "/donate" && !url.searchParams.has("v")) {
    return Response.redirect(donateCacheBustLocation(url), 302);
  }

  if (PAGE_CACHE_PATHS.has(path)) {
    const hit = await matchPublicResponse(request, env);
    if (hit) {
      if (path === "/") await noteViews(request, env, ctx);
      if (request.method === "HEAD") {
        return new Response(null, { status: hit.status, headers: hit.headers });
      }
      return hit;
    }
  }

  if (isMissionPath(path)) {
    return Response.redirect(CANON_ORIGIN + "/", 301);
  }

  const aboutPath = aboutAliasPath(path);
  const tab = tabPage(path);
  const azielAlias = path === "/aziel";
  const homeLike = path === "/" || Boolean(aboutPath) || Boolean(tab) || azielAlias;
  const needsLive =
    homeLike ||
    path === "/llms.txt" ||
    path === "/cite.json" ||
    path === "/sitemap.xml" ||
    path === "/v1/software";
  const needsMesh = homeLike || path === "/v1/software";
  const [live, meshStatus] = await Promise.all([
    needsLive ? loadLiveSoftware(env, ctx) : Promise.resolve(null),
    needsMesh ? loadMeshStatus(env, ctx) : Promise.resolve(null),
  ]);
  const doors = live && live.software;
  const mesh = meshStatus ? meshSnapshot(meshStatus.origin) : null;

  let res;
  if (path === "/") {
    res = html(pageHtml(await pageViews(request, env), doors, meshStatus, live && live.version));
  } else if (aboutPath) {
    res = html(
      pageHtml(await readViews(env), doors, meshStatus, live && live.version, {
        canonical: CANON_ORIGIN + aboutPath,
      }),
    );
  } else if (azielAlias) {
    res = html(
      pageHtml(await readViews(env), doors, meshStatus, live && live.version, {
        section: { title: AUTHOR, description: DESCRIPTION, path: "/aziel" },
        canonical: CANON_ORIGIN + "/aziel",
      }),
    );
  } else if (tab) {
    res = html(sectionPageHtml(tab, await readViews(env), doors, meshStatus, live && live.version));
  } else if (path === "/donate") res = html(donateHtml(), 200, DONATE_HTML_CACHE);
  else if (path === "/embryolock") res = html(embryoLockHtml(), 200, STUB_HTML_CACHE);
  else if (path === "/robots.txt") res = text(robotsTxt(), "text/plain", { cache: SEO_CACHE });
  else if (path === "/llms.txt") res = text(llmsTxt(doors), "text/plain", { cache: SEO_CACHE });
  else if (path === "/person.jsonld" || path === "/identity.jsonld" || path === "/.well-known/person.jsonld") {
    res = text(prettyJson(personJsonLd()), "application/ld+json", { cache: SEO_CACHE, cors: true });
  } else if (path === "/graph.jsonld") {
    res = text(prettyJson(graphJsonLd()), "application/ld+json", { cache: SEO_CACHE, cors: true });
  } else if (path === "/who") {
    res = html(whoHtml());
  } else if (path === "/who-is-aziel-eliab.txt" || path === "/who-is") {
    res = text(whoIsTxt(), "text/plain", { cache: SEO_CACHE });
  } else if (path === "/.well-known/aziel.json") {
    res = text(prettyJson(wellKnownAziel()), "application/json", { cache: SEO_CACHE, cors: true });
  } else if (path === "/ai.txt") res = text(aiTxt(), "text/plain", { cache: SEO_CACHE });
  else if (path === "/cite.json") {
    res = text(JSON.stringify(citeDoc(doors, live && live.version), null, 1) + "\n", "application/json", { cache: SEO_CACHE });
  } else if (path === "/sitemap.xml") {
    res = text(sitemapXml(new Date(), doors), "application/xml", { cache: SEO_CACHE });
  } else if (path === "/v1/software") {
    res = json(softwareIndexBody(live, mesh), JSON_SHORT_CACHE);
  } else if (path === MESH_STATUS_PATH) {
    res = json(meshStatus || (await loadMeshStatus(env, ctx, { request })), JSON_SHORT_CACHE);
  } else if (path === MESH_NODES_PATH) {
    res = json(await loadMeshNodes(env, ctx, { request }), JSON_SHORT_CACHE);
  } else if (path === UPDATE_PATH || path === UPDATE_CHECK_PATH) {
    res = json(await loadUpdateCheck(env, ctx, { request }), JSON_SHORT_CACHE);
  } else if (path === "/v1/stats" || (path === "/v1/view" && request.method !== "POST")) {
    res = json(viewsBody(await readViews(env)));
  } else if (path === "/v1/view" && request.method === "POST") {
    res = json(viewsBody(await incrementViews(env)));
  } else {
    res = html(notFoundHtml(), 404);
  }

  await storePublicResponse(request, env, ctx, res);

  if (request.method === "HEAD") {
    return new Response(null, { status: res.status, headers: res.headers });
  }
  return res;
}

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env, ctx);
  },
};
