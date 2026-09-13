/** ACT-RECEIPT-1.0 display chain for /receipts. Author: Aziel Eliab. */
import {
  AUTHOR,
  CANON_ORIGIN,
  GODLOCK,
  HEDIDNTJUMP,
  LIBRARY,
  PERSON_ID,
  RECEIPTS_DESCRIPTION,
  RECEIPTS_HREF,
  RECEIPTS_PATH,
} from "./copy.js";

export const RECEIPT_SPEC = "ACT-RECEIPT-1.0";
export const GENESIS_PREVIOUS_HASH = "0".repeat(64);

export const RECEIPT_LATTICE = [
  { label: "Corpus", href: LIBRARY + RECEIPTS_PATH },
  { label: "GodLock", href: GODLOCK + RECEIPTS_PATH },
  { label: "He Didn't Jump", href: HEDIDNTJUMP + RECEIPTS_PATH },
];

export const GENESIS_FIELDS = {
  previous_hash: GENESIS_PREVIOUS_HASH,
  request: "Open the Receipts door on this host.",
  output: "Receipts published at /receipts. This host’s action-receipt chain begins.",
  event: {
    at: "2026-09-13T00:00:00.000Z",
    kind: "door.open",
    id: "AZACT-GENESIS",
  },
};

export function canonicalJson(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map((item) => canonicalJson(item)).join(",") + "]";
  return (
    "{" +
    Object.keys(value)
      .sort()
      .map((key) => JSON.stringify(key) + ":" + canonicalJson(value[key]))
      .join(",") +
    "}"
  );
}

export function eventMetadata(event) {
  return {
    at: String((event && event.at) || ""),
    id: String((event && event.id) || ""),
    kind: String((event && event.kind) || ""),
  };
}

export function canonicalPayload(entry) {
  return {
    event: eventMetadata(entry && entry.event),
    output: String((entry && entry.output) || ""),
    previous_hash: String((entry && entry.previous_hash) || ""),
    request: String((entry && entry.request) || ""),
    spec: RECEIPT_SPEC,
  };
}

export async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(String(text));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function entryHash(entry) {
  return sha256Hex(canonicalJson(canonicalPayload(entry)));
}

export async function mintEntry(fields) {
  const payload = canonicalPayload(fields);
  return {
    entry_hash: await sha256Hex(canonicalJson(payload)),
    ...payload,
  };
}

export async function genesisReceipt() {
  return mintEntry(GENESIS_FIELDS);
}

export async function hostReceipts() {
  return [await genesisReceipt()];
}

export async function appendReceipt(chain, fields) {
  const list = Array.isArray(chain) ? chain : [];
  const previous_hash = list.length ? list[list.length - 1].entry_hash : GENESIS_PREVIOUS_HASH;
  const entry = await mintEntry({ ...fields, previous_hash });
  return [...list, entry];
}

export async function verifyChain(entries) {
  const list = Array.isArray(entries) ? entries : [];
  let previous = GENESIS_PREVIOUS_HASH;
  for (const entry of list) {
    if (!entry || entry.previous_hash !== previous) return false;
    if (entry.spec !== RECEIPT_SPEC) return false;
    if ((await entryHash(entry)) !== entry.entry_hash) return false;
    previous = entry.entry_hash;
  }
  return true;
}

export function newestFirst(entries) {
  return Array.isArray(entries) ? [...entries].reverse() : [];
}

export function receiptsDatasetJsonLd(entries) {
  const list = newestFirst(entries);
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": RECEIPTS_HREF + "#act-receipt",
    name: "ACT-RECEIPT-1.0 action receipts — azieleliab.com",
    description: RECEIPTS_DESCRIPTION,
    url: RECEIPTS_HREF,
    creator: { "@id": PERSON_ID },
    author: { "@id": PERSON_ID },
    about: { "@id": PERSON_ID },
    inLanguage: "en",
    identifier: RECEIPT_SPEC,
    publisher: { "@type": "Person", "@id": PERSON_ID, name: AUTHOR },
    hasPart: list.map((entry) => ({
      "@type": "CreativeWork",
      "@id": RECEIPTS_HREF + "#" + entry.entry_hash,
      identifier: entry.entry_hash,
      name: entry.request,
      text: entry.output,
      dateCreated: entry.event.at,
    })),
  };
}

export function eventMetadataSentence(entry) {
  const event = eventMetadata(entry && entry.event);
  const prev = String((entry && entry.previous_hash) || "");
  return [event.id, event.kind, event.at, prev ? "previous " + prev : ""]
    .filter(Boolean)
    .join(" · ");
}
