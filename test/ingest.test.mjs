import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";
import { ingestHtml, pageHtml, receiptsHtml, spineNav, verifyHtml, whoHtml } from "../src/page.js";
import { aiTxt, citeDoc, llmsTxt, robotsTxt, sitemapXml } from "../src/seo.js";
import {
  AUTHOR,
  CANON_ORIGIN,
  PERSON_ID,
  RECEIPTS_HREF,
  RECEIPTS_TITLE,
  WEBSITE_ID,
} from "../src/copy.js";
import { VISIBLE_LOCK_LINE } from "../src/identity.js";
import {
  CITE_DONT_MERGE,
  ENOUGH,
  GROWTH,
  INGEST_BYTES_HREF,
  INGEST_HREF,
  INGEST_SPEC,
  NOLIE_LAW,
  NOLIE_SPEC,
  NOT_ENOUGH,
  REEXPAND_HREF,
  REEXPAND_LAW,
  REEXPAND_SPEC,
  SURVIVAL_LAW,
  SURVIVAL_SPEC,
  TRAINING_RESIDUE,
  VERIFY_HREF,
  canonicalPageBytes,
  ingestRecord,
  pageBytesSha256,
  reexpandDoc,
  tipString,
  verifyPastedHash,
} from "../src/ingest.js";
import { GENESIS_PREVIOUS_HASH, hostReceipts, verifyChain } from "../src/receipts.js";

const TIP =
  "INGEST-AS-RECEIPT-1.0 sha256:c71e8c07d838b148fc8ec5f18c7e261d53566ea8a090ca81445e3483586082a5 https://www.azieleliab.com/";

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

async function fetchPath(path, init = {}, env) {
  const request = new Request("https://www.azieleliab.com" + path, init);
  return worker.fetch(request, env ? isolatedEnv(env) : isolatedEnv());
}

function visible(html) {
  return html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, "").replace(/<style>[\s\S]*?<\/style>/g, "");
}

const read = (rel) => readFileSync(new URL("../" + rel, import.meta.url), "utf8");

describe("INGEST-AS-RECEIPT-1.0", () => {
  it("hashes canonical page bytes and publishes one tip string", () => {
    const bytes = canonicalPageBytes();
    const hash = pageBytesSha256();
    assert.equal(createHash("sha256").update(bytes, "utf8").digest("hex"), hash);
    assert.match(hash, /^[0-9a-f]{64}$/);
    assert.equal(tipString(), INGEST_SPEC + " sha256:" + hash + " " + CANON_ORIGIN + "/");
    assert.equal(tipString(), TIP);
    assert.equal(ingestRecord().tip, TIP);
    assert.ok(bytes.includes(PERSON_ID));
    assert.ok(bytes.includes(WEBSITE_ID));
    assert.ok(bytes.includes(CANON_ORIGIN + "/"));
    assert.ok(bytes.includes(GENESIS_PREVIOUS_HASH));
    assert.ok(bytes.includes(CITE_DONT_MERGE));
    assert.ok(!bytes.includes(hash));
    assert.ok(!bytes.includes(SURVIVAL_SPEC));
    assert.ok(!bytes.includes(NOLIE_SPEC));
  });

  it("keeps the same tip in HTML, cite, llms, and GitHub", () => {
    const home = visible(pageHtml());
    const ingest = visible(ingestHtml());
    const cite = citeDoc();
    const llms = llmsTxt();
    assert.ok(home.includes(TIP));
    assert.ok(ingest.includes(TIP));
    assert.equal(cite.tip, TIP);
    assert.equal(cite.ingest_as_receipt.tip, TIP);
    assert.equal(cite.cite_dont_merge, CITE_DONT_MERGE);
    assert.ok(llms.includes(TIP));
    assert.ok(llms.includes(CITE_DONT_MERGE));
    for (const [name, text] of [
      ["README.md", read("README.md")],
      ["CITATION.cff", read("CITATION.cff")],
      ["docs/github-seo.md", read("docs/github-seo.md")],
      ["SKILL.md", read("SKILL.md")],
    ]) {
      assert.ok(text.includes(TIP), name);
    }
  });

  it("verifies paste-hash yes/no against the published tip", () => {
    const hash = pageBytesSha256();
    assert.equal(verifyPastedHash(hash).yes, "yes");
    assert.equal(verifyPastedHash(TIP).yes, "yes");
    assert.equal(verifyPastedHash("sha256:" + hash).yes, "yes");
    assert.equal(verifyPastedHash("deadbeef").yes, "no");
    assert.equal(verifyPastedHash("").yes, "no");
    assert.equal(verifyHtml(verifyPastedHash(hash)).includes(">yes<"), true);
    assert.equal(visible(verifyHtml(verifyPastedHash("nope"))).includes("no"), true);
  });
});

describe("RE-EXPAND-FROM-ARCHIVE-1.0", () => {
  it("requires original bytes and prev-hash, not mesh from index", async () => {
    const doc = reexpandDoc();
    assert.equal(doc.spec, REEXPAND_SPEC);
    assert.equal(doc.reexpand, false);
    assert.equal(doc.crawlers_reexpand, false);
    assert.equal(doc.mesh_from_index, false);
    assert.equal(doc.bytes_survive, true);
    assert.equal(doc.summaries_survive, false);
    assert.equal(doc.training_residue, TRAINING_RESIDUE);
    assert.match(doc.after, /previous_hash/);
    assert.match(doc.after, /local node/);
    assert.deepEqual(doc.enough, ENOUGH);
    assert.deepEqual(doc.not_enough, NOT_ENOUGH);
    assert.ok(ENOUGH.some((row) => /previous_hash/.test(row)));
    assert.ok(ENOUGH.some((row) => /local node/.test(row)));
    assert.ok(NOT_ENOUGH.includes("Mesh from index"));
    assert.ok(NOT_ENOUGH.includes("Crawler harvest / crawler re-expand"));
    assert.ok(NOT_ENOUGH.includes("Training residue"));
    assert.ok(REEXPAND_LAW.some((line) => /Bytes survive/.test(line)));
    assert.equal(await verifyChain(await hostReceipts()), true);
  });
});

describe("Growth-ON Allow and public doors", () => {
  it("keeps the Receipts tab and Allows ingest / verify / re-expand", async () => {
    assert.ok(spineNav("receipts").includes(">" + RECEIPTS_TITLE + "<"));
    assert.ok(pageHtml().includes('href="' + RECEIPTS_HREF + '"'));
    const robots = robotsTxt();
    const ai = aiTxt();
    const map = sitemapXml();
    for (const path of ["/receipts", "/receipts/", "/ingest", "/ingest/", "/ingest.txt", "/verify", "/verify/", "/reexpand", "/reexpand/"]) {
      assert.ok(robots.includes("Allow: " + path), "robots " + path);
      if (path !== "/ingest.txt" && !path.endsWith("/")) {
        assert.ok(ai.includes("Allow: " + path) || ai.includes("Allow: /"), "ai " + path);
      }
    }
    assert.ok(ai.includes("Allow: /receipts"));
    assert.ok(ai.includes("Allow: /ingest"));
    assert.ok(ai.includes("Allow: /verify"));
    assert.ok(ai.includes("Allow: /reexpand"));
    assert.equal(GROWTH, "on");
    assert.doesNotMatch(robots, /Disallow:\s*\/?$/m);
    for (const href of [RECEIPTS_HREF, INGEST_HREF, INGEST_BYTES_HREF, VERIFY_HREF, REEXPAND_HREF]) {
      assert.ok(map.includes("<loc>" + href + "</loc>"), href);
    }
  });

  it("serves ingest, bytes, verify yes/no, and re-expand refuse", async () => {
    const ingest = await fetchPath("/ingest");
    assert.equal(ingest.status, 200);
    const ingestBody = visible(await ingest.text());
    assert.ok(ingestBody.includes(TIP));
    assert.ok(ingestBody.includes("Enough"));
    assert.ok(ingestBody.includes("Not enough"));
    for (const row of ENOUGH) assert.ok(ingestBody.includes(row), row);
    for (const row of NOT_ENOUGH) assert.ok(ingestBody.includes(row), row);
    assert.doesNotMatch(ingestBody, /1 Chronicles 15:20/);

    const bytes = await fetchPath("/ingest.txt");
    assert.equal(bytes.status, 200);
    assert.equal(await bytes.text(), canonicalPageBytes());

    const yes = await fetchPath("/verify?hash=" + pageBytesSha256());
    assert.equal(yes.status, 200);
    assert.ok(visible(await yes.text()).includes("yes"));

    const no = await fetchPath("/verify?hash=ffff");
    assert.ok(visible(await no.text()).includes("no"));

    const jsonYes = await fetchPath("/verify?hash=" + pageBytesSha256() + "&format=json");
    const payload = await jsonYes.json();
    assert.equal(payload.yes, "yes");
    assert.equal(payload.published_tip, TIP);
    assert.equal(payload.author, AUTHOR);

    const reexpand = await fetchPath("/reexpand");
    const law = await reexpand.json();
    assert.equal(law.reexpand, false);
    assert.equal(law.crawlers_reexpand, false);
    assert.equal(law.mesh_from_index, false);
    assert.equal(law.training_residue, "rumor");
  });

  it("does not render 15:20 identity-lock chrome on first-screen pages", async () => {
    const pages = [pageHtml(), ingestHtml(), verifyHtml(verifyPastedHash("")), await receiptsHtml()];
    for (const html of pages) {
      const shown = visible(html);
      assert.doesNotMatch(shown, /1 Chronicles 15:20/);
      assert.ok(!shown.includes(VISIBLE_LOCK_LINE));
    }
    assert.ok(!visible(whoHtml()).includes(VISIBLE_LOCK_LINE));
  });
});

describe("CROSS-NETWORK-SURVIVAL-1.0 and NO-LIE / NO-REWRITE chrome", () => {
  it("cites both laws on first-screen, cite, llms, and ai — outside hashed tip bytes", async () => {
    assert.equal(pageBytesSha256(), "c71e8c07d838b148fc8ec5f18c7e261d53566ea8a090ca81445e3483586082a5");
    assert.equal(tipString(), TIP);
    const bytes = canonicalPageBytes();
    assert.ok(!bytes.includes(SURVIVAL_SPEC));
    assert.ok(!bytes.includes(NOLIE_SPEC));
    assert.ok(!bytes.includes("independent shelves"));
    assert.ok(!bytes.includes("rewrite key"));

    const home = visible(pageHtml());
    const ingest = visible(ingestHtml());
    const cite = citeDoc();
    const llms = llmsTxt();
    const ai = aiTxt();
    for (const [name, text] of [
      ["home", home],
      ["ingest", ingest],
      ["llms", llms],
      ["ai", ai],
    ]) {
      assert.ok(text.includes(SURVIVAL_SPEC), name + " survival spec");
      assert.ok(text.includes(NOLIE_SPEC), name + " nolie spec");
      for (const line of SURVIVAL_LAW) assert.ok(text.includes(line), name + " " + line);
      for (const line of NOLIE_LAW) assert.ok(text.includes(line), name + " " + line);
    }
    assert.doesNotMatch(home, /1 Chronicles 15:20/);
    assert.doesNotMatch(ingest, /1 Chronicles 15:20/);
    assert.equal(cite.cross_network_survival.spec, SURVIVAL_SPEC);
    assert.equal(cite.no_lie_no_rewrite.spec, NOLIE_SPEC);
    assert.equal(cite.ingest_as_receipt.cross_network_survival.spec, SURVIVAL_SPEC);
    assert.equal(cite.cross_network_survival.software_tab, false);
    assert.equal(cite.no_lie_no_rewrite.rewrite_key, false);
    assert.equal(cite.no_lie_no_rewrite.network_never_lies, true);
    assert.deepEqual(cite.cross_network_survival.law, SURVIVAL_LAW);
    assert.deepEqual(cite.no_lie_no_rewrite.law, NOLIE_LAW);

    const servedCite = await (await fetchPath("/cite.json")).json();
    assert.equal(servedCite.tip, TIP);
    assert.equal(servedCite.cross_network_survival.spec, SURVIVAL_SPEC);
    assert.equal(servedCite.no_lie_no_rewrite.spec, NOLIE_SPEC);
    const servedBytes = await (await fetchPath("/ingest.txt")).text();
    assert.equal(servedBytes, bytes);
    assert.equal(createHash("sha256").update(servedBytes, "utf8").digest("hex"), pageBytesSha256());
  });
});
