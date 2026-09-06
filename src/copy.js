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
 * Live aziel-runtime catalog (27), September 2026.
 * Door: worker_home when set, else github, else library software hub.
 * Display names are catalog `name`. Lumen and PeaceLock are not listed.
 * EmbryoLock stays as a catalog-only name on the library software hub.
 */
export const CATALOG_SOFTWARE = [
  { slug: "vibelock", name: "VibeLock", href: "https://vibelock-download-tracker.vibelock.workers.dev/" },
  { slug: "veillock", name: "VeilLock", href: "https://veillock-download-tracker.vibelock.workers.dev/" },
  { slug: "codelock", name: "CodeLock", href: "https://codelock-download-tracker.vibelock.workers.dev/" },
  { slug: "godlock", name: "GodLock", href: "https://godlock-download-tracker.vibelock.workers.dev/" },
  { slug: "shadowlock", name: "ShadowLock", href: "https://shadowlock-download-tracker.vibelock.workers.dev/" },
  { slug: "temporallock", name: "TemporalLock", href: "https://temporallock-download-tracker.vibelock.workers.dev/" },
  { slug: "forgereceipts", name: "ForgeReceipts", href: "https://forgereceipts-download-tracker.vibelock.workers.dev/" },
  { slug: "decisiongate", name: "DecisionGATE", href: "https://decisiongate-download-tracker.vibelock.workers.dev/" },
  { slug: "zsolver", name: "ZionPattern Solver", href: "https://zsolver-download-tracker.vibelock.workers.dev/" },
  { slug: "azos", name: "AZ-OS", href: "https://azos-download-tracker.vibelock.workers.dev/" },
  { slug: "glossafilter", name: "Glossa Filter", href: "https://glossafilter-download-tracker.vibelock.workers.dev/" },
  { slug: "miragegrid", name: "MirageGrid", href: "https://miragegrid-download-tracker.vibelock.workers.dev/" },
  { slug: "staticclock", name: "StaticClock", href: "https://staticclock-download-tracker.vibelock.workers.dev/" },
  { slug: "chronolock", name: "ChronoLock", href: "https://chronolock-download-tracker.vibelock.workers.dev/" },
  { slug: "postking", name: "Post-King Chess", href: "https://postking-download-tracker.vibelock.workers.dev/" },
  { slug: "azclce", name: "AZ-CLCE", href: "https://azclce-download-tracker.vibelock.workers.dev/" },
  { slug: "ark", name: "The ARK", href: "https://ark-download-tracker.vibelock.workers.dev/" },
  { slug: "azai", name: "AZAI", href: "https://azai-download-tracker.vibelock.workers.dev/" },
  { slug: "spectrallock", name: "SpectralLock", href: "https://spectrallock-download-tracker.vibelock.workers.dev/" },
  { slug: "azbot", name: "AZBot", href: "https://azbot-download-tracker.vibelock.workers.dev/" },
  { slug: "employeelock", name: "EmployeeLock", href: "https://employeelock-download-tracker.vibelock.workers.dev/" },
  { slug: "foldlock", name: "FoldLock", href: "https://foldlock-download-tracker.vibelock.workers.dev/" },
  { slug: "whistlelock", name: "WhistleLock", href: "https://whistlelock-download-tracker.vibelock.workers.dev/" },
  { slug: "trajectorylock", name: "TrajectoryLock", href: "https://trajectorylock-download-tracker.vibelock.workers.dev/" },
  { slug: "mialock", name: "M.I.A.Lock", href: "https://mialock-download-tracker.vibelock.workers.dev/" },
  { slug: "azieltether", name: "AzielTether", href: "https://azieltether-download-tracker.vibelock.workers.dev/" },
  { slug: "aziel-corpus", name: "Aziel Digital Library", href: LIBRARY + "/" },
];

/** Kept on the landing though not in the live 27-product catalog. */
export const EMBRYOLOCK = { name: "EmbryoLock", href: LIBRARY_SOFTWARE };
export const CATALOG_ONLY = ["EmbryoLock"];

/** Catalog does not list these; they remain extra landing doors. */
export const EXTRA_SOFTWARE = [
  EMBRYOLOCK,
  { name: "aziel-runtime", href: RUNTIME_LOCAL },
  { name: "FragGate", href: FRAGGATE },
];

export const SOFTWARE = CATALOG_SOFTWARE.concat(EXTRA_SOFTWARE);

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
