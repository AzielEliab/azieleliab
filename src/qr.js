/**
 * Solid black-on-white PNG QRs for AZL-DONATE-1.0 payment URIs.
 * Files live at public/donate/qr/{id}.png. Worker serves the same bytes.
 * Encodes the payment URI, not a website URL. Author: Aziel Eliab.
 */

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

export const QR_PNG_SIZE = 180;
export const QR_PNG_DIR = "/donate/qr";

const QR_PNG = {
  btc: {
    src: QR_PNG_DIR + "/btc.png",
    alt: 'Bitcoin payment URI QR',
    bytes: "iVBORw0KGgoAAAANSUhEUgAAAZoAAAGaAQAAAAAefbjOAAACFklEQVR42u1cW26EMBAblQNwpFydI+0BIqUw7+z+tP2r7HwgYPEPWB57MlpZv1+XEEQQQQQRRBBBBAVIfB1Lxuuwn2SsKes678N6xQNDQV/yh0XQ/wBJfP1n3WQQOf3sJoOePY80lpARIIx4VGAYDx5lMLWIe0YVvUdGoDHCz0IyrGAMMgJZI/TuuYwCJg9kBLCP0IJxr2lG0y/pI+AYsWeNzwOzBhgjalnmzLjpWeMtsvLtYfgItRCaOb0VIRpGZwsh1AicqqFW8vnmZSovu5wffoOMAKgaZSCbUFT6jHJCRgAxQj/8bMbBC4b+ql2rkz4CMX3GWREkgqecrBpIWaN5x40Ho+1wHNQIoKpRTcrGCK8Vsm+KkhEwjCjvWLS4kgwXu9ho/Yi4LFpkLK1mJhmBlD49TXgXIozmjCfpLNE6VFsrwudkoldFZ4nnI2ZzFDE2k/saUTCoEVDp08cgbCMj+hG1zUGNgHOWTSjcTKR45GgdNQJHI6QbSMm2tZeOY2tq8+1hZI3aA288GDlPw50urKqxarPz2MKoBQ4XD/oInKpRM1Q2g+uHxhepOMK3B9CPsLVvX5gyzJzOFzICq2r0lpRITNVJmQlmDbD0GfJQo3U+e9kVhIxAY0RzD9mPaBtfZAQeI2roNodlWgihj4DzEeUeYvay+hHUCMissd/bNr6oEYj9CP4fC0EEEUQQQQQR9FPQNxLDHXKeC7uXAAAAAElFTkSuQmCC",
  },
  eth: {
    src: QR_PNG_DIR + "/eth.png",
    alt: 'Ethereum payment URI QR',
    bytes: "iVBORw0KGgoAAAANSUhEUgAAAZoAAAGaAQAAAAAefbjOAAACIklEQVR42u1cSW7EMAwTmgf4Sf56npQHGHBjrc7MHNreCtKHgROHl4SQRFoemb8fpxBEEEEEEUQQQQQFSHwc96ytG5fPpM9xP3LFA11BX/KHQdD/ADkj9EsvHmyXZxtBspcFvj0ARqwo0PXDr58kwx0oNEaskLEiCBkBxwj95np5ZxQniC2QEcCMCDLovVggIzDriG1mQ8tL1hFwjCit0a9PP9QaYIyoEaljGEHu/PH2CBmBkjW8ZjCFMY0MLzPGCDBGWGRQmZEZwsgwQnqQETBa40incohzI8JDOBPMGkB1xGk8qGJCMlqkKTHDwiQjILLGEI8HITx9N6O5PRGJhYwAiRFSVkSVlyMcqsk6Ai9r5IZWGNixCxqXzBpYfsSVkiJ3PDWJnHlvW+DbA2BE1ZOlNYoR9CNQtUY2RGjh0Mq10oVBFxupstx9KVvp2Smh3BBmDSz1mfaTKYwjAsVDoDJGQGUNlxRmTsV2l/fOeOogI4BihNvWXk/K3l8XEYRZA0p9JgWionhxL8kIPD/C1IQXlWlPZBeNNGYNoKyR/uTekG1+RHZYkRFQMaJsqqgZ3rpoQpuSERAxQj4ojDzd1bkbDupHXMdj79P6LPeNcMYIHEbUeY3r2M5rPOoIMgKREZYr3Lae+3EuYX8EJiOqEdcbK1OCsjsfs4442+NseDrbXmiSEXhaY7Miakv8SRW+PSA/gv/HQhBBBBFEEEEE/RT0DZPaFjEkjoG6AAAAAElFTkSuQmCC",
  },
  ltc: {
    src: QR_PNG_DIR + "/ltc.png",
    alt: 'Litecoin payment URI QR',
    bytes: "iVBORw0KGgoAAAANSUhEUgAAAZoAAAGaAQAAAAAefbjOAAACJElEQVR42u1cSW7EMAwT6gfkSfm6n+QHBFDHWix72kPbW0H6YAyS6JIQFCnJI/r71YVBDGIQgxjEIAYxKIMkVlO5x9z0Ee2XPdBe+8gHbgv6kD8sBv2PoECEfWl9gSEgYCi5HkeJ36jniAgEREwWuA0RhoPXFiwy5iOTN5xBiAg0RFjCCGzYfcMGEQGMiC1NjBAOdYOIwNMR/uF9y9ThlEEdAYWId6/xvtFrgCGiVl4zeakuJr5YVr49jKyxUYGDYbnPntfIETAcEVWIaTM03KcBxK4ZNsgRYDriKsMhCxZ60kPCgohA4Ijr1BGTHnoajmQLZg0kZbm5iUeym9F0r0dczBpQXuNJazmvTcrwekSXthIGswaS1xjV4myeRCJXbP6DiADzGpEXUkKEqDzyBxGB5T67ZJ/zPloamTqICCgdsSyoprkIRZESohd8+PZgvEZ1ukSyv7UqE9QRcDqivMbyFTkzwb4GHkdUi7N0RAzLcKoO0n0WM2RlwjOJz1BlHZMcgaMsl3bM5kaN3+ZILhEBpiyDI1a7K/SkbkmEWQMma9gvL0pk7TrMxfhGhvLtYdQjEhtryna0reEhkgc5iAgUjggwVJNrzUfUOS8iAsZrrDNdeo7arlk6IgLPfe5HPuU4r2GLyhITEfsgblaomDWgERF2s22liCAKzlCB6gh9m8lPjcm+BqrXODTDXqviuU/IegT/j4VBDGIQgxjEIAb9NOgT5bgNYRLvTSkAAAAASUVORK5CYII=",
  },
  xrp: {
    src: QR_PNG_DIR + "/xrp.png",
    alt: 'XRP payment URI QR',
    bytes: "iVBORw0KGgoAAAANSUhEUgAAAXIAAAFyAQAAAADAX2ykAAABvElEQVR42u2bTY7DIAxGrckBcqRcnSPlAEiMwDYmnVWlqSqjlwVq4Fv11f9U2ltPEfTo0aNHjx79P+nFnqPv9OXse2c/uv3sGvofee9B/1298R3w2n0Y1Q459hYJfJPy7WZ63YNqFaM692Tihm92vqKuuYp+gu9efN0hVzdn+G4Vf0dq9civiL8b8J3582K1tpA/5+cbz4tNm2FHPcX3mbw+6gar8VczLa2J/XcA36T++ayT9EitRCz+jtdW4ZvaP5cw05f8uVkTC76p+WrWXNdcSp20eE8Lvqn5rl7ZD0Yny8Mx+XN6/9yDcBm7Go4t9PoC39z2O16LL4/4e+Cf09uvWm3xTof65zJnhvBNXh9ZLqVJtEhQpT7K39/464vXSdLMqeGbuL9R5t4ahM2S4Zvaft0Dx9TXnLSPk/DPufnOXvPpBdGshG06DN+8+XPMj645BG4ek33mAN+88TeqojvO1vsb8M3un+3+hoT9mldeJsHwzVofid+/Gl2NM+YLK2T45ud7P5Ks2XqG7y72u2bNEY6Jv3vEXx0Ixk0dj8nY7xb5c1yY1HFhY360Vf3L/+/Qo0ePHj36z+t/ATIGuKytSWJLAAAAAElFTkSuQmCC",
  },
  doge: {
    src: QR_PNG_DIR + "/doge.png",
    alt: 'Dogecoin payment URI QR',
    bytes: "iVBORw0KGgoAAAANSUhEUgAAAZoAAAGaAQAAAAAefbjOAAACIklEQVR42u1cQW6EQAyLug/gSXydJ80DkNIlEycD7aHtrbI5IHYYX8BK7CSs+e+PwwQSSCCBBBJIIIEAsjxe10qc8qftfr63DGzYA/RhfzgE+h+gZES8aR8rI/zYsDZPtU+MYGDEFQX294s3286LDGeGDJ8x4roxQ4YYwcaIvIoMcSJ1iBHkMQLqoXKFGMGrI9ZAUWTYpSPoGGFtLsZ3J3kNMkb08dCTYT0ygrRl1dMj0RGTDAP1iB1pYr0rRpDEiGPqyRATq7bILcGS2iJGUOiIF5RlJIzOGtt1d3PPgpUYQaUsozhlKSWDFqDKPaDo6XEoy/aciBFZyp4xYq6JESyMgFJAUQLKMhxptcCkI4iUZb390gxHJZGlCypGcHmN1hFJgSBIyooh98nmNY6qOMy1rZsbZ+pOMYIpRqSOuCeRaoB21UqMoGDEdXXMFTRArSdmvA2HGMGkLLdbs7OCArrhihFEOmKvgTpHD6Pd55JOFCOYGJFeYw7UmUFolrZQPYKLEakjkhFhRgfKE6piEzIC/a21ANGRYchrUMaI7H16DWR7fblhoIoYQeI1Hu2u6SviClMR8hpcMcJQimgxscxH1Cy2dASRjuhZbMtPNXaUrhYfKkYw6QhYUPcvM1RFC2UNQkaMqmd3wigzKkbwMWKuoeO5ek71NSh1BCpUXvMR5204V4xg8xpL7eG5b6hmyViP0P+xCCSQQAIJJJBAPwV9AiO/9SLwyWEDAAAAAElFTkSuQmCC",
  },
};

export function qrPngMeta(id) {
  return QR_PNG[String(id || "")] || null;
}

export function qrPngPath(id) {
  const row = qrPngMeta(id);
  return row ? row.src : "";
}

export function qrImg(rail) {
  const row = qrPngMeta(rail && rail.id);
  if (!row) throw new Error("unknown donate QR");
  const alt = (rail && rail.qrAlt) || row.alt;
  return (
    '<img src="' + esc(row.src) + '" width="' + QR_PNG_SIZE + '" height="' + QR_PNG_SIZE + '" alt="' + esc(alt) + '">'
  );
}

export function qrKnownId(id) {
  return Object.prototype.hasOwnProperty.call(QR_PNG, String(id || ""));
}

export function isDonateQrPath(pathname) {
  const path = String(pathname || "");
  if (!path.startsWith(QR_PNG_DIR + "/") || !path.endsWith(".png")) return false;
  return qrKnownId(path.slice(QR_PNG_DIR.length + 1, -4));
}

function b64ToBytes(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function donateQrResponse(pathname, extraHeaders) {
  const path = String(pathname || "");
  if (!path.startsWith(QR_PNG_DIR + "/") || !path.endsWith(".png")) return null;
  const row = qrPngMeta(path.slice(QR_PNG_DIR.length + 1, -4));
  if (!row) return null;
  return new Response(b64ToBytes(row.bytes), {
    status: 200,
    headers: {
      "content-type": "image/png",
      "cache-control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      "X-Content-Type-Options": "nosniff",
      ...(extraHeaders || {}),
    },
  });
}
