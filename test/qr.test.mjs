import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { DONATE_RAILS } from "../src/copy.js";
import { qrKnownUri, qrSvg } from "../src/qr.js";

describe("donate QR", () => {
  it("ships a static payment-URI QR for each rail", () => {
    for (const rail of DONATE_RAILS) {
      assert.equal(qrKnownUri(rail.uri), true, rail.id);
      const svg = qrSvg(rail.uri, rail.coin + " payment URI");
      assert.ok(svg.startsWith("<svg"));
      assert.ok(svg.includes('aria-label="' + rail.coin + " payment URI" + '"'));
      assert.ok(svg.includes('viewBox="0 0 '));
      assert.ok(!svg.includes("https://www.azieleliab.com"));
      assert.ok(!svg.includes("/donate"));
    }
    assert.equal(qrKnownUri("https://www.azieleliab.com/donate"), false);
  });
});
