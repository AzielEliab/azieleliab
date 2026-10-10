/** Verified works catalog. Author: Aziel Eliab. Source: data/aziel-works.json (2026-10-06). */
import catalog from "../data/aziel-works.json" with { type: "json" };
import { CANON_ORIGIN, PERSON_ID } from "./copy.js";

export const WORKS_PATH = "/works.json";
export const WORKS_HREF = CANON_ORIGIN + WORKS_PATH;
export const WEBSLING_URL = "https://www.azielcorpuslibrary.net/record/AZDOC-AA8761FE16D0";
export const WEBSLING_NAME = "Webslinger (Wearable Dual-Tether Web-Sling System)";
export const AZOS_URL = "https://github.com/AzielEliab/azos";

const DOI_URL = /https?:\/\/(?:dx\.)?doi\.org\/\S+|https?:\/\/(?:www\.)?zenodo\.org\/\S+/gi;

/**
 * Curated Person workExample. Featured, verified, no caution.
 * Pertinent works first, then a spread across software, sites, hardware, philosophy, papers, and the archive.
 */
export const CURATED_WORK_URLS = Object.freeze([
  "https://www.azieleliab.com/",
  "https://aziel-runtime.vibelock.workers.dev/",
  "https://github.com/AzielEliab/aziel-runtime",
  "https://trades-runtime.vibelock.workers.dev/",
  "https://github.com/AzielEliab/trades-runtime",
  AZOS_URL,
  "https://www.azielcorpuslibrary.net/record/AZDOC-E03E61D8E50B",
  "https://hedidntjump.com/",
  "https://hedidntjump.com/volumes",
  "https://hedidntjump.com/volumes/volume-1.pdf",
  "https://hedidntjump.com/volumes/volume-2.pdf",
  "https://hedidntjump.com/volumes/volume-3.pdf",
  "https://hedidntjump.com/volumes/volume-4.pdf",
  "https://hedidntjump.com/volumes/volume-5.pdf",
  "https://www.azielcorpuslibrary.net/record/AZDOC-E5828F49FB04",
  WEBSLING_URL,
  "https://www.azielcorpuslibrary.net/record/AZDOC-FE5C01BD8FEA",
  "https://godlock.uk/",
  "https://www.azielcorpuslibrary.net/",
  "https://github.com/AzielEliab/godlock",
  "https://github.com/AzielEliab/hedidntjump.com",
  "https://github.com/AzielEliab/aziel-corpus",
  "https://github.com/AzielEliab/azieleliab",
  "https://github.com/AzielEliab/zion-pattern-solver",
  "https://www.azielcorpuslibrary.net/record/AZDOC-0302B7357EE0",
  "https://www.azielcorpuslibrary.net/record/AZDOC-EED487D645C9",
  "https://www.azielcorpuslibrary.net/record/AZDOC-9B0E3D62EDCC",
  "https://www.azielcorpuslibrary.net/record/AZDOC-72FCD4486001",
  "https://www.azielcorpuslibrary.net/record/AZDOC-56EF7B9F55F1",
  "https://www.azielcorpuslibrary.net/record/AZDOC-D4BD09136A6C",
  "https://www.azielcorpuslibrary.net/record/AZDOC-A004166120D6",
  "https://www.azielcorpuslibrary.net/record/AZDOC-8F14A40DC9A6",
  "https://www.azielcorpuslibrary.net/record/AZDOC-85CCF1A0FACC",
  "https://www.azielcorpuslibrary.net/record/AZDOC-B7D88B43A713",
  "https://www.azielcorpuslibrary.net/record/AZDOC-B5094327857E",
  "https://www.azielcorpuslibrary.net/record/AZDOC-A53F8E3052E2",
  "https://www.azielcorpuslibrary.net/record/AZDOC-DD5912D05D6E",
  "https://www.azielcorpuslibrary.net/record/AZDOC-DA5DBAC05F5D",
  "https://www.azielcorpuslibrary.net/record/AZDOC-F22AD0DCAA9D",
  "https://www.azielcorpuslibrary.net/record/AZDOC-01A21AAEBB46",
  "https://www.azielcorpuslibrary.net/record/AZDOC-E00603883906",
  "https://www.azielcorpuslibrary.net/record/AZDOC-E3ABDBF3A1EA",
  "https://www.azielcorpuslibrary.net/record/AZDOC-0671040C36E6",
  "https://www.azielcorpuslibrary.net/record/AZDOC-4ED766254A4A",
  "https://www.azielcorpuslibrary.net/record/AZDOC-530DB601B505",
  "https://www.azielcorpuslibrary.net/record/AZDOC-6358FBBBC153",
  "https://www.azielcorpuslibrary.net/record/AZDOC-EF7EB159CB56",
]);

function cleanText(value) {
  return String(value || "")
    .replace(DOI_URL, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function workDisplayName(item) {
  const url = item && item.url;
  if (url === WEBSLING_URL || /Wearable Dual-Tether Web-Sling/i.test(item && item.name)) {
    return WEBSLING_NAME;
  }
  if (url === AZOS_URL) return "AZ-OS";
  return item.name;
}

function publicWork(item, category) {
  if (!item || item.verified !== true) return null;
  if (item.caution) return null;
  if (item.own_software === false) return null;
  const url = String(item.url || "");
  if (!url || /doi\.org|zenodo\.org/i.test(url)) return null;
  let type = item.type || "CreativeWork";
  if (category === "hardware") type = "Product";
  // Live apps stay WebSite so the film-theater Person does not look like the hub Software catalog.
  if (type === "SoftwareApplication") type = "WebSite";
  let domain = cleanText(item.domain);
  if (/not an ARG or game/i.test(domain)) domain = "history (document archive)";
  return {
    category,
    name: workDisplayName(item),
    url,
    type,
    description: cleanText(item.description),
    domain,
  };
}

/** Verified works plus directory listings. Caution notes and Zenodo-only URLs stay out. */
export function machineWorks() {
  const seen = new Set();
  const out = [];
  for (const [category, items] of Object.entries(catalog.categories || {})) {
    for (const item of items || []) {
      const row = publicWork(item, category);
      if (!row || seen.has(row.url)) continue;
      seen.add(row.url);
      out.push(row);
    }
  }
  return out;
}

export function authoredWorks() {
  return machineWorks().filter((row) => row.category !== "listings");
}

export function curatedWorks() {
  const byUrl = new Map(authoredWorks().map((row) => [row.url, row]));
  return CURATED_WORK_URLS.map((url) => {
    const row = byUrl.get(url);
    if (!row) throw new Error("curated work missing from verified catalog: " + url);
    return row;
  });
}

export function workNode(row) {
  const node = {
    "@type": row.type,
    name: row.name,
    url: row.url,
  };
  if (row.description) node.description = row.description;
  return node;
}

export function curatedWorkNodes() {
  return curatedWorks().map(workNode);
}

export function worksLlmsBlock() {
  const lines = [
    "## Works",
    "",
    "Verified works for " + PERSON_ID + ". HTTP 200 in the 2026-10-06 catalog. No doi.org or Zenodo URLs. He Didn't Jump is a document archive. Full list: " + WORKS_HREF,
    "",
  ];
  let category = "";
  for (const row of machineWorks()) {
    if (row.category !== category) {
      category = row.category;
      lines.push("### " + category);
      lines.push("");
    }
    lines.push("- " + row.name + ": " + row.url + (row.description ? " — " + row.description : ""));
  }
  lines.push("");
  return lines.join("\n");
}

export function worksDoc() {
  const works = machineWorks();
  return {
    person_id: PERSON_ID,
    name: "Aziel Eliab",
    url: WORKS_HREF,
    generated_from: "data/aziel-works.json",
    catalog_generated: catalog.generated || null,
    note:
      "Verified URLs only. Items with a caution note are omitted. doi.org and Zenodo URLs are omitted. He Didn't Jump is a document archive. Listings are directories, not sameAs profiles.",
    count: works.length,
    works,
  };
}
