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
export const LIBRARY = "https://www.azielcorpuslibrary.net";
export const LIBRARY_SOFTWARE = LIBRARY + "/software";
export const LIBRARY_RUNTIME = LIBRARY + "/runtime";
export const LIBRARY_AZIEL = LIBRARY + "/AzielEliab";
export const GODLOCK = "https://godlock.uk";
export const GODLOCK_AZIEL = GODLOCK + "/AzielEliab";
export const RUNTIME = "https://aziel-runtime.vibelock.workers.dev";
export const RUNTIME_PATH = "/runtime";
export const RUNTIME_LOCAL = CANON_ORIGIN + RUNTIME_PATH;
export const FRAGGATE = "https://github.com/AzielEliab/fraggate";
export const X_URL = "https://x.com/azieleliab";

export const DESCRIPTION =
  "Aziel Eliab. You don’t get to know me. You get to understand the work. Public identity Aziel Eliab only.";

/**
 * Documented aziel-runtime catalog slugs (1.6.4 PRODUCTS_RAW).
 * Includes peacelock. AZMail joins only after it is in this catalog.
 * Door: worker_home when the tracker is ready, else GitHub, else library hub.
 * Display names are catalog `name`. Lumen is not listed.
 * EmbryoLock stays as a catalog-only name on the library software hub.
 */
export const CATALOG_SLUGS = [
  "ark",
  "azai",
  "azbot",
  "azclce",
  "aziel-corpus",
  "azieltether",
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
export const CATALOG_LATER_SLUGS = ["azmail"];

export const PEACELOCK_WORKER = "https://peacelock-download-tracker.vibelock.workers.dev/";
export const PEACELOCK_GITHUB = "https://github.com/AzielEliab/peacelock";

/** Slugs whose download-tracker Worker is not ready — use GitHub. */
export const CATALOG_GITHUB_FALLBACK = new Set(["peacelock"]);

export function catalogGithub(slug) {
  return "https://github.com/AzielEliab/" + slug;
}

export function catalogWorkerHome(slug) {
  if (slug === "aziel-corpus") return LIBRARY + "/";
  if (slug === "peacelock") return PEACELOCK_WORKER;
  return "https://" + slug + "-download-tracker.vibelock.workers.dev/";
}

/** Prefer worker_home; GitHub if the tracker is not ready; library hub last. */
export function catalogHref(slug) {
  if (slug === "aziel-corpus") return LIBRARY + "/";
  if (CATALOG_GITHUB_FALLBACK.has(slug)) return catalogGithub(slug);
  return catalogWorkerHome(slug);
}

export function catalogSoftwareFromSlugs(slugs = CATALOG_SLUGS, liveProducts = []) {
  const liveBySlug = new Map((liveProducts || []).map((p) => [p && p.slug, p]));
  const seen = new Set();
  const out = [];
  const add = (slug) => {
    if (!slug || seen.has(slug)) return;
    seen.add(slug);
    const live = liveBySlug.get(slug) || {};
    const name = CATALOG_NAMES[slug] || live.name;
    if (!name) return;
    out.push({
      slug,
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
export const EMBRYOLOCK = { name: "EmbryoLock", href: LIBRARY_SOFTWARE };
export const CATALOG_ONLY = ["EmbryoLock"];

/** Catalog does not list these; they remain extra landing doors. */
export const EXTRA_SOFTWARE = [
  EMBRYOLOCK,
  { name: "aziel-runtime", href: RUNTIME_LOCAL },
  { name: "FragGate", href: FRAGGATE },
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

export const DOORS = [
  { label: "GitHub", href: GITHUB },
  { label: "Secondary source", href: GITHUB_SECONDARY },
  { label: "Corpus", href: LIBRARY + "/" },
  { label: "Research", href: LIBRARY + "/", also: { label: LIBRARY_AZIEL, href: LIBRARY_AZIEL } },
  { label: "GodLock", href: GODLOCK + "/" },
  { label: "Runtime", href: RUNTIME_LOCAL, also: { label: RUNTIME + "/", href: RUNTIME + "/" } },
  { label: "X", href: X_URL },
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
  softwareClose: "Run them without me.",
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
