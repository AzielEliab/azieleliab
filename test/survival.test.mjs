import { describe, it } from "node:test";
import assert from "node:assert/strict";
import worker, { handleRequest } from "../src/index.js";
import {
  AUTHOR,
  CANON_ORIGIN,
  MIRAGEGRID,
  MIRAGEGRID_BRIDGE,
  MIRAGEGRID_HEALTH,
  MIRAGEGRID_SHUFFLE,
  PERSON_ID,
  RUNTIME,
  RUNTIME_LOCAL,
} from "../src/copy.js";
import { aiTxt, citeDoc, llmsTxt, robotsTxt, sitemapXml } from "../src/seo.js";
import { whoIsTxt } from "../src/identity.js";
import { cap7Cite } from "../src/shelves.js";
import { pageHtml } from "../src/page.js";
import {
  BAN_CALLING_NAME_SPEC,
  BAN_PLATFORMS_SPEC,
  BAN_SURVIVAL_SPEC,
  CALLING_NAME_ALERT_PREFIX,
  CAP7_SHUFFLE_SPEC,
  PLATFORM_IDS,
  RE_COLD_STORE_HOOK,
  SPORE_SPEC,
  SURVIVAL_JSON_LOCAL,
  SURVIVAL_LOCAL,
  SURVIVAL_ORIGIN,
  SURVIVAL_PATH,
  SURVIVAL_RUNTIME,
  banSurvivalCite,
  callingNameAlertLine,
  callingNameCite,
  cap7ShuffleCite,
  platformsCite,
  survivalBody,
  survivalLlmsBlock,
  survivalSource,
} from "../src/survival.js";
import { meshSnapshot, meshStatusBody } from "../src/mesh.js";

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

async function fetchPath(path, init = {}, extra) {
  const request = new Request("https://www.azieleliab.com" + path, init);
  return worker.fetch(request, isolatedEnv(extra));
}

const LIVE_SOT = {
  spec: BAN_SURVIVAL_SPEC,
  mutual_backup: true,
  shelves_backup_for: "death-by-ban",
  live_doors_backup_for: "cold-shelf-death",
  live_doors: [
    {
      id: "workers-dev",
      origin: RUNTIME,
      status: "live",
      independent: false,
    },
    {
      id: "author-runtime",
      origin: RUNTIME_LOCAL,
      status: "live",
      independent: false,
    },
  ],
  calling_name: {
    spec: BAN_CALLING_NAME_SPEC,
    rotated: false,
    calling_name: "Aziel Runtime",
    calling_slug: "aziel-runtime",
    identity: AUTHOR,
    identity_unchanged: true,
    alert: null,
  },
  platforms: {
    spec: BAN_PLATFORMS_SPEC,
    all_live: true,
    native_app_store: false,
    platforms: PLATFORM_IDS.map((id) => ({ id, live: true })),
  },
  cap7_aznet: {
    resolves_to_hub: false,
    hosted_endpoints: { status: "slot" },
    shuffle: { spec: CAP7_SHUFFLE_SPEC, hosted_update: "slot", path: "ping → land → that-round update" },
  },
  shelf_backup: {
    role: "death-by-ban-backup",
    is_live_door: false,
    shelves: "https://www.azielcorpuslibrary.net/shelves",
  },
  spore_spec: SPORE_SPEC,
  spore_role: "failsafe",
  spore_replaces_cold_shelves: false,
  survival_stack: [
    {
      layer: 1,
      id: "live-fronts",
      spec: BAN_SURVIVAL_SPEC,
      role: "failover",
      includes: ["cap-7", "calling-name", "live-node-api"],
    },
    {
      layer: 2,
      id: "cold-shelves",
      spec: "COLD-MULTI-SHELF-1.0",
      role: "mutual-backup",
      mutual_backup_with: BAN_SURVIVAL_SPEC,
      plane_b: "slot",
      plane_c: "slot",
      replaced: false,
      failed: false,
    },
    {
      layer: 3,
      id: "spore",
      spec: SPORE_SPEC,
      role: "failsafe",
      last_resort: true,
      replaces_cold_shelves: false,
      replaces_ban_survival: false,
    },
  ],
  re_cold_store: {
    hook: RE_COLD_STORE_HOOK,
    allowed: true,
    trigger: "cold-shelves-wiped-or-failed",
    active: false,
    shelves_failed: false,
    shelves_intact: true,
    invent_live: false,
    invent_hash: false,
    invent_receipt: false,
    invent_destination: false,
    public_inventory_required: false,
    destinations: [],
    opaque_placement: true,
  },
  spore: {
    spec: SPORE_SPEC,
    role: "failsafe",
    last_resort: true,
    failsafe: true,
    replaces_cold_shelves: false,
    replaces_ban_survival: false,
    cold_shelves_intact: true,
    faces: ["pause", "preserve", "wait", "physical-wipe-only"],
  },
};

describe("BAN-SURVIVAL hub pull", () => {
  it("does not treat hub wrap as a live door SoT", () => {
    assert.equal(survivalSource(null), null);
    assert.equal(survivalSource(survivalBody(null)), null);
    assert.equal(survivalSource(LIVE_SOT), LIVE_SOT);
    assert.equal(survivalSource(survivalBody(LIVE_SOT)), LIVE_SOT);
    const fallback = banSurvivalCite(null);
    assert.equal(fallback.spec, BAN_SURVIVAL_SPEC);
    assert.equal(fallback.source, "fallback");
    assert.deepEqual(fallback.live_doors, []);
    assert.equal(fallback.mutual_backup, true);
    assert.equal(fallback.mesh_live_nodes_are_api, false);
    assert.equal(fallback.visible_1520, false);
    assert.equal(fallback.godlock_is_product_not_identity, true);
    assert.equal(fallback.person_id, PERSON_ID);
    assert.equal(fallback.platforms.all_live, true);
    assert.equal(fallback.platforms.native_app_store, false);
    assert.deepEqual(fallback.platforms.platforms, PLATFORM_IDS.slice());
    assert.equal(fallback.calling_name.rotated, false);
    assert.equal(fallback.calling_name_alert, null);
    assert.equal(callingNameAlertLine(null), "");
    assert.equal(fallback.cap7_aznet.app_worker, MIRAGEGRID);
    assert.equal(fallback.cap7_aznet.resolves_to_hub, false);
    assert.equal(fallback.cap7_aznet.public_worker, "live");
    assert.equal(fallback.cap7_aznet.hosted_endpoints, "slot");
    assert.equal(fallback.spore.spec, SPORE_SPEC);
    assert.equal(fallback.spore.last_resort, true);
    assert.equal(fallback.spore.replaces_cold_shelves, false);
    assert.equal(fallback.spore.honesty.shelves_not_marked_failed, true);
    assert.equal(fallback.re_cold_store.hook, RE_COLD_STORE_HOOK);
    assert.equal(fallback.re_cold_store.allowed, true);
    assert.deepEqual(fallback.re_cold_store.destinations, []);
    assert.equal(fallback.re_cold_store.invent_destination, false);
    assert.equal(fallback.re_cold_store.shelves_failed, false);
    const cold = fallback.survival_stack.find((row) => row.id === "cold-shelves");
    assert.equal(cold.failed, false);
    assert.equal(cold.replaced, false);
  });

  it("surfaces pulled live_doors and *new name alert: when rotated", () => {
    const live = banSurvivalCite(LIVE_SOT);
    assert.equal(live.source, "live");
    assert.equal(live.live_doors.length, 2);
    assert.equal(live.live_doors[0].id, "workers-dev");
    assert.equal(live.calling_name_alert, null);

    const rotated = {
      ...LIVE_SOT,
      calling_name: {
        ...LIVE_SOT.calling_name,
        rotated: true,
        calling_name: "Whitestone AI",
        calling_slug: "whitestone-ai",
      },
    };
    const cited = callingNameCite(rotated);
    assert.equal(cited.rotated, true);
    assert.equal(cited.identity, AUTHOR);
    assert.equal(cited.identity_unchanged, true);
    assert.equal(callingNameAlertLine(rotated), CALLING_NAME_ALERT_PREFIX + " Whitestone AI");
    assert.equal(platformsCite(LIVE_SOT).all_live, true);
    assert.equal(cap7ShuffleCite(LIVE_SOT).bridge, MIRAGEGRID_BRIDGE);
    assert.equal(cap7ShuffleCite(LIVE_SOT).health, MIRAGEGRID_HEALTH);
    assert.equal(cap7ShuffleCite(LIVE_SOT).shuffle, MIRAGEGRID_SHUFFLE);
    assert.equal(cap7ShuffleCite(LIVE_SOT).resolves_to_hub, false);
  });

  it("serves /survival and /v1/survival from runtime SoT", async () => {
    const env = {
      AZIEL_RUNTIME: {
        fetch: async (req) => {
          const path = new URL(req.url).pathname;
          if (path === "/survival" || path === "/v1/survival") {
            return new Response(JSON.stringify(LIVE_SOT), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }
          return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
        },
      },
    };
    const res = await fetchPath("/survival", {}, env);
    assert.equal(res.status, 200);
    const doc = await res.json();
    assert.equal(doc.ok, true);
    assert.equal(doc.author, AUTHOR);
    assert.equal(doc.identity, AUTHOR);
    assert.equal(doc.spec, BAN_SURVIVAL_SPEC);
    assert.equal(doc.source, "live");
    assert.equal(doc.survival, SURVIVAL_ORIGIN);
    assert.equal(doc.survival_local, SURVIVAL_LOCAL);
    assert.equal(doc.mutual_backup, true);
    assert.equal(doc.live_doors.length, 2);
    assert.equal(doc.mesh_live_nodes_are_api, false);
    assert.equal(doc.visible_1520, false);
    assert.equal(doc.godlock_is_product_not_identity, true);
    assert.equal(doc.platforms.all_live, true);
    assert.equal(doc.cap7_aznet.app_worker, MIRAGEGRID);
    assert.equal(doc.cap7_aznet.resolves_to_hub, false);
    assert.equal(doc.origin.spec, BAN_SURVIVAL_SPEC);
    assert.equal(doc.spore.spec, SPORE_SPEC);
    assert.equal(doc.spore.last_resort, true);
    assert.equal(doc.re_cold_store.hook, RE_COLD_STORE_HOOK);
    assert.equal(doc.re_cold_store.allowed, true);
    assert.deepEqual(doc.re_cold_store.destinations, []);
    assert.equal(doc.re_cold_store.invent_destination, false);
    assert.equal(doc.survival_stack.find((row) => row.id === "cold-shelves").failed, false);

    const alias = await fetchPath("/v1/survival", {}, env);
    const aliasDoc = await alias.json();
    assert.equal(aliasDoc.source, "live");
    assert.equal(aliasDoc.live_doors.length, 2);

    const runtime = await fetchPath("/runtime/survival", {}, env);
    assert.equal(runtime.status, 200);
    const runtimeDoc = await runtime.json();
    assert.equal(runtimeDoc.spec, BAN_SURVIVAL_SPEC);
    assert.equal(runtimeDoc.survival_runtime, SURVIVAL_RUNTIME);

    const missing = await fetchPath("/survival");
    const fallback = await missing.json();
    assert.equal(fallback.ok, true);
    assert.equal(fallback.source, "fallback");
    assert.deepEqual(fallback.live_doors, []);
    assert.equal(fallback.platforms.all_live, true);

    const opt = await fetchPath("/survival", { method: "OPTIONS" });
    assert.equal(opt.status, 204);
    const head = await fetchPath("/v1/survival", { method: "HEAD" });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), "");
  });

  it("keeps machine cites only — no 15:20 survival chrome on the homepage", () => {
    const html = pageHtml();
    const visible = html.split("<body>")[1] || "";
    assert.ok(html.includes('name="aziel-survival"'));
    assert.ok(html.includes('content="' + SURVIVAL_LOCAL + '"'));
    assert.ok(html.includes("human mesh users"));
    assert.ok(html.includes("Nodes: human mesh users + human uses. Live Nodes: presence."));
    assert.ok(html.includes(">0/0<"));
    assert.ok(!visible.includes(BAN_SURVIVAL_SPEC));
    assert.ok(!visible.includes(SPORE_SPEC));
    assert.ok(!visible.includes(RE_COLD_STORE_HOOK));
    assert.ok(!visible.includes(CALLING_NAME_ALERT_PREFIX));
    assert.ok(!visible.includes("1 Chronicles 15:20"));
    assert.ok(!visible.includes(MIRAGEGRID_SHUFFLE));

    const cite = citeDoc();
    assert.equal(cite.ban_survival.spec, BAN_SURVIVAL_SPEC);
    assert.equal(cite.ban_survival.mutual_backup, true);
    assert.equal(cite.spore.spec, SPORE_SPEC);
    assert.equal(cite.spore.last_resort, true);
    assert.equal(cite.re_cold_store.hook, RE_COLD_STORE_HOOK);
    assert.deepEqual(cite.re_cold_store.destinations, []);
    assert.equal(cite.re_cold_store.invent_destination, false);
    assert.equal(cite.cold_multi_shelf.failed, false);
    assert.equal(cite.calling_name.spec, BAN_CALLING_NAME_SPEC);
    assert.equal(cite.platforms.all_live, true);
    assert.equal(cite.cap7.resolves_to_hub, false);
    assert.equal(cite.cap7.miragegrid, MIRAGEGRID);
    assert.equal(cite.cap7.shuffle.public_worker, "live");
    assert.equal(cite.mesh_live_nodes_are_api, false);
    assert.equal(cite.godlock_is_product_not_identity, true);
    assert.equal(cite.visible_1520, false);
    assert.equal(cite.person_id, PERSON_ID);

    const llms = llmsTxt();
    assert.ok(llms.includes(BAN_SURVIVAL_SPEC));
    assert.ok(llms.includes(MIRAGEGRID_BRIDGE));
    assert.ok(llms.includes(CALLING_NAME_ALERT_PREFIX));
    assert.ok(llms.includes("platforms all LIVE") || llms.includes("Platforms all LIVE"));
    assert.ok(llms.includes(SPORE_SPEC));
    assert.ok(llms.includes(RE_COLD_STORE_HOOK));
    assert.ok(llms.includes("destinations=[]"));
    assert.ok(llms.includes("Cold shelves not marked failed"));
    assert.ok(llms.includes("GodLock is a product"));
    assert.ok(llms.includes("Service → Clarity → Peace"));
    assert.ok(llms.includes(SURVIVAL_LOCAL));

    const who = whoIsTxt();
    assert.ok(who.includes(BAN_SURVIVAL_SPEC));
    assert.ok(who.includes(MIRAGEGRID));
    assert.ok(who.includes(CALLING_NAME_ALERT_PREFIX));
    assert.ok(who.includes(SPORE_SPEC));
    assert.ok(who.includes(RE_COLD_STORE_HOOK));
    assert.ok(aiTxt().includes(BAN_SURVIVAL_SPEC));
    assert.ok(aiTxt().includes(SPORE_SPEC));
    assert.ok(robotsTxt().includes("Allow: /survival"));
    assert.ok(robotsTxt().includes("Allow: /v1/survival"));
    assert.ok(sitemapXml().includes("<loc>" + SURVIVAL_LOCAL + "</loc>"));
    assert.ok(survivalLlmsBlock(null).includes(BAN_SURVIVAL_SPEC));
  });

  it("does not let Live Nodes fight live_doors / Cap-7 meanings", () => {
    const off = meshStatusBody(null);
    assert.equal(off.mesh_live_nodes_are_api, false);
    assert.equal(off.live_nodes_are_not_live_doors, true);
    const snap = meshSnapshot({ enabled: true, live_nodes: 40 });
    assert.equal(snap.live_nodes, 40);
    assert.equal(snap.mesh_live_nodes_are_api, false);
    const cap7 = cap7Cite();
    assert.equal(cap7.resolves_to_hub, false);
    assert.equal(cap7.miragegrid_health, MIRAGEGRID_HEALTH);
    assert.equal(cap7.shuffle.spec, CAP7_SHUFFLE_SPEC);
    assert.equal(cap7.software_tab, false);
    assert.equal(off.spore.spec, SPORE_SPEC);
    assert.equal(off.spore.software_tab, false);
    assert.deepEqual(off.re_cold_store.destinations, []);
    assert.equal(snap.spore.last_resort, true);
    assert.equal(snap.re_cold_store.shelves_failed, false);
  });

  it("refuses Cap-7 resolve-inject on /survival", async () => {
    const res = await handleRequest(new Request("https://www.azieleliab.com/survival?resolves_to_hub=true"));
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.code, "CAP7-RESOLVE-INJECT");
    assert.equal(body.resolves_to_hub, false);
  });
});
