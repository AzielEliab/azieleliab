import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DONATE_RAILS } from "../src/copy.js";
import { donateQrResponse, qrImg, qrKnownId, qrPngPath } from "../src/qr.js";

describe("donate QR", () => {
  it("ships a solid PNG payment-URI QR for each rail", async () => {
    for (const rail of DONATE_RAILS) {
      assert.equal(qrKnownId(rail.id), true, rail.id);
      assert.equal(qrPngPath(rail.id), rail.qrSrc);
      const img = qrImg(rail);
      assert.ok(img.startsWith("<img "));
      assert.ok(img.includes('src="' + rail.qrSrc + '"'));
      assert.ok(img.includes('width="180"'));
      assert.ok(img.includes('height="180"'));
      assert.ok(img.includes('alt="' + rail.qrAlt + '"'));
      assert.ok(!img.includes("<svg"));
      assert.ok(!img.includes("https://www.azieleliab.com"));
      const disk = readFileSync(new URL("../public" + rail.qrSrc, import.meta.url));
      assert.equal(disk[0], 0x89);
      assert.equal(disk.toString("ascii", 1, 4), "PNG");
      assert.ok(disk.length > 1400, rail.id + " PNG should be a full quiet-zone raster");
      const res = donateQrResponse(rail.qrSrc);
      assert.ok(res);
      assert.match(res.headers.get("content-type"), /image\/png/);
      const served = Buffer.from(await res.arrayBuffer());
      assert.deepEqual(served, disk);
    }
    assert.equal(qrKnownId("sol"), false);
    assert.equal(donateQrResponse("/donate"), null);
    assert.equal(donateQrResponse("/donate/qr/sol.png"), null);
  });
});
