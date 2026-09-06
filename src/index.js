/** azieleliab.com landing Worker. Author: Aziel Eliab. */
import { APEX_HOST, CANON_ORIGIN } from "./copy.js";
import { notFoundHtml, pageHtml } from "./page.js";
import { handleRuntimeRoot, isRuntimeRequest } from "./runtimeRoot.js";
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

function html(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": status === 200 ? "no-store" : "public, max-age=60",
      "Content-Signal": CONTENT_SIGNAL,
      ...SECURITY,
    },
  });
}

function json(doc) {
  return text(JSON.stringify(doc) + "\n", "application/json", { cache: "no-store", cors: true });
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
  if (request.method === "OPTIONS" && (path === "/v1/view" || path === "/v1/stats")) {
    return new Response(null, { status: 204, headers: { ...SECURITY, ...CORS } });
  }

  const allowWrite = path === "/v1/view";
  if (request.method !== "GET" && request.method !== "HEAD" && !(allowWrite && request.method === "POST")) {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { allow: allowWrite ? "GET, HEAD, POST, OPTIONS" : "GET, HEAD", ...SECURITY },
    });
  }

  let res;
  if (path === "/") res = html(pageHtml(await pageViews(request, env)));
  else if (path === "/robots.txt") res = text(robotsTxt(), "text/plain", { cache: "public, max-age=3600" });
  else if (path === "/llms.txt") res = text(llmsTxt(), "text/plain", { cache: "public, max-age=3600" });
  else if (path === "/ai.txt") res = text(aiTxt(), "text/plain", { cache: "public, max-age=3600" });
  else if (path === "/cite.json") {
    res = text(JSON.stringify(citeDoc(), null, 1) + "\n", "application/json", { cache: "public, max-age=3600" });
  } else if (path === "/sitemap.xml") {
    res = text(sitemapXml(), "application/xml", { cache: "public, max-age=3600" });
  } else if (path === "/v1/stats" || (path === "/v1/view" && request.method !== "POST")) {
    res = json(viewsBody(await readViews(env)));
  } else if (path === "/v1/view" && request.method === "POST") {
    res = json(viewsBody(await incrementViews(env)));
  } else {
    res = html(notFoundHtml(), 404);
  }

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
