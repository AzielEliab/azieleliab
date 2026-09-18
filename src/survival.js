/**
 * BAN-SURVIVAL-1.0 hub pull.
 * Prefer runtime GET /survival (short TTL) over hardcoded live doors.
 * Cap-7 shuffle via MirageGrid Worker LIVE. resolves_to_hub: false.
 * live_nodes is QNM presence — not an exec API and not live_doors.
 * Author: Aziel Eliab. GodLock is a product, not identity.
 */
import {
  AUTHOR,
  CANON_ORIGIN,
  GODLOCK,
  MIRAGEGRID,
  MIRAGEGRID_BRIDGE,
  MIRAGEGRID_DOWNLOAD,
  MIRAGEGRID_HEALTH,
  MIRAGEGRID_SHUFFLE,
  PERSON_ID,
  RUNTIME,
  RUNTIME_LOCAL,
} from "./copy.js";
import { allowOriginRefresh } from "./costGuard.js";
import { SURVIVAL_CACHE_URL, SURVIVAL_TTL_SEC, readJsonSnapshot, writeJsonSnapshot } from "./edgeCache.js";
import { fetchRuntimeJson } from "./liveCatalog.js";

export const BAN_SURVIVAL_SPEC = "BAN-SURVIVAL-1.0";
export const BAN_CALLING_NAME_SPEC = "BAN-CALLING-NAME-1.0";
export const BAN_PLATFORMS_SPEC = "BAN-PLATFORMS-1.0";
export const CAP7_SHUFFLE_SPEC = "CAP7-SHUFFLE-1.0";
export const CALLING_NAME_ALERT_PREFIX = "*new name alert:";
export const CALLING_NAME_DEFAULT = "Aziel Runtime";

export const SURVIVAL_PATH = "/survival";
export const SURVIVAL_JSON_PATH = "/v1/survival";
export const SURVIVAL_ORIGIN_PATH = "/survival";
export const SURVIVAL_ORIGIN = RUNTIME + SURVIVAL_PATH;
export const SURVIVAL_ORIGIN_JSON = RUNTIME + SURVIVAL_JSON_PATH;
export const SURVIVAL_LOCAL = CANON_ORIGIN + SURVIVAL_PATH;
export const SURVIVAL_JSON_LOCAL = CANON_ORIGIN + SURVIVAL_JSON_PATH;
export const SURVIVAL_RUNTIME = RUNTIME_LOCAL + SURVIVAL_PATH;
export const SURVIVAL_RUNTIME_JSON = RUNTIME_LOCAL + SURVIVAL_JSON_PATH;

export const PLATFORM_IDS = Object.freeze(["windows", "mac", "linux", "android", "ios"]);

export const SURVIVAL_NOTE =
  "BAN-SURVIVAL-1.0 hub pull of runtime GET /survival (short TTL). Mutual backup: cold shelves back death-by-ban; live_doors back cold-shelf death. Keep both. Never invent a live door. Live Nodes is QNM presence — not an exec API and not live_doors. Cap-7 shuffle via MirageGrid; resolves_to_hub: false. Hosted Cap-7 exec SLOT. Platforms all LIVE (browser / PWA / Worker / MCP) — not native store binaries. Calling-name rotation: mesh pull *new name alert: <name> from GET /survival. Identity Aziel Eliab only. GodLock is a product, not identity. Lamb Lens: Service → Clarity → Peace. NO-LIE. visible_1520: false.";

function isBanSurvivalDoc(doc) {
  return Boolean(doc && typeof doc === "object" && !Array.isArray(doc) && doc.spec === BAN_SURVIVAL_SPEC);
}

export function survivalSource(doc) {
  if (!doc || typeof doc !== "object" || Array.isArray(doc)) return null;
  if (isBanSurvivalDoc(doc.origin)) return doc.origin;
  if (doc.ok === true && doc.product === "azieleliab") return null;
  if (isBanSurvivalDoc(doc)) return doc;
  return null;
}

export function isSurvivalPath(pathname) {
  const p = String(pathname || "").replace(/\/+$/, "") || "/";
  return p === SURVIVAL_PATH || p === SURVIVAL_JSON_PATH;
}

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}

function liveDoorsFrom(origin) {
  if (!origin || !Array.isArray(origin.live_doors)) return [];
  return origin.live_doors.filter((row) => row && typeof row === "object");
}

export function callingNameCite(origin) {
  const src = asObject(origin && origin.calling_name) || {};
  const rotated = src.rotated === true;
  const name = String(src.calling_name || CALLING_NAME_DEFAULT).trim() || CALLING_NAME_DEFAULT;
  let alert = src.alert == null || src.alert === "" ? null : String(src.alert);
  if (rotated && !alert) alert = CALLING_NAME_ALERT_PREFIX + " " + name;
  return {
    spec: BAN_CALLING_NAME_SPEC,
    rotated,
    calling_name: name,
    calling_slug: src.calling_slug || "aziel-runtime",
    identity: AUTHOR,
    identity_unchanged: src.identity_unchanged !== false,
    chainlock_rewrite: false,
    akm_rewrite: false,
    alert,
    invented_ban: src.invented_ban === true,
    triggers: asObject(src.triggers) || {
      triggered: false,
      hits: [],
      invented_ban: false,
    },
    note:
      rotated && alert
        ? "Mesh pull " + alert + " from GET /survival. Identity Aziel Eliab unchanged. GodLock is a product, not identity."
        : "No honest ban signal. Live calling name stays " +
          name +
          ". Rotation format: " +
          CALLING_NAME_ALERT_PREFIX +
          " <name>. Identity Aziel Eliab only. GodLock is a product, not identity.",
  };
}

export function callingNameAlertLine(origin) {
  const cn = callingNameCite(origin);
  if (!cn.alert) return "";
  const raw = String(cn.alert).trim();
  if (!raw) return "";
  return raw.startsWith(CALLING_NAME_ALERT_PREFIX) ? raw : CALLING_NAME_ALERT_PREFIX + " " + raw;
}

export function platformsCite(origin) {
  const src = asObject(origin && origin.platforms) || {};
  const rows = Array.isArray(src.platforms) ? src.platforms.filter((row) => row && typeof row === "object") : [];
  const ids = rows.length
    ? rows.map((row) => String(row.id || "").trim()).filter(Boolean)
    : PLATFORM_IDS.slice();
  const allLive = src.all_live === false ? false : ids.length ? ids.every((id) => {
    const row = rows.find((item) => item.id === id);
    return !row || row.live !== false;
  }) : true;
  return {
    spec: BAN_PLATFORMS_SPEC,
    all_live: allLive,
    native_app_store: false,
    calling_name: src.calling_name || CALLING_NAME_DEFAULT,
    survival: SURVIVAL_LOCAL,
    platforms: ids,
    note:
      "Windows, Mac, Linux, Android, and iPhone are LIVE via browser / PWA / Worker fronts / Softwares /download / MCP. Hubs pull /survival. Not five native store binaries.",
  };
}

export function mutualBackupCite(origin) {
  const live = survivalSource(origin) || asObject(origin);
  return {
    mutual_backup: live && live.mutual_backup === false ? false : true,
    shelves_are_not_a_live_door: true,
    shelves_backup_for: (live && live.shelves_backup_for) || "death-by-ban",
    live_doors_backup_for: (live && live.live_doors_backup_for) || "cold-shelf-death",
    refuse: ["BAN-NO-SHELF-ONLY", "BAN-NO-DOOR-ONLY"],
    note: "Cold shelves back up death-by-ban. Live fronts back up shelf death. Keep both. Shelves are not /mcp.",
  };
}

export function cap7ShuffleCite(origin) {
  const live = survivalSource(origin) || asObject(origin);
  const cap7 = asObject(live && live.cap7_aznet) || {};
  const shuffle = asObject(cap7.shuffle) || {};
  const hosted = asObject(cap7.hosted_endpoints) || {};
  return {
    spec: CAP7_SHUFFLE_SPEC,
    factory: "miragegrid",
    factory_only: true,
    resolves_to_hub: false,
    name_may_change: true,
    public_icann: false,
    fifth_product: false,
    radio_phy: false,
    software_tab: false,
    app_worker: MIRAGEGRID,
    health: MIRAGEGRID_HEALTH,
    bridge: MIRAGEGRID_BRIDGE,
    shuffle: MIRAGEGRID_SHUFFLE,
    download_worker: MIRAGEGRID_DOWNLOAD,
    public_worker: "live",
    hosted_endpoints: hosted.status || "slot",
    hosted_update: shuffle.hosted_update || "slot",
    path: shuffle.path || "ping → land → that-round update",
    hardcoded_single_host: false,
    mesh_live_nodes_are_api: false,
    note:
      "Cap-7 shuffle via MirageGrid LIVE Worker. GET /v1/health · /bridge · /v1/shuffle. resolves_to_hub: false. Hosted Cap-7 exec SLOT. Not live_doors. Not Live Nodes. GodLock is a product, not identity.",
  };
}

export function shelfBackupCite(origin) {
  const live = survivalSource(origin) || asObject(origin);
  const src = asObject(live && live.shelf_backup);
  if (src) {
    return {
      ...src,
      is_live_door: false,
    };
  }
  return {
    role: "death-by-ban-backup",
    is_live_door: false,
    shelves: "https://www.azielcorpuslibrary.net/shelves",
    note: "Cold shelves back up death-by-ban. Pull runtime /survival for the live tip-hash. Not /mcp.",
  };
}

export function banSurvivalCite(origin) {
  const live = survivalSource(origin);
  const backup = mutualBackupCite(live);
  const calling = callingNameCite(live);
  const platforms = platformsCite(live);
  const cap7 = cap7ShuffleCite(live);
  const alert = callingNameAlertLine(live);
  return {
    spec: BAN_SURVIVAL_SPEC,
    author: AUTHOR,
    identity: AUTHOR,
    person_id: PERSON_ID,
    kind: "law",
    source: live ? "live" : "fallback",
    via: live ? SURVIVAL_ORIGIN_PATH : null,
    survival: SURVIVAL_ORIGIN,
    survival_json: SURVIVAL_ORIGIN_JSON,
    survival_local: SURVIVAL_LOCAL,
    survival_runtime: SURVIVAL_RUNTIME,
    mutual_backup: backup.mutual_backup,
    shelves_backup_for: backup.shelves_backup_for,
    live_doors_backup_for: backup.live_doors_backup_for,
    live_doors: liveDoorsFrom(live),
    live_node_api: false,
    mesh_live_nodes_are_api: false,
    calling_name: calling,
    calling_name_alert: alert || null,
    platforms,
    cap7_aznet: cap7,
    shelf_backup: shelfBackupCite(live),
    godlock_is_product_not_identity: true,
    godlock: GODLOCK + "/",
    lamb_lens: "Service → Clarity → Peace",
    no_lie: "NO-LIE-NO-REWRITE-1.0",
    visible_1520: false,
    software_tab: false,
    note: SURVIVAL_NOTE,
  };
}

export function survivalBody(origin) {
  const live = survivalSource(origin);
  const cite = banSurvivalCite(live);
  const body = {
    ok: true,
    author: AUTHOR,
    identity: AUTHOR,
    person_id: PERSON_ID,
    product: "azieleliab",
    spec: BAN_SURVIVAL_SPEC,
    source: cite.source,
    via: cite.via,
    survival: SURVIVAL_ORIGIN,
    survival_json: SURVIVAL_ORIGIN_JSON,
    survival_local: SURVIVAL_LOCAL,
    survival_json_local: SURVIVAL_JSON_LOCAL,
    survival_runtime: SURVIVAL_RUNTIME,
    survival_runtime_json: SURVIVAL_RUNTIME_JSON,
    mutual_backup: cite.mutual_backup,
    live_doors: cite.live_doors,
    live_node_api: false,
    mesh_live_nodes_are_api: false,
    calling_name: cite.calling_name,
    calling_name_alert: cite.calling_name_alert,
    platforms: cite.platforms,
    cap7_aznet: cite.cap7_aznet,
    shelf_backup: cite.shelf_backup,
    godlock_is_product_not_identity: true,
    lamb_lens: cite.lamb_lens,
    no_lie: cite.no_lie,
    visible_1520: false,
    software_tab: false,
    door: "fraggate",
    note: SURVIVAL_NOTE,
  };
  if (live) body.origin = live;
  return body;
}

export function survivalLlmsBlock(origin) {
  const cite = banSurvivalCite(origin);
  const alert = cite.calling_name_alert;
  return [
    "## " + BAN_SURVIVAL_SPEC,
    "",
    SURVIVAL_NOTE,
    "- GET " + SURVIVAL_LOCAL + "  (hub pull of runtime SoT; short TTL)",
    "- GET " + SURVIVAL_JSON_LOCAL,
    "- Origin: " + SURVIVAL_ORIGIN + " · " + SURVIVAL_ORIGIN_JSON,
    "- Runtime door: " + SURVIVAL_RUNTIME,
    "- Mutual backup: shelves → death-by-ban; live_doors → cold-shelf-death. Keep both.",
    "- Live doors listed only from pulled SoT (never invented). Live Nodes ≠ live_doors ≠ Cap-7.",
    "- Cap-7 shuffle via MirageGrid: " + MIRAGEGRID + " (" + MIRAGEGRID_HEALTH + " · " + MIRAGEGRID_BRIDGE + " · " + MIRAGEGRID_SHUFFLE + "). resolves_to_hub: false.",
    "- Platforms all LIVE: " + cite.platforms.platforms.join(", ") + ". native_app_store: false.",
    "- Calling name: " + cite.calling_name.calling_name + " (" + BAN_CALLING_NAME_SPEC + "). Identity Aziel Eliab unchanged.",
    "- Rotation awareness: " + (alert || CALLING_NAME_ALERT_PREFIX + " <name> (none while rotated:false)"),
    "- GodLock is a product, not identity. Person @id: " + PERSON_ID,
    "- Lamb Lens: Service → Clarity → Peace. NO-LIE. visible_1520: false.",
    "",
  ].join("\n");
}

export async function loadSurvival(env, ctx, opts) {
  const packed = await readJsonSnapshot(env, { cacheUrl: SURVIVAL_CACHE_URL });
  if (packed && packed.ok) return packed;
  const request = opts && opts.request;
  const allowFetch = !request || allowOriginRefresh(request, env, "survival");
  const origin = allowFetch ? await fetchRuntimeJson(SURVIVAL_ORIGIN_PATH, env, { loose: true }) : null;
  const body = survivalBody(isBanSurvivalDoc(origin) ? origin : null);
  const write = writeJsonSnapshot(env, ctx, { cacheUrl: SURVIVAL_CACHE_URL, ttlSec: SURVIVAL_TTL_SEC }, body);
  if (write && typeof write.then === "function") await write;
  return body;
}

export function injectSurvivalCite(doc) {
  if (!doc || typeof doc !== "object" || Array.isArray(doc)) return doc;
  if (!doc.ban_survival) doc.ban_survival = banSurvivalCite(doc.ban_survival && doc.ban_survival.origin);
  if (!doc.survival_local) doc.survival_local = SURVIVAL_LOCAL;
  if (!doc.survival_runtime) doc.survival_runtime = SURVIVAL_RUNTIME;
  if (doc.visible_1520 == null) doc.visible_1520 = false;
  if (doc.mesh_live_nodes_are_api == null) doc.mesh_live_nodes_are_api = false;
  if (doc.godlock_is_product_not_identity == null) doc.godlock_is_product_not_identity = true;
  return doc;
}

export function injectSurvivalLlms(text) {
  const s = String(text || "");
  if (!s || /BAN-SURVIVAL-1\.0/.test(s)) return s;
  return s.replace(/\s*$/, "") + "\n" + survivalLlmsBlock(null);
}

export function injectSurvivalDiscovery(text, contentType, pathname) {
  const dest = String(pathname || "").split("?")[0].replace(/\/+$/, "") || "/";
  const ct = String(contentType || "").toLowerCase();
  const raw = String(text == null ? "" : text);
  if (!raw) return raw;
  if (dest === "/cite.json" && ct.includes("json")) {
    try {
      return JSON.stringify(injectSurvivalCite(JSON.parse(raw)));
    } catch {
      return raw;
    }
  }
  if (dest === "/llms.txt" || dest === "/ai.txt") {
    return injectSurvivalLlms(raw);
  }
  return raw;
}
