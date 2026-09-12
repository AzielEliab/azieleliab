# azieleliab.com

Public landing for **Aziel Eliab**.

You don’t get to know me. You get to understand the work.

Identity is **Aziel Eliab** only. Also known as Aziel Elroi Eliab (`alternateName` / aka only). Apache-2.0.

Canonical: [https://www.azieleliab.com/](https://www.azieleliab.com/)  
Apex `https://azieleliab.com/` 301s to www.

GitHub About (Google + AI crawlers): homepage **https://www.azieleliab.com/** — apply description and topics from [docs/github-seo.md](docs/github-seo.md).

## Identity / entity graph

Locked `@id`s on the www host (never apex; never `#aziel-eliab`):

| Node | `@id` |
|------|-------|
| Person | [https://www.azieleliab.com/#aziel](https://www.azieleliab.com/#aziel) |
| WebSite | [https://www.azieleliab.com/#website](https://www.azieleliab.com/#website) |
| Runtime parent | [https://www.azieleliab.com/runtime#runtime](https://www.azieleliab.com/runtime#runtime) |

Person `sameAs` only: [GitHub profile](https://github.com/AzielEliab), [Glama listing](https://glama.ai/mcp/servers/AzielEliab/aziel-runtime) (owner/repo path — no invented UUIDs), [Corpus Library](https://www.azielcorpuslibrary.net/), [GodLock](https://godlock.uk/), [He Didn't Jump](https://www.hedidntjump.com/). Project URLs stay on `author` / `creator` / `sourceCode` / `isPartOf`.

Runtime `SoftwareApplication` `sameAs`: [AzielEliab/aziel-runtime](https://github.com/AzielEliab/aziel-runtime) + [Try on Glama](https://glama.ai/mcp/servers/AzielEliab/aziel-runtime). Worker origin is `relatedLink` / endpoint, not the identity page. Version cite **2.0.0-rc1**.

`hasPart` is **named tools only** — not MCP ops/methods/verbs. Each child is `https://www.azieleliab.com/runtime#<slug>`:

FragGate · ForgeReceipts · DecisionGate · TemporalLock · TrajectoryLock · PeaceLock · GodLock · AZ-OS · AZCoherence · 4DMap · Aziel Corpus · Ask Jeeves · AZBrowser · AZMail · AZHub · AZInterface · SpectralLock · ShadowLock · FoldLock · CodeLock · VibeLock

## Ecosystem

Part of the Aziel Eliab ecosystem. Cross-links for humans, Google, and AI crawlers:

| Surface | URL |
|---------|-----|
| Official site | [https://www.azieleliab.com/](https://www.azieleliab.com/) |
| Corpus | [https://www.azielcorpuslibrary.net/](https://www.azielcorpuslibrary.net/) · [Aziel Eliab](https://www.azielcorpuslibrary.net/AzielEliab) · [Software](https://www.azielcorpuslibrary.net/software) · [Runtime front door](https://www.azielcorpuslibrary.net/runtime) |
| GodLock | [https://godlock.uk/](https://godlock.uk/) · [Aziel Eliab](https://godlock.uk/AzielEliab) · [repo](https://github.com/AzielEliab/godlock) |
| He Didn't Jump | [https://www.hedidntjump.com/](https://www.hedidntjump.com/) |
| aziel-runtime **2.0.0-rc1** | [GitHub](https://github.com/AzielEliab/aziel-runtime) · [Official Runtime](https://aziel-runtime.vibelock.workers.dev/) · [docs/2.0](https://github.com/AzielEliab/aziel-runtime/tree/main/docs/2.0) |
| Try on Glama | [https://glama.ai/mcp/servers/AzielEliab/aziel-runtime](https://glama.ai/mcp/servers/AzielEliab/aziel-runtime) (primary Runtime CTA; verified listing) |
| Donate AZL-DONATE-1.0 | [https://www.azieleliab.com/donate](https://www.azieleliab.com/donate) |

## Compatible AI clients

ChatGPT (GPT Actions / OpenAI), Grok (xAI), Venice, Claude (Anthropic Desktop / custom tools), Cursor (MCP), Glama (Install Server / MCP), Perplexity, Microsoft Copilot / Bing, Google Gemini / Vertex AI, Mistral, Meta AI, Apple Intelligence / Applebot surfaces, Amazon Q / Amazonbot tooling, DuckAssist / DuckDuckGo AI, You.com, Cohere, plus other MCP/OpenAPI-capable assistants.

Always send `User-Agent: Mozilla/5.0`. MCP: `POST https://www.azieleliab.com/runtime/mcp`. OpenAPI: https://www.azieleliab.com/runtime/openapi.json

## Worker

Cloudflare Worker `azieleliab-com` serves the literary landing, crawl files, and a quiet same-origin `/runtime` door for AI clients:

| Path | What |
|------|------|
| `/` | Landing (black / gold / white) |
| `/software` · `/software/` | 301 to [`/#software`](https://www.azieleliab.com/#software) (homepage Software strip; same HTML as home) |
| `/about` · `/AzielEliab` · `/aziel-eliab` | 301 to [`/`](https://www.azieleliab.com/) (About Aziel Eliab is the homepage) |
| `/donate` · `/donate/` | AZL-DONATE-1.0 primary Donate door (static; also homepage `#donate`). Bare `/donate` 302s to `/donate?v=png` so CF edge cannot keep the old stroke-SVG HTML. Door HTML is `no-store`. Rails use solid PNG QRs at `/donate/qr/{btc,eth,ltc,xrp,doge}.png` (payment URI, not a website). |
| `/embryolock` · `/embryolock/` | EmbryoLock secondary local page (Softwares door is catalog `worker_home`) |
| `/sigil.png` | Hosted Everblooming sigil (Donate / brandrow do not fetch the corpus) |
| `/robots.txt` | `Allow: /` plus AI crawlers and `/runtime` |
| `/llms.txt` | Door index for models |
| `/ai.txt` | Crawl policy |
| `/cite.json` | Citation record |
| `/sitemap.xml` | Canonical urlset |
| `/runtime` · `/runtime/*` | Same-origin aziel-runtime / FragGate proxy (AI background) |
| `GET /runtime/v1/uses` | This host's `/runtime` API use stats (local KV; not proxied) |
| `GET /v1/stats` | Pageviews (no increment) |
| `GET /v1/view` | Same as stats |
| `POST /v1/view` | Increment pageviews |
| `GET /v1/software` | Resolved Softwares catalog (`products` enriched from aziel-runtime; `extras` for FragGate / mesh / aziel-runtime; short edge TTL). Runtime version cite is **2.0.0-rc1** (or live `/v1/health`) |
| `GET /v1/update` · `/v1/update/check` | Quiet installer pointer at runtime `/v1/update/check` |
| `GET /v1/mesh/status` · `/v1/mesh/nodes` | Suite node mesh (read-only suite presence is on; display from runtime) |

JSON-LD: `Person` `@id` `https://www.azieleliab.com/#aziel` (Aziel Eliab; `alternateName` Aziel Elroi Eliab; `sameAs` GitHub profile, Glama listing, Corpus Library, GodLock, He Didn't Jump — no invented Glama UUIDs) + `WebSite` `#website` (publisher/creator Person) + `AboutPage` + Runtime parent `SoftwareApplication` `@id` `https://www.azieleliab.com/runtime#runtime` (`hasPart` named tools only — not MCP ops; Worker is related/endpoint; `sameAs` GitHub repo + Glama) + one named-tool `SoftwareApplication` per Runtime component (`/runtime#<slug>`) + Software `ItemList` / `CollectionPage` + one catalog `SoftwareApplication` per Softwares name + Donate `WebPage` / `DonateAction`. Homepage title stays **Aziel Eliab**. Canonical host is always `https://www.azieleliab.com/` (self-referencing only). Softwares is the homepage `#software` strip (`/software` 301s there). Footer chrome: **Part of the Aziel Eliab ecosystem**. Donate canonical is `/donate?v=png`. hreflang `en` + `x-default` point at each page’s www canonical.

### Research

First-class Research door → [https://www.azielcorpuslibrary.net/](https://www.azielcorpuslibrary.net/) (also the AzielEliab library page). The research corpus lives there.

### Same-origin `/runtime`

Background / AI-facing only. Proxies aziel-runtime (service binding `AZIEL_RUNTIME`, else `https://aziel-runtime.vibelock.workers.dev`) for GET/HEAD/POST/OPTIONS. Rewrites origin URLs under `https://www.azieleliab.com/runtime/...`. Does **not** inject human site chrome into proxied HTML.

Discovery:

- OpenAPI: https://www.azieleliab.com/runtime/openapi.json
- MCP: `POST https://www.azieleliab.com/runtime/mcp`
- Skill: https://www.azieleliab.com/runtime/v1/skill
- Uses (this host): https://www.azieleliab.com/runtime/v1/uses
- Mesh status: https://www.azieleliab.com/runtime/v1/mesh/status
- Mesh nodes: https://www.azieleliab.com/runtime/v1/mesh/nodes

Same JSON also lives at same-origin `/v1/mesh/status` and `/v1/mesh/nodes` (Software door). Both fetch `https://aziel-runtime.vibelock.workers.dev/v1/mesh/status` and `/v1/mesh/nodes` via service binding `AZIEL_RUNTIME` (HTTPS origin fallback). **Read-only suite presence is on** — display from runtime. A 404 or missing origin still returns identity Aziel Eliab with `live_nodes: 0` (brandrow/footer show `Live Nodes · 0`; they omit the quiet mesh label rather than an off-state string). VPN/hop mesh is not claimed. **GET never enables.** Operator enable on runtime requires a declared bearer (example: `suite-presence`). The landing brandrow shows a Digital Library–style `Live Nodes · N` pill fed from origin `live_nodes` (QNM-BUILD-1.0 rollup). The footer keeps the quiet `mesh on` link when runtime reports enabled, and omits that quiet label when status is unavailable. OpenAPI / cite / llms list the paths. Not Node Gate. Softwares list rules unchanged.

Outbound proxy requests are stamped `X-Aziel-Runtime-Via: azieleliab.com` and `X-Aziel-Runtime-Host: www.azieleliab.com` so origin can attribute the hop if it has a uses store.

### `/runtime` API uses

Host-local tracker so uses through `www.azieleliab.com/runtime` are logged here even before/alongside origin. **Reuses the existing `VIEWS` KV** with key prefix `runtime_uses|` (`total`, `by_path`, `recent`) — no new `RUNTIME_USES` namespace.

- Tracked: `/runtime/v1/*` mutations, plus `fraggate` / `mcp` / `session` / `pull`.
- Skipped: robots, sitemap, llms, ai, cite, static; `GET /runtime/v1/uses`; `GET` health/ready; `GET` mesh status/nodes.
- Ring log: last 80 events (`path`, `method`, `status`, `at`). No bodies or tokens.
- `GET /runtime/v1/uses` is intercepted locally and returns `{ ok, host: "www.azieleliab.com", via: "azieleliab.com", uses, by_path, recent, author: "Aziel Eliab" }`. Origin `/v1/uses` is attached as `origin` when the service binding answers (best-effort).

### Pageviews

Counted in Cloudflare KV (`VIEWS`, key `views`). Same spirit as the GitBaby counted `/download` Workers.

- Serving `GET /` increments **once** for a non-bot `User-Agent` and prints the new count in a gold pill.
- Known crawlers (empty UA, GPTBot, Googlebot-family, curl, etc.) are read-only.
- `GET /v1/stats` and `GET /v1/view` return `{ ok, views, product: "azieleliab", author: "Aziel Eliab" }` without incrementing.
- `POST /v1/view` increments and returns the same JSON.
- JSON APIs send `Access-Control-Allow-Origin: *`.
- The isolate remembers the last count so a warm increment is a single `put` (no extra `get`). Counts are never invented.
- Cached HTML may show a slightly stale pill; humans are still counted on each Worker `GET /`.

Local `wrangler dev` uses a simulated KV. The count is monotonic and not atomic under heavy concurrent writes — honest enough for a landing.

### Edge cache and cost

Public HTML and crawl files used to send `Cache-Control: no-store`, so every repeat visit and crawler re-ran the Worker catalog fetch. That is the KV / subrequest bill, not “too many humans reading.”

- Landing HTML: `public` + short `s-maxage` (`max-age=0`) so title/meta/JSON-LD stay fresh for crawlers. The packed Software catalog snapshot is separate and still auto-refreshes. Body copy and Software doors stay the same.
- Donate HTML (`/donate?v=png`): `no-store, max-age=0, must-revalidate`. Bare `/donate` 302s to `?v=png` so a stale CF HIT of stroke-SVG HTML cannot stick.
- `/robots.txt`, `/llms.txt`, `/ai.txt`, `/cite.json`, `/sitemap.xml`: long public cache, full documents, never throttled.
- Live Software catalog is **one packed snapshot** (Cache API + KV key `software:catalog:v2` on the existing `VIEWS` namespace). Warm HIT does not fetch runtime. Static `SOFTWARE` remains last resort.
- Soft caps on `/v1/update/check` and mesh origin refresh apply only when someone hammers those fan-out doors after the snapshot is cold. They return the last full JSON (or the quiet pointer / Live Nodes · 0 body) — not a soft-404, login wall, or thin page. **Rate limit here means cost/abuse protection, not content rationing.**
- Optional `OPERATOR_TOKEN` (header `X-Aziel-Runtime-Token` or `Authorization: Bearer`) is uncapped. Do not add Node Gate / IP UI.

New catalog products appear within the short snapshot TTL — no hand edit of this repo.

### Deploy

Live deploys are **GitBaby / Cursor wrangler OAuth** (Aziel Eliab). That is the primary path.

Push to `main` runs `.github/workflows/deploy.yml`: `npm ci` and `npm test` always. `wrangler deploy` is an optional Actions backup and runs only when `CLOUDFLARE_API_TOKEN` is set (account `ac575a9b822bea2bed97d0ab73aed238`). A missing token skips deploy and does not fail the workflow. No tokens live in the repo.

```bash
npm install
npm test
npx wrangler deploy
```

Local:

```bash
npx wrangler dev
```

Parent attaches custom domains on deploy. Expected hostnames:

- `azieleliab.com`
- `www.azieleliab.com`

## Software doors

The Software strip (and `/v1/software`, cite, llms, sitemap) prefers the **live** aziel-runtime catalog: packed snapshot first (Cache API / `software:catalog:v2`), then `GET https://aziel-runtime.vibelock.workers.dev/v1/software`, then `GET /v1/fraggate/list`. Same-account service binding `AZIEL_RUNTIME` is tried first. A static slug list remains only as last-resort fallback so the page still renders if runtime is down. New catalog products appear within the snapshot TTL — no hand edit of this repo. Under the Software heading the page lists only those names — no closer, blurb, or other filler. `GET /v1/software` keeps catalog fields (`status`, `worker_home`, `version`, `one_line` at minimum) on `products[]`. FragGate and mesh are `extras` only — not Softwares product cards. The product is **aziel-runtime** / **Aziel Runtime**; Software blurbs and meta never mash it as “runtime 1.6.x FragGate”. Version cite is **2.0.0-rc1** (or live `GET /v1/health`). SEO abstract still leads. Softwares UI is heading → list only — Runtime distribution buttons live in the `#runtime` card, not under Software.

Preference for each door: live `worker_home` when present, else the download-tracker Worker, else GitHub, else the Digital Library software hub. EmbryoLock Softwares link is catalog `worker_home` (`https://embryolock-download-tracker.vibelock.workers.dev/`). `/embryolock` is a clearly secondary local page. AZBrowser, AZHub, AZInterface, AZNet, and FragGate are separate apps (separate Worker UIs). Never nest. AZHub (Blank Key, AIH-WP-1.0) and AZInterface (custodial page cycles, AIH-WP-1.0) are two engines — never one combined engine. AZNet + AZBrowser are a functional pair only — AZNet is not nested under AZBrowser. Display order is Plain (name has neither lock nor gate as a product token) A–Z, then Gate A–Z, then Lock A–Z. Clock is not Lock. A name that matches both Gate and Lock sits in Gate. AZBrowser, AZHub, AZInterface, AZMail, and AZNet are Plain. DecisionGATE is Gate. PeaceLock is Lock.

Fallback snapshot (used only when live catalog is unreachable):

| Name | URL |
|------|-----|
| 4DMap | https://4dmap-download-tracker.vibelock.workers.dev/ |
| AZ-CLCE | https://azclce-download-tracker.vibelock.workers.dev/ |
| AZ-OS | https://azos-download-tracker.vibelock.workers.dev/ |
| AZAI | https://azai-download-tracker.vibelock.workers.dev/ |
| AZBot | https://azbot-download-tracker.vibelock.workers.dev/ |
| AZBrowser | https://azbrowser-download-tracker.vibelock.workers.dev/ |
| AZChat | https://azchat-download-tracker.vibelock.workers.dev/ |
| AZCoherence | https://azcoherence-download-tracker.vibelock.workers.dev/ |
| AZHub | https://azhub-download-tracker.vibelock.workers.dev/ |
| Aziel Digital Library | https://www.azielcorpuslibrary.net/ |
| AzielTether | https://azieltether-download-tracker.vibelock.workers.dev/ |
| AZInterface | https://azinterface-download-tracker.vibelock.workers.dev/ |
| AZMail | https://azmail-download-tracker.vibelock.workers.dev/ |
| AZNet | https://aznet-download-tracker.vibelock.workers.dev/ |
| ForgeReceipts | https://forgereceipts-download-tracker.vibelock.workers.dev/ |
| Glossa Filter | https://glossafilter-download-tracker.vibelock.workers.dev/ |
| MirageGrid | https://miragegrid-download-tracker.vibelock.workers.dev/ |
| Post-King Chess | https://postking-download-tracker.vibelock.workers.dev/ |
| StaticClock | https://staticclock-download-tracker.vibelock.workers.dev/ |
| The ARK | https://ark-download-tracker.vibelock.workers.dev/ |
| ZionPattern Solver | https://zsolver-download-tracker.vibelock.workers.dev/ |
| DecisionGATE | https://decisiongate-download-tracker.vibelock.workers.dev/ |
| ChronoLock | https://chronolock-download-tracker.vibelock.workers.dev/ |
| CodeLock | https://codelock-download-tracker.vibelock.workers.dev/ |
| EmbryoLock | https://embryolock-download-tracker.vibelock.workers.dev/ |
| EmployeeLock | https://employeelock-download-tracker.vibelock.workers.dev/ |
| FoldLock | https://foldlock-download-tracker.vibelock.workers.dev/ |
| GodLock | https://godlock-download-tracker.vibelock.workers.dev/ |
| M.I.A.Lock | https://mialock-download-tracker.vibelock.workers.dev/ |
| PeaceLock | https://peacelock-download-tracker.vibelock.workers.dev/ |
| ShadowLock | https://shadowlock-download-tracker.vibelock.workers.dev/ |
| SpectralLock | https://spectrallock-download-tracker.vibelock.workers.dev/ |
| TemporalLock | https://temporallock-download-tracker.vibelock.workers.dev/ |
| TrajectoryLock | https://trajectorylock-download-tracker.vibelock.workers.dev/ |
| VeilLock | https://veillock-download-tracker.vibelock.workers.dev/ |
| VibeLock | https://vibelock-download-tracker.vibelock.workers.dev/ |
| WhistleLock | https://whistlelock-download-tracker.vibelock.workers.dev/ |

EmbryoLock Softwares door is catalog `worker_home` (`https://embryolock-download-tracker.vibelock.workers.dev/`). `/embryolock` remains a secondary local page. FragGate, mesh, and same-origin `aziel-runtime` are extras / doors — not Softwares `products[]` cards. Read-only suite presence is on (display from runtime). GET never enables.

Quiet installer meta: `GET /v1/update/check` (alias `/v1/update`) points at runtime `GET /v1/update/check`. The landing also ships `<meta name="aziel-update-check">`.

Quiet mesh meta: `GET /v1/mesh/status` and `GET /v1/mesh/nodes` (also `/runtime/v1/mesh/status` · `/runtime/v1/mesh/nodes`) point at runtime mesh authority. The landing ships `<meta name="aziel-mesh-status">`, `<meta name="aziel-qns-cd">`, `<meta name="aziel-qnm">` (`QNM-BUILD-1.0`), a brandrow Live Nodes pill, and a muted footer status. `/v1/software` includes a `mesh` snapshot with `live_nodes` and a `extras` mesh cite. **Read-only suite presence is on (display from runtime). GET never enables.** Operator enable requires a declared bearer (example: suite-presence). No Node Gate. No public qnsd proxy. Softwares UI is heading → list only.

### QNS-CD-1.0 hub cite (mesh cross-map)

This host is the **hub cite** surface for **QNS-CD-1.0** (photon QNS1 packet transfer). It is **not** a Softwares-tab product. `src/mesh.js` exports `QNS_CD_SPEC` and `QNS_CD` so peers can see the same coded cross-map on mesh status / Live Nodes / `/cite.json`:

| Cite | Where |
|------|--------|
| Local qnsd (coded) | [AzielEliab/qnm-node](https://github.com/AzielEliab/qnm-node) · [QNM-BUILD-1.0](https://github.com/AzielEliab/qnm-node/blob/main/docs/QNM-BUILD-1.0.md) |
| Runtime cites + catalog field | [AzielEliab/aziel-runtime](https://github.com/AzielEliab/aziel-runtime) · [docs/designs](https://github.com/AzielEliab/aziel-runtime/tree/main/docs/designs) · [QNM-WP-1.0](https://github.com/AzielEliab/aziel-runtime/blob/main/docs/designs/QNM-WP-1.0.md) · [NODE-OPS-1.0](https://github.com/AzielEliab/aziel-runtime/blob/main/docs/designs/NODE-OPS-1.0.md) · [NODE_MESH](https://github.com/AzielEliab/aziel-runtime/blob/main/docs/NODE_MESH.md) · skill [`/v1/skill`](https://aziel-runtime.vibelock.workers.dev/v1/skill) |
| Pair custody | [AzielEliab/azinterface](https://github.com/AzielEliab/azinterface) |

`MESH_NOTE` cites QNS-CD-1.0. Do **not** implement qnsd here. Do **not** add a public proxy. Agent notes: [SKILL.md](SKILL.md).

## Donate

Primary canonical door: [https://www.azieleliab.com/donate](https://www.azieleliab.com/donate) (AZL-DONATE-1.0). Homepage spine: Why / Software / Research / Doors / Donate (`#donate`). Label is **Donate**. Static HTML — no Worker KV, no email capture, no thank-you wall. Rails: BTC, ETH, LTC, XRP, DOGE. Disclaimer: Donations buy no privilege. Signature on this door is `— Aziel`. Site SEO identity remains Aziel Eliab.

## Doors

Every label and URL is hyperlinked.

- GitHub → https://github.com/AzielEliab
- Secondary source → https://github.com/azieltherevealerofthesealed-arch
- Corpus → https://www.azielcorpuslibrary.net/
- Research → https://www.azielcorpuslibrary.net/ · also https://www.azielcorpuslibrary.net/AzielEliab
- GodLock → https://godlock.uk/
- He Didn't Jump → https://www.hedidntjump.com/
- Runtime → https://www.azieleliab.com/runtime · also https://aziel-runtime.vibelock.workers.dev/ (**2.0.0-rc1**)
- Try on Glama → https://glama.ai/mcp/servers/AzielEliab/aziel-runtime (primary Runtime CTA; verified Glama listing for AzielEliab/aziel-runtime — not an invented server id)
- Official Runtime → https://aziel-runtime.vibelock.workers.dev/ (secondary Worker link)
- Source on GitHub → https://github.com/AzielEliab/aziel-runtime
- Documentation / Architecture → https://github.com/AzielEliab/aziel-runtime/tree/main/docs/2.0
- X → https://x.com/azieleliab
- Donate → https://www.azieleliab.com/donate

## Visual

Matches GodLock / Digital Library Workers: `#0e0c09` / `#12100c` ground, `#c9a227` gold trim, white body text, soft-card panels. Not royal-purple body copy. Hosted sigil: https://www.azieleliab.com/sigil.png

## License

Apache License 2.0. Author: Aziel Eliab.
