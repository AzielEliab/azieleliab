/** azieleliab.com landing Worker. Author: Aziel Eliab. */
import { aboutAliasPath, APEX_HOST, AUTHOR, CANON_ORIGIN, DESCRIPTION, isMissionPath, tabPage } from "./copy.js";
import {
  DONATE_CACHE_BUST,
  CATALOG_HTTP_CACHE,
  DONATE_HTML_CACHE,
  HTML_CACHE,
  JSON_SHORT_CACHE,
  MESH_HTTP_CACHE,
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
  loadMesh,
  loadMeshNodes,
  loadMeshStatus,
  MESH_NODES_PATH,
  MESH_PATH,
  MESH_STATUS_PATH,
  meshSnapshot,
  overlaySitePresence,
  publicClockFields,
} from "./mesh.js";
import {
  COUNT_PATH,
  COUNT_V1_PATH,
  HEARTBEAT_PATH,
  HEARTBEAT_V1_PATH,
  countBody,
  isCountPath,
  isHeartbeatPath,
  publishSiteLiveNodes,
  readSiteLiveNodes,
  shouldTouchPresence,
  touchSitePresence,
} from "./presence.js";
import {
  CITE_DONT_MERGE,
  INGEST_BYTES_PATH,
  INGEST_PATH,
  REEXPAND_PATH,
  VERIFY_PATH,
  canonicalPageBytes,
  ingestRecord,
  reexpandDoc,
  verifyPastedHash,
} from "./ingest.js";
import { donateHtml, embryoLockHtml, ingestHtml, notFoundHtml, pageHtml, receiptsHtml, sectionPageHtml, verifyHtml, whoHtml } from "./page.js";
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
import { helpBody, isHelpPath } from "./help.js";
import {
  azGeneratorCallRefuse,
  azGeneratorCite,
  cap7ResolveInjectRefuse,
  doiInjectionRefuse,
  foldlockTipFoldLooksLike,
  foldlockTipFoldRefuse,
  looksLikeCap7ResolveInject,
  meshGetEnableRefuse,
  meshGetLooksLikeEnable,
  bodyHasTokenKey,
  tokenBodyRefuse,
  tokenPresentedInSearch,
  tokenQueryRefuse,
} from "./redline.js";
import { SHELVES_JSON_PATH, SHELVES_PATH, shelvesDoc } from "./shelves.js";
import { SURVIVAL_JSON_PATH, SURVIVAL_PATH, loadSurvival } from "./survival.js";
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

function refuseJson(doc, status = 400) {
  return new Response(JSON.stringify(doc) + "\n", {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "Content-Signal": CONTENT_SIGNAL,
      ...SECURITY,
      ...CORS,
    },
  });
}

function meshDoorPath(path) {
  return (
    path === MESH_PATH ||
    path === MESH_STATUS_PATH ||
    path === MESH_NODES_PATH ||
    path === "/v1/mesh/az-generator"
  );
}

function machineCitePath(path) {
  return (
    path === "/cite.json" ||
    path === SHELVES_PATH ||
    path === SHELVES_JSON_PATH ||
    path === "/v1/mesh/az-generator" ||
    path === SURVIVAL_PATH ||
    path === SURVIVAL_JSON_PATH
  );
}

async function attackSimRefuse(request, url, path) {
  if (tokenPresentedInSearch(url.searchParams)) {
    return refuseJson(tokenQueryRefuse());
  }

  if (request.method === "POST" || request.method === "PUT") {
    const ctype = String(request.headers.get("content-type") || "");
    if (/\bapplication\/json\b/i.test(ctype)) {
      let body = null;
      try {
        body = await request.clone().json();
      } catch {
        body = null;
      }
      if (bodyHasTokenKey(body)) return refuseJson(tokenBodyRefuse());
      if (meshGetLooksLikeEnable(url.searchParams, body) && meshDoorPath(path)) {
        return refuseJson(meshGetEnableRefuse());
      }
      if (looksLikeCap7ResolveInject(url.searchParams, body) && machineCitePath(path)) {
        return refuseJson(cap7ResolveInjectRefuse());
      }
      if (foldlockTipFoldLooksLike(url.searchParams, body) && machineCitePath(path)) {
        return refuseJson(foldlockTipFoldRefuse());
      }
      if (path === "/v1/mesh/az-generator") return refuseJson(azGeneratorCallRefuse());
      if (path === "/v1/mesh/enable") return refuseJson(meshGetEnableRefuse({ code: "MESH-GET-NEVER-ENABLES" }));
    } else if (path === "/v1/mesh/az-generator") {
      return refuseJson(azGeneratorCallRefuse());
    }
  }

  if (meshDoorPath(path) && meshGetLooksLikeEnable(url.searchParams)) {
    return refuseJson(meshGetEnableRefuse());
  }
  if (machineCitePath(path) && looksLikeCap7ResolveInject(url.searchParams)) {
    return refuseJson(cap7ResolveInjectRefuse());
  }
  if (machineCitePath(path) && foldlockTipFoldLooksLike(url.searchParams)) {
    return refuseJson(foldlockTipFoldRefuse());
  }
  if (path === "/cite.json") {
    const doiRefuse = doiInjectionRefuse(url.searchParams.get("doi"));
    if (doiRefuse) return refuseJson(doiRefuse);
  }
  if (path === "/v1/mesh/az-generator" && (request.method === "GET" || request.method === "HEAD")) {
    return json(azGeneratorCite(), SEO_CACHE);
  }
  return null;
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

async function sitePresenceFor(request, env, touch, ctx) {
  if (touch && shouldTouchPresence(request)) {
    const n = await touchSitePresence(env, request);
    const job = publishSiteLiveNodes(env, n).catch(() => ({ ok: false, posted: false }));
    if (ctx && typeof ctx.waitUntil === "function") ctx.waitUntil(job);
    else await job;
    return n;
  }
  return readSiteLiveNodes(env);
}

async function meshWithPresence(meshDoc, env, request, touch, ctx) {
  const site = await sitePresenceFor(request, env, touch, ctx);
  return overlaySitePresence(meshDoc, site);
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

  const path = routePath(url.pathname);
  const attack = await attackSimRefuse(request, url, path);
  if (attack) return attack;

  if (isRuntimeRequest(url.pathname)) {
    const runtime = await handleRuntimeRoot(request, url, env, ctx);
    if (runtime) return runtime;
  }
  const jsonGet = new Set([
    "/v1/view",
    "/v1/stats",
    "/v1/software",
    UPDATE_PATH,
    UPDATE_CHECK_PATH,
    MESH_PATH,
    MESH_STATUS_PATH,
    MESH_NODES_PATH,
    COUNT_PATH,
    COUNT_V1_PATH,
    HEARTBEAT_PATH,
    HEARTBEAT_V1_PATH,
    SURVIVAL_PATH,
    SURVIVAL_JSON_PATH,
    "/person.jsonld",
    "/identity.jsonld",
    "/graph.jsonld",
    "/.well-known/aziel.json",
    "/.well-known/person.jsonld",
    REEXPAND_PATH,
    VERIFY_PATH,
  ]);
  if (request.method === "OPTIONS" && jsonGet.has(path)) {
    return new Response(null, { status: 204, headers: { ...SECURITY, ...CORS } });
  }

  const allowWrite = path === "/v1/view" || isHeartbeatPath(path);
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
      if (path === "/" && shouldTouchPresence(request)) {
        const job = touchSitePresence(env, request)
          .then((n) => publishSiteLiveNodes(env, n))
          .catch(() => ({ ok: false, posted: false }));
        if (ctx && typeof ctx.waitUntil === "function") ctx.waitUntil(job);
        else await job;
      }
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
    path === "/ai.txt" ||
    path === "/cite.json" ||
    path === "/sitemap.xml" ||
    path === "/v1/software" ||
    path === "/graph.jsonld" ||
    path === "/who-is" ||
    path === "/who-is-aziel-eliab.txt" ||
    path === "/.well-known/aziel.json";
  const pageViewerPath =
    homeLike ||
    path === "/receipts" ||
    path === INGEST_PATH ||
    path === "/donate" ||
    path === "/embryolock" ||
    path === "/who";
  const needsMesh =
    homeLike ||
    path === "/v1/software" ||
    path === MESH_PATH ||
    path === MESH_STATUS_PATH ||
    path === MESH_NODES_PATH ||
    isCountPath(path) ||
    isHeartbeatPath(path);
  const needsSurvival =
    path === "/llms.txt" ||
    path === "/ai.txt" ||
    path === "/cite.json" ||
    path === "/who-is" ||
    path === "/who-is-aziel-eliab.txt" ||
    path === SURVIVAL_PATH ||
    path === SURVIVAL_JSON_PATH;
  const [live, meshDoc, survival] = await Promise.all([
    needsLive ? loadLiveSoftware(env, ctx) : Promise.resolve(null),
    needsMesh ? loadMesh(env, ctx) : Promise.resolve(null),
    needsSurvival ? loadSurvival(env, ctx) : Promise.resolve(null),
  ]);
  const doors = live && live.software;
  const htmlPresence = pageViewerPath && request.method === "GET";
  const meshDocLive = meshDoc
    ? await meshWithPresence(meshDoc, env, request, htmlPresence, ctx)
    : htmlPresence
      ? overlaySitePresence(null, await sitePresenceFor(request, env, true, ctx))
      : null;
  const mesh = meshDocLive ? overlaySitePresence(meshSnapshot(meshDocLive.origin), meshDocLive.site_live_nodes) : null;

  let res;
  if (path === "/") {
    res = html(pageHtml(await pageViews(request, env), doors, meshDocLive, live && live.version));
  } else if (aboutPath) {
    res = html(
      pageHtml(await readViews(env), doors, meshDocLive, live && live.version, {
        canonical: CANON_ORIGIN + aboutPath,
      }),
    );
  } else if (azielAlias) {
    res = html(
      pageHtml(await readViews(env), doors, meshDocLive, live && live.version, {
        section: { title: AUTHOR, description: DESCRIPTION, path: "/aziel" },
        canonical: CANON_ORIGIN + "/aziel",
      }),
    );
  } else if (tab) {
    res = html(sectionPageHtml(tab, await readViews(env), doors, meshDocLive, live && live.version));
  } else if (path === "/receipts") res = html(await receiptsHtml());
  else if (path === INGEST_PATH) res = html(ingestHtml());
  else if (path === INGEST_BYTES_PATH) res = text(canonicalPageBytes(), "text/plain", { cache: SEO_CACHE });
  else if (path === VERIFY_PATH) {
    const pasted = url.searchParams.get("hash") || url.searchParams.get("h") || "";
    const result = verifyPastedHash(pasted);
    const accept = String(request.headers.get("accept") || "");
    const wantJson =
      url.searchParams.get("format") === "json" || /\bapplication\/json\b/i.test(accept);
    res = wantJson
      ? json({ ok: true, author: AUTHOR, cite_dont_merge: CITE_DONT_MERGE, ...result, tip: ingestRecord().tip })
      : html(verifyHtml(result, pasted));
  } else if (path === REEXPAND_PATH) {
    res = json(reexpandDoc(), SEO_CACHE);
  } else if (path === "/donate") res = html(donateHtml(), 200, DONATE_HTML_CACHE);
  else if (path === "/embryolock") res = html(embryoLockHtml(), 200, STUB_HTML_CACHE);
  else if (path === "/robots.txt") res = text(robotsTxt(), "text/plain", { cache: SEO_CACHE });
  else if (path === "/llms.txt") res = text(llmsTxt(doors, survival), "text/plain", { cache: SEO_CACHE });
  else if (path === "/person.jsonld" || path === "/identity.jsonld" || path === "/.well-known/person.jsonld") {
    res = text(prettyJson(personJsonLd()), "application/ld+json", { cache: SEO_CACHE, cors: true });
  } else if (path === "/graph.jsonld") {
    res = text(prettyJson(graphJsonLd(doors)), "application/ld+json", { cache: SEO_CACHE, cors: true });
  } else if (path === "/who") {
    res = html(whoHtml());
  } else if (path === "/who-is-aziel-eliab.txt" || path === "/who-is") {
    res = text(whoIsTxt(survival, doors), "text/plain", { cache: SEO_CACHE });
  } else if (path === "/.well-known/aziel.json") {
    res = text(prettyJson(wellKnownAziel()), "application/json", { cache: SEO_CACHE, cors: true });
  } else if (path === "/ai.txt") res = text(aiTxt(survival, doors), "text/plain", { cache: SEO_CACHE });
  else if (isHelpPath(path)) res = text(helpBody(path), "text/plain", { cache: SEO_CACHE });
  else if (path === SURVIVAL_PATH || path === SURVIVAL_JSON_PATH) {
    res = json(survival || (await loadSurvival(env, ctx, { request })), JSON_SHORT_CACHE);
  }
  else if (path === SHELVES_PATH || path === SHELVES_JSON_PATH) {
    res = text(JSON.stringify(shelvesDoc(), null, 1) + "\n", "application/json", {
      cache: SEO_CACHE,
      cors: true,
    });
  } else if (path === "/cite.json") {
    res = text(JSON.stringify(citeDoc(doors, live && live.version, survival), null, 1) + "\n", "application/json", { cache: SEO_CACHE });
  } else if (path === "/sitemap.xml") {
    res = text(sitemapXml(new Date(), doors), "application/xml", { cache: SEO_CACHE });
  } else if (path === "/v1/software") {
    res = json(softwareIndexBody(live, mesh), CATALOG_HTTP_CACHE);
  } else if (path === MESH_PATH) {
    res = json(meshDocLive || (await meshWithPresence(await loadMesh(env, ctx, { request }), env, request, false)), MESH_HTTP_CACHE);
  } else if (path === MESH_STATUS_PATH) {
    res = json(await meshWithPresence(await loadMeshStatus(env, ctx, { request }), env, request, false), MESH_HTTP_CACHE);
  } else if (path === MESH_NODES_PATH) {
    res = json(await meshWithPresence(await loadMeshNodes(env, ctx, { request }), env, request, false), MESH_HTTP_CACHE);
  } else if (isCountPath(path)) {
    res = json(
      countBody({
        ...publicClockFields(meshDocLive || overlaySitePresence(null, await readSiteLiveNodes(env))),
        views: await readViews(env),
      }),
    );
  } else if (isHeartbeatPath(path)) {
    const beat = await meshWithPresence(meshDoc || (await loadMesh(env, ctx, { request })), env, request, request.method === "POST", ctx);
    res = json(
      countBody({
        ...publicClockFields(beat),
        views: await readViews(env),
        extra: { heartbeat: request.method === "POST" },
      }),
    );
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
