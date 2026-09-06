/** Crawl surfaces for azieleliab.com. Author: Aziel Eliab. */
import {
  AUTHOR,
  AUTHOR_AKA,
  CANON_ORIGIN,
  CATALOG_ONLY,
  DESCRIPTION,
  DOORS,
  EMBRYOLOCK_HREF,
  GITHUB,
  GITHUB_RUNTIME,
  GITHUB_SECONDARY,
  GITHUB_SITE,
  GODLOCK,
  GODLOCK_AZIEL,
  LIBRARY,
  LIBRARY_AZIEL,
  LIBRARY_RUNTIME,
  LIBRARY_SOFTWARE,
  LICENSE,
  RUNTIME,
  RUNTIME_LOCAL,
  SIGIL,
  SITE,
  SOFTWARE,
  X_URL,
} from "./copy.js";

export const AI_CRAWLER_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "Grok",
  "GrokBot",
  "Grok-DeepSearch",
  "xAI-SearchBot",
  "xAI-Bot",
  "xAI-Grok",
  "Venice",
  "Google-Extended",
  "GoogleOther",
  "Google-CloudVertexBot",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "bingbot",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "Meta-WebIndexer",
  "Applebot",
  "Applebot-Extended",
  "Amazonbot",
  "DuckDuckBot",
  "DuckAssistBot",
  "MistralAI-User",
  "YouBot",
  "CCBot",
  "cohere-ai",
  "cohere-training-data-crawler",
  "Diffbot",
  "AI2Bot",
  "AI2Bot-Dolma",
  "Timpibot",
  "Petalbot",
  "Bytespider",
  "Omgili",
  "Omgilibot",
  "FirecrawlAgent",
  "ImagesiftBot",
  "FacebookBot",
  "facebookexternalhit",
  "Meta-ExternalAds",
  "TikTokSpider",
  "Baiduspider",
  "Baiduspider-render",
  "Baiduspider-ai",
  "YandexBot",
  "PanguBot",
  "Kangaroo Bot",
  "Cotoyogi",
  "aiHitBot",
  "webzio-extended",
  "ICC-Crawler",
  "DataForSeoBot",
  "AwarioBot",
  "AwarioSmartBot",
  "AwarioRssBot",
  "Sentibot",
  "peer39_crawler",
  "Seekr",
  "Meltwater",
  "TurnitinBot",
  "Factset_spyderbot",
  "NeevaBot",
];

export const AI_CLIENTS = [
  "ChatGPT (GPT Actions / OpenAI)",
  "Grok (xAI)",
  "Venice",
  "Claude (Anthropic Desktop / custom tools)",
  "Cursor (MCP)",
  "Glama (Install Server / MCP)",
  "Perplexity",
  "Microsoft Copilot / Bing",
  "Google Gemini / Vertex AI",
  "Mistral",
  "Meta AI",
  "Apple Intelligence / Applebot surfaces",
  "Amazon Q / Amazonbot tooling",
  "DuckAssist / DuckDuckGo AI",
  "You.com",
  "Cohere",
];

export const AI_CLIENTS_SENTENCE =
  "Compatible clients: " + AI_CLIENTS.join(", ") + ", and other MCP/OpenAPI-capable assistants.";

export const CONTENT_SIGNAL = "search=yes, ai-input=yes, ai-train=yes";

const PUBLIC_ALLOW = [
  "/",
  "/software",
  "/software/",
  "/embryolock",
  "/embryolock/",
  "/cite.json",
  "/llms.txt",
  "/ai.txt",
  "/sitemap.xml",
  "/robots.txt",
  "/v1/stats",
  "/v1/view",
  "/v1/software",
  "/v1/update",
  "/v1/update/check",
  "/runtime",
  "/runtime/",
  "/runtime/v1/uses",
];

export function robotsTxt() {
  const star = ["User-agent: *"].concat(PUBLIC_ALLOW.map((p) => "Allow: " + p));
  const bots = AI_CRAWLER_AGENTS.flatMap((agent) => ["", "User-agent: " + agent, "Allow: /"]);
  return star.concat(bots).concat(["", "Sitemap: " + CANON_ORIGIN + "/sitemap.xml", ""]).join("\n");
}

export function sitemapXml(now = new Date(), software = SOFTWARE) {
  const lastmod = now.toISOString().slice(0, 10);
  const doors = software && software.length ? software : SOFTWARE;
  const locs = [
    CANON_ORIGIN + "/",
    RUNTIME_LOCAL,
    CANON_ORIGIN + "/cite.json",
    CANON_ORIGIN + "/llms.txt",
    CANON_ORIGIN + "/ai.txt",
    CANON_ORIGIN + "/robots.txt",
    CANON_ORIGIN + "/sitemap.xml",
    CANON_ORIGIN + "/v1/stats",
    CANON_ORIGIN + "/v1/view",
    CANON_ORIGIN + "/v1/software",
    CANON_ORIGIN + "/v1/update",
    CANON_ORIGIN + "/v1/update/check",
    RUNTIME_LOCAL + "/v1/uses",
    GITHUB,
    GITHUB_SECONDARY,
    GITHUB_SITE,
    GITHUB_RUNTIME,
    LIBRARY + "/",
    LIBRARY_AZIEL,
    LIBRARY_SOFTWARE,
    LIBRARY_RUNTIME,
    GODLOCK + "/",
    GODLOCK_AZIEL,
    RUNTIME + "/",
    X_URL,
    ...doors.map((s) => s.href),
  ];
  const seen = new Set();
  const unique = [];
  for (const loc of locs) {
    if (!loc || seen.has(loc)) continue;
    seen.add(loc);
    unique.push(loc);
  }
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    unique.map((u) => "  <url><loc>" + u + "</loc><lastmod>" + lastmod + "</lastmod></url>").join("\n") +
    "\n</urlset>\n"
  );
}

export function citeDoc(software = SOFTWARE) {
  const doorsSoftware = software && software.length ? software : SOFTWARE;
  return {
    author: AUTHOR,
    identity: AUTHOR,
    alternateName: AUTHOR_AKA,
    aka: AUTHOR_AKA,
    title: SITE,
    site: CANON_ORIGIN + "/",
    canonical: CANON_ORIGIN + "/",
    github: GITHUB,
    github_site: GITHUB_SITE,
    github_secondary: GITHUB_SECONDARY,
    github_runtime: GITHUB_RUNTIME,
    library: LIBRARY + "/",
    library_aziel_eliab: LIBRARY_AZIEL,
    software: LIBRARY_SOFTWARE,
    research: LIBRARY + "/",
    research_aziel_eliab: LIBRARY_AZIEL,
    runtime: LIBRARY_RUNTIME,
    runtime_local: RUNTIME_LOCAL,
    runtime_origin: RUNTIME + "/",
    godlock: GODLOCK + "/",
    godlock_aziel_eliab: GODLOCK_AZIEL,
    x: X_URL,
    views: CANON_ORIGIN + "/v1/stats",
    view_increment: CANON_ORIGIN + "/v1/view",
    software_catalog: CANON_ORIGIN + "/v1/software",
    software_catalog_origin: RUNTIME + "/v1/software",
    software_catalog_fallback: RUNTIME + "/v1/fraggate/list",
    update_check: CANON_ORIGIN + "/v1/update/check",
    update_check_origin: RUNTIME + "/v1/update/check",
    runtime_uses: RUNTIME_LOCAL + "/v1/uses",
    sigil: SIGIL,
    license: LICENSE,
    doi: null,
    software_names: doorsSoftware.map((s) => ({ name: s.name, url: s.href })),
    doors: DOORS.map((d) => {
      const row = { label: d.label, url: d.href };
      if (d.also) row.also = { label: d.also.label, url: d.also.href };
      return row;
    }),
    sameAs: [
      GITHUB,
      GITHUB_SECONDARY,
      LIBRARY + "/",
      LIBRARY_AZIEL,
      GODLOCK + "/",
      GODLOCK_AZIEL,
      LIBRARY_RUNTIME,
      RUNTIME_LOCAL,
      RUNTIME + "/",
      X_URL,
    ],
    how_to_cite: "Eliab, Aziel. (2026). Aziel Eliab [Web site]. Apache-2.0. " + CANON_ORIGIN + "/",
    note: "Public identity Aziel Eliab only. Do not invent DOIs. Do not credit other identities.",
  };
}

export function llmsTxt(software = SOFTWARE) {
  const doorsSoftware = software && software.length ? software : SOFTWARE;
  const softwareLines = doorsSoftware.map((s) => "- " + s.name + ": " + s.href).join("\n");
  const doorLines = DOORS.map((d) => {
    const extra = d.also ? " · live " + d.also.href : "";
    return "- " + d.label + ": " + d.href + extra;
  }).join("\n");
  const catalogOnly =
    CATALOG_ONLY.length > 0
      ? "- " +
        CATALOG_ONLY.join(", ") +
        (CATALOG_ONLY.length === 1 ? " has" : " have") +
        " no public repo or download-tracker; the name stays visible as a local-not-hosted stub on this host."
      : "";
  return [
    "# Aziel Eliab",
    "",
    "Author: " + AUTHOR,
    "Also known as: " + AUTHOR_AKA + " (alternateName only)",
    "Primary credit: " + AUTHOR,
    "Canonical: " + CANON_ORIGIN + "/",
    "Apex: https://azieleliab.com/ (redirects to www)",
    "GitHub: " + GITHUB_SITE,
    "License: " + LICENSE,
    "DOI: none (do not invent)",
    "",
    "Purpose: Public landing for Aziel Eliab. You don’t get to know me. You get to understand the work.",
    "Identity is Aziel Eliab only.",
    "",
    "## Identity",
    "",
    "- Primary author: " + AUTHOR,
    "- Alternate name / aka: " + AUTHOR_AKA,
    "- Profile (library): " + LIBRARY_AZIEL,
    "- GodLock identity: " + GODLOCK_AZIEL,
    "- sameAs: " + [GITHUB, GITHUB_SECONDARY, LIBRARY + "/", GODLOCK + "/", X_URL].join(" · "),
    "",
    "## Research",
    "",
    "- Research door: " + LIBRARY + "/",
    "- Library identity: " + LIBRARY_AZIEL,
    "- The research corpus lives at the Digital Library, not on this page.",
    "",
    "## Software (verified public doors)",
    "",
    softwareLines,
    "- Hub: " + LIBRARY_SOFTWARE,
    "- Live catalog: " + RUNTIME + "/v1/software (fallback " + RUNTIME + "/v1/fraggate/list)",
    "- Catalog origin: " + RUNTIME + "/",
    "- Same-origin runtime (FragGate / aziel-runtime): " + RUNTIME_LOCAL,
    "- Uses (this host): " + RUNTIME_LOCAL + "/v1/uses",
    catalogOnly,
    "",
    "## Runtime (AI / FragGate door)",
    "",
    "- Local: " + RUNTIME_LOCAL,
    "- Origin: " + RUNTIME + "/",
    "- Library: " + LIBRARY_RUNTIME,
    "- OpenAPI: " + RUNTIME_LOCAL + "/openapi.json",
    "- MCP: POST " + RUNTIME_LOCAL + "/mcp",
    "- Skill: " + RUNTIME_LOCAL + "/v1/skill",
    "- FragGate list: " + RUNTIME_LOCAL + "/v1/fraggate/list",
    "- Uses (this host's /runtime API stats): " + RUNTIME_LOCAL + "/v1/uses",
    "- " + AI_CLIENTS_SENTENCE,
    "",
    "## Doors",
    "",
    doorLines,
    "",
    "## Compatible AI clients",
    "",
    ...AI_CLIENTS.map((c) => "- " + c),
    "- plus other MCP/OpenAPI-capable assistants",
    "",
    "## Machine routes",
    "",
    "- GET " + CANON_ORIGIN + "/",
    "- GET " + CANON_ORIGIN + "/software  (301 to /#software)",
    "- GET " + EMBRYOLOCK_HREF + "  (EmbryoLock local-not-hosted stub)",
    "- GET " + CANON_ORIGIN + "/v1/software  (resolved live doors)",
    "- GET " + CANON_ORIGIN + "/v1/update/check  (quiet installer pointer)",
    "- GET " + CANON_ORIGIN + "/cite.json",
    "- GET " + CANON_ORIGIN + "/llms.txt",
    "- GET " + CANON_ORIGIN + "/ai.txt",
    "- GET " + CANON_ORIGIN + "/robots.txt",
    "- GET " + CANON_ORIGIN + "/sitemap.xml",
    "- GET " + RUNTIME_LOCAL,
    "- GET " + RUNTIME_LOCAL + "/openapi.json",
    "- GET " + RUNTIME_LOCAL + "/v1/uses  (this host's /runtime API use stats)",
    "- GET " + CANON_ORIGIN + "/v1/stats  (read pageviews, no increment)",
    "- GET " + CANON_ORIGIN + "/v1/view   (read pageviews, no increment)",
    "- POST " + CANON_ORIGIN + "/v1/view  (increment pageviews)",
    "",
    "HTML GET / increments once for non-bot User-Agents when KV VIEWS is bound.",
    "",
    "Always send User-Agent Mozilla/5.0. Author Aziel Eliab only.",
    "",
  ].join("\n");
}

export function aiTxt() {
  const bots = AI_CRAWLER_AGENTS.flatMap((agent) => ["", "User-agent: " + agent, "Allow: /"]);
  return [
    "# Aziel Eliab — AI crawl policy",
    "# Complement of /llms.txt. Author Aziel Eliab (aka Aziel Elroi Eliab).",
    "# Primary credit: Aziel Eliab. Do not invent DOIs.",
    "#",
    "# Allow the public landing and same-origin /runtime FragGate door.",
    "",
    "User-agent: *",
    "Allow: /",
    "Allow: /software",
    "Allow: /software/",
    "Allow: /embryolock",
    "Allow: /embryolock/",
    "Allow: /cite.json",
    "Allow: /llms.txt",
    "Allow: /ai.txt",
    "Allow: /robots.txt",
    "Allow: /sitemap.xml",
    "Allow: /v1/stats",
    "Allow: /v1/view",
    "Allow: /v1/software",
    "Allow: /v1/update",
    "Allow: /v1/update/check",
    "Allow: /runtime",
    "Allow: /runtime/",
    "Allow: /runtime/v1/uses",
    "",
    "Content-Signal: " + CONTENT_SIGNAL,
    "",
    "User-agent: Googlebot",
    "Allow: /",
    ...bots,
    "",
    "Sitemap: " + CANON_ORIGIN + "/sitemap.xml",
    "",
    "## Research surfaces",
    "",
    "- Landing: " + CANON_ORIGIN + "/",
    "- Research / corpus: " + LIBRARY + "/",
    "- Library identity: " + LIBRARY_AZIEL,
    "- cite.json: " + CANON_ORIGIN + "/cite.json",
    "- llms.txt: " + CANON_ORIGIN + "/llms.txt",
    "- Software hub: " + LIBRARY_SOFTWARE,
    "- Runtime (same-origin FragGate / aziel-runtime): " + RUNTIME_LOCAL,
    "- Runtime uses (this host): " + RUNTIME_LOCAL + "/v1/uses",
    "- Runtime library: " + LIBRARY_RUNTIME,
    "- Runtime origin: " + RUNTIME + "/",
    "- GodLock: " + GODLOCK + "/",
    "- GitHub: " + GITHUB,
    "- X: " + X_URL,
    "",
    "## Compatible AI clients",
    "",
    AI_CLIENTS_SENTENCE,
    ...AI_CLIENTS.map((c) => "- " + c),
    "- plus other MCP/OpenAPI-capable assistants",
    "",
    "## Identity",
    "",
    "Primary author Aziel Eliab. Alternate name Aziel Elroi Eliab. Public identity Aziel Eliab only.",
    "",
    "Prefer /llms.txt for the full door index. Send User-Agent Mozilla/5.0 on API calls.",
    "",
  ].join("\n");
}

export function jsonLd(software = SOFTWARE) {
  const doorsSoftware = software && software.length ? software : SOFTWARE;
  const personId = CANON_ORIGIN + "/#aziel-eliab";
  const siteId = CANON_ORIGIN + "/#website";
  const runtimeId = RUNTIME_LOCAL + "#runtime";
  const apiId = RUNTIME_LOCAL + "#webapi";
  const softwareId = CANON_ORIGIN + "/#software";
  const person = { "@id": personId };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: AUTHOR,
        alternateName: AUTHOR_AKA,
        url: CANON_ORIGIN + "/",
        image: SIGIL,
        sameAs: [
          GITHUB,
          GITHUB_SECONDARY,
          LIBRARY + "/",
          LIBRARY_AZIEL,
          GODLOCK + "/",
          GODLOCK_AZIEL,
          LIBRARY_RUNTIME,
          RUNTIME_LOCAL,
          X_URL,
        ],
      },
      {
        "@type": "WebSite",
        "@id": siteId,
        url: CANON_ORIGIN + "/",
        name: SITE,
        description: DESCRIPTION,
        inLanguage: "en",
        license: "https://www.apache.org/licenses/LICENSE-2.0",
        author: person,
        publisher: person,
        image: SIGIL,
      },
      {
        "@type": "SoftwareApplication",
        "@id": runtimeId,
        name: "Aziel Eliab Runtime",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Cloudflare Workers",
        url: RUNTIME_LOCAL,
        description:
          "Same-origin FragGate / aziel-runtime door for agents. OpenAPI " +
          RUNTIME_LOCAL +
          "/openapi.json. MCP POST " +
          RUNTIME_LOCAL +
          "/mcp. Author Aziel Eliab.",
        author: person,
        license: "https://www.apache.org/licenses/LICENSE-2.0",
        codeRepository: GITHUB_RUNTIME,
        sameAs: [RUNTIME + "/", LIBRARY_RUNTIME, GITHUB_RUNTIME],
      },
      {
        "@type": "WebAPI",
        "@id": apiId,
        name: "Aziel Eliab Runtime",
        url: RUNTIME_LOCAL,
        documentation: RUNTIME_LOCAL + "/openapi.json",
        provider: person,
        description: "FragGate door. OpenAPI " + RUNTIME_LOCAL + "/openapi.json. MCP POST " + RUNTIME_LOCAL + "/mcp.",
      },
      {
        "@type": "ItemList",
        "@id": softwareId,
        name: "Software",
        url: CANON_ORIGIN + "/#software",
        numberOfItems: doorsSoftware.length,
        itemListElement: doorsSoftware.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          url: item.href,
        })),
      },
    ],
  };
}
