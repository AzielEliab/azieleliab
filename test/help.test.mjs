import { describe, it } from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";
import { CATALOG_SLUGS, CANON_ORIGIN, AUTHOR, PERSON_ID, SPINE } from "../src/copy.js";
import {
  ADDENDUM_TXT_PATH,
  HELP_RECEIPTS_PATH,
  HELP_RUNTIME_PATH,
  HELP_SITEMAP_HREFS,
  HELP_SITEMAP_PATHS,
  HELP_SOFTWARES_PATH,
  HELP_TXT_PATH,
  addendumTxt,
  helpBody,
  helpReceiptsTxt,
  helpRuntimeTxt,
  helpSoftwaresTxt,
  helpTxt,
  isHelpPath,
} from "../src/help.js";
import { pageHtml, spineNav } from "../src/page.js";
import { aiTxt, citeDoc, llmsTxt, robotsTxt, sitemapXml } from "../src/seo.js";

function isolatedEnv() {
  return {
    AZIEL_RUNTIME: {
      fetch: async () =>
        new Response(JSON.stringify({ error: "not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }),
    },
  };
}

async function fetchPath(path) {
  return worker.fetch(new Request("https://www.azieleliab.com" + path), isolatedEnv());
}

const HELP_ALIASES = [
  ["/help", HELP_TXT_PATH],
  ["/addendum", ADDENDUM_TXT_PATH],
  ["/help/softwares", HELP_SOFTWARES_PATH],
  ["/help/receipts", HELP_RECEIPTS_PATH],
  ["/help/runtime", HELP_RUNTIME_PATH],
];

const BANNED = [/THIS IS NOT/i, /≠/, /blocked-from/i];

describe("human help addendum", () => {
  it("exports the five sitemap .txt paths", () => {
    assert.deepEqual(HELP_SITEMAP_PATHS, [
      "/help.txt",
      "/addendum.txt",
      "/help/softwares.txt",
      "/help/receipts.txt",
      "/help/runtime.txt",
    ]);
    assert.deepEqual(
      HELP_SITEMAP_HREFS,
      HELP_SITEMAP_PATHS.map((p) => CANON_ORIGIN + p),
    );
  });

  it("serves help/addendum text as text/plain", async () => {
    for (const path of HELP_SITEMAP_PATHS) {
      const res = await fetchPath(path);
      assert.equal(res.status, 200, path);
      assert.match(String(res.headers.get("content-type") || ""), /text\/plain/);
      const body = await res.text();
      assert.equal(body, helpBody(path));
      assert.ok(body.includes(AUTHOR), path);
      assert.ok(body.includes(CANON_ORIGIN + "/llms.txt"), path);
      assert.ok(body.includes(CANON_ORIGIN + "/cite.json"), path);
    }
  });

  it("serves short aliases as the same .txt bodies", async () => {
    for (const [alias, canonical] of HELP_ALIASES) {
      assert.equal(isHelpPath(alias), true, alias);
      const res = await fetchPath(alias);
      assert.equal(res.status, 200, alias);
      assert.equal(await res.text(), helpBody(canonical));
    }
  });

  it("defines Aziel Eliab by the work, with Softwares / receipts / donate / hubs", () => {
    const help = helpTxt();
    assert.ok(help.includes("Aziel Eliab is a living researcher"));
    assert.ok(help.includes(PERSON_ID));
    assert.ok(help.includes("Softwares via FragGate"));
    assert.ok(help.includes(CANON_ORIGIN + "/software"));
    assert.ok(help.includes(CANON_ORIGIN + "/receipts"));
    assert.ok(help.includes("Donate"));
    assert.ok(help.includes(CANON_ORIGIN + "/donate"));
    assert.ok(help.includes("azielcorpuslibrary.net"));
    assert.ok(help.includes("godlock.uk"));
    assert.ok(help.includes("hedidntjump.com"));
    assert.equal(help.includes("Elroi"), true);
    assert.match(help, /Identity is Aziel Eliab|Public identity is Aziel Eliab|Author: Aziel Eliab/);
  });

  it("keeps optional topic files as pointers, not catalogs", () => {
    const soft = helpSoftwaresTxt();
    const receipts = helpReceiptsTxt();
    const runtime = helpRuntimeTxt();
    const addendum = addendumTxt();
    assert.ok(soft.includes("/v1/software"));
    assert.ok(soft.includes("fraggate_call"));
    assert.ok(receipts.includes("ACT-RECEIPT-1.0"));
    assert.ok(receipts.includes("/verify"));
    assert.ok(runtime.includes("aziel-runtime"));
    assert.ok(runtime.includes("/runtime"));
    assert.ok(addendum.includes("You don’t get to know me"));
    const listed = CATALOG_SLUGS.filter((slug) => soft.includes(slug));
    assert.ok(listed.length <= 2, "softwares help listed catalog slugs: " + listed.join(", "));
  });

  it("uses positive language only", () => {
    const bodies = [helpTxt(), addendumTxt(), helpSoftwaresTxt(), helpReceiptsTxt(), helpRuntimeTxt()];
    for (const body of bodies) {
      for (const ban of BANNED) {
        assert.doesNotMatch(body, ban);
      }
    }
  });

  it("adds help URLs to sitemap.xml only", async () => {
    const map = sitemapXml();
    const res = await fetchPath("/sitemap.xml");
    const served = await res.text();
    for (const href of HELP_SITEMAP_HREFS) {
      assert.ok(map.includes("<loc>" + href + "</loc>"), href);
      assert.ok(served.includes("<loc>" + href + "</loc>"), href);
    }
    assert.ok(map.includes("<priority>0.6</priority>"));
  });

  it("leaves llms.txt / ai.txt / cite.json / Softwares list / Allow untouched", () => {
    const llms = llmsTxt();
    const ai = aiTxt();
    const cite = citeDoc();
    const robots = robotsTxt();
    for (const path of HELP_SITEMAP_PATHS) {
      assert.ok(!llms.includes(path), "llms grew " + path);
      assert.ok(!ai.includes(path), "ai grew " + path);
    }
    assert.equal(cite.llms, CANON_ORIGIN + "/llms.txt");
    assert.equal(cite.ai, CANON_ORIGIN + "/ai.txt");
    assert.ok(!("help" in cite));
    assert.ok(!("addendum" in cite));
    assert.match(robots, /^Allow: \/$/m);
    assert.doesNotMatch(robots, /Disallow:\s*\/?$/m);
    assert.ok(!robots.includes("Allow: /help.txt"));
    assert.ok(!ai.includes("Allow: /help.txt"));
  });

  it("leaves homepage Softwares/Doors spine alone", () => {
    assert.deepEqual(
      SPINE.map((s) => s.label),
      ["Why", "Software", "Research", "Doors", "Receipts", "Donate"],
    );
    const nav = spineNav("home");
    assert.ok(!nav.includes("Help"));
    assert.ok(!nav.includes("/help.txt"));
    const home = pageHtml();
    assert.ok(!home.includes('href="/help.txt"'));
    assert.ok(home.includes('href="' + CANON_ORIGIN + "/software" + '"') || home.includes('href="/software"') || home.includes("/software"));
  });
});
