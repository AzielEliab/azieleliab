import { describe, it } from "node:test";
import assert from "node:assert/strict";
import worker, { apexRedirect, handleRequest } from "../src/index.js";
import { pageHtml } from "../src/page.js";
import { aiTxt, citeDoc, jsonLd, llmsTxt, robotsTxt, sitemapXml } from "../src/seo.js";
import {
  AUTHOR,
  CANON_ORIGIN,
  CATALOG_ONLY,
  DOORS,
  LIBRARY_SOFTWARE,
  PROSE,
  SOFTWARE,
} from "../src/copy.js";

async function fetchPath(path, init = {}) {
  const request = new Request("https://www.azieleliab.com" + path, init);
  return worker.fetch(request);
}

describe("landing copy", () => {
  it("keeps the exact opening, why, research, and close", () => {
    const html = pageHtml();
    for (const line of [...PROSE.open, ...PROSE.why, ...PROSE.research, PROSE.close, PROSE.sign, PROSE.softwareClose]) {
      assert.ok(html.includes(line), "missing copy: " + line);
    }
    assert.ok(html.includes("Aziel Eliab"));
    assert.ok(html.includes("azieleliab.com"));
  });

  it("uses white / near-white body color and no royal-purple body text", () => {
    const html = pageHtml();
    assert.match(html, /--ink:#ffffff/);
    assert.match(html, /--bg:#0e0c09/);
    assert.match(html, /--bg-lift:#12100c/);
    assert.match(html, /--gold:#c9a227/);
    assert.doesNotMatch(html, /--royal|#6b3fa0|#4a2870/);
    assert.ok(html.includes("soft-card") || html.includes("class=\"card\"") || html.includes("class=\"card lead\""));
  });

  it("includes the everblooming sigil", () => {
    assert.ok(pageHtml().includes("https://www.azielcorpuslibrary.net/sigil.png"));
  });
});

describe("software doors", () => {
  it("hyperlinks every SOFTWARE name to a verified URL", () => {
    const html = pageHtml();
    assert.equal(SOFTWARE.length, 20);
    for (const item of SOFTWARE) {
      const needle = 'href="' + item.href + '"';
      assert.ok(html.includes(needle), "missing href for " + item.name);
      assert.ok(html.includes(">" + item.name + "<"), "missing visible name " + item.name);
    }
    assert.ok(html.includes("Run them without me."));
  });

  it("does not invent dead EmbryoLock / Lumen / PeaceLock product URLs", () => {
    const html = pageHtml();
    for (const name of CATALOG_ONLY) {
      const item = SOFTWARE.find((s) => s.name === name);
      assert.equal(item.href, LIBRARY_SOFTWARE);
      assert.ok(html.includes(">" + name + "<"));
      assert.doesNotMatch(html, new RegExp(name.toLowerCase() + "-download-tracker"));
    }
  });

  it("prefers known GodLock / runtime / FragGate doors", () => {
    const byName = Object.fromEntries(SOFTWARE.map((s) => [s.name, s.href]));
    assert.equal(byName.GodLock, "https://godlock.uk/");
    assert.equal(byName["aziel-runtime"], "https://aziel-runtime.vibelock.workers.dev/");
    assert.equal(byName.FragGate, "https://github.com/AzielEliab/fraggate");
  });
});

describe("doors", () => {
  it("hyperlinks every door label and URL", () => {
    const html = pageHtml();
    for (const door of DOORS) {
      assert.ok(html.includes('href="' + door.href + '"'), door.label);
      assert.ok(html.includes(">" + door.label + "<"), door.label + " label");
      assert.ok(html.includes(">" + door.href + "<") || html.includes(door.href + "</a>"), door.label + " url text");
      if (door.also) {
        assert.ok(html.includes('href="' + door.also.href + '"'));
        assert.ok(html.includes(door.also.label));
      }
    }
  });
});

describe("SEO routes", () => {
  it("serves robots.txt Allow / plus sitemap", async () => {
    const res = await fetchPath("/robots.txt");
    assert.equal(res.status, 200);
    const body = await res.text();
    assert.ok(body.includes("User-agent: *"));
    assert.ok(body.includes("Allow: /"));
    assert.ok(body.includes("Sitemap: " + CANON_ORIGIN + "/sitemap.xml"));
    assert.ok(body.includes("User-agent: GPTBot"));
    assert.equal(robotsTxt(), body);
  });

  it("serves llms.txt, ai.txt, cite.json, sitemap.xml", async () => {
    const llms = await fetchPath("/llms.txt");
    const ai = await fetchPath("/ai.txt");
    const cite = await fetchPath("/cite.json");
    const map = await fetchPath("/sitemap.xml");
    assert.equal(llms.status, 200);
    assert.equal(ai.status, 200);
    assert.equal(cite.status, 200);
    assert.equal(map.status, 200);
    const llmsBody = await llms.text();
    const aiBody = await ai.text();
    const citeBody = await cite.json();
    const mapBody = await map.text();
    assert.ok(llmsBody.includes("Author: " + AUTHOR));
    assert.ok(llmsBody.includes("Canonical: " + CANON_ORIGIN + "/"));
    assert.ok(aiBody.includes("Allow: /"));
    assert.ok(aiBody.includes("Content-Signal"));
    assert.equal(citeBody.author, AUTHOR);
    assert.equal(citeBody.canonical, CANON_ORIGIN + "/");
    assert.equal(citeBody.identity, AUTHOR);
    assert.ok(mapBody.includes("<loc>" + CANON_ORIGIN + "/</loc>"));
    assert.equal(llmsTxt().trim(), llmsBody.trim());
    assert.equal(aiTxt().trim(), aiBody.trim());
    assert.deepEqual(citeBody, citeDoc());
    assert.ok(sitemapXml().includes(CANON_ORIGIN + "/"));
  });

  it("embeds Person + WebSite JSON-LD and a www canonical", () => {
    const html = pageHtml();
    assert.ok(html.includes('rel="canonical" href="' + CANON_ORIGIN + '/"'));
    const ld = jsonLd();
    assert.equal(ld["@graph"][0]["@type"], "Person");
    assert.equal(ld["@graph"][0].name, AUTHOR);
    assert.equal(ld["@graph"][1]["@type"], "WebSite");
    assert.equal(ld["@graph"][1].url, CANON_ORIGIN + "/");
    assert.ok(html.includes('"@type":"Person"'));
    assert.ok(html.includes('"@type":"WebSite"'));
  });
});

describe("worker routing", () => {
  it("serves the landing on GET /", async () => {
    const res = await fetchPath("/");
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type"), /text\/html/);
    const body = await res.text();
    assert.ok(body.includes("<h1>Aziel Eliab</h1>"));
  });

  it("301s apex to www", async () => {
    const res = await handleRequest(new Request("https://azieleliab.com/llms.txt"));
    assert.equal(res.status, 301);
    assert.equal(res.headers.get("location"), CANON_ORIGIN + "/llms.txt");
    assert.equal(apexRedirect(new URL("https://azieleliab.com/")), CANON_ORIGIN + "/");
  });

  it("answers HEAD and rejects POST", async () => {
    const head = await fetchPath("/", { method: "HEAD" });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), "");
    const post = await fetchPath("/", { method: "POST" });
    assert.equal(post.status, 405);
  });

  it("returns a literary 404", async () => {
    const res = await fetchPath("/no-such-door");
    assert.equal(res.status, 404);
    const body = await res.text();
    assert.ok(body.includes("This path is not a door."));
  });
});
