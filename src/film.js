/**
 * Film gate for /. Assets are the SuperGrok theater files
 * (aziel-runtime.mp4, poster, grain, og). Enter opens the existing hub at #aziel.
 * Author: Aziel Eliab.
 */
import { LIBRARY, LIBRARY_RUNTIME, RUNTIME_VERSION } from "./copy.js";

export const FILM_MP4_PATH = "/film/aziel-runtime.mp4";
export const FILM_POSTER_PATH = "/film/poster.jpg";
export const FILM_GRAIN_PATH = "/film/grain.png";
export const FILM_OG_PATH = "/og.jpg";
export const FILM_SRC = FILM_MP4_PATH + "?v=2";

const FILES = {
  [FILM_MP4_PATH]: { file: "film/aziel-runtime.mp4", type: "video/mp4" },
  [FILM_POSTER_PATH]: { file: "film/poster.jpg", type: "image/jpeg" },
  [FILM_GRAIN_PATH]: { file: "film/grain.png", type: "image/png" },
  [FILM_OG_PATH]: { file: "og.jpg", type: "image/jpeg" },
};

export function isFilmAssetPath(pathname) {
  return Object.prototype.hasOwnProperty.call(FILES, String(pathname || ""));
}

function assetHeaders(type, extra) {
  return {
    "content-type": type,
    "cache-control": "public, max-age=86400, s-maxage=86400",
    "accept-ranges": "bytes",
    "X-Content-Type-Options": "nosniff",
    ...(extra || {}),
  };
}

function ranged(buf, request, headers) {
  const body = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  const total = body.byteLength;
  const range = request && request.headers.get("range");
  if (!range) {
    return new Response(body, {
      status: 200,
      headers: { ...headers, "content-length": String(total) },
    });
  }
  const match = /^bytes=(\d*)-(\d*)$/i.exec(String(range).trim());
  if (!match) {
    return new Response(body, {
      status: 200,
      headers: { ...headers, "content-length": String(total) },
    });
  }
  let start = match[1] === "" ? NaN : Number(match[1]);
  let end = match[2] === "" ? NaN : Number(match[2]);
  if (Number.isNaN(start)) {
    const suffix = Number.isNaN(end) ? 0 : end;
    start = Math.max(0, total - suffix);
    end = total - 1;
  } else if (Number.isNaN(end)) {
    end = total - 1;
  }
  if (start < 0 || start >= total || end < start) {
    return new Response(null, {
      status: 416,
      headers: { ...headers, "content-range": "bytes */" + total },
    });
  }
  end = Math.min(end, total - 1);
  const slice = body.subarray(start, end + 1);
  return new Response(slice, {
    status: 206,
    headers: {
      ...headers,
      "content-range": "bytes " + start + "-" + end + "/" + total,
      "content-length": String(slice.byteLength),
    },
  });
}

async function readPublic(rel) {
  const { readFile } = await import("node:fs/promises");
  return readFile(new URL("../public/" + rel, import.meta.url));
}

export async function filmAssetResponse(pathname, request, env, extraHeaders) {
  const spec = FILES[String(pathname || "")];
  if (!spec) return null;
  const headers = assetHeaders(spec.type, extraHeaders);
  if (env && env.ASSETS && typeof env.ASSETS.fetch === "function") {
    try {
      const url = new URL(pathname, request.url);
      const res = await env.ASSETS.fetch(new Request(url, request));
      if (res && res.status !== 404) {
        const out = new Headers(res.headers);
        for (const [key, value] of Object.entries(headers)) out.set(key, value);
        if (request.method === "HEAD") return new Response(null, { status: res.status, headers: out });
        return new Response(res.body, { status: res.status, headers: out });
      }
    } catch {
      /* local tests have no asset binding */
    }
  }
  let buf;
  try {
    buf = await readPublic(spec.file);
  } catch {
    return new Response("Film asset unavailable", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
    });
  }
  if (request.method === "HEAD") {
    return new Response(null, {
      status: 200,
      headers: { ...headers, "content-length": String(buf.byteLength) },
    });
  }
  return ranged(buf, request, headers);
}

export function filmGateHtml() {
  return `<section class="theater" aria-label="Film">
  <div class="grain" aria-hidden="true"></div>
  <header class="mast"><span>Aziel Runtime</span><span class="mast-dim">${RUNTIME_VERSION}</span><span class="mast-door">one door</span></header>
  <div class="stage-wrap"><div class="stage">
    <i class="tick tl"></i><i class="tick tr"></i><i class="tick bl"></i><i class="tick br"></i>
    <video class="film" poster="${FILM_POSTER_PATH}" controls playsinline preload="metadata" aria-label="Aziel Runtime film. The face is withheld. You don’t get to know me. You get to understand the work. No caption track was published with this file.">
      <source src="${FILM_SRC}" type="video/mp4">
      <p class="film-fallback">This film file did not play. <a href="${FILM_SRC}" download="aziel-runtime.mp4">Download aziel-runtime.mp4</a>. No caption track was published with the file. The still is the poster.</p>
    </video>
    <div class="gate">
      <img src="${FILM_POSTER_PATH}" alt="" class="gate-still">
      <div class="gate-veil"></div>
      <div class="gate-copy">
        <p class="eyebrow">a film · the face withheld</p>
        <h1>You don’t get to know me.</h1>
        <p class="deck">You get to understand the work.</p>
        <a class="enter" href="#aziel">Enter</a>
      </div>
    </div>
  </div></div>
  <div class="colophon">
    <p class="thesis">Knowing is collection. Understanding is subtraction. Take the man away and see whether anything is still true.</p>
    <p class="thesis soft">A self is a weather system. It passes. Work is what does not require the weather to continue.</p>
    <dl class="facts">
      <div><dt>Runtime</dt><dd>Node-meshed. FragGate is the single door — discover, route, refuse.</dd></div>
      <div><dt>Kept</dt><dd>Provenance. Chain of custody. Receipts. Explicit refusal.</dd></div>
      <div><dt>Law</dt><dd>The public identity is the work. Receipt-first. Local-first.</dd></div>
    </dl>
    <nav class="doors" aria-label="Film doors">
      <a href="#aziel">www.azieleliab.com</a>
      <a href="${LIBRARY}/" target="_blank" rel="noreferrer">azielcorpuslibrary.net</a>
      <a href="${LIBRARY_RUNTIME}" target="_blank" rel="noreferrer">runtime</a>
    </nav>
    <p class="close-line">If the work holds, the name was only a handle on the door.</p>
    <p class="download"><a href="${FILM_SRC}" download="aziel-runtime.mp4">Download the film</a></p>
  </div>
</section>
<script>(function(){var v=document.querySelector(".theater video.film");if(!v)return;v.addEventListener("play",function(){var s=v.closest(".stage");if(s)s.classList.add("is-playing");});})();</script>`;
}

export const THEATER_CSS = `
.theater{background:radial-gradient(80% 50% at 50% -10%,#303a5873,#0000 60%),#07090f;min-height:100dvh;position:relative;overflow:hidden;color:#f3ead8}
.theater .grain{pointer-events:none;z-index:1;opacity:.09;mix-blend-mode:overlay;background-image:url(${FILM_GRAIN_PATH});background-size:160px 160px;position:absolute;inset:0}
.theater .mast{letter-spacing:.22em;text-transform:uppercase;color:#e6d4b5;align-items:baseline;gap:1.25rem;padding:1.1rem 1.4rem .2rem;font-size:.72rem;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;display:flex;position:relative;z-index:2}
.theater .mast-dim{color:#e6d4b58c}
.theater .mast-door{color:#b0f0c4;letter-spacing:.28em;margin-left:auto}
.theater .stage-wrap{padding:.85rem 1.1rem .2rem;position:relative;z-index:2}
.theater .stage{aspect-ratio:16/9;background:#000;width:min(1100px,100%);margin:0 auto;position:relative;box-shadow:0 30px 80px #0000008c}
.theater .film{object-fit:cover;background:#000;width:100%;height:100%;display:block}
.theater .tick{z-index:3;pointer-events:none;border-style:solid;border-color:#e6d4b5d9;width:18px;height:18px;position:absolute}
.theater .tl{border-width:1px 0 0 1px;top:8px;left:8px}
.theater .tr{border-width:1px 1px 0 0;top:8px;right:8px}
.theater .bl{border-width:0 0 1px 1px;bottom:8px;left:8px}
.theater .br{border-width:0 1px 1px 0;bottom:8px;right:8px}
.theater .gate{z-index:2;place-items:center;display:grid;position:absolute;inset:0 0 2.75rem 0}
.theater .gate-still{object-fit:cover;filter:saturate(.85) contrast(1.05);width:100%;height:100%;position:absolute;inset:0}
.theater .gate-veil{background:linear-gradient(#07090f59 0%,#07090f47 58%,#07090fc7 100%);position:absolute;inset:0}
.theater .gate-copy{text-align:center;max-width:38rem;padding:1.2rem;position:relative}
.theater .eyebrow{letter-spacing:.28em;text-transform:uppercase;color:#b0f0c4;margin:0 0 .85rem;font-size:.68rem;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
.theater .gate-copy h1{letter-spacing:-.02em;color:#f3ead8;margin:0;font-family:Georgia,"Iowan Old Style","Palatino Linotype",Palatino,"Times New Roman",serif;font-size:clamp(2.1rem,5vw,4.1rem);font-weight:500;line-height:.95}
.theater .deck{color:#e6d4b5e0;margin:.85rem 0 1.4rem;font-family:Georgia,"Iowan Old Style",Palatino,"Times New Roman",serif;font-size:clamp(1.15rem,2.4vw,1.7rem);font-style:italic}
.theater .enter{appearance:none;display:inline-block;color:#07090f;letter-spacing:.24em;text-transform:uppercase;background:#e6d4b5;border:0;padding:.72rem 1.4rem;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.72rem;text-decoration:none}
.theater .enter:hover{background:#b0f0c4;color:#07090f}
.theater .enter:focus-visible{outline-offset:3px;outline:1px solid #b0f0c4}
.theater .stage.is-playing .gate-still,.theater .stage.is-playing .gate-veil{display:none}
.theater .stage.is-playing .gate{inset:auto 0 2.75rem 0;background:linear-gradient(#0000,#07090fcc)}
.theater .film-fallback{color:#f3ead8;padding:1rem}
.theater .colophon{width:min(820px,100% - 2.2rem);margin:1.6rem auto 3.2rem;position:relative;z-index:2}
.theater .thesis{color:#f0e6d2;margin:0 0 .85rem;font-family:Georgia,"Iowan Old Style",Palatino,"Times New Roman",serif;font-size:clamp(1.35rem,2.5vw,1.85rem);line-height:1.25}
.theater .thesis.soft{color:#e6d4b5c7;margin-bottom:1.6rem;font-style:italic}
.theater .facts{border-top:1px solid #e6d4b538;grid-template-columns:1fr;gap:.9rem;margin:0 0 1.5rem;padding-top:1.1rem;display:grid}
.theater .facts dt{letter-spacing:.22em;text-transform:uppercase;color:#b0f0c4;margin-bottom:.35rem;font-size:.64rem;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
.theater .facts dd{color:#e6d4b5d1;margin:0;font-size:.78rem;line-height:1.45}
.theater .doors{flex-wrap:wrap;gap:.7rem 1.2rem;display:flex;list-style:none;margin:0;padding:0}
.theater .doors a{color:#e6d4b5;letter-spacing:.04em;border-bottom:1px solid #e6d4b566;padding-bottom:.12rem;font-size:.75rem;text-decoration:none}
.theater .doors a:hover{color:#b0f0c4;border-color:#b0f0c4}
.theater .close-line{color:#e6d4b59e;margin:1.6rem 0 0;font-family:Georgia,"Iowan Old Style",Palatino,"Times New Roman",serif;font-size:1.15rem;font-style:italic}
.theater .download{margin:1.4rem 0 0}
.theater .download a{color:#b0f0c4;letter-spacing:.18em;text-transform:uppercase;border-bottom:1px solid #b0f0c473;padding-bottom:.12rem;font-size:.72rem;text-decoration:none}
.theater .download a:hover{color:#e6d4b5;border-color:#e6d4b5}
#aziel{scroll-margin-top:1rem}
@media (width>=740px){.theater .facts{grid-template-columns:1fr 1fr 1fr;gap:1.25rem}}
@media (width<=720px){
  .theater .mast{letter-spacing:.14em;gap:.7rem;padding:.85rem .9rem .15rem;font-size:.62rem}
  .theater .stage{aspect-ratio:auto;box-shadow:none;background:transparent}
  .theater .film{aspect-ratio:16/9;height:auto}
  .theater .tick{display:none}
  .theater .gate{display:block;position:static;inset:auto;background:none}
  .theater .gate-still,.theater .gate-veil{display:none}
  .theater .gate-copy{padding:.95rem .15rem .1rem}
  .theater .gate-copy h1{font-size:2rem}
  .theater .deck{margin:.35rem 0 .9rem}
  .theater .stage.is-playing .gate{position:static;background:none}
}
`;

export const FILM_PRELOAD = '<link rel="preload" as="image" href="' + FILM_POSTER_PATH + '">';
