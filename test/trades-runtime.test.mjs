import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  PERSON_ID,
  SOFTWARE,
  DOORS,
  GLAMA_TRADES,
  SOFTWARE_EXTRAS,
  SISTER_PRODUCTS_NOTE,
  TRADES_RUNTIME,
  TRADES_RUNTIME_CITE,
  TRADES_RUNTIME_DOWNLOAD,
  TRADES_RUNTIME_GITHUB,
  TRADES_RUNTIME_ID,
  TRADES_RUNTIME_LLMS,
  TRADES_RUNTIME_MCP,
  TRADES_RUNTIME_NAME,
  TRADES_RUNTIME_NOTE,
  TRADES_RUNTIME_ONE_LINE,
  TRADES_RUNTIME_OPENAPI,
  TRADES_RUNTIME_SKILL,
  TRADES_RUNTIME_SLUG,
  TRADES_RUNTIME_VERSION,
  indexableSection,
  isSoftwareExtra,
  sisterProductsCite,
  tradesRuntimeCite,
} from "../src/copy.js";
import { catalogFromLiveDoc, softwareIndexBody } from "../src/liveCatalog.js";
import { pageHtml, sectionPageHtml } from "../src/page.js";
import {
  AI_CLIENTS,
  AI_CLIENTS_SENTENCE,
  aiTxt,
  citeDoc,
  jsonLd,
  llmsTxt,
  robotsTxt,
  sitemapXml,
} from "../src/seo.js";

const FULL_CLIENT_MARKERS = [
  "ChatGPT",
  "Grok",
  "Venice",
  "Claude",
  "Cursor",
  "Glama",
  "Perplexity",
  "Copilot",
  "Gemini",
  "Mistral",
  "Meta",
  "Apple",
  "Amazon Q",
  "DuckAssist",
  "You.com",
  "Cohere",
];

describe("Trades-Runtime sister-product machine cite", () => {
  it("keeps trades-runtime as extras / sister product, never Softwares-tab", () => {
    assert.equal(TRADES_RUNTIME, "https://trades-runtime.vibelock.workers.dev");
    assert.equal(TRADES_RUNTIME_GITHUB, "https://github.com/AzielEliab/trades-runtime");
    assert.equal(TRADES_RUNTIME_VERSION, "0.3.4");
    assert.equal(isSoftwareExtra(TRADES_RUNTIME_SLUG, TRADES_RUNTIME_NAME), true);
    assert.equal(isSoftwareExtra("trades-runtime", "Trades-Runtime"), true);
    assert.ok(!SOFTWARE.some((s) => s.slug === TRADES_RUNTIME_SLUG || s.name === TRADES_RUNTIME_NAME));
    const extra = SOFTWARE_EXTRAS.find((s) => s.slug === TRADES_RUNTIME_SLUG);
    assert.ok(extra);
    assert.equal(extra.software_tab, false);
    assert.equal(extra.engine, false);
    assert.equal(extra.fraggate_engine, false);
    assert.equal(extra.fraggate_call, false);
    assert.equal(extra.live_backends, false);
    assert.equal(extra.public_softwares_cite, true);
    assert.equal(extra.href, TRADES_RUNTIME + "/");
    const sisters = sisterProductsCite();
    assert.equal(sisters.software_tab, false);
    assert.equal(sisters.fraggate_call, false);
    assert.equal(sisters.products[0].live_backends, false);
    assert.equal(sisters.products[0].fraggate_engine, false);
    assert.equal(sisters.products[0].public_softwares_cite, true);
    assert.equal(tradesRuntimeCite().public_softwares_cite, true);
    assert.equal(tradesRuntimeCite().mcp, TRADES_RUNTIME_MCP);
  });

  it("cites trades-runtime on llms.txt and mirrored ai.txt with the full AI client set", () => {
    const llms = llmsTxt();
    const ai = aiTxt();
    for (const body of [llms, ai]) {
      assert.ok(body.includes("## Sister products"));
      assert.ok(body.includes(SISTER_PRODUCTS_NOTE));
      assert.ok(body.includes("### " + TRADES_RUNTIME_NAME + " (" + TRADES_RUNTIME_SLUG + ")"));
      assert.ok(body.includes(TRADES_RUNTIME_ONE_LINE));
      assert.ok(body.includes(TRADES_RUNTIME_NOTE));
      assert.ok(body.includes("Worker: " + TRADES_RUNTIME + "/"));
      assert.ok(body.includes("GitHub: " + TRADES_RUNTIME_GITHUB));
      assert.ok(body.includes("Download: " + TRADES_RUNTIME_DOWNLOAD));
      assert.ok(body.includes("OpenAPI: " + TRADES_RUNTIME_OPENAPI));
      assert.ok(body.includes("MCP (read-only): POST " + TRADES_RUNTIME_MCP));
      assert.ok(body.includes("cite.json: " + TRADES_RUNTIME_CITE));
      assert.ok(body.includes("llms.txt: " + TRADES_RUNTIME_LLMS));
      assert.ok(body.includes("live_backends: false"));
      assert.ok(body.includes("fraggate_call: false"));
      assert.ok(body.includes("FragGate remains THE single Softwares door"));
      assert.ok(body.includes(AI_CLIENTS_SENTENCE));
      for (const client of FULL_CLIENT_MARKERS) {
        assert.ok(body.includes(client), "missing client " + client);
      }
    }
    assert.ok(llms.includes("GET " + TRADES_RUNTIME + "/  (sister product Trades-Runtime)"));
    assert.ok(llms.includes("POST " + TRADES_RUNTIME_MCP));
    assert.equal(AI_CLIENTS.length >= 16, true);
  });

  it("adds sister_products / trades_runtime to cite.json without inventing LIVE backends", () => {
    const cite = citeDoc();
    assert.equal(cite.person_id, PERSON_ID);
    assert.equal(cite.visible_1520, false);
    assert.equal(cite.github_trades_runtime, TRADES_RUNTIME_GITHUB);
    assert.equal(cite.trades_runtime_slug, TRADES_RUNTIME_SLUG);
    assert.equal(cite.trades_runtime_mcp, TRADES_RUNTIME_MCP);
    assert.equal(cite.trades_runtime.live_backends, false);
    assert.equal(cite.trades_runtime.fraggate_engine, false);
    assert.equal(cite.trades_runtime.fraggate_call, false);
    assert.equal(cite.trades_runtime.hosted_company_os, false);
    assert.equal(cite.trades_runtime.public_softwares_cite, true);
    assert.equal(cite.sister_products.fraggate_call, false);
    assert.equal(cite.sister_products.products[0].slug, TRADES_RUNTIME_SLUG);
    assert.ok(!cite.software_names.some((s) => s.name === TRADES_RUNTIME_NAME));
  });

  it("sitemaps trades URLs and keeps Growth-ON Allow for GPTBot / Google-Extended", () => {
    const map = sitemapXml();
    for (const loc of [
      TRADES_RUNTIME + "/",
      TRADES_RUNTIME_DOWNLOAD,
      TRADES_RUNTIME_OPENAPI,
      TRADES_RUNTIME_MCP,
      TRADES_RUNTIME_CITE,
      TRADES_RUNTIME_LLMS,
      TRADES_RUNTIME_SKILL,
      TRADES_RUNTIME_GITHUB,
    ]) {
      assert.ok(map.includes("<loc>" + loc + "</loc>"), loc);
    }
    const robots = robotsTxt();
    const ai = aiTxt();
    assert.ok(robots.includes("User-agent: GPTBot"));
    assert.ok(robots.includes("User-agent: Google-Extended"));
    assert.doesNotMatch(robots, /User-agent: GPTBot[\s\S]*?Disallow:/);
    assert.doesNotMatch(robots, /User-agent: Google-Extended[\s\S]*?Disallow:/);
    assert.doesNotMatch(ai, /User-agent: GPTBot[\s\S]*?Disallow:/);
    assert.doesNotMatch(ai, /User-agent: Google-Extended[\s\S]*?Disallow:/);
    assert.ok(robots.includes("Allow: /"));
    assert.ok(ai.includes("Allow: /"));
  });

  it("JSON-LD cites Trades-Runtime as a sister SoftwareApplication, not a Softwares ItemList card", () => {
    const ld = jsonLd();
    const person = ld["@graph"].find((n) => n["@type"] === "Person");
    assert.equal(person["@id"], PERSON_ID);
    const trades = ld["@graph"].find((n) => n["@id"] === TRADES_RUNTIME_ID);
    assert.ok(trades);
    assert.equal(trades["@type"], "SoftwareApplication");
    assert.equal(trades.name, TRADES_RUNTIME_NAME);
    assert.equal(trades.softwareVersion, TRADES_RUNTIME_VERSION);
    assert.equal(trades.url, TRADES_RUNTIME + "/");
    assert.deepEqual(trades.author, { "@id": PERSON_ID });
    assert.equal(trades.isPartOf["@id"], "https://www.azieleliab.com/#website");
    assert.ok(trades.sameAs.includes(TRADES_RUNTIME_GITHUB));
    assert.ok(trades.description.includes("live_backends false"));
    assert.ok(trades.description.includes(AI_CLIENTS_SENTENCE));
    const catalogApps = ld["@graph"].filter(
      (n) => n["@type"] === "SoftwareApplication" && n.isPartOf && n.isPartOf["@id"] === "https://www.azieleliab.com/#software",
    );
    assert.ok(!catalogApps.some((n) => n.name === TRADES_RUNTIME_NAME));
    const list = ld["@graph"].find((n) => n["@type"] === "ItemList" && n.name === "Software");
    assert.ok(!list.itemListElement.some((item) => item.name === TRADES_RUNTIME_NAME));
    const collection = ld["@graph"].find((n) => n["@type"] === "CollectionPage");
    assert.ok(collection.relatedLink.includes(TRADES_RUNTIME + "/"));
    assert.ok(collection.relatedLink.includes(TRADES_RUNTIME_GITHUB));
  });

  it("Software tab HTML stays names-only and does not add visible 15:20 identity-lock copy", () => {
    const html = sectionPageHtml(indexableSection("/software"));
    const home = pageHtml();
    assert.doesNotMatch(html, /class="soft-name">Trades-Runtime</);
    const visibleHome = (home.split("<body>")[1] || "").split("<script type=\"application/ld+json\">")[0];
    const visibleSoft = (html.split("<body>")[1] || "").split("<script type=\"application/ld+json\">")[0];
    assert.doesNotMatch(visibleHome, /1 Chronicles 15:20/);
    assert.doesNotMatch(visibleSoft, /1 Chronicles 15:20/);
    assert.doesNotMatch(visibleHome, /15:20/);
    assert.doesNotMatch(visibleSoft, /15:20/);
    assert.ok(visibleHome.includes("You don’t get to know me."));
  });

  it("exposes trades-runtime on /v1/software extras + sister_products, never products[]", () => {
    const body = softwareIndexBody();
    assert.ok(!body.products.some((s) => s.slug === TRADES_RUNTIME_SLUG));
    const extra = body.extras.find((s) => s.slug === TRADES_RUNTIME_SLUG);
    assert.ok(extra);
    assert.equal(extra.software_tab, false);
    assert.equal(extra.url, TRADES_RUNTIME + "/");
    assert.equal(extra.github, TRADES_RUNTIME_GITHUB);
    assert.equal(extra.download, TRADES_RUNTIME_DOWNLOAD);
    assert.equal(extra.live_backends, false);
    assert.equal(extra.fraggate_call, false);
    assert.equal(extra.public_softwares_cite, true);
    assert.equal(body.softwares_ssot.field, "version");
    assert.equal(body.softwares_ssot.live, "https://aziel-runtime.vibelock.workers.dev/v1/software");
    assert.equal(body.softwares_ssot.frozen, "2.0.0-rc1");
    assert.equal(body.peacelock.runtime, "local-only");
    assert.equal(body.peacelock.github, "https://github.com/AzielEliab/peacelock");
    assert.equal(body.sister_products.products[0].public_softwares_cite, true);
    assert.equal(body.sister_products.products[0].slug, TRADES_RUNTIME_SLUG);
    assert.equal(body.sister_products.fraggate_engine, false);

    const fromLive = catalogFromLiveDoc({
      products: [{ slug: "azai", name: "AZAI", worker_home: "https://azai-download-tracker.vibelock.workers.dev/" }],
      sister_products: {
        products: [
          {
            slug: TRADES_RUNTIME_SLUG,
            name: TRADES_RUNTIME_NAME,
            worker: TRADES_RUNTIME,
            github: TRADES_RUNTIME_GITHUB,
            live_backends: false,
            fraggate_call: false,
          },
        ],
      },
    });
    assert.ok(!fromLive.products.some((s) => s.slug === TRADES_RUNTIME_SLUG));
    const liveExtra = fromLive.extras.find((s) => s.slug === TRADES_RUNTIME_SLUG);
    assert.ok(liveExtra);
    assert.equal(liveExtra.href, TRADES_RUNTIME + "/");
    assert.equal(liveExtra.live_backends, false);
    assert.equal(liveExtra.public_softwares_cite, true);
  });

  it("lists Trades-Runtime on /doors after Runtime, linking the giveaway Worker", () => {
    const labels = DOORS.map((d) => d.label);
    const runtime = labels.indexOf("Runtime");
    const trades = labels.indexOf(TRADES_RUNTIME_NAME);
    assert.equal(trades, runtime + 1);
    assert.equal(labels[trades + 1], "X @AzielEliab");
    const door = DOORS[trades];
    assert.equal(door.href, TRADES_RUNTIME + "/");
    assert.equal(door.also.href, GLAMA_TRADES);
    assert.equal(door.also.label, GLAMA_TRADES);
    const section = indexableSection("/doors");
    assert.match(section.description, /Runtime, Trades-Runtime, X @AzielEliab/);
    const html = sectionPageHtml(section);
    assert.ok(html.includes(">Trades-Runtime<"));
    assert.ok(html.includes('href="' + TRADES_RUNTIME + '/"'));
    assert.ok(html.includes('href="' + GLAMA_TRADES + '"'));
    assert.equal(html.includes('class="soft-name">Trades-Runtime'), false);
    assert.equal(tradesRuntimeCite().version, "0.3.4");
    assert.equal(tradesRuntimeCite().live_backends, false);
    assert.equal(tradesRuntimeCite().fraggate_call, false);
    assert.equal(tradesRuntimeCite().software_tab, false);
  });
});
