/** Exact landing copy and verified public doors. Author: Aziel Eliab. */
import { CATALOG_PURPOSE } from "./softwareCopy.js";

export const CANON_ORIGIN = "https://www.azieleliab.com";
export const APEX_HOST = "azieleliab.com";
export const WWW_HOST = "www.azieleliab.com";
export const AUTHOR = "Aziel Eliab";
export const AUTHOR_AKA = "Aziel Elroi Eliab";
/** Canonical aka only. Hebrew forms and misspellings are SEO tethers, not extra identities. */
export const AUTHOR_AKA_LIST = [
  "Aziel Elroi Eliab",
  "Elias Artista",
  "AzielEliab",
  "AzielElroiEliab",
  "The Revealer of The Sealed",
  "Revealer of The Sealed",
];
export const SITE = "Aziel Eliab";
/** Same-origin hosted rose-star brand mark. Donate / brandrow do not fetch the corpus. */
export const BRANDMARK_NAME = "rose-star brand mark";
export const SIGIL_PATH = "/sigil.png";
export const SIGIL = CANON_ORIGIN + SIGIL_PATH;
export const BRANDMARK_PATH = SIGIL_PATH;
export const BRANDMARK = SIGIL;
/** Cite only. Flaky corpus fetch is not the page image. */
export const SIGIL_CORPUS = "https://www.azielcorpuslibrary.net/sigil.png";
export const LICENSE = "Apache-2.0";

export const GITHUB = "https://github.com/AzielEliab";
export const GITHUB_SECONDARY = "https://github.com/azieltherevealerofthesealed-arch";
export const GITHUB_SITE = "https://github.com/AzielEliab/azieleliab";
export const GITHUB_RUNTIME = "https://github.com/AzielEliab/aziel-runtime";
export const GITHUB_QNM_NODE = "https://github.com/AzielEliab/qnm-node";
export const LIBRARY = "https://www.azielcorpuslibrary.net";
export const LIBRARY_SOFTWARE = LIBRARY + "/software";
export const LIBRARY_RUNTIME = LIBRARY + "/runtime";
export const LIBRARY_AZIEL = LIBRARY + "/AzielEliab";
export const GODLOCK = "https://godlock.uk";
export const GODLOCK_AZIEL = GODLOCK + "/AzielEliab";
/** Sister research archive. www host as published on this hub. */
export const HEDIDNTJUMP = "https://www.hedidntjump.com";
export const RUNTIME = "https://aziel-runtime.vibelock.workers.dev";
export const RUNTIME_PATH = "/runtime";
export const RUNTIME_LOCAL = CANON_ORIGIN + RUNTIME_PATH;
/** Software-strip slug / list name. Title form is for blurbs and meta only. */
export const RUNTIME_SLUG = "aziel-runtime";
export const RUNTIME_NAME = "aziel-runtime";
export const RUNTIME_TITLE = "Aziel Runtime";
/** Certification-freeze cite. Prefer live GET /v1/health.version when it answers. */
export const RUNTIME_VERSION = "2.0.0-rc1";
/**
 * Operator SoT LIVE git from GET /v1/software.git_sha at this edit.
 * Short form is the first 7 hex digits. Suite version stays 2.0.0-rc1.
 */
export const RUNTIME_GIT_SHA = "231b02fcbb7b50fbd52762a49329042bc1715fe9";
export const RUNTIME_GIT_SHORT = "231b02f";
/**
 * Live GET /v1/software, /v1/health, and /cite.json do not expose version_id.
 * Do not keep claiming a certification id the Worker no longer publishes.
 */
export const RUNTIME_VERSION_ID_NOTE =
  "Live GET /v1/software, /v1/health, and /cite.json do not expose version_id.";

/** Copy version_id only when the live document exposes a non-empty string. */
export function exposedVersionId(doc) {
  if (!doc || typeof doc !== "object" || Array.isArray(doc)) return null;
  if (!Object.prototype.hasOwnProperty.call(doc, "version_id")) return null;
  if (typeof doc.version_id !== "string") return null;
  const id = doc.version_id.trim();
  if (!id || id.length > 80) return null;
  if (!/^[A-Za-z0-9._:-]+$/.test(id)) return null;
  return id;
}
export const RUNTIME_BRANCH = "main";
export const MASTER_33_MCP = false;
/** Counted suite pack on the runtime Worker. */
export const RUNTIME_DOWNLOAD = RUNTIME + "/download";
export const RUNTIME_DOWNLOAD_V1 = RUNTIME + "/v1/suite/download";
export const RUNTIME_DOWNLOAD_NOTE =
  "One-click suite pack JSON (REAL catalog + FoldLock tip + mesh cite). Worker wasm / WireGuard / OpenVPN SLOT. Counted GET /download.";
/** Human UI hashes live on the runtime Worker — not this hub homepage. */
export const RUNTIME_HUMAN_UI = Object.freeze({
  host: RUNTIME + "/",
  op_panel: RUNTIME + "/#op-panel",
  dashboard: RUNTIME + "/#dashboard",
  fg_console: RUNTIME + "/#fg-console",
  tasks: RUNTIME + "/#task-*",
  about_aziel: RUNTIME + "/about",
  about_aziel_v1: RUNTIME + "/v1/about",
  download: RUNTIME_DOWNLOAD,
  hashtags: true,
  note:
    "Human software on aziel-runtime: #op-panel / #dashboard / #fg-console + #task-* + About Aziel + per-product hashtags + GET /download suite pack. This hub cites those hashes; it does not host the panels. Agent MCP has no technical UI chrome.",
});
/** Dual-surface law. Softwares exec is fraggate_call only. */
export const DUAL_SURFACE = Object.freeze({
  agent:
    "MCP Softwares via fraggate_call only. FragGate is THE single door. master_33:false — MASTER-33 is the locked pipeline cite, not an MCP tool.",
  human:
    "Complete human UI stays on the runtime Worker (panels, About Aziel, per-product hashtags, counted /download).",
  door: "fraggate",
  softwares: "fraggate_call only",
  master_33: MASTER_33_MCP,
});
/** Verified Glama listing (owner/repo path). Do not invent a server id. Label is exact. */
export const GLAMA_RUNTIME = "https://glama.ai/mcp/servers/AzielEliab/aziel-runtime";
export const GLAMA_LABEL = "Try on Glama";
export const RUNTIME_DOCS = "https://github.com/AzielEliab/aziel-runtime/tree/main/docs/2.0";

/** Sister product (cite-only extra). Not a FragGate true-engine. Not Softwares-tab. */
export const TRADES_RUNTIME = "https://trades-runtime.vibelock.workers.dev";
export const TRADES_RUNTIME_GITHUB = "https://github.com/AzielEliab/trades-runtime";
export const TRADES_RUNTIME_SLUG = "trades-runtime";
export const TRADES_RUNTIME_NAME = "Trades-Runtime";
export const TRADES_RUNTIME_VERSION = "0.3.4";
export const TRADES_RUNTIME_DOWNLOAD = TRADES_RUNTIME + "/download";
export const TRADES_RUNTIME_OPENAPI = TRADES_RUNTIME + "/openapi.json";
export const TRADES_RUNTIME_MCP = TRADES_RUNTIME + "/mcp";
export const TRADES_RUNTIME_CITE = TRADES_RUNTIME + "/cite.json";
export const TRADES_RUNTIME_LLMS = TRADES_RUNTIME + "/llms.txt";
export const TRADES_RUNTIME_SKILL = TRADES_RUNTIME + "/v1/skill";
export const TRADES_RUNTIME_HEALTH = TRADES_RUNTIME + "/v1/health";
export const TRADES_RUNTIME_STATS = TRADES_RUNTIME + "/v1/stats";
export const TRADES_RUNTIME_ID = CANON_ORIGIN + "/#sister-trades-runtime";
export const TRADES_RUNTIME_ONE_LINE =
  "Shadow-first local BYO runtime for HVAC/plumbing/electrical/sewer/cross-trades. BYO ServiceTitan+ProBooks. Human authority. live_backends false.";
export const SISTER_PRODUCTS_NOTE =
  "Sister products cited honestly. aziel-runtime fraggate_call does not execute their company ops. Identity Aziel Eliab only.";
export const TRADES_RUNTIME_NOTE =
  "Trades-Runtime is a separate local-first BYO field-trades runtime. Product MCP is read-only (health, stats, cite, skill). No ServiceTitan or ProBooks write-back. No tenant data on the public Worker. GitHub Pages stay off. Public get = Worker download. Dual surface: agent chat has no technical UI chrome; Worker / local install / counted download stay complete human software. live_backends false. Identity Aziel Eliab only.";
export const TRADES_RUNTIME_SAME_AS = [
  TRADES_RUNTIME_GITHUB,
  TRADES_RUNTIME + "/",
  TRADES_RUNTIME_DOWNLOAD,
  TRADES_RUNTIME_MCP,
  TRADES_RUNTIME_CITE,
  TRADES_RUNTIME_LLMS,
];

export function tradesRuntimeCite() {
  return {
    slug: TRADES_RUNTIME_SLUG,
    name: TRADES_RUNTIME_NAME,
    version: TRADES_RUNTIME_VERSION,
    author: AUTHOR,
    identity: AUTHOR,
    github: TRADES_RUNTIME_GITHUB,
    worker: TRADES_RUNTIME,
    worker_home: TRADES_RUNTIME + "/",
    href: TRADES_RUNTIME + "/",
    url: TRADES_RUNTIME + "/",
    mcp: TRADES_RUNTIME_MCP,
    download: TRADES_RUNTIME_DOWNLOAD,
    cite: TRADES_RUNTIME_CITE,
    llms: TRADES_RUNTIME_LLMS,
    skill: TRADES_RUNTIME_SKILL,
    openapi: TRADES_RUNTIME_OPENAPI,
    health: TRADES_RUNTIME_HEALTH,
    stats: TRADES_RUNTIME_STATS,
    one_line: TRADES_RUNTIME_ONE_LINE,
    live_backends: false,
    hosted_company_os: false,
    tenant_data: false,
    servicetitan_write: false,
    probooks_write: false,
    software_tab: false,
    fraggate_engine: false,
    true_engine_runtime: false,
    engine: false,
    isolation_software: false,
    nested_softwares_exec: false,
    fraggate_call: false,
    not_aziel_runtime: true,
    not_a_second_door: true,
    public_softwares_cite: true,
    kind: "extra",
    placement: "softwares-extra",
    how_to_cite:
      "Eliab, Aziel. (2026). Trades-Runtime " +
      TRADES_RUNTIME_VERSION +
      " [Software]. Apache-2.0. " +
      TRADES_RUNTIME_GITHUB,
    note: SISTER_PRODUCTS_NOTE,
    sameAs: TRADES_RUNTIME_SAME_AS.slice(),
  };
}

export function sisterProductsCite() {
  return {
    author: AUTHOR,
    identity: AUTHOR,
    software_tab: false,
    fraggate_engine: false,
    isolation_software: false,
    fraggate_call: false,
    nested_softwares_exec: false,
    note: SISTER_PRODUCTS_NOTE,
    products: [tradesRuntimeCite()],
  };
}

/** Locked Person node. www + #aziel — never apex, never #aziel-eliab. */
export const PERSON_ID = CANON_ORIGIN + "/#aziel";
export const WEBSITE_ID = CANON_ORIGIN + "/#website";
export const X_URL = "https://x.com/AzielEliab";
export const X_HANDLE = "@AzielEliab";
export const X_LABEL = "X @AzielEliab";
/** AZindex sameAs lattice: hub, corpus, GodLock, He Didn't Jump, GitHub AzielEliab, Glama runtime, X. */
export const PERSON_SAME_AS = [
  GITHUB,
  GITHUB_SECONDARY,
  GLAMA_RUNTIME,
  CANON_ORIGIN + "/",
  LIBRARY + "/",
  GODLOCK + "/",
  HEDIDNTJUMP + "/",
  X_URL,
];

export const ECOSYSTEM_TITLE = "Part of the Aziel Eliab ecosystem";
export const ECOSYSTEM_LINKS = [
  { label: "Official site", href: CANON_ORIGIN + "/" },
  { label: "Aziel Corpus Library", href: LIBRARY + "/" },
  { label: "GodLock", href: GODLOCK + "/" },
  { label: "He Didn't Jump", href: HEDIDNTJUMP + "/" },
  { label: "GitHub AzielEliab", href: GITHUB },
  { label: RUNTIME_TITLE, href: RUNTIME + "/" },
  { label: GLAMA_LABEL, href: GLAMA_RUNTIME },
  { label: X_LABEL, href: X_URL },
];

/** Frozen Runtime parent. Hub /runtime surface — not a Worker identity page. */
export const RUNTIME_ID = RUNTIME_LOCAL + "#runtime";

/**
 * Named Runtime tools only. Not MCP ops/methods/verbs.
 * @id is https://www.azieleliab.com/runtime#<slug>. Names are exact spellings.
 * Ask Jeeves is suite help on Aziel Corpus (software_tab false), not a peer card.
 */
export const RUNTIME_NAMED_TOOLS = [
  { slug: "fraggate", name: "FragGate" },
  { slug: "forgereceipts", name: "ForgeReceipts" },
  { slug: "decisiongate", name: "DecisionGate" },
  { slug: "temporallock", name: "TemporalLock" },
  { slug: "trajectorylock", name: "TrajectoryLock" },
  { slug: "peacelock", name: "PeaceLock" },
  { slug: "godlock", name: "GodLock" },
  { slug: "azos", name: "AZ-OS" },
  { slug: "azcoherence", name: "AZCoherence" },
  { slug: "4dmap", name: "4DMap" },
  { slug: "aziel-corpus", name: "Aziel Corpus" },
  {
    slug: "jeeves",
    name: "Ask Jeeves",
    suite_help: true,
    parent: "aziel-corpus",
    fraggate_op: "jeeves",
    interface: "jeeves_help",
  },
  { slug: "azbrowser", name: "AZBrowser" },
  { slug: "azmail", name: "AZMail" },
  { slug: "azhub", name: "AZHub" },
  { slug: "azinterface", name: "AZInterface" },
  { slug: "spectrallock", name: "SpectralLock" },
  { slug: "shadowlock", name: "ShadowLock" },
  { slug: "foldlock", name: "FoldLock" },
  { slug: "codelock", name: "CodeLock" },
  { slug: "vibelock", name: "VibeLock" },
];

export function runtimeToolId(slug) {
  const raw = String(slug || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return RUNTIME_LOCAL + "#" + (raw || "tool");
}

/** Named tools that are runtime hasPart peers. Suite help is not a peer. */
export function runtimePeerTools() {
  return RUNTIME_NAMED_TOOLS.filter((tool) => !tool.suite_help);
}

export function namedToolsPeerLine() {
  return runtimePeerTools()
    .map((tool) => tool.name)
    .join(", ");
}

/** Frozen SoT LIVE line. version_id is included only when a pin actually has one. */
export function runtimeSotLiveLine(version = RUNTIME_VERSION, sot) {
  const short = sot && sot.git_short ? String(sot.git_short) : RUNTIME_GIT_SHORT;
  const ver = sot && sot.version ? String(sot.version) : version;
  const id = sot && typeof sot.version_id === "string" && sot.version_id ? sot.version_id : "";
  if (id) return "SoT LIVE: main " + short + " / version_id " + id + " / " + ver + " at " + RUNTIME;
  return "SoT LIVE: main " + short + " / " + ver + " at " + RUNTIME;
}

export function runtimeVersionIdNote(sot) {
  if (sot && typeof sot.version_id === "string" && sot.version_id) {
    return "version_id " + sot.version_id + " from live GET /v1/software.";
  }
  return RUNTIME_VERSION_ID_NOTE;
}

export function askJeevesCiteLine() {
  return (
    "Ask Jeeves is suite help on Aziel Corpus (FragGate op jeeves, interface jeeves_help). software_tab false. Not a Softwares-tab product card. Catalog count stays 42. @id " +
    runtimeToolId("jeeves") +
    " isPartOf " +
    runtimeToolId("aziel-corpus") +
    "."
  );
}

export const RUNTIME_NAMED_LINE =
  "Aziel Runtime includes named components such as FragGate, ForgeReceipts, …";

/** Human Runtime panel doors. Softwares tab lists name + designed-purpose one_line. */
export const RUNTIME_DOORS = [
  { label: GLAMA_LABEL, href: GLAMA_RUNTIME, primary: true },
  { label: "Official Runtime", href: RUNTIME + "/" },
  { label: "Suite pack", href: RUNTIME_DOWNLOAD },
  { label: "Source on GitHub", href: GITHUB_RUNTIME },
  { label: "Documentation / Architecture", href: RUNTIME_DOCS },
];

export function resolveRuntimeVersion(version) {
  const ver = String(version == null ? "" : version).trim();
  return ver || RUNTIME_VERSION;
}
/** Soft-name strip. Distinct /software page. /#software maps here. */
export const SOFTWARE_PATH = "/software";
export const SOFTWARE_HREF = CANON_ORIGIN + SOFTWARE_PATH;
export const SOFTWARE_SECTION = SOFTWARE_HREF;
export const SOFTWARE_TITLE = "Software — Aziel Eliab";
export const SOFTWARE_DESCRIPTION =
  "Software by Aziel Eliab. Live catalog from aziel-runtime / FragGate. Designed-purpose one_line from GET /v1/software. Public identity Aziel Eliab only.";

/** Machine Official Aziel ecosystem. Cite on FAQ / who-is / llms / cite. Donate stays /donate only. */
export const OFFICIAL_ECOSYSTEM = [
  { id: "hub", label: "Official site", url: CANON_ORIGIN + "/" },
  { id: "corpus", label: "Aziel Digital Library", url: LIBRARY + "/" },
  { id: "godlock", label: "GodLock", url: GODLOCK + "/" },
  { id: "hedidntjump", label: "He Didn't Jump", url: HEDIDNTJUMP + "/" },
  { id: "runtime", label: "Aziel Runtime", url: RUNTIME + "/" },
  { id: "github", label: "GitHub AzielEliab", url: GITHUB },
  { id: "glama", label: GLAMA_LABEL, url: GLAMA_RUNTIME },
  { id: "x", label: X_LABEL, url: X_URL },
  { id: "softwares", label: "Softwares", url: SOFTWARE_HREF },
];

export function officialEcosystemCite() {
  return OFFICIAL_ECOSYSTEM.map((row) => ({ id: row.id, label: row.label, url: row.url }));
}

export function officialEcosystemLines() {
  return OFFICIAL_ECOSYSTEM.map((row) => "- " + row.label + " — " + row.url);
}

export const OFFICIAL_ECOSYSTEM_ANSWER = OFFICIAL_ECOSYSTEM.map(
  (row) => row.label + " (" + row.url + ")",
).join(". ") + ".";

/** One public Softwares version. Live catalog is SoT — do not invent a second number. */
export const SOFTWARES_SSOT = Object.freeze({
  field: "version",
  live: RUNTIME + "/v1/software",
  live_hub: CANON_ORIGIN + "/v1/software",
  fallback: RUNTIME + "/v1/fraggate/list",
  frozen: RUNTIME_VERSION,
  note:
    "One public Softwares version. Live GET " +
    RUNTIME +
    "/v1/software version is SoT. Fallback " +
    RUNTIME +
    "/v1/fraggate/list, then frozen " +
    RUNTIME_VERSION +
    ". Do not invent a second Softwares version.",
});

export function softwaresSsotCite() {
  return { ...SOFTWARES_SSOT };
}
/** Secondary local page. Softwares door is catalog worker_home. */
export const EMBRYOLOCK_PATH = "/embryolock";
export const EMBRYOLOCK_HREF = CANON_ORIGIN + EMBRYOLOCK_PATH;
export const EMBRYOLOCK_WORKER = "https://embryolock-download-tracker.vibelock.workers.dev/";
/** Softwares worker_home. Counted download is same host /download. Not a hosted unlock. */
export const ARK_WORKER = "https://ark-download-tracker.vibelock.workers.dev/";
export const ARK_DOWNLOAD = "https://ark-download-tracker.vibelock.workers.dev/download";
/** Whitestone is Worker-catalog Softwares (FragGate status none). Do not invent fraggate_call ops. */
export const WHITESTONE_SLUG = "whitestone";
export const WHITESTONE_NAME = "Whitestone";
export const WHITESTONE_WORKER = "https://whitestone-download-tracker.vibelock.workers.dev/";
export const WHITESTONE_WEB = "https://whitestone.vibelock.workers.dev/";
export const WHITESTONE_GITHUB = "https://github.com/AzielEliab/Whitestone";
export const WHITESTONE_ONE_LINE = CATALOG_PURPOSE.whitestone.one_line;
export const WHITESTONE_DESCRIPTION = CATALOG_PURPOSE.whitestone.description;
/** SpectralLock Worker honesty after spectrallock#13 LIVE (merge 4af8fcb). Overlay digest not rehashed. */
export const SPECTRALLOCK_SLUG = "spectrallock";
export const SPECTRALLOCK_NAME = "SpectralLock";
export const SPECTRALLOCK_VERSION = "0.3.0";
export const SPECTRALLOCK_SOT = "spectrallock#13 LIVE (merge 4af8fcb)";
export const SPECTRALLOCK_WORKER = "https://spectrallock-download-tracker.vibelock.workers.dev/";
export const SPECTRALLOCK_UNREDACT = SPECTRALLOCK_WORKER + "v1/unredact";
export const SPECTRALLOCK_RECOVER = SPECTRALLOCK_WORKER + "v1/recover";
export const SPECTRALLOCK_HANDWRITING = SPECTRALLOCK_WORKER + "v1/handwriting";
export const SPECTRALLOCK_GITHUB = "https://github.com/AzielEliab/spectrallock";
/** Runtime catalog digest after aziel-runtime#137. Hasher on disk — not invented. Overlay digest not rehashed in #13. */
export const SPECTRALLOCK_DIGEST = "3427dbcf2932b6bf4c6cf80735efd171b75519066e013db6d0df275c65989fb4";
export const SPECTRALLOCK_ONE_LINE = CATALOG_PURPOSE.spectrallock.one_line;
export const SPECTRALLOCK_DESCRIPTION = CATALOG_PURPOSE.spectrallock.description;
export const SPECTRALLOCK_NOTE =
  "Leftover container bytes = honest recover path (leftover_bytes, recovered_from). Opaque rewrite with nothing left refuses SL-UNREDACT-OPAQUE — do not invent letters. Locate / lift / recover / refuse. Inject ON is paint. Worker LIVE after spectrallock#13 (merge 4af8fcb): GET|POST /v1/unredact (deep PDF + revision_graph + per-revision copies); GET|POST /v1/recover (universal artifact recover; NO-LIE; LIVE vs SLOT); GET|POST /v1/handwriting (physical ink scan heuristics). FragGate LIVE_OPS stay health / modes / targets / overlay / verify / doctor / skill. OCR after structural only. Never OCR-from-black-box. Never reconstruct covered letters from context. Lamb Lens: Service → Clarity → Peace. Author Aziel Eliab only. NO-LIE.";
export const SPECTRALLOCK_OCR_NOTE =
  "OCR runs only after structural recovery and never reconstructs covered letters from context. Never OCR-from-black-box. Never claim pigment recovery, ESDA, chemical, lab, or forensic certification. Author Aziel Eliab. NO-LIE.";
export const SPECTRALLOCK_FRAGGATE_OPS = Object.freeze([
  "health",
  "modes",
  "targets",
  "overlay",
  "verify",
  "doctor",
  "skill",
]);
export const SPECTRALLOCK_UNREDACT_OPS = Object.freeze(["locate", "lift", "recover", "refuse"]);
export const SPECTRALLOCK_RECOVER_OPS = Object.freeze([
  "locate",
  "deep-recover",
  "revision-graph",
  "cross-compare",
  "extract-embedded",
  "scan-orphans",
  "scan-metadata",
  "scan-sidecars",
  "scan-history",
  "refuse",
]);
export const SPECTRALLOCK_HANDWRITING_OPS = Object.freeze([
  "analyze",
  "compare",
  "side-by-side",
  "graph",
  "forgery-indicators",
  "refuse",
]);
export const SPECTRALLOCK_RECOVER_LIVE_KINDS = Object.freeze([
  "pdf",
  "json",
  "xml",
  "html",
  "svg",
  "txt",
  "eml",
  "zip",
  "png",
  "jpeg",
]);
export const SPECTRALLOCK_RECOVER_SLOT_KINDS = Object.freeze(["7z", "heic", "heif"]);
export const FRAGGATE_WORKER = "https://fraggate-download-tracker.vibelock.workers.dev/";
export const FRAGGATE_GITHUB = "https://github.com/AzielEliab/fraggate";
/** Primary FragGate door is the Worker UI. GitHub remains the source repo. */
export const FRAGGATE = FRAGGATE_WORKER;
export const AZBROWSER_WORKER = "https://azbrowser-download-tracker.vibelock.workers.dev/";
export const AZNET_WORKER = "https://aznet-download-tracker.vibelock.workers.dev/";
export const AZHUB_WORKER = "https://azhub-download-tracker.vibelock.workers.dev/";
export const AZHUB_GITHUB = "https://github.com/AzielEliab/azhub";
export const AZINTERFACE_WORKER = "https://azinterface-download-tracker.vibelock.workers.dev/";
export const AZINTERFACE_GITHUB = "https://github.com/AzielEliab/azinterface";
/** Cap-7 shuffle app Worker (LIVE). Download-tracker stays the counted Softwares plane. */
export const MIRAGEGRID = "https://miragegrid.vibelock.workers.dev";
export const MIRAGEGRID_HEALTH = MIRAGEGRID + "/v1/health";
export const MIRAGEGRID_BRIDGE = MIRAGEGRID + "/bridge";
export const MIRAGEGRID_SHUFFLE = MIRAGEGRID + "/v1/shuffle";
export const MIRAGEGRID_DOWNLOAD = "https://miragegrid-download-tracker.vibelock.workers.dev";

export const DESCRIPTION =
  "Aziel Eliab. You don’t get to know me. You get to understand the work. Public identity Aziel Eliab only.";
/** About surfaces 200 with the same homepage HTML so they are indexable. */
export const ABOUT_PATHS = ["/about", "/AzielEliab", "/aziel-eliab"];
export const ABOUT_HREF = CANON_ORIGIN + "/";
/** Visible HTML who-is page (H1 + who-answer). Machine twin remains /who-is-aziel-eliab.txt. */
export const WHO_PATH = "/who";
export const WHO_HREF = CANON_ORIGIN + WHO_PATH;
export const WHO_TITLE = "Who is Aziel Eliab";

export function isAboutAlias(pathname) {
  const p = String(pathname || "").replace(/\/+$/, "") || "/";
  const lower = p.toLowerCase();
  return lower === "/about" || lower === "/azieleliab" || lower === "/aziel-eliab";
}

export function aboutAliasPath(pathname) {
  const p = String(pathname || "").replace(/\/+$/, "") || "/";
  if (p === "/about" || p.toLowerCase() === "/about") return "/about";
  if (p === "/AzielEliab" || p.toLowerCase() === "/azieleliab") return "/AzielEliab";
  if (p === "/aziel-eliab" || p.toLowerCase() === "/aziel-eliab") return "/aziel-eliab";
  return "";
}

export const WHY_PATH = "/why";
export const WHY_HREF = CANON_ORIGIN + WHY_PATH;
export const RESEARCH_PATH = "/research";
export const RESEARCH_HREF = CANON_ORIGIN + RESEARCH_PATH;
export const DOORS_PATH = "/doors";
export const DOORS_HREF = CANON_ORIGIN + DOORS_PATH;
export const RECEIPTS_PATH = "/receipts";
export const RECEIPTS_HREF = CANON_ORIGIN + RECEIPTS_PATH;
export const RECEIPTS_TITLE = "Receipts";
export const RECEIPTS_DESCRIPTION =
  "This host’s action-receipt chain. Hash, request sentence, output sentence, event metadata. Newest first.";
export const AZIEL_PATH = "/aziel";
export const AZIEL_HREF = CANON_ORIGIN + AZIEL_PATH;
/** Retired homepage Mission/Status strip. 301 to /. */
export const MISSION_PATH = "/mission";

/**
 * First-class tab pages. Each is its own URL — not a homepage hash target.
 * /runtime stays the aziel-runtime door. /aziel stays the Person homepage alias.
 */
export const TAB_PAGES = [
  {
    id: "why",
    path: WHY_PATH,
    hash: "why",
    heading: "Why",
    title: "Why — Aziel Eliab",
    description: "Why Aziel Eliab keeps looking. Public identity Aziel Eliab only. Living publisher of GodLock, Aziel Digital Library, aziel-runtime MCP, and He Didn't Jump.",
  },
  {
    id: "software",
    path: SOFTWARE_PATH,
    hash: "software",
    heading: "Software",
    title: SOFTWARE_TITLE,
    description: SOFTWARE_DESCRIPTION,
  },
  {
    id: "research",
    path: RESEARCH_PATH,
    hash: "research",
    heading: "Research",
    title: "Research — Aziel Eliab",
    description: "Research by Aziel Eliab. The corpus lives at the Aziel Digital Library. Living publisher of GodLock, Aziel Digital Library, aziel-runtime MCP, and He Didn't Jump.",
  },
  {
    id: "doors",
    path: DOORS_PATH,
    hash: "doors",
    heading: "Doors",
    title: "Doors — Aziel Eliab",
    description:
      "Public doors for Aziel Eliab: GitHub AzielEliab, Corpus, GodLock, He Didn't Jump, Runtime, " +
      TRADES_RUNTIME_NAME +
      ", X @AzielEliab.",
  },
];

/** Old homepage hashes → real paths. #aziel stays (Person @id). #mission optional → /. */
export const HASH_REDIRECTS = {
  why: WHY_PATH,
  software: SOFTWARE_PATH,
  research: RESEARCH_PATH,
  doors: DOORS_PATH,
  mission: "/",
};

export const INDEXABLE_SECTIONS = [
  ...TAB_PAGES,
  {
    id: "aziel",
    path: AZIEL_PATH,
    hash: "aziel",
    heading: AUTHOR,
    title: AUTHOR,
    description: DESCRIPTION,
    home: true,
  },
];

export const INDEXABLE_SECTION_PATHS = INDEXABLE_SECTIONS.map((s) => s.path);
export const TAB_PAGE_PATHS = TAB_PAGES.map((s) => s.path);

export function indexableSection(pathname) {
  const p = String(pathname || "").replace(/\/+$/, "") || "/";
  return INDEXABLE_SECTIONS.find((s) => s.path === p) || null;
}

export function tabPage(pathname) {
  const p = String(pathname || "").replace(/\/+$/, "") || "/";
  return TAB_PAGES.find((s) => s.path === p) || null;
}

export function isMissionPath(pathname) {
  const p = String(pathname || "").replace(/\/+$/, "") || "/";
  return p === MISSION_PATH;
}

/**
 * Documented aziel-runtime Softwares-tab slugs (fallback only).
 * Live catalog at request time is preferred. Door: worker_home when
 * the tracker is ready, else GitHub, else library hub. Display names
 * are catalog `name`. Lumen is not listed. FragGate and mesh are extras
 * — not Softwares products. AZHub and AZInterface are separate Plain
 * doors — never one combined engine.
 */
export const CATALOG_SLUGS = [
  "4dmap",
  "ark",
  "azai",
  "azbot",
  "azbrowser",
  "azchat",
  "azclce",
  "azcoherence",
  "azhub",
  "aziel-corpus",
  "azieltether",
  "azinterface",
  "azmail",
  "aznet",
  "azos",
  "azvpn",
  "chronolock",
  "codelock",
  "decisiongate",
  "embryolock",
  "employeelock",
  "foldlock",
  "forgereceipts",
  "glossafilter",
  "godlock",
  "mialock",
  "miragegrid",
  "mmconsensus",
  "peacelock",
  "postking",
  "shadowlock",
  "spectrallock",
  "staticclock",
  "temporallock",
  "toolbench",
  "trajectorylock",
  "veillock",
  "vibelock",
  "whistlelock",
  "whitestone",
  "zkattest",
  "zsolver",
];

/**
 * Product versions from live GET /v1/software at git 231b02f.
 * JSON-LD softwareVersion only. Not a Softwares-tab row and not a Doors field.
 */
export const CATALOG_VERSIONS = Object.freeze({
  "4dmap": "0.3.0",
  ark: "0.1.0",
  azai: "0.3.1",
  azbot: "0.2.0",
  azbrowser: "0.1.0",
  azchat: "0.1.0",
  azclce: "0.3.0",
  azcoherence: "0.1.0",
  azhub: "0.1.0",
  "aziel-corpus": "2.6.2",
  azieltether: "0.1.0",
  azinterface: "0.1.0",
  azmail: "0.1.0",
  aznet: "0.1.0",
  azos: "0.3.0",
  azvpn: "0.1.0",
  chronolock: "0.1.0",
  codelock: "0.1.0",
  decisiongate: "0.1.0",
  embryolock: "1.2.0",
  employeelock: "0.1.0",
  foldlock: "0.8.0",
  forgereceipts: "0.3.0",
  glossafilter: "0.1.0",
  godlock: "0.1.0",
  mialock: "0.1.1",
  miragegrid: "0.2.0",
  mmconsensus: "0.1.0",
  peacelock: "0.1.0",
  postking: "0.1.0",
  shadowlock: "0.2.0",
  spectrallock: "0.3.1",
  staticclock: "0.2.0",
  temporallock: "0.2.0",
  toolbench: "0.1.0",
  trajectorylock: "0.1.0",
  veillock: "0.2.0",
  vibelock: "0.3.0",
  whistlelock: "0.1.0",
  whitestone: "1.6.0",
  zkattest: "0.1.0",
  zsolver: "0.2.0",
});

/** Catalog `name` for each documented slug. */
export const CATALOG_NAMES = {
  "4dmap": "4DMap",
  ark: "The ARK",
  azai: "AZAI",
  azbot: "AZBot",
  azbrowser: "AZBrowser",
  azchat: "AZChat",
  azclce: "AZ-CLCE",
  azcoherence: "AZCoherence",
  azhub: "AZHub",
  "aziel-corpus": "Aziel Digital Library",
  azieltether: "AzielTether",
  azinterface: "AZInterface",
  azmail: "AZMail",
  aznet: "AZNet",
  azos: "AZ-OS",
  azvpn: "AZVPN",
  chronolock: "ChronoLock",
  codelock: "CodeLock",
  decisiongate: "DecisionGATE",
  embryolock: "EmbryoLock",
  employeelock: "EmployeeLock",
  foldlock: "FoldLock",
  forgereceipts: "ForgeReceipts",
  glossafilter: "Glossa Filter",
  godlock: "GodLock",
  mialock: "M.I.A.Lock",
  miragegrid: "MirageGrid",
  mmconsensus: "MMConsensus",
  peacelock: "PeaceLock",
  postking: "Post-King Chess",
  shadowlock: "ShadowLock",
  spectrallock: "SpectralLock",
  staticclock: "StaticClock",
  temporallock: "TemporalLock",
  toolbench: "ToolBench",
  trajectorylock: "TrajectoryLock",
  veillock: "VeilLock",
  vibelock: "VibeLock",
  whistlelock: "WhistleLock",
  whitestone: "Whitestone",
  zkattest: "ZKAttest",
  zsolver: "ZionPattern Solver",
};

/**
 * In-process placements without a download-tracker Worker.
 * Door is the runtime human UI (#task-*), not an invented tracker URL.
 * Live GET /v1/software may send worker_home: null for these.
 */
export const CATALOG_RUNTIME_HOME = Object.freeze({
  azvpn: RUNTIME + "/#task-azvpn",
  mmconsensus: RUNTIME + "/#task-mmconsensus",
  toolbench: RUNTIME + "/#task-toolbench",
  zkattest: RUNTIME + "/#task-zkattest",
});

/** Live `placement` values that mean in-runtime (no product Worker). */
export const IN_RUNTIME_PLACEMENTS = Object.freeze([
  "tunnel-concentrator",
  "consensus-review",
  "tool-playground",
  "receipt-attest",
]);

export const CATALOG_RUNTIME_PLACEMENT = Object.freeze({
  azvpn: "tunnel-concentrator",
  mmconsensus: "consensus-review",
  toolbench: "tool-playground",
  zkattest: "receipt-attest",
});

export function runtimeTaskHome(slug) {
  const s = String(slug || "")
    .trim()
    .toLowerCase();
  return s ? RUNTIME + "/#task-" + s : "";
}

function firstCatalogHome(product) {
  if (!product || typeof product !== "object") return "";
  for (const key of ["worker_home", "href", "url", "home"]) {
    const value = product[key];
    if (typeof value === "string" && /^https?:\/\//i.test(value)) return value;
  }
  return "";
}

/** True when live catalog doors this slug on runtime #task-* (no invented tracker). */
export function isInRuntimePlacement(product, slug) {
  const row = product && typeof product === "object" ? product : null;
  const s = String((row && row.slug) || slug || "")
    .trim()
    .toLowerCase();
  if (s && Object.prototype.hasOwnProperty.call(CATALOG_RUNTIME_HOME, s)) return true;
  if (!row) return false;
  if (firstCatalogHome(row)) return false;
  const placement = String(row.placement || "").trim();
  if (IN_RUNTIME_PLACEMENTS.includes(placement)) return true;
  const github = String(row.github || "").trim();
  if (github === GITHUB_RUNTIME || github.startsWith(GITHUB_RUNTIME + "/") || github.startsWith(GITHUB_RUNTIME + "#")) {
    return true;
  }
  return false;
}

/** Not in the documented catalog yet. Do not invent a landing door. */
export const CATALOG_LATER_SLUGS = [];

export const AZMAIL_WORKER = "https://azmail-download-tracker.vibelock.workers.dev/";
export const PEACELOCK_WORKER = "https://peacelock-download-tracker.vibelock.workers.dev/";
export const PEACELOCK_GITHUB = "https://github.com/AzielEliab/peacelock";
/** Coordinator honesty: public git + local-only runtime. Counted door stays the tracker. */
export const PEACELOCK_NOTE =
  "PeaceLock: public git " +
  PEACELOCK_GITHUB +
  ". Runtime is local-only. Counted Softwares door is " +
  PEACELOCK_WORKER +
  ".";
export const PEACELOCK_ONE_LINE = CATALOG_PURPOSE.peacelock.one_line;
export const PEACELOCK_DESCRIPTION = CATALOG_PURPOSE.peacelock.description;
export const PEACELOCK_SOFTWARES_LINE =
  "- PeaceLock — " + PEACELOCK_ONE_LINE + " " + PEACELOCK_WORKER;

export function peacelockCite() {
  return {
    slug: "peacelock",
    name: "PeaceLock",
    author: AUTHOR,
    identity: AUTHOR,
    github: PEACELOCK_GITHUB,
    worker_home: PEACELOCK_WORKER,
    public_git: PEACELOCK_GITHUB,
    runtime: "local-only",
    hosted_unlock: false,
    software_tab: true,
    note: PEACELOCK_NOTE,
  };
}

/** Slugs whose download-tracker Worker is not ready — use GitHub. Empty: trackers live. */
export const CATALOG_GITHUB_FALLBACK = new Set();

export function catalogGithub(slug) {
  if (CATALOG_RUNTIME_HOME[slug]) return GITHUB_RUNTIME;
  if (slug === "whitestone") return WHITESTONE_GITHUB;
  return "https://github.com/AzielEliab/" + slug;
}

export function catalogWorkerHome(slug, product) {
  if (slug === "aziel-corpus") return LIBRARY + "/";
  if (slug === "azmail") return AZMAIL_WORKER;
  if (slug === "peacelock") return PEACELOCK_WORKER;
  if (slug === "whitestone") return WHITESTONE_WORKER;
  if (isInRuntimePlacement(product, slug)) return runtimeTaskHome(slug);
  if (CATALOG_RUNTIME_HOME[slug]) return CATALOG_RUNTIME_HOME[slug];
  return "https://" + slug + "-download-tracker.vibelock.workers.dev/";
}

/** Prefer worker_home; GitHub if the tracker is not ready; library hub last. */
export function catalogHref(slug, product) {
  if (slug === "aziel-corpus") return LIBRARY + "/";
  if (CATALOG_GITHUB_FALLBACK.has(slug)) return catalogGithub(slug);
  return catalogWorkerHome(slug, product);
}

/** True for aziel-runtime, including catalog mash like "runtime 1.6.15 FragGate". */
export function isRuntimeSoftware(slug, name) {
  const s = String(slug || "").trim().toLowerCase();
  if (s === RUNTIME_SLUG || s === "runtime") return true;
  const n = String(name || "").trim();
  if (!n) return false;
  if (/^aziel[\s-]?runtime$/i.test(n) || /^runtime$/i.test(n)) return true;
  if (/\bruntime\b/i.test(n) && /\bfraggate\b/i.test(n)) return true;
  if (/^runtime\s*[\d.]+/i.test(n)) return true;
  return false;
}

/** List name: aziel-runtime. Never a version + FragGate mash. */
export function displaySoftwareName(slug, name) {
  if (isRuntimeSoftware(slug, name)) return RUNTIME_NAME;
  return String(name || CATALOG_NAMES[slug] || slug || "").trim();
}

export function canonicalSoftwareSlug(slug, name) {
  if (isRuntimeSoftware(slug, name)) return RUNTIME_SLUG;
  const s = String(slug || "").trim();
  return s || undefined;
}

/** Fallback Softwares blurbs when live /v1/software is down. Worker designed-purpose SSoT. */
export const CATALOG_BLURBS = CATALOG_PURPOSE;

/** Fill missing one_line / description from locked fallback blurbs. Never overwrite live honesty. */
export function applyCatalogBlurb(item, slug) {
  if (!item || typeof item !== "object") return item;
  const s = String(slug || item.slug || "")
    .trim()
    .toLowerCase();
  const blurb = CATALOG_PURPOSE[s];
  if (!blurb) return item;
  if (!item.one_line) item.one_line = blurb.one_line;
  if (!item.description) item.description = blurb.description;
  if (!item.engine_digest && s === SPECTRALLOCK_SLUG) item.engine_digest = SPECTRALLOCK_DIGEST;
  if (!item.version && s === SPECTRALLOCK_SLUG) item.version = SPECTRALLOCK_VERSION;
  return item;
}

/** Softwares list line: Name — designed-purpose one_line. */
export function softwarePurposeLine(item) {
  if (!item || !item.name) return "";
  const purpose = item.one_line || (item.slug && CATALOG_PURPOSE[item.slug] && CATALOG_PURPOSE[item.slug].one_line) || "";
  return purpose ? item.name + " — " + purpose : item.name;
}

export function softwarePurposeLines(software) {
  const items = software && software.length ? software : SOFTWARE;
  return items
    .map((item) => softwarePurposeLine(item))
    .filter(Boolean)
    .map((line) => "- " + line);
}

export function spectrallockCite() {
  return {
    slug: SPECTRALLOCK_SLUG,
    name: SPECTRALLOCK_NAME,
    version: SPECTRALLOCK_VERSION,
    sot: SPECTRALLOCK_SOT,
    author: AUTHOR,
    identity: AUTHOR,
    one_line: SPECTRALLOCK_ONE_LINE,
    description: SPECTRALLOCK_DESCRIPTION,
    leftover_bytes: true,
    leftover_bytes_recovery: true,
    recovered_from: true,
    deep_history: true,
    revision_graph: true,
    revision_copies: true,
    pigment_recovery: false,
    guessed_letters: false,
    heatmap_is_transcript: false,
    heatmap_is_court_finding: false,
    ocr_from_black_box: false,
    ocr_after_structural_only: true,
    covered_letters_from_context: false,
    esda: false,
    forensic_certification: false,
    chemical_ink_dating: false,
    writer_identification_as_fact: false,
    inject_on: "paint",
    inject_on_is_pigment: false,
    opaque_rewrite_refuse: "SL-UNREDACT-OPAQUE",
    refuse_code: "SL-UNREDACT-OPAQUE",
    ops: SPECTRALLOCK_UNREDACT_OPS.slice(),
    recover_ops: SPECTRALLOCK_RECOVER_OPS.slice(),
    handwriting_ops: SPECTRALLOCK_HANDWRITING_OPS.slice(),
    recover_live_kinds: SPECTRALLOCK_RECOVER_LIVE_KINDS.slice(),
    recover_slot_kinds: SPECTRALLOCK_RECOVER_SLOT_KINDS.slice(),
    fraggate_live_ops: SPECTRALLOCK_FRAGGATE_OPS.slice(),
    fraggate_unredact_door_op: false,
    fraggate_recover_door_op: false,
    fraggate_handwriting_door_op: false,
    unredact_is_fraggate_door_op: false,
    catalog_door: false,
    software_tab: true,
    names_only: true,
    bucket: "Lock",
    worker_home: SPECTRALLOCK_WORKER,
    unredact: SPECTRALLOCK_UNREDACT,
    recover: SPECTRALLOCK_RECOVER,
    handwriting: SPECTRALLOCK_HANDWRITING,
    unredact_methods: ["GET", "POST"],
    recover_methods: ["GET", "POST"],
    handwriting_methods: ["GET", "POST"],
    github: SPECTRALLOCK_GITHUB,
    engine_digest: SPECTRALLOCK_DIGEST,
    overlay_digest_rehashed: false,
    door: "fraggate",
    lamb_lens: "Service → Clarity → Peace",
    note: SPECTRALLOCK_NOTE,
    ocr_note: SPECTRALLOCK_OCR_NOTE,
  };
}

export function catalogSoftwareFromSlugs(slugs = CATALOG_SLUGS, liveProducts = []) {
  const liveBySlug = new Map((liveProducts || []).map((p) => [p && p.slug, p]));
  const seen = new Set();
  const out = [];
  const add = (slug) => {
    if (!slug || seen.has(slug)) return;
    seen.add(slug);
    const live = liveBySlug.get(slug) || {};
    const name = displaySoftwareName(slug, CATALOG_NAMES[slug] || live.name);
    if (!name) return;
    const href = catalogHref(slug) || live.worker_home || live.github || LIBRARY_SOFTWARE;
    const workerHome =
      (typeof live.worker_home === "string" && live.worker_home) || catalogWorkerHome(slug) || href;
    const item = {
      slug: canonicalSoftwareSlug(slug, name) || slug,
      name,
      href,
      url: href,
      worker_home: workerHome,
    };
    if (live.status) item.status = live.status;
    else item.status = "live";
    if (live.version) item.version = live.version;
    if (live.one_line) item.one_line = live.one_line;
    if (live.description) item.description = live.description;
    if (live.engine_digest) item.engine_digest = live.engine_digest;
    if (live.github) item.github = live.github;
    else if (CATALOG_RUNTIME_HOME[slug]) item.github = GITHUB_RUNTIME;
    if (live.bucket) item.bucket = live.bucket;
    if (live.surface) item.surface = live.surface;
    if (live.placement) item.placement = live.placement;
    else if (CATALOG_RUNTIME_PLACEMENT[slug]) item.placement = CATALOG_RUNTIME_PLACEMENT[slug];
    if (live.mcp) item.mcp = live.mcp;
    applyCatalogBlurb(item, slug);
    out.push(item);
  };
  for (const slug of slugs || []) add(slug);
  for (const later of CATALOG_LATER_SLUGS) {
    if (liveBySlug.has(later)) add(later);
  }
  return out;
}

export const CATALOG_SOFTWARE = catalogSoftwareFromSlugs();

/** Softwares product door. Local `/embryolock` is secondary. */
export const EMBRYOLOCK = {
  slug: "embryolock",
  name: "EmbryoLock",
  href: EMBRYOLOCK_WORKER,
  url: EMBRYOLOCK_WORKER,
  worker_home: EMBRYOLOCK_WORKER,
  status: "live",
  surface: "live-with-local-destructive-boundary",
};
/** No name-only local-only Softwares cards. */
export const CATALOG_ONLY = [];

/** Secondary local page. Softwares link is catalog worker_home. */
export const EMBRYOLOCK_COPY = {
  title: "EmbryoLock",
  open: [
    "Secondary local page. Softwares door is the catalog worker_home.",
    EMBRYOLOCK_WORKER,
    "Live-with-local-destructive-boundary. Wipe/unlock stay local-only. Never execute on the public mesh.",
    "This page is not the Softwares product card.",
  ],
};

const EXTRA_SLUGS = new Set(["fraggate", "mesh", "aziel-runtime", "runtime", "trades-runtime"]);

export function isSoftwareExtra(slug, name) {
  const s = String(canonicalSoftwareSlug(slug, name) || slug || "")
    .trim()
    .toLowerCase();
  if (EXTRA_SLUGS.has(s)) return true;
  const n = String(name || "").trim();
  if (/^fraggate$/i.test(n) || /^mesh$/i.test(n)) return true;
  if (/^trades[\s_-]?runtime$/i.test(n)) return true;
  return false;
}

/**
 * FragGate / mesh / aziel-runtime / trades-runtime — extras only.
 * Never Softwares products[] cards. Trades-Runtime is a sister product cite.
 */
export const SOFTWARE_EXTRAS = [
  {
    slug: "fraggate",
    name: "FragGate",
    href: FRAGGATE_WORKER,
    url: FRAGGATE_WORKER,
    worker_home: FRAGGATE_WORKER,
    kind: "extra",
    software_tab: false,
  },
  {
    slug: RUNTIME_SLUG,
    name: RUNTIME_NAME,
    href: RUNTIME_LOCAL,
    url: RUNTIME_LOCAL,
    worker_home: RUNTIME_LOCAL,
    kind: "extra",
    software_tab: false,
  },
  {
    slug: "mesh",
    name: "mesh",
    kind: "extra",
    software_tab: false,
    enabled_default: false,
    path: "/v1/mesh",
    spec: "QNM-BUILD-1.0",
    note: "Suite rollup. live_nodes is runtime GET /v1/mesh (human mesh users plus site viewers on godlock.uk, azieleliab.com, and azielcorpuslibrary.net). software_nodes never feeds Live Nodes. Read-only suite presence is on (display from runtime GET /v1/mesh). GET never enables. Operator-armed Node Gate / neighbor heal / network ON. AZVPN auto_use + vpn:true (HTTPS/WS REAL; WG/OpenVPN SLOT). Channel plane wifi/bt/rf/photon ON cites; worker_hardware:false.",
  },
  {
    slug: TRADES_RUNTIME_SLUG,
    name: TRADES_RUNTIME_NAME,
    href: TRADES_RUNTIME + "/",
    url: TRADES_RUNTIME + "/",
    worker_home: TRADES_RUNTIME + "/",
    github: TRADES_RUNTIME_GITHUB,
    download: TRADES_RUNTIME_DOWNLOAD,
    mcp: TRADES_RUNTIME_MCP,
    version: TRADES_RUNTIME_VERSION,
    one_line: TRADES_RUNTIME_ONE_LINE,
    kind: "extra",
    placement: "softwares-extra",
    software_tab: false,
    engine: false,
    fraggate_engine: false,
    fraggate_call: false,
    live_backends: false,
    hosted_company_os: false,
    public_softwares_cite: true,
    note: SISTER_PRODUCTS_NOTE,
  },
];
export const EXTRA_SOFTWARE = SOFTWARE_EXTRAS;

/** Gate before Lock when a name matches both. Clock is not Lock. */
export function softwareBucket(name) {
  const n = String(name || "");
  const cleaned = n.replace(/clock/gi, "");
  if (/gate/i.test(n)) return 1;
  if (/lock/i.test(cleaned)) return 2;
  return 0;
}

/** Plain (no lock/gate) A–Z, then Gate A–Z, then Lock A–Z. */
export function sortSoftware(items) {
  return [...(items || [])].sort((a, b) => {
    const bucket = softwareBucket(a && a.name) - softwareBucket(b && b.name);
    if (bucket) return bucket;
    return String((a && a.name) || "").localeCompare(String((b && b.name) || ""), "en", { sensitivity: "base" });
  });
}

export const SOFTWARE = sortSoftware(CATALOG_SOFTWARE);

/** AZL-DONATE-1.0. Primary canonical Donate door. Not a Softwares product. */
export const DONATE_PATH = "/donate";
export const DONATE_HREF = CANON_ORIGIN + DONATE_PATH + "?v=png";
export const DONATE_TITLE = "Donate";
export const DONATE_DESCRIPTION =
  "Donate to Aziel Eliab. Nothing is free. Donations buy no privilege. Public identity Aziel Eliab only.";
export const DONATE_DISCLAIMER = "Donations buy no privilege.";
export const DONATE_SIGN = "— Aziel";
export const DONATE_NETWORK_NOTE = "Send only on this network.";
export const DONATE_XRP_TAG_NOTE =
  "A destination tag is not required when receiving XRP on this wallet.";

/** Exact donate copy. No pep, no bio, no legal name, no city, no face. */
export const DONATE_COPY = [
  "Nothing is free.",
  "This work has no corporate backer. No grant. No product that unlocks when you pay. Compute, hosting, and time have a cost. If a door stays open it is because the bill was paid.",
  "Donations keep the work in contact with what does not need a sponsor. They do not buy a vote, a feature, a name on a wall, or a quieter question.",
  "You do not owe this. If the work is useful, you already know what to do.",
  "Send only on the correct network. Double-check the address before you send. Wrong chain is a loss. There is no refund desk.",
  "The software remains free to run and fork. Payment is not a key.",
];

export const DONATE_RAILS = [
  {
    id: "btc",
    coin: "Bitcoin · BTC",
    network: "Bitcoin (on-chain)",
    address: "bc1q8cg7hmgmu7x9yaja8j249np0vt84d4y8duugr7",
    uri: "bitcoin:bc1q8cg7hmgmu7x9yaja8j249np0vt84d4y8duugr7",
    qrSrc: "/donate/qr/btc.png",
    qrAlt: "Bitcoin payment URI QR",
  },
  {
    id: "eth",
    coin: "Ethereum · ETH",
    network: "Ethereum mainnet",
    address: "0x29b386022e3968cf8dBFCE59569b49680184B23b",
    uri: "ethereum:0x29b386022e3968cf8dBFCE59569b49680184B23b",
    qrSrc: "/donate/qr/eth.png",
    qrAlt: "Ethereum payment URI QR",
  },
  {
    id: "ltc",
    coin: "Litecoin · LTC",
    network: "Litecoin",
    address: "LWuqPjMCFtLHvoBaQL4m8QtnxbXSDftVNs",
    uri: "litecoin:LWuqPjMCFtLHvoBaQL4m8QtnxbXSDftVNs",
    qrSrc: "/donate/qr/ltc.png",
    qrAlt: "Litecoin payment URI QR",
  },
  {
    id: "xrp",
    coin: "XRP · XRP Ledger",
    network: "XRP Ledger",
    address: "rLc3jZJbgEU1wBGwTFtgyq8bpayQE15K7b",
    uri: "xrp:rLc3jZJbgEU1wBGwTFtgyq8bpayQE15K7b",
    uriAlt: "ripple:rLc3jZJbgEU1wBGwTFtgyq8bpayQE15K7b",
    extra: DONATE_XRP_TAG_NOTE,
    qrSrc: "/donate/qr/xrp.png",
    qrAlt: "XRP payment URI QR",
  },
  {
    id: "doge",
    coin: "Dogecoin · DOGE",
    network: "Dogecoin",
    address: "DQ4go4iLPfNXDWim4KptTh3565sFCVrCyp",
    uri: "dogecoin:DQ4go4iLPfNXDWim4KptTh3565sFCVrCyp",
    qrSrc: "/donate/qr/doge.png",
    qrAlt: "Dogecoin payment URI QR",
  },
];

/** Homepage spine. Real paths only — no hash-only nav. Donate tab → /donate. No Mission tab. */
export const SPINE = [
  { id: "why", label: "Why", href: WHY_HREF },
  { id: "software", label: "Software", href: SOFTWARE_HREF },
  { id: "research", label: "Research", href: RESEARCH_HREF },
  { id: "doors", label: "Doors", href: DOORS_HREF },
  { id: "receipts", label: "Receipts", href: RECEIPTS_HREF },
  { id: "donate", label: "Donate", href: DONATE_HREF },
];

export const DOORS = [
  { label: "GitHub", href: GITHUB },
  { label: "Secondary source", href: GITHUB_SECONDARY },
  { label: "Corpus", href: LIBRARY + "/" },
  { label: "Research", href: LIBRARY + "/", also: { label: LIBRARY_AZIEL, href: LIBRARY_AZIEL } },
  { label: "GodLock", href: GODLOCK + "/" },
  { label: "He Didn't Jump", href: HEDIDNTJUMP + "/" },
  { label: "Runtime", href: RUNTIME_LOCAL, also: { label: GLAMA_LABEL, href: GLAMA_RUNTIME } },
  {
    label: TRADES_RUNTIME_NAME,
    href: TRADES_RUNTIME + "/",
    purpose: TRADES_RUNTIME_ONE_LINE,
    also: { label: "MCP", href: TRADES_RUNTIME_MCP, labelOnly: true },
  },
  { label: X_LABEL, href: X_URL },
];

export const PROSE = {
  host: "azieleliab.com",
  title: "Aziel Eliab",
  open: [
    "You don’t get to know me.",
    "You get to understand the work.",
    "Knowing is collection. A face, a timeline, a tone you could imitate. Understanding is subtraction. Take the man away and see whether anything is still true.",
    "I offer the second thing only.",
    "A self is a weather system. It passes. Work is what does not require the weather to continue existing. If you need my presence to feel the meaning, you have not found the meaning. You have found company.",
    "I am not withholding a life. I am refusing to let a life become the proof.",
  ],
  why: [
    "The world prefers a finished object. A finished death. A finished century. A finished machine. A finished tool. Finished means no one has to keep looking.",
    "I keep looking.",
    "Assassination is the conversion of a person into a verdict.",
    "History is the conversion of a structure into a title so the structure can move without an owner.",
    "Software is the conversion of opacity into a kind of nature.",
    "Hardware is the conversion of a body into a channel for someone who is not wearing it.",
    "Each conversion is a philosophy pretending to be a fact. I write and build at the point where that pretense can be touched.",
    "I do not want disciples. Disciples end the question in my favor. I want the question to outlive the favor. What cannot survive disagreement was never knowledge. It was allegiance.",
    "The work is how I stay in contact with what does not need me.",
  ],
  research: [
    "Killings closed because closure is cheaper than sight.",
    "Ages renamed so the same form can travel unnamed.",
    "Writing declared solved so no one has to read it again.",
    "Programs that sell belief as a feature.",
    "Devices that should answer to the wearer and answer instead to the room.",
    "One problem under every heading: the first ending is treated as the true one.",
    "The research corpus lives at " + LIBRARY + "/.",
  ],
  close: "If the work holds, the name was only a handle on the door.",
  sign: "— Aziel Eliab",
};
