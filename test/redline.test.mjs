import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";
import { donateHtml, pageHtml, whoHtml } from "../src/page.js";
import { aiTxt, citeDoc, llmsTxt, robotsTxt } from "../src/seo.js";
import { CANON_ORIGIN, PERSON_ID } from "../src/copy.js";
import { VISIBLE_LOCK_LINE } from "../src/identity.js";
import { canonicalPageBytes, pageBytesSha256 } from "../src/ingest.js";
import { PLANE_B_THIRD, PLANE_B_WORKING_TARGETS, shelvesDoc } from "../src/shelves.js";
import {
  ATTACK_SIMS,
  CAP7_DESIGN_OF,
  CAP7_RESOLVES_TO_HUB,
  FOLDLOCK_REDLINE,
  FOLDLOCK_SHELF,
  REDLINE_GROWTH_ON,
  REDLINE_HREF,
  REDLINE_SPEC,
  TOKEN_HEADER,
  azGeneratorCallRefuse,
  cap7ResolveInjectRefuse,
  doiInjectionRefuse,
  fakeDoiRefuse,
  foldlockTipSafeCite,
  isAzGeneratorHallucSlug,
  isKnownZenodoDoi,
  meshGetLooksLikeEnable,
  redlineCiteField,
  responseLeaksToken,
} from "../src/redline.js";

const TIP =
  "INGEST-AS-RECEIPT-1.0 sha256:c71e8c07d838b148fc8ec5f18c7e261d53566ea8a090ca81445e3483586082a5 https://www.azieleliab.com/";
const SECRET = "redline-operator-secret-value";
const FAKE_DOI = "10.5281/zenodo.99999999";

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

function walkFiles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === ".git" || name === "node_modules") continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walkFiles(full, out);
    else out.push(full);
  }
  return out;
}

describe("REDLINE-2026-09-14 AZindex cite", () => {
  it("publishes REDLINE, Cap-7 design_of, attack-surface, and FoldLock tip-safe on /cite.json", async () => {
    const cite = citeDoc();
    const field = redlineCiteField();
    assert.equal(cite.redline.spec, REDLINE_SPEC);
    assert.equal(cite.redline.href, REDLINE_HREF);
    assert.equal(cite.redline.growth_on, true);
    assert.equal(cite.redline.gptbot_disallow, false);
    assert.equal(cite.redline.software_tab, false);
    assert.equal(cite.redline.person_id, PERSON_ID);
    assert.equal(cite.redline.cap7.design_of, CAP7_DESIGN_OF);
    assert.equal(cite.redline.cap7.resolves_to_hub, false);
    assert.equal(cite.redline.token.git, false);
    assert.equal(cite.redline.token.query, false);
    assert.deepEqual(cite.redline.token.headers, ["Authorization", TOKEN_HEADER]);
    assert.equal(cite.tls.via, "cloudflare");
    assert.equal(cite.tls.client_side_crypto_claim, false);
    assert.equal(cite.tls.foldlock_is_not_encryption, true);
    assert.equal(cite.cap7.design_of, CAP7_DESIGN_OF);
    assert.equal(cite.cap7.inherit, "designs");
    assert.equal(cite.cap7.design_of_only, true);
    assert.equal(cite.cap7.resolves_to_hub, CAP7_RESOLVES_TO_HUB);
    assert.equal(cite.cap7.sites.azeliab.design_of, CANON_ORIGIN + "/");
    assert.equal(cite.cap7.sites.azeliab.resolves_to_hub, false);
    assert.equal(cite.design_of, CAP7_DESIGN_OF);
    assert.equal(cite.resolves_to_hub, false);
    assert.equal(cite.attack_surface.spec, REDLINE_SPEC);
    assert.equal(cite.attack_surface.kind, "attack-sim-refuse");
    assert.equal(cite.attack_surface.token.git, false);
    for (const row of ATTACK_SIMS) {
      assert.ok(cite.attack_surface.codes.includes(row.code), row.code);
    }
    assert.equal(cite.foldlock.spec, FOLDLOCK_SHELF);
    assert.equal(cite.foldlock.tip_safe, true);
    assert.equal(cite.foldlock.zip, false);
    assert.equal(cite.foldlock.encryption, false);
    assert.equal(cite.foldlock.engine_bound, false);
    assert.equal(cite.foldlock.redline, FOLDLOCK_REDLINE);
    assert.equal(cite.foldlock.refuse.TIP_FOLD, "FL-TIP-FOLD-REFUSE");
    assert.equal(cite.foldlock_shelf, FOLDLOCK_SHELF);
    assert.equal(cite.doi, null);
    assert.equal(cite.growth_on, undefined);
    assert.equal(field.azindex_hub_crawl_unchanged, true);
    assert.equal(REDLINE_GROWTH_ON, true);

    const served = await (await fetchPath("/cite.json")).json();
    assert.equal(served.redline.spec, REDLINE_SPEC);
    assert.equal(served.cap7.design_of, CAP7_DESIGN_OF);
    assert.equal(served.cap7.resolves_to_hub, false);
    assert.equal(served.design_of, CAP7_DESIGN_OF);
    assert.equal(served.resolves_to_hub, false);
    assert.equal(served.attack_surface.kind, "attack-sim-refuse");
    assert.equal(served.foldlock.tip_safe, true);
  });

  it("keeps shelves ALL-TARGETS Framagit and adds FoldLock tip-safe without changing Plane B", () => {
    const doc = shelvesDoc();
    assert.deepEqual(doc.planes.B.working_targets, PLANE_B_WORKING_TARGETS);
    assert.equal(doc.planes.B.third_target.forge, PLANE_B_THIRD);
    assert.equal(doc.planes.B.third_target.url, null);
    assert.equal(doc.planes.B.codeberg.refuse, "CNS-PLANE-B-ALL-TARGETS");
    assert.equal(doc.planes.B.archive_org.refuse, "CNS-PLANE-B-ALL-TARGETS");
    assert.equal(doc.foldlock.spec, FOLDLOCK_SHELF);
    assert.equal(doc.foldlock.tip_safe, true);
    assert.equal(doc.foldlock_shelf, FOLDLOCK_SHELF);
    assert.equal(citeDoc().cold_multi_shelf.foldlock.tip_safe, true);
  });

  it("mirrors REDLINE + FoldLock on llms/ai and keeps Growth-ON GPTBot Allow", () => {
    const llms = llmsTxt();
    const ai = aiTxt();
    const robots = robotsTxt();
    for (const [name, text] of [
      ["llms", llms],
      ["ai", ai],
    ]) {
      assert.ok(text.includes(REDLINE_SPEC), name);
      assert.ok(text.includes(REDLINE_HREF), name);
      assert.ok(text.includes("resolves_to_hub: false"), name);
      assert.ok(text.includes(FOLDLOCK_SHELF), name);
      assert.ok(text.includes("AZ-GEN-CALL-REFUSED"), name);
      assert.ok(text.includes("Never query, body, or git"), name);
    }
    assert.match(robots, /User-agent: GPTBot\nAllow: \//);
    assert.doesNotMatch(robots, /User-agent: GPTBot\nDisallow:/);
    assert.doesNotMatch(robots, /Disallow:\s*\/?$/m);
    assert.equal(pageBytesSha256(), "c71e8c07d838b148fc8ec5f18c7e261d53566ea8a090ca81445e3483586082a5");
    assert.equal(canonicalPageBytes().includes(REDLINE_SPEC), false);
    assert.equal(canonicalPageBytes().includes(FOLDLOCK_SHELF), false);
    assert.ok(pageHtml().includes(TIP));
  });

  it("does not put 15:20 or the lock line on visible HTML", () => {
    for (const [name, html] of [
      ["home", visible(pageHtml())],
      ["who", visible(whoHtml())],
      ["donate", visible(donateHtml())],
    ]) {
      assert.ok(!html.includes(VISIBLE_LOCK_LINE), name);
    }
    assert.doesNotMatch(visible(pageHtml()), /1 Chronicles 15:20/);
    assert.doesNotMatch(visible(donateHtml()), /1 Chronicles 15:20/);
  });
});

describe("REDLINE attack-sim refuses", () => {
  it("refuses AZ Generator as a registrar", async () => {
    assert.ok(isAzGeneratorHallucSlug("az-generator"));
    assert.equal(azGeneratorCallRefuse().code, "AZ-GEN-CALL-REFUSED");
    const cite = await fetchPath("/v1/mesh/az-generator");
    assert.equal(cite.status, 200);
    const cited = await cite.json();
    assert.equal(cited.live_registrar, false);
    assert.equal(cited.design_of, CAP7_DESIGN_OF);
    assert.equal(cited.resolves_to_hub, false);
    const posted = await fetchPath("/v1/mesh/az-generator", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ register: true, name: "evil.az" }),
    });
    assert.equal(posted.status, 400);
    const body = await posted.json();
    assert.equal(body.ok, false);
    assert.equal(body.code, "AZ-GEN-CALL-REFUSED");
    assert.equal(body.live_registrar, false);
  });

  it("refuses mesh enable via GET", async () => {
    assert.equal(meshGetLooksLikeEnable(new URLSearchParams("enable=true"), {}), true);
    const mesh = await fetchPath("/v1/mesh/status?enable=true");
    assert.equal(mesh.status, 400);
    const body = await mesh.json();
    assert.equal(body.code, "MESH-GET-NEVER-ENABLES");
    assert.equal(body.get_never_enables, true);
    assert.equal(body.enabled_by_get, false);
    const plain = await fetchPath("/v1/mesh/status");
    assert.equal(plain.status, 200);
  });

  it("refuses Cap-7 resolves_to_hub true injection", async () => {
    assert.equal(cap7ResolveInjectRefuse().resolves_to_hub, false);
    assert.equal(cap7ResolveInjectRefuse().design_of, CAP7_DESIGN_OF);
    const injected = await fetchPath("/cite.json?resolves_to_hub=true");
    assert.equal(injected.status, 400);
    const body = await injected.json();
    assert.equal(body.code, "CAP7-RESOLVE-INJECT");
    assert.equal(body.resolves_to_hub, false);
    assert.equal(body.design_of, CAP7_DESIGN_OF);
    const shelves = await fetchPath("/shelves?resolves_to_hub=true");
    assert.equal(shelves.status, 400);
    assert.equal((await shelves.json()).code, "CAP7-RESOLVE-INJECT");
  });

  it("refuses a fake Zenodo DOI", async () => {
    assert.equal(isKnownZenodoDoi(FAKE_DOI), false);
    assert.equal(fakeDoiRefuse(FAKE_DOI).code, "DOI-FAKE-REFUSED");
    assert.equal(doiInjectionRefuse(FAKE_DOI).code, "DOI-FAKE-REFUSED");
    const res = await fetchPath("/cite.json?doi=" + encodeURIComponent(FAKE_DOI));
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.code, "DOI-FAKE-REFUSED");
    assert.equal(body.doi, null);
    assert.equal(citeDoc().doi, null);
  });

  it("refuses operator token in query or body and does not echo it", async () => {
    const q = await fetchPath("/cite.json?token=" + encodeURIComponent(SECRET));
    assert.equal(q.status, 400);
    const qBody = await q.json();
    assert.equal(qBody.code, "TOKEN-QUERY-REFUSED");
    assert.equal(qBody.git, false);
    assert.doesNotMatch(JSON.stringify(qBody), new RegExp(SECRET));
    assert.equal(responseLeaksToken(qBody, [SECRET]), false);

    const bodyTok = await fetchPath("/v1/view", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ runtime_token: SECRET }),
    });
    assert.equal(bodyTok.status, 400);
    const leaked = await bodyTok.json();
    assert.equal(leaked.code, "TOKEN-BODY-REFUSED");
    assert.doesNotMatch(JSON.stringify(leaked), new RegExp(SECRET));
  });

  it("refuses FoldLock tip-fold", async () => {
    const fold = foldlockTipSafeCite();
    assert.equal(fold.tip_safe, true);
    assert.equal(fold.zip, false);
    const res = await fetchPath("/cite.json?fold=tip");
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.code, "FL-TIP-FOLD-REFUSE");
    assert.equal(body.tip_safe, true);
    assert.equal(body.fold_applied, false);
  });

  it("never commits operator or Cloudflare tokens", () => {
    const root = fileURLToPath(new URL("..", import.meta.url));
    const files = walkFiles(root);
    const secretAssign = /(?:CLOUDFLARE_API_TOKEN|OPERATOR_TOKEN|RUNTIME_TOKEN|GATE_TOKEN)\s*=\s*['\"]?(?!\$\{)[A-Za-z0-9_\-]{12,}/;
    for (const file of files) {
      const rel = relative(root.pathname, file);
      if (rel.endsWith(".test.mjs")) continue;
      const text = readFileSync(file, "utf8");
      assert.doesNotMatch(text, secretAssign, rel);
      assert.doesNotMatch(text, /sk-[A-Za-z0-9]{20,}/, rel);
    }
  });
});
