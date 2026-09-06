/** azieleliab.com landing Worker. Author: Aziel Eliab. */
import { APEX_HOST, CANON_ORIGIN, WWW_HOST } from "./copy.js";
import { notFoundHtml, pageHtml } from "./page.js";
import { aiTxt, citeDoc, llmsTxt, robotsTxt, sitemapXml } from "./seo.js";

const SECURITY = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "DENY",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

function text(body, type, extra) {
  return new Response(body, {
    status: 200,
    headers: {
      "content-type": type + "; charset=utf-8",
      "cache-control": extra?.cache || "public, max-age=300",
      ...SECURITY,
    },
  });
}

function html(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=300",
      ...SECURITY,
    },
  });
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

export async function handleRequest(request) {
  const url = new URL(request.url);
  const toWww = apexRedirect(url);
  if (toWww) {
    return Response.redirect(toWww, 301);
  }

  const path = routePath(url.pathname);
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { allow: "GET, HEAD", ...SECURITY },
    });
  }

  let res;
  if (path === "/") res = html(pageHtml());
  else if (path === "/robots.txt") res = text(robotsTxt(), "text/plain", { cache: "public, max-age=3600" });
  else if (path === "/llms.txt") res = text(llmsTxt(), "text/plain", { cache: "public, max-age=3600" });
  else if (path === "/ai.txt") res = text(aiTxt(), "text/plain", { cache: "public, max-age=3600" });
  else if (path === "/cite.json") {
    res = text(JSON.stringify(citeDoc(), null, 1) + "\n", "application/json", { cache: "public, max-age=3600" });
  } else if (path === "/sitemap.xml") {
    res = text(sitemapXml(), "application/xml", { cache: "public, max-age=3600" });
  } else {
    res = html(notFoundHtml(), 404);
  }

  if (request.method === "HEAD") {
    return new Response(null, { status: res.status, headers: res.headers });
  }
  return res;
}

export default {
  async fetch(request) {
    return handleRequest(request);
  },
};

export { WWW_HOST };
