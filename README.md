# azieleliab.com

Public landing for **Aziel Eliab**.

You don’t get to know me. You get to understand the work.

Identity is **Aziel Eliab** only. Apache-2.0.

Canonical: [https://www.azieleliab.com/](https://www.azieleliab.com/)  
Apex `https://azieleliab.com/` 301s to www.

## Worker

Cloudflare Worker `azieleliab-com` serves the literary landing, crawl files, and a quiet same-origin `/runtime` door for AI clients:

| Path | What |
|------|------|
| `/` | Landing (black / gold / white) |
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

JSON-LD: `Person` + `WebSite` + local Runtime `SoftwareApplication` / `WebAPI`. Canonical is always `https://www.azieleliab.com/`.

### Research

First-class Research door → [https://www.azielcorpuslibrary.net/](https://www.azielcorpuslibrary.net/) (also the AzielEliab library page). The research corpus lives there.

### Same-origin `/runtime`

Background / AI-facing only. Proxies aziel-runtime (service binding `AZIEL_RUNTIME`, else `https://aziel-runtime.vibelock.workers.dev`) for GET/HEAD/POST/OPTIONS. Rewrites origin URLs under `https://www.azieleliab.com/runtime/...`. Does **not** inject human site chrome into proxied HTML.

Discovery:

- OpenAPI: https://www.azieleliab.com/runtime/openapi.json
- MCP: `POST https://www.azieleliab.com/runtime/mcp`
- Skill: https://www.azieleliab.com/runtime/v1/skill
- Uses (this host): https://www.azieleliab.com/runtime/v1/uses

Outbound proxy requests are stamped `X-Aziel-Runtime-Via: azieleliab.com` and `X-Aziel-Runtime-Host: www.azieleliab.com` so origin can attribute the hop if it has a uses store.

### `/runtime` API uses

Host-local tracker so uses through `www.azieleliab.com/runtime` are logged here even before/alongside origin. **Reuses the existing `VIEWS` KV** with key prefix `runtime_uses|` (`total`, `by_path`, `recent`) — no new `RUNTIME_USES` namespace.

- Tracked: `/runtime/v1/*` mutations, plus `fraggate` / `mcp` / `session` / `pull`.
- Skipped: robots, sitemap, llms, ai, cite, static; `GET /runtime/v1/uses`; `GET` health/ready.
- Ring log: last 80 events (`path`, `method`, `status`, `at`). No bodies or tokens.
- `GET /runtime/v1/uses` is intercepted locally and returns `{ ok, host: "www.azieleliab.com", via: "azieleliab.com", uses, by_path, recent, author: "Aziel Eliab" }`. Origin `/v1/uses` is attached as `origin` when the service binding answers (best-effort).

### Pageviews

Counted in Cloudflare KV (`VIEWS`, key `views`). Same spirit as the GitBaby counted `/download` Workers.

- Serving `GET /` increments **once** for a non-bot `User-Agent` and prints the new count in a gold pill.
- Known crawlers (empty UA, GPTBot, Googlebot-family, curl, etc.) are read-only.
- `GET /v1/stats` and `GET /v1/view` return `{ ok, views, product: "azieleliab", author: "Aziel Eliab" }` without incrementing.
- `POST /v1/view` increments and returns the same JSON.
- JSON APIs send `Access-Control-Allow-Origin: *`.

Local `wrangler dev` uses a simulated KV. The count is monotonic and not atomic under heavy concurrent writes — honest enough for a landing.

### Deploy

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

SOFTWARE is the live aziel-runtime catalog (27 products) plus EmbryoLock (library hub), same-origin `aziel-runtime`, and FragGate. Preference: catalog `worker_home`, else GitHub, else the Digital Library software hub. Lumen and PeaceLock are not listed. Display order is Plain (name has neither lock nor gate as a product token) A–Z, then Gate A–Z, then Lock A–Z. Clock is not Lock. A name that matches both Gate and Lock sits in Gate.

| Name | URL |
|------|-----|
| AZ-CLCE | https://azclce-download-tracker.vibelock.workers.dev/ |
| AZ-OS | https://azos-download-tracker.vibelock.workers.dev/ |
| AZAI | https://azai-download-tracker.vibelock.workers.dev/ |
| AZBot | https://azbot-download-tracker.vibelock.workers.dev/ |
| Aziel Digital Library | https://www.azielcorpuslibrary.net/ |
| aziel-runtime | https://www.azieleliab.com/runtime |
| AzielTether | https://azieltether-download-tracker.vibelock.workers.dev/ |
| ForgeReceipts | https://forgereceipts-download-tracker.vibelock.workers.dev/ |
| Glossa Filter | https://glossafilter-download-tracker.vibelock.workers.dev/ |
| MirageGrid | https://miragegrid-download-tracker.vibelock.workers.dev/ |
| Post-King Chess | https://postking-download-tracker.vibelock.workers.dev/ |
| StaticClock | https://staticclock-download-tracker.vibelock.workers.dev/ |
| The ARK | https://ark-download-tracker.vibelock.workers.dev/ |
| ZionPattern Solver | https://zsolver-download-tracker.vibelock.workers.dev/ |
| DecisionGATE | https://decisiongate-download-tracker.vibelock.workers.dev/ |
| FragGate | https://github.com/AzielEliab/fraggate |
| ChronoLock | https://chronolock-download-tracker.vibelock.workers.dev/ |
| CodeLock | https://codelock-download-tracker.vibelock.workers.dev/ |
| EmbryoLock | https://www.azielcorpuslibrary.net/software |
| EmployeeLock | https://employeelock-download-tracker.vibelock.workers.dev/ |
| FoldLock | https://foldlock-download-tracker.vibelock.workers.dev/ |
| GodLock | https://godlock-download-tracker.vibelock.workers.dev/ |
| M.I.A.Lock | https://mialock-download-tracker.vibelock.workers.dev/ |
| ShadowLock | https://shadowlock-download-tracker.vibelock.workers.dev/ |
| SpectralLock | https://spectrallock-download-tracker.vibelock.workers.dev/ |
| TemporalLock | https://temporallock-download-tracker.vibelock.workers.dev/ |
| TrajectoryLock | https://trajectorylock-download-tracker.vibelock.workers.dev/ |
| VeilLock | https://veillock-download-tracker.vibelock.workers.dev/ |
| VibeLock | https://vibelock-download-tracker.vibelock.workers.dev/ |
| WhistleLock | https://whistlelock-download-tracker.vibelock.workers.dev/ |

EmbryoLock has no public repo or download-tracker. The name stays visible and points at the corpus software hub.

## Doors

Every label and URL is hyperlinked.

- GitHub → https://github.com/AzielEliab
- Secondary source → https://github.com/azieltherevealerofthesealed-arch
- Corpus → https://www.azielcorpuslibrary.net/
- Research → https://www.azielcorpuslibrary.net/ · also https://www.azielcorpuslibrary.net/AzielEliab
- GodLock → https://godlock.uk/
- Runtime → https://www.azieleliab.com/runtime · also https://aziel-runtime.vibelock.workers.dev/
- X → https://x.com/azieleliab

## Visual

Matches GodLock / Digital Library Workers: `#0e0c09` / `#12100c` ground, `#c9a227` gold trim, white body text, soft-card panels. Not royal-purple body copy. Optional sigil: https://www.azielcorpuslibrary.net/sigil.png

## License

Apache License 2.0. Author: Aziel Eliab.
