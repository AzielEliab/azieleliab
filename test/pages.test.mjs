import { describe, it } from "node:test";
import assert from "node:assert/strict";
import worker, { apexRedirect, donateCacheBustLocation, handleRequest } from "../src/index.js";
import { donateHtml, embryoLockHtml, pageHtml, spineNav } from "../src/page.js";
import { incrementViews, memoryKv } from "../src/views.js";
import { DONATE_HTML_CACHE, HTML_CACHE, SEO_CACHE, memoryCache } from "../src/edgeCache.js";
import { FANOUT_MAX, allowOriginRefresh, isOperator } from "../src/costGuard.js";
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
  DONATE_COPY,
  DONATE_DISCLAIMER,
  DONATE_HREF,
  DONATE_NETWORK_NOTE,
  DONATE_PATH,
  DONATE_RAILS,
  DONATE_SIGN,
  DONATE_TITLE,
  DONATE_XRP_TAG_NOTE,
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
  GITHUB_QNM_NODE,
  GITHUB_RUNTIME,
  PEACELOCK_WORKER,
  PROSE,
  RUNTIME_LOCAL,
  RUNTIME_NAME,
  RUNTIME_TITLE,
  SOFTWARE,
  SOFTWARE_SECTION,
  SPINE,
  displaySoftwareName,
  isRuntimeSoftware,
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
  injectMeshDiscovery,
  injectMeshOpenApi,
  MESH_NODES_PATH,
  MESH_NOTE,
  MESH_STATUS_PATH,
  meshEnabled,
  meshNodesBody,
  meshQuietLabel,
  meshSnapshot,
  meshStatusBody,
  QNS_CD,
  QNS_CD_SPEC,
} from "../src/mesh.js";
import {
  isLocalMeshPath,
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
    for (const line of [...PROSE.open, ...PROSE.why, PROSE.close, PROSE.sign]) {
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
    assert.doesNotMatch(html, /Run them without me/);
    assert.match(html, /<h2>Software<\/h2>\s*<p class="soft-line">/);
    assert.doesNotMatch(html, /soft-close/);
    assert.doesNotMatch(html, /runtime 1\.6\.\d+ FragGate/i);
  });

  it("names aziel-runtime / Aziel Runtime and refuses version+FragGate mash", () => {
    assert.equal(displaySoftwareName("aziel-runtime", "runtime 1.6.15 FragGate"), RUNTIME_NAME);
    assert.equal(displaySoftwareName("runtime", "Aziel Runtime"), RUNTIME_NAME);
    assert.equal(displaySoftwareName("aziel-runtime", "aziel-runtime"), RUNTIME_NAME);
    assert.equal(isRuntimeSoftware("aziel-runtime", "runtime 1.6.15 FragGate"), true);
    assert.equal(isRuntimeSoftware("fraggate", "FragGate"), false);
    assert.equal(displaySoftwareName("fraggate", "FragGate"), "FragGate");
    assert.equal(displaySoftwareName("azai", "AZAI"), "AZAI");
    const html = pageHtml();
    assert.ok(html.includes(">" + RUNTIME_NAME + "<"));
    assert.doesNotMatch(html, /runtime 1\.6\.\d+ FragGate/i);
    const ld = jsonLd();
    assert.equal(ld["@graph"][2].name, RUNTIME_TITLE);
    assert.equal(ld["@graph"][3].name, RUNTIME_TITLE);
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
    assert.ok(body.includes("Allow: /donate"));
    assert.ok(body.includes("Allow: /donate/"));
    assert.ok(body.includes("Allow: /donate/qr/"));
    assert.ok(body.includes("Allow: /runtime"));
    assert.ok(body.includes("Allow: /runtime/"));
    assert.ok(body.includes("Allow: /runtime/v1/uses"));
    assert.ok(body.includes("Allow: /v1/software"));
    assert.ok(body.includes("Allow: /v1/update"));
    assert.ok(body.includes("Allow: /v1/update/check"));
    assert.ok(body.includes("Allow: /v1/mesh/status"));
    assert.ok(body.includes("Allow: /v1/mesh/nodes"));
    assert.ok(body.includes("Allow: /runtime/v1/mesh/status"));
    assert.ok(body.includes("Allow: /runtime/v1/mesh/nodes"));
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
    assert.ok(llmsBody.includes(DONATE_HREF + "  (AZL-DONATE-1.0 primary Donate door)"));
    assert.ok(llmsBody.includes("## Donate"));
    assert.ok(llmsBody.includes(DONATE_DISCLAIMER));
    assert.ok(llmsBody.includes(EMBRYOLOCK_HREF + "  (EmbryoLock local-not-hosted stub)"));
    assert.ok(llmsBody.includes("## Software\n\n- "));
    assert.ok(!llmsBody.includes("## Software (verified"));
    assert.ok(!llmsBody.includes("FragGate / aziel-runtime"));
    assert.ok(!llmsBody.includes("Runtime (AI / FragGate"));
    assert.ok(llmsBody.includes("## Aziel Runtime"));
    assert.ok(llmsBody.includes("aziel-runtime: " + RUNTIME_LOCAL));
    assert.ok(llmsBody.includes("/runtime"));
    assert.ok(llmsBody.includes("/runtime/v1/uses"));
    assert.ok(llmsBody.includes("/v1/software"));
    assert.ok(llmsBody.includes("fallback"));
    assert.ok(llmsBody.includes("/v1/fraggate/list"));
    assert.ok(llmsBody.includes("/v1/update/check"));
    assert.ok(llmsBody.includes("/v1/mesh/status"));
    assert.ok(llmsBody.includes("/v1/mesh/nodes"));
    assert.ok(llmsBody.includes("default off"));
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
    assert.ok(aiBody.includes("Allow: /donate"));
    assert.ok(aiBody.includes("Allow: /donate/"));
    assert.ok(aiBody.includes("Donate: " + DONATE_HREF));
    assert.ok(aiBody.includes("Allow: /v1/software"));
    assert.ok(aiBody.includes("Allow: /v1/update"));
    assert.ok(aiBody.includes("Allow: /v1/update/check"));
    assert.ok(aiBody.includes("Allow: /v1/mesh/status"));
    assert.ok(aiBody.includes("Allow: /v1/mesh/nodes"));
    assert.ok(aiBody.includes("Allow: /runtime"));
    assert.ok(aiBody.includes("Allow: /runtime/v1/uses"));
    assert.ok(aiBody.includes("Allow: /runtime/v1/mesh/status"));
    assert.ok(aiBody.includes("Content-Signal"));
    assert.ok(aiBody.includes("Research / corpus"));
    assert.ok(aiBody.includes(RUNTIME_LOCAL));
    assert.ok(aiBody.includes("Aziel Runtime (aziel-runtime)"));
    assert.ok(!aiBody.includes("FragGate / aziel-runtime"));
    assert.equal(citeBody.author, AUTHOR);
    assert.equal(citeBody.canonical, CANON_ORIGIN + "/");
    assert.equal(citeBody.identity, AUTHOR);
    assert.equal(citeBody.runtime_local, RUNTIME_LOCAL);
    assert.equal(citeBody.runtime_uses, RUNTIME_LOCAL + "/v1/uses");
    assert.equal(citeBody.software_catalog, CANON_ORIGIN + "/v1/software");
    assert.equal(citeBody.update_check, CANON_ORIGIN + "/v1/update/check");
    assert.equal(citeBody.mesh_status, CANON_ORIGIN + "/v1/mesh/status");
    assert.equal(citeBody.mesh_nodes, CANON_ORIGIN + "/v1/mesh/nodes");
    assert.equal(citeBody.mesh_status_runtime, RUNTIME_LOCAL + "/v1/mesh/status");
    assert.equal(citeBody.mesh_default, "off");
    assert.equal(citeBody.qns_cd_spec, "QNS-CD-1.0");
    assert.equal(citeBody.qns_cd.spec, "QNS-CD-1.0");
    assert.equal(citeBody.qns_cd.software_tab, false);
    assert.equal(citeBody.qns_cd.public_proxy, false);
    assert.equal(citeBody.qns_cd.node_gate, false);
    assert.equal(citeBody.qns_cd.qnm_node, GITHUB_QNM_NODE);
    assert.equal(citeBody.qns_cd.runtime, GITHUB_RUNTIME);
    assert.match(citeBody.mesh_note, /QNS-CD-1\.0/);
    assert.ok(llmsBody.includes("QNS-CD-1.0"));
    assert.ok(aiBody.includes("QNS-CD-1.0"));
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
    assert.equal(citeBody.donate, DONATE_HREF);
    assert.ok(mapBody.includes("<loc>" + DONATE_HREF + "</loc>"));
    assert.ok(mapBody.includes("<loc>" + CANON_ORIGIN + "/</loc>"));
    assert.ok(mapBody.includes("<loc>" + RUNTIME_LOCAL + "</loc>"));
    assert.ok(mapBody.includes("<loc>" + CANON_ORIGIN + "/cite.json</loc>"));
    assert.ok(mapBody.includes("<loc>" + CANON_ORIGIN + "/llms.txt</loc>"));
    assert.ok(mapBody.includes("<loc>" + CANON_ORIGIN + "/v1/software</loc>"));
    assert.ok(mapBody.includes("<loc>" + CANON_ORIGIN + "/v1/update/check</loc>"));
    assert.ok(mapBody.includes("<loc>" + CANON_ORIGIN + "/v1/mesh/status</loc>"));
    assert.ok(mapBody.includes("<loc>" + CANON_ORIGIN + "/v1/mesh/nodes</loc>"));
    assert.ok(mapBody.includes("<loc>" + RUNTIME_LOCAL + "/v1/mesh/status</loc>"));
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
    assert.equal(ld["@graph"][2].name, RUNTIME_TITLE);
    assert.equal(ld["@graph"][2].url, RUNTIME_LOCAL);
    assert.ok(ld["@graph"][2].description.includes("aziel-runtime"));
    assert.ok(!ld["@graph"][2].description.includes("FragGate / aziel-runtime"));
    assert.ok(!/runtime 1\.6\.\d+ FragGate/i.test(ld["@graph"][2].description));
    assert.equal(ld["@graph"][3].name, RUNTIME_TITLE);
    assert.ok(!ld["@graph"][3].description.includes("FragGate door"));
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
    assert.ok(html.includes('href="/v1/mesh/status"'));
    assert.ok(html.includes('href="/v1/mesh/nodes"'));
    assert.ok(html.includes('name="aziel-mesh-status"'));
    assert.ok(html.includes('name="aziel-qns-cd"'));
    assert.ok(html.includes('content="QNS-CD-1.0"'));
    assert.ok(html.includes(">mesh off<"));
    assert.ok(ld["@graph"][2].description.includes("/v1/mesh/status"));
    assert.ok(ld["@graph"][2].description.includes("QNS-CD-1.0"));
    assert.ok(ld["@graph"][3].description.includes("/v1/mesh/status"));
    assert.ok(ld["@graph"][3].description.includes("QNS-CD-1.0"));
  });
});

describe("runtime path mapping", () => {
  it("recognizes /runtime without a live fetch", () => {
    assert.equal(isRuntimeRequest("/runtime"), true);
    assert.equal(isRuntimeRequest("/runtime/"), true);
    assert.equal(isRuntimeRequest("/runtime/v1/skill"), true);
    assert.equal(isRuntimeRequest("/runtime/v1/mesh/status"), true);
    assert.equal(isRuntimeRequest("/runtime/v1/mesh/nodes"), true);
    assert.equal(isRuntimeRequest("/runtime/openapi.json"), true);
    assert.equal(isRuntimeRequest("/"), false);
    assert.equal(isRuntimeRequest("/v1/stats"), false);
    assert.equal(destFromRuntimePath("/runtime", ""), "/");
    assert.equal(destFromRuntimePath("/runtime/", ""), "/");
    assert.equal(destFromRuntimePath("/runtime/v1/health", ""), "/v1/health");
    assert.equal(destFromRuntimePath("/runtime/v1/mesh/status", ""), "/v1/mesh/status");
    assert.equal(destFromRuntimePath("/runtime/openapi.json", ""), "/openapi.json");
    assert.equal(destFromRuntimePath("/runtime/mcp", ""), "/mcp");
    assert.equal(destFromRuntimePath("/software", ""), null);
    assert.equal(destFromRuntimePath("/embryolock", ""), null);
    assert.equal(destFromRuntimePath("/donate", ""), null);
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
    assert.equal(shouldTrackRuntimeUse("/runtime/v1/mesh/status", "GET"), false);
    assert.equal(shouldTrackRuntimeUse("/runtime/v1/mesh/nodes", "GET"), false);
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
    assert.equal(isLocalMeshPath("/runtime/v1/mesh/status"), true);
    assert.equal(isLocalMeshPath("/runtime/v1/mesh/nodes/"), true);
    assert.equal(isLocalMeshPath("/runtime/v1/health"), false);
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
    assert.ok(oj.paths["/runtime/v1/mesh/status"]);
    assert.ok(oj.paths["/runtime/v1/mesh/nodes"]);

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

describe("AZL-DONATE-1.0", () => {
  it("keeps the exact donate copy, five rails, and one-line law", () => {
    const html = donateHtml();
    for (const line of DONATE_COPY) {
      assert.ok(html.includes(line), "missing donate copy: " + line);
    }
    assert.ok(html.includes(DONATE_SIGN));
    assert.ok(html.includes(DONATE_DISCLAIMER));
    assert.equal(DONATE_RAILS.length, 5);
    assert.deepEqual(
      DONATE_RAILS.map((r) => r.id),
      ["btc", "eth", "ltc", "xrp", "doge"],
    );
    let cursor = html.indexOf(DONATE_COPY[0]);
    assert.ok(cursor >= 0);
    for (const rail of DONATE_RAILS) {
      const addrAt = html.indexOf(rail.address);
      const uriAt = html.indexOf('href="' + rail.uri + '"');
      const copyAt = html.indexOf('data-copy="' + rail.address + '"');
      const openAt = html.indexOf("Open in wallet", addrAt);
      assert.ok(addrAt > cursor, rail.id + " address after copy");
      assert.ok(uriAt >= 0, rail.id + " payment URI");
      assert.ok(copyAt >= 0, rail.id + " Copy");
      assert.ok(openAt > addrAt, rail.id + " Open in wallet");
      assert.ok(html.includes(rail.coin), rail.coin);
      assert.ok(html.includes(rail.network), rail.network);
      cursor = addrAt;
    }
    const lawAt = html.lastIndexOf(DONATE_DISCLAIMER);
    assert.ok(lawAt > cursor, "disclaimer last");
    assert.ok(html.includes(DONATE_NETWORK_NOTE));
    assert.ok(html.includes(DONATE_XRP_TAG_NOTE));
    assert.match(html, /<button type="button" data-copy="/);
    assert.ok(html.includes('rel="canonical" href="' + DONATE_HREF + '"'));
    assert.ok(html.includes("<!-- azl-donate png -->"));
    assert.ok(html.includes("<title>Donate — " + AUTHOR + "</title>"));
    assert.ok(html.includes('name="author" content="' + AUTHOR + '"'));
    assert.doesNotMatch(html, /<input|<form|mailto:|thank-you|leaderboard|confetti|Buy Me A Coffee|Support Us|Patron|solana|6BZNXx|TJXb1Y/i);
    assert.doesNotMatch(html, /VIEWS|software:catalog/);
  });

  it("serves GET /donate as the primary canonical door", async () => {
    const bust = "https://www.azieleliab.com/donate?v=png";
    for (const path of ["/donate", "/donate/"]) {
      const bounce = await fetchPath(path);
      assert.equal(bounce.status, 302);
      assert.equal(bounce.headers.get("location"), bust);
    }

    const res = await fetchPath("/donate?v=png");
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type"), /text\/html/);
    assert.equal(res.headers.get("cache-control"), DONATE_HTML_CACHE);
    const body = await res.text();
    assert.ok(body.includes("<!-- azl-donate png -->"));
    assert.ok(body.includes("<h1>Donate</h1>"));
    assert.ok(body.includes("Nothing is free."));
    assert.ok(body.includes("— Aziel"));
    assert.ok(body.includes("Donations buy no privilege."));
    assert.ok(body.includes("bc1q8cg7hmgmu7x9yaja8j249np0vt84d4y8duugr7"));
    assert.ok(body.includes('href="bitcoin:bc1q8cg7hmgmu7x9yaja8j249np0vt84d4y8duugr7"'));
    assert.ok(body.includes('src="/donate/qr/btc.png"'));

    const slash = await fetchPath("/donate/?v=png");
    assert.equal(slash.status, 200);
    assert.ok((await slash.text()).includes("<h1>Donate</h1>"));

    const headBare = await fetchPath("/donate", { method: "HEAD" });
    assert.equal(headBare.status, 302);
    assert.equal(headBare.headers.get("location"), bust);

    const head = await fetchPath("/donate?v=png", { method: "HEAD" });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), "");

    const post = await fetchPath("/donate", { method: "POST" });
    assert.equal(post.status, 405);

    const apex = await handleRequest(new Request("https://azieleliab.com/donate"));
    assert.equal(apex.status, 301);
    assert.equal(apex.headers.get("location"), CANON_ORIGIN + DONATE_PATH);
    assert.equal(
      donateCacheBustLocation(new URL("https://azieleliab-com.vibelock.workers.dev/donate")),
      "https://azieleliab-com.vibelock.workers.dev/donate?v=png",
    );
  });

  it("puts Donate on the homepage spine and Doors list", () => {
    const html = pageHtml();
    assert.ok(html.includes('id="donate"'));
    assert.ok(html.includes('id="why"'));
    assert.ok(html.includes('id="software"'));
    assert.ok(html.includes('id="research"'));
    assert.ok(html.includes('id="doors"'));
    assert.ok(html.includes('aria-label="Spine"'));
    assert.ok(html.includes('href="#donate"'));
    assert.ok(html.includes(">" + DONATE_TITLE + "<"));
    assert.ok(html.includes("Nothing is free."));
    assert.ok(html.includes(DONATE_SIGN));
    assert.ok(html.includes(DONATE_DISCLAIMER));
    const donateDoor = DOORS.find((d) => d.label === "Donate");
    assert.ok(donateDoor);
    assert.equal(donateDoor.href, DONATE_HREF);
    assert.equal(DONATE_PATH, "/donate");
    assert.equal(DONATE_HREF, CANON_ORIGIN + DONATE_PATH + "?v=png");
    assert.deepEqual(
      SPINE.map((s) => s.label),
      ["Why", "Software", "Research", "Doors", "Donate"],
    );
    const nav = spineNav("donate");
    assert.ok(nav.includes('aria-current="page"'));
    assert.ok(nav.includes('href="' + DONATE_HREF + '"'));
    for (const rail of DONATE_RAILS) {
      assert.ok(html.includes(rail.address), "homepage rail " + rail.id);
      assert.ok(html.includes('href="' + rail.uri + '"'), "homepage URI " + rail.id);
    }
  });

  it("encodes each payment URI as a PNG QR, not a website URL", () => {
    const html = donateHtml();
    const home = pageHtml();
    for (const rail of DONATE_RAILS) {
      const img =
        '<img src="' +
        rail.qrSrc +
        '" width="180" height="180" alt="' +
        rail.qrAlt +
        '">';
      assert.ok(html.includes(img), rail.id);
      assert.ok(home.includes(img), "homepage " + rail.id);
      assert.ok(!img.includes("https://"), "QR src is a same-origin PNG, not a website URL");
    }
    assert.doesNotMatch(html, /<svg|qrline|path class="qrline"/);
    assert.doesNotMatch(home, /<svg|qrline|path class="qrline"/);
  });

  it("serves each donate QR as a solid PNG", async () => {
    for (const rail of DONATE_RAILS) {
      const res = await fetchPath(rail.qrSrc);
      assert.equal(res.status, 200, rail.id);
      assert.match(res.headers.get("content-type"), /image\/png/);
      const buf = new Uint8Array(await res.arrayBuffer());
      assert.equal(buf[0], 0x89);
      assert.equal(String.fromCharCode(buf[1], buf[2], buf[3]), "PNG");
      const head = await fetchPath(rail.qrSrc, { method: "HEAD" });
      assert.equal(head.status, 200);
      assert.equal(await head.text(), "");
    }
    const apex = await handleRequest(new Request("https://azieleliab.com/donate/qr/btc.png"));
    assert.equal(apex.status, 301);
    assert.equal(apex.headers.get("location"), CANON_ORIGIN + "/donate/qr/btc.png");
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

  it("normalizes mashed live runtime names to aziel-runtime and keeps Plain→Gate→Lock", async () => {
    const env = catalogEnv(async (req) => {
      const path = new URL(req.url).pathname;
      if (path === "/v1/software") {
        return new Response(
          JSON.stringify({
            ok: true,
            version: "1.6.15",
            products: [
              { slug: "azai", name: "AZAI", worker_home: "https://azai-download-tracker.vibelock.workers.dev/" },
              {
                slug: "aziel-runtime",
                name: "runtime 1.6.15 FragGate",
                one_line: "runtime 1.6.15 FragGate door",
                worker_home: "https://aziel-runtime.vibelock.workers.dev/",
              },
              { slug: "decisiongate", name: "DecisionGATE" },
              { slug: "codelock", name: "CodeLock" },
            ],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
    });

    const landing = await fetchPath("/", { headers: { "user-agent": "Mozilla/5.0" } }, env);
    const html = await landing.text();
    assert.ok(html.includes(">" + RUNTIME_NAME + "<"));
    assert.doesNotMatch(html, /runtime 1\.6\.15 FragGate/);
    assert.doesNotMatch(html, /Run them without me/);
    assert.match(html, /<h2>Software<\/h2>\s*<p class="soft-line">/);
    const idx = (name) => html.indexOf(">" + name + "<");
    assert.ok(idx("AZAI") < idx("DecisionGATE"));
    assert.ok(idx("DecisionGATE") < idx("CodeLock"));
    assert.ok(idx(RUNTIME_NAME) < idx("DecisionGATE"));

    const index = await fetchPath("/v1/software", {}, env);
    const doc = await index.json();
    const runtime = doc.software.find((s) => s.slug === "aziel-runtime" || s.name === RUNTIME_NAME);
    assert.ok(runtime);
    assert.equal(runtime.name, RUNTIME_NAME);
    assert.ok(!doc.software.some((s) => /runtime 1\.6\.15 FragGate/i.test(s.name)));
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
    assert.equal(doc.mesh.enabled, false);
    assert.equal(doc.mesh.default, "off");
    assert.equal(doc.mesh.mesh, "off");
    assert.equal(doc.mesh.status, CANON_ORIGIN + "/v1/mesh/status");
    assert.equal(doc.mesh.nodes, CANON_ORIGIN + "/v1/mesh/nodes");
    assert.equal(doc.mesh.qns_cd_spec, "QNS-CD-1.0");
    assert.equal(doc.mesh.qns_cd.public_proxy, false);
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

describe("suite node mesh", () => {
  it("defaults off and never claims a hop mesh", () => {
    assert.equal(MESH_STATUS_PATH, "/v1/mesh/status");
    assert.equal(MESH_NODES_PATH, "/v1/mesh/nodes");
    assert.equal(meshEnabled(null), false);
    assert.equal(meshEnabled({ error: "not found" }), false);
    assert.equal(meshEnabled({ enabled: false, mesh: "off" }), false);
    assert.equal(meshEnabled({ enabled: true, mesh: "on" }), true);
    assert.equal(meshQuietLabel(null), "mesh off");
    assert.equal(meshQuietLabel({ origin: { enabled: true } }), "mesh on");
    const off = meshStatusBody(null);
    assert.equal(off.ok, true);
    assert.equal(off.author, AUTHOR);
    assert.equal(off.identity, AUTHOR);
    assert.equal(off.enabled, false);
    assert.equal(off.mesh, "off");
    assert.equal(off.default, "off");
    assert.match(off.note, /Default off/);
    assert.match(off.note, /VPN\/hop mesh is not claimed/);
    assert.match(off.note, /QNS-CD-1\.0/);
    assert.match(MESH_NOTE, /QNS-CD-1\.0/);
    assert.equal(QNS_CD_SPEC, "QNS-CD-1.0");
    assert.equal(QNS_CD.spec, "QNS-CD-1.0");
    assert.equal(QNS_CD.title, "photon QNS1 packet transfer");
    assert.equal(QNS_CD.packet, "QNS1");
    assert.equal(QNS_CD.software_tab, false);
    assert.equal(QNS_CD.node_gate, false);
    assert.equal(QNS_CD.public_proxy, false);
    assert.equal(QNS_CD.qnsd, "local");
    assert.equal(QNS_CD.mesh_default, "off");
    assert.equal(QNS_CD.qnm_node, GITHUB_QNM_NODE);
    assert.equal(QNS_CD.runtime, GITHUB_RUNTIME);
    assert.equal(QNS_CD.pair_custody, AZINTERFACE_GITHUB);
    assert.equal(off.qns_cd_spec, "QNS-CD-1.0");
    assert.equal(off.qns_cd.spec, "QNS-CD-1.0");
    assert.equal(off.origin, undefined);
    const nodes = meshNodesBody(null);
    assert.deepEqual(nodes.nodes, []);
    assert.equal(nodes.qns_cd_spec, "QNS-CD-1.0");
    const snap = meshSnapshot(null);
    assert.equal(snap.enabled, false);
    assert.equal(snap.status, CANON_ORIGIN + "/v1/mesh/status");
    assert.equal(snap.runtime, RUNTIME_LOCAL + "/v1/mesh/status");
    assert.equal(snap.origin, "https://aziel-runtime.vibelock.workers.dev/v1/mesh/status");
    assert.equal(snap.qns_cd_spec, "QNS-CD-1.0");
    assert.equal(snap.qns_cd.public_proxy, false);
  });

  it("serves default-off /v1/mesh/status and /v1/mesh/nodes when runtime 404s", async () => {
    const status = await fetchPath("/v1/mesh/status");
    assert.equal(status.status, 200);
    const doc = await status.json();
    assert.equal(doc.ok, true);
    assert.equal(doc.author, AUTHOR);
    assert.equal(doc.identity, AUTHOR);
    assert.equal(doc.enabled, false);
    assert.equal(doc.mesh, "off");
    assert.equal(doc.default, "off");
    assert.equal(doc.mesh_status, "https://aziel-runtime.vibelock.workers.dev/v1/mesh/status");
    assert.equal(doc.mesh_status_local, CANON_ORIGIN + "/v1/mesh/status");
    assert.equal(doc.mesh_status_runtime, RUNTIME_LOCAL + "/v1/mesh/status");
    assert.equal(doc.qns_cd_spec, "QNS-CD-1.0");
    assert.equal(doc.qns_cd.spec, "QNS-CD-1.0");
    assert.equal(doc.qns_cd.software_tab, false);
    assert.match(doc.note, /QNS-CD-1\.0/);
    assert.equal(doc.origin, undefined);

    const nodes = await fetchPath("/v1/mesh/nodes");
    const nodeDoc = await nodes.json();
    assert.equal(nodeDoc.enabled, false);
    assert.deepEqual(nodeDoc.nodes, []);
    assert.equal(nodeDoc.identity, AUTHOR);
    assert.equal(nodeDoc.qns_cd_spec, "QNS-CD-1.0");

    const opt = await fetchPath("/v1/mesh/status", { method: "OPTIONS" });
    assert.equal(opt.status, 204);
    const head = await fetchPath("/v1/mesh/nodes", { method: "HEAD" });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), "");
  });

  it("attaches origin mesh when the runtime binding answers", async () => {
    const env = {
      AZIEL_RUNTIME: {
        fetch: async (req) => {
          const path = new URL(req.url).pathname;
          if (path === "/v1/mesh/status") {
            return new Response(JSON.stringify({ ok: true, enabled: true, mesh: "on", node_count: 2 }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }
          if (path === "/v1/mesh/nodes") {
            return new Response(
              JSON.stringify({
                ok: true,
                enabled: true,
                nodes: [{ id: "a" }, { id: "b" }],
              }),
              { status: 200, headers: { "Content-Type": "application/json" } },
            );
          }
          return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
        },
      },
    };

    const status = await fetchPath("/v1/mesh/status", {}, env);
    const doc = await status.json();
    assert.equal(doc.enabled, true);
    assert.equal(doc.mesh, "on");
    assert.equal(doc.origin.node_count, 2);

    const nodes = await fetchPath("/v1/mesh/nodes", {}, env);
    const nodeDoc = await nodes.json();
    assert.equal(nodeDoc.enabled, true);
    assert.equal(nodeDoc.nodes.length, 2);

    const software = await fetchPath("/v1/software", {}, env);
    const index = await software.json();
    assert.equal(index.mesh.enabled, true);
    assert.equal(index.mesh.mesh, "on");
    assert.equal(index.mesh.qns_cd_spec, "QNS-CD-1.0");
    assert.equal(index.mesh.default, "off");

    const landing = await fetchPath("/", { headers: { "user-agent": "Mozilla/5.0" } }, env);
    const html = await landing.text();
    assert.ok(html.includes(">mesh on<"));
    assert.ok(html.includes('name="aziel-mesh-status"'));

    const runtimeStatus = await fetchPath("/runtime/v1/mesh/status", {}, env);
    assert.equal(runtimeStatus.status, 200);
    const runtimeDoc = await runtimeStatus.json();
    assert.equal(runtimeDoc.enabled, true);
    assert.equal(runtimeDoc.author, AUTHOR);
  });

  it("injects mesh paths into proxied OpenAPI, cite, and llms", () => {
    const spec = injectMeshOpenApi({ openapi: "3.1.0", paths: { "/v1/health": {} } });
    assert.ok(spec.paths["/runtime/v1/mesh/status"].get);
    assert.ok(spec.paths["/runtime/v1/mesh/nodes"].get);
    assert.ok(spec.paths["/v1/health"]);

    const already = injectMeshOpenApi({
      openapi: "3.1.0",
      paths: { "/v1/mesh/status": { get: { summary: "origin" } } },
    });
    assert.equal(already.paths["/v1/mesh/status"].get.summary, "origin");
    assert.equal(already.paths["/runtime/v1/mesh/status"], undefined);

    const cited = JSON.parse(injectMeshDiscovery(JSON.stringify({ author: AUTHOR }), "application/json", "/cite.json"));
    assert.equal(cited.mesh_status, RUNTIME_LOCAL + "/v1/mesh/status");
    assert.equal(cited.mesh_default, "off");
    assert.equal(cited.qns_cd_spec, "QNS-CD-1.0");
    assert.equal(cited.qns_cd.qnm_node, GITHUB_QNM_NODE);

    const alreadyCited = JSON.parse(
      injectMeshDiscovery(JSON.stringify({ author: AUTHOR, mesh_status: "/v1/mesh/status", mesh_nodes: "/v1/mesh/nodes" }), "application/json", "/cite.json"),
    );
    assert.equal(alreadyCited.qns_cd_spec, "QNS-CD-1.0");

    const llms = injectMeshDiscovery("# Aziel Eliab Runtime\n", "text/plain", "/llms.txt");
    assert.match(llms, /\/v1\/mesh\/status/);
    assert.match(llms, /default off/);
    assert.match(llms, /QNS-CD-1\.0/);

    const robots = injectMeshDiscovery("User-agent: *\nAllow: /\n", "text/plain", "/robots.txt");
    assert.doesNotMatch(robots, /mesh/);

    const health = injectMeshDiscovery(JSON.stringify({ ok: true, author: AUTHOR }), "application/json", "/v1/health");
    assert.equal(JSON.parse(health).mesh_status, undefined);
  });
});

describe("edge cache and cost", () => {
  it("sends public Cache-Control on HTML and long cache on SEO, not no-store", async () => {
    const home = await fetchPath("/");
    assert.equal(home.status, 200);
    assert.equal(home.headers.get("cache-control"), HTML_CACHE);
    assert.doesNotMatch(home.headers.get("cache-control"), /no-store/i);
    assert.ok((await home.text()).includes(">AZAI<"));

    const donateBare = await fetchPath("/donate");
    assert.equal(donateBare.status, 302);
    assert.equal(donateBare.headers.get("location"), "https://www.azieleliab.com/donate?v=png");

    const donate = await fetchPath("/donate?v=png");
    assert.equal(donate.status, 200);
    assert.equal(donate.headers.get("cache-control"), DONATE_HTML_CACHE);
    assert.match(donate.headers.get("cache-control"), /no-store/i);
    assert.ok((await donate.text()).includes("Nothing is free."));

    const robots = await fetchPath("/robots.txt");
    const llms = await fetchPath("/llms.txt");
    const sitemap = await fetchPath("/sitemap.xml");
    assert.equal(robots.headers.get("cache-control"), SEO_CACHE);
    assert.equal(llms.headers.get("cache-control"), SEO_CACHE);
    assert.equal(sitemap.headers.get("cache-control"), SEO_CACHE);
    const robotsBody = await robots.text();
    const llmsBody = await llms.text();
    const mapBody = await sitemap.text();
    assert.ok(robotsBody.includes("User-agent: *"));
    assert.ok(robotsBody.includes("Allow: /"));
    assert.ok(robotsBody.includes("User-agent: GPTBot"));
    assert.ok(llmsBody.includes("Author: " + AUTHOR));
    assert.ok(llmsBody.includes("PeaceLock"));
    assert.ok(mapBody.includes("<loc>" + CANON_ORIGIN + "/</loc>"));
  });

  it("packs the Software catalog so a warm HIT does not fetch runtime twice", async () => {
    const paths = [];
    const env = {
      VIEWS: memoryKv(0),
      __CACHE: memoryCache(),
      AZIEL_RUNTIME: {
        fetch: async (req) => {
          const path = new URL(req.url).pathname;
          paths.push(path);
          if (path === "/v1/software") {
            return new Response(
              JSON.stringify({
                ok: true,
                products: [
                  { slug: "azai", name: "AZAI", worker_home: "https://azai-download-tracker.vibelock.workers.dev/" },
                  { slug: "newlock", name: "NewLock", worker_home: "https://newlock-download-tracker.vibelock.workers.dev/" },
                ],
              }),
              { status: 200, headers: { "Content-Type": "application/json" } },
            );
          }
          return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
        },
      },
    };

    const first = await fetchPath("/v1/software", { headers: { "user-agent": "Mozilla/5.0" } }, env);
    const firstDoc = await first.json();
    assert.equal(firstDoc.source, "live");
    assert.ok(firstDoc.software.some((s) => s.name === "NewLock"));

    const before = paths.filter((p) => p === "/v1/software" || p === "/v1/fraggate/list").length;
    assert.equal(before, 1);

    const second = await fetchPath("/cite.json", {}, env);
    const cite = await second.json();
    assert.ok(cite.software_names.some((s) => s.name === "NewLock"));

    const after = paths.filter((p) => p === "/v1/software" || p === "/v1/fraggate/list").length;
    assert.equal(after, before);

    const home = await fetchPath("/", { headers: { "user-agent": "Mozilla/5.0" } }, env);
    const html = await home.text();
    assert.ok(html.includes(">NewLock<"));
    assert.ok(html.includes(">AZAI<"));
    assert.equal(paths.filter((p) => p === "/v1/software" || p === "/v1/fraggate/list").length, before);
  });

  it("keeps counting humans on cached HTML without extra KV reads", async () => {
    const base = memoryKv(4);
    let gets = 0;
    const env = {
      VIEWS: {
        async get(key) {
          gets += 1;
          return base.get(key);
        },
        async put(key, value) {
          return base.put(key, value);
        },
      },
      __CACHE: memoryCache(),
    };

    const a = await fetchPath("/", { headers: { "user-agent": "Mozilla/5.0" } }, env);
    assert.ok((await a.text()).includes(">5<span>views</span>"));
    const getsAfterFirst = gets;

    const b = await fetchPath("/", { headers: { "user-agent": "Mozilla/5.0" } }, env);
    assert.equal(b.status, 200);
    assert.ok((await b.text()).includes('id="views"'));

    const stats = await fetchPath("/v1/stats", {}, env);
    assert.deepEqual(await stats.json(), {
      ok: true,
      views: 6,
      product: "azieleliab",
      author: "Aziel Eliab",
    });
    assert.ok(gets <= getsAfterFirst);

    const kv = memoryKv(10);
    let incrementGets = 0;
    const views = {
      async get(key) {
        incrementGets += 1;
        return kv.get(key);
      },
      async put(key, value) {
        return kv.put(key, value);
      },
    };
    assert.equal(await incrementViews({ VIEWS: views }), 11);
    assert.equal(await incrementViews({ VIEWS: views }), 12);
    assert.equal(incrementGets, 1);
  });

  it("soft-caps update/check origin refresh and still returns the full pointer", async () => {
    let origin = 0;
    const env = {
      AZIEL_RUNTIME: {
        fetch: async (req) => {
          if (new URL(req.url).pathname === "/v1/update/check") {
            origin += 1;
            return new Response(JSON.stringify({ ok: true, version: "1.6.13" }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }
          return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
        },
      },
    };

    for (let i = 0; i < FANOUT_MAX + 8; i++) {
      const res = await handleRequest(
        new Request("https://www.azieleliab.com/v1/update/check", { headers: { "user-agent": "Mozilla/5.0" } }),
        env,
      );
      assert.equal(res.status, 200);
      const doc = await res.json();
      assert.equal(doc.ok, true);
      assert.equal(doc.author, AUTHOR);
      assert.ok(doc.update_check.includes("/v1/update/check"));
    }
    assert.equal(origin, FANOUT_MAX);

    env.OPERATOR_TOKEN = "op-secret";
    const op = await handleRequest(
      new Request("https://www.azieleliab.com/v1/update/check", {
        headers: { "user-agent": "Mozilla/5.0", "x-aziel-runtime-token": "op-secret" },
      }),
      env,
    );
    assert.equal(op.status, 200);
    assert.equal(origin, FANOUT_MAX + 1);
    assert.equal(isOperator(new Request("https://www.azieleliab.com/", { headers: { authorization: "Bearer op-secret" } }), env), true);
    assert.equal(allowOriginRefresh(new Request("https://www.azieleliab.com/"), {}, "update"), true);
  });
});
