# azieleliab.com

Public landing for **Aziel Eliab**.

You don’t get to know me. You get to understand the work.

Identity is **Aziel Eliab** only. Apache-2.0.

Canonical: [https://www.azieleliab.com/](https://www.azieleliab.com/)  
Apex `https://azieleliab.com/` 301s to www.

## Worker

Cloudflare Worker `azieleliab-com` serves the literary landing and crawl files:

| Path | What |
|------|------|
| `/` | Landing (black / gold / white) |
| `/robots.txt` | `Allow: /` plus AI crawlers |
| `/llms.txt` | Door index for models |
| `/ai.txt` | Crawl policy |
| `/cite.json` | Citation record |
| `/sitemap.xml` | Canonical urlset |
| `GET /v1/stats` | Pageviews (no increment) |
| `GET /v1/view` | Same as stats |
| `POST /v1/view` | Increment pageviews |

JSON-LD: `Person` + `WebSite`. Canonical is always `https://www.azieleliab.com/`.

### Pageviews

Counted in Cloudflare KV (`VIEWS`, key `views`). Same spirit as the GitBaby counted `/download` Workers.

- Serving `GET /` increments **once** for a non-bot `User-Agent` and prints the new count in a gold pill.
- Known crawlers (empty UA, GPTBot, Googlebot-family, curl, etc.) are read-only.
- `GET /v1/stats` and `GET /v1/view` return `{ ok, views, product: "azieleliab", author: "Aziel Eliab" }` without incrementing.
- `POST /v1/view` increments and returns the same JSON.
- JSON APIs send `Access-Control-Allow-Origin: *`.

Create the production namespace, then put the id in `wrangler.toml`:

```bash
npx wrangler kv namespace create VIEWS
```

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

Routes are documented (commented) in `wrangler.toml`. Uncomment `[[routes]]` with `custom_domain = true` only when the zone lives in the same Cloudflare account as this Worker.

## Software doors

Each SOFTWARE name on the page is a hyperlink. Preference: counted download-tracker homepage, else GitHub, else the Digital Library software hub.

| Name | URL |
|------|-----|
| ForgeReceipts | https://forgereceipts-download-tracker.vibelock.workers.dev/ |
| TemporalLock | https://temporallock-download-tracker.vibelock.workers.dev/ |
| EmbryoLock | https://www.azielcorpuslibrary.net/software |
| ARK | https://ark-download-tracker.vibelock.workers.dev/ |
| AZ-OS | https://azos-download-tracker.vibelock.workers.dev/ |
| AZAI | https://azai-download-tracker.vibelock.workers.dev/ |
| Lumen | https://www.azielcorpuslibrary.net/software |
| GodLock | https://godlock.uk/ |
| aziel-runtime | https://aziel-runtime.vibelock.workers.dev/ |
| FragGate | https://github.com/AzielEliab/fraggate |
| DecisionGATE | https://decisiongate-download-tracker.vibelock.workers.dev/ |
| FoldLock | https://foldlock-download-tracker.vibelock.workers.dev/ |
| WhistleLock | https://whistlelock-download-tracker.vibelock.workers.dev/ |
| CodeLock | https://codelock-download-tracker.vibelock.workers.dev/ |
| VeilLock | https://veillock-download-tracker.vibelock.workers.dev/ |
| VibeLock | https://vibelock-download-tracker.vibelock.workers.dev/ |
| ShadowLock | https://shadowlock-download-tracker.vibelock.workers.dev/ |
| StaticClock | https://staticclock-download-tracker.vibelock.workers.dev/ |
| PeaceLock | https://www.azielcorpuslibrary.net/software |
| EmployeeLock | https://employeelock-download-tracker.vibelock.workers.dev/ |

EmbryoLock, Lumen, and PeaceLock have no public repo or download-tracker. The names stay visible and point at the corpus software hub.

## Doors

Every label and URL is hyperlinked.

- GitHub → https://github.com/AzielEliab
- Secondary source → https://github.com/azieltherevealerofthesealed-arch
- Corpus → https://www.azielcorpuslibrary.net/
- GodLock → https://godlock.uk/
- Runtime → https://github.com/AzielEliab/aziel-runtime · live https://www.azielcorpuslibrary.net/runtime
- X → https://x.com/azieleliab

## Visual

Matches GodLock / Digital Library Workers: `#0e0c09` / `#12100c` ground, `#c9a227` gold trim, white body text, soft-card panels. Not royal-purple body copy. Optional sigil: https://www.azielcorpuslibrary.net/sigil.png

## License

Apache License 2.0. Author: Aziel Eliab.
