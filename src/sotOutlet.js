/**
 * SOT-OUTLET-1.0 — hub mesh outlet for aziel-runtime SoT fan-out.
 * Outlet id hub-azieleliab. Authority is live GET /v1/software.
 * dry_run previews. confirm writes the pin and an ACT receipt.
 * Unreachable live SoT keeps last-known and says so.
 * version_id is copied only when live exposes a non-empty string.
 * Sync does not invent Softwares rows and does not touch download counters.
 * Author: Aziel Eliab. Identity is Aziel Eliab only.
 */
import {
  AUTHOR,
  CANON_ORIGIN,
  RUNTIME,
  RUNTIME_BRANCH,
  RUNTIME_GIT_SHA,
  RUNTIME_GIT_SHORT,
  RUNTIME_NAME,
  RUNTIME_VERSION,
  exposedVersionId,
  runtimeSotLiveLine,
} from "./copy.js";
import { fetchRuntimeJson, SOFTWARE_CATALOG_PATH } from "./liveCatalog.js";
import { GENESIS_PREVIOUS_HASH, RECEIPT_SPEC, canonicalJson, entryHash, mintEntry, sha256Hex } from "./receipts.js";

export const OUTLET_ID = "hub-azieleliab";
export const CONTRACT = "SOT-OUTLET-1.0";
export const SYNC_SPEC = "SOT-SYNC-1.0";
export const OUTLET_PATH = "/v1/mesh/outlet";
export const OUTLET_SYNC_PATH = "/v1/mesh/outlet/sync";
export const OUTLET_RECEIPT_PATH = "/v1/mesh/outlet/receipt";
export const SOT_KV_KEY = "sot:outlet:hub-azieleliab";
export const SOT_AUTHORITY = RUNTIME + SOFTWARE_CATALOG_PATH;
export const SOT_MAX_BODY = 16384;
export const SOT_RECEIPT_CAP = 32;

const IGNORED_KEYS = ["products", "software", "items", "entries", "extras", "downloads", "views", "download"];

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, HEAD, POST, OPTIONS",
  "access-control-allow-headers": "*",
  "Content-Signal": "search=yes, ai-input=yes, ai-train=yes",
};

export function isSotOutletPath(pathname) {
  const path = String(pathname || "").replace(/\/+$/, "") || "/";
  return path === OUTLET_PATH || path === OUTLET_SYNC_PATH || path === OUTLET_RECEIPT_PATH;
}

export function outletLlmsLines() {
  return [
    "- GET " + CANON_ORIGIN + OUTLET_PATH + "  (SOT-OUTLET-1.0 outlet " + OUTLET_ID + "; pull/push contract)",
    "- POST " + CANON_ORIGIN + OUTLET_SYNC_PATH + "  (dry_run or confirm; optional signed sot_sync)",
    "- GET " + CANON_ORIGIN + OUTLET_RECEIPT_PATH + "  (ACT-RECEIPT-1.0 sot.sync receipt)",
  ];
}

export function sotOutletCite(sot) {
  const pin = sot && sot.git_sha ? sot : null;
  return {
    outlet_id: OUTLET_ID,
    contract: CONTRACT,
    author: AUTHOR,
    identity: AUTHOR,
    authority: SOT_AUTHORITY,
    register: CANON_ORIGIN + OUTLET_PATH,
    pull: CANON_ORIGIN + OUTLET_SYNC_PATH,
    push: CANON_ORIGIN + OUTLET_SYNC_PATH,
    receipt: CANON_ORIGIN + OUTLET_RECEIPT_PATH,
    status: pin && pin.status ? pin.status : "last-known",
    note:
      "Pull live GET /v1/software or accept a signed sot_sync that matches that pull. dry_run then confirm. Unreachable live SoT keeps last-known. version_id is set only when live exposes it. Sync does not invent Softwares rows or change download counters. Identity Aziel Eliab only.",
  };
}

export function frozenSot() {
  return {
    version: RUNTIME_VERSION,
    git_sha: RUNTIME_GIT_SHA,
    git_short: RUNTIME_GIT_SHORT,
    branch: RUNTIME_BRANCH,
    version_id: null,
    count: null,
    source: "frozen",
    authority: SOT_AUTHORITY,
  };
}

function versionToken(value) {
  const ver = typeof value === "string" ? value.trim() : "";
  if (!/^[0-9A-Za-z][0-9A-Za-z._+-]{0,63}$/.test(ver)) return "";
  return ver;
}

function shaToken(value) {
  const sha = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (!/^[0-9a-f]{40}$/.test(sha)) return "";
  return sha;
}

function countToken(doc) {
  if (!doc || typeof doc !== "object" || !Object.prototype.hasOwnProperty.call(doc, "count")) {
    return { ok: true, count: null };
  }
  const n = doc.count;
  if (typeof n !== "number" || !Number.isInteger(n) || n < 0 || n > 100000) return { ok: false, count: null };
  return { ok: true, count: n };
}

function versionIdToken(doc) {
  if (!doc || typeof doc !== "object" || !Object.prototype.hasOwnProperty.call(doc, "version_id")) {
    return { ok: true, version_id: null };
  }
  if (doc.version_id == null || doc.version_id === "") return { ok: true, version_id: null };
  const id = exposedVersionId(doc);
  if (!id) return { ok: false, version_id: null };
  return { ok: true, version_id: id };
}

/** Project suite cite fields. Never fills version_id when live omits it. */
export function projectSot(doc) {
  const version = versionToken(doc && doc.version);
  const git_sha = shaToken(doc && doc.git_sha);
  const count = countToken(doc);
  const versionId = versionIdToken(doc);
  if (!version || !git_sha || !count.ok || !versionId.ok) {
    return { ok: false, code: "SOT-INCOMPLETE" };
  }
  return {
    ok: true,
    sot: {
      version,
      git_sha,
      git_short: git_sha.slice(0, 7),
      branch: RUNTIME_BRANCH,
      count: count.count,
      version_id: versionId.version_id,
      authority: SOT_AUTHORITY,
    },
  };
}

export function ignoredSotFields(doc) {
  if (!doc || typeof doc !== "object") return [];
  return IGNORED_KEYS.filter((key) => Object.prototype.hasOwnProperty.call(doc, key));
}

export async function signSotSync(envelope) {
  const body = { ...(envelope || {}) };
  delete body.sig;
  return sha256Hex(canonicalJson(body));
}

function sigHex(envelope) {
  const sig = envelope && envelope.sig;
  if (typeof sig === "string" && /^[0-9a-f]{64}$/i.test(sig)) return { hex: sig.toLowerCase() };
  if (sig && typeof sig === "object") {
    if (sig.alg && sig.alg !== "sha256") return { error: "SOT-SYNC-ALG" };
    const hex = sig.hex || sig.sha256;
    if (typeof hex === "string" && /^[0-9a-f]{64}$/i.test(hex)) return { hex: hex.toLowerCase() };
  }
  return { error: "SOT-SYNC-UNSIGNED" };
}

function sameSot(a, b) {
  if (!a || !b) return false;
  return a.version === b.version && a.git_sha === b.git_sha && a.count === b.count && (a.version_id || null) === (b.version_id || null);
}

function surfacePreview(sot) {
  const line = runtimeSotLiveLine(sot.version, sot);
  return {
    cite: "Runtime " + line,
    llms: line,
    ai: line,
    softwareVersion: sot.version,
    git_sha: sot.git_sha,
    git_short: sot.git_short,
    version_id: sot.version_id,
    homepage: RUNTIME_NAME + " · " + sot.version + " · main " + sot.git_short,
  };
}

function baseIdentity() {
  return {
    ok: true,
    author: AUTHOR,
    identity: AUTHOR,
    outlet_id: OUTLET_ID,
    contract: CONTRACT,
    product: "azieleliab",
    authority: SOT_AUTHORITY,
    software_rows_changed: false,
    download_counters_changed: false,
  };
}

async function readStore(env) {
  if (!env || !env.VIEWS || typeof env.VIEWS.get !== "function") return null;
  try {
    const raw = await env.VIEWS.get(SOT_KV_KEY);
    if (!raw) return null;
    const doc = JSON.parse(String(raw));
    return doc && typeof doc === "object" ? doc : null;
  } catch {
    return null;
  }
}

async function writeStore(env, doc) {
  if (!env || !env.VIEWS || typeof env.VIEWS.put !== "function") return false;
  await env.VIEWS.put(SOT_KV_KEY, JSON.stringify(doc));
  return true;
}

export async function loadSurfacePin(env) {
  const store = await readStore(env);
  if (!store || !store.last_known || !store.last_known.git_sha) return null;
  const known = store.last_known;
  return {
    version: known.version,
    git_sha: known.git_sha,
    git_short: known.git_short || String(known.git_sha).slice(0, 7),
    version_id: known.version_id || null,
    count: Number.isInteger(known.count) ? known.count : null,
    source: known.source || "outlet",
    status: store.status === "unreachable" ? "unreachable" : "confirmed",
    kept: "last-known",
  };
}

function keptLabel(store) {
  if (store && store.last_known && store.last_known.git_sha) return "last-known";
  return "frozen";
}

function contractBody(store) {
  const frozen = frozenSot();
  const status = store && store.status ? store.status : "last-known";
  return {
    ...baseIdentity(),
    role: "sot_outlet",
    status,
    kept: store && store.status === "unreachable" ? keptLabel(store) : store && store.last_known ? "outlet" : "frozen",
    frozen,
    last_known: store && store.last_known ? store.last_known : frozen,
    served_line: runtimeSotLiveLine(
      (store && store.last_known && store.last_known.version) || frozen.version,
      store && store.last_known ? store.last_known : frozen,
    ),
    pull: {
      method: "POST",
      path: OUTLET_SYNC_PATH,
      url: CANON_ORIGIN + OUTLET_SYNC_PATH,
      dry_run: { outlet_id: OUTLET_ID, dry_run: true },
      confirm: { outlet_id: OUTLET_ID, confirm: true },
      reads: SOT_AUTHORITY,
      binding: "AZIEL_RUNTIME",
      fields: ["version", "git_sha", "count", "version_id"],
    },
    push: {
      method: "POST",
      path: OUTLET_SYNC_PATH,
      url: CANON_ORIGIN + OUTLET_SYNC_PATH,
      content_type: "application/json",
      spec: SYNC_SPEC,
      kind: "sot_sync",
      sig: "sha256 hex of canonical JSON of the sot_sync object with sig removed",
      authority_check:
        "The hub re-pulls GET /v1/software and accepts the push only when version, git_sha, count, and version_id match. The signature is integrity. It is not a license to invent SoT.",
    },
    modes: ["dry_run", "confirm"],
    receipt: {
      method: "GET",
      path: OUTLET_RECEIPT_PATH,
      url: CANON_ORIGIN + OUTLET_RECEIPT_PATH,
      spec: RECEIPT_SPEC,
      kind: "sot.sync",
    },
    surfaces: [
      "GET /cite.json runtime_sot",
      "GET /llms.txt",
      "GET /ai.txt",
      "JSON-LD softwareVersion and git_sha on HTML and /graph.jsonld",
      "homepage runtime cite",
    ],
    rules: {
      version_id: "Copied only when live GET /v1/software exposes a non-empty string. Otherwise null. Never invented.",
      software_rows: "Sync does not add or remove Softwares rows.",
      download_counters: "Sync does not write view or download counters.",
      unreachable: "Keeps the last confirmed pin, or the frozen cite when none exists, and reports status unreachable.",
      identity: AUTHOR,
    },
    pair:
      "aziel-runtime SoT mesh updater fans one live GET /v1/software change here. Discover GET /v1/mesh/outlet. POST dry_run, then POST confirm. Read GET /v1/mesh/outlet/receipt.",
  };
}

function jsonResponse(doc, status, method) {
  const headers = { ...JSON_HEADERS };
  if (method === "HEAD") return new Response(null, { status, headers });
  return new Response(JSON.stringify(doc) + "\n", { status, headers });
}

function fail(code, status, extra, method) {
  return jsonResponse(
    {
      ok: false,
      author: AUTHOR,
      identity: AUTHOR,
      outlet_id: OUTLET_ID,
      code,
      applied: false,
      kept: "last-known",
      software_rows_changed: false,
      download_counters_changed: false,
      ...(extra || {}),
    },
    status,
    method,
  );
}

function syncMode(body) {
  const mode = body && body.mode;
  if (body && body.dry_run === true && mode === "confirm") return { error: "SOT-OUTLET-MODE" };
  if (body && body.confirm === true && mode === "dry_run") return { error: "SOT-OUTLET-MODE" };
  const dry = body && (body.dry_run === true || mode === "dry_run");
  const confirm = body && (body.confirm === true || mode === "confirm");
  if (dry && confirm) return { error: "SOT-OUTLET-MODE" };
  if (!dry && !confirm) return { error: "SOT-OUTLET-NEEDS-MODE" };
  return { dry_run: Boolean(dry), confirm: Boolean(confirm) };
}

async function pullLive(env) {
  const doc = await fetchRuntimeJson(SOFTWARE_CATALOG_PATH, env, { loose: true });
  if (!doc) return { ok: false, code: "SOT-UNREACHABLE", doc: null };
  const projected = projectSot(doc);
  if (!projected.ok) return { ok: false, code: projected.code || "SOT-INCOMPLETE", doc };
  return { ok: true, sot: projected.sot, doc };
}

async function verifyPush(body, live) {
  const envelope = body && body.sot_sync;
  if (!envelope || typeof envelope !== "object" || Array.isArray(envelope)) return { ok: true, pushed: false };
  if (envelope.v !== SYNC_SPEC || envelope.kind !== "sot_sync") return { ok: false, code: "SOT-SYNC-SPEC" };
  if (envelope.outlet_id !== OUTLET_ID) return { ok: false, code: "SOT-OUTLET-ID" };
  if (envelope.authority !== SOT_AUTHORITY) return { ok: false, code: "SOT-SYNC-AUTHORITY" };
  const sig = sigHex(envelope);
  if (sig.error) return { ok: false, code: sig.error };
  const expect = await signSotSync(envelope);
  if (expect !== sig.hex) return { ok: false, code: "SOT-SYNC-BAD-SIG" };
  const projected = projectSot(envelope.sot);
  if (!projected.ok) return { ok: false, code: "SOT-SYNC-INCOMPLETE" };
  if (!live.ok) return { ok: false, code: live.code || "SOT-UNREACHABLE", pushed: true, liveDown: true };
  if (!sameSot(projected.sot, live.sot)) return { ok: false, code: "SOT-SYNC-MISMATCH", pushed: true };
  return { ok: true, pushed: true, sot: live.sot };
}

function receiptOutput(sot, changed) {
  const count = sot.count == null ? "count unexposed" : "count " + sot.count;
  const id = sot.version_id ? "version_id " + sot.version_id : "version_id unexposed";
  return (
    "Confirmed SoT sync for outlet " +
    OUTLET_ID +
    ". " +
    runtimeSotLiveLine(sot.version, sot) +
    ". " +
    count +
    ". " +
    id +
    ". " +
    (changed ? "changed" : "unchanged") +
    ". Softwares rows unchanged. Download counters unchanged."
  );
}

async function appendReceipt(store, sot, changed) {
  const prior = store && Array.isArray(store.receipts) ? store.receipts : [];
  const previous_hash = prior.length ? prior[prior.length - 1].entry_hash : GENESIS_PREVIOUS_HASH;
  const entry = await mintEntry({
    previous_hash,
    request: "Confirm SoT sync for outlet " + OUTLET_ID + ".",
    output: receiptOutput(sot, changed),
    event: {
      at: new Date().toISOString(),
      kind: "sot.sync",
      id: "SOT-" + sot.git_short,
    },
  });
  const receipts = prior.concat(entry).slice(-SOT_RECEIPT_CAP);
  return { entry, receipts };
}

export async function verifyOutletReceipts(entries) {
  const list = Array.isArray(entries) ? entries : [];
  if (!list.length) return true;
  let previous = list[0].previous_hash;
  for (const entry of list) {
    if (!entry || entry.previous_hash !== previous) return false;
    if (entry.spec !== RECEIPT_SPEC) return false;
    if ((await entryHash(entry)) !== entry.entry_hash) return false;
    previous = entry.entry_hash;
  }
  return true;
}

async function persist(env, doc) {
  const stored = await writeStore(env, doc);
  return stored;
}

function honestStopBody(store, mode, ignored, code) {
  const unreachable = code !== "SOT-INCOMPLETE";
  return {
    ...baseIdentity(),
    applied: false,
    dry_run: mode.dry_run,
    confirm: mode.confirm,
    status: unreachable ? "unreachable" : "incomplete",
    code,
    kept: keptLabel(store),
    last_known: store && store.last_known ? store.last_known : frozenSot(),
    receipt: null,
    would_apply: false,
    ignored_fields: ignored,
    note: unreachable
      ? "Live GET /v1/software did not answer. Last-known cite kept. No version_id invented."
      : "Live GET /v1/software answered without a usable version and git_sha. Last-known cite kept. No version_id invented.",
  };
}

async function handleSync(request, env, method) {
  let raw = "";
  try {
    raw = await request.text();
  } catch {
    raw = "";
  }
  if (raw.length > SOT_MAX_BODY) {
    return fail("SOT-SYNC-TOO-LARGE", 413, { note: "Sync body is cite fields only. Softwares rows are not accepted." }, method);
  }
  let body = null;
  try {
    body = JSON.parse(raw || "");
  } catch {
    body = null;
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return fail("SOT-SYNC-BODY", 400, null, method);
  }
  if (body.outlet_id !== OUTLET_ID) return fail("SOT-OUTLET-ID", 400, null, method);
  const mode = syncMode(body);
  if (mode.error) return fail(mode.error, 400, null, method);

  const ignored = Array.from(
    new Set([].concat(ignoredSotFields(body), ignoredSotFields(body.sot_sync), ignoredSotFields(body.sot_sync && body.sot_sync.sot))),
  );
  const store = await readStore(env);
  const live = await pullLive(env);
  const pushed = await verifyPush(body, live);
  if (!pushed.ok && !pushed.liveDown) {
    return fail(pushed.code, pushed.code === "SOT-SYNC-MISMATCH" ? 409 : 400, { kept: keptLabel(store), ignored_fields: ignored }, method);
  }
  if (!live.ok) {
    const code = live.code || "SOT-UNREACHABLE";
    if (mode.confirm) {
      const next = {
        ...(store || {}),
        outlet_id: OUTLET_ID,
        contract: CONTRACT,
        author: AUTHOR,
        identity: AUTHOR,
        status: code === "SOT-INCOMPLETE" ? "incomplete" : "unreachable",
        last_known: store && store.last_known ? store.last_known : null,
        unreachable_at: new Date().toISOString(),
        receipts: store && Array.isArray(store.receipts) ? store.receipts : [],
        software_rows_changed: false,
        download_counters_changed: false,
      };
      await persist(env, next);
    }
    return jsonResponse(honestStopBody(store, mode, ignored, code), 200, method);
  }

  const sot = live.sot;
  const changed = !sameSot(store && store.last_known, sot);
  const preview = surfacePreview(sot);
  if (mode.dry_run) {
    return jsonResponse(
      {
        ...baseIdentity(),
        dry_run: true,
        confirm: false,
        applied: false,
        would_apply: true,
        changed,
        status: "ready",
        source: pushed.pushed ? "push" : "pull",
        sot,
        surfaces: preview,
        ignored_fields: ignored,
        receipt: null,
        kept: changed ? keptLabel(store) : "last-known",
        note: "dry_run does not write the pin or a receipt. POST confirm to apply.",
      },
      200,
      method,
    );
  }

  const { entry, receipts } = await appendReceipt(store, sot, changed);
  const next = {
    outlet_id: OUTLET_ID,
    contract: CONTRACT,
    author: AUTHOR,
    identity: AUTHOR,
    status: "confirmed",
    last_known: { ...sot, source: pushed.pushed ? "push" : "pull" },
    confirmed_at: entry.event.at,
    unreachable_at: null,
    source: pushed.pushed ? "push" : "pull",
    software_rows_changed: false,
    download_counters_changed: false,
    receipts,
  };
  const stored = await persist(env, next);
  if (!stored) {
    return jsonResponse(
      {
        ...baseIdentity(),
        applied: false,
        confirm: true,
        dry_run: false,
        status: "unstored",
        code: "SOT-UNSTORED",
        kept: "frozen",
        sot,
        surfaces: preview,
        receipt: null,
        ignored_fields: ignored,
        note: "No KV binding. Confirm was not stored. Frozen cite remains the last-known pin.",
      },
      200,
      method,
    );
  }
  return jsonResponse(
    {
      ...baseIdentity(),
      applied: true,
      confirm: true,
      dry_run: false,
      changed,
      status: "confirmed",
      source: next.source,
      sot,
      surfaces: preview,
      ignored_fields: ignored,
      receipt: entry,
      verified: await verifyOutletReceipts(receipts),
      note: "Confirmed. Cite, llms, ai, JSON-LD, and the homepage runtime line read this pin. Softwares rows and download counters were not changed.",
    },
    200,
    method,
  );
}

async function handleReceipt(env, method) {
  const store = await readStore(env);
  const receipts = store && Array.isArray(store.receipts) ? store.receipts : [];
  const receipt = receipts.length ? receipts[receipts.length - 1] : null;
  return jsonResponse(
    {
      ...baseIdentity(),
      status: store && store.status ? store.status : "last-known",
      receipt,
      chain_length: receipts.length,
      verified: await verifyOutletReceipts(receipts),
      spec: RECEIPT_SPEC,
      kind: "sot.sync",
      note: receipt ? "Latest confirm receipt." : "No confirm receipt yet. Last-known cite is the frozen pin.",
    },
    200,
    method,
  );
}

export async function handleSotOutlet(request, env, path) {
  const method = request.method;
  const dest = String(path || "").replace(/\/+$/, "") || "/";
  if (method === "OPTIONS") return new Response(null, { status: 204, headers: JSON_HEADERS });
  if (method !== "GET" && method !== "HEAD" && method !== "POST") {
    return fail("SOT-OUTLET-METHOD", 405, null, method);
  }
  if (dest === OUTLET_PATH) {
    if (method === "POST") return fail("SOT-OUTLET-METHOD", 405, { note: "POST the sync path." }, method);
    const store = await readStore(env);
    return jsonResponse(contractBody(store), 200, method);
  }
  if (dest === OUTLET_RECEIPT_PATH) {
    if (method === "POST") return fail("SOT-OUTLET-METHOD", 405, null, method);
    return handleReceipt(env, method);
  }
  if (method !== "POST") return fail("SOT-OUTLET-METHOD", 405, { note: "Sync is POST dry_run or confirm." }, method);
  return handleSync(request, env, method);
}
