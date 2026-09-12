import { describe, it } from "node:test";
import assert from "node:assert/strict";
import worker, { apexRedirect, donateCacheBustLocation, handleRequest } from "../src/index.js";
import { donateHtml, embryoLockHtml, ecosystemHtml, pageHtml, spineNav } from "../src/page.js";
import { incrementViews, memoryKv } from "../src/views.js";
import { DONATE_HTML_CACHE, HTML_CACHE, SEO_CACHE, memoryCache } from "../src/edgeCache.js";
import { FANOUT_MAX, allowOriginRefresh, isOperator } from "../src/costGuard.js";
import { aiTxt, citeDoc, jsonLd, llmsTxt, robotsTxt, sitemapXml, softwareNodeId } from "../src/seo.js";
import {
  ABOUT_PATHS,
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
  DONATE_DESCRIPTION,
  DONATE_DISCLAIMER,
  DONATE_HREF,
  DONATE_NETWORK_NOTE,
  DONATE_PATH,
  DONATE_RAILS,
  DONATE_SIGN,
  DONATE_TITLE,
  DONATE_XRP_TAG_NOTE,
  DOORS,
  ECOSYSTEM_LINKS,
  ECOSYSTEM_TITLE,
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
  EMBRYOLOCK_WORKER,
  FRAGGATE_GITHUB,
  FRAGGATE_WORKER,
  GITHUB_QNM_NODE,
  GITHUB_RUNTIME,
  PEACELOCK_WORKER,
  PROSE,
  RUNTIME_LOCAL,
  RUNTIME_NAME,
  RUNTIME_TITLE,
  SIGIL,
  SOFTWARE,
  SOFTWARE_EXTRAS,
  SOFTWARE_HREF,
  SOFTWARE_SECTION,
  SPINE,
  RUNTIME_VERSION,
  RUNTIME_DOORS,
  GLAMA_RUNTIME,
  HEDIDNTJUMP,
  PERSON_ID,
  PERSON_SAME_AS,
  RUNTIME,
  RUNTIME_DOCS,
  RUNTIME_ID,
  RUNTIME_NAMED_LINE,
  RUNTIME_NAMED_TOOLS,
  runtimeToolId,
  WEBSITE_ID,
  isAboutAlias,
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
  liveNodesCount,
  liveNodesLabel,
  meshEnabled,
  meshNodesBody,
  meshQuietLabel,
  meshSnapshot,
  meshStatusBody,
  QNM_ENABLE_BEARER,
  QNM_SPEC,
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
    assert.equal(SIGIL, CANON_ORIGIN + "/sigil.png");
    assert.ok(pageHtml().includes(SIGIL));
    assert.ok(!pageHtml().includes("https://www.azielcorpuslibrary.net/sigil.png"));
  });
});

describe("software doors", () => {
  it("hyperlinks every SOFTWARE name to a verified URL", () => {
    const html = pageHtml();
    assert.equal(CATALOG_SOFTWARE.length, 37);
    assert.equal(SOFTWARE.length, 37);
    for (const item of SOFTWARE) {
      const needle = 'href="' + item.href + '"';
      assert.ok(html.includes(needle), "missing href for " + item.name);
      assert.ok(html.includes(">" + item.name + "<"), "missing visible name " + item.name);
    }
    assert.doesNotMatch(html, /Run them without me/);
    assert.match(html, /<h2>Software<\/h2>\s*<p class="soft-line">/);
    assert.doesNotMatch(html, /soft-close/);
    assert.doesNotMatch(html, /runtime 1\.6\.\d+ FragGate/i);
    const softwareCard = html.match(/<section class="card" id="software">[\s\S]*?<\/section>/);
    assert.ok(softwareCard);
    assert.match(softwareCard[0], /<h2>Software<\/h2>\s*<p class="soft-line">/);
    assert.doesNotMatch(softwareCard[0], /Official Runtime|Try on Glama|Try \/ Deploy on Glama|Documentation \/ Architecture|named components|Ask Jeeves/);
    assert.doesNotMatch(softwareCard[0], /2\.0\.0-rc1/);
  });

  it("cites Aziel Runtime 2.0.0-rc1 and Glama distribution doors outside Softwares", () => {
    assert.equal(RUNTIME_VERSION, "2.0.0-rc1");
    assert.equal(GLAMA_RUNTIME, "https://glama.ai/mcp/servers/AzielEliab/aziel-runtime");
    assert.equal(RUNTIME_DOCS, "https://github.com/AzielEliab/aziel-runtime/tree/main/docs/2.0");
    assert.deepEqual(
      RUNTIME_DOORS.map((d) => d.label),
      ["Try on Glama", "Official Runtime", "Source on GitHub", "Documentation / Architecture"],
    );
    assert.equal(RUNTIME_DOORS[0].label, "Try on Glama");
    assert.equal(RUNTIME_DOORS[0].href, GLAMA_RUNTIME);
    assert.equal(RUNTIME_DOORS[0].primary, true);
    assert.ok(RUNTIME_DOORS.slice(1).every((d) => !d.primary));
    const html = pageHtml();
    assert.match(html, /<section class="card" id="runtime">/);
    assert.match(html, /<h2>Aziel Runtime<\/h2>/);
    assert.match(html, /id="aziel-runtime-version">2\.0\.0-rc1</);
    assert.match(html, /\/runtime\/v1\/health/);
    for (const door of RUNTIME_DOORS) {
      assert.ok(html.includes('href="' + door.href + '"'), door.label);
      assert.ok(html.includes(">" + door.label + "<"), door.label + " label");
    }
    assert.match(html, /href="https:\/\/glama\.ai\/mcp\/servers\/AzielEliab\/aziel-runtime" class="runtime-cta"/);
    assert.match(html, /class="runtime-cta"[^>]*>Try on Glama</);
    assert.doesNotMatch(html, /Try \/ Deploy on Glama|Try\/Deploy on Glama/);
    const runtimeCard = html.match(/<section class="card" id="runtime">[\s\S]*?<\/section>/);
    assert.ok(runtimeCard);
    assert.ok(runtimeCard[0].includes(RUNTIME_NAMED_LINE));
    assert.match(runtimeCard[0], /class="runtime-cta"[^>]*>Try on Glama</);
    assert.doesNotMatch(runtimeCard[0], /class="runtime-cta"[^>]*>Official Runtime</);
    assert.match(runtimeCard[0], /class="runtime-secondary"/);
    assert.ok(runtimeCard[0].indexOf("Try on Glama") < runtimeCard[0].indexOf("Official Runtime"));
    assert.ok(runtimeCard[0].indexOf("Official Runtime") < runtimeCard[0].indexOf("Source on GitHub"));
    assert.doesNotMatch(html, /runtime 2\.0\.0-rc1 FragGate/i);
    const ld = jsonLd();
    assert.equal(ld["@graph"][2].softwareVersion, "2.0.0-rc1");
    assert.ok(!/2\.0\.0-rc1/.test(ld["@graph"][2].description.split(".")[0]));
    const cite = citeDoc();
    assert.equal(cite.runtime_version, "2.0.0-rc1");
    assert.equal(cite.glama_runtime, GLAMA_RUNTIME);
    assert.equal(cite.runtime_docs, RUNTIME_DOCS);
    assert.equal(cite.runtime_doors.length, 4);
    assert.equal(cite.runtime_doors[0].label, "Try on Glama");
    assert.equal(cite.runtime_doors[0].url, GLAMA_RUNTIME);
    assert.equal(cite.runtime_doors[0].primary, true);
    assert.equal(cite.runtime_doors[1].label, "Official Runtime");
    assert.equal(cite.runtime_doors[1].primary, false);
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
    assert.ok(!html.includes('class="soft-name">' + RUNTIME_NAME + "<"));
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
    assert.ok(!names.includes("aziel-runtime"));
    assert.ok(!names.includes("FragGate"));
    assert.ok(!names.includes("Ask Jeeves"));
    assert.ok(!names.includes("mesh"));
    assert.ok(names.includes("4DMap"));
    assert.ok(names.includes("AZChat"));
    assert.ok(names.includes("AZCoherence"));
    assert.ok(SOFTWARE_EXTRAS.some((s) => s.name === "FragGate"));
    assert.ok(SOFTWARE_EXTRAS.some((s) => s.slug === "mesh" && s.software_tab === false));
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

  it("points EmbryoLock Softwares at catalog worker_home and keeps a secondary local page", () => {
    const html = pageHtml();
    assert.deepEqual(CATALOG_ONLY, []);
    const embryo = SOFTWARE.find((s) => s.name === "EmbryoLock");
    assert.equal(EMBRYOLOCK_PATH, "/embryolock");
    assert.equal(EMBRYOLOCK_HREF, CANON_ORIGIN + "/embryolock");
    assert.equal(EMBRYOLOCK_WORKER, "https://embryolock-download-tracker.vibelock.workers.dev/");
    assert.equal(embryo.href, EMBRYOLOCK_WORKER);
    assert.equal(embryo.worker_home, EMBRYOLOCK_WORKER);
    assert.notEqual(embryo.href, LIBRARY_SOFTWARE);
    assert.doesNotMatch(embryo.href, /azielcorpuslibrary\.net\/software/i);
    assert.ok(html.includes('href="' + EMBRYOLOCK_WORKER + '"'));
    assert.ok(html.includes(">EmbryoLock<"));
    assert.doesNotMatch(html, /href="https:\/\/www\.azielcorpuslibrary\.net\/software" class="soft-name"/);
    assert.doesNotMatch(html, />Lumen</);
    assert.ok(!citeDoc().software_names.some((s) => s.name === "Lumen"));
    assert.ok(citeDoc().software_names.some((s) => s.name === "EmbryoLock" && s.url === EMBRYOLOCK_WORKER));
    assert.ok(citeDoc().software_names.some((s) => s.name === "PeaceLock"));
    const stub = embryoLockHtml();
    assert.ok(stub.includes('rel="canonical" href="' + EMBRYOLOCK_HREF + '"'));
    assert.ok(stub.includes(SIGIL));
    assert.ok(stub.includes(EMBRYOLOCK_WORKER));
    for (const line of EMBRYOLOCK_COPY.open) {
      assert.ok(stub.includes(line), "missing stub copy: " + line);
    }
    assert.ok(stub.includes("Secondary local page"));
    assert.ok(stub.includes("worker_home"));
    assert.match(stub, /embryolock-download-tracker/i);
  });

  it("lists AZBrowser in Plain as its own Worker UI, not nested with FragGate or AZNet", () => {
    const html = pageHtml();
    const azbrowser = SOFTWARE.find((s) => s.name === "AZBrowser");
    const aznet = SOFTWARE.find((s) => s.name === "AZNet");
    const fraggate = SOFTWARE_EXTRAS.find((s) => s.name === "FragGate");
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
    const fraggate = SOFTWARE_EXTRAS.find((s) => s.name === "FragGate");
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
    const fraggate = SOFTWARE_EXTRAS.find((s) => s.name === "FragGate");
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
    const fraggate = SOFTWARE_EXTRAS.find((s) => s.name === "FragGate");
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

  it("keeps GodLock on Softwares and FragGate / runtime as extras only", () => {
    const html = pageHtml();
    const byName = Object.fromEntries(SOFTWARE.map((s) => [s.name, s.href]));
    const fraggate = SOFTWARE_EXTRAS.find((s) => s.name === "FragGate");
    const runtime = SOFTWARE_EXTRAS.find((s) => s.slug === "aziel-runtime");
    assert.equal(byName.GodLock, "https://godlock-download-tracker.vibelock.workers.dev/");
    assert.equal(byName["aziel-runtime"], undefined);
    assert.equal(softwareBucket("FragGate"), 1);
    assert.equal(FRAGGATE_WORKER, "https://fraggate-download-tracker.vibelock.workers.dev/");
    assert.equal(FRAGGATE_GITHUB, "https://github.com/AzielEliab/fraggate");
    assert.equal(fraggate.href, FRAGGATE_WORKER);
    assert.equal(runtime.href, RUNTIME_LOCAL);
    assert.ok(!html.includes('class="soft-name">FragGate<'));
    assert.ok(!html.includes('href="' + FRAGGATE_GITHUB + '" class="soft-name"'));
    assert.ok(!citeDoc().software_names.some((s) => s.name === "FragGate"));
    assert.equal(citeDoc().fraggate, FRAGGATE_WORKER);
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
    assert.ok(idx("4DMap") < idx("AZAI"));
    assert.ok(idx("AZBrowser") < idx("AZChat"));
    assert.ok(idx("AZChat") < idx("AZCoherence"));
    assert.ok(idx("AZCoherence") < idx("AZHub"));
    assert.ok(idx("StaticClock") < idx("DecisionGATE"));
    assert.ok(idx("AZAI") < idx("DecisionGATE"));
    assert.ok(idx("AZMail") < idx("DecisionGATE"));
    assert.ok(idx("DecisionGATE") < idx("CodeLock"));
    assert.ok(idx("EmbryoLock") > idx("DecisionGATE"));
    assert.ok(idx("PeaceLock") > idx("DecisionGATE"));
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

  it("lists He Didn't Jump as a first-class door and ecosystem sister site", () => {
    assert.equal(HEDIDNTJUMP, "https://www.hedidntjump.com");
    const door = DOORS.find((d) => d.label === "He Didn't Jump");
    assert.ok(door);
    assert.equal(door.href, HEDIDNTJUMP + "/");
    const eco = ECOSYSTEM_LINKS.find((d) => d.label === "He Didn't Jump");
    assert.ok(eco);
    assert.equal(eco.href, HEDIDNTJUMP + "/");
    const html = pageHtml();
    const doorsCard = html.match(/<section class="card" id="doors">[\s\S]*?<\/section>/);
    assert.ok(doorsCard);
    assert.ok(doorsCard[0].includes('class="door-label"'));
    assert.ok(doorsCard[0].includes(">He Didn't Jump<"));
    assert.ok(doorsCard[0].includes('href="' + HEDIDNTJUMP + '/"'));
    assert.ok(doorsCard[0].includes('class="door-url"'));
    assert.ok(doorsCard[0].includes(">" + HEDIDNTJUMP + "/<"));
    const footer = html.match(/<footer>[\s\S]*?<\/footer>/);
    assert.ok(footer);
    assert.ok(footer[0].includes(">He Didn't Jump<"));
    assert.ok(footer[0].includes('href="' + HEDIDNTJUMP + '/"'));
    const cite = citeDoc();
    assert.equal(cite.hedidntjump, HEDIDNTJUMP + "/");
    assert.ok(cite.doors.some((d) => d.label === "He Didn't Jump" && d.url === HEDIDNTJUMP + "/"));
    assert.equal(cite.doors.filter((d) => /hedidntjump/i.test(d.url)).length, 1);
    assert.ok(PERSON_SAME_AS.includes(HEDIDNTJUMP + "/"));
    assert.equal(PERSON_SAME_AS.filter((u) => u === HEDIDNTJUMP + "/").length, 1);
    assert.ok(jsonLd()["@graph"][0].sameAs.includes(HEDIDNTJUMP + "/"));
    assert.ok(llmsTxt().includes("He Didn't Jump: " + HEDIDNTJUMP + "/"));
    assert.ok(aiTxt().includes("He Didn't Jump: " + HEDIDNTJUMP + "/"));
    assert.ok(sitemapXml().includes("<loc>" + HEDIDNTJUMP + "/</loc>"));
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
    assert.ok(body.includes("Allow: /about"));
    assert.ok(body.includes("Allow: /about/"));
    assert.ok(body.includes("Allow: /AzielEliab"));
    assert.ok(body.includes("Allow: /aziel-eliab"));
    assert.ok(body.includes("Allow: /embryolock"));
    assert.ok(body.includes("Allow: /embryolock/"));
    assert.ok(body.includes("Allow: /sigil.png"));
    assert.ok(body.includes("Allow: /donate"));
    assert.ok(body.includes("Allow: /donate/"));
    assert.ok(body.includes("Allow: /donate/qr/"));
    assert.ok(body.includes("Allow: /runtime"));
    assert.ok(body.includes("Allow: /runtime/"));
    assert.ok(body.includes("Allow: /runtime/openapi.json"));
    assert.ok(body.includes("Allow: /runtime/v1/skill"));
    assert.ok(body.includes("Allow: /runtime/v1/software"));
    assert.ok(body.includes("Allow: /runtime/v1/fraggate/list"));
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
    assert.ok(body.includes("User-agent: ChatGPT-User"));
    assert.ok(body.includes("User-agent: Googlebot"));
    assert.ok(body.includes("User-agent: Google-Extended"));
    assert.ok(body.includes("User-agent: GoogleOther"));
    assert.ok(body.includes("User-agent: Claude"));
    assert.ok(body.includes("User-agent: ClaudeBot"));
    assert.ok(body.includes("User-agent: anthropic-ai"));
    assert.ok(body.includes("User-agent: PerplexityBot"));
    assert.ok(body.includes("User-agent: bingbot"));
    assert.ok(body.includes("User-agent: Meta-ExternalAgent"));
    assert.ok(body.includes("User-agent: Applebot"));
    assert.ok(body.includes("User-agent: Applebot-Extended"));
    assert.ok(body.includes("User-agent: Amazonbot"));
    assert.ok(body.includes("User-agent: DuckDuckBot"));
    assert.ok(body.includes("User-agent: DuckAssistBot"));
    assert.ok(body.includes("User-agent: MistralAI-User"));
    assert.ok(body.includes("User-agent: YouBot"));
    assert.ok(body.includes("User-agent: CCBot"));
    assert.ok(body.includes("User-agent: cohere-ai"));
    assert.ok(body.includes("User-agent: Bytespider"));
    assert.ok(body.includes("User-agent: Cloudflare-AI-Search"));
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
    assert.ok(llmsBody.includes("Person @id: " + PERSON_ID));
    assert.ok(llmsBody.includes("Runtime parent @id: " + RUNTIME_ID));
    assert.ok(llmsBody.includes("Named tools (not MCP ops): FragGate, ForgeReceipts"));
    assert.ok(llmsBody.includes(SOFTWARE_HREF + "  (301 to /#software)"));
    assert.ok(llmsBody.includes(CANON_ORIGIN + "/about  (301 to / — About Aziel Eliab)"));
    assert.ok(llmsBody.includes("Softwares list: " + SOFTWARE_SECTION));
    assert.ok(llmsBody.includes("Softwares alias: " + SOFTWARE_HREF + " (301 to /#software)"));
    assert.ok(llmsBody.includes("FragGate Worker: " + FRAGGATE_WORKER));
    assert.ok(llmsBody.includes(DONATE_HREF + "  (AZL-DONATE-1.0 primary Donate door)"));
    assert.ok(llmsBody.includes("## Donate"));
    assert.ok(llmsBody.includes(DONATE_DISCLAIMER));
    assert.ok(llmsBody.includes(EMBRYOLOCK_HREF + "  (EmbryoLock secondary local page)"));
    assert.ok(llmsBody.includes(CANON_ORIGIN + "/sigil.png"));
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
    assert.ok(llmsBody.includes("GET never enables"));
    assert.ok(llmsBody.includes("read-only suite presence is on") || llmsBody.includes("display from runtime"));
    assert.ok(!llmsBody.includes("default off"));
    assert.ok(!llmsBody.includes("Default radios off"));
    assert.ok(llmsBody.includes("QNM-BUILD-1.0"));
    assert.ok(llmsBody.includes("suite-presence"));
    assert.ok(llmsBody.includes("GET never enables"));
    assert.ok(llmsBody.includes("live_nodes"));
    assert.ok(llmsBody.includes("Research door"));
    assert.ok(llmsBody.includes(LIBRARY + "/"));
    assert.ok(llmsBody.includes("ChatGPT (GPT Actions / OpenAI)"));
    assert.ok(llmsBody.includes("Cohere"));
    assert.ok(llmsBody.includes("Cursor (MCP)"));
    assert.ok(llmsBody.includes("Glama"));
    assert.ok(llmsBody.includes("Try on Glama: " + GLAMA_RUNTIME));
    assert.ok(!llmsBody.includes("Try / Deploy on Glama"));
    assert.ok(!llmsBody.includes("Try/Deploy on Glama"));
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
    assert.ok(llmsBody.includes(EMBRYOLOCK_WORKER));
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
    assert.ok(aiBody.includes("Allow: /about"));
    assert.ok(aiBody.includes("Allow: /AzielEliab"));
    assert.ok(aiBody.includes("Softwares: " + SOFTWARE_SECTION));
    assert.ok(aiBody.includes("User-agent: Googlebot"));
    assert.ok(aiBody.includes("User-agent: Cloudflare-AI-Search"));
    assert.ok(aiBody.includes("User-agent: Claude"));
    assert.ok(aiBody.includes("Allow: /embryolock"));
    assert.ok(aiBody.includes("Allow: /embryolock/"));
    assert.ok(aiBody.includes("Allow: /sigil.png"));
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
    assert.equal(citeBody.person_id, PERSON_ID);
    assert.equal(citeBody.runtime_id, RUNTIME_ID);
    assert.equal(citeBody.runtime_named_tools.length, RUNTIME_NAMED_TOOLS.length);
    assert.deepEqual(citeBody.sameAs, PERSON_SAME_AS);
    assert.equal(citeBody.runtime_local, RUNTIME_LOCAL);
    assert.equal(citeBody.runtime_uses, RUNTIME_LOCAL + "/v1/uses");
    assert.equal(citeBody.software_catalog, CANON_ORIGIN + "/v1/software");
    assert.equal(citeBody.software_page, SOFTWARE_SECTION);
    assert.equal(citeBody.software_alias, SOFTWARE_HREF);
    assert.equal(citeBody.software_section, SOFTWARE_SECTION);
    assert.equal(citeBody.about, CANON_ORIGIN + "/");
    assert.deepEqual(citeBody.about_aliases, ABOUT_PATHS.map((p) => CANON_ORIGIN + p));
    assert.equal(citeBody.fraggate, FRAGGATE_WORKER);
    assert.equal(citeBody.fraggate_list, RUNTIME_LOCAL + "/v1/fraggate/list");
    assert.equal(citeBody.llms, CANON_ORIGIN + "/llms.txt");
    assert.equal(citeBody.ai, CANON_ORIGIN + "/ai.txt");
    assert.equal(citeBody.update_check, CANON_ORIGIN + "/v1/update/check");
    assert.equal(citeBody.mesh_status, CANON_ORIGIN + "/v1/mesh/status");
    assert.equal(citeBody.mesh_nodes, CANON_ORIGIN + "/v1/mesh/nodes");
    assert.equal(citeBody.mesh_status_runtime, RUNTIME_LOCAL + "/v1/mesh/status");
    assert.equal(citeBody.mesh_default, "on");
    assert.equal(citeBody.qnm_spec, "QNM-BUILD-1.0");
    assert.equal(citeBody.mesh_enable_bearer, "suite-presence");
    assert.equal(citeBody.mesh_get_never_enables, true);
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
    assert.ok(aiBody.includes("QNM-BUILD-1.0"));
    assert.ok(aiBody.includes("suite-presence"));
    assert.ok(aiBody.includes("GET never enables"));
    assert.ok(aiBody.includes("live_nodes"));
    assert.equal(citeBody.research, LIBRARY + "/");
    assert.ok(!citeBody.software_names.some((s) => s.name === "Lumen"));
    assert.ok(citeBody.software_names.some((s) => s.name === "AZMail" && s.url === AZMAIL_WORKER));
    assert.ok(citeBody.software_names.some((s) => s.name === "AZBrowser" && s.url === AZBROWSER_WORKER));
    assert.ok(citeBody.software_names.some((s) => s.name === "AZHub" && s.url === AZHUB_WORKER));
    assert.ok(citeBody.software_names.some((s) => s.name === "AZInterface" && s.url === AZINTERFACE_WORKER));
    assert.ok(citeBody.software_names.some((s) => s.name === "AZNet" && s.url === AZNET_WORKER));
    assert.ok(!citeBody.software_names.some((s) => s.name === "FragGate"));
    assert.ok(citeBody.software_names.some((s) => s.name === "EmbryoLock" && s.url === EMBRYOLOCK_WORKER));
    assert.ok(mapBody.includes("<loc>" + EMBRYOLOCK_HREF + "</loc>"));
    assert.ok(citeBody.software_names.some((s) => s.name === "PeaceLock"));
    assert.equal(citeBody.donate, DONATE_HREF);
    assert.ok(mapBody.includes("<loc>" + DONATE_HREF + "</loc>"));
    assert.ok(mapBody.includes("<loc>" + SOFTWARE_HREF + "</loc>"));
    assert.ok(mapBody.includes("<loc>" + SOFTWARE_SECTION + "</loc>"));
    assert.ok(mapBody.includes("<loc>" + CANON_ORIGIN + "/ai.txt</loc>"));
    assert.ok(mapBody.includes("<loc>" + RUNTIME_LOCAL + "/v1/fraggate/list</loc>"));
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
    assert.ok(html.includes("<title>" + AUTHOR + "</title>"));
    assert.ok(html.includes('rel="canonical" href="' + CANON_ORIGIN + '/"'));
    assert.ok(html.includes('hreflang="en" href="' + CANON_ORIGIN + '/"'));
    assert.ok(html.includes('hreflang="x-default" href="' + CANON_ORIGIN + '/"'));
    assert.ok(html.includes('name="twitter:site" content="@azieleliab"'));
    assert.ok(html.includes('property="og:locale" content="en"'));
    assert.ok(html.includes('rel="me" href="https://github.com/AzielEliab"'));
    assert.ok(html.includes('href="/runtime/openapi.json"'));
    assert.ok(html.includes('href="/runtime/v1/fraggate/list"'));
    assert.ok(html.includes('name="aziel-software-catalog"'));
    assert.ok(html.includes("<h1>" + AUTHOR + "</h1>"));
    const ld = jsonLd();
    assert.equal(ld["@graph"][0]["@type"], "Person");
    assert.equal(ld["@graph"][0]["@id"], PERSON_ID);
    assert.equal(ld["@graph"][0].name, AUTHOR);
    assert.ok(ld["@graph"][0].sameAs.includes(LIBRARY + "/"));
    assert.equal(ld["@graph"][1]["@type"], "WebSite");
    assert.equal(ld["@graph"][1]["@id"], WEBSITE_ID);
    assert.equal(ld["@graph"][1].url, CANON_ORIGIN + "/");
    assert.deepEqual(ld["@graph"][1].publisher, { "@id": PERSON_ID });
    assert.deepEqual(ld["@graph"][1].creator, { "@id": PERSON_ID });
    assert.equal(ld["@graph"][2]["@type"], "SoftwareApplication");
    assert.equal(ld["@graph"][2].name, RUNTIME_TITLE);
    assert.equal(ld["@graph"][2].url, RUNTIME_LOCAL);
    assert.deepEqual(ld["@graph"][2].author, { "@id": PERSON_ID });
    assert.ok(ld["@graph"][2].description.includes("aziel-runtime"));
    assert.ok(!ld["@graph"][2].description.includes("FragGate / aziel-runtime"));
    assert.ok(!/runtime 1\.6\.\d+ FragGate/i.test(ld["@graph"][2].description));
    assert.equal(ld["@graph"][3].name, RUNTIME_TITLE);
    assert.ok(!ld["@graph"][3].description.includes("FragGate door"));
    assert.equal(ld["@graph"][3]["@type"], "WebAPI");
    assert.equal(ld["@graph"][4]["@type"], "ItemList");
    assert.equal(ld["@graph"][4].name, "Software");
    assert.ok(ld["@graph"][4].itemListElement.some((item) => item.name === "EmbryoLock"));
    assert.equal(ld["@graph"][0].alternateName, "Aziel Elroi Eliab");
    assert.equal(ld["@graph"][0].givenName, "Aziel");
    assert.equal(ld["@graph"][0].familyName, "Eliab");
    assert.equal(ld["@graph"][5]["@type"], "WebPage");
    assert.equal(ld["@graph"][5].url, DONATE_HREF);
    assert.equal(ld["@graph"][5].potentialAction["@type"], "DonateAction");
    assert.equal(ld["@graph"][6]["@type"], "AboutPage");
    assert.equal(ld["@graph"][6].url, CANON_ORIGIN + "/");
    assert.equal(ld["@graph"][7]["@type"], "CollectionPage");
    assert.equal(ld["@graph"][7].url, SOFTWARE_SECTION);
    const catalogApps = ld["@graph"].filter(
      (n) => n["@type"] === "SoftwareApplication" && n.isPartOf && n.isPartOf["@id"] === CANON_ORIGIN + "/#software",
    );
    assert.equal(catalogApps.length, SOFTWARE.length);
    assert.ok(catalogApps.some((n) => n.name === "EmbryoLock" && n["@id"] === softwareNodeId({ name: "EmbryoLock" })));
    assert.ok(html.includes('"@type":"DonateAction"'));
    assert.ok(html.includes('"@type":"Person"'));
    assert.ok(html.includes('"@type":"WebSite"'));
    assert.ok(html.includes('"@type":"SoftwareApplication"'));
    assert.ok(html.includes('"@type":"WebAPI"'));
    assert.ok(html.includes('"@type":"ItemList"'));
    assert.ok(html.includes('"@type":"AboutPage"'));
    assert.ok(html.includes('"@type":"CollectionPage"'));
    assert.ok(html.includes('href="/v1/update/check"'));
    assert.ok(html.includes('name="aziel-update-check"'));
    assert.ok(html.includes('href="/v1/mesh/status"'));
    assert.ok(html.includes('href="/v1/mesh/nodes"'));
    assert.ok(html.includes('name="aziel-mesh-status"'));
    assert.ok(html.includes('name="aziel-qns-cd"'));
    assert.ok(html.includes('content="QNS-CD-1.0"'));
    assert.ok(html.includes('name="aziel-qnm"'));
    assert.ok(html.includes('content="QNM-BUILD-1.0"'));
    assert.ok(html.includes('id="aziel-live-nodes"'));
    assert.ok(html.includes(">Live Nodes · 0<"));
    assert.ok(!html.includes(">mesh off<"));
    assert.ok(!html.includes(">Live Nodes · off<"));
    assert.ok(!html.includes("mesh off"));
    const softLine = html.match(/<p class="soft-line">[\s\S]*?<\/p>/);
    assert.ok(softLine);
    assert.doesNotMatch(softLine[0], /Live Nodes/i);
    assert.ok(ld["@graph"][2].description.includes("/v1/mesh/status"));
    assert.ok(ld["@graph"][2].description.includes("QNS-CD-1.0"));
    assert.ok(ld["@graph"][3].description.includes("/v1/mesh/status"));
    assert.ok(ld["@graph"][3].description.includes("QNS-CD-1.0"));
  });
});

function jsonLdFromHtml(html) {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(match, "missing JSON-LD");
  return JSON.parse(match[1]);
}

function canonicalsFromHtml(html) {
  return [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map((m) => m[1]);
}

describe("public entity graph phases B–D + E audit", () => {
  it("locks Person @id to www #aziel and slims sameAs", () => {
    assert.equal(PERSON_ID, "https://www.azieleliab.com/#aziel");
    assert.equal(WEBSITE_ID, "https://www.azieleliab.com/#website");
    assert.deepEqual(PERSON_SAME_AS, [
      "https://github.com/AzielEliab",
      "https://glama.ai/mcp/servers/AzielEliab/aziel-runtime",
      "https://www.azielcorpuslibrary.net/",
      "https://godlock.uk/",
      "https://www.hedidntjump.com/",
    ]);
    assert.equal(GLAMA_RUNTIME, "https://glama.ai/mcp/servers/AzielEliab/aziel-runtime");
    assert.doesNotMatch(GLAMA_RUNTIME, /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);

    const ld = jsonLd();
    const person = ld["@graph"].find((n) => n["@type"] === "Person");
    const site = ld["@graph"].find((n) => n["@type"] === "WebSite");
    assert.ok(person);
    assert.ok(site);
    assert.equal(person["@id"], PERSON_ID);
    assert.equal(person.name, AUTHOR);
    assert.equal(person.alternateName, "Aziel Elroi Eliab");
    assert.deepEqual(person.sameAs, PERSON_SAME_AS);
    assert.ok(!person.sameAs.includes(GITHUB_RUNTIME));
    assert.ok(!person.sameAs.includes(RUNTIME_LOCAL));
    assert.ok(!person.sameAs.includes(RUNTIME + "/"));
    assert.ok(!person.sameAs.includes(LIBRARY_AZIEL));
    assert.equal(site["@id"], WEBSITE_ID);
    assert.deepEqual(site.publisher, { "@id": PERSON_ID });
    assert.deepEqual(site.creator, { "@id": PERSON_ID });
    assert.deepEqual(site.author, { "@id": PERSON_ID });

    const blob = JSON.stringify(ld);
    assert.ok(!blob.includes("#aziel-eliab"));
    assert.ok(!blob.includes("https://azieleliab.com/#aziel"));
    assert.doesNotMatch(blob, /glama\.ai\/mcp\/servers\/[0-9a-f]{8}-/i);
    assert.doesNotMatch(blob, /\/software\/aziel-runtime/);

    const refs = [];
    const walk = (node) => {
      if (!node || typeof node !== "object") return;
      if (Array.isArray(node)) {
        node.forEach(walk);
        return;
      }
      if (typeof node["@id"] === "string" && /#aziel$/.test(node["@id"])) refs.push(node["@id"]);
      Object.values(node).forEach(walk);
    };
    walk(ld);
    assert.ok(refs.length > 0);
    assert.ok(refs.every((id) => id === PERSON_ID));
  });

  it("cites Aziel Runtime on the hub /runtime surface, not the Worker as primary identity", () => {
    const runtime = jsonLd()["@graph"].find(
      (n) => n["@type"] === "SoftwareApplication" && n.name === RUNTIME_TITLE && n.url === RUNTIME_LOCAL,
    );
    const api = jsonLd()["@graph"].find((n) => n["@type"] === "WebAPI");
    assert.ok(runtime);
    assert.ok(api);
    assert.equal(runtime.name, "Aziel Runtime");
    assert.equal(runtime.url, RUNTIME_LOCAL);
    assert.notEqual(runtime.url, RUNTIME + "/");
    assert.deepEqual(runtime.author, { "@id": PERSON_ID });
    assert.deepEqual(runtime.creator, { "@id": PERSON_ID });
    assert.deepEqual(runtime.sameAs, [GITHUB_RUNTIME, GLAMA_RUNTIME]);
    assert.ok(!runtime.sameAs.includes(RUNTIME + "/"));
    assert.equal(runtime.codeRepository, GITHUB_RUNTIME);
    assert.equal(runtime.sourceCode.codeRepository, GITHUB_RUNTIME);
    assert.equal(runtime.relatedLink, RUNTIME + "/");
    assert.equal(runtime["@id"], RUNTIME_ID);
    assert.equal(runtime.hasPart.length, RUNTIME_NAMED_TOOLS.length);
    assert.equal(api.url, RUNTIME_LOCAL);
    assert.equal(api.endpoint["@type"], "EntryPoint");
    assert.equal(api.endpoint.url, RUNTIME + "/");
  });

  it("shows the ecosystem chrome in the footer, not between Softwares heading and list", () => {
    assert.equal(ECOSYSTEM_TITLE, "Part of the Aziel Eliab ecosystem");
    assert.deepEqual(
      ECOSYSTEM_LINKS.map((d) => [d.label, d.href, Boolean(d.secondary)]),
      [
        ["Official site", "https://www.azieleliab.com/", false],
        ["Aziel Corpus Library", "https://www.azielcorpuslibrary.net/", false],
        ["He Didn't Jump", "https://www.hedidntjump.com/", false],
        ["Aziel Runtime on GitHub", "https://github.com/AzielEliab/aziel-runtime", false],
        ["Aziel Runtime", "https://aziel-runtime.vibelock.workers.dev/", true],
        ["Try on Glama", "https://glama.ai/mcp/servers/AzielEliab/aziel-runtime", false],
      ],
    );
    const block = ecosystemHtml();
    assert.ok(block.includes('class="ecosystem"'));
    assert.ok(block.includes(ECOSYSTEM_TITLE));
    assert.ok(block.includes('aria-label="' + ECOSYSTEM_TITLE + '"'));
    for (const link of ECOSYSTEM_LINKS) {
      assert.ok(block.includes('href="' + link.href + '"'), link.label);
      assert.ok(block.includes(">" + link.label + "<"), link.label);
    }
    assert.match(block, /class="ecosystem-secondary"[^>]*>Aziel Runtime</);
    assert.doesNotMatch(block, /Try \/ Deploy on Glama|Try\/Deploy on Glama/);

    const html = pageHtml();
    const softwareCard = html.match(/<section class="card" id="software">[\s\S]*?<\/section>/);
    assert.ok(softwareCard);
    assert.match(softwareCard[0], /<h2>Software<\/h2>\s*<p class="soft-line">/);
    assert.doesNotMatch(softwareCard[0], /Part of the Aziel Eliab ecosystem/);
    assert.doesNotMatch(softwareCard[0], /Official site|Aziel Corpus Library|Try on Glama|named components/);
    const footer = html.match(/<footer>[\s\S]*?<\/footer>/);
    assert.ok(footer);
    assert.ok(footer[0].includes(ECOSYSTEM_TITLE));
    assert.ok(footer[0].includes(">Try on Glama<"));
    assert.ok(footer[0].includes(">Live Nodes · 0<"));
    assert.ok(!footer[0].includes(">mesh off<"));
    assert.ok(!footer[0].includes("mesh off"));
    assert.ok(html.indexOf('id="software"') < html.indexOf("Part of the Aziel Eliab ecosystem"));

    const donate = donateHtml();
    const embryo = embryoLockHtml();
    assert.ok(donate.includes(ECOSYSTEM_TITLE));
    assert.ok(embryo.includes(ECOSYSTEM_TITLE));
    assert.ok(donate.includes(">Try on Glama<"));
    assert.ok(embryo.includes(">Aziel Runtime on GitHub<"));
  });

  it("keeps self-referencing www canonicals and never canonicalizes to another domain", () => {
    const pages = [
      [pageHtml(), CANON_ORIGIN + "/"],
      [donateHtml(), DONATE_HREF],
      [embryoLockHtml(), EMBRYOLOCK_HREF],
    ];
    for (const [html, expected] of pages) {
      const hrefs = canonicalsFromHtml(html);
      assert.ok(hrefs.length >= 1, expected);
      for (const href of hrefs) {
        assert.equal(href, expected);
        assert.ok(href.startsWith(CANON_ORIGIN));
        assert.ok(!href.includes("azieleliab.com/#") || href.startsWith(CANON_ORIGIN));
        assert.doesNotMatch(href, /azielcorpuslibrary\.net|godlock\.uk|hedidntjump\.com|github\.com|workers\.dev|glama\.ai/);
        assert.doesNotMatch(href, /^https:\/\/azieleliab\.com\//);
      }
      const embedded = jsonLdFromHtml(html);
      const person = embedded["@graph"].find((n) => n["@type"] === "Person");
      assert.equal(person["@id"], PERSON_ID);
      assert.equal(person.name, AUTHOR);
    }
  });

  it("exposes a Runtime parent with named-tool hasPart, not MCP verbs", () => {
    assert.equal(RUNTIME_ID, "https://www.azieleliab.com/runtime#runtime");
    assert.equal(RUNTIME_NAMED_TOOLS.length, 21);
    assert.deepEqual(
      RUNTIME_NAMED_TOOLS.map((t) => [t.slug, t.name]),
      [
        ["fraggate", "FragGate"],
        ["forgereceipts", "ForgeReceipts"],
        ["decisiongate", "DecisionGate"],
        ["temporallock", "TemporalLock"],
        ["trajectorylock", "TrajectoryLock"],
        ["peacelock", "PeaceLock"],
        ["godlock", "GodLock"],
        ["azos", "AZ-OS"],
        ["azcoherence", "AZCoherence"],
        ["4dmap", "4DMap"],
        ["aziel-corpus", "Aziel Corpus"],
        ["askjeeves", "Ask Jeeves"],
        ["azbrowser", "AZBrowser"],
        ["azmail", "AZMail"],
        ["azhub", "AZHub"],
        ["azinterface", "AZInterface"],
        ["spectrallock", "SpectralLock"],
        ["shadowlock", "ShadowLock"],
        ["foldlock", "FoldLock"],
        ["codelock", "CodeLock"],
        ["vibelock", "VibeLock"],
      ],
    );
    assert.equal(runtimeToolId("fraggate"), "https://www.azieleliab.com/runtime#fraggate");
    assert.equal(runtimeToolId("aziel-corpus"), "https://www.azieleliab.com/runtime#aziel-corpus");
    assert.equal(RUNTIME_NAMED_LINE, "Aziel Runtime includes named components such as FragGate, ForgeReceipts, …");

    const ld = jsonLd();
    const runtime = ld["@graph"].find((n) => n["@id"] === RUNTIME_ID);
    assert.ok(runtime);
    assert.equal(runtime["@type"], "SoftwareApplication");
    assert.equal(runtime.name, "Aziel Runtime");
    assert.deepEqual(runtime.author, { "@id": PERSON_ID });
    assert.deepEqual(runtime.sameAs, [GITHUB_RUNTIME, GLAMA_RUNTIME]);
    assert.ok(!runtime.sameAs.includes(RUNTIME + "/"));
    assert.equal(runtime.url, RUNTIME_LOCAL);
    assert.equal(runtime.relatedLink, RUNTIME + "/");
    assert.deepEqual(
      runtime.hasPart,
      RUNTIME_NAMED_TOOLS.map((tool) => ({ "@id": runtimeToolId(tool.slug) })),
    );

    const named = ld["@graph"].filter(
      (n) => n["@type"] === "SoftwareApplication" && n.isPartOf && n.isPartOf["@id"] === RUNTIME_ID,
    );
    assert.equal(named.length, RUNTIME_NAMED_TOOLS.length);
    for (const tool of RUNTIME_NAMED_TOOLS) {
      const node = named.find((n) => n["@id"] === runtimeToolId(tool.slug));
      assert.ok(node, tool.slug);
      assert.equal(node.name, tool.name);
      assert.deepEqual(node.author, { "@id": PERSON_ID });
      assert.deepEqual(node.isPartOf, { "@id": RUNTIME_ID });
    }

    const blob = JSON.stringify(ld);
    assert.doesNotMatch(blob, /\/software\/aziel-runtime/);
    for (const verb of [
      "fraggate_call",
      "fraggate_list",
      "list_modules",
      "genesis_boot",
      "ethical_search",
      "lamb_lens_search",
      "page_cycle_status",
      "blank_key_status",
    ]) {
      assert.ok(!blob.includes("#" + verb), verb);
      assert.ok(!named.some((n) => n.name === verb || String(n["@id"]).endsWith("#" + verb)), verb);
    }

    const html = pageHtml();
    const softwareCard = html.match(/<section class="card" id="software">[\s\S]*?<\/section>/);
    const runtimeCard = html.match(/<section class="card" id="runtime">[\s\S]*?<\/section>/);
    assert.ok(softwareCard);
    assert.ok(runtimeCard);
    assert.match(softwareCard[0], /<h2>Software<\/h2>\s*<p class="soft-line">/);
    assert.doesNotMatch(softwareCard[0], /named components|Ask Jeeves/);
    assert.ok(runtimeCard[0].includes(RUNTIME_NAMED_LINE));
    assert.match(runtimeCard[0], /class="runtime-cta"[^>]*>Try on Glama</);
    assert.ok(!SOFTWARE.some((s) => s.name === "Ask Jeeves" || s.name === "DecisionGate"));
    assert.ok(SOFTWARE.some((s) => s.name === "DecisionGATE"));
  });

  it("keeps read-only mesh presence on and GET-never-enables", () => {
    const html = pageHtml();
    assert.ok(!html.includes(">mesh off<"));
    assert.ok(!html.includes(">Live Nodes · off<"));
    assert.ok(!html.includes("mesh off"));
    assert.ok(html.includes(">Live Nodes · 0<"));
    const cite = citeDoc();
    assert.equal(cite.mesh_default, "on");
    assert.equal(cite.mesh_get_never_enables, true);
    assert.equal(cite.person_id, PERSON_ID);
    assert.ok(llmsTxt().includes("Person @id: " + PERSON_ID));
    assert.ok(llmsTxt().includes("sameAs: " + PERSON_SAME_AS.join(" · ")));
    assert.match(cite.mesh_note, /Read-only suite presence is on/);
    assert.doesNotMatch(cite.mesh_note, /[Dd]efault off/);
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

  it("serves a hosted /sigil.png so Donate does not fetch the corpus", async () => {
    const res = await fetchPath("/sigil.png");
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type"), /image\/png/);
    assert.equal(res.headers.get("X-Aziel-Sigil"), "Everblooming");
    const buf = new Uint8Array(await res.arrayBuffer());
    assert.equal(buf[0], 0x89);
    assert.equal(String.fromCharCode(buf[1], buf[2], buf[3]), "PNG");
    assert.ok(buf.length > 1000);
    const head = await fetchPath("/sigil.png", { method: "HEAD" });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), "");
    const donate = donateHtml();
    assert.ok(donate.includes('src="' + SIGIL + '"'));
    assert.ok(!donate.includes("https://www.azielcorpuslibrary.net/sigil.png"));
  });

  it("returns a literary 404", async () => {
    const res = await fetchPath("/no-such-door");
    assert.equal(res.status, 404);
    const body = await res.text();
    assert.ok(body.includes("This path is not a door."));
  });

  it("301s /software and /software/ to the homepage Software strip", async () => {
    assert.equal(SOFTWARE_SECTION, CANON_ORIGIN + "/#software");
    assert.equal(SOFTWARE_HREF, CANON_ORIGIN + "/software");
    const html = await fetchPath("/");
    const home = await html.text();
    assert.ok(home.includes('id="software"'));
    assert.ok(home.includes('"@type":"SoftwareApplication"'));
    assert.ok(home.includes('"@id":"' + softwareNodeId({ name: "AZAI" }) + '"') || home.includes("#software-azai"));

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

  it("301s About aliases to the www homepage", async () => {
    assert.equal(isAboutAlias("/about"), true);
    assert.equal(isAboutAlias("/about/"), true);
    assert.equal(isAboutAlias("/AzielEliab"), true);
    assert.equal(isAboutAlias("/aziel-eliab"), true);
    assert.equal(isAboutAlias("/software"), false);
    for (const path of ["/about", "/about/", "/AzielEliab", "/aziel-eliab"]) {
      const res = await fetchPath(path);
      assert.equal(res.status, 301, path);
      assert.equal(res.headers.get("location"), CANON_ORIGIN + "/");
    }
    const apex = await handleRequest(new Request("https://azieleliab.com/about"));
    assert.equal(apex.status, 301);
    assert.equal(apex.headers.get("location"), CANON_ORIGIN + "/about");
  });

  it("serves GET /embryolock as a secondary local page, not the corpus catalog", async () => {
    for (const path of ["/embryolock", "/embryolock/"]) {
      const res = await fetchPath(path);
      assert.equal(res.status, 200);
      assert.match(res.headers.get("content-type"), /text\/html/);
      const body = await res.text();
      assert.ok(body.includes("<h1>EmbryoLock</h1>"));
      assert.ok(body.includes("Secondary local page"));
      assert.ok(body.includes("worker_home"));
      assert.ok(body.includes("This page is not the Softwares product card"));
      assert.match(body, /embryolock-download-tracker/i);
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
    assert.ok(html.includes('hreflang="en" href="' + DONATE_HREF + '"'));
    assert.ok(html.includes('hreflang="x-default" href="' + DONATE_HREF + '"'));
    assert.ok(html.includes("<!-- azl-donate png -->"));
    assert.ok(html.includes("<title>Donate — " + AUTHOR + "</title>"));
    assert.ok(html.includes('name="author" content="' + AUTHOR + '"'));
    assert.ok(html.includes('name="description" content="' + DONATE_DESCRIPTION + '"'));
    assert.ok(html.includes('name="twitter:site" content="@azieleliab"'));
    assert.ok(html.includes('href="/ai.txt"'));
    assert.ok(html.includes('href="/v1/software"'));
    assert.ok(html.includes('"@type":"WebPage"'));
    assert.ok(html.includes('"@type":"DonateAction"'));
    assert.ok(html.includes('"@type":"Person"'));
    assert.ok(html.includes("application/ld+json"));
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

  it("prefers /v1/software at request time and keeps Plain→Gate→Lock plus EmbryoLock worker_home", async () => {
    const env = catalogEnv(async (req) => {
      const path = new URL(req.url).pathname;
      if (path === "/v1/software") {
        return new Response(
          JSON.stringify({
            ok: true,
            author: "Aziel Eliab",
            version: "1.9.0",
            products: [
              {
                slug: "newlock",
                name: "NewLock",
                status: "live",
                version: "0.1.0",
                one_line: "New lock door.",
                worker_home: "https://newlock-download-tracker.vibelock.workers.dev/",
              },
              {
                slug: "azai",
                name: "AZAI",
                status: "live",
                version: "0.3.1",
                one_line: "Local OpenAI-compatible runtime.",
                worker_home: "https://azai-download-tracker.vibelock.workers.dev/",
              },
              { slug: "decisiongate", name: "DecisionGATE", status: "live", version: "0.1.0" },
              {
                slug: "embryolock",
                name: "EmbryoLock",
                status: "live",
                version: "1.1.0",
                one_line: "Offline destructive-over-recovery vault.",
                worker_home: "https://embryolock-download-tracker.vibelock.workers.dev/",
              },
            ],
            extras: [{ slug: "fraggate", name: "FragGate", worker_home: FRAGGATE_WORKER }],
            fraggate: "https://aziel-runtime.vibelock.workers.dev/v1/fraggate",
            mesh: { path: "/v1/mesh", enabled_default: false, spec: "QNM-BUILD-1.0" },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
    });

    const landing = await fetchPath("/", { headers: { "user-agent": "Mozilla/5.0" } }, env);
    const html = await landing.text();
    const softwares = await fetchPath("/software", {}, env);
    assert.equal(softwares.status, 301);
    assert.equal(softwares.headers.get("location"), SOFTWARE_SECTION);
    assert.ok(html.includes(">NewLock<"));
    assert.ok(html.includes("#software-newlock"));
    assert.ok(html.includes('href="https://newlock-download-tracker.vibelock.workers.dev/"'));
    assert.ok(html.includes(">AZAI<"));
    assert.ok(html.includes(">DecisionGATE<"));
    assert.ok(!html.includes('class="soft-name">FragGate<'));
    assert.ok(html.includes(">EmbryoLock<"));
    assert.ok(html.includes('href="' + EMBRYOLOCK_WORKER + '"'));
    assert.match(html, /embryolock-download-tracker/i);
    const idx = (name) => html.indexOf(">" + name + "<");
    assert.ok(idx("AZAI") < idx("DecisionGATE"));
    assert.ok(idx("DecisionGATE") < idx("NewLock"));

    const index = await fetchPath("/v1/software", {}, env);
    assert.equal(index.status, 200);
    const doc = await index.json();
    assert.equal(doc.ok, true);
    assert.equal(doc.author, AUTHOR);
    assert.equal(doc.source, "live");
    assert.equal(doc.via, "/v1/software");
    const newlock = doc.products.find((s) => s.slug === "newlock");
    assert.ok(newlock);
    assert.equal(newlock.status, "live");
    assert.equal(newlock.version, "0.1.0");
    assert.equal(newlock.one_line, "New lock door.");
    assert.equal(newlock.worker_home, "https://newlock-download-tracker.vibelock.workers.dev/");
    assert.ok(doc.software.some((s) => s.name === "NewLock" && s.slug === "newlock"));
    const embryo = doc.products.find((s) => s.name === "EmbryoLock");
    assert.equal(embryo.url, EMBRYOLOCK_WORKER);
    assert.equal(embryo.worker_home, EMBRYOLOCK_WORKER);
    assert.equal(embryo.status, "live");
    assert.equal(embryo.version, "1.1.0");
    assert.ok(!doc.products.some((s) => s.name === "FragGate" || s.slug === "mesh"));
    assert.ok(doc.extras.some((s) => s.name === "FragGate" && s.software_tab === false));
    assert.ok(doc.extras.some((s) => s.slug === "mesh" && s.software_tab === false && s.enabled_default === false));
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
    assert.ok(!html.includes('class="soft-name">' + RUNTIME_NAME + "<"));
    assert.doesNotMatch(html, /runtime 1\.6\.15 FragGate/);
    assert.doesNotMatch(html, /Run them without me/);
    assert.match(html, /<h2>Software<\/h2>\s*<p class="soft-line">/);
    const idx = (name) => html.indexOf(">" + name + "<");
    assert.ok(idx("AZAI") < idx("DecisionGATE"));
    assert.ok(idx("DecisionGATE") < idx("CodeLock"));

    const index = await fetchPath("/v1/software", {}, env);
    const doc = await index.json();
    assert.ok(!doc.products.some((s) => s.slug === "aziel-runtime"));
    const runtime = doc.extras.find((s) => s.slug === "aziel-runtime" || s.name === RUNTIME_NAME);
    assert.ok(runtime);
    assert.equal(runtime.name, RUNTIME_NAME);
    assert.ok(!doc.software.some((s) => /runtime 1\.6\.15 FragGate/i.test(s.name)));
    assert.ok(!doc.extras.some((s) => /runtime 1\.6\.15 FragGate/i.test(s.name)));
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
    assert.ok(doc.products.some((s) => s.name === "EmbryoLock" && s.url === EMBRYOLOCK_WORKER));
    assert.ok(!doc.products.some((s) => s.name === "aziel-runtime"));
    assert.ok(!doc.products.some((s) => s.name === "FragGate"));
    assert.ok(doc.extras.some((s) => s.name === "aziel-runtime"));
    assert.ok(doc.extras.some((s) => s.name === "FragGate"));

    const cite = await fetchPath("/cite.json", {}, env);
    const citeBody = await cite.json();
    assert.ok(citeBody.software_names.some((s) => s.name === "AZBot"));
    assert.ok(citeBody.software_names.some((s) => s.name === "EmbryoLock" && s.url === EMBRYOLOCK_WORKER));
  });

  it("uses the static SOFTWARE fallback when live catalog calls fail", async () => {
    const index = await fetchPath("/v1/software");
    const doc = await index.json();
    assert.equal(doc.source, "fallback");
    assert.equal(doc.via, null);
    assert.ok(doc.software.some((s) => s.name === "PeaceLock"));
    assert.ok(doc.products.some((s) => s.name === "EmbryoLock" && s.url === EMBRYOLOCK_WORKER && s.worker_home === EMBRYOLOCK_WORKER));
    assert.ok(!doc.products.some((s) => s.name === "FragGate" || s.slug === "mesh"));
    assert.ok(doc.extras.some((s) => s.name === "FragGate" && s.software_tab === false));
    assert.ok(doc.extras.some((s) => s.slug === "mesh" && s.enabled_default === false));
    assert.equal(doc.software.length, SOFTWARE.length);
    assert.equal(doc.products.length, SOFTWARE.length);
    assert.equal(doc.mesh.enabled, false);
    assert.equal(doc.mesh.default, "on");
    assert.equal(doc.mesh.mesh, "off");
    assert.equal(doc.mesh.live_nodes, 0);
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
  it("never claims a hop mesh and omits mesh-off labels", () => {
    assert.equal(MESH_STATUS_PATH, "/v1/mesh/status");
    assert.equal(MESH_NODES_PATH, "/v1/mesh/nodes");
    assert.equal(meshEnabled(null), false);
    assert.equal(meshEnabled({ error: "not found" }), false);
    assert.equal(meshEnabled({ enabled: false, mesh: "off" }), false);
    assert.equal(meshEnabled({ enabled: true, mesh: "on" }), true);
    assert.equal(meshQuietLabel(null), "");
    assert.equal(meshQuietLabel({ origin: { enabled: true } }), "mesh on");
    assert.equal(liveNodesLabel(null), "Live Nodes · 0");
    assert.equal(liveNodesLabel({ origin: { enabled: true, live_nodes: 40 } }), "Live Nodes · 40");
    assert.equal(liveNodesCount({ enabled: true, rollup: { live: 40 } }), 40);
    assert.equal(QNM_SPEC, "QNM-BUILD-1.0");
    assert.equal(QNM_ENABLE_BEARER, "suite-presence");
    const off = meshStatusBody(null);
    assert.equal(off.ok, true);
    assert.equal(off.author, AUTHOR);
    assert.equal(off.identity, AUTHOR);
    assert.equal(off.enabled, false);
    assert.equal(off.mesh, "off");
    assert.equal(off.default, "on");
    assert.equal(off.live_nodes, 0);
    assert.deepEqual(off.rollup, { live: 0, locked: 0, isolated: 0 });
    assert.deepEqual(off.bearers, []);
    assert.equal(off.qnm_spec, "QNM-BUILD-1.0");
    assert.equal(off.mesh_enable_bearer, "suite-presence");
    assert.equal(off.mesh_get_never_enables, true);
    assert.match(off.note, /Read-only suite presence is on/);
    assert.doesNotMatch(off.note, /[Dd]efault off/);
    assert.match(off.note, /GET never enables/);
    assert.match(off.note, /suite-presence/);
    assert.match(off.note, /VPN\/hop mesh is not claimed/);
    assert.match(off.note, /QNS-CD-1\.0/);
    assert.match(MESH_NOTE, /QNS-CD-1\.0/);
    assert.match(MESH_NOTE, /GET never enables/);
    assert.match(MESH_NOTE, /suite-presence/);
    assert.match(MESH_NOTE, /QNM-BUILD-1\.0/);
    assert.equal(QNS_CD_SPEC, "QNS-CD-1.0");
    assert.equal(QNS_CD.spec, "QNS-CD-1.0");
    assert.equal(QNS_CD.title, "photon QNS1 packet transfer");
    assert.equal(QNS_CD.packet, "QNS1");
    assert.equal(QNS_CD.software_tab, false);
    assert.equal(QNS_CD.node_gate, false);
    assert.equal(QNS_CD.public_proxy, false);
    assert.equal(QNS_CD.qnsd, "local");
    assert.equal(QNS_CD.mesh_default, "on");
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
    assert.equal(snap.live_nodes, 0);
    assert.equal(snap.status, CANON_ORIGIN + "/v1/mesh/status");
    assert.equal(snap.runtime, RUNTIME_LOCAL + "/v1/mesh/status");
    assert.equal(snap.origin, "https://aziel-runtime.vibelock.workers.dev/v1/mesh/status");
    assert.equal(snap.qns_cd_spec, "QNS-CD-1.0");
    assert.equal(snap.qns_cd.public_proxy, false);
  });

  it("serves /v1/mesh/status and /v1/mesh/nodes when runtime 404s", async () => {
    const status = await fetchPath("/v1/mesh/status");
    assert.equal(status.status, 200);
    const doc = await status.json();
    assert.equal(doc.ok, true);
    assert.equal(doc.author, AUTHOR);
    assert.equal(doc.identity, AUTHOR);
    assert.equal(doc.enabled, false);
    assert.equal(doc.mesh, "off");
    assert.equal(doc.default, "on");
    assert.equal(doc.live_nodes, 0);
    assert.equal(doc.qnm_spec, "QNM-BUILD-1.0");
    assert.equal(doc.mesh_enable_bearer, "suite-presence");
    assert.equal(doc.mesh_get_never_enables, true);
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

    const landing = await fetchPath("/", { headers: { "user-agent": "Mozilla/5.0" } });
    const html = await landing.text();
    assert.ok(!html.includes("mesh off"));
    assert.ok(!html.includes("Live Nodes · off"));
    assert.ok(html.includes(">Live Nodes · 0<"));
    assert.ok(!html.includes(">mesh on<"));
  });

  it("attaches origin mesh when the runtime binding answers", async () => {
    const env = {
      AZIEL_RUNTIME: {
        fetch: async (req) => {
          const path = new URL(req.url).pathname;
          if (path === "/v1/mesh/status") {
            return new Response(
              JSON.stringify({
                ok: true,
                enabled: true,
                mesh: "on",
                spec: "QNM-BUILD-1.0",
                bearers: ["suite-presence"],
                live_nodes: 40,
                locked_nodes: 0,
                isolated_nodes: 0,
                rollup: { live: 40, locked: 0, isolated: 0 },
                node_count: 40,
              }),
              {
                status: 200,
                headers: { "Content-Type": "application/json" },
              },
            );
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
    assert.equal(doc.live_nodes, 40);
    assert.deepEqual(doc.bearers, ["suite-presence"]);
    assert.equal(doc.origin.live_nodes, 40);

    const nodes = await fetchPath("/v1/mesh/nodes", {}, env);
    const nodeDoc = await nodes.json();
    assert.equal(nodeDoc.enabled, true);
    assert.equal(nodeDoc.nodes.length, 2);

    const software = await fetchPath("/v1/software", {}, env);
    const index = await software.json();
    assert.equal(index.mesh.enabled, true);
    assert.equal(index.mesh.mesh, "on");
    assert.equal(index.mesh.live_nodes, 40);
    assert.deepEqual(index.mesh.bearers, ["suite-presence"]);
    assert.equal(index.mesh.qns_cd_spec, "QNS-CD-1.0");
    assert.equal(index.mesh.default, "on");

    const landing = await fetchPath("/", { headers: { "user-agent": "Mozilla/5.0" } }, env);
    const html = await landing.text();
    assert.ok(html.includes(">mesh on<"));
    assert.ok(html.includes(">Live Nodes · 40<"));
    assert.ok(html.includes('id="aziel-live-nodes"'));
    assert.ok(html.includes('name="aziel-mesh-status"'));
    const landingSoft = html.match(/<p class="soft-line">[\s\S]*?<\/p>/);
    assert.ok(landingSoft);
    assert.doesNotMatch(landingSoft[0], /Live Nodes/i);

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
    assert.equal(cited.mesh_default, "on");
    assert.equal(cited.qnm_spec, "QNM-BUILD-1.0");
    assert.equal(cited.mesh_enable_bearer, "suite-presence");
    assert.equal(cited.mesh_get_never_enables, true);
    assert.equal(cited.qns_cd_spec, "QNS-CD-1.0");
    assert.equal(cited.qns_cd.qnm_node, GITHUB_QNM_NODE);

    const alreadyCited = JSON.parse(
      injectMeshDiscovery(JSON.stringify({ author: AUTHOR, mesh_status: "/v1/mesh/status", mesh_nodes: "/v1/mesh/nodes" }), "application/json", "/cite.json"),
    );
    assert.equal(alreadyCited.qns_cd_spec, "QNS-CD-1.0");

    const llms = injectMeshDiscovery("# Aziel Eliab Runtime\n", "text/plain", "/llms.txt");
    assert.match(llms, /\/v1\/mesh\/status/);
    assert.match(llms, /read-only suite presence is on/);
    assert.doesNotMatch(llms, /default off/);
    assert.match(llms, /QNM-BUILD-1\.0/);
    assert.match(llms, /suite-presence/);
    assert.match(llms, /GET never enables/);
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
