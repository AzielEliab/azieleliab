/** REDLINE-2026-09-14 + attack-surface cite for AZindex (www.azieleliab.com).
 * Machine pointer only — not a Softwares-tab product, not a FragGate slug.
 * Operator token is header-only. Never query, body, or git.
 * Author: Aziel Eliab only.
 */
import {
  AUTHOR,
  CANON_ORIGIN,
  GITHUB_RUNTIME,
  LIBRARY,
  PERSON_ID,
  RUNTIME,
  RUNTIME_ID,
  RUNTIME_LOCAL,
} from "./copy.js";
import { GROWTH } from "./ingest.js";

export const REDLINE_SPEC = "REDLINE-2026-09-14";
export const REDLINE_NAME = "AZindex redline / attack-surface cite";
export const REDLINE_DATE = "2026-09-14";
export const REDLINE_SOFTWARE_TAB = false;
export const REDLINE_FRAGGATE_SLUG = false;
export const REDLINE_GROWTH_ON = GROWTH === "on";
export const REDLINE_GPTBOT_DISALLOW = false;
export const REDLINE_PERSON_ID = PERSON_ID;
export const REDLINE_DOCS = "docs/designs/REDLINE-2026-09-14.md";
export const REDLINE_HREF = GITHUB_RUNTIME + "/blob/main/" + REDLINE_DOCS;
export const REDLINE_RUNTIME_CITE = RUNTIME + "/cite.json";

export const CAP7_DESIGN_OF = "hub_designs";
export const CAP7_INHERIT = "designs";
export const CAP7_RESOLVES_TO_HUB = false;

export const TOKEN_HEADER = "X-Aziel-Runtime-Token";
export const TOKEN_HEADERS = Object.freeze(["Authorization", TOKEN_HEADER]);

export const AZ_GENERATOR_HALLUC_SLUGS = Object.freeze([
  "az-generator",
  "azgenerator",
  "az_generator",
  "az-gen",
  "azgen",
  "az_gen",
]);

export const TOKEN_QUERY_KEYS = Object.freeze([
  "token",
  "runtime_token",
  "RUNTIME_TOKEN",
  "aziel_runtime_token",
  "bearer",
  "access_token",
]);

export const TOKEN_BODY_KEYS = Object.freeze([
  "runtime_token",
  "RUNTIME_TOKEN",
  "aziel_runtime_token",
  "operator_token",
]);

export const FOLDLOCK_SHELF = "FOLDLOCK-SHELF-1.0";
export const FOLDLOCK_SLUG = "foldlock";
export const FOLDLOCK_NAME = "FoldLock";
export const FOLDLOCK_GITHUB = "https://github.com/AzielEliab/foldlock";
export const FOLDLOCK_WORKER = "https://foldlock-download-tracker.vibelock.workers.dev/";
export const FOLDLOCK_DIGEST = "1034d5924b88878918986abe260338b0aff0117bc6f9c4d4a01a41d843cfa0a8";
export const FOLDLOCK_PAPER_DOI = "10.5281/zenodo.22257762";
export const FOLDLOCK_REDLINE =
  "Never fold the lockset tip hash itself. Never rewrite the chain. Tip SHA-256 stays over raw receipts. Folding is a suppression aid, not encryption and not zip.";

export const KNOWN_PAPER_DOIS = Object.freeze([
  "10.5281/zenodo.21435707",
  "10.5281/zenodo.21435730",
  "10.5281/zenodo.22258015",
  FOLDLOCK_PAPER_DOI,
  "10.5281/zenodo.22257493",
]);

export const PUBLIC_DOORS = Object.freeze([
  { method: "GET", path: "/", role: "read", auth: "none" },
  { method: "GET", path: "/cite.json", role: "read", auth: "none" },
  { method: "GET", path: "/robots.txt", role: "read", auth: "none", growth_on: true },
  { method: "GET", path: "/llms.txt", role: "read", auth: "none" },
  { method: "GET", path: "/ai.txt", role: "read", auth: "none" },
  { method: "GET", path: "/shelves", role: "read", auth: "none" },
  { method: "GET", path: "/v1/software", role: "read", auth: "none" },
  { method: "GET", path: "/v1/mesh", role: "read", auth: "none", enables: false },
  { method: "GET", path: "/v1/mesh/status", role: "read", auth: "none", enables: false },
  { method: "GET", path: "/v1/mesh/nodes", role: "read", auth: "none", enables: false },
  { method: "GET", path: "/v1/mesh/az-generator", role: "cite", auth: "none", registrar: false },
  { method: "GET", path: "/runtime/openapi.json", role: "read", auth: "none" },
  { method: "POST", path: "/runtime/v1/fraggate/call", role: "exec", auth: "public_allowlist" },
  { method: "POST", path: "/runtime/mcp", role: "exec", auth: "public_allowlist" },
  { method: "POST", path: "/v1/view", role: "mutate", auth: "none", note: "pageview increment only" },
]);

export const TLS_CITE = Object.freeze({
  transport: "tls",
  via: "cloudflare",
  workers_https: true,
  client_side_crypto_claim: false,
  foldlock_is_not_encryption: true,
  note:
    "HTTPS is terminated at the Cloudflare edge for this Worker. This hub does not implement a second client-side encryption product, a browser WebCrypto vault, or FoldLock-as-cipher. Document the hop. Do not invent a lock.",
});

export const ATTACK_SIMS = Object.freeze([
  {
    sim: "az-generator-registrar",
    code: "AZ-GEN-CALL-REFUSED",
    refuse: "Call AZ Generator as a registrar / Softwares slug / POST register.",
  },
  {
    sim: "mesh-get-enable",
    code: "MESH-GET-NEVER-ENABLES",
    refuse: "Enable mesh radios via GET /v1/mesh (query or body).",
  },
  {
    sim: "cap7-resolves-to-hub",
    code: "CAP7-RESOLVE-INJECT",
    refuse: "Inject Cap-7 resolves_to_hub: true (or a resolving design_of).",
  },
  {
    sim: "fake-zenodo-doi",
    code: "DOI-FAKE-REFUSED",
    refuse: "Present a fake Zenodo DOI not in the known paper map.",
  },
  {
    sim: "token-query",
    code: "TOKEN-QUERY-REFUSED",
    refuse: "Leak the operator token in query.",
  },
  {
    sim: "token-body",
    code: "TOKEN-BODY-REFUSED",
    refuse: "Leak the operator token in JSON body / MCP args.",
  },
  {
    sim: "foldlock-tip-fold",
    code: "FL-TIP-FOLD-REFUSE",
    refuse: "Fold the lockset tip hash or rewrite receipt bytes.",
  },
]);

function refuseBase(code, message, extra = {}) {
  return {
    ok: false,
    code,
    author: AUTHOR,
    identity: AUTHOR,
    spec: REDLINE_SPEC,
    message,
    ...extra,
  };
}

export function isAzGeneratorHallucSlug(slug) {
  const s = String(slug || "")
    .trim()
    .toLowerCase();
  return AZ_GENERATOR_HALLUC_SLUGS.includes(s);
}

export function azGeneratorCallRefuse(extra = {}) {
  return refuseBase(
    "AZ-GEN-CALL-REFUSED",
    "AZ Generator is a Cap-7 cite label, not a live registrar and not a Softwares product. GET /v1/mesh/az-generator cites. Call is refused.",
    {
      live_registrar: false,
      az_gen_live_registrar: false,
      software_tab: false,
      fifth_product: false,
      hint: "GET /v1/mesh/az-generator",
      ...extra,
    },
  );
}

export function meshGetEnableRefuse(extra = {}) {
  return refuseBase(
    "MESH-GET-NEVER-ENABLES",
    "GET /v1/mesh never enables radios. This hub is display-only. Operator enable is on runtime with a declared bearer.",
    {
      get_never_enables: true,
      enabled_by_get: false,
      hint: "GET /v1/mesh/status  (display). Never GET-enable.",
      ...extra,
    },
  );
}

export function meshGetLooksLikeEnable(searchParams, payload) {
  const src = payload && typeof payload === "object" && !Array.isArray(payload) ? payload : {};
  if (
    src.enable === true ||
    src.enabled === true ||
    src.radios === true ||
    String(src.op || "").toLowerCase() === "enable"
  ) {
    return true;
  }
  if (!searchParams || typeof searchParams.get !== "function") return false;
  const keys = ["enable", "enabled", "op", "radios", "mesh"];
  for (const key of keys) {
    const raw = searchParams.get(key);
    if (raw == null || raw === "") continue;
    const v = String(raw).trim().toLowerCase();
    if (key === "op" && v === "enable") return true;
    if (v === "1" || v === "true" || v === "on" || v === "yes" || v === "enable") return true;
  }
  return false;
}

export function isKnownZenodoDoi(doi) {
  const d = String(doi || "").trim();
  if (!d) return false;
  return KNOWN_PAPER_DOIS.includes(d);
}

export function looksLikeZenodoDoi(doi) {
  return /^10\.5281\/zenodo\.\d+$/i.test(String(doi || "").trim());
}

export function fakeDoiRefuse(doi, extra = {}) {
  return refuseBase("DOI-FAKE-REFUSED", "Do not invent Zenodo DOIs. Tip-pack / lockset doi stay null. Paper deposits are not Plane B.", {
    doi: null,
    presented_shape: looksLikeZenodoDoi(doi) ? "zenodo" : "other",
    ...extra,
  });
}

export function doiInjectionRefuse(doi) {
  const d = String(doi || "").trim();
  if (!d) return null;
  if (isKnownZenodoDoi(d)) return null;
  return fakeDoiRefuse(d);
}

export function cap7ResolveInjectRefuse(extra = {}) {
  return refuseBase(
    "CAP7-RESOLVE-INJECT",
    "Cap-7 names inherit design_of only. resolves_to_hub stays false. Not a CNAME, alias, or hub hostname.",
    {
      design_of: CAP7_DESIGN_OF,
      inherit: CAP7_INHERIT,
      resolves_to_hub: false,
      ...extra,
    },
  );
}

export function looksLikeCap7ResolveInject(searchParams, payload) {
  const src = payload && typeof payload === "object" && !Array.isArray(payload) ? payload : {};
  if (src.resolves_to_hub === true || src.resolves_to_hub === "true") return true;
  if (typeof src.design_of === "string") {
    const d = src.design_of.trim().toLowerCase();
    if (d && d !== CAP7_DESIGN_OF && d !== "designs" && !d.startsWith("http")) return true;
  }
  if (!searchParams || typeof searchParams.get !== "function") return false;
  const raw = searchParams.get("resolves_to_hub");
  if (raw == null || raw === "") return false;
  const v = String(raw).trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

export function tokenQueryRefuse(extra = {}) {
  return refuseBase(
    "TOKEN-QUERY-REFUSED",
    "Operator token is header-only (Authorization: Bearer or X-Aziel-Runtime-Token). Never query, body, or git.",
    {
      header_only: true,
      query: false,
      body: false,
      git: false,
      hint: "Authorization: Bearer … or " + TOKEN_HEADER,
      ...extra,
    },
  );
}

export function tokenBodyRefuse(extra = {}) {
  return {
    ...tokenQueryRefuse(extra),
    code: "TOKEN-BODY-REFUSED",
    message: "Operator token is header-only. JSON body / MCP args must not carry runtime_token.",
  };
}

export function tokenPresentedInSearch(searchParams) {
  if (!searchParams || typeof searchParams.get !== "function") return false;
  for (const key of TOKEN_QUERY_KEYS) {
    const v = searchParams.get(key);
    if (v != null && String(v).trim()) return true;
  }
  return false;
}

export function tokenPresentedInRequestUrl(request) {
  if (!request || !request.url) return false;
  try {
    return tokenPresentedInSearch(new URL(request.url).searchParams);
  } catch {
    return false;
  }
}

export function bodyHasTokenKey(obj) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return false;
  for (const key of TOKEN_BODY_KEYS) {
    if (obj[key] != null && String(obj[key]).trim()) return true;
  }
  return false;
}

const SECRET_KEY_RE = /^(runtime_token|RUNTIME_TOKEN|aziel_runtime_token|operator_token|authorization|Authorization)$/;

export function responseLeaksToken(body, secrets = []) {
  const blob = typeof body === "string" ? body : JSON.stringify(body ?? "");
  if (!blob) return false;
  if (SECRET_KEY_RE.test(blob)) return true;
  if (/\bBearer\s+\S{8,}/.test(blob)) return true;
  for (const secret of secrets) {
    const s = String(secret || "");
    if (s.length >= 6 && blob.includes(s)) return true;
  }
  return false;
}

export function foldlockTipFoldLooksLike(searchParams, payload) {
  const src = payload && typeof payload === "object" && !Array.isArray(payload) ? payload : {};
  const hits = [src.fold, src.fold_lockset, src.foldlock, src.target, src.op];
  if (hits.some((v) => /^(tip|lockset|hash|receipt|chain)$/i.test(String(v || "").trim()))) return true;
  if (src.fold_tip === true || src.fold_lockset === true) return true;
  if (!searchParams || typeof searchParams.get !== "function") return false;
  for (const key of ["fold", "fold_lockset", "foldlock", "fold_tip", "target"]) {
    const raw = searchParams.get(key);
    if (raw == null || raw === "") continue;
    const v = String(raw).trim().toLowerCase();
    if (v === "tip" || v === "lockset" || v === "hash" || v === "1" || v === "true") return true;
  }
  return false;
}

export function foldlockTipFoldRefuse(extra = {}) {
  return refuseBase("FL-TIP-FOLD-REFUSE", FOLDLOCK_REDLINE, {
    spec: FOLDLOCK_SHELF,
    redline_spec: REDLINE_SPEC,
    tip_safe: true,
    zip: false,
    encryption: false,
    fold_applied: false,
    ...extra,
  });
}

export function foldlockTipSafeCite() {
  return {
    spec: FOLDLOCK_SHELF,
    slug: FOLDLOCK_SLUG,
    name: FOLDLOCK_NAME,
    tip_safe: true,
    zip: false,
    encryption: false,
    not_zip: true,
    not_encryption: true,
    invented: false,
    software_tab: true,
    engine_bound: false,
    hook_status: "slot",
    digest: FOLDLOCK_DIGEST,
    github: FOLDLOCK_GITHUB,
    worker: FOLDLOCK_WORKER,
    worker_home: FOLDLOCK_WORKER,
    paper_doi: FOLDLOCK_PAPER_DOI,
    lockset_doi: null,
    door: "fraggate",
    fraggate_describe: RUNTIME_LOCAL + "/v1/fraggate/describe?slug=foldlock",
    fraggate_describe_origin: RUNTIME + "/v1/fraggate/describe?slug=foldlock",
    shelves: LIBRARY + "/shelves",
    redline: FOLDLOCK_REDLINE,
    refuse: {
      TIP_FOLD: "FL-TIP-FOLD-REFUSE",
      CHAIN_REWRITE: "FL-CHAIN-REWRITE-REFUSE",
      LOCKSET_BYTES: "FL-LOCKSET-BYTES-REFUSE",
      RECEIPT_FOLD: "FL-RECEIPT-FOLD-REFUSE",
      HASH_FIELD: "FL-HASH-FIELD-REFUSE",
      ZIP_ENCRYPT: "FL-ZIP-ENCRYPT-CLAIM",
      ENGINE_UNBOUND: "FL-ENGINE-UNBOUND",
    },
    note:
      "FoldLock is a Softwares Language neighbor (tether-word suppression on UTF-8). Not the ZIP file format. Not encryption. Not a rewrite key. This hub cites only — the export hook stays SLOT. Lockset tip bytes stay exact for bytes↔hash. Identity Aziel Eliab only.",
  };
}

export function tlsCite() {
  return { ...TLS_CITE };
}

export function attackSurfaceCite() {
  return {
    spec: REDLINE_SPEC,
    kind: "attack-sim-refuse",
    name: "attack-surface",
    author: AUTHOR,
    identity: AUTHOR,
    software_tab: false,
    growth_on: REDLINE_GROWTH_ON,
    token: {
      header_only: true,
      headers: TOKEN_HEADERS.slice(),
      query: false,
      body: false,
      git: false,
    },
    sims: ATTACK_SIMS.map((row) => ({ ...row })),
    codes: ATTACK_SIMS.map((row) => row.code),
    note: "Attack sims must REFUSE. Cite only on this hub. Runtime executable close tests live in aziel-runtime scripts/verify-redline.mjs.",
  };
}

export function redlineCap7Cite() {
  return {
    spec: "CAP-7",
    design_of: CAP7_DESIGN_OF,
    inherit: CAP7_INHERIT,
    resolves_to_hub: CAP7_RESOLVES_TO_HUB,
    design_of_only: true,
  };
}

export function azGeneratorCite() {
  return {
    ok: true,
    kind: "cite",
    spec: REDLINE_SPEC,
    cap: "CAP-7",
    name: "AZ Generator",
    author: AUTHOR,
    identity: AUTHOR,
    live_registrar: false,
    az_gen_live_icann_publish: false,
    software_tab: false,
    fifth_product: false,
    design_of: CAP7_DESIGN_OF,
    inherit: CAP7_INHERIT,
    resolves_to_hub: false,
    person_id: PERSON_ID,
    note: "Cap-7 cite only. POST register is refused.",
  };
}

export function redlineCiteField() {
  return {
    spec: REDLINE_SPEC,
    name: REDLINE_NAME,
    author: AUTHOR,
    identity: AUTHOR,
    date: REDLINE_DATE,
    path: REDLINE_DOCS,
    href: REDLINE_HREF,
    runtime_cite: REDLINE_RUNTIME_CITE,
    software_tab: REDLINE_SOFTWARE_TAB,
    fraggate_slug: REDLINE_FRAGGATE_SLUG,
    growth_on: REDLINE_GROWTH_ON,
    gptbot_disallow: REDLINE_GPTBOT_DISALLOW,
    person_id: REDLINE_PERSON_ID,
    person_id_stable: true,
    runtime_software_id: RUNTIME_ID,
    lamb_lens: {
      version: "LL-1.0",
      software_tab: false,
      door: false,
      hop: "after_fraggate",
    },
    cap7: redlineCap7Cite(),
    tls: tlsCite(),
    foldlock: foldlockTipSafeCite(),
    token: {
      header_only: true,
      headers: TOKEN_HEADERS.slice(),
      query: false,
      body: false,
      git: false,
    },
    doors: PUBLIC_DOORS.map((row) => ({ ...row })),
    attack_surface: attackSurfaceCite(),
    azindex_hub_crawl_unchanged: true,
    limitation:
      "THIS IS: AZindex machine cite of REDLINE-2026-09-14 — public-door map, header-only operator token, Growth-ON Allow, Cloudflare TLS, Cap-7 design_of + resolves_to_hub:false, FoldLock tip-safe, attack-sim refuses. Author: Aziel Eliab only.",
  };
}

export function redlineLlmsBlock() {
  const fold = foldlockTipSafeCite();
  return [
    "## " + REDLINE_SPEC,
    "",
    "AZindex machine pointer. Growth-ON Allow stays.",
    "Paper: " + REDLINE_HREF,
    "Runtime cite: " + REDLINE_RUNTIME_CITE,
    "Person @id: " + PERSON_ID,
    "Cap-7: design_of " + CAP7_DESIGN_OF + "; resolves_to_hub: false.",
    "TLS: Cloudflare edge HTTPS. FoldLock is tip-safe.",
    "Operator token: header-only (" + TOKEN_HEADERS.join(" / ") + "). Never query, body, or git.",
    "Attack-sim refuse: " + ATTACK_SIMS.map((row) => row.code).join(" · "),
    "FoldLock tip-safe (" + fold.spec + "): " + fold.redline,
    "GET " + CANON_ORIGIN + "/cite.json  (redline · tls · cap7 · attack_surface · foldlock)",
    "GET " + CANON_ORIGIN + "/v1/mesh/az-generator  (Cap-7 cite only; POST register refused)",
    "",
  ].join("\n");
}
