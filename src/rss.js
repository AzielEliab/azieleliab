/** RSS 2.0 for the canonical host. Author: Aziel Eliab.
 * Items are the existing human pages and the six Comics films.
 * No invented publication dates. Item links stay on www.azieleliab.com.
 */
import {
  AUTHOR,
  CANON_ORIGIN,
  COMICS,
  COMICS_DESCRIPTION,
  COMICS_HREF,
  DESCRIPTION,
  HUMAN_PAGES,
  HUMAN_TABS,
  LICENSE,
  SIGIL,
  SITE,
  humanTabUrl,
} from "./copy.js";

export const RSS_PATH = "/rss.xml";
export const RSS_HREF = CANON_ORIGIN + RSS_PATH;
/** Same document, one canonical URL. These paths 301 to RSS_HREF. */
export const RSS_ALIAS_PATHS = Object.freeze(["/feed.xml", "/feed", "/rss"]);

export function isRssAliasPath(path) {
  return RSS_ALIAS_PATHS.includes(path);
}

export function rssAlternateLink() {
  return (
    '<link rel="alternate" type="application/rss+xml" href="' +
    RSS_HREF +
    '" title="' +
    xmlText(SITE) +
    '">'
  );
}

function xmlText(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function xmlAttr(value) {
  return xmlText(value).replace(/"/g, "&quot;");
}

function itemXml(item) {
  return [
    "    <item>",
    "      <title>" + xmlText(item.title) + "</title>",
    "      <link>" + xmlText(item.link) + "</link>",
    '      <guid isPermaLink="true">' + xmlText(item.guid || item.link) + "</guid>",
    "      <description>" + xmlText(item.description) + "</description>",
    item.category ? "      <category>" + xmlText(item.category) + "</category>" : "",
    "    </item>",
  ]
    .filter(Boolean)
    .join("\n");
}

/** Comics newest first (the page lists them oldest first), then the standing pages. */
export function rssItems() {
  const films = COMICS.slice()
    .reverse()
    .map((film) => ({
      title: film.title,
      link: COMICS_HREF + "#" + film.id,
      guid: COMICS_HREF + "#" + film.id,
      description: film.line || COMICS_DESCRIPTION,
      category: "Comics",
    }));
  const pages = [...HUMAN_TABS, ...HUMAN_PAGES].map((tab) => ({
    title: tab.title,
    link: humanTabUrl(tab),
    guid: humanTabUrl(tab),
    description: tab.description,
  }));
  return films.concat(pages);
}

export function rssXml(now = new Date()) {
  const built = now instanceof Date ? now : new Date(now);
  const items = rssItems();
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    "    <title>" + xmlText(SITE) + "</title>",
    "    <link>" + xmlText(CANON_ORIGIN + "/") + "</link>",
    '    <atom:link href="' + xmlAttr(RSS_HREF) + '" rel="self" type="application/rss+xml"/>',
    "    <description>" + xmlText(DESCRIPTION) + "</description>",
    "    <language>en</language>",
    "    <copyright>" + xmlText(LICENSE + ". " + AUTHOR + ".") + "</copyright>",
    "    <lastBuildDate>" + xmlText(built.toUTCString()) + "</lastBuildDate>",
    "    <generator>azieleliab-com</generator>",
    "    <image>",
    "      <url>" + xmlText(SIGIL) + "</url>",
    "      <title>" + xmlText(SITE) + "</title>",
    "      <link>" + xmlText(CANON_ORIGIN + "/") + "</link>",
    "    </image>",
    items.map(itemXml).join("\n"),
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}
