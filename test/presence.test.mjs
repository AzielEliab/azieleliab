import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  HDJ_EXCLUDED,
  PRESENCE_CLEANUP_MS,
  PRESENCE_TTL_MS,
  countBody,
  liveNodeCountFromMap,
  presenceCutoff,
  runtimeAggregatesFleetViewers,
  sessionFingerprint,
  sessionIdFrom,
  shouldTouchPresence,
} from "../src/presence.js";
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

  it("excludes HDJ and prefers runtime live_nodes once fleet viewers are aggregated", () => {
    assert.equal(HDJ_EXCLUDED, true);
    assert.equal(runtimeAggregatesFleetViewers({ live_nodes_includes_viewers: true }), true);
    assert.equal(runtimeAggregatesFleetViewers({ live_nodes_plane: "human-mesh-users-site-viewers" }), true);
    assert.equal(runtimeAggregatesFleetViewers({ site_presence_local: true, site_live_nodes: 4 }), false);
    assert.equal(runtimeAggregatesFleetViewers({ human_mesh_users: 2 }), false);
    const clock = countBody({ nodes: 10, live_nodes: 4, site_live_nodes: 3, mesh_live_nodes: 1 });
    assert.equal(clock.hdj_excluded, true);
    assert.equal(clock.hdj, false);
    assert.doesNotMatch(JSON.stringify(clock), /hedidntjump/i);
    assert.equal(
      meshLiveNodesCount(overlaySitePresence({
        origin: { enabled: true, live_nodes: 8, live_nodes_includes_viewers: true, human_mesh_users: 1 },
      }, 5)),
      8,
    );
  });
});
