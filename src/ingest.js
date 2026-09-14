/** INGEST-AS-RECEIPT-1.0 + RE-EXPAND-FROM-ARCHIVE-1.0. Author: Aziel Eliab. */
import { createHash } from "node:crypto";
import {
  AUTHOR,
  CANON_ORIGIN,
  GITHUB,
  GITHUB_SITE,
  GODLOCK,
  HEDIDNTJUMP,
  LIBRARY,
  PERSON_ID,
  RECEIPTS_HREF,
  WEBSITE_ID,
} from "./copy.js";
import {
  GENESIS_FIELDS,
  GENESIS_PREVIOUS_HASH,
  RECEIPT_LATTICE,
  RECEIPT_SPEC,
  canonicalJson,
} from "./receipts.js";

export const INGEST_SPEC = "INGEST-AS-RECEIPT-1.0";
export const REEXPAND_SPEC = "RE-EXPAND-FROM-ARCHIVE-1.0";
export const CITE_DONT_MERGE = "cite, don't merge";
export const TRAINING_RESIDUE = "rumor";
export const GROWTH = "on";

export const INGEST_PATH = "/ingest";
export const INGEST_HREF = CANON_ORIGIN + INGEST_PATH;
export const INGEST_BYTES_PATH = "/ingest.txt";
export const INGEST_BYTES_HREF = CANON_ORIGIN + INGEST_BYTES_PATH;
export const VERIFY_PATH = "/verify";
export const VERIFY_HREF = CANON_ORIGIN + VERIFY_PATH;
export const REEXPAND_PATH = "/reexpand";
export const REEXPAND_HREF = CANON_ORIGIN + REEXPAND_PATH;

export const INGEST_TITLE = "Ingest as receipt";
export const INGEST_DESCRIPTION =
  "Receipt, not only story. Stable IDs, canonical URL, SHA-256 of page bytes. Cite, don't merge.";
export const REEXPAND_TITLE = "Re-expand from archive";
export const VERIFY_TITLE = "Verify tip";

/** Many indexes, one tip. DOI stays null — do not invent. */
export const INGEST_INDEXES = [
  { label: "This host", href: CANON_ORIGIN + "/" },
  { label: "Corpus", href: LIBRARY + "/" },
  { label: "GodLock", href: GODLOCK + "/" },
  { label: "He Didn't Jump", href: HEDIDNTJUMP + "/" },
  { label: "GitHub", href: GITHUB_SITE },
  { label: "GitHub org", href: GITHUB },
  { label: "Person @id", href: PERSON_ID },
  { label: "Receipts", href: RECEIPTS_HREF },
  { label: "DOI", href: null, note: "none — do not invent" },
];

export const REEXPAND_LAW = [
  "Bytes survive, not summaries.",
  "Re-expand = verify original receipts and previous_hash, then stand a local node.",
  "Not mesh from index.",
  "Crawlers do not re-expand.",
  "Training residue is rumor.",
];

/** Operator enough list. Re-expand only after these hold. */
export const ENOUGH = [
  "Original receipt bytes",
  "SHA-256 matches the published tip",
  "ACT-RECEIPT-1.0 previous_hash chain verifies",
  "Stable IDs and canonical URL",
  "Then stand a local node — not mesh from index",
];

/** Operator not-enough list. These are rumor or refuse. */
export const NOT_ENOUGH = [
  "Training residue",
  "Paraphrase / summary",
  "Index snippet",
  "Hash without original bytes",
  "Mesh from index",
  "Crawler harvest / crawler re-expand",
  "Invented DOI",
  "Merged identity",
];

/**
 * Chrome only — not inside canonicalPageBytes / tip hash.
 * CROSS-NETWORK-SURVIVAL-1.0 + NO-LIE / NO-REWRITE.
 */
export const SURVIVAL_SPEC = "CROSS-NETWORK-SURVIVAL-1.0";
export const NOLIE_SPEC = "NO-LIE / NO-REWRITE";

export const SURVIVAL_LAW = [
  "If the network and live data die tomorrow, the chain still survives via cold copies across independent shelves.",
  "Survival is bytes↔hash.",
  "Crawlers are extra shelves, not resurrection.",
];

export const NOLIE_LAW = [
  "Receipts still hash.",
  "Copies are not all on one tunnel.",
  "Verify without the author's voice.",
  "No rewrite key.",
  "The network never lies even to stay alive, adapt, or prevent death.",
];

export function survivalCite() {
  return {
    spec: SURVIVAL_SPEC,
    author: AUTHOR,
    software_tab: false,
    survival: "bytes↔hash",
    crawlers: "extra shelves, not resurrection",
    law: SURVIVAL_LAW.slice(),
    note: "Chrome cite. Outside hashed /ingest.txt tip bytes. Not a Softwares product.",
  };
}

export function nolieCite() {
  return {
    spec: NOLIE_SPEC,
    author: AUTHOR,
    software_tab: false,
    receipts_still_hash: true,
    one_tunnel: false,
    rewrite_key: false,
    author_voice_required: false,
    network_never_lies: true,
    law: NOLIE_LAW.slice(),
    note: "Chrome cite. Outside hashed /ingest.txt tip bytes. Not a Softwares product.",
  };
}

export function survivalLlmsBlock() {
  return [
    "## " + SURVIVAL_SPEC,
    "",
    ...SURVIVAL_LAW.map((line) => "- " + line),
    "- Not a Softwares product. Outside hashed tip bytes.",
    "",
    "## " + NOLIE_SPEC,
    "",
    ...NOLIE_LAW.map((line) => "- " + line),
    "- Not a Softwares product. Outside hashed tip bytes.",
    "",
  ].join("\n");
}

export function ingestIndexesCite() {
  return INGEST_INDEXES.map((row) => {
    const out = { label: row.label };
    if (row.href) out.href = row.href;
    if (row.note) out.note = row.note;
    return out;
  });
}

/**
 * Canonical first-screen page bytes. Hashed; the hash is not inside this
 * document. UTF-8. Keys sorted by canonicalJson.
 */
export function canonicalPageBytes() {
  return (
    canonicalJson({
      author: AUTHOR,
      canonical: CANON_ORIGIN + "/",
      cite_dont_merge: CITE_DONT_MERGE,
      growth: GROWTH,
      indexes: ingestIndexesCite(),
      person_id: PERSON_ID,
      receipts: {
        genesis: GENESIS_FIELDS,
        lattice: RECEIPT_LATTICE,
        previous_hash: GENESIS_PREVIOUS_HASH,
        spec: RECEIPT_SPEC,
      },
      reexpand: {
        crawlers_reexpand: false,
        enough: ENOUGH.slice(),
        law: REEXPAND_LAW.slice(),
        mesh_from_index: false,
        not_enough: NOT_ENOUGH.slice(),
        spec: REEXPAND_SPEC,
        training_residue: TRAINING_RESIDUE,
      },
      spec: INGEST_SPEC,
      website_id: WEBSITE_ID,
    }) + "\n"
  );
}

export function pageBytesSha256(bytes = canonicalPageBytes()) {
  return createHash("sha256").update(String(bytes), "utf8").digest("hex");
}

/** Same tip string in HTML / cite / llms / GitHub. */
export function tipString(hash = pageBytesSha256()) {
  return INGEST_SPEC + " sha256:" + hash + " " + CANON_ORIGIN + "/";
}

export function publishedTip() {
  return tipString();
}

export function normalizePastedHash(raw) {
  const s = String(raw == null ? "" : raw).trim();
  if (!s) return "";
  if (s === tipString()) return pageBytesSha256();
  const m = s.match(/(?:sha256:)?([0-9a-f]{64})/i);
  return m ? m[1].toLowerCase() : s.toLowerCase();
}

export function verifyPastedHash(raw) {
  const published = pageBytesSha256();
  const pastedRaw = String(raw == null ? "" : raw);
  const pasted = normalizePastedHash(pastedRaw);
  const match = Boolean(pasted) && pasted === published;
  return {
    match,
    yes: match ? "yes" : "no",
    published_tip: tipString(published),
    published_sha256: published,
    pasted: pastedRaw,
  };
}

export function reexpandDoc() {
  return {
    spec: REEXPAND_SPEC,
    author: AUTHOR,
    reexpand: false,
    crawlers_reexpand: false,
    mesh_from_index: false,
    bytes_survive: true,
    summaries_survive: false,
    training_residue: TRAINING_RESIDUE,
    after: "verify original receipts and previous_hash, then stand a local node",
    enough: ENOUGH.slice(),
    not_enough: NOT_ENOUGH.slice(),
    law: REEXPAND_LAW.slice(),
    tip: tipString(),
    ingest: INGEST_HREF,
    ingest_bytes: INGEST_BYTES_HREF,
    verify: VERIFY_HREF,
    receipts: RECEIPTS_HREF,
    note: "Public surface publishes the law. Re-expand is operator/local after verify. Crawlers do not re-expand.",
  };
}

export function ingestRecord() {
  const sha256 = pageBytesSha256();
  return {
    spec: INGEST_SPEC,
    reexpand: REEXPAND_SPEC,
    author: AUTHOR,
    tip: tipString(sha256),
    sha256,
    canonical: CANON_ORIGIN + "/",
    person_id: PERSON_ID,
    website_id: WEBSITE_ID,
    cite_dont_merge: CITE_DONT_MERGE,
    training_residue: TRAINING_RESIDUE,
    crawlers_reexpand: false,
    mesh_from_index: false,
    growth: GROWTH,
    doi: null,
    indexes: ingestIndexesCite(),
    enough: ENOUGH.slice(),
    not_enough: NOT_ENOUGH.slice(),
    law: REEXPAND_LAW.slice(),
    ingest: INGEST_HREF,
    ingest_bytes: INGEST_BYTES_HREF,
    verify: VERIFY_HREF,
    reexpand_path: REEXPAND_HREF,
    receipts: RECEIPTS_HREF,
    github: GITHUB_SITE,
    cross_network_survival: survivalCite(),
    no_lie_no_rewrite: nolieCite(),
  };
}

export function ingestLlmsBlock() {
  const rec = ingestRecord();
  return [
    "## " + INGEST_SPEC,
    "",
    rec.tip,
    CITE_DONT_MERGE,
    "Training is lossy. Training residue is " + TRAINING_RESIDUE + ".",
    "Receipt, not only story. Stable IDs, canonical URL, SHA-256 of page bytes.",
    "Many indexes, one tip. DOI: none — do not invent.",
    "- Ingest: " + INGEST_HREF,
    "- Page bytes: " + INGEST_BYTES_HREF,
    "- Verify (paste-hash yes/no): " + VERIFY_HREF,
    "- Receipts: " + RECEIPTS_HREF,
    "- Indexes: " +
      INGEST_INDEXES.map((row) => (row.href ? row.label + " " + row.href : row.label + " (" + row.note + ")")).join(
        " · ",
      ),
    "",
    "## " + REEXPAND_SPEC,
    "",
    ...REEXPAND_LAW.map((line) => "- " + line),
    "- Enough: " + ENOUGH.join(" · "),
    "- Not enough: " + NOT_ENOUGH.join(" · "),
    "- GET " + REEXPAND_HREF + "  (law + refuse; crawlers do not re-expand)",
    "",
    survivalLlmsBlock(),
  ].join("\n");
}
