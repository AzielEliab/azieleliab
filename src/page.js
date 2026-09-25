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
  ECOSYSTEM_LINKS,
  ECOSYSTEM_TITLE,
  EMBRYOLOCK_COPY,
  EMBRYOLOCK_HREF,
  EMBRYOLOCK_WORKER,
  GITHUB,
  HASH_REDIRECTS,
  LIBRARY,
  PROSE,
  RECEIPTS_DESCRIPTION,
  RECEIPTS_HREF,
  RECEIPTS_TITLE,
  RUNTIME_DOORS,
  RUNTIME_GIT_SHORT,
  RUNTIME_NAME,
  RUNTIME_NAMED_LINE,
  RUNTIME_TITLE,
  RUNTIME_VERSION,
  SIGIL,
  SOFTWARE,
  SOFTWARE_SECTION,
  SPINE,
  WHO_HREF,
  WHO_TITLE,
  X_HANDLE,
  X_URL,
  resolveRuntimeVersion,
} from "./copy.js";
import { qrImg } from "./qr.js";
import { MESH_LOCAL, MESH_STATUS_LOCAL, QNM_SPEC, QNS_CD_SPEC, dualNodesTitle, liveNodesLabel, meshQuietLabel } from "./mesh.js";
import { SURVIVAL_LOCAL } from "./survival.js";
import {
  identityDiscoveryLinks,
  personJsonLd,
  STATS_COUNTERS,
  STATS_NOTE,
  WHO_DESCRIPTION,
  WHO_IS_ANSWER,
  whoFaqPageNode,
} from "./identity.js";
import { jsonLd, ROBOTS_INDEX } from "./seo.js";
import {
  CITE_DONT_MERGE,
  ENOUGH,
  INGEST_BYTES_HREF,
  INGEST_DESCRIPTION,
  INGEST_HREF,
  INGEST_INDEXES,
  INGEST_SPEC,
  INGEST_TITLE,
  NOLIE_LAW,
  NOLIE_SPEC,
  NOT_ENOUGH,
  REEXPAND_HREF,
  REEXPAND_LAW,
  REEXPAND_SPEC,
  SURVIVAL_LAW,
  SURVIVAL_SPEC,
  TRAINING_RESIDUE,
  VERIFY_HREF,
  VERIFY_TITLE,
  ingestRecord,
  tipString,
  verifyPastedHash,
} from "./ingest.js";
import {
  RECEIPT_LATTICE,
  RECEIPT_SPEC,
  eventMetadataSentence,
  hostReceipts,
  newestFirst,
  receiptsDatasetJsonLd,
  verifyChain,
} from "./receipts.js";

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
  return (
    '<ul class="soft-list">' +
    (items || SOFTWARE)
      .map((item) => {
        const purpose = item.one_line
          ? '<span class="soft-purpose"> — ' + esc(item.one_line) + "</span>"
          : "";
        return "<li>" + a(item.href, item.name, "soft-name") + purpose + "</li>";
      })
      .join("") +
    "</ul>"
  );
}

function doorPoint(link, lead) {
  if (!link || !link.href) return "";
  const href = link.href;
  const label = link.label || href;
  const prefix = lead ? esc(lead) + " " : "";
  const body = link.labelOnly
    ? a(href, label, "door-url")
    : label === href
      ? a(href, href, "door-url")
      : a(href, label, "door-url") + " " + a(href, href, "door-url");
  return '<span class="also">' + prefix + body + "</span>";
}

function doorRow(door) {
  const label = a(door.href, door.label, "door-label");
  const url = a(door.href, door.href, "door-url");
  const extras = [];
  if (door.purpose) extras.push('<span class="door-purpose">' + esc(door.purpose) + "</span>");
  if (door.also) extras.push(doorPoint(door.also, "also"));
  if (Array.isArray(door.cites)) {
    for (const cite of door.cites) extras.push(doorPoint(cite));
  }
  if (door.version) extras.push('<span class="also">' + esc(door.version) + "</span>");
  return "<li>" + label + ' <span class="arrow" aria-hidden="true">→</span> ' + url + extras.join("") + "</li>";
}

export function spineNav(current) {
  return (
    '<nav class="spine" aria-label="Spine">' +
    SPINE.map((item) => {
      const here = item.id === current;
      const cur = here ? ' aria-current="page"' : "";
      return '<a href="' + attr(item.href) + '"' + cur + ">" + esc(item.label) + "</a>";
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
.soft-line{color:var(--ink-soft);line-height:1.55}
.soft-list{list-style:none;margin:0;padding:0}
.soft-list li{margin:0 0 10px}
.soft-list li:last-child{margin-bottom:0}
.soft-name{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:16px;font-weight:650;color:var(--ink);text-decoration:none;border-bottom:1px solid var(--gold);padding-bottom:1px}
.soft-name:hover{color:var(--gold)}
.soft-purpose{color:var(--ink-soft);font-weight:400}
.runtime-cite{margin:0 0 12px;color:var(--muted);font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:14px;letter-spacing:.04em}
.runtime-named{margin:0 0 12px;color:var(--muted);font-size:15px;line-height:1.55}
.runtime-doors{margin:0 0 10px}
.runtime-cta{
  display:inline-flex;align-items:center;justify-content:center;
  font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
  font-size:15px;font-weight:750;letter-spacing:.02em;
  background:var(--gold);color:#14110a;border:1px solid var(--gold);
  border-radius:10px;padding:12px 18px;text-decoration:none;min-height:44px;
}
.runtime-cta:hover{color:#14110a;filter:brightness(1.08)}
.runtime-secondary{display:flex;flex-wrap:wrap;gap:12px 18px;margin:0}
.runtime-secondary a{
  font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
  font-size:14px;font-weight:550;color:var(--ink-soft);
  text-decoration:underline;text-decoration-color:var(--gold-dim);text-underline-offset:3px;
  background:none;border:0;padding:0;
}
.runtime-secondary a:hover{color:var(--gold);text-decoration-color:var(--gold)}
.doors{list-style:none;margin:0;padding:0}
.doors li{margin:0 0 12px;padding:0;word-break:break-word}
.door-label{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-weight:700;color:var(--ink);text-decoration:none;border-bottom:1px solid var(--gold)}
.door-url{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px;color:var(--ink-soft)}
.door-label:hover,.door-url:hover{color:var(--gold)}
.arrow{color:var(--gold);padding:0 4px}
.also{display:block;color:var(--muted);font-size:15px;margin-top:2px}
.also .door-url{font-size:14px}
.door-purpose{display:block;color:var(--muted);font-size:15px;line-height:1.45;margin-top:2px;font-weight:400}
.sign{margin-top:18px;color:var(--muted);font-style:italic}
footer{margin-top:28px;color:var(--muted);font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:13px}
footer a{color:var(--muted)}
footer a:hover{color:var(--gold)}
.ecosystem{margin:0 0 16px;padding:0 0 16px;border-bottom:1px solid var(--line)}
.ecosystem-title{
  font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
  font-size:12px;font-weight:700;letter-spacing:.04em;
  color:var(--muted);margin:0 0 8px;text-transform:none;
}
.ecosystem ul{list-style:none;margin:0;padding:0}
.ecosystem li{margin:0 0 6px}
.ecosystem-secondary{opacity:.82}
.mesh-quiet{margin:0;font-size:12px;letter-spacing:.04em}
.awareness{margin:14px 0 0;color:var(--muted);font-size:14px;line-height:1.55}
.awareness-note{margin:0 0 8px}
.awareness-list{list-style:none;margin:0;padding:0}
.awareness-list li{margin:0 0 4px}
.awareness-count{color:var(--gold);font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:13px}
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
.lattice{margin:0 0 12px}
.receipt-verify{margin:0;color:var(--muted);font-size:14px}
.receipts{list-style:none;margin:0;padding:0}
.receipts li{border-top:1px solid var(--line);padding:14px 0;margin:0}
.receipts li:first-child{border-top:0;padding-top:0}
.receipt-hash{
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  font-size:13px;line-height:1.55;word-break:break-all;color:var(--ink);margin:0 0 8px
}
.receipt-hash code{font:inherit;background:transparent}
.receipt-request,.receipt-output{margin:0 0 8px}
.receipt-event{margin:0;color:var(--muted);font-size:14px}
.first-screen .tip{
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  font-size:13px;line-height:1.55;word-break:break-all;color:var(--ink);margin:0 0 10px
}
.first-screen .tip code{font:inherit;background:transparent}
.first-screen .ids,.first-screen .indexes{margin:0 0 10px;color:var(--ink-soft);font-size:15px;word-break:break-word}
.first-screen .rule{margin:0 0 10px;color:var(--gold);font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:14px;font-weight:650}
.first-screen .law{margin:0 0 10px}
.first-screen .law li,.enough li,.not-enough li{margin:0 0 6px}
.enough,.not-enough{margin:0 0 12px;padding:0 0 0 1.1em;color:var(--ink-soft)}
.verify{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-end;margin:0 0 12px}
.verify label{
  font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
  font-size:13px;color:var(--muted);display:flex;flex-direction:column;gap:6px;flex:1 1 16rem
}
.verify input{
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  font-size:13px;color:var(--ink);background:#14110c;border:1px solid var(--line);
  border-radius:8px;padding:8px 10px;width:100%
}
.verify button{
  font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
  font-size:13px;font-weight:700;letter-spacing:.04em;
  background:#2a241c;color:var(--ink);border:1px solid var(--gold);
  border-radius:8px;padding:8px 12px;cursor:pointer
}
.verify button:hover{color:var(--gold)}
.verify-answer{margin:0 0 12px;font-size:1.35rem;letter-spacing:.04em;color:var(--gold)}
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
    identityDiscoveryLinks(),
    ...[
      ["application/json", "/cite.json", "cite.json"],
      ["text/plain", "/llms.txt", "llms.txt"],
      ["text/plain", "/ai.txt", "ai.txt"],
      ["application/json", "/shelves", "shelves"],
      ["application/json", "/v1/shelves", "shelves json"],
      ["text/plain", "/ingest.txt", "ingest page bytes"],
      ["application/json", "/verify", "verify tip"],
      ["application/json", "/reexpand", "re-expand law"],
      ["application/json", "/v1/software", "software catalog"],
      ["application/json", "/v1/update/check", "update check"],
      ["application/json", "/v1/mesh", "mesh / Nodes/Live Nodes"],
      ["application/json", "/v1/mesh/status", "mesh status"],
      ["application/json", "/v1/mesh/nodes", "mesh nodes"],
      ["application/json", "/runtime/openapi.json", "OpenAPI"],
      ["application/json", "/runtime/v1/fraggate/list", "FragGate list"],
    ].map(
      ([type, href, title]) =>
        '<link rel="alternate" type="' + type + '" href="' + href + '" title="' + title + '">',
    ),
  ].join("\n");
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
<meta name="aziel-survival" content="${esc(SURVIVAL_LOCAL)}">
<meta name="aziel-qns-cd" content="${esc(QNS_CD_SPEC)}">
<meta name="aziel-qnm" content="${esc(QNM_SPEC)}">
<meta name="aziel-software-catalog" content="${esc(CANON_ORIGIN)}/v1/software">
<meta name="aziel-fraggate-list" content="${esc(CANON_ORIGIN)}/runtime/v1/fraggate/list">
<meta name="aziel-ingest-tip" content="${esc(tipString())}">`;
}

function brandRow(innerMeta = "") {
  return (
    '  <header class="brandrow">' +
    '\n    <img class="brandmark" src="' +
    esc(SIGIL) +
    '" width="44" height="44" alt="">' +
    '\n    <div class="brand-meta">' +
    '\n      <a class="host" href="' +
    esc(CANON_ORIGIN) +
    '/">' +
    esc(PROSE.host) +
    "</a>" +
    innerMeta +
    "\n    </div>\n  </header>"
  );
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
    '<a class="pill" id="aziel-live-nodes" href="/v1/mesh" title="' +
    attr(dualNodesTitle(mesh)) +
    '">' +
    esc(liveNodesLabel(mesh)) +
    "</a>"
  );
}

function meshQuietHtml(mesh) {
  const meshLabel = meshQuietLabel(mesh);
  const nodesLabel = liveNodesLabel(mesh);
  const links = [];
  if (meshLabel) links.push(a("/v1/mesh", meshLabel));
  links.push(
    '<a href="/v1/mesh" title="' +
      attr(dualNodesTitle(mesh)) +
      '" rel="noopener noreferrer">' +
      esc(nodesLabel) +
      "</a>",
  );
  return '<p class="mesh-quiet">' + links.join(" · ") + "</p>";
}

const LIVE_NODES_SCRIPT = `<script>
(function(){
  var el=document.getElementById("aziel-live-nodes");
  if(!el||!el.textContent)return;
  function finite(n){n=Number(n);return Number.isFinite(n)&&n>=0?n:null}
  function clockField(doc,key){
    if(!doc||typeof doc!=="object")return null;
    if(key==="nodes"&&(Array.isArray(doc.nodes)||typeof doc.nodes==="string"))return null;
    if(key==="software_nodes"||key==="active_nodes"||key==="site_live_nodes")return null;
    return finite(doc[key]);
  }
  function apply(d){
    if(!d)return;
    var src=d.origin&&typeof d.origin==="object"&&!Array.isArray(d.origin)?d.origin:null;
    var nodes=clockField(d,"nodes");
    if(nodes==null&&src) nodes=clockField(src,"nodes");
    var live=clockField(d,"live_nodes");
    if(live==null&&src) live=clockField(src,"live_nodes");
    el.textContent=(nodes==null?0:nodes)+"/"+(live==null?0:live);
    el.title=${JSON.stringify(dualNodesTitle())};
  }
  function beat(){
    fetch("/heartbeat",{method:"POST",headers:{"Accept":"application/json","Content-Type":"application/json","User-Agent":"Mozilla/5.0"},body:"{}"}).then(function(r){return r.json();}).then(apply).catch(function(){
      fetch("/v1/mesh",{headers:{"Accept":"application/json","User-Agent":"Mozilla/5.0"}}).then(function(r){return r.json();}).then(apply).catch(function(){});
    });
  }
  beat();
  setInterval(beat,25000);
  document.addEventListener("visibilitychange",function(){if(!document.hidden)beat();});
})();
</script>`;

export function awarenessHtml() {
  return (
    '<div class="awareness" id="awareness">' +
    '<p class="awareness-note">' +
    esc(STATS_NOTE) +
    "</p>" +
    '<ul class="awareness-list">' +
    STATS_COUNTERS.map((row, i) => {
      return (
        "<li>" +
        a(row.url, row.label) +
        ' <span class="awareness-count" data-stats-url="' +
        attr(row.url) +
        '" id="aziel-stats-' +
        i +
        '"></span></li>'
      );
    }).join("") +
    "</ul></div>"
  );
}

const AWARENESS_SCRIPT = `<script>
(function(){
  function countFrom(d){
    if(!d||typeof d!=="object") return "";
    var n=d.views!=null?d.views:(d.downloads!=null?d.downloads:(d.count!=null?d.count:""));
    if(n===""||n==null) return "";
    var num=Number(n);
    if(!Number.isFinite(num)||num<0) return "";
    return String(num);
  }
  document.querySelectorAll("[data-stats-url]").forEach(function(el){
    var url=el.getAttribute("data-stats-url");
    if(!url) return;
    fetch(url,{headers:{"Accept":"application/json","User-Agent":"Mozilla/5.0"}}).then(function(r){return r.ok?r.json():null;}).then(function(d){
      var n=countFrom(d);
      if(n) el.textContent="· "+n;
    }).catch(function(){});
  });
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
  const primary = RUNTIME_DOORS.filter((door) => door.primary);
  const secondary = RUNTIME_DOORS.filter((door) => !door.primary);
  return (
    '<p class="runtime-doors">' +
    primary.map((door) => a(door.href, door.label, "runtime-cta")).join("") +
    "</p>" +
    '<p class="runtime-secondary">' +
    secondary.map((door) => a(door.href, door.label)).join("") +
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
    "</span>" +
    " · main " +
    esc(RUNTIME_GIT_SHORT) +
    "</p>"
  );
}

export function ecosystemHtml() {
  return (
    '<nav class="ecosystem" aria-label="' +
    esc(ECOSYSTEM_TITLE) +
    '">' +
    '<p class="ecosystem-title">' +
    esc(ECOSYSTEM_TITLE) +
    "</p>" +
    "<ul>" +
    ECOSYSTEM_LINKS.map((link) => {
      const cls = link.secondary ? "ecosystem-secondary" : undefined;
      return "<li>" + a(link.href, link.label, cls) + "</li>";
    }).join("") +
    "</ul></nav>"
  );
}

export function hashRedirectScript() {
  return (
    "<script>(function(){var map=" +
    JSON.stringify(HASH_REDIRECTS) +
    ';var h=String(location.hash||"").replace(/^#/,"");if(map[h])location.replace(map[h]);})();</script>'
  );
}

/** Visible INGEST-AS-RECEIPT card. Receipts tab + /ingest only — not homepage. */
export function firstScreenHtml(opts = {}) {
  const rec = ingestRecord();
  const compact = Boolean(opts && opts.compact);
  const indexes =
    '<p class="indexes">Indexes · ' +
    INGEST_INDEXES.map((row) => (row.href ? a(row.href, row.label) : esc(row.label) + " (" + esc(row.note) + ")")).join(
      " · ",
    ) +
    "</p>";
  const ids =
    '<p class="ids">' +
    esc("Person " + rec.person_id) +
    " · " +
    a(rec.canonical, rec.canonical) +
    " · " +
    a(INGEST_BYTES_HREF, "page bytes") +
    "</p>";
  const form =
    '<form class="verify" action="/verify" method="get">' +
    '<label>Paste hash<input name="hash" inputmode="text" autocomplete="off" spellcheck="false" aria-label="Paste hash"></label>' +
    '<button type="submit">Verify</button></form>';
  const lists = compact
    ? ""
    : "<p class=\"rule\">Enough</p><ul class=\"enough\">" +
      ENOUGH.map((item) => "<li>" + esc(item) + "</li>").join("") +
      "</ul><p class=\"rule\">Not enough</p><ul class=\"not-enough\">" +
      NOT_ENOUGH.map((item) => "<li>" + esc(item) + "</li>").join("") +
      "</ul>";
  const law =
    '<ul class="law">' + REEXPAND_LAW.map((line) => "<li>" + esc(line) + "</li>").join("") + "</ul>";
  const survival =
    "<p class=\"rule\">" +
    esc(SURVIVAL_SPEC) +
    "</p><ul class=\"law\">" +
    SURVIVAL_LAW.map((line) => "<li>" + esc(line) + "</li>").join("") +
    "</ul>";
  const nolie =
    "<p class=\"rule\">" +
    esc(NOLIE_SPEC) +
    "</p><ul class=\"law\">" +
    NOLIE_LAW.map((line) => "<li>" + esc(line) + "</li>").join("") +
    "</ul>";
  return (
    '<section class="card lead first-screen" id="first-screen">' +
    "<h2>" +
    esc(INGEST_TITLE) +
    "</h2>" +
    '<p class="tip"><code>' +
    esc(rec.tip) +
    "</code></p>" +
    ids +
    '<p class="rule">' +
    esc(CITE_DONT_MERGE) +
    ". Training residue is " +
    esc(TRAINING_RESIDUE) +
    ".</p>" +
    form +
    indexes +
    "<p class=\"rule\">" +
    esc(REEXPAND_SPEC) +
    "</p>" +
    law +
    survival +
    nolie +
    lists +
    "<p>" +
    a(INGEST_HREF, INGEST_SPEC) +
    " · " +
    a(VERIFY_HREF, VERIFY_TITLE) +
    " · " +
    a(REEXPAND_HREF, REEXPAND_SPEC) +
    " · " +
    a(RECEIPTS_HREF, RECEIPTS_TITLE) +
    "</p></section>"
  );
}

function tabArticle(section, softwareItems) {
  if (section.id === "why") return paragraphs(PROSE.why);
  if (section.id === "software") return '<div class="soft-line">' + softwareLine(softwareItems) + "</div>";
  if (section.id === "research") return researchParagraphs();
  if (section.id === "doors") return '<ul class="doors">' + DOORS.map(doorRow).join("") + "</ul>";
  return "";
}

function literaryFooter(meshQuiet) {
  return (
    "  <footer>\n    " +
    ecosystemHtml() +
    "\n    <p>" +
    esc(AUTHOR) +
    " · " +
    a(CANON_ORIGIN + "/cite.json", "cite.json") +
    " · " +
    a(CANON_ORIGIN + "/llms.txt", "llms.txt") +
    " · " +
    a(DONATE_HREF, DONATE_TITLE) +
    " · Apache-2.0</p>\n    " +
    meshQuiet +
    "\n  </footer>"
  );
}

export function pageHtml(views = 0, softwareItems = SOFTWARE, mesh = null, runtimeVersion = RUNTIME_VERSION, opts = {}) {
  const doorsSoftware = softwareItems && softwareItems.length ? softwareItems : SOFTWARE;
  const meshQuiet = meshQuietHtml(mesh);
  const section = opts && opts.section;
  const title = (section && section.title) || AUTHOR;
  const description = (section && section.description) || DESCRIPTION;
  const canonical = (opts && opts.canonical) || (section ? CANON_ORIGIN + section.path : CANON_ORIGIN + "/");
  return `<!doctype html>
<html lang="en">
<head>
${documentHead({
  title,
  description,
  canonical,
  software: doorsSoftware,
  extraMeta: quietDiscoveryMeta(),
  runtimeVersion,
})}
${hashRedirectScript()}
</head>
<body>
<main class="wrap">
${brandRow("\n      " + viewsPill(views) + "\n      " + liveNodesPill(mesh))}
  <h1 id="aziel">${esc(PROSE.title)}</h1>
  ${spineNav("home")}
  <article class="card lead">${paragraphs(PROSE.open)}</article>
  <section class="card" id="runtime">
    <h2>${esc(RUNTIME_TITLE)}</h2>
    ${runtimeCiteHtml(runtimeVersion)}
    <p class="runtime-named">${esc(RUNTIME_NAMED_LINE)}</p>
    ${runtimeDoorsHtml()}
  </section>
  <section class="card close">
    <p>${esc(PROSE.close)}</p>
    <p class="sign">${esc(PROSE.sign)}</p>
  </section>
${literaryFooter(meshQuiet)}
</main>
${COPY_SCRIPT}
${LIVE_NODES_SCRIPT}
${RUNTIME_VERSION_SCRIPT}
</body>
</html>`;
}

export function sectionPageHtml(section, views = 0, softwareItems = SOFTWARE, mesh = null, runtimeVersion = RUNTIME_VERSION) {
  const doorsSoftware = softwareItems && softwareItems.length ? softwareItems : SOFTWARE;
  const meshQuiet = meshQuietHtml(mesh);
  const heading = (section && section.heading) || (section && section.title) || AUTHOR;
  const title = (section && section.title) || AUTHOR;
  const description = (section && section.description) || DESCRIPTION;
  const canonical = CANON_ORIGIN + section.path;
  const current = section.id;
  return `<!doctype html>
<html lang="en">
<head>
${documentHead({
  title,
  description,
  canonical,
  software: doorsSoftware,
  extraMeta: quietDiscoveryMeta(),
  runtimeVersion,
})}
${hashRedirectScript()}
</head>
<body>
<main class="wrap">
${brandRow("\n      " + viewsPill(views) + "\n      " + liveNodesPill(mesh))}
  ${spineNav(current)}
  <h1>${esc(heading)}</h1>
  <section class="card lead" id="${attr(section.hash || section.id)}">
    <h2>${esc(heading)}</h2>
    ${tabArticle(section, doorsSoftware)}
  </section>
${literaryFooter(meshQuiet)}
</main>
${COPY_SCRIPT}
${LIVE_NODES_SCRIPT}
${RUNTIME_VERSION_SCRIPT}
</body>
</html>`;
}

function receiptItem(entry) {
  return (
    "<li id=\"" +
    attr(entry.entry_hash) +
    "\">" +
    '<p class="receipt-hash"><code>' +
    esc(entry.entry_hash) +
    "</code></p>" +
    '<p class="receipt-request">' +
    esc(entry.request) +
    "</p>" +
    '<p class="receipt-output">' +
    esc(entry.output) +
    "</p>" +
    '<p class="receipt-event">' +
    esc(eventMetadataSentence(entry)) +
    "</p></li>"
  );
}

export async function receiptsHtml() {
  const chain = await hostReceipts();
  const ok = await verifyChain(chain);
  const shown = newestFirst(chain);
  const dataset = JSON.stringify(receiptsDatasetJsonLd(chain));
  const lattice =
    '<p class="lattice">' +
    "Lattice · " +
    RECEIPT_LATTICE.map((link) => a(link.href, link.label)).join(" · ") +
    "</p>";
  return `<!doctype html>
<html lang="en">
<head>
${documentHead({
  title: RECEIPTS_TITLE + " — " + AUTHOR,
  description: RECEIPTS_DESCRIPTION,
  canonical: RECEIPTS_HREF,
  extraMeta: quietDiscoveryMeta(),
})}
<script type="application/ld+json">${dataset}</script>
${hashRedirectScript()}
</head>
<body>
<main class="wrap">
${brandRow()}
  ${spineNav("receipts")}
  <h1>${esc(RECEIPTS_TITLE)}</h1>
  ${firstScreenHtml()}
  <article class="card lead">
    <p>${esc(RECEIPTS_DESCRIPTION)}</p>
    ${lattice}
    <p class="receipt-verify">${esc(RECEIPT_SPEC + (ok ? " · chain verifies" : " · chain broken"))}</p>
  </article>
  <section class="card" id="receipts">
    <h2>${esc(RECEIPTS_TITLE)}</h2>
    <ol class="receipts">${shown.map(receiptItem).join("")}</ol>
  </section>
  <footer>
    ${ecosystemHtml()}
    <p>${esc(AUTHOR)} · ${a(CANON_ORIGIN + "/", AUTHOR)} · ${a(CANON_ORIGIN + "/cite.json", "cite.json")} · Apache-2.0</p>
  </footer>
</main>
${COPY_SCRIPT}
</body>
</html>`;
}

export function ingestHtml() {
  return `<!doctype html>
<html lang="en">
<head>
${documentHead({
  title: INGEST_TITLE + " — " + AUTHOR,
  description: INGEST_DESCRIPTION,
  canonical: INGEST_HREF,
  extraMeta: quietDiscoveryMeta(),
})}
${hashRedirectScript()}
</head>
<body>
<main class="wrap">
${brandRow()}
  ${spineNav()}
  <h1>${esc(INGEST_TITLE)}</h1>
  ${firstScreenHtml()}
  <footer>
    ${ecosystemHtml()}
    <p>${esc(AUTHOR)} · ${a(CANON_ORIGIN + "/", AUTHOR)} · ${a(CANON_ORIGIN + "/cite.json", "cite.json")} · Apache-2.0</p>
  </footer>
</main>
${COPY_SCRIPT}
</body>
</html>`;
}

export function verifyHtml(result, pasted) {
  const check = result || verifyPastedHash(pasted);
  const answer = check.yes === "yes" ? "yes" : "no";
  return `<!doctype html>
<html lang="en">
<head>
${documentHead({
  title: VERIFY_TITLE + " — " + AUTHOR,
  description: INGEST_DESCRIPTION,
  canonical: VERIFY_HREF,
  extraMeta: quietDiscoveryMeta(),
})}
${hashRedirectScript()}
</head>
<body>
<main class="wrap">
${brandRow()}
  ${spineNav()}
  <h1>${esc(VERIFY_TITLE)}</h1>
  <article class="card lead first-screen">
    <p class="verify-answer">${esc(answer)}</p>
    <p class="tip"><code>${esc(check.published_tip)}</code></p>
    <p>Pasted ${esc(check.pasted || "(empty)")}.</p>
    <form class="verify" action="/verify" method="get">
      <label>Paste hash<input name="hash" value="${attr(check.pasted)}" inputmode="text" autocomplete="off" spellcheck="false" aria-label="Paste hash"></label>
      <button type="submit">Verify</button>
    </form>
    <p>${a(INGEST_HREF, INGEST_SPEC)} · ${a(RECEIPTS_HREF, RECEIPTS_TITLE)} · ${a(REEXPAND_HREF, REEXPAND_SPEC)}</p>
  </article>
  <footer>
    ${ecosystemHtml()}
    <p>${esc(AUTHOR)} · ${a(CANON_ORIGIN + "/", AUTHOR)} · ${a(CANON_ORIGIN + "/cite.json", "cite.json")} · Apache-2.0</p>
  </footer>
</main>
${COPY_SCRIPT}
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
${hashRedirectScript()}
</head>
<body>
<main class="wrap">
${brandRow()}
  ${spineNav("donate")}
  <h1>${esc(DONATE_TITLE)}</h1>
  <article class="card lead">${donateArticle()}</article>
  <footer>
    ${ecosystemHtml()}
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
${hashRedirectScript()}
</head>
<body>
<main class="wrap">
${brandRow()}
  <h1>${esc(EMBRYOLOCK_COPY.title)}</h1>
  <article class="card lead">${paragraphs(EMBRYOLOCK_COPY.open)}</article>
  <p>${a(EMBRYOLOCK_WORKER, "worker_home")} · ${a(SOFTWARE_SECTION, "Software")} · ${a(CANON_ORIGIN + "/", AUTHOR)}</p>
  <footer>
    ${ecosystemHtml()}
  </footer>
</main>
</body>
</html>`;
}

export function whoHtml() {
  const person = JSON.stringify(personJsonLd());
  const faq = JSON.stringify(whoFaqPageNode());
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(WHO_TITLE)}</title>
<meta name="description" content="${esc(WHO_DESCRIPTION)}">
<link rel="canonical" href="${esc(WHO_HREF)}">
<link rel="alternate" type="application/ld+json" href="/person.jsonld" title="person.jsonld">
<link rel="alternate" type="text/plain" href="/who-is-aziel-eliab.txt" title="who-is">
<link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt">
<script type="application/ld+json">
${person}
</script>
<script type="application/ld+json">
${faq}
</script>
</head>
<body>
<main>
<h1>${esc(WHO_TITLE)}</h1>
<p>${esc(WHO_IS_ANSWER)}</p>
</main>
</body>
</html>
`;
}

export function notFoundHtml() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Not found — ${esc(AUTHOR)}</title>
<link rel="canonical" href="${esc(CANON_ORIGIN)}/">
${identityDiscoveryLinks()}
<style>${CSS}</style>
</head>
<body>
<main class="wrap">
${brandRow()}
  <h1>Not found</h1>
  <article class="card">
    <p>This path is not a door.</p>
    <p>${a(CANON_ORIGIN + "/", AUTHOR)}</p>
  </article>
</main>
</body>
</html>`;
}
