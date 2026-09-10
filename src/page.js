/** Literary landing HTML. Black / gold / white. Author: Aziel Eliab. */
import {
  AUTHOR,
  CANON_ORIGIN,
  DESCRIPTION,
  DONATE_COPY,
  DONATE_DISCLAIMER,
  DONATE_HREF,
  DONATE_NETWORK_NOTE,
  DONATE_PATH,
  DONATE_RAILS,
  DONATE_SIGN,
  DONATE_TITLE,
  DOORS,
  EMBRYOLOCK_COPY,
  EMBRYOLOCK_HREF,
  LIBRARY,
  PROSE,
  SIGIL,
  SOFTWARE,
  SOFTWARE_SECTION,
  SPINE,
} from "./copy.js";
import { qrSvg } from "./qr.js";
import { MESH_STATUS_LOCAL, QNS_CD_SPEC, meshQuietLabel } from "./mesh.js";
import { jsonLd } from "./seo.js";

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function attr(s) {
  return esc(s);
}

function a(href, text, extraClass) {
  const cls = extraClass ? ' class="' + extraClass + '"' : "";
  return '<a href="' + attr(href) + '"' + cls + ' rel="noopener noreferrer">' + esc(text) + "</a>";
}

function paragraphs(lines) {
  return lines.map((line) => "<p>" + esc(line) + "</p>").join("");
}

function researchParagraphs() {
  const needle = LIBRARY + "/";
  return PROSE.research
    .map((line) => {
      if (!line.includes(needle)) return "<p>" + esc(line) + "</p>";
      return "<p>" + line.split(needle).map(esc).join(a(needle, needle)) + "</p>";
    })
    .join("");
}

function softwareLine(items = SOFTWARE) {
  return (items || SOFTWARE).map((item, i, list) => {
    const mark = i === list.length - 1 ? "." : ".";
    return a(item.href, item.name, "soft-name") + mark;
  }).join(" ");
}

function doorRow(door) {
  const label = a(door.href, door.label, "door-label");
  const url = a(door.href, door.href, "door-url");
  if (door.also) {
    const live = a(door.also.href, door.also.label, "door-url");
    return (
      "<li>" +
      label +
      ' <span class="arrow" aria-hidden="true">→</span> ' +
      url +
      ' <span class="also">also ' +
      live +
      "</span></li>"
    );
  }
  return "<li>" + label + ' <span class="arrow" aria-hidden="true">→</span> ' + url + "</li>";
}

export function spineNav(current) {
  return (
    '<nav class="spine" aria-label="Spine">' +
    SPINE.map((item) => {
      const here = item.id === current;
      const href =
        item.id === "donate"
          ? current === "home"
            ? "#donate"
            : DONATE_PATH
          : current === "home"
            ? "#" + item.id
            : "/#" + item.id;
      const cur = here ? ' aria-current="page"' : "";
      return '<a href="' + attr(href) + '"' + cur + ">" + esc(item.label) + "</a>";
    }).join("") +
    "</nav>"
  );
}

function railHtml(rail) {
  const extra = rail.extra ? '<p class="rail-note">' + esc(rail.extra) + "</p>" : "";
  return (
    '<article class="rail" id="rail-' +
    attr(rail.id) +
    '">' +
    "<h3>" +
    esc(rail.coin) +
    "</h3>" +
    '<p class="rail-net">' +
    esc(rail.network) +
    "</p>" +
    '<p class="addr"><code>' +
    esc(rail.address) +
    "</code></p>" +
    '<p class="rail-actions">' +
    '<button type="button" data-copy="' +
    attr(rail.address) +
    '">Copy</button> ' +
    a(rail.uri, "Open in wallet") +
    "</p>" +
    '<div class="qr">' +
    qrSvg(rail.uri, rail.coin + " payment URI") +
    "</div>" +
    '<p class="rail-note">' +
    esc(DONATE_NETWORK_NOTE) +
    "</p>" +
    extra +
    "</article>"
  );
}

export function donateArticle() {
  const copy = paragraphs(DONATE_COPY) + '<p class="sign">' + esc(DONATE_SIGN) + "</p>";
  const rails = DONATE_RAILS.map(railHtml).join("");
  return (
    copy +
    '<div class="rails">' +
    rails +
    "</div>" +
    '<p class="donate-law">' +
    esc(DONATE_DISCLAIMER) +
    "</p>"
  );
}

const CSS = `
:root{
  --bg:#0e0c09;
  --bg-lift:#12100c;
  --card:#19150f;
  --ink:#ffffff;
  --ink-soft:#f4f1ea;
  --muted:#a89880;
  --line:#3a3228;
  --gold:#c9a227;
  --gold-dim:#8a7018;
}
*{box-sizing:border-box}
html,body{background:var(--bg);color:var(--ink);margin:0;min-height:100%;overflow:auto;height:auto}
html{color-scheme:dark}
body{
  font-family:Georgia,"Iowan Old Style","Palatino Linotype",Palatino,"Times New Roman",serif;
  font-size:18px;
  line-height:1.7;
  background:
    radial-gradient(1200px 600px at 50% -10%, #1a160f 0%, transparent 55%),
    linear-gradient(180deg, var(--bg-lift) 0%, var(--bg) 42%, #0b0907 100%);
}
.wrap{max-width:40rem;margin:0 auto;padding:36px 22px 96px}
.brandrow{display:flex;align-items:center;gap:12px;margin:0 0 28px}
.brandmark{
  width:44px;height:44px;border-radius:12px;object-fit:cover;flex:0 0 44px;
  box-shadow:0 0 0 1px var(--gold);
}
.host{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:13px;letter-spacing:.12em;text-transform:lowercase;color:var(--gold);text-decoration:none}
.host:hover{color:var(--ink)}
.brand-meta{display:flex;flex-wrap:wrap;align-items:center;gap:10px;flex:1 1 auto}
.pill{
  font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
  border-radius:999px;padding:6px 12px;font-size:12px;font-weight:700;
  background:#2a241c;color:var(--ink);border:1px solid var(--gold);
  letter-spacing:.04em;text-decoration:none;
}
.pill:hover{color:var(--gold)}
.pill span{color:var(--muted);font-weight:650;margin-left:6px}
h1{font-size:clamp(2rem,6vw,2.75rem);font-weight:600;letter-spacing:-.03em;line-height:1.15;margin:0 0 22px;color:var(--ink)}
h2{
  font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
  font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;
  color:var(--gold);margin:0 0 12px;
}
p{margin:0 0 1em;color:var(--ink-soft)}
p:last-child{margin-bottom:0}
.card{
  background:var(--card);
  border:1px solid var(--line);
  border-radius:16px;
  padding:22px 22px 20px;
  margin:0 0 16px;
  box-shadow:0 1px 0 #00000040;
}
.card.lead{border-color:#4a3d24}
.card.close{border-color:var(--gold)}
a{color:var(--ink);text-decoration:underline;text-decoration-color:var(--gold-dim);text-underline-offset:3px}
a:hover{color:var(--gold);text-decoration-color:var(--gold)}
.soft-line{color:var(--ink-soft);line-height:1.95}
.soft-name{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:16px;font-weight:650;color:var(--ink);text-decoration:none;border-bottom:1px solid var(--gold);padding-bottom:1px}
.soft-name:hover{color:var(--gold)}
.doors{list-style:none;margin:0;padding:0}
.doors li{margin:0 0 12px;padding:0;word-break:break-word}
.door-label{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-weight:700;color:var(--ink);text-decoration:none;border-bottom:1px solid var(--gold)}
.door-url{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px;color:var(--ink-soft)}
.door-label:hover,.door-url:hover{color:var(--gold)}
.arrow{color:var(--gold);padding:0 4px}
.also{display:inline;color:var(--muted);font-size:15px}
.also .door-url{font-size:14px}
.sign{margin-top:18px;color:var(--muted);font-style:italic}
footer{margin-top:28px;color:var(--muted);font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:13px}
footer a{color:var(--muted)}
footer a:hover{color:var(--gold)}
.mesh-quiet{margin:0;font-size:12px;letter-spacing:.04em}
.spine{
  display:flex;flex-wrap:wrap;gap:8px 14px;margin:0 0 28px;padding:0;
  font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
  font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;
}
.spine a{color:var(--gold);text-decoration:none;border-bottom:1px solid transparent;padding-bottom:1px}
.spine a:hover{color:var(--ink);border-bottom-color:var(--gold)}
.spine a[aria-current="page"]{color:var(--ink);border-bottom-color:var(--gold)}
.rail{
  border:1px solid var(--line);border-radius:12px;padding:16px 16px 14px;margin:0 0 12px;
  background:#14110c;
}
.rail:last-child{margin-bottom:0}
.rail h3{
  font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
  font-size:15px;font-weight:700;letter-spacing:.02em;margin:0 0 4px;color:var(--ink);
}
.rail-net{margin:0 0 10px;color:var(--muted);font-size:14px}
.addr{
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  font-size:13px;line-height:1.55;word-break:break-all;color:var(--ink);
  margin:0 0 10px;
}
.addr code{font:inherit;background:transparent}
.rail-actions{display:flex;flex-wrap:wrap;gap:10px 14px;align-items:center;margin:0 0 12px}
.rail-actions button{
  font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
  font-size:13px;font-weight:700;letter-spacing:.04em;
  background:#2a241c;color:var(--ink);border:1px solid var(--gold);
  border-radius:8px;padding:6px 12px;cursor:pointer;
}
.rail-actions button:hover{color:var(--gold)}
.rail-actions a{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:14px}
.qr{width:132px;height:132px;margin:0 0 10px;background:#fff;border-radius:6px;padding:0}
.qr svg{display:block;width:132px;height:132px}
.qr path.qrline{fill:none;stroke:#111;stroke-width:1}
.rail-note{margin:0;color:var(--muted);font-size:13px}
.donate-law{margin:16px 0 0;color:var(--muted);font-size:15px}
@media (max-width:720px){
  .wrap{padding:22px 16px 80px}
  body{font-size:17px}
  .card{padding:18px 16px}
  .soft-name{font-size:15px}
}
`;

const COPY_SCRIPT = `<script>
document.addEventListener("click",function(e){
  var btn=e.target.closest("[data-copy]");
  if(!btn)return;
  var text=btn.getAttribute("data-copy")||"";
  var done=function(){
    var prev=btn.textContent;
    btn.textContent="Copied";
    setTimeout(function(){btn.textContent=prev},1600);
  };
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(done).catch(function(){});
  }
});
</script>`;

export function viewsPill(views) {
  const n = Number.isFinite(views) ? views : 0;
  const label = n === 1 ? "view" : "views";
  return (
    '<a class="pill" href="/v1/stats" id="views">' +
    esc(String(n)) +
    "<span>" +
    esc(label) +
    "</span></a>"
  );
}

export function pageHtml(views = 0, softwareItems = SOFTWARE, mesh = null) {
  const doorsSoftware = softwareItems && softwareItems.length ? softwareItems : SOFTWARE;
  const ld = JSON.stringify(jsonLd(doorsSoftware));
  const software = softwareLine(doorsSoftware);
  const doors = DOORS.map(doorRow).join("");
  const meshLabel = meshQuietLabel(mesh);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(AUTHOR)}</title>
<meta name="description" content="${esc(DESCRIPTION)}">
<meta name="author" content="${esc(AUTHOR)}">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${esc(CANON_ORIGIN)}/">
<link rel="icon" href="${esc(SIGIL)}" type="image/png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(AUTHOR)}">
<meta property="og:title" content="${esc(AUTHOR)}">
<meta property="og:description" content="${esc(DESCRIPTION)}">
<meta property="og:url" content="${esc(CANON_ORIGIN)}/">
<meta property="og:image" content="${esc(SIGIL)}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(AUTHOR)}">
<meta name="twitter:description" content="${esc(DESCRIPTION)}">
<meta name="twitter:image" content="${esc(SIGIL)}">
<link rel="alternate" type="application/json" href="/cite.json" title="cite.json">
<link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt">
<link rel="alternate" type="text/plain" href="/ai.txt" title="ai.txt">
<link rel="alternate" type="application/json" href="/v1/software" title="software catalog">
<link rel="alternate" type="application/json" href="/v1/update/check" title="update check">
<link rel="alternate" type="application/json" href="/v1/mesh/status" title="mesh status">
<link rel="alternate" type="application/json" href="/v1/mesh/nodes" title="mesh nodes">
<link rel="alternate" type="application/json" href="/runtime/openapi.json" title="OpenAPI">
<meta name="aziel-update-check" content="${esc(CANON_ORIGIN)}/v1/update/check">
<meta name="aziel-mesh-status" content="${esc(MESH_STATUS_LOCAL)}">
<meta name="aziel-qns-cd" content="${esc(QNS_CD_SPEC)}">
<script type="application/ld+json">${ld}</script>
<style>${CSS}</style>
</head>
<body>
<main class="wrap">
  <header class="brandrow">
    <img class="brandmark" src="${esc(SIGIL)}" width="44" height="44" alt="">
    <div class="brand-meta">
      <a class="host" href="${esc(CANON_ORIGIN)}/">${esc(PROSE.host)}</a>
      ${viewsPill(views)}
    </div>
  </header>
  <h1>${esc(PROSE.title)}</h1>
  ${spineNav("home")}
  <article class="card lead">${paragraphs(PROSE.open)}</article>
  <section class="card" id="why">
    <h2>Why</h2>
    ${paragraphs(PROSE.why)}
  </section>
  <section class="card" id="software">
    <h2>Software</h2>
    <p class="soft-line">${software}</p>
  </section>
  <section class="card" id="research">
    <h2>Research</h2>
    ${researchParagraphs()}
  </section>
  <section class="card" id="doors">
    <h2>Doors</h2>
    <ul class="doors">${doors}</ul>
  </section>
  <section class="card" id="donate">
    <h2>${esc(DONATE_TITLE)}</h2>
    ${donateArticle()}
  </section>
  <section class="card close">
    <p>${esc(PROSE.close)}</p>
    <p class="sign">${esc(PROSE.sign)}</p>
  </section>
  <footer>
    <p>${esc(AUTHOR)} · ${a(CANON_ORIGIN + "/cite.json", "cite.json")} · ${a(CANON_ORIGIN + "/llms.txt", "llms.txt")} · ${a(DONATE_HREF, DONATE_TITLE)} · Apache-2.0</p>
    <p class="mesh-quiet">${a("/v1/mesh/status", meshLabel)}</p>
  </footer>
</main>
${COPY_SCRIPT}
</body>
</html>`;
}

export function donateHtml() {
  const desc = DONATE_COPY[0];
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(DONATE_TITLE)} — ${esc(AUTHOR)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="author" content="${esc(AUTHOR)}">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${esc(DONATE_HREF)}">
<link rel="icon" href="${esc(SIGIL)}" type="image/png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(AUTHOR)}">
<meta property="og:title" content="${esc(DONATE_TITLE)} — ${esc(AUTHOR)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(DONATE_HREF)}">
<meta property="og:image" content="${esc(SIGIL)}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(DONATE_TITLE)} — ${esc(AUTHOR)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${esc(SIGIL)}">
<link rel="alternate" type="application/json" href="/cite.json" title="cite.json">
<link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt">
<style>${CSS}</style>
</head>
<body>
<main class="wrap">
  <header class="brandrow">
    <img class="brandmark" src="${esc(SIGIL)}" width="44" height="44" alt="">
    <div class="brand-meta">
      <a class="host" href="${esc(CANON_ORIGIN)}/">${esc(PROSE.host)}</a>
    </div>
  </header>
  ${spineNav("donate")}
  <h1>${esc(DONATE_TITLE)}</h1>
  <article class="card lead">${donateArticle()}</article>
  <footer>
    <p>${esc(AUTHOR)} · ${a(CANON_ORIGIN + "/", AUTHOR)} · ${a(CANON_ORIGIN + "/cite.json", "cite.json")} · Apache-2.0</p>
  </footer>
</main>
${COPY_SCRIPT}
</body>
</html>`;
}

export function embryoLockHtml() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(EMBRYOLOCK_COPY.title)} — ${esc(AUTHOR)}</title>
<meta name="description" content="${esc(EMBRYOLOCK_COPY.open[0])}">
<meta name="author" content="${esc(AUTHOR)}">
<meta name="robots" content="index,follow">
<link rel="canonical" href="${esc(EMBRYOLOCK_HREF)}">
<link rel="icon" href="${esc(SIGIL)}" type="image/png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(AUTHOR)}">
<meta property="og:title" content="${esc(EMBRYOLOCK_COPY.title)}">
<meta property="og:description" content="${esc(EMBRYOLOCK_COPY.open[0])}">
<meta property="og:url" content="${esc(EMBRYOLOCK_HREF)}">
<meta property="og:image" content="${esc(SIGIL)}">
<style>${CSS}</style>
</head>
<body>
<main class="wrap">
  <header class="brandrow">
    <img class="brandmark" src="${esc(SIGIL)}" width="44" height="44" alt="">
    <div class="brand-meta">
      <a class="host" href="${esc(CANON_ORIGIN)}/">${esc(PROSE.host)}</a>
    </div>
  </header>
  <h1>${esc(EMBRYOLOCK_COPY.title)}</h1>
  <article class="card lead">${paragraphs(EMBRYOLOCK_COPY.open)}</article>
  <p>${a(SOFTWARE_SECTION, "Software")} · ${a(CANON_ORIGIN + "/", AUTHOR)}</p>
</main>
</body>
</html>`;
}

export function notFoundHtml() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Not found — ${esc(AUTHOR)}</title>
<link rel="canonical" href="${esc(CANON_ORIGIN)}/">
<style>${CSS}</style>
</head>
<body>
<main class="wrap">
  <h1>Not found</h1>
  <article class="card">
    <p>This path is not a door.</p>
    <p>${a(CANON_ORIGIN + "/", AUTHOR)}</p>
  </article>
</main>
</body>
</html>`;
}
