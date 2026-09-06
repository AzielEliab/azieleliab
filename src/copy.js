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
export const FRAGGATE = "https://github.com/AzielEliab/fraggate";
export const X_URL = "https://x.com/azieleliab";

export const DESCRIPTION =
  "Aziel Eliab. You don’t get to know me. You get to understand the work. Public identity Aziel Eliab only.";

/** Verified September 2026: download-tracker homepage, else GitHub, else catalog/software hub. */
export const SOFTWARE = [
  { name: "ForgeReceipts", href: "https://forgereceipts-download-tracker.vibelock.workers.dev/" },
  { name: "TemporalLock", href: "https://temporallock-download-tracker.vibelock.workers.dev/" },
  { name: "EmbryoLock", href: LIBRARY_SOFTWARE },
  { name: "ARK", href: "https://ark-download-tracker.vibelock.workers.dev/" },
  { name: "AZ-OS", href: "https://azos-download-tracker.vibelock.workers.dev/" },
  { name: "AZAI", href: "https://azai-download-tracker.vibelock.workers.dev/" },
  { name: "Lumen", href: LIBRARY_SOFTWARE },
  { name: "GodLock", href: GODLOCK + "/" },
  { name: "aziel-runtime", href: RUNTIME + "/" },
  { name: "FragGate", href: FRAGGATE },
  { name: "DecisionGATE", href: "https://decisiongate-download-tracker.vibelock.workers.dev/" },
  { name: "FoldLock", href: "https://foldlock-download-tracker.vibelock.workers.dev/" },
  { name: "WhistleLock", href: "https://whistlelock-download-tracker.vibelock.workers.dev/" },
  { name: "CodeLock", href: "https://codelock-download-tracker.vibelock.workers.dev/" },
  { name: "VeilLock", href: "https://veillock-download-tracker.vibelock.workers.dev/" },
  { name: "VibeLock", href: "https://vibelock-download-tracker.vibelock.workers.dev/" },
  { name: "ShadowLock", href: "https://shadowlock-download-tracker.vibelock.workers.dev/" },
  { name: "StaticClock", href: "https://staticclock-download-tracker.vibelock.workers.dev/" },
  { name: "PeaceLock", href: LIBRARY_SOFTWARE },
  { name: "EmployeeLock", href: "https://employeelock-download-tracker.vibelock.workers.dev/" },
];

export const CATALOG_ONLY = ["EmbryoLock", "Lumen", "PeaceLock"];

export const DOORS = [
  { label: "GitHub", href: GITHUB },
  { label: "Secondary source", href: GITHUB_SECONDARY },
  { label: "Corpus", href: LIBRARY + "/" },
  { label: "GodLock", href: GODLOCK + "/" },
  { label: "Runtime", href: GITHUB_RUNTIME, also: { label: LIBRARY_RUNTIME, href: LIBRARY_RUNTIME } },
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
  ],
  close: "If the work holds, the name was only a handle on the door.",
  sign: "— Aziel Eliab",
};
