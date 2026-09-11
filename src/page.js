/** Literary landing HTML. Black / gold / white. Author: Aziel Eliab. */
import {
  AUTHOR,
  CANON_ORIGIN,
  DESCRIPTION,
  DONATE_COPY,
  DONATE_DESCRIPTION,
  DONATE_DISCLAIMER,
  DONATE_HREF,
  DONATE_NETWORK_NOTE,
  DONATE_RAILS,
  DONATE_SIGN,
  DONATE_TITLE,
  DOORS,
  EMBRYOLOCK_COPY,
  EMBRYOLOCK_HREF,
  EMBRYOLOCK_WORKER,
  GITHUB,
  LIBRARY,
  PROSE,
  RUNTIME_DOORS,
  RUNTIME_NAME,
  RUNTIME_TITLE,
  RUNTIME_VERSION,
  SIGIL,
  SOFTWARE,
  SOFTWARE_SECTION,
  SPINE,
  X_HANDLE,
  X_URL,
  resolveRuntimeVersion,
} from "./copy.js";
import { qrImg } from "./qr.js";
import { MESH_STATUS_LOCAL, QNM_SPEC, QNS_CD_SPEC, liveNodesLabel, meshQuietLabel } from "./mesh.js";
import { jsonLd, ROBOTS_INDEX } from "./seo.js";

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
            : DONATE_HREF
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
    '<a href="' +
    attr(rail.uri) +
    '" data-open-wallet data-wallet-uri="' +
    attr(rail.uri) +
    '" data-wallet-uri-alt="' +
    attr(rail.uriAlt || "") +
    '" data-copy-addr="' +
    attr(rail.address) +
    '" rel="noopener noreferrer">Open in wallet</a>' +
    "</p>" +
    '<div class="qr">' +
    qrImg(rail) +
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
    '<p class="wallet-hint">Open in wallet uses the standard payment URI your OS routes to an installed wallet (Exodus, MetaMask, Trust, Phantom, Coinbase, and peers). If Safari says the link is invalid, scan the QR inside your wallet — that path works for every wallet.</p>' +
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
.runtime-cite{margin:0 0 12px;color:var(--muted);font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:14px;letter-spacing:.04em}
.runtime-doors{display:flex;flex-wrap:wrap;gap:10px;margin:0}
.runtime-doors a{
  font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
  font-size:13px;font-weight:700;letter-spacing:.04em;
  background:#2a241c;color:var(--ink);border:1px solid var(--gold);
  border-radius:8px;padding:7px 12px;text-decoration:none;
}
.runtime-doors a:hover{color:var(--gold)}
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
.qr{display:inline-block;margin:0 0 10px;background:#fff;border-radius:6px;padding:10px;line-height:0}
.qr img{display:block;width:180px;height:180px;background:#fff;image-rendering:pixelated}
.rail-note{margin:0;color:var(--muted);font-size:13px}
.wallet-hint{margin:14px 0 0;color:var(--muted);font-size:14px;line-height:1.45}
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
  if(btn.hasAttribute("data-open-wallet"))return;
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
(function(){
  function copyText(t, done){
    if(!t){ if(done)done(); return; }
    var ok=function(){ if(done)done(); };
    var fail=function(){
      try{
        var ta=document.createElement("textarea");
        ta.value=t; ta.setAttribute("readonly","");
        ta.style.position="fixed"; ta.style.left="-9999px";
        document.body.appendChild(ta); ta.select();
        document.execCommand("copy"); document.body.removeChild(ta); ok();
      }catch(e){}
    };
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(t).then(ok).catch(fail);
    } else fail();
  }
  function flash(el, msg){
    var prev=el.getAttribute("data-label")||el.textContent;
    if(!el.getAttribute("data-label")) el.setAttribute("data-label", prev);
    el.textContent=msg;
    setTimeout(function(){ el.textContent=el.getAttribute("data-label")||prev; }, 2400);
  }
  /* Safari (iOS + desktop) often has no handler for coin schemes → "link not valid". */
  function safariLike(){
    var ua=navigator.userAgent||"";
    var iOS=/iPhone|iPad|iPod/.test(ua)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
    var safari=/Safari/.test(ua)&&!/Chrome|Chromium|CriOS|FxiOS|EdgiOS|Edg\/|OPR\/|Android/.test(ua);
    return iOS||safari;
  }
  document.addEventListener("click", function(e){
    var a=e.target.closest("[data-open-wallet]");
    if(!a) return;
    var uri=a.getAttribute("data-wallet-uri")||a.getAttribute("href")||"";
    var addr=a.getAttribute("data-copy-addr")||"";
    /* Seed clipboard with bare address — every wallet Send accepts paste. */
    copyText(addr);
    if(safariLike()){
      e.preventDefault();
      flash(a, "Address copied — scan QR in your wallet");
      return;
    }
    /* Optional alt scheme (e.g. ripple: alongside xrp:). */
    var alt=a.getAttribute("data-wallet-uri-alt")||"";
    if(alt && alt!==uri){
      try{
        var fr=document.createElement("iframe");
        fr.style.display="none";
        fr.src=alt;
        document.body.appendChild(fr);
        setTimeout(function(){ try{document.body.removeChild(fr);}catch(e){} }, 1500);
      }catch(e){}
    }
    /* Chrome/Firefox/Android: href navigates so Trust/MetaMask/Exodus/Phantom/Coinbase/etc. can claim it. */
    setTimeout(function(){
      if(!document.hidden) flash(a, "Scan QR if wallet did not open");
    }, 1600);
  }, true);
})();
</script>`;

function discoveryLinks() {
  return [
    ["application/json", "/cite.json", "cite.json"],
    ["text/plain", "/llms.txt", "llms.txt"],
    ["text/plain", "/ai.txt", "ai.txt"],
    ["application/json", "/v1/software", "software catalog"],
    ["application/json", "/v1/update/check", "update check"],
    ["application/json", "/v1/mesh/status", "mesh status"],
    ["application/json", "/v1/mesh/nodes", "mesh nodes"],
    ["application/json", "/runtime/openapi.json", "OpenAPI"],
    ["application/json", "/runtime/v1/fraggate/list", "FragGate list"],
  ]
    .map(
      ([type, href, title]) =>
        '<link rel="alternate" type="' + type + '" href="' + href + '" title="' + title + '">',
    )
    .join("\n");
}

function documentHead({ title, description, canonical, software, extraMeta = "", runtimeVersion }) {
  const ld = JSON.stringify(jsonLd(software, runtimeVersion));
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="author" content="${esc(AUTHOR)}">
<meta name="citation_author" content="${esc(AUTHOR)}">
<meta name="robots" content="${esc(ROBOTS_INDEX)}">
<link rel="canonical" href="${esc(canonical)}">
<link rel="alternate" hreflang="en" href="${esc(canonical)}">
<link rel="alternate" hreflang="x-default" href="${esc(canonical)}">
<link rel="icon" href="${esc(SIGIL)}" type="image/png">
<link rel="author" href="${esc(CANON_ORIGIN)}/">
<link rel="me" href="${esc(GITHUB)}">
<link rel="me" href="${esc(X_URL)}">
<link rel="sitemap" type="application/xml" href="/sitemap.xml">
<meta property="og:type" content="website">
<meta property="og:locale" content="en">
<meta property="og:site_name" content="${esc(AUTHOR)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(SIGIL)}">
<meta property="og:image:alt" content="${esc(AUTHOR)}">
<meta name="twitter:card" content="summary">
<meta name="twitter:site" content="${esc(X_HANDLE)}">
<meta name="twitter:creator" content="${esc(X_HANDLE)}">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(SIGIL)}">
<meta name="twitter:image:alt" content="${esc(AUTHOR)}">
${discoveryLinks()}
${extraMeta}
<script type="application/ld+json">${ld}</script>
<style>${CSS}</style>`;
}

function quietDiscoveryMeta() {
  return `<meta name="aziel-update-check" content="${esc(CANON_ORIGIN)}/v1/update/check">
<meta name="aziel-mesh-status" content="${esc(MESH_STATUS_LOCAL)}">
<meta name="aziel-qns-cd" content="${esc(QNS_CD_SPEC)}">
<meta name="aziel-qnm" content="${esc(QNM_SPEC)}">
<meta name="aziel-software-catalog" content="${esc(CANON_ORIGIN)}/v1/software">
<meta name="aziel-fraggate-list" content="${esc(CANON_ORIGIN)}/runtime/v1/fraggate/list">`;
}

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

export function liveNodesPill(mesh) {
  return (
    '<a class="pill" id="aziel-live-nodes" href="/v1/mesh/status" title="' +
    attr(
      "Quantum Node Mesh rollup. GET never enables. Operator enable requires a declared bearer (example: suite-presence). Author Aziel Eliab.",
    ) +
    '">' +
    esc(liveNodesLabel(mesh)) +
    "</a>"
  );
}

const LIVE_NODES_SCRIPT = `<script>
(function(){
  var el=document.getElementById("aziel-live-nodes");
  if(!el||!el.textContent)return;
  fetch("/v1/mesh/status",{headers:{"Accept":"application/json","User-Agent":"Mozilla/5.0"}}).then(function(r){return r.json();}).then(function(d){
    if(!d)return;
    var src=d.origin&&typeof d.origin==="object"?d.origin:d;
    var on=d.enabled===true||(src&&src.enabled===true)||d.mesh==="on"||d.mesh==="enabled"||d.mesh==="live";
    var n=d.live_nodes!=null?d.live_nodes:(src&&src.live_nodes!=null?src.live_nodes:(d.nodes&&d.nodes.length)||(src&&src.rollup&&src.rollup.live)||0);
    el.textContent=on?("Live Nodes \\u00b7 "+n):"Live Nodes \\u00b7 off";
  }).catch(function(){});
})();
</script>`;

const RUNTIME_VERSION_SCRIPT = `<script>
(function(){
  var el=document.getElementById("aziel-runtime-version");
  if(!el)return;
  fetch("/runtime/v1/health",{headers:{"Accept":"application/json","User-Agent":"Mozilla/5.0"}}).then(function(r){return r.json();}).then(function(d){
    if(!d||!d.version)return;
    el.textContent=String(d.version);
  }).catch(function(){});
})();
</script>`;

function runtimeDoorsHtml() {
  return (
    '<p class="runtime-doors">' +
    RUNTIME_DOORS.map((door) => a(door.href, door.label)).join("") +
    "</p>"
  );
}

export function runtimeCiteHtml(version) {
  const ver = resolveRuntimeVersion(version);
  return (
    '<p class="runtime-cite">' +
    esc(RUNTIME_NAME) +
    " · <span id=\"aziel-runtime-version\">" +
    esc(ver) +
    "</span></p>"
  );
}

export function pageHtml(views = 0, softwareItems = SOFTWARE, mesh = null, runtimeVersion = RUNTIME_VERSION) {
  const doorsSoftware = softwareItems && softwareItems.length ? softwareItems : SOFTWARE;
  const software = softwareLine(doorsSoftware);
  const doors = DOORS.map(doorRow).join("");
  const meshLabel = meshQuietLabel(mesh);
  const nodesLabel = liveNodesLabel(mesh);
  return `<!doctype html>
<html lang="en">
<head>
${documentHead({
  title: AUTHOR,
  description: DESCRIPTION,
  canonical: CANON_ORIGIN + "/",
  software: doorsSoftware,
  extraMeta: quietDiscoveryMeta(),
  runtimeVersion,
})}
</head>
<body>
<main class="wrap">
  <header class="brandrow">
    <img class="brandmark" src="${esc(SIGIL)}" width="44" height="44" alt="">
    <div class="brand-meta">
      <a class="host" href="${esc(CANON_ORIGIN)}/">${esc(PROSE.host)}</a>
      ${viewsPill(views)}
      ${liveNodesPill(mesh)}
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
  <section class="card" id="runtime">
    <h2>${esc(RUNTIME_TITLE)}</h2>
    ${runtimeCiteHtml(runtimeVersion)}
    ${runtimeDoorsHtml()}
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
    <p class="mesh-quiet">${a("/v1/mesh/status", meshLabel)} · ${a("/v1/mesh/status", nodesLabel)}</p>
  </footer>
</main>
${COPY_SCRIPT}
${LIVE_NODES_SCRIPT}
${RUNTIME_VERSION_SCRIPT}
</body>
</html>`;
}

export function donateHtml() {
  return `<!doctype html>
<!-- azl-donate png -->
<html lang="en">
<head>
${documentHead({
  title: DONATE_TITLE + " — " + AUTHOR,
  description: DONATE_DESCRIPTION,
  canonical: DONATE_HREF,
  extraMeta: quietDiscoveryMeta(),
})}
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
${documentHead({
  title: EMBRYOLOCK_COPY.title + " — " + AUTHOR,
  description: EMBRYOLOCK_COPY.open[0],
  canonical: EMBRYOLOCK_HREF,
  extraMeta: quietDiscoveryMeta(),
})}
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
  <p>${a(EMBRYOLOCK_WORKER, "worker_home")} · ${a(SOFTWARE_SECTION, "Software")} · ${a(CANON_ORIGIN + "/", AUTHOR)}</p>
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
