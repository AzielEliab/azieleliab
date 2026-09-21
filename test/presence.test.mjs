import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  HDJ_EXCLUDED,
  PRESENCE_CLEANUP_MS,
  PRESENCE_TTL_MS,
  SITE_PRESENCE_KIND,
  SITE_PRESENCE_PATH,
  countBody,
  liveNodeCountFromMap,
  presenceCutoff,
  publishSiteLiveNodes,
  runtimeAggregatesFleetViewers,
  sessionFingerprint,
  sessionIdFrom,
  shouldTouchPresence,
  sitePresencePayload,
} from "../src/presence.js";
import { memoryKv } from "../src/views.js";
import { overlaySitePresence, meshLiveNodesCount } from "../src/mesh.js";

describe("site presence", () => {
  it("uses a 5-minute live window and a 15-minute cleanup window", () => {
    assert.equal(PRESENCE_TTL_MS, 5 * 60 * 1000);
    assert.equal(PRESENCE_CLEANUP_MS, 15 * 60 * 1000);
    const now = Date.parse("2026-09-21T16:00:00.000Z");
    const c = presenceCutoff(now);
    assert.equal(c.sinceMs, now - PRESENCE_TTL_MS);
    assert.equal(c.cleanupMs, now - PRESENCE_CLEANUP_MS);
    assert.equal(c.sinceIso, "2026-09-21T15:55:00.000Z");
  });

  it("counts visible sessions and floors a just-touched empty map at 1", () => {
    const now = Date.parse("2026-09-21T16:00:00.000Z");
    assert.equal(liveNodeCountFromMap({ a: now, b: now - 1000 }, now, false), 2);
    assert.equal(liveNodeCountFromMap({ a: now - PRESENCE_TTL_MS - 1 }, now, false), 0);
    assert.equal(liveNodeCountFromMap({}, now, true), 1);
    assert.equal(liveNodeCountFromMap({}, now, false), 0);
  });

  it("fingerprints IP+UA without storing raw addresses", () => {
    const id = sessionIdFrom({
      headers: {
        get(name) {
          if (name === "cf-connecting-ip") return "203.0.113.9";
          if (name === "user-agent") return "Mozilla/5.0";
          return "";
        },
      },
    });
    assert.match(id, /^[0-9a-f]{8}$/);
    assert.equal(id, sessionFingerprint("203.0.113.9|Mozilla/5.0"));
    assert.notEqual(id, "203.0.113.9");
  });

  it("does not touch bots or HEAD", () => {
    assert.equal(shouldTouchPresence({ method: "GET", headers: { get: () => "Mozilla/5.0" } }), true);
    assert.equal(shouldTouchPresence({ method: "GET", headers: { get: () => "GPTBot/1.0" } }), false);
    assert.equal(shouldTouchPresence({ method: "HEAD", headers: { get: () => "Mozilla/5.0" } }), false);
    assert.equal(shouldTouchPresence({ method: "GET", headers: { get: () => "" } }), false);
  });

  it("excludes HDJ and uses runtime live_nodes when site viewers are included", () => {
    assert.equal(HDJ_EXCLUDED, true);
    assert.equal(runtimeAggregatesFleetViewers({ live_nodes_includes_viewers: true }), true);
    assert.equal(runtimeAggregatesFleetViewers({ includes_site_viewers: true }), true);
    assert.equal(runtimeAggregatesFleetViewers({ site_live_viewers: 0 }), true);
    assert.equal(runtimeAggregatesFleetViewers({ live_nodes_plane: "human-mesh-users-site-viewers" }), true);
    assert.equal(runtimeAggregatesFleetViewers({ site_presence_local: true, site_live_nodes: 4, site_live_viewers: 4 }), false);
    assert.equal(runtimeAggregatesFleetViewers({ human_mesh_users: 2 }), false);
    const clock = countBody({ nodes: 10, live_nodes: 4, site_live_nodes: 3, mesh_live_nodes: 1 });
    assert.equal(clock.hdj_excluded, true);
    assert.equal(clock.hdj, false);
    assert.equal(clock.includes_site_viewers, false);
    assert.doesNotMatch(JSON.stringify(clock), /hedidntjump/i);
    assert.equal(
      meshLiveNodesCount(overlaySitePresence({
        origin: { enabled: true, live_nodes: 8, live_nodes_includes_viewers: true, human_mesh_users: 1 },
      }, 5)),
      8,
    );
    assert.equal(
      meshLiveNodesCount(overlaySitePresence({
        origin: {
          enabled: true,
          live_nodes: 12,
          human_mesh_users: 1,
          site_live_viewers: 11,
          includes_site_viewers: true,
        },
      }, 9)),
      12,
    );
  });

  it("builds a human-page payload and refuses invented counts", () => {
    assert.deepEqual(sitePresencePayload(12), {
      host: "azieleliab.com",
      viewers: 12,
      kind: SITE_PRESENCE_KIND,
    });
    assert.equal(SITE_PRESENCE_KIND, "human-page");
    assert.equal(SITE_PRESENCE_PATH, "/v1/mesh/site-presence");
    assert.equal(sitePresencePayload(0), null);
    assert.equal(sitePresencePayload(1.5), null);
    assert.equal(sitePresencePayload(-1), null);
    assert.equal(sitePresencePayload("4"), null);
    assert.equal(sitePresencePayload(true), null);
    assert.equal(sitePresencePayload(10001), null);
  });

  it("POSTs through AZIEL_RUNTIME and falls back to HTTPS without inventing", async () => {
    const posts = [];
    const env = {
      VIEWS: memoryKv(0),
      AZIEL_RUNTIME: {
        async fetch(req) {
          posts.push({ url: req.url, method: req.method, body: await req.json(), ua: req.headers.get("user-agent") });
          return new Response(JSON.stringify({ ok: true }), { status: 200 });
        },
      },
    };
    const bound = await publishSiteLiveNodes(env, 3);
    assert.equal(bound.ok, true);
    assert.equal(bound.posted, true);
    assert.equal(posts.length, 1);
    assert.equal(posts[0].method, "POST");
    assert.equal(new URL(posts[0].url).pathname, "/v1/mesh/site-presence");
    assert.equal(posts[0].url.startsWith("https://aziel-runtime.vibelock.workers.dev/"), true);
    assert.deepEqual(posts[0].body, { host: "azieleliab.com", viewers: 3, kind: "human-page" });
    assert.equal(posts[0].ua, "Mozilla/5.0");

    const skipped = await publishSiteLiveNodes({ VIEWS: memoryKv(0) }, 1.2);
    assert.equal(skipped.posted, false);
    const unbound = await publishSiteLiveNodes({}, 2);
    assert.equal(unbound.posted, false);
    assert.equal(unbound.reason, "no-store");

    const orig = globalThis.fetch;
    const https = [];
    globalThis.fetch = async (url, init) => {
      https.push({ url: String(url), method: init.method, body: JSON.parse(init.body) });
      return new Response("{}", { status: 503 });
    };
    try {
      const viaHttps = await publishSiteLiveNodes({ VIEWS: memoryKv(0) }, 2);
      assert.equal(viaHttps.posted, true);
      assert.equal(viaHttps.ok, false);
      assert.equal(viaHttps.status, 503);
      assert.equal(https[0].url, "https://aziel-runtime.vibelock.workers.dev/v1/mesh/site-presence");
      assert.deepEqual(https[0].body, { host: "azieleliab.com", viewers: 2, kind: "human-page" });
    } finally {
      globalThis.fetch = orig;
    }

    const down = await publishSiteLiveNodes({
      VIEWS: memoryKv(0),
      AZIEL_RUNTIME: { fetch: async () => { throw new Error("down"); } },
    }, 1);
    assert.equal(down.ok, false);
    assert.equal(down.posted, false);
  });
});
