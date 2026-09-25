import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { handleRequest } from "../src/index.js";
import { RUNTIME_GIT_SHA, RUNTIME_GIT_SHORT, RUNTIME_VERSION } from "../src/copy.js";
import { VIEW_KEY, memoryKv } from "../src/views.js";
import {
  OUTLET_ID,
  SOT_AUTHORITY,
  SOT_KV_KEY,
  frozenSot,
  projectSot,
  signSotSync,
  verifyOutletReceipts,
} from "../src/sotOutlet.js";

const LIVE_SHA = "0123456789abcdef0123456789abcdef01234567";
const LIVE_SHORT = "0123456";

function kv(seed = 0) {
  const store = memoryKv(seed);
  const writes = [];
  const put = store.put.bind(store);
  store.put = async (key, value, opts) => {
    writes.push(key);
    return put(key, value, opts);
  };
  store.writes = () => writes.slice();
  return store;
}

function liveDoc(extra = {}) {
  return {
    ok: true,
    author: "Aziel Eliab",
    identity: "Aziel Eliab",
    version: RUNTIME_VERSION,
    git_sha: LIVE_SHA,
    count: 42,
    products: [
      {
        slug: "azai",
        name: "AZAI",
        one_line: "Run a local OpenAI-compatible stack or a hosted Lamb ethics check.",
        worker_home: "https://azai-download-tracker.vibelock.workers.dev/",
      },
    ],
    ...extra,
  };
}

function envWith(doc, views, fail) {
  return {
    VIEWS: views,
    AZIEL_RUNTIME: {
      fetch: async () => {
        if (fail) throw new Error("down");
        if (!doc) return new Response("no", { status: 503 });
        return new Response(JSON.stringify(doc), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      },
    },
  };
}

async function post(env, body) {
  return handleRequest(
    new Request("https://www.azieleliab.com/v1/mesh/outlet/sync", {
      method: "POST",
      headers: { "content-type": "application/json", "user-agent": "Mozilla/5.0" },
      body: JSON.stringify(body),
    }),
    env,
  );
}

async function get(env, path, ua = "Mozilla/5.0") {
  return handleRequest(new Request("https://www.azieleliab.com" + path, { headers: { "user-agent": ua } }), env);
}

describe("SoT outlet hub-azieleliab", () => {
  it("registers the pull/push contract without inventing version_id", async () => {
    const res = await get({}, "/v1/mesh/outlet");
    const doc = await res.json();
    assert.equal(res.status, 200);
    assert.equal(doc.outlet_id, OUTLET_ID);
    assert.equal(doc.contract, "SOT-OUTLET-1.0");
    assert.equal(doc.author, "Aziel Eliab");
    assert.equal(doc.identity, "Aziel Eliab");
    assert.equal(doc.authority, SOT_AUTHORITY);
    assert.equal(doc.pull.reads, SOT_AUTHORITY);
    assert.equal(doc.push.kind, "sot_sync");
    assert.equal(doc.frozen.version_id, null);
    assert.equal(doc.frozen.git_short, RUNTIME_GIT_SHORT);
    assert.equal(doc.status, "last-known");
    assert.match(doc.rules.version_id, /Never invented/);
    assert.match(doc.rules.software_rows, /does not add or remove/);
    assert.match(doc.rules.download_counters, /does not write/);
  });

  it("dry_run previews a live pull and confirm publishes cite surfaces", async () => {
    const views = kv(4);
    const env = envWith(liveDoc(), views);
    const preview = await post(env, { outlet_id: OUTLET_ID, dry_run: true });
    const dry = await preview.json();
    assert.equal(dry.applied, false);
    assert.equal(dry.would_apply, true);
    assert.equal(dry.receipt, null);
    assert.equal(dry.sot.git_sha, LIVE_SHA);
    assert.equal(dry.sot.version_id, null);
    assert.equal(dry.software_rows_changed, false);
    assert.equal(dry.download_counters_changed, false);
    assert.deepEqual(dry.ignored_fields, []);
    assert.equal(await views.get(VIEW_KEY), "4");
    assert.equal(views.writes().includes(SOT_KV_KEY), false);

    const before = await (await get(env, "/cite.json")).json();
    assert.equal(before.runtime_sot.git_sha, RUNTIME_GIT_SHA);
    assert.equal(before.runtime_sot.version_id, null);
    assert.equal(before.sot_outlet.outlet_id, OUTLET_ID);

    const beforeWrites = views.writes().slice();
    const confirmed = await post(env, { outlet_id: OUTLET_ID, confirm: true });
    const body = await confirmed.json();
    assert.equal(body.applied, true);
    assert.equal(body.status, "confirmed");
    assert.equal(body.sot.count, 42);
    assert.equal(body.sot.version_id, null);
    assert.equal(body.changed, true);
    assert.equal(body.receipt.event.kind, "sot.sync");
    assert.equal(body.receipt.spec, "ACT-RECEIPT-1.0");
    assert.equal(body.verified, true);
    assert.match(body.receipt.output, /version_id unexposed/);
    assert.match(body.receipt.output, /count 42/);
    assert.match(body.receipt.output, /Softwares rows unchanged/);
    assert.equal(await views.get(VIEW_KEY), "4");
    assert.deepEqual(views.writes().slice(beforeWrites.length), [SOT_KV_KEY]);

    const cite = await (await get(env, "/cite.json")).json();
    assert.equal(cite.runtime_git_sha, LIVE_SHA);
    assert.equal(cite.runtime_sot.git_short, LIVE_SHORT);
    assert.equal(cite.runtime_sot.version_id, null);
    assert.match(cite.runtime_sot.note, new RegExp("SoT LIVE: main " + LIVE_SHORT));
    assert.doesNotMatch(cite.runtime_sot.note, /version_id/);
    assert.equal(cite.sot_outlet.status, "confirmed");

    const llms = await (await get(env, "/llms.txt")).text();
    const ai = await (await get(env, "/ai.txt")).text();
    assert.match(llms, new RegExp("SoT LIVE: main " + LIVE_SHORT));
    assert.match(ai, new RegExp("SoT LIVE: main " + LIVE_SHORT));
    assert.match(llms, /\/v1\/mesh\/outlet\/sync/);
    assert.doesNotMatch(llms + ai, /105fa1ee/);

    const home = await (await get(env, "/")).text();
    assert.match(home, new RegExp("main " + LIVE_SHORT));
    assert.match(home, new RegExp('"git_sha":"' + LIVE_SHA + '"'));

    const graph = await (await get(env, "/graph.jsonld")).json();
    const runtime = graph["@graph"].find((node) => node["@id"] && String(node["@id"]).endsWith("/runtime#runtime"));
    assert.equal(runtime.git_sha, LIVE_SHA);
    assert.equal(runtime.softwareVersion, RUNTIME_VERSION);
    assert.equal(runtime.version_id, null);

    const catalog = await (await get(env, "/v1/software")).json();
    assert.equal(catalog.count, 1);
    assert.equal(catalog.products.length, 1);
    assert.equal(catalog.version_id, null);
    assert.ok(!catalog.products.some((row) => row.name === "Ask Jeeves"));

    const receipt = await (await get(env, "/v1/mesh/outlet/receipt")).json();
    assert.equal(receipt.chain_length, 1);
    assert.equal(receipt.verified, true);
    assert.equal(await verifyOutletReceipts([body.receipt]), true);
  });

  it("accepts a signed sot_sync only when it matches the live pull", async () => {
    const views = kv(2);
    const env = envWith(liveDoc(), views);
    const envelope = {
      v: "SOT-SYNC-1.0",
      kind: "sot_sync",
      outlet_id: OUTLET_ID,
      authority: SOT_AUTHORITY,
      sot: { version: RUNTIME_VERSION, git_sha: LIVE_SHA, count: 42, products: [{ slug: "invented" }] },
    };
    envelope.sig = await signSotSync(envelope);
    const res = await post(env, { outlet_id: OUTLET_ID, mode: "confirm", sot_sync: envelope });
    const doc = await res.json();
    assert.equal(doc.applied, true);
    assert.equal(doc.source, "push");
    assert.ok(doc.ignored_fields.includes("products"));
    assert.equal(doc.sot.version_id, null);
    assert.equal((await views.get(SOT_KV_KEY)) != null, true);
    assert.equal(await views.get(VIEW_KEY), "2");

    const forged = {
      v: "SOT-SYNC-1.0",
      kind: "sot_sync",
      outlet_id: OUTLET_ID,
      authority: SOT_AUTHORITY,
      sot: { version: RUNTIME_VERSION, git_sha: LIVE_SHA, count: 42, version_id: "105fa1ee" },
    };
    forged.sig = await signSotSync(forged);
    const mismatch = await post(env, { outlet_id: OUTLET_ID, confirm: true, sot_sync: forged });
    assert.equal(mismatch.status, 409);
    const missed = await mismatch.json();
    assert.equal(missed.code, "SOT-SYNC-MISMATCH");
    assert.equal(missed.applied, false);
    const cite = await (await get(env, "/cite.json")).json();
    assert.equal(cite.runtime_sot.version_id, null);
    assert.equal(cite.runtime_sot.git_sha, LIVE_SHA);

    forged.sig = "ab".repeat(32);
    const bad = await post(env, { outlet_id: OUTLET_ID, confirm: true, sot_sync: forged });
    assert.equal(bad.status, 400);
    assert.equal((await bad.json()).code, "SOT-SYNC-BAD-SIG");
  });

  it("keeps last-known and an honest status when live SoT is unreachable", async () => {
    const views = kv(1);
    const env = envWith(liveDoc(), views);
    assert.equal((await post(env, { outlet_id: OUTLET_ID, confirm: true })).status, 200);
    env.AZIEL_RUNTIME.fetch = async () => {
      throw new Error("down");
    };
    const stopped = await post(env, { outlet_id: OUTLET_ID, dry_run: true });
    const dry = await stopped.json();
    assert.equal(dry.status, "unreachable");
    assert.equal(dry.applied, false);
    assert.equal(dry.kept, "last-known");
    assert.equal(dry.receipt, null);
    assert.match(dry.note, /did not answer/);

    const confirmed = await post(env, { outlet_id: OUTLET_ID, confirm: true });
    const body = await confirmed.json();
    assert.equal(body.applied, false);
    assert.equal(body.status, "unreachable");
    const cite = await (await get(env, "/cite.json")).json();
    assert.equal(cite.runtime_sot.git_sha, LIVE_SHA);
    assert.match(cite.runtime_sot.note, /unreachable/);
    assert.equal(cite.runtime_sot.version_id, null);
    const card = await (await get(env, "/v1/mesh/outlet")).json();
    assert.equal(card.status, "unreachable");
    assert.equal(card.last_known.git_sha, LIVE_SHA);
    const receipt = await (await get(env, "/v1/mesh/outlet/receipt")).json();
    assert.equal(receipt.chain_length, 1);
  });

  it("copies version_id only when the live document exposes one", async () => {
    assert.equal(projectSot({ version: RUNTIME_VERSION, git_sha: LIVE_SHA, count: 42 }).sot.version_id, null);
    assert.equal(projectSot({ version: RUNTIME_VERSION, git_sha: LIVE_SHA, count: 42, version_id: null }).sot.version_id, null);
    assert.equal(projectSot({ version: RUNTIME_VERSION, git_sha: LIVE_SHA, count: 42, version_id: "" }).sot.version_id, null);
    assert.equal(projectSot({ version: RUNTIME_VERSION, git_sha: "abc", count: 42 }).ok, false);
    assert.equal(frozenSot().version_id, null);

    const views = kv(0);
    const env = envWith(liveDoc({ version_id: "c0ffee01" }), views);
    const res = await post(env, { outlet_id: OUTLET_ID, confirm: true });
    const doc = await res.json();
    assert.equal(doc.sot.version_id, "c0ffee01");
    assert.match(doc.surfaces.cite, /version_id c0ffee01/);
    const cite = await (await get(env, "/cite.json")).json();
    assert.equal(cite.runtime_version_id, "c0ffee01");
    const catalog = await (await get(env, "/v1/software")).json();
    assert.equal(catalog.version_id, "c0ffee01");
    assert.equal(catalog.count, 1);
    assert.doesNotMatch(JSON.stringify(catalog.products), /c0ffee01/);
  });

  it("refuses a sync that does not name the outlet or the mode", async () => {
    const env = envWith(liveDoc(), kv(0));
    const both = await post(env, { outlet_id: OUTLET_ID, dry_run: true, confirm: true });
    assert.equal((await both.json()).code, "SOT-OUTLET-MODE");
    const none = await post(env, { outlet_id: OUTLET_ID });
    assert.equal((await none.json()).code, "SOT-OUTLET-NEEDS-MODE");
    const other = await post(env, { outlet_id: "hub-other", dry_run: true });
    assert.equal((await other.json()).code, "SOT-OUTLET-ID");
  });
});
