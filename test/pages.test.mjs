import { describe, it } from "node:test";
import assert from "node:assert/strict";
import worker, { apexRedirect, handleRequest } from "../src/index.js";
import { pageHtml } from "../src/page.js";
import { memoryKv } from "../src/views.js";
import { aiTxt, citeDoc, jsonLd, llmsTxt, robotsTxt, sitemapXml } from "../src/seo.js";
import {
  AUTHOR,
  CANON_ORIGIN,
  CATALOG_GITHUB_FALLBACK,
  CATALOG_LATER_SLUGS,
  CATALOG_NAMES,
  CATALOG_ONLY,
  CATALOG_SLUGS,
  CATALOG_SOFTWARE,
  catalogHref,
  catalogSoftwareFromSlugs,
  DOORS,
  LIBRARY,
  LIBRARY_AZIEL,
  LIBRARY_SOFTWARE,
  PEACELOCK_GITHUB,
  PEACELOCK_WORKER,
  PROSE,
  RUNTIME_LOCAL,
  SOFTWARE,
  softwareBucket,
  sortSoftware,
} from "../src/copy.js";
import {
  destFromRuntimePath,
  handleRuntimeRoot,
  isRuntimeRequest,
  rewriteLocation,
  rewriteOriginUrls,
  rewriteRuntimeBody,
  RUNTIME_ORIGIN,
} from "../src/runtimeRoot.js";
import {
  isLocalUsesPath,
  shouldTrackRuntimeUse,
  USES_HOST,
  USES_VIA,
} from "../src/runtimeUses.js";

function envWithViews(seed = 0) {
  return { VIEWS: memoryKv(seed) };
}

async function fetchPath(path, init = {}, env) {
  const request = new Request("https://www.azieleliab.com" + path, init);
  return worker.fetch(request, env || {});
}

function runtimeEnv(handler) {
  return {
    AZIEL_RUNTIME: {
      fetch: handler,
    },
  };
}

describe("landing copy", () => {
  it("keeps the exact opening, why, research, and close", () => {
    const html = pageHtml();
    for (const line of [...PROSE.open, ...PROSE.why, PROSE.close, PROSE.sign, PROSE.softwareClose]) {
      assert.ok(html.includes(line), "missing copy: " + line);
    }
    for (const line of PROSE.research) {
      const needle = LIBRARY + "/";
      if (line.includes(needle)) {
        assert.ok(html.includes(line.split(needle)[0]), "missing research prefix: " + line);
        assert.ok(html.includes('href="' + needle + '"'), "missing research href");
      } else {
        assert.ok(html.includes(line), "missing copy: " + line);
      }
    }
    assert.ok(html.includes("Aziel Eliab"));
    assert.ok(html.includes("azieleliab.com"));
  });

  it("uses white / near-white body color and no royal-purple body text", () => {
    const html = pageHtml();
    assert.match(html, /--ink:#ffffff/);
    assert.match(html, /--bg:#0e0c09/);
    assert.match(html, /--bg-lift:#12100c/);
    assert.match(html, /--gold:#c9a227/);
    assert.doesNotMatch(html, /--royal|#6b3fa0|#4a2870/);
    assert.ok(html.includes("soft-card") || html.includes('class="card"') || html.includes('class="card lead"'));
  });

  it("includes the everblooming sigil", () => {
    assert.ok(pageHtml().includes("https://www.azielcorpuslibrary.net/sigil.png"));
  });
});

describe("software doors", () => {
  it("hyperlinks every SOFTWARE name to a verified URL", () => {
    const html = pageHtml();
    assert.equal(CATALOG_SOFTWARE.length, 28);
    assert.equal(SOFTWARE.length, 31);
    for (const item of SOFTWARE) {
      const needle = 'href="' + item.href + '"';
      assert.ok(html.includes(needle), "missing href for " + item.name);
      assert.ok(html.includes(">" + item.name + "<"), "missing visible name " + item.name);
    }
    assert.ok(html.includes("Run them without me."));
  });

  it("syncs CATALOG_SOFTWARE from documented catalog slugs including peacelock", () => {
    assert.ok(CATALOG_SLUGS.includes("peacelock"));
    assert.equal(CATALOG_NAMES.peacelock, "PeaceLock");
    assert.deepEqual(
      CATALOG_SOFTWARE.map((s) => s.slug).sort(),
      [...CATALOG_SLUGS].sort(),
    );
    assert.deepEqual(
      catalogSoftwareFromSlugs().map((s) => s.slug).sort(),
      [...CATALOG_SLUGS].sort(),
    );
    const names = SOFTWARE.map((s) => s.name);
    assert.ok(names.includes("PeaceLock"));
    assert.ok(names.includes("EmbryoLock"));
    assert.ok(names.includes("aziel-runtime"));
    assert.ok(names.includes("FragGate"));
    assert.ok(!names.includes("Lumen"));
    assert.ok(!names.includes("AZMail"));
    assert.deepEqual(CATALOG_LATER_SLUGS, ["azmail"]);
    assert.ok(!CATALOG_SLUGS.includes("azmail"));
  });

  it("lists PeaceLock in Lock and falls back to GitHub while the tracker is down", () => {
    const html = pageHtml();
    const peace = SOFTWARE.find((s) => s.name === "PeaceLock");
    assert.ok(peace);
    assert.equal(peace.slug, "peacelock");
    assert.equal(softwareBucket("PeaceLock"), 2);
    assert.equal(catalogHref("peacelock"), PEACELOCK_GITHUB);
    assert.equal(peace.href, PEACELOCK_GITHUB);
    assert.ok(CATALOG_GITHUB_FALLBACK.has("peacelock"));
    assert.equal(PEACELOCK_WORKER, "https://peacelock-download-tracker.vibelock.workers.dev/");
    assert.ok(html.includes('href="' + PEACELOCK_GITHUB + '"'));
    assert.ok(html.includes(">PeaceLock<"));
    assert.doesNotMatch(html, /peacelock-download-tracker/i);
    assert.ok(citeDoc().software_names.some((s) => s.name === "PeaceLock" && s.url === PEACELOCK_GITHUB));
  });

  it("adds AZMail only when a live catalog product is present", () => {
    const without = catalogSoftwareFromSlugs();
    assert.ok(!without.some((s) => s.slug === "azmail" || s.name === "AZMail"));
    const withLive = catalogSoftwareFromSlugs(CATALOG_SLUGS, [
      { slug: "azmail", name: "AZMail", worker_home: "https://azmail-download-tracker.vibelock.workers.dev/" },
    ]);
    const azmail = withLive.find((s) => s.slug === "azmail");
    assert.ok(azmail);
    assert.equal(azmail.name, "AZMail");
    assert.ok(!CATALOG_SOFTWARE.some((s) => s.slug === "azmail"));
    assert.ok(!SOFTWARE.some((s) => s.name === "AZMail"));
  });

  it("keeps EmbryoLock on the library hub and does not invent Lumen", () => {
    const html = pageHtml();
    assert.deepEqual(CATALOG_ONLY, ["EmbryoLock"]);
    const embryo = SOFTWARE.find((s) => s.name === "EmbryoLock");
    assert.equal(embryo.href, LIBRARY_SOFTWARE);
    assert.ok(html.includes(">EmbryoLock<"));
    assert.doesNotMatch(html, /embryolock-download-tracker/i);
    assert.doesNotMatch(html, />Lumen</);
    assert.ok(!citeDoc().software_names.some((s) => s.name === "Lumen"));
    assert.ok(citeDoc().software_names.some((s) => s.name === "EmbryoLock"));
    assert.ok(citeDoc().software_names.some((s) => s.name === "PeaceLock"));
  });

  it("prefers known GodLock / runtime / FragGate doors", () => {
    const byName = Object.fromEntries(SOFTWARE.map((s) => [s.name, s.href]));
    assert.equal(byName.GodLock, "https://godlock-download-tracker.vibelock.workers.dev/");
    assert.equal(byName["aziel-runtime"], RUNTIME_LOCAL);
    assert.equal(byName.FragGate, "https://github.com/AzielEliab/fraggate");
  });

  it("sortSoftware buckets Plain, then Gate, then Lock (gate before lock)", () => {
    const mixed = [
      { name: "VeilLock" },
      { name: "FragGate" },
      { name: "AZAI" },
      { name: "DecisionGATE" },
      { name: "EmbryoLock" },
      { name: "aziel-runtime" },
      { name: "CodeLock" },
      { name: "ForgeReceipts" },
      { name: "GateLock" },
      { name: "StaticClock" },
    ];
    assert.deepEqual(
      sortSoftware(mixed).map((s) => s.name),
      [
        "AZAI",
        "aziel-runtime",
        "ForgeReceipts",
        "StaticClock",
        "DecisionGATE",
        "FragGate",
        "GateLock",
        "CodeLock",
        "EmbryoLock",
        "VeilLock",
      ],
    );
    assert.equal(softwareBucket("StaticClock"), 0);
    assert.equal(softwareBucket("GateLock"), 1);
    assert.equal(softwareBucket("DecisionGATE"), 1);
    assert.equal(softwareBucket("FragGate"), 1);
    assert.equal(softwareBucket("CodeLock"), 2);
    assert.equal(softwareBucket("GodLock"), 2);
    assert.equal(softwareBucket("EmbryoLock"), 2);
    assert.equal(softwareBucket("PeaceLock"), 2);
    assert.equal(softwareBucket("TemporalLock"), 2);
    assert.equal(softwareBucket("M.I.A.Lock"), 2);
    assert.equal(softwareBucket("AZAI"), 0);
    const names = SOFTWARE.map((s) => s.name);
    assert.equal(softwareBucket("StaticClock"), 0);
    assert.ok(names.includes("StaticClock"));
    const lastPlain = names.findLastIndex((n) => softwareBucket(n) === 0);
    const firstGate = names.findIndex((n) => softwareBucket(n) === 1);
    const lastGate = names.findLastIndex((n) => softwareBucket(n) === 1);
    const firstLock = names.findIndex((n) => softwareBucket(n) === 2);
    assert.ok(lastPlain < firstGate && lastGate < firstLock);
    const plains = names.filter((n) => softwareBucket(n) === 0);
    const gates = names.filter((n) => softwareBucket(n) === 1);
    const locks = names.filter((n) => softwareBucket(n) === 2);
    const az = (a, b) => a.localeCompare(b, "en", { sensitivity: "base" });
    assert.deepEqual(plains, [...plains].sort(az));
    assert.deepEqual(gates, [...gates].sort(az));
    assert.deepEqual(locks, [...locks].sort(az));
    assert.deepEqual(names, [...plains, ...gates, ...locks]);
    assert.ok(names.includes("EmbryoLock"));
    assert.ok(names.includes("PeaceLock"));
    assert.ok(!names.includes("Lumen"));
    assert.ok(!names.includes("AZMail"));
    const html = pageHtml();
    const idx = (name) => html.indexOf(">" + name + "<");
    assert.ok(idx("AZAI") < idx("StaticClock"));
    assert.ok(idx("StaticClock") < idx("FragGate"));
    assert.ok(idx("AZAI") < idx("FragGate"));
    assert.ok(idx("FragGate") < idx("CodeLock"));
    assert.ok(idx("EmbryoLock") > idx("FragGate"));
    assert.ok(idx("PeaceLock") > idx("FragGate"));
    assert.ok(idx("M.I.A.Lock") < idx("PeaceLock"));
    assert.ok(idx("PeaceLock") < idx("ShadowLock"));
  });
});

describe("doors", () => {
  it("hyperlinks every door label and URL", () => {
    const html = pageHtml();
    for (const door of DOORS) {
      assert.ok(html.includes('href="' + door.href + '"'), door.label);
      assert.ok(html.includes(">" + door.label + "<"), door.label + " label");
      assert.ok(html.includes(">" + door.href + "<") || html.includes(door.href + "</a>"), door.label + " url text");
      if (door.also) {
        assert.ok(html.includes('href="' + door.also.href + '"'));
        assert.ok(html.includes(door.also.label));
      }
    }
  });

  it("lists Research as a first-class door to the corpus", () => {
    const research = DOORS.find((d) => d.label === "Research");
    assert.ok(research);
    assert.equal(research.href, LIBRARY + "/");
    assert.equal(research.also.href, LIBRARY_AZIEL);
    const html = pageHtml();
    assert.ok(html.includes(">Research<"));
    assert.ok(PROSE.research.some((line) => line.includes(LIBRARY)));
  });
});

describe("SEO routes", () => {
  it("serves robots.txt Allow / plus sitemap and /runtime", async () => {
    const res = await fetchPath("/robots.txt");
    assert.equal(res.status, 200);
    const body = await res.text();
    assert.ok(body.includes("User-agent: *"));
    assert.ok(body.includes("Allow: /"));
    assert.ok(body.includes("Allow: /runtime"));
    assert.ok(body.includes("Allow: /runtime/"));
    assert.ok(body.includes("Allow: /runtime/v1/uses"));
    assert.ok(body.includes("Sitemap: " + CANON_ORIGIN + "/sitemap.xml"));
    assert.ok(body.includes("User-agent: GPTBot"));
    assert.ok(body.includes("User-agent: NeevaBot"));
    assert.equal(robotsTxt(), body);
    assert.equal(res.headers.get("Content-Signal"), "search=yes, ai-input=yes, ai-train=yes");
  });

  it("serves llms.txt, ai.txt, cite.json, sitemap.xml", async () => {
    const llms = await fetchPath("/llms.txt");
    const ai = await fetchPath("/ai.txt");
    const cite = await fetchPath("/cite.json");
    const map = await fetchPath("/sitemap.xml");
    assert.equal(llms.status, 200);
    assert.equal(ai.status, 200);
    assert.equal(cite.status, 200);
    assert.equal(map.status, 200);
    const llmsBody = await llms.text();
    const aiBody = await ai.text();
    const citeBody = await cite.json();
    const mapBody = await map.text();
    assert.ok(llmsBody.includes("Author: " + AUTHOR));
    assert.ok(llmsBody.includes("Canonical: " + CANON_ORIGIN + "/"));
    assert.ok(llmsBody.includes("/runtime"));
    assert.ok(llmsBody.includes("/runtime/v1/uses"));
    assert.ok(llmsBody.includes("Research door"));
    assert.ok(llmsBody.includes(LIBRARY + "/"));
    assert.ok(llmsBody.includes("ChatGPT (GPT Actions / OpenAI)"));
    assert.ok(llmsBody.includes("Cohere"));
    assert.ok(llmsBody.includes("Cursor (MCP)"));
    assert.ok(llmsBody.includes("Glama"));
    assert.ok(llmsBody.includes("Perplexity"));
    assert.ok(llmsBody.includes("Microsoft Copilot / Bing"));
    assert.ok(llmsBody.includes("Google Gemini / Vertex AI"));
    assert.ok(llmsBody.includes("Mistral"));
    assert.ok(llmsBody.includes("Meta AI"));
    assert.ok(llmsBody.includes("Apple Intelligence"));
    assert.ok(llmsBody.includes("Amazon Q"));
    assert.ok(llmsBody.includes("DuckAssist"));
    assert.ok(llmsBody.includes("You.com"));
    assert.ok(llmsBody.includes("EmbryoLock"));
    assert.ok(llmsBody.includes("PeaceLock"));
    assert.ok(llmsBody.includes(PEACELOCK_GITHUB));
    assert.ok(!llmsBody.includes("Lumen"));
    assert.ok(!llmsBody.includes("AZMail"));
    assert.ok(aiBody.includes("Allow: /"));
    assert.ok(aiBody.includes("Allow: /runtime"));
    assert.ok(aiBody.includes("Allow: /runtime/v1/uses"));
    assert.ok(aiBody.includes("Content-Signal"));
    assert.ok(aiBody.includes("Research / corpus"));
    assert.ok(aiBody.includes(RUNTIME_LOCAL));
    assert.equal(citeBody.author, AUTHOR);
    assert.equal(citeBody.canonical, CANON_ORIGIN + "/");
    assert.equal(citeBody.identity, AUTHOR);
    assert.equal(citeBody.runtime_local, RUNTIME_LOCAL);
    assert.equal(citeBody.runtime_uses, RUNTIME_LOCAL + "/v1/uses");
    assert.equal(citeBody.research, LIBRARY + "/");
    assert.ok(!citeBody.software_names.some((s) => s.name === "Lumen"));
    assert.ok(!citeBody.software_names.some((s) => s.name === "AZMail"));
    assert.ok(citeBody.software_names.some((s) => s.name === "EmbryoLock"));
    assert.ok(citeBody.software_names.some((s) => s.name === "PeaceLock"));
    assert.ok(mapBody.includes("<loc>" + CANON_ORIGIN + "/</loc>"));
    assert.ok(mapBody.includes("<loc>" + RUNTIME_LOCAL + "</loc>"));
    assert.ok(mapBody.includes("<loc>" + CANON_ORIGIN + "/cite.json</loc>"));
    assert.ok(mapBody.includes("<loc>" + CANON_ORIGIN + "/llms.txt</loc>"));
    assert.equal(llmsTxt().trim(), llmsBody.trim());
    assert.equal(aiTxt().trim(), aiBody.trim());
    assert.deepEqual(citeBody, citeDoc());
    assert.ok(sitemapXml().includes(CANON_ORIGIN + "/"));
    assert.ok(sitemapXml().includes(RUNTIME_LOCAL));
  });

  it("embeds Person + WebSite + Runtime JSON-LD and a www canonical", () => {
    const html = pageHtml();
    assert.ok(html.includes('rel="canonical" href="' + CANON_ORIGIN + '/"'));
    assert.ok(html.includes('href="/runtime/openapi.json"'));
    const ld = jsonLd();
    assert.equal(ld["@graph"][0]["@type"], "Person");
    assert.equal(ld["@graph"][0].name, AUTHOR);
    assert.ok(ld["@graph"][0].sameAs.includes(LIBRARY + "/"));
    assert.equal(ld["@graph"][1]["@type"], "WebSite");
    assert.equal(ld["@graph"][1].url, CANON_ORIGIN + "/");
    assert.equal(ld["@graph"][2]["@type"], "SoftwareApplication");
    assert.equal(ld["@graph"][2].url, RUNTIME_LOCAL);
    assert.equal(ld["@graph"][3]["@type"], "WebAPI");
    assert.ok(html.includes('"@type":"Person"'));
    assert.ok(html.includes('"@type":"WebSite"'));
    assert.ok(html.includes('"@type":"SoftwareApplication"'));
    assert.ok(html.includes('"@type":"WebAPI"'));
  });
});

describe("runtime path mapping", () => {
  it("recognizes /runtime without a live fetch", () => {
    assert.equal(isRuntimeRequest("/runtime"), true);
    assert.equal(isRuntimeRequest("/runtime/"), true);
    assert.equal(isRuntimeRequest("/runtime/v1/skill"), true);
    assert.equal(isRuntimeRequest("/runtime/openapi.json"), true);
    assert.equal(isRuntimeRequest("/"), false);
    assert.equal(isRuntimeRequest("/v1/stats"), false);
    assert.equal(destFromRuntimePath("/runtime", ""), "/");
    assert.equal(destFromRuntimePath("/runtime/", ""), "/");
    assert.equal(destFromRuntimePath("/runtime/v1/health", ""), "/v1/health");
    assert.equal(destFromRuntimePath("/runtime/openapi.json", ""), "/openapi.json");
    assert.equal(destFromRuntimePath("/runtime/mcp", ""), "/mcp");
    assert.equal(destFromRuntimePath("/software", ""), null);
  });

  it("rewrites origin locs under www.azieleliab.com/runtime", () => {
    const src = "Host: https://aziel-runtime.vibelock.workers.dev/v1/runtime.json";
    assert.equal(rewriteOriginUrls(src), "Host: https://www.azieleliab.com/runtime/v1/runtime.json");
    assert.equal(
      rewriteLocation("https://aziel-runtime.vibelock.workers.dev/openapi.json"),
      "https://www.azieleliab.com/runtime/openapi.json",
    );
    assert.equal(rewriteLocation("/v1/skill"), "/runtime/v1/skill");
    const html = rewriteRuntimeBody(
      `<!doctype html><html><head><title>Aziel Eliab Runtime</title>
<link rel="canonical" href="${RUNTIME_ORIGIN}/">
</head><body><p>FragGate</p><a href="/v1/health">health</a></body></html>`,
      "text/html",
    );
    assert.match(html, /href="https:\/\/www\.azieleliab\.com\/runtime\/"/);
    assert.match(html, /href="\/runtime\/v1\/health"/);
    assert.doesNotMatch(html, /godlock-runtime-chrome|azieleliab-runtime-chrome/);
    assert.doesNotMatch(html, /<nav /i);
  });
});

describe("runtime use tracker", () => {
  it("tracks v1 mutations and named fraggate/mcp/session/pull; skips crawl/static/uses/health", () => {
    assert.equal(shouldTrackRuntimeUse("/runtime/v1/fraggate/call", "POST"), true);
    assert.equal(shouldTrackRuntimeUse("/runtime/v1/fraggate/list", "GET"), true);
    assert.equal(shouldTrackRuntimeUse("/runtime/mcp", "POST"), true);
    assert.equal(shouldTrackRuntimeUse("/runtime/mcp", "GET"), true);
    assert.equal(shouldTrackRuntimeUse("/runtime/v1/session/open", "POST"), true);
    assert.equal(shouldTrackRuntimeUse("/runtime/v1/session/abc/receipt", "GET"), true);
    assert.equal(shouldTrackRuntimeUse("/runtime/v1/pull/azclce", "GET"), true);
    assert.equal(shouldTrackRuntimeUse("/runtime/v1/skill", "POST"), true);
    assert.equal(shouldTrackRuntimeUse("/v1/fraggate/call", "POST"), true);

    assert.equal(shouldTrackRuntimeUse("/runtime/v1/skill", "GET"), false);
    assert.equal(shouldTrackRuntimeUse("/runtime/v1/runtime.json", "GET"), false);
    assert.equal(shouldTrackRuntimeUse("/runtime/v1/health", "GET"), false);
    assert.equal(shouldTrackRuntimeUse("/runtime/v1/ready", "GET"), false);
    assert.equal(shouldTrackRuntimeUse("/runtime/v1/uses", "GET"), false);
    assert.equal(shouldTrackRuntimeUse("/runtime/robots.txt", "GET"), false);
    assert.equal(shouldTrackRuntimeUse("/runtime/sitemap.xml", "GET"), false);
    assert.equal(shouldTrackRuntimeUse("/runtime/llms.txt", "GET"), false);
    assert.equal(shouldTrackRuntimeUse("/runtime/ai.txt", "GET"), false);
    assert.equal(shouldTrackRuntimeUse("/runtime/cite.json", "GET"), false);
    assert.equal(shouldTrackRuntimeUse("/runtime/openapi.json", "GET"), false);
    assert.equal(shouldTrackRuntimeUse("/runtime/sigil.png", "GET"), false);
    assert.equal(shouldTrackRuntimeUse("/runtime", "GET"), false);
    assert.equal(shouldTrackRuntimeUse("/runtime/v1/health", "HEAD"), false);
    assert.equal(shouldTrackRuntimeUse("/runtime/mcp", "OPTIONS"), false);
    assert.equal(isLocalUsesPath("/runtime/v1/uses"), true);
    assert.equal(isLocalUsesPath("/runtime/v1/uses/"), true);
    assert.equal(isLocalUsesPath("/runtime/v1/health"), false);
  });

  it("serves GET /runtime/v1/uses locally and records tracked proxy hops", async () => {
    const seen = [];
    const env = {
      ...envWithViews(0),
      AZIEL_RUNTIME: {
        fetch: async (req) => {
          const u = new URL(req.url);
          seen.push({
            path: u.pathname,
            via: req.headers.get("X-Aziel-Runtime-Via"),
            host: req.headers.get("X-Aziel-Runtime-Host"),
          });
          if (u.pathname === "/v1/uses") {
            return new Response(JSON.stringify({ ok: true, uses: 9, via: "origin" }), {
              status: 200,
              headers: { "Content-Type": "application/json; charset=utf-8" },
            });
          }
          if (u.pathname === "/v1/health") {
            return new Response(JSON.stringify({ ok: true }), {
              status: 200,
              headers: { "Content-Type": "application/json; charset=utf-8" },
            });
          }
          if (u.pathname === "/v1/fraggate/call") {
            return new Response(JSON.stringify({ ok: true, door: "fraggate" }), {
              status: 200,
              headers: { "Content-Type": "application/json; charset=utf-8" },
            });
          }
          if (u.pathname === "/robots.txt") {
            return new Response("User-agent: *\nAllow: /\n", {
              status: 200,
              headers: { "Content-Type": "text/plain; charset=utf-8" },
            });
          }
          return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
        },
      },
    };

    const empty = await fetchPath("/runtime/v1/uses", { headers: { "user-agent": "Mozilla/5.0" } }, env);
    assert.equal(empty.status, 200);
    const emptyDoc = await empty.json();
    assert.equal(emptyDoc.ok, true);
    assert.equal(emptyDoc.host, USES_HOST);
    assert.equal(emptyDoc.via, USES_VIA);
    assert.equal(emptyDoc.uses, 0);
    assert.deepEqual(emptyDoc.by_path, {});
    assert.deepEqual(emptyDoc.recent, []);
    assert.equal(emptyDoc.author, AUTHOR);
    assert.equal(emptyDoc.origin.uses, 9);

    const health = await fetchPath("/runtime/v1/health", { headers: { "user-agent": "Mozilla/5.0" } }, env);
    assert.equal(health.status, 200);
    const robots = await fetchPath("/runtime/robots.txt", {}, env);
    assert.equal(robots.status, 200);
    const call = await fetchPath(
      "/runtime/v1/fraggate/call",
      { method: "POST", headers: { "user-agent": "Mozilla/5.0", "content-type": "application/json" }, body: "{}" },
      env,
    );
    assert.equal(call.status, 200);

    const uses = await fetchPath("/runtime/v1/uses", {}, env);
    const doc = await uses.json();
    assert.equal(doc.uses, 1);
    assert.equal(doc.by_path["/v1/fraggate/call"], 1);
    assert.equal(doc.recent.length, 1);
    assert.equal(doc.recent[0].path, "/v1/fraggate/call");
    assert.equal(doc.recent[0].method, "POST");
    assert.equal(doc.recent[0].status, 200);
    assert.ok(doc.recent[0].at);
    assert.ok(!("body" in doc.recent[0]));
    assert.ok(!("token" in doc.recent[0]));

    const hop = seen.find((s) => s.path === "/v1/fraggate/call");
    assert.ok(hop);
    assert.equal(hop.via, "azieleliab.com");
    assert.equal(hop.host, "www.azieleliab.com");
    assert.ok(!seen.some((s) => s.path === "/v1/uses" && s.via == null));

    const head = await fetchPath("/runtime/v1/uses", { method: "HEAD" }, env);
    assert.equal(head.status, 200);
    assert.equal(await head.text(), "");
  });

  it("keeps local uses when origin /v1/uses is missing", async () => {
    const env = {
      ...envWithViews(0),
      AZIEL_RUNTIME: {
        fetch: async (req) => {
          const u = new URL(req.url);
          if (u.pathname === "/v1/uses") return new Response("no", { status: 404 });
          return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        },
      },
    };
    const res = await fetchPath("/runtime/v1/uses", {}, env);
    assert.equal(res.status, 200);
    const doc = await res.json();
    assert.equal(doc.ok, true);
    assert.equal(doc.uses, 0);
    assert.equal(doc.origin, undefined);
  });
});

describe("runtime proxy", () => {
  it("proxies through the service binding without injecting site chrome", async () => {
    const env = runtimeEnv(async (req) => {
      const u = new URL(req.url);
      if (u.pathname === "/" || u.pathname === "") {
        return new Response(
          `<!doctype html><html><head><title>Aziel Eliab Runtime</title>
<link rel="canonical" href="${RUNTIME_ORIGIN}/"></head>
<body><p>FragGate</p><a href="/v1/health">health</a></body></html>`,
          { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } },
        );
      }
      if (u.pathname === "/v1/health") {
        return new Response(JSON.stringify({ ok: true, skill: "/v1/skill" }), {
          status: 200,
          headers: { "Content-Type": "application/json; charset=utf-8" },
        });
      }
      if (u.pathname === "/openapi.json") {
        return new Response(JSON.stringify({ openapi: "3.1.0", servers: [{ url: RUNTIME_ORIGIN }] }), {
          status: 200,
          headers: { "Content-Type": "application/json; charset=utf-8" },
        });
      }
      return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
    });

    const door = await fetchPath("/runtime", {}, env);
    assert.equal(door.status, 200);
    const html = await door.text();
    assert.match(html, /FragGate/);
    assert.match(html, /href="\/runtime\/v1\/health"/);
    assert.doesNotMatch(html, /godlock-runtime-chrome|<nav /i);
    assert.equal(door.headers.get("X-Aziel-Runtime-Via"), "service-binding");
    assert.equal(door.headers.get("X-Aziel-Runtime-Root"), RUNTIME_LOCAL);
    assert.equal(door.headers.get("access-control-allow-origin"), "*");

    const health = await fetchPath("/runtime/v1/health", {}, env);
    const hj = await health.json();
    assert.equal(hj.ok, true);
    assert.equal(hj.skill, "/runtime/v1/skill");

    const spec = await fetchPath("/runtime/openapi.json", {}, env);
    const oj = await spec.json();
    assert.equal(oj.servers[0].url, RUNTIME_LOCAL);

    const opt = await fetchPath("/runtime/mcp", { method: "OPTIONS" }, env);
    assert.equal(opt.status, 204);

    const routed = await handleRuntimeRoot(
      new Request("https://www.azieleliab.com/runtime/v1/health"),
      new URL("https://www.azieleliab.com/runtime/v1/health"),
      env,
    );
    assert.equal(routed.status, 200);
  });
});

describe("worker routing", () => {
  it("serves the landing on GET /", async () => {
    const res = await fetchPath("/");
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type"), /text\/html/);
    assert.equal(res.headers.get("Content-Signal"), "search=yes, ai-input=yes, ai-train=yes");
    const body = await res.text();
    assert.ok(body.includes("<h1>Aziel Eliab</h1>"));
  });

  it("301s apex to www", async () => {
    const res = await handleRequest(new Request("https://azieleliab.com/llms.txt"));
    assert.equal(res.status, 301);
    assert.equal(res.headers.get("location"), CANON_ORIGIN + "/llms.txt");
    assert.equal(apexRedirect(new URL("https://azieleliab.com/")), CANON_ORIGIN + "/");
    const runtimeApex = await handleRequest(new Request("https://azieleliab.com/runtime"));
    assert.equal(runtimeApex.status, 301);
    assert.equal(runtimeApex.headers.get("location"), CANON_ORIGIN + "/runtime");
  });

  it("answers HEAD and rejects POST", async () => {
    const head = await fetchPath("/", { method: "HEAD" });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), "");
    const post = await fetchPath("/", { method: "POST" });
    assert.equal(post.status, 405);
  });

  it("returns a literary 404", async () => {
    const res = await fetchPath("/no-such-door");
    assert.equal(res.status, 404);
    const body = await res.text();
    assert.ok(body.includes("This path is not a door."));
  });
});

describe("pageviews", () => {
  it("increments on human HTML GET / and not on bots or stats", async () => {
    const env = envWithViews(4);
    const human = await fetchPath("/", { headers: { "user-agent": "Mozilla/5.0" } }, env);
    assert.equal(human.status, 200);
    const html = await human.text();
    assert.ok(html.includes('id="views"'));
    assert.ok(html.includes(">5<span>views</span>"));
    assert.ok(html.includes("You don’t get to know me."));

    const bot = await fetchPath("/", { headers: { "user-agent": "GPTBot/1.0" } }, env);
    const botHtml = await bot.text();
    assert.ok(botHtml.includes(">5<span>views</span>"));

    const stats = await fetchPath("/v1/stats", {}, env);
    assert.equal(stats.status, 200);
    assert.equal(stats.headers.get("access-control-allow-origin"), "*");
    assert.deepEqual(await stats.json(), {
      ok: true,
      views: 5,
      product: "azieleliab",
      author: "Aziel Eliab",
    });
  });

  it("POST /v1/view increments; GET /v1/view does not", async () => {
    const env = envWithViews(10);
    const read = await fetchPath("/v1/view", { headers: { "user-agent": "Mozilla/5.0" } }, env);
    assert.deepEqual(await read.json(), {
      ok: true,
      views: 10,
      product: "azieleliab",
      author: "Aziel Eliab",
    });
    const inc = await fetchPath("/v1/view", { method: "POST", headers: { "user-agent": "Mozilla/5.0" } }, env);
    assert.deepEqual(await inc.json(), {
      ok: true,
      views: 11,
      product: "azieleliab",
      author: "Aziel Eliab",
    });
    const opt = await fetchPath("/v1/view", { method: "OPTIONS" }, env);
    assert.equal(opt.status, 204);
    assert.equal(opt.headers.get("access-control-allow-origin"), "*");
  });
});
