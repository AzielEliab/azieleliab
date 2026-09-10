/** Exact landing copy and verified public doors. Author: Aziel Eliab. */

export const CANON_ORIGIN = "https://www.azieleliab.com";
export const APEX_HOST = "azieleliab.com";
export const WWW_HOST = "www.azieleliab.com";
export const AUTHOR = "Aziel Eliab";
export const AUTHOR_AKA = "Aziel Elroi Eliab";
export const SITE = "Aziel Eliab";
export const SIGIL = "https://www.azielcorpuslibrary.net/sigil.png";
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
export const RUNTIME = "https://aziel-runtime.vibelock.workers.dev";
export const RUNTIME_PATH = "/runtime";
export const RUNTIME_LOCAL = CANON_ORIGIN + RUNTIME_PATH;
/** Software-strip slug / list name. Title form is for blurbs and meta only. */
export const RUNTIME_SLUG = "aziel-runtime";
export const RUNTIME_NAME = "aziel-runtime";
export const RUNTIME_TITLE = "Aziel Runtime";
/** Soft-name strip on the landing. GET /software 301s here. */
export const SOFTWARE_SECTION = CANON_ORIGIN + "/#software";
/** Same-site honest stub. Live catalog may list embryolock as stub / local-not-hosted. */
export const EMBRYOLOCK_PATH = "/embryolock";
export const EMBRYOLOCK_HREF = CANON_ORIGIN + EMBRYOLOCK_PATH;
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
export const X_URL = "https://x.com/azieleliab";

export const DESCRIPTION =
  "Aziel Eliab. You don’t get to know me. You get to understand the work. Public identity Aziel Eliab only.";

/**
 * Documented aziel-runtime catalog slugs (1.6.8 PRODUCTS_RAW extras stay
 * as EXTRA_SOFTWARE: AZBrowser, AZNet, AZHub, AZInterface). Includes
 * peacelock and azmail. Door: worker_home when the tracker is ready,
 * else GitHub, else library hub. Display names are catalog `name`. Lumen is not listed.
 * EmbryoLock stays as a name-only local-not-hosted stub on this host
 * (`/embryolock`, or the live stub entry). Live catalog at request time
 * is preferred over this static fallback.
 * AZHub and AZInterface are separate Plain doors — never one combined engine.
 */
export const CATALOG_SLUGS = [
  "ark",
  "azai",
  "azbot",
  "azclce",
  "aziel-corpus",
  "azieltether",
  "azmail",
  "azos",
  "chronolock",
  "codelock",
  "decisiongate",
  "employeelock",
  "foldlock",
  "forgereceipts",
  "glossafilter",
  "godlock",
  "mialock",
  "miragegrid",
  "peacelock",
  "postking",
  "shadowlock",
  "spectrallock",
  "staticclock",
  "temporallock",
  "trajectorylock",
  "veillock",
  "vibelock",
  "whistlelock",
  "zsolver",
];

/** Catalog `name` for each documented slug. */
export const CATALOG_NAMES = {
  ark: "The ARK",
  azai: "AZAI",
  azbot: "AZBot",
  azclce: "AZ-CLCE",
  "aziel-corpus": "Aziel Digital Library",
  azieltether: "AzielTether",
  azmail: "AZMail",
  azos: "AZ-OS",
  chronolock: "ChronoLock",
  codelock: "CodeLock",
  decisiongate: "DecisionGATE",
  employeelock: "EmployeeLock",
  foldlock: "FoldLock",
  forgereceipts: "ForgeReceipts",
  glossafilter: "Glossa Filter",
  godlock: "GodLock",
  mialock: "M.I.A.Lock",
  miragegrid: "MirageGrid",
  peacelock: "PeaceLock",
  postking: "Post-King Chess",
  shadowlock: "ShadowLock",
  spectrallock: "SpectralLock",
  staticclock: "StaticClock",
  temporallock: "TemporalLock",
  trajectorylock: "TrajectoryLock",
  veillock: "VeilLock",
  vibelock: "VibeLock",
  whistlelock: "WhistleLock",
  zsolver: "ZionPattern Solver",
};

/** Not in the documented catalog yet. Do not invent a landing door. */
export const CATALOG_LATER_SLUGS = [];

export const AZMAIL_WORKER = "https://azmail-download-tracker.vibelock.workers.dev/";
export const PEACELOCK_WORKER = "https://peacelock-download-tracker.vibelock.workers.dev/";
export const PEACELOCK_GITHUB = "https://github.com/AzielEliab/peacelock";

/** Slugs whose download-tracker Worker is not ready — use GitHub. Empty: trackers live. */
export const CATALOG_GITHUB_FALLBACK = new Set();

export function catalogGithub(slug) {
  return "https://github.com/AzielEliab/" + slug;
}

export function catalogWorkerHome(slug) {
  if (slug === "aziel-corpus") return LIBRARY + "/";
  if (slug === "azmail") return AZMAIL_WORKER;
  if (slug === "peacelock") return PEACELOCK_WORKER;
  return "https://" + slug + "-download-tracker.vibelock.workers.dev/";
}

/** Prefer worker_home; GitHub if the tracker is not ready; library hub last. */
export function catalogHref(slug) {
  if (slug === "aziel-corpus") return LIBRARY + "/";
  if (CATALOG_GITHUB_FALLBACK.has(slug)) return catalogGithub(slug);
  return catalogWorkerHome(slug);
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
    out.push({
      slug: canonicalSoftwareSlug(slug, name) || slug,
      name,
      href: catalogHref(slug) || live.worker_home || live.github || LIBRARY_SOFTWARE,
    });
  };
  for (const slug of slugs || []) add(slug);
  for (const later of CATALOG_LATER_SLUGS) {
    if (liveBySlug.has(later)) add(later);
  }
  return out;
}

export const CATALOG_SOFTWARE = catalogSoftwareFromSlugs();

/** Kept on the landing though not in the documented catalog. */
export const EMBRYOLOCK = { name: "EmbryoLock", href: EMBRYOLOCK_HREF };
export const CATALOG_ONLY = ["EmbryoLock"];

/** Honest stub copy. Not a Worker. Not the corpus catalog. */
export const EMBRYOLOCK_COPY = {
  title: "EmbryoLock",
  open: [
    "Name only. Local-not-hosted. Not a public Worker.",
    "There is no public download-tracker and no public GitHub repository.",
    "The live catalog may list this as a stub. It is not a FragGate engine.",
    "This page is the door. It is not the Digital Library catalog.",
  ],
};

/** Catalog does not list these; they remain extra landing doors. */
export const EXTRA_SOFTWARE = [
  EMBRYOLOCK,
  { name: "AZBrowser", href: AZBROWSER_WORKER },
  { name: "AZNet", href: AZNET_WORKER },
  { name: "AZHub", href: AZHUB_WORKER },
  { name: "AZInterface", href: AZINTERFACE_WORKER },
  { slug: RUNTIME_SLUG, name: RUNTIME_NAME, href: RUNTIME_LOCAL },
  { name: "FragGate", href: FRAGGATE_WORKER },
];

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

export const SOFTWARE = sortSoftware(CATALOG_SOFTWARE.concat(EXTRA_SOFTWARE));

/** AZL-DONATE-1.0. Primary canonical Donate door. Not a Softwares product. */
export const DONATE_PATH = "/donate";
export const DONATE_HREF = CANON_ORIGIN + DONATE_PATH + "?v=png";
export const DONATE_TITLE = "Donate";
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

/** Homepage spine. Donate is also its own URL. */
export const SPINE = [
  { id: "why", label: "Why", href: CANON_ORIGIN + "/#why" },
  { id: "software", label: "Software", href: SOFTWARE_SECTION },
  { id: "research", label: "Research", href: CANON_ORIGIN + "/#research" },
  { id: "doors", label: "Doors", href: CANON_ORIGIN + "/#doors" },
  { id: "donate", label: "Donate", href: DONATE_HREF },
];

export const DOORS = [
  { label: "GitHub", href: GITHUB },
  { label: "Secondary source", href: GITHUB_SECONDARY },
  { label: "Corpus", href: LIBRARY + "/" },
  { label: "Research", href: LIBRARY + "/", also: { label: LIBRARY_AZIEL, href: LIBRARY_AZIEL } },
  { label: "GodLock", href: GODLOCK + "/" },
  { label: "Runtime", href: RUNTIME_LOCAL, also: { label: RUNTIME + "/", href: RUNTIME + "/" } },
  { label: "X", href: X_URL },
  { label: "Donate", href: DONATE_HREF },
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
