/** Monotonic landing pageviews in KV. Author: Aziel Eliab. */

export const VIEW_KEY = "views";
export const PRODUCT = "azieleliab";
export const AUTHOR = "Aziel Eliab";

const BOT_RE =
  /bot|crawl|spider|slurp|facebookexternalhit|preview|scanner|wget|curl\/|python-requests|httpclient|gptbot|chatgpt|claudebot|anthropic|perplexity|bytespider|applebot|amazonbot|bingbot|googleother|google-extended|oai-search|ccbot|diffbot|ai2bot|youbot|duckassist|mistralai/i;

export function isBot(userAgent) {
  const ua = String(userAgent || "").trim();
  if (!ua) return true;
  return BOT_RE.test(ua);
}

export function viewsBody(views, extra) {
  return {
    ok: true,
    views,
    product: PRODUCT,
    author: AUTHOR,
    ...extra,
  };
}

export async function readViews(env) {
  if (!env?.VIEWS) return 0;
  const raw = await env.VIEWS.get(VIEW_KEY);
  const n = Number.parseInt(String(raw || "0"), 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export async function incrementViews(env) {
  const next = (await readViews(env)) + 1;
  if (env?.VIEWS) await env.VIEWS.put(VIEW_KEY, String(next));
  return next;
}

export function memoryKv(seed = 0) {
  const store = new Map();
  if (seed) store.set(VIEW_KEY, String(seed));
  return {
    async get(key) {
      return store.has(key) ? store.get(key) : null;
    },
    async put(key, value) {
      store.set(key, String(value));
    },
  };
}
