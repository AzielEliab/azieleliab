import { describe, it } from "node:test";
import assert from "node:assert/strict";
import worker, { apexRedirect, handleRequest } from "../src/index.js";
import { embryoLockHtml, pageHtml } from "../src/page.js";
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
  AZBROWSER_WORKER,
  AZHUB_GITHUB,
  AZHUB_WORKER,
  AZINTERFACE_GITHUB,
  AZINTERFACE_WORKER,
  AZMAIL_WORKER,
  AZNET_WORKER,
  EMBRYOLOCK_COPY,
  EMBRYOLOCK_HREF,
  EMBRYOLOCK_PATH,
  FRAGGATE_GITHUB,
  FRAGGATE_WORKER,
  PEACELOCK_WORKER,
  PROSE,
  RUNTIME_LOCAL,
  SOFTWARE,
  SOFTWARE_SECTION,
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

function isolatedEnv(extra) {
  return {
    AZIEL_RUNTIME: {
      fetch: async () =>
        new Response(JSON.stringify({ error: "not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }),
    },
    ...(extra || {}),
  };
}

function envWithViews(seed = 0) {
  return isolatedEnv({ VIEWS: memoryKv(seed) });
}

async function fetchPath(path, init = {}, env) {
  const request = new Request("https://www.azieleliab.com" + path, init);
  return worker.fetch(request, env ? isolatedEnv(env) : isolatedEnv());
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
    assert.equal(CATALOG_SOFTWARE.length, 29);
    assert.equal(SOFTWARE.length, 36);
    for (const item of SOFTWARE) {
      const needle = 'href="' + item.href + '"';
      assert.ok(html.includes(needle), "missing href for " + item.name);
      assert.ok(html.includes(">" + item.name + "<"), "missing visible name " + item.name);
    }
    assert.ok(html.includes("Run them without me."));
  });

  it("syncs CATALOG_SOFTWARE from documented catalog slugs including peacelock and azmail", () => {
    assert.ok(CATALOG_SLUGS.includes("peacelock"));
    assert.ok(CATALOG_SLUGS.includes("azmail"));
    assert.equal(CATALOG_NAMES.peacelock, "PeaceLock");
    assert.equal(CATALOG_NAMES.azmail, "AZMail");
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
    assert.ok(names.includes("AZMail"));
    assert.ok(names.includes("AZBrowser"));
    assert.ok(names.includes("AZHub"));
    assert.ok(names.includes("AZInterface"));
    assert.ok(names.includes("AZNet"));
    assert.ok(names.includes("EmbryoLock"));
    assert.ok(names.includes("aziel-runtime"));
    assert.ok(names.includes("FragGate"));
    assert.ok(!names.includes("Lumen"));
    assert.deepEqual(CATALOG_LATER_SLUGS, []);
  });

  it("lists PeaceLock in Lock and uses PEACELOCK_WORKER now that the tracker is live", () => {
    const html = pageHtml();
    const peace = SOFTWARE.find((s) => s.name === "PeaceLock");
    assert.ok(peace);
    assert.equal(peace.slug, "peacelock");
    assert.equal(softwareBucket("PeaceLock"), 2);
    assert.equal(catalogHref("peacelock"), PEACELOCK_WORKER);
    assert.equal(peace.href, PEACELOCK_WORKER);
    assert.ok(!CATALOG_GITHUB_FALLBACK.has("peacelock"));
    assert.equal(CATALOG_GITHUB_FALLBACK.size, 0);
    assert.equal(PEACELOCK_WORKER, "https://peacelock-download-tracker.vibelock.workers.dev/");
    assert.ok(html.includes('href="' + PEACELOCK_WORKER + '"'));
    assert.ok(html.includes(">PeaceLock<"));
    assert.match(html, /peacelock-download-tracker/i);
    assert.ok(citeDoc().software_names.some((s) => s.name === "PeaceLock" && s.url === PEACELOCK_WORKER));
  });

  it("lists AZMail in Plain and uses AZMAIL_WORKER now that it is in the catalog", () => {
    const html = pageHtml();
    const azmail = SOFTWARE.find((s) => s.name === "AZMail");
    assert.ok(azmail);
    assert.equal(azmail.slug, "azmail");
    assert.equal(softwareBucket("AZMail"), 0);
    assert.equal(catalogHref("azmail"), AZMAIL_WORKER);
    assert.equal(azmail.href, AZMAIL_WORKER);
    assert.ok(!CATALOG_GITHUB_FALLBACK.has("azmail"));
    assert.equal(AZMAIL_WORKER, "https://azmail-download-tracker.vibelock.workers.dev/");
    assert.ok(html.includes('href="' + AZMAIL_WORKER + '"'));
    assert.ok(html.includes(">AZMail<"));
    assert.match(html, /azmail-download-tracker/i);
    assert.ok(citeDoc().software_names.some((s) => s.name === "AZMail" && s.url === AZMAIL_WORKER));
    assert.ok(CATALOG_SOFTWARE.some((s) => s.slug === "azmail"));
  });

  it("keeps EmbryoLock as an on-site local-not-hosted stub and does not invent Lumen", () => {
    const html = pageHtml();
    assert.deepEqual(CATALOG_ONLY, ["EmbryoLock"]);
    const embryo = SOFTWARE.find((s) => s.name === "EmbryoLock");
    assert.equal(EMBRYOLOCK_PATH, "/embryolock");
    assert.equal(EMBRYOLOCK_HREF, CANON_ORIGIN + "/embryolock");
    assert.equal(embryo.href, EMBRYOLOCK_HREF);
    assert.notEqual(embryo.href, LIBRARY_SOFTWARE);
    assert.doesNotMatch(embryo.href, /azielcorpuslibrary\.net\/software/i);
    assert.doesNotMatch(embryo.href, /embryolock-download-tracker/i);
    assert.ok(html.includes('href="' + EMBRYOLOCK_HREF + '"'));
    assert.ok(html.includes(">EmbryoLock<"));
    assert.doesNotMatch(html, /href="https:\/\/www\.azielcorpuslibrary\.net\/software" class="soft-name"/);
    assert.doesNotMatch(html, /embryolock-download-tracker/i);
    assert.doesNotMatch(html, />Lumen</);
    assert.ok(!citeDoc().software_names.some((s) => s.name === "Lumen"));
    assert.ok(citeDoc().software_names.some((s) => s.name === "EmbryoLock" && s.url === EMBRYOLOCK_HREF));
    assert.ok(citeDoc().software_names.some((s) => s.name === "PeaceLock"));
    const stub = embryoLockHtml();
    assert.ok(stub.includes('rel="canonical" href="' + EMBRYOLOCK_HREF + '"'));
    assert.ok(stub.includes("https://www.azielcorpuslibrary.net/sigil.png"));
    for (const line of EMBRYOLOCK_COPY.open) {
      assert.ok(stub.includes(line), "missing stub copy: " + line);
    }
    assert.ok(stub.includes("Local-not-hosted"));
    assert.ok(stub.includes("Not a public Worker"));
    assert.doesNotMatch(stub, /embryolock-download-tracker/i);
  });

  it("lists AZBrowser in Plain as its own Worker UI, not nested with FragGate or AZNet", () => {
    const html = pageHtml();
    const azbrowser = SOFTWARE.find((s) => s.name === "AZBrowser");
    const aznet = SOFTWARE.find((s) => s.name === "AZNet");
    const fraggate = SOFTWARE.find((s) => s.name === "FragGate");
    assert.ok(azbrowser);
    assert.ok(aznet);
    assert.ok(fraggate);
    assert.equal(softwareBucket("AZBrowser"), 0);
    assert.equal(AZBROWSER_WORKER, "https://azbrowser-download-tracker.vibelock.workers.dev/");
    assert.equal(azbrowser.href, AZBROWSER_WORKER);
    assert.notEqual(azbrowser.href, fraggate.href);
    assert.notEqual(azbrowser.href, aznet.href);
    assert.ok(html.includes('href="' + AZBROWSER_WORKER + '"'));
    assert.ok(html.includes(">AZBrowser<"));
    assert.match(html, /azbrowser-download-tracker/i);
    assert.ok(citeDoc().software_names.some((s) => s.name === "AZBrowser" && s.url === AZBROWSER_WORKER));
  });

  it("lists AZNet in Plain as its own Worker UI, not nested under AZBrowser", () => {
    const html = pageHtml();
    const aznet = SOFTWARE.find((s) => s.name === "AZNet");
    const azbrowser = SOFTWARE.find((s) => s.name === "AZBrowser");
    const fraggate = SOFTWARE.find((s) => s.name === "FragGate");
    assert.ok(aznet);
    assert.ok(azbrowser);
    assert.ok(fraggate);
    assert.equal(softwareBucket("AZNet"), 0);
    assert.equal(AZNET_WORKER, "https://aznet-download-tracker.vibelock.workers.dev/");
    assert.equal(aznet.href, AZNET_WORKER);
    assert.notEqual(aznet.href, azbrowser.href);
    assert.notEqual(aznet.href, fraggate.href);
    assert.ok(html.includes('href="' + AZNET_WORKER + '"'));
    assert.ok(html.includes(">AZNet<"));
    assert.match(html, /aznet-download-tracker/i);
    assert.ok(citeDoc().software_names.some((s) => s.name === "AZNet" && s.url === AZNET_WORKER));
    assert.ok(!html.includes("Lumen"));
  });

  it("lists AZHub in Plain as its own Worker UI, not nested with AZInterface", () => {
    const html = pageHtml();
    const azhub = SOFTWARE.find((s) => s.name === "AZHub");
    const azinterface = SOFTWARE.find((s) => s.name === "AZInterface");
    const azbrowser = SOFTWARE.find((s) => s.name === "AZBrowser");
    const aznet = SOFTWARE.find((s) => s.name === "AZNet");
    const fraggate = SOFTWARE.find((s) => s.name === "FragGate");
    assert.ok(azhub);
    assert.ok(azinterface);
    assert.ok(azbrowser);
    assert.ok(aznet);
    assert.ok(fraggate);
    assert.equal(softwareBucket("AZHub"), 0);
    assert.equal(AZHUB_WORKER, "https://azhub-download-tracker.vibelock.workers.dev/");
    assert.equal(AZHUB_GITHUB, "https://github.com/AzielEliab/azhub");
    assert.equal(azhub.href, AZHUB_WORKER);
    assert.notEqual(azhub.href, azinterface.href);
    assert.notEqual(azhub.href, azbrowser.href);
    assert.notEqual(azhub.href, aznet.href);
    assert.notEqual(azhub.href, fraggate.href);
    assert.ok(html.includes('href="' + AZHUB_WORKER + '"'));
    assert.ok(html.includes(">AZHub<"));
    assert.match(html, /azhub-download-tracker/i);
    assert.ok(!html.includes('href="' + AZHUB_GITHUB + '" class="soft-name"'));
    assert.ok(citeDoc().software_names.some((s) => s.name === "AZHub" && s.url === AZHUB_WORKER));
  });

  it("lists AZInterface in Plain as its own Worker UI, not nested under AZHub", () => {
    const html = pageHtml();
    const azinterface = SOFTWARE.find((s) => s.name === "AZInterface");
    const azhub = SOFTWARE.find((s) => s.name === "AZHub");
    const azbrowser = SOFTWARE.find((s) => s.name === "AZBrowser");
    const aznet = SOFTWARE.find((s) => s.name === "AZNet");
    const fraggate = SOFTWARE.find((s) => s.name === "FragGate");
    assert.ok(azinterface);
    assert.ok(azhub);
    assert.ok(azbrowser);
    assert.ok(aznet);
    assert.ok(fraggate);
    assert.equal(softwareBucket("AZInterface"), 0);
    assert.equal(AZINTERFACE_WORKER, "https://azinterface-download-tracker.vibelock.workers.dev/");
    assert.equal(AZINTERFACE_GITHUB, "https://github.com/AzielEliab/azinterface");
    assert.equal(azinterface.href, AZINTERFACE_WORKER);
    assert.notEqual(azinterface.href, azhub.href);
    assert.notEqual(azinterface.href, azbrowser.href);
    assert.notEqual(azinterface.href, aznet.href);
    assert.notEqual(azinterface.href, fraggate.href);
    assert.ok(html.includes('href="' + AZINTERFACE_WORKER + '"'));
    assert.ok(html.includes(">AZInterface<"));
    assert.match(html, /azinterface-download-tracker/i);
    assert.ok(!html.includes('href="' + AZINTERFACE_GITHUB + '" class="soft-name"'));
    assert.ok(citeDoc().software_names.some((s) => s.name === "AZInterface" && s.url === AZINTERFACE_WORKER));
    assert.ok(!html.includes("Lumen"));
  });

  it("prefers known GodLock / runtime / FragGate Worker doors", () => {
    const html = pageHtml();
    const byName = Object.fromEntries(SOFTWARE.map((s) => [s.name, s.href]));
    const fraggate = SOFTWARE.find((s) => s.name === "FragGate");
    assert.equal(byName.GodLock, "https://godlock-download-tracker.vibelock.workers.dev/");
    assert.equal(byName["aziel-runtime"], RUNTIME_LOCAL);
    assert.equal(softwareBucket("FragGate"), 1);
    assert.equal(FRAGGATE_WORKER, "https://fraggate-download-tracker.vibelock.workers.dev/");
    assert.equal(FRAGGATE_GITHUB, "https://github.com/AzielEliab/fraggate");
    assert.equal(byName.FragGate, FRAGGATE_WORKER);
    assert.equal(fraggate.href, FRAGGATE_WORKER);
    assert.ok(html.includes('href="' + FRAGGATE_WORKER + '"'));
    assert.ok(html.includes(">FragGate<"));
    assert.match(html, /fraggate-download-tracker/i);
    assert.ok(!html.includes('href="' + FRAGGATE_GITHUB + '" class="soft-name"'));
    assert.ok(citeDoc().software_names.some((s) => s.name === "FragGate" && s.url === FRAGGATE_WORKER));
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
    assert.equal(softwareBucket("AZBrowser"), 0);
    assert.equal(softwareBucket("AZHub"), 0);
    assert.equal(softwareBucket("AZInterface"), 0);
    assert.equal(softwareBucket("AZMail"), 0);
    assert.equal(softwareBucket("AZNet"), 0);
    const names = SOFTWARE.map((s) => s.name);
    assert.equal(softwareBucket("StaticClock"), 0);
    assert.ok(names.includes("StaticClock"));
    assert.ok(names.includes("AZMail"));
    assert.ok(names.includes("AZBrowser"));
    assert.ok(names.includes("AZHub"));
    assert.ok(names.includes("AZInterface"));
    assert.ok(names.includes("AZNet"));
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
    assert.ok(names.includes("AZMail"));
    assert.ok(!names.includes("Lumen"));
    const html = pageHtml();
    const idx = (name) => html.indexOf(">" + name + "<");
    assert.ok(idx("AZAI") < idx("StaticClock"));
    assert.ok(idx("AZBot") < idx("AZBrowser"));
    assert.ok(idx("AZBrowser") < idx("AZHub"));
    assert.ok(idx("AZHub") < idx("Aziel Digital Library"));
    assert.ok(idx("AZBrowser") < idx("Aziel Digital Library"));
    assert.ok(idx("AzielTether") < idx("AZInterface"));
    assert.ok(idx("AZInterface") < idx("AZMail"));
    assert.ok(idx("AZHub") < idx("AZInterface"));
    assert.ok(idx("AZBot") < idx("AZMail"));
    assert.ok(idx("AZBrowser") < idx("AZMail"));
    assert.ok(idx("AzielTether") < idx("AZMail"));
    assert.ok(idx("AZMail") < idx("AZNet"));
    assert.ok(idx("AZNet") < idx("ForgeReceipts"));
    assert.ok(idx("AZMail") < idx("ForgeReceipts"));
    assert.ok(idx("AZMail") < idx("StaticClock"));
    assert.ok(idx("StaticClock") < idx("FragGate"));
    assert.ok(idx("AZAI") < idx("FragGate"));
    assert.ok(idx("AZMail") < idx("FragGate"));
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
    assert.ok(body.includes("Allow: /software"));
    assert.ok(body.includes("Allow: /software/"));
    assert.ok(body.includes("Allow: /embryolock"));
    assert.ok(body.includes("Allow: /embryolock/"));
    assert.ok(body.includes("Allow: /runtime"));
    assert.ok(body.includes("Allow: /runtime/"));
    assert.ok(body.includes("Allow: /runtime/v1/uses"));
    assert.ok(body.includes("Allow: /v1/software"));
    assert.ok(body.includes("Allow: /v1/update"));
    assert.ok(body.includes("Allow: /v1/update/check"));
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
    assert.ok(llmsBody.includes(CANON_ORIGIN + "/software  (301 to /#software)"));
    assert.ok(llmsBody.includes(EMBRYOLOCK_HREF + "  (EmbryoLock local-not-hosted stub)"));
    assert.ok(llmsBody.includes("local-not-hosted stub on this host"));
    assert.ok(llmsBody.includes("/runtime"));
    assert.ok(llmsBody.includes("/runtime/v1/uses"));
    assert.ok(llmsBody.includes("/v1/software"));
    assert.ok(llmsBody.includes("fallback"));
    assert.ok(llmsBody.includes("/v1/fraggate/list"));
    assert.ok(llmsBody.includes("/v1/update/check"));
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
    assert.ok(llmsBody.includes(EMBRYOLOCK_HREF));
    assert.ok(llmsBody.includes("PeaceLock"));
    assert.ok(llmsBody.includes(PEACELOCK_WORKER));
    assert.ok(llmsBody.includes("AZMail"));
    assert.ok(llmsBody.includes(AZMAIL_WORKER));
    assert.ok(llmsBody.includes("AZBrowser"));
    assert.ok(llmsBody.includes(AZBROWSER_WORKER));
    assert.ok(llmsBody.includes("AZHub"));
    assert.ok(llmsBody.includes(AZHUB_WORKER));
    assert.ok(llmsBody.includes("AZInterface"));
    assert.ok(llmsBody.includes(AZINTERFACE_WORKER));
    assert.ok(llmsBody.includes("AZNet"));
    assert.ok(llmsBody.includes(AZNET_WORKER));
    assert.ok(llmsBody.includes("FragGate"));
    assert.ok(llmsBody.includes(FRAGGATE_WORKER));
    assert.ok(!llmsBody.includes("Lumen"));
    assert.ok(aiBody.includes("Allow: /"));
    assert.ok(aiBody.includes("Allow: /software"));
    assert.ok(aiBody.includes("Allow: /software/"));
    assert.ok(aiBody.includes("Allow: /embryolock"));
    assert.ok(aiBody.includes("Allow: /embryolock/"));
    assert.ok(aiBody.includes("Allow: /v1/software"));
    assert.ok(aiBody.includes("Allow: /v1/update"));
    assert.ok(aiBody.includes("Allow: /v1/update/check"));
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
    assert.equal(citeBody.software_catalog, CANON_ORIGIN + "/v1/software");
    assert.equal(citeBody.update_check, CANON_ORIGIN + "/v1/update/check");
    assert.equal(citeBody.research, LIBRARY + "/");
    assert.ok(!citeBody.software_names.some((s) => s.name === "Lumen"));
    assert.ok(citeBody.software_names.some((s) => s.name === "AZMail" && s.url === AZMAIL_WORKER));
    assert.ok(citeBody.software_names.some((s) => s.name === "AZBrowser" && s.url === AZBROWSER_WORKER));
    assert.ok(citeBody.software_names.some((s) => s.name === "AZHub" && s.url === AZHUB_WORKER));
    assert.ok(citeBody.software_names.some((s) => s.name === "AZInterface" && s.url === AZINTERFACE_WORKER));
    assert.ok(citeBody.software_names.some((s) => s.name === "AZNet" && s.url === AZNET_WORKER));
    assert.ok(citeBody.software_names.some((s) => s.name === "FragGate" && s.url === FRAGGATE_WORKER));
    assert.ok(citeBody.software_names.some((s) => s.name === "EmbryoLock" && s.url === EMBRYOLOCK_HREF));
    assert.ok(mapBody.includes("<loc>" + EMBRYOLOCK_HREF + "</loc>"));
    assert.ok(citeBody.software_names.some((s) => s.name === "PeaceLock"));
    assert.ok(mapBody.includes("<loc>" + CANON_ORIGIN + "/</loc>"));
    assert.ok(mapBody.includes("<loc>" + RUNTIME_LOCAL + "</loc>"));
    assert.ok(mapBody.includes("<loc>" + CANON_ORIGIN + "/cite.json</loc>"));
    assert.ok(mapBody.includes("<loc>" + CANON_ORIGIN + "/llms.txt</loc>"));
    assert.ok(mapBody.includes("<loc>" + CANON_ORIGIN + "/v1/software</loc>"));
    assert.ok(mapBody.includes("<loc>" + CANON_ORIGIN + "/v1/update/check</loc>"));
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
    assert.equal(ld["@graph"][4]["@type"], "ItemList");
    assert.equal(ld["@graph"][4].name, "Software");
    assert.ok(ld["@graph"][4].itemListElement.some((item) => item.name === "EmbryoLock"));
    assert.ok(html.includes('"@type":"Person"'));
    assert.ok(html.includes('"@type":"WebSite"'));
    assert.ok(html.includes('"@type":"SoftwareApplication"'));
    assert.ok(html.includes('"@type":"WebAPI"'));
    assert.ok(html.includes('"@type":"ItemList"'));
    assert.ok(html.includes('href="/v1/update/check"'));
    assert.ok(html.includes('name="aziel-update-check"'));
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
    assert.equal(destFromRuntimePath("/embryolock", ""), null);
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

  it("301s /software and /software/ to the homepage Software strip", async () => {
    assert.equal(SOFTWARE_SECTION, CANON_ORIGIN + "/#software");
    const html = await fetchPath("/");
    assert.ok((await html.text()).includes('id="software"'));

    for (const path of ["/software", "/software/"]) {
      const res = await fetchPath(path);
      assert.equal(res.status, 301);
      assert.equal(res.headers.get("location"), SOFTWARE_SECTION);
    }

    const head = await fetchPath("/software", { method: "HEAD" });
    assert.equal(head.status, 301);
    assert.equal(head.headers.get("location"), SOFTWARE_SECTION);
    assert.equal(await head.text(), "");

    const post = await fetchPath("/software", { method: "POST" });
    assert.equal(post.status, 405);

    const apex = await handleRequest(new Request("https://azieleliab.com/software"));
    assert.equal(apex.status, 301);
    assert.equal(apex.headers.get("location"), CANON_ORIGIN + "/software");
  });

  it("serves GET /embryolock as a local-not-hosted stub, not the corpus catalog", async () => {
    for (const path of ["/embryolock", "/embryolock/"]) {
      const res = await fetchPath(path);
      assert.equal(res.status, 200);
      assert.match(res.headers.get("content-type"), /text\/html/);
      const body = await res.text();
      assert.ok(body.includes("<h1>EmbryoLock</h1>"));
      assert.ok(body.includes("Local-not-hosted"));
      assert.ok(body.includes("Not a public Worker"));
      assert.ok(body.includes("It is not the Digital Library catalog"));
      assert.doesNotMatch(body, /embryolock-download-tracker/i);
      assert.doesNotMatch(body, /href="https:\/\/www\.azielcorpuslibrary\.net\/software"/);
    }

    const head = await fetchPath("/embryolock", { method: "HEAD" });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), "");

    const post = await fetchPath("/embryolock", { method: "POST" });
    assert.equal(post.status, 405);

    const apex = await handleRequest(new Request("https://azieleliab.com/embryolock"));
    assert.equal(apex.status, 301);
    assert.equal(apex.headers.get("location"), CANON_ORIGIN + "/embryolock");
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

describe("live software catalog", () => {
  function catalogEnv(handler) {
    return {
      AZIEL_RUNTIME: { fetch: handler },
    };
  }

  it("prefers /v1/software at request time and keeps Plain→Gate→Lock plus EmbryoLock stub", async () => {
    const env = catalogEnv(async (req) => {
      const path = new URL(req.url).pathname;
      if (path === "/v1/software") {
        return new Response(
          JSON.stringify({
            ok: true,
            author: "Aziel Eliab",
            products: [
              { slug: "newlock", name: "NewLock", worker_home: "https://newlock-download-tracker.vibelock.workers.dev/" },
              { slug: "azai", name: "AZAI", worker_home: "https://azai-download-tracker.vibelock.workers.dev/" },
              { slug: "decisiongate", name: "DecisionGATE" },
              {
                slug: "embryolock",
                name: "EmbryoLock",
                status: "stub",
                local_not_hosted: true,
                worker_home: "https://embryolock-download-tracker.vibelock.workers.dev/",
              },
            ],
            extras: [{ slug: "fraggate", name: "FragGate", worker_home: FRAGGATE_WORKER }],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
    });

    const landing = await fetchPath("/", { headers: { "user-agent": "Mozilla/5.0" } }, env);
    const html = await landing.text();
    assert.ok(html.includes(">NewLock<"));
    assert.ok(html.includes('href="https://newlock-download-tracker.vibelock.workers.dev/"'));
    assert.ok(html.includes(">AZAI<"));
    assert.ok(html.includes(">DecisionGATE<"));
    assert.ok(html.includes(">FragGate<"));
    assert.ok(html.includes(">EmbryoLock<"));
    assert.ok(html.includes('href="' + EMBRYOLOCK_HREF + '"'));
    assert.doesNotMatch(html, /embryolock-download-tracker/i);
    const idx = (name) => html.indexOf(">" + name + "<");
    assert.ok(idx("AZAI") < idx("DecisionGATE"));
    assert.ok(idx("DecisionGATE") < idx("NewLock"));
    assert.ok(idx("FragGate") < idx("NewLock"));

    const index = await fetchPath("/v1/software", {}, env);
    assert.equal(index.status, 200);
    const doc = await index.json();
    assert.equal(doc.ok, true);
    assert.equal(doc.author, AUTHOR);
    assert.equal(doc.source, "live");
    assert.equal(doc.via, "/v1/software");
    assert.ok(doc.software.some((s) => s.name === "NewLock" && s.slug === "newlock"));
    assert.ok(doc.software.some((s) => s.name === "EmbryoLock" && s.url === EMBRYOLOCK_HREF));
    const names = doc.software.map((s) => s.name);
    const lastPlain = names.findLastIndex((n) => softwareBucket(n) === 0);
    const firstGate = names.findIndex((n) => softwareBucket(n) === 1);
    const lastGate = names.findLastIndex((n) => softwareBucket(n) === 1);
    const firstLock = names.findIndex((n) => softwareBucket(n) === 2);
    assert.ok(lastPlain < firstGate && lastGate < firstLock);
  });

  it("falls back to /v1/fraggate/list when /v1/software is missing", async () => {
    const env = catalogEnv(async (req) => {
      const path = new URL(req.url).pathname;
      if (path === "/v1/software") {
        return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
      }
      if (path === "/v1/fraggate/list") {
        return new Response(
          JSON.stringify({
            ok: true,
            entries: [
              { name: "AZBot", slug: "azbot", status: "live" },
              { name: "EmbryoLock", slug: "embryolock", status: "stub", local_not_hosted: true, digest: null, ops: [] },
            ],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
    });

    const index = await fetchPath("/v1/software", {}, env);
    const doc = await index.json();
    assert.equal(doc.source, "fraggate-list");
    assert.equal(doc.via, "/v1/fraggate/list");
    assert.ok(doc.software.some((s) => s.name === "AZBot"));
    assert.ok(doc.software.some((s) => s.name === "EmbryoLock" && s.url === EMBRYOLOCK_HREF));
    assert.ok(doc.software.some((s) => s.name === "aziel-runtime"));
    assert.ok(doc.software.some((s) => s.name === "FragGate"));

    const cite = await fetchPath("/cite.json", {}, env);
    const citeBody = await cite.json();
    assert.ok(citeBody.software_names.some((s) => s.name === "AZBot"));
    assert.ok(citeBody.software_names.some((s) => s.name === "EmbryoLock" && s.url === EMBRYOLOCK_HREF));
  });

  it("uses the static SOFTWARE fallback when live catalog calls fail", async () => {
    const index = await fetchPath("/v1/software");
    const doc = await index.json();
    assert.equal(doc.source, "fallback");
    assert.equal(doc.via, null);
    assert.ok(doc.software.some((s) => s.name === "PeaceLock"));
    assert.ok(doc.software.some((s) => s.name === "EmbryoLock" && s.url === EMBRYOLOCK_HREF));
    assert.equal(doc.software.length, SOFTWARE.length);
  });

  it("serves a quiet /v1/update/check pointer at the runtime authority", async () => {
    const env = catalogEnv(async (req) => {
      const path = new URL(req.url).pathname;
      if (path === "/v1/update/check") {
        return new Response(
          JSON.stringify({ ok: true, product: "aziel-runtime", version: "1.6.11" }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
    });

    const res = await fetchPath("/v1/update/check", {}, env);
    assert.equal(res.status, 200);
    const doc = await res.json();
    assert.equal(doc.ok, true);
    assert.equal(doc.author, AUTHOR);
    assert.equal(doc.update_check, "https://aziel-runtime.vibelock.workers.dev/v1/update/check");
    assert.equal(doc.update_check_local, CANON_ORIGIN + "/v1/update/check");
    assert.equal(doc.origin.version, "1.6.11");

    const alias = await fetchPath("/v1/update", {}, env);
    assert.deepEqual(await alias.json(), doc);

    const missing = await fetchPath("/v1/update/check");
    const pointer = await missing.json();
    assert.equal(pointer.ok, true);
    assert.equal(pointer.update_check, "https://aziel-runtime.vibelock.workers.dev/v1/update/check");
    assert.equal(pointer.origin, undefined);

    const opt = await fetchPath("/v1/update/check", { method: "OPTIONS" });
    assert.equal(opt.status, 204);
  });
});
