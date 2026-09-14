import { describe, it } from "node:test";
import assert from "node:assert/strict";
import worker, { handleRequest } from "../src/index.js";
import { pageHtml, receiptsHtml, spineNav } from "../src/page.js";
import {
  AUTHOR,
  CANON_ORIGIN,
  DONATE_HREF,
  GODLOCK,
  HEDIDNTJUMP,
  LIBRARY,
  PERSON_ID,
  RECEIPTS_DESCRIPTION,
  RECEIPTS_HREF,
  RECEIPTS_PATH,
  RECEIPTS_TITLE,
  SOFTWARE_HREF,
} from "../src/copy.js";
import {
  GENESIS_FIELDS,
  GENESIS_PREVIOUS_HASH,
  RECEIPT_LATTICE,
  RECEIPT_SPEC,
  appendReceipt,
  canonicalJson,
  canonicalPayload,
  entryHash,
  eventMetadataSentence,
  genesisReceipt,
  hostReceipts,
  newestFirst,
  receiptsDatasetJsonLd,
  verifyChain,
} from "../src/receipts.js";

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

describe("ACT-RECEIPT-1.0 chain", () => {
  it("hashes the canonical payload including previous_hash and verifies the host chain", async () => {
    const genesis = await genesisReceipt();
    assert.equal(genesis.spec, RECEIPT_SPEC);
    assert.equal(genesis.previous_hash, GENESIS_PREVIOUS_HASH);
    assert.equal(genesis.request, GENESIS_FIELDS.request);
    assert.equal(genesis.output, GENESIS_FIELDS.output);
    assert.equal(genesis.event.id, "AZACT-GENESIS");
    assert.equal(await entryHash(genesis), genesis.entry_hash);
    assert.match(genesis.entry_hash, /^[0-9a-f]{64}$/);
    assert.equal(canonicalJson(canonicalPayload(genesis)).includes("previous_hash"), true);
    assert.equal(await verifyChain(await hostReceipts()), true);

    const chained = await appendReceipt([genesis], {
      request: "Show this host’s Receipts door.",
      output: "Receipts page answered with the verified chain.",
      event: { at: "2026-09-13T00:00:01.000Z", kind: "door.read", id: "AZACT-READ-1" },
    });
    assert.equal(chained[1].previous_hash, genesis.entry_hash);
    assert.equal(await verifyChain(chained), true);
    assert.equal(newestFirst(chained)[0].entry_hash, chained[1].entry_hash);

    const tampered = { ...chained[1], output: "altered" };
    assert.equal(await verifyChain([genesis, tampered]), false);
  });

  it("does not store user, IP, or geo on the payload", async () => {
    const payload = canonicalJson(canonicalPayload(await genesisReceipt()));
    assert.doesNotMatch(payload, /"user"|["']ip["']|"geo"|latitude|longitude|forwarded|x-forwarded/i);
  });
});

describe("Receipts tab and /receipts page", () => {
  it("puts Receipts on the spine and 200s /receipts with the four fields and lattice", async () => {
    assert.equal(RECEIPTS_PATH, "/receipts");
    assert.equal(RECEIPTS_HREF, CANON_ORIGIN + "/receipts");
    const nav = spineNav("receipts");
    assert.ok(nav.includes(">" + RECEIPTS_TITLE + "<"));
    assert.ok(nav.includes('href="' + RECEIPTS_HREF + '"'));
    assert.ok(nav.includes('aria-current="page"'));

    const home = pageHtml();
    const homeBody = (home.split("<body>")[1] || "");
    assert.ok(home.includes(">" + RECEIPTS_TITLE + "<"));
    assert.ok(home.includes('href="' + RECEIPTS_HREF + '"'));
    assert.ok(home.includes('href="' + SOFTWARE_HREF + '"'));
    assert.ok(home.includes('href="' + DONATE_HREF + '"'));
    assert.ok(home.includes("Try on Glama"));
    assert.ok(!homeBody.includes("<h2>Ingest as receipt</h2>"));
    assert.ok(!homeBody.includes('id="first-screen"'));
    assert.ok(!homeBody.includes('class="card lead first-screen"'));
    assert.ok(home.includes('name="aziel-ingest-tip"'));
    assert.match(home, /<nav class="spine"[\s\S]*?<\/nav>\s*<article class="card lead">/);
    assert.doesNotMatch(visible(home), /1 Chronicles 15:20/);

    for (const path of ["/receipts", "/receipts/"]) {
      const res = await fetchPath(path);
      assert.equal(res.status, 200, path);
      assert.match(res.headers.get("content-type"), /text\/html/, path);
      const body = await res.text();
      const shown = visible(body);
      assert.ok(body.includes("<title>" + RECEIPTS_TITLE + " — " + AUTHOR + "</title>"), path);
      assert.ok(body.includes('rel="canonical" href="' + RECEIPTS_HREF + '"'), path);
      assert.ok(body.includes("<h1>" + RECEIPTS_TITLE + "</h1>"), path);
      assert.ok(shown.includes(RECEIPTS_DESCRIPTION), path);
      assert.ok(shown.includes("<h2>Ingest as receipt</h2>"), path);
      assert.ok(shown.includes('id="first-screen"'), path);
      assert.ok(shown.includes("INGEST-AS-RECEIPT-1.0"), path);
      assert.ok(shown.includes("Enough"), path);
      assert.ok(shown.includes("Not enough"), path);
      assert.ok(shown.includes("chain verifies"), path);
      assert.ok(shown.includes(RECEIPT_SPEC), path);
      const genesis = await genesisReceipt();
      assert.ok(shown.includes(genesis.entry_hash), path);
      assert.ok(shown.includes(genesis.request), path);
      assert.ok(shown.includes(genesis.output), path);
      assert.ok(shown.includes(eventMetadataSentence(genesis)), path);
      assert.ok(shown.includes('href="' + LIBRARY + "/receipts" + '"'), path);
      assert.ok(shown.includes('href="' + GODLOCK + "/receipts" + '"'), path);
      assert.ok(shown.includes('href="' + HEDIDNTJUMP + "/receipts" + '"'), path);
      assert.equal(RECEIPT_LATTICE[0].href, "https://www.azielcorpuslibrary.net/receipts");
      assert.ok(body.includes('"@type":"Dataset"'), path);
      assert.ok(body.includes(PERSON_ID), path);
      assert.ok(body.includes(RECEIPTS_HREF + "#act-receipt"), path);
      assert.doesNotMatch(shown, /1 Chronicles 15:20/, path);
      assert.ok(!shown.includes("<h2>Mission</h2>"), path);
      assert.ok(!shown.includes("<h2>Why</h2>"), path);
      assert.ok(!shown.includes('class="soft-name"'), path);
      assert.ok(!shown.includes('class="rails"'), path);
      assert.ok(shown.includes("Try on Glama"), path);
    }

    const head = await fetchPath("/receipts", { method: "HEAD" });
    assert.equal(head.status, 200);
    const post = await fetchPath("/receipts", { method: "POST" });
    assert.equal(post.status, 405);
    const apex = await handleRequest(new Request("https://azieleliab.com/receipts"));
    assert.equal(apex.status, 301);
    assert.equal(apex.headers.get("location"), CANON_ORIGIN + "/receipts");
  });

  it("keeps Why / Software / Research / Doors / Donate pages unchanged beside the new spine tab", async () => {
    const why = await fetchPath("/why");
    const software = await fetchPath("/software");
    const donate = await fetchPath("/donate?v=png");
    assert.equal(why.status, 200);
    assert.equal(software.status, 200);
    assert.equal(donate.status, 200);
    const whyBody = await why.text();
    const softwareBody = await software.text();
    const donateBody = await donate.text();
    assert.ok(whyBody.includes("<h2>Why</h2>"));
    assert.ok(softwareBody.includes('class="soft-name"'));
    assert.ok(donateBody.includes('class="rails"'));
    assert.ok(whyBody.includes('href="' + RECEIPTS_HREF + '"'));
    assert.ok(softwareBody.includes('href="' + RECEIPTS_HREF + '"'));
    assert.ok(donateBody.includes('href="' + RECEIPTS_HREF + '"'));
  });

  it("embeds a Dataset JSON-LD that points at Person #aziel", async () => {
    const chain = await hostReceipts();
    const doc = receiptsDatasetJsonLd(chain);
    assert.equal(doc["@type"], "Dataset");
    assert.equal(doc.creator["@id"], PERSON_ID);
    assert.equal(doc.about["@id"], PERSON_ID);
    assert.equal(doc.identifier, RECEIPT_SPEC);
    const html = await receiptsHtml();
    assert.ok(html.includes(JSON.stringify(doc)));
  });
});
