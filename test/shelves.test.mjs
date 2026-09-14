import { describe, it } from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";
import { donateHtml, embryoLockHtml, pageHtml, receiptsHtml, whoHtml } from "../src/page.js";
import { aiTxt, citeDoc, llmsTxt, robotsTxt, sitemapXml } from "../src/seo.js";
import { CANON_ORIGIN, LIBRARY, PERSON_ID } from "../src/copy.js";
import { VISIBLE_LOCK_LINE } from "../src/identity.js";
import { canonicalPageBytes } from "../src/ingest.js";
import {
  ARCHIVE_ORG_DOWNLOAD,
  ARCHIVE_ORG_IDENTIFIER,
  ARCHIVE_ORG_TIP_PACK,
  CAP7_BRIDGE,
  CODEBERG_PACK_SHA256,
  CODEBERG_TIP_PACK,
  COLD_MULTI_SHELF_RULE,
  COLD_MULTI_SHELF_SPEC,
  FAMILY_BLAST_RADII,
  LAMB_LENS_PATH,
  LOCKSET_HREF,
  LOCKSET_TIP,
  NO_FAN,
  NO_FAN_PHRASE,
  PLANE_B_THIRD_ANY_OF,
  PLANE_B_WORKING_TARGETS,
  PUBLISHED_SURFACES,
  SHELVES_HREF,
  SHELVES_JSON_HREF,
  SHELVES_REGISTRY,
  TIP_PACK_SHA256,
  cap7Cite,
  shelvesDoc,
} from "../src/shelves.js";

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

describe("COLD-MULTI-SHELF-1.0 AZindex gate", () => {
  it("serves /shelves and /v1/shelves as the same machine JSON", async () => {
    const shelves = await fetchPath("/shelves");
    const jsonAlias = await fetchPath("/v1/shelves");
    const trailing = await fetchPath("/shelves/");
    assert.equal(shelves.status, 200);
    assert.equal(jsonAlias.status, 200);
    assert.equal(trailing.status, 200);
    assert.match(shelves.headers.get("content-type"), /application\/json/);
    assert.equal(shelves.headers.get("Access-Control-Allow-Origin"), "*");
    const body = await shelves.json();
    const alias = await jsonAlias.json();
    assert.deepEqual(body, alias);
    assert.deepEqual(body, shelvesDoc());
    assert.equal(await trailing.json().then((doc) => doc.spec), COLD_MULTI_SHELF_SPEC);
  });

  it("locks Plane A 5 surfaces / 2 family radii and cites the corpus registry", () => {
    const doc = shelvesDoc();
    assert.equal(doc.spec, COLD_MULTI_SHELF_SPEC);
    assert.equal(doc.rule, COLD_MULTI_SHELF_RULE);
    assert.equal(doc.person_id, PERSON_ID);
    assert.equal(doc.canonical_registry, SHELVES_REGISTRY);
    assert.equal(doc.canonical_registry, LIBRARY + "/shelves");
    assert.equal(doc.this_host, SHELVES_HREF);
    assert.equal(doc.lockset, LOCKSET_HREF);
    assert.equal(doc.lockset_local, false);
    assert.equal(doc.lockset_tip, LOCKSET_TIP);
    assert.equal(doc.doi, null);
    assert.equal(doc.growth_on, true);
    assert.equal(doc.visible_1520_chrome, false);
    assert.equal(doc.planes.A.published_surfaces, PUBLISHED_SURFACES);
    assert.deepEqual(doc.planes.A.family_blast_radii, FAMILY_BLAST_RADII);
    assert.equal(doc.registry.published_surfaces, 5);
    assert.deepEqual(doc.registry.family_blast_radii, ["cloudflare", "github"]);
    assert.deepEqual(doc.registry.independent_live_blast_radii, ["cf-github"]);
    assert.equal(doc.registry.independent_live_count, 1);
    assert.equal(doc.registry.independent_requirement_met, false);
    assert.equal(doc.registry.growth_on, true);
  });

  it("keeps Plane B Codeberg+archive.org PASS; third target Framagit OR GitLab; GitFlic not required", () => {
    const b = shelvesDoc().planes.B;
    assert.equal(b.status, "slot");
    assert.equal(b.doi, null);
    assert.equal(b.live_ready, false);
    assert.equal(b.zenodo_working_path, false);
    assert.equal(b.refuse, "CNS-ZENODO-IP-BAN");
    assert.deepEqual(b.working_targets, PLANE_B_WORKING_TARGETS);
    assert.deepEqual(b.third_target.any_of, PLANE_B_THIRD_ANY_OF);
    assert.equal(b.third_target.verified, false);
    assert.equal(b.third_target.url, null);
    assert.equal(b.codeberg.url, CODEBERG_TIP_PACK);
    assert.equal(b.codeberg.pack_sha256, CODEBERG_PACK_SHA256);
    assert.equal(b.codeberg.hash_verify, "pass");
    assert.equal(b.codeberg.live_ready, false);
    assert.equal(b.codeberg.refuse, "CNS-PLANE-B-ALL-TARGETS");
    assert.equal(b.archive_org.url, ARCHIVE_ORG_TIP_PACK);
    assert.equal(b.archive_org.identifier, ARCHIVE_ORG_IDENTIFIER);
    assert.equal(b.archive_org.download_base, ARCHIVE_ORG_DOWNLOAD);
    assert.equal(b.archive_org.pack_sha256, TIP_PACK_SHA256);
    assert.equal(b.archive_org.hash_verify, "pass");
    assert.equal(b.archive_org.live_ready, false);
    assert.equal(b.gitflic.required, false);
    assert.equal(b.gitflic.refuse, "CNS-GITFLIC-EMAIL");

    const shelves = shelvesDoc().registry.shelves;
    const codeberg = shelves.find((row) => row.id === "plane-b-codeberg-tip-pack");
    const archive = shelves.find((row) => row.id === "plane-b-archive-org-tip-pack");
    const framagit = shelves.find((row) => row.id === "plane-b-framagit-tip-pack");
    const gitlab = shelves.find((row) => row.id === "plane-b-gitlab-tip-pack");
    const gitflic = shelves.find((row) => row.id === "plane-b-gitflic-ru-tip-pack");
    const zenodo = shelves.find((row) => row.id === "plane-b-zenodo-tip-pack");
    assert.equal(codeberg.status, "slot");
    assert.equal(codeberg.hash_verify, "pass");
    assert.equal(archive.status, "slot");
    assert.equal(archive.url, ARCHIVE_ORG_TIP_PACK);
    assert.equal(archive.hash_verify, "pass");
    assert.equal(archive.pack_sha256, TIP_PACK_SHA256);
    assert.equal(framagit.url, null);
    assert.equal(gitlab.url, null);
    assert.equal(gitflic.status, "refused");
    assert.equal(gitflic.required, false);
    assert.ok(gitflic.refuse.includes("CNS-GITFLIC-EMAIL"));
    assert.ok(shelvesDoc().registry.refused.includes("plane-b-gitflic-ru-tip-pack"));
    assert.ok(!shelvesDoc().registry.slot.includes("plane-b-gitflic-ru-tip-pack"));
    assert.equal(zenodo.status, "refused");
    assert.equal(zenodo.doi, null);
    assert.ok(zenodo.refuse.includes("CNS-ZENODO-IP-BAN"));
    assert.ok(shelvesDoc().registry.paper_deposits.every((row) => row.reuse_as_plane_b === false));
  });

  it("keeps Plane C USB SLOT until CNS-OPERATOR-ATTEST", () => {
    const c = shelvesDoc().planes.C;
    assert.equal(c.status, "slot");
    assert.equal(c.primary, "usb_airgap");
    assert.ok(c.refuse.includes("CNS-OPERATOR-ATTEST"));
    const usb = shelvesDoc().registry.shelves.find((row) => row.id === "plane-c-usb-airgap");
    assert.equal(usb.status, "slot");
    assert.equal(usb.refuse, "CNS-OPERATOR-ATTEST");
  });

  it("cites Cap-7 as design_of only with resolves_to_hub false when a bridge is present", () => {
    const cap7 = cap7Cite();
    assert.equal(cap7.design_of_only, true);
    assert.equal(cap7.bridge, CAP7_BRIDGE);
    assert.equal(cap7.resolves_to_hub, false);
    assert.equal(cap7.sites.azeliab.design_of, CANON_ORIGIN + "/");
    assert.equal(cap7.sites.azeliab.resolves_to_hub, false);
    for (const site of Object.values(cap7.sites)) {
      assert.equal(Object.keys(site).sort().join(","), "design_of,resolves_to_hub");
      assert.equal(site.resolves_to_hub, false);
    }
    assert.equal(shelvesDoc().cap7.design_of_only, true);
    assert.equal(citeDoc().cold_multi_shelf.cap7.design_of_only, true);
    assert.equal(citeDoc().cold_multi_shelf.cap7.resolves_to_hub, false);
  });

  it("cites Lamb Lens Service → Clarity → Peace, Growth-ON, NO-FAN, CROSS-NETWORK-SURVIVAL", () => {
    const doc = shelvesDoc();
    assert.equal(doc.lamb_lens.path, LAMB_LENS_PATH);
    assert.equal(doc.lamb_lens.this_host_hosts_corpus_ui, false);
    assert.equal(doc.no_fan.spec, NO_FAN);
    assert.equal(doc.no_fan.phrase, NO_FAN_PHRASE);
    assert.equal(doc.no_fan.invented_doi, false);
    assert.equal(doc.cross_network_survival, "CROSS-NETWORK-SURVIVAL");
    assert.equal(doc.no_lie, "NO-LIE");
    assert.match(doc.no_lie_no_rewrite_rule, /no rewrite key/);
  });

  it("does not invent a local lockset or put 15:20 on visible HTML", async () => {
    const home = visible(pageHtml());
    const who = visible(whoHtml());
    const donate = visible(donateHtml());
    const embryo = visible(embryoLockHtml());
    const receipts = visible(await receiptsHtml());
    for (const [name, shown] of [
      ["home", home],
      ["who", who],
      ["donate", donate],
      ["embryolock", embryo],
      ["receipts", receipts],
    ]) {
      assert.ok(!shown.includes(VISIBLE_LOCK_LINE), name);
      assert.doesNotMatch(shown, />shelves</, name);
    }
    for (const [name, shown] of [
      ["home", home],
      ["donate", donate],
      ["embryolock", embryo],
      ["receipts", receipts],
    ]) {
      assert.doesNotMatch(shown, /1 Chronicles 15:20/, name);
    }
    assert.ok(pageHtml().includes('href="/shelves"'));
    assert.ok(!home.includes("COLD-MULTI-SHELF-1.0"));
    const bytes = canonicalPageBytes();
    assert.ok(!bytes.includes(COLD_MULTI_SHELF_SPEC));
    assert.ok(!bytes.includes(CODEBERG_PACK_SHA256));
    assert.ok(!bytes.includes("/shelves"));
  });

  it("mirrors Plane A/B/C facts on cite, llms, and ai", () => {
    const cite = citeDoc();
    const llms = llmsTxt();
    const ai = aiTxt();
    const robots = robotsTxt();
    const map = sitemapXml();
    assert.equal(cite.shelves, SHELVES_HREF);
    assert.equal(cite.shelves_json, SHELVES_JSON_HREF);
    assert.equal(cite.cold_multi_shelf.spec, COLD_MULTI_SHELF_SPEC);
    assert.equal(cite.cold_multi_shelf.canonical_registry, SHELVES_REGISTRY);
    assert.equal(cite.cold_multi_shelf.published_surfaces, 5);
    assert.equal(cite.person_id, PERSON_ID);
    for (const [name, text] of [
      ["llms", llms],
      ["ai", ai],
    ]) {
      assert.ok(text.includes(COLD_MULTI_SHELF_SPEC), name);
      assert.ok(text.includes(COLD_MULTI_SHELF_RULE), name);
      assert.ok(text.includes(SHELVES_REGISTRY), name);
      assert.ok(text.includes(CODEBERG_TIP_PACK), name);
      assert.ok(text.includes(ARCHIVE_ORG_TIP_PACK), name);
      assert.ok(text.includes(CODEBERG_PACK_SHA256), name);
      assert.ok(text.includes("Framagit OR GitLab"), name);
      assert.ok(text.includes("CNS-GITFLIC-EMAIL"), name);
      assert.doesNotMatch(text, /archive\.org unverified/, name);
      assert.ok(text.includes("CNS-ZENODO-IP-BAN"), name);
      assert.ok(text.includes("CNS-OPERATOR-ATTEST"), name);
      assert.ok(text.includes(LAMB_LENS_PATH), name);
      assert.ok(text.includes(NO_FAN), name);
      assert.ok(text.includes(PERSON_ID), name);
      assert.ok(text.includes("design_of only"), name);
      assert.ok(text.includes("resolves_to_hub: false"), name);
    }
    assert.ok(robots.includes("Allow: /shelves"));
    assert.ok(robots.includes("Allow: /shelves/"));
    assert.ok(robots.includes("Allow: /v1/shelves"));
    assert.ok(ai.includes("Allow: /shelves"));
    assert.ok(ai.includes("Allow: /v1/shelves"));
    assert.ok(map.includes("<loc>" + SHELVES_HREF + "</loc>"));
    assert.ok(map.includes("<loc>" + SHELVES_JSON_HREF + "</loc>"));
    assert.ok(llms.includes("GET " + SHELVES_HREF));
  });
});
