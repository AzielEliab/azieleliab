import { describe, it } from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";
import { comicsHtml, pageHtml, siteFooterHtml, whoHtml } from "../src/page.js";
import { filmTheaterHtml } from "../src/film.js";
import { aiTxt, citeDoc, llmsTxt, robotsTxt, sitemapXml } from "../src/seo.js";
import { rssItems, rssXml, RSS_HREF, RSS_PATH } from "../src/rss.js";
import {
  AUTHOR,
  CANON_ORIGIN,
  COMICS,
  DESCRIPTION,
  DONATE_HREF,
  HUMAN_PAGES,
  HUMAN_TABS,
  humanTabUrl,
} from "../src/copy.js";

function isolatedEnv() {
  return { VIEWS: { get: async () => null, put: async () => {} } };
}

async function fetchPath(path, host = "www.azieleliab.com") {
  const request = new Request("https://" + host + path);
  return worker.fetch(request, isolatedEnv());
}

function itemBlocks(xml) {
  return xml.match(/<item>[\s\S]*?<\/item>/g) || [];
}

describe("RSS feed", () => {
  it("lists the six films newest first, then the standing pages, with no invented dates", () => {
    const items = rssItems();
    const films = COMICS.slice().reverse();
    assert.deepEqual(
      items.slice(0, films.length).map((row) => row.title),
      films.map((film) => film.title),
    );
    assert.deepEqual(
      items.slice(films.length).map((row) => row.link),
      [...HUMAN_TABS, ...HUMAN_PAGES].map((tab) => humanTabUrl(tab)),
    );
    assert.equal(items.find((row) => row.title === "Donate").link, DONATE_HREF);
    const xml = rssXml(new Date("2026-11-27T05:46:12.000Z"));
    assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
    assert.ok(xml.includes('<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">'));
    assert.ok(xml.includes("<title>" + AUTHOR + "</title>"));
    assert.ok(xml.includes("<link>" + CANON_ORIGIN + "/</link>"));
    assert.ok(
      xml.includes(
        '<atom:link href="' + RSS_HREF + '" rel="self" type="application/rss+xml"/>',
      ),
    );
    assert.ok(xml.includes("<description>" + DESCRIPTION.replace(/&/g, "&amp;") + "</description>"));
    assert.ok(xml.includes("<lastBuildDate>Fri, 27 Nov 2026 05:46:12 GMT</lastBuildDate>"));
    assert.ok(xml.includes("<language>en</language>"));
    assert.equal(itemBlocks(xml).length, items.length);
    assert.doesNotMatch(xml, /<item>[\s\S]*?<pubDate>/);
    assert.ok(!xml.includes("https://azieleliab.com/"));
    assert.ok(!xml.includes("download-tracker"));
    assert.ok(!xml.includes("x.com/"));
    assert.ok(xml.includes("Don't cut. Keep rolling."));
    assert.ok(xml.includes('id="the-psyop"') === false);
    for (const block of itemBlocks(xml)) {
      assert.match(block, /<title>[^<]+<\/title>/);
      assert.match(block, /<link>https:\/\/www\.azieleliab\.com\/[^<]*<\/link>/);
      assert.match(block, /<guid isPermaLink="true">https:\/\/www\.azieleliab\.com\/[^<]*<\/guid>/);
      assert.match(block, /<description>[\s\S]*<\/description>/);
      assert.equal(block.includes("&amp;") || !block.includes("&"), true);
    }
  });

  it("serves /rss.xml and redirects the aliases to that canonical URL", async () => {
    const res = await fetchPath(RSS_PATH);
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type"), /application\/rss\+xml/);
    const body = await res.text();
    assert.equal(body, rssXml(new Date(body.match(/<lastBuildDate>([^<]+)<\/lastBuildDate>/)[1])));
    assert.ok(body.includes(RSS_HREF));

    for (const path of ["/feed.xml", "/feed", "/rss", "/rss.xml/"]) {
      const alias = await fetchPath(path === "/rss.xml/" ? "/rss.xml/" : path);
      if (path === "/rss.xml/") {
        assert.equal(alias.status, 200, path);
        assert.match(alias.headers.get("content-type"), /application\/rss\+xml/);
      } else {
        assert.equal(alias.status, 301, path);
        assert.equal(alias.headers.get("location"), RSS_HREF);
      }
    }

    const apex = await fetchPath("/rss.xml", "azieleliab.com");
    assert.equal(apex.status, 301);
    assert.equal(apex.headers.get("location"), RSS_HREF);
  });

  it("is listed for crawlers and linked from HTML", () => {
    assert.ok(robotsTxt().includes("Allow: /rss.xml"));
    assert.ok(aiTxt().includes("Allow: /rss.xml"));
    assert.ok(sitemapXml().includes("<loc>" + RSS_HREF + "</loc>"));
    assert.ok(llmsTxt().includes("GET " + RSS_HREF));
    assert.equal(citeDoc().rss, RSS_HREF);
    const link = 'rel="alternate" type="application/rss+xml" href="' + RSS_HREF + '"';
    for (const html of [filmTheaterHtml(), pageHtml(), comicsHtml(), whoHtml()]) {
      assert.ok(html.includes(link), "head alternate");
      const body = html.split(/<body[^>]*>/i)[1] || "";
      assert.equal(body.includes(RSS_HREF), false);
      assert.equal(body.includes("application/rss+xml"), false);
      assert.doesNotMatch(body, />rss</i);
    }
    const footer = siteFooterHtml();
    assert.equal(footer.includes(RSS_HREF), false);
    assert.equal(footer.includes('href="' + RSS_HREF + '"'), false);
    assert.doesNotMatch(footer, />rss</i);
    assert.ok(comicsHtml().includes('id="aziel-boards-the-plane"'));
  });
});
