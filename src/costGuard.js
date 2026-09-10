/**
 * Soft cost/abuse protection for expensive origin fan-out
 * (update/check, mesh refresh). This is not content rationing:
 * humans, crawlers, and SEO still get full documents. A warm
 * snapshot is served instead of re-fetching runtime.
 * Operator token (X-Aziel-Runtime-Token / Bearer) is uncapped.
 * Author: Aziel Eliab.
 */

const buckets = new WeakMap();
const FALLBACK = {};

export const FANOUT_WINDOW_MS = 60_000;
export const FANOUT_MAX = 12;

function bucketMap(env) {
  const key = env && typeof env === "object" ? env : FALLBACK;
  let map = buckets.get(key);
  if (!map) {
    map = new Map();
    buckets.set(key, map);
  }
  return map;
}

export function clientIp(request) {
  const headers = request && request.headers;
  if (!headers || typeof headers.get !== "function") return "local";
  const cf = String(headers.get("cf-connecting-ip") || "").trim();
  if (cf) return cf;
  const fwd = String(headers.get("x-forwarded-for") || "")
    .split(",")[0]
    .trim();
  return fwd || "local";
}

export function operatorTokenFrom(request) {
  const headers = request && request.headers;
  if (!headers || typeof headers.get !== "function") return "";
  const named = String(headers.get("x-aziel-runtime-token") || "").trim();
  if (named) return named;
  const auth = String(headers.get("authorization") || "");
  const m = /^Bearer\s+(\S+)/i.exec(auth);
  return m ? m[1] : "";
}

export function timingSafeEqualString(left, right) {
  const a = String(left);
  const b = String(right);
  const max = Math.max(a.length, b.length);
  let out = a.length === b.length ? 0 : 1;
  for (let i = 0; i < max; i++) {
    out |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return out === 0;
}

export function isOperator(request, env) {
  const secret = String((env && env.OPERATOR_TOKEN) || "").trim();
  if (!secret) return false;
  return timingSafeEqualString(operatorTokenFrom(request), secret);
}

/**
 * Whether this caller may refresh runtime (origin/service-binding).
 * Denied callers still receive the last full snapshot — never a soft-404.
 */
export function allowOriginRefresh(request, env, name, max = FANOUT_MAX, windowMs = FANOUT_WINDOW_MS) {
  if (isOperator(request, env)) return true;
  const map = bucketMap(env);
  const key = String(name || "fanout") + "|" + clientIp(request);
  const now = Date.now();
  let row = map.get(key);
  if (!row || now >= row.reset) {
    row = { n: 0, reset: now + windowMs };
    map.set(key, row);
  }
  row.n += 1;
  return row.n <= max;
}
