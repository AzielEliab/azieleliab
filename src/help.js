/** Human help / addendum surfaces. Author: Aziel Eliab.
 * Additive discoverability only — machine catalogs stay on /llms.txt and /cite.json.
 */
import {
  AUTHOR,
  AUTHOR_AKA,
  CANON_ORIGIN,
  DONATE_COPY,
  DONATE_DISCLAIMER,
  DONATE_HREF,
  DONATE_RAILS,
  DONATE_TITLE,
  GITHUB,
  GLAMA_RUNTIME,
  GODLOCK,
  HEDIDNTJUMP,
  LIBRARY,
  LICENSE,
  PERSON_ID,
  RECEIPTS_DESCRIPTION,
  RECEIPTS_HREF,
  RECEIPTS_TITLE,
  RUNTIME,
  RUNTIME_DOCS,
  RUNTIME_DOWNLOAD,
  RUNTIME_LOCAL,
  RUNTIME_TITLE,
  RUNTIME_VERSION,
  SOFTWARE_HREF,
  SOFTWARE_TITLE,
  TRADES_RUNTIME,
  TRADES_RUNTIME_GITHUB,
  TRADES_RUNTIME_NAME,
  TRADES_RUNTIME_ONE_LINE,
  X_URL,
} from "./copy.js";
import {
  SITE_COVERAGE,
  SOFTWARE_DEVELOPER_ANSWER,
  VISIBLE_LOCK_LINE,
  WHAT_AZIEL_ELIAB_DOES,
  WHAT_HE_DOES_SOFTWARES,
  WHO_DESCRIPTION,
} from "./identity.js";
import {
  INGEST_BYTES_HREF,
  INGEST_HREF,
  INGEST_SPEC,
  VERIFY_HREF,
  VERIFY_TITLE,
} from "./ingest.js";
import { RECEIPT_LATTICE, RECEIPT_SPEC } from "./receipts.js";

export const HELP_TXT_PATH = "/help.txt";
export const ADDENDUM_TXT_PATH = "/addendum.txt";
export const HELP_SOFTWARES_PATH = "/help/softwares.txt";
export const HELP_RECEIPTS_PATH = "/help/receipts.txt";
export const HELP_RUNTIME_PATH = "/help/runtime.txt";

/** Canonical .txt files served by the Worker and listed in sitemap.xml. */
export const HELP_SITEMAP_PATHS = [
  HELP_TXT_PATH,
  ADDENDUM_TXT_PATH,
  HELP_SOFTWARES_PATH,
  HELP_RECEIPTS_PATH,
  HELP_RUNTIME_PATH,
];

export const HELP_SITEMAP_HREFS = HELP_SITEMAP_PATHS.map((p) => CANON_ORIGIN + p);

const HELP_ROUTE_BODIES = {
  [HELP_TXT_PATH]: helpTxt,
  "/help": helpTxt,
  [ADDENDUM_TXT_PATH]: addendumTxt,
  "/addendum": addendumTxt,
  [HELP_SOFTWARES_PATH]: helpSoftwaresTxt,
  "/help/softwares": helpSoftwaresTxt,
  [HELP_RECEIPTS_PATH]: helpReceiptsTxt,
  "/help/receipts": helpReceiptsTxt,
  [HELP_RUNTIME_PATH]: helpRuntimeTxt,
  "/help/runtime": helpRuntimeTxt,
};

export function isHelpPath(path) {
  return Object.prototype.hasOwnProperty.call(HELP_ROUTE_BODIES, path);
}

export function helpBody(path) {
  const fn = HELP_ROUTE_BODIES[path];
  return fn ? fn() : "";
}

function pointersBlock() {
  return [
    "Machine catalogs (names, doors, hashes) stay on these files — this addendum points at them:",
    "- " + CANON_ORIGIN + "/llms.txt",
    "- " + CANON_ORIGIN + "/cite.json",
    "- " + CANON_ORIGIN + "/v1/software",
  ].join("\n");
}

function identityBlock() {
  return [
    VISIBLE_LOCK_LINE,
    "",
    WHAT_AZIEL_ELIAB_DOES,
    "",
    WHO_DESCRIPTION,
    "",
    "Also known as " + AUTHOR_AKA + ".",
    "Person @id: " + PERSON_ID,
    "Canonical hub: " + CANON_ORIGIN + "/",
  ].join("\n");
}

function sisterHubLines() {
  return SITE_COVERAGE.map((row) => "- " + row.name + " — " + row.url + " — " + row.blurb);
}

export function helpTxt() {
  return [
    "# Help — " + AUTHOR,
    "",
    "Human addendum for azieleliab.com. Public identity is " + AUTHOR + ".",
    "",
    pointersBlock(),
    "",
    "## Who Aziel Eliab is (the work)",
    "",
    identityBlock(),
    "",
    "## Softwares via runtime",
    "",
    WHAT_HE_DOES_SOFTWARES,
    "Softwares are the named products reached through " +
      RUNTIME_TITLE +
      ". FragGate is the single door. Agents use fraggate_call. Humans use the runtime Worker UI.",
    "- Softwares page: " + SOFTWARE_HREF,
    "- Live catalog: " + CANON_ORIGIN + "/v1/software",
    "- Runtime on this host: " + RUNTIME_LOCAL,
    "- Official Runtime: " + RUNTIME + "/",
    "- Try on Glama: " + GLAMA_RUNTIME,
    "More: " + CANON_ORIGIN + HELP_SOFTWARES_PATH,
    "",
    "## Receipts",
    "",
    "Receipts are hashed action records (" +
      RECEIPT_SPEC +
      "). This host’s action-receipt chain carries a hash, a request sentence, an output sentence, and event metadata. Newest first.",
    "- " + RECEIPTS_TITLE + ": " + RECEIPTS_HREF,
    "- " + INGEST_SPEC + ": " + INGEST_HREF,
    "- " + VERIFY_TITLE + ": " + VERIFY_HREF,
    "- Page bytes: " + INGEST_BYTES_HREF,
    "More: " + CANON_ORIGIN + HELP_RECEIPTS_PATH,
    "",
    "## Donate",
    "",
    DONATE_COPY[0],
    DONATE_DISCLAIMER,
    "- " + DONATE_TITLE + ": " + DONATE_HREF,
    "- Rails: " + DONATE_RAILS.map((r) => r.coin).join("; "),
    "",
    "## Sister hubs",
    "",
    ...sisterHubLines(),
    "- GitHub — " + GITHUB,
    "- X — " + X_URL,
    "- " +
      TRADES_RUNTIME_NAME +
      " — " +
      TRADES_RUNTIME +
      "/ — " +
      TRADES_RUNTIME_ONE_LINE,
    "",
    "## More addendum",
    "",
    "- " + CANON_ORIGIN + ADDENDUM_TXT_PATH,
    "- " + CANON_ORIGIN + HELP_RUNTIME_PATH,
    "",
    "Author: " + AUTHOR,
    "License: " + LICENSE,
    "",
  ].join("\n");
}

export function addendumTxt() {
  return [
    "# Addendum — " + AUTHOR,
    "",
    "Companion to " + CANON_ORIGIN + HELP_TXT_PATH + ". Plain-language work definitions.",
    "",
    pointersBlock(),
    "",
    "## Identity",
    "",
    identityBlock(),
    "",
    SOFTWARE_DEVELOPER_ANSWER,
    "",
    "## Published About",
    "",
    "You don’t get to know me. You get to understand the work.",
    "Knowing is collection. Understanding is subtraction. If the work holds, the name was only a handle on the door.",
    "",
    "## Softwares via runtime",
    "",
    "Aziel Eliab publishes Softwares through " +
      RUNTIME_TITLE +
      " " +
      RUNTIME_VERSION +
      ". FragGate is the door. The live name list is on " +
      SOFTWARE_HREF +
      " and " +
      CANON_ORIGIN +
      "/v1/software.",
    "Read the full machine index at " + CANON_ORIGIN + "/llms.txt.",
    "Cite the hub record at " + CANON_ORIGIN + "/cite.json.",
    "More: " + CANON_ORIGIN + HELP_SOFTWARES_PATH,
    "",
    "## Receipts",
    "",
    RECEIPT_SPEC + " keeps a hash chain: previous hash, request sentence, output sentence, event metadata.",
    "This host: " + RECEIPTS_HREF,
    "Sister chains: " + RECEIPT_LATTICE.map((row) => row.label + " " + row.href).join(" · "),
    "Ingest law: " + INGEST_HREF + " · verify: " + VERIFY_HREF,
    "More: " + CANON_ORIGIN + HELP_RECEIPTS_PATH,
    "",
    "## Donate",
    "",
    ...DONATE_COPY.slice(0, 4),
    DONATE_DISCLAIMER,
    DONATE_HREF,
    "",
    "## Sister hubs",
    "",
    ...sisterHubLines(),
    "- GitHub — " + GITHUB,
    "- X — " + X_URL,
    "- " + TRADES_RUNTIME_NAME + " source — " + TRADES_RUNTIME_GITHUB,
    "",
    "## Runtime",
    "",
    RUNTIME_TITLE +
      " " +
      RUNTIME_VERSION +
      " is the FragGate / MCP door for Softwares. Same-origin " +
      RUNTIME_LOCAL +
      ". Origin " +
      RUNTIME +
      "/.",
    "More: " + CANON_ORIGIN + HELP_RUNTIME_PATH,
    "",
    "Author: " + AUTHOR,
    "License: " + LICENSE,
    "",
  ].join("\n");
}

export function helpSoftwaresTxt() {
  return [
    "# Softwares — " + AUTHOR,
    "",
    WHAT_HE_DOES_SOFTWARES,
    "",
    "Softwares are the named products Aziel Eliab publishes through " +
      RUNTIME_TITLE +
      ". FragGate is the single door. Agents reach Softwares with fraggate_call. Humans use the complete runtime Worker UI.",
    "",
    "This file is a pointer. The live name list and door URLs stay on:",
    "- " + SOFTWARE_TITLE + ": " + SOFTWARE_HREF,
    "- Live catalog JSON: " + CANON_ORIGIN + "/v1/software",
    "- Door index: " + CANON_ORIGIN + "/llms.txt",
    "- Citation record: " + CANON_ORIGIN + "/cite.json",
    "- Runtime catalog: " + RUNTIME + "/v1/software",
    "- FragGate list: " + RUNTIME_LOCAL + "/v1/fraggate/list",
    "",
    "The Softwares page is heading → name list. New catalog products appear from the live runtime snapshot.",
    "",
    "Author: " + AUTHOR,
    "",
  ].join("\n");
}

export function helpReceiptsTxt() {
  return [
    "# Receipts — " + AUTHOR,
    "",
    RECEIPT_SPEC +
      ". This host’s action-receipt chain carries a hash, a request sentence, an output sentence, and event metadata. Newest first.",
    "",
    "A receipt is a hashed action record. Cite files and hashes. The chain on this host begins at " +
      RECEIPTS_HREF +
      ".",
    "",
    "## This host",
    "",
    "- Receipts tab: " + RECEIPTS_HREF,
    "- " + INGEST_SPEC + ": " + INGEST_HREF,
    "- Canonical page bytes: " + INGEST_BYTES_HREF,
    "- " + VERIFY_TITLE + " (paste a hash): " + VERIFY_HREF,
    "",
    "## Sister receipt doors",
    "",
    ...RECEIPT_LATTICE.map((row) => "- " + row.label + ": " + row.href),
    "",
    "Machine citation: " + CANON_ORIGIN + "/cite.json",
    "Door index: " + CANON_ORIGIN + "/llms.txt",
    "",
    "Author: " + AUTHOR,
    "",
  ].join("\n");
}

export function helpRuntimeTxt() {
  return [
    "# " + RUNTIME_TITLE + " — " + AUTHOR,
    "",
    RUNTIME_TITLE +
      " " +
      RUNTIME_VERSION +
      " (aziel-runtime) is the FragGate / MCP door for Softwares. Identity on this door is " +
      AUTHOR +
      ".",
    "",
    "## Doors",
    "",
    "- Same-origin on this hub: " + RUNTIME_LOCAL,
    "- Official Runtime: " + RUNTIME + "/",
    "- Try on Glama: " + GLAMA_RUNTIME,
    "- Suite pack: " + RUNTIME_DOWNLOAD,
    "- Source: https://github.com/AzielEliab/aziel-runtime",
    "- Documentation / Architecture: " + RUNTIME_DOCS,
    "- OpenAPI: " + RUNTIME_LOCAL + "/openapi.json",
    "- MCP: POST " + RUNTIME_LOCAL + "/mcp",
    "- Skill: " + RUNTIME_LOCAL + "/v1/skill",
    "- Live Softwares catalog: " + RUNTIME + "/v1/software",
    "",
    "## Dual surface",
    "",
    "Agents use FragGate (fraggate_call) through MCP. Humans use the runtime Worker panels (#op-panel / #dashboard / #fg-console), About Aziel, per-product hashtags, and the counted suite pack at GET /download.",
    "",
    "Full machine index: " + CANON_ORIGIN + "/llms.txt",
    "Citation record: " + CANON_ORIGIN + "/cite.json",
    "Hub Softwares page: " + SOFTWARE_HREF,
    "",
    "Author: " + AUTHOR,
    "",
  ].join("\n");
}
