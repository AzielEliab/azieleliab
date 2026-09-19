# GitHub About + indexing (azieleliab)

GitHub-side SEO / indexing / AI pickup for [AzielEliab/azieleliab](https://github.com/AzielEliab/azieleliab). This file is the **About box spec**. It does **not** change live azieleliab.com Worker UI. No wrangler deploy.

Live crawl surfaces (`/robots.txt`, `/llms.txt`, `/ai.txt`, `/cite.json`, `/shelves`, `/v1/shelves`, `/sitemap.xml`, JSON-LD) stay on the Worker. This repo’s README, CITATION.cff, and GitHub description / homepage / topics are what Google and AI crawlers see on GitHub. Canonical shelves registry remains https://www.azielcorpuslibrary.net/shelves.

Same published tip as Receipts-tab first-screen HTML (`/receipts`) / `/ingest` / `/cite.json` / `/llms.txt`:

`INGEST-AS-RECEIPT-1.0 sha256:c71e8c07d838b148fc8ec5f18c7e261d53566ea8a090ca81445e3483586082a5 https://www.azieleliab.com/`

Cite, don't merge. Training residue is rumor. Crawlers do not re-expand.

## Public websites (Google AI / LLM / SEO)

Every public website on the Aziel Eliab profile. One-line what/why. Hub About boxes are already set; this table is the GitHub-side list for crawlers.

| URL | What |
|-----|------|
| https://www.azieleliab.com/ | Official Person hub / Softwares / research landing |
| https://www.azielcorpuslibrary.net/ | Digital Library MASTER |
| https://godlock.uk/ | GodLock challenge/score product (not a VPN; GodLock ≠ identity) |
| https://www.hedidntjump.com/ | Zioncheck 7 Aug 1936 archive (not a verdict) |
| https://aziel-runtime.vibelock.workers.dev/ | Aziel Runtime / FragGate MCP Softwares door |
| https://trades-runtime.vibelock.workers.dev/ | Trades-Runtime sister product (local-first BYO field trades; not FragGate exec; live_backends false) |
| https://github.com/AzielEliab/trades-runtime | Trades-Runtime source |
| https://glama.ai/mcp/servers/AzielEliab/aziel-runtime | Try on Glama |
| https://github.com/AzielEliab | GitHub user / public source |

Machine who-is (not a biography): https://www.azieleliab.com/who-is

Hub crawl routes (`/person.jsonld` · `/cite.json` · `/llms.txt` · `/ai.txt` · `/sitemap.xml` · `/who-is` · `/survival`) plus Runtime `/openapi.json` and `POST /mcp`. Pack copy: [github-profile-readme/](github-profile-readme/).

GitHub **cannot** create special repo `AzielEliab/AzielEliab` — the name case-collides with this Worker. Keep the pack as the GitHub-side index, or copy `github-profile-readme/README.md` to another public surface. Do not rename this repo.

## Apply on GitHub

Coordinator (repo admin) after merge:

```bash
gh repo edit AzielEliab/azieleliab \
  --homepage "https://www.azieleliab.com/" \
  --description "Public landing for Aziel Eliab. Canonical https://www.azieleliab.com/ · Person #aziel · Aziel Runtime 2.0.0-rc1 · Corpus · GodLock · He Didn't Jump · Try on Glama · Donate AZL-DONATE-1.0. Identity Aziel Eliab only (Elroi aka)." \
  --add-topic aziel-eliab \
  --add-topic azieleliab \
  --add-topic cloudflare-workers \
  --add-topic mcp \
  --add-topic model-context-protocol \
  --add-topic website \
  --add-topic apache-2-0 \
  --add-topic json-ld \
  --add-topic schema-org \
  --add-topic seo \
  --add-topic aziel-runtime \
  --add-topic godlock \
  --add-topic digital-library \
  --add-topic glama \
  --add-topic ai-agents \
  --add-topic donate \
  --add-topic personal-website \
  --add-topic openapi
```

| Field | Value |
|-------|--------|
| Homepage | `https://www.azieleliab.com/` |
| Description | `Public landing for Aziel Eliab. Canonical https://www.azieleliab.com/ · Person #aziel · Aziel Runtime 2.0.0-rc1 · Corpus · GodLock · He Didn't Jump · Try on Glama · Donate AZL-DONATE-1.0. Identity Aziel Eliab only (Elroi aka).` |

Topics (≤20): `aziel-eliab` · `azieleliab` · `cloudflare-workers` · `mcp` · `model-context-protocol` · `website` · `apache-2-0` · `json-ld` · `schema-org` · `seo` · `aziel-runtime` · `godlock` · `digital-library` · `glama` · `ai-agents` · `donate` · `personal-website` · `openapi`

Why this matters: GitHub’s repository page is a second indexable URL. Empty homepage / topics hide the site from GitHub search, Google’s `site:github.com` results, and AI repo crawlers that read the About box first.

## Locked entity graph

| Node | `@id` | Notes |
|------|-------|--------|
| Person | `https://www.azieleliab.com/#aziel` | www, not apex. Fragment `#aziel`, not `#aziel-eliab`. Name **Aziel Eliab**. `alternateName` Aziel Elroi Eliab (aka only). |
| WebSite | `https://www.azieleliab.com/#website` | publisher / creator → Person |
| Runtime | `https://www.azieleliab.com/runtime#runtime` | Aziel Runtime **2.0.0-rc1**. `sameAs` GitHub repo + Glama. Worker is related/endpoint. |

Person `sameAs` lattice (AZindex):

- https://github.com/AzielEliab
- https://github.com/azieltherevealerofthesealed-arch
- https://glama.ai/mcp/servers/AzielEliab/aziel-runtime
- https://www.azieleliab.com/
- https://www.azielcorpuslibrary.net/
- https://godlock.uk/
- https://www.hedidntjump.com/
- https://x.com/AzielElroiEliab
- https://x.com/azieleliab

Do not invent Glama UUIDs, Zenodo DOIs, or extra identities. Aka only: Aziel Elroi Eliab, AzielEliab, AzielElroiEliab, The Revealer of The Sealed, Revealer of The Sealed.

Machine identity (identical bytes under [docs/aziel-identity-schema/](aziel-identity-schema/)):

- https://www.azieleliab.com/person.jsonld
- https://www.azieleliab.com/identity.jsonld
- https://www.azieleliab.com/graph.jsonld
- https://www.azieleliab.com/who
- https://www.azieleliab.com/who-is-aziel-eliab.txt
- https://www.azieleliab.com/.well-known/aziel.json

### Runtime `hasPart` (named tools only)

Not MCP ops (`fraggate_call`, `runtime_run`, …). Child `@id` is `https://www.azieleliab.com/runtime#<slug>`.

| slug | name |
|------|------|
| fraggate | FragGate |
| forgereceipts | ForgeReceipts |
| decisiongate | DecisionGate |
| temporallock | TemporalLock |
| trajectorylock | TrajectoryLock |
| peacelock | PeaceLock |
| godlock | GodLock |
| azos | AZ-OS |
| azcoherence | AZCoherence |
| 4dmap | 4DMap |
| aziel-corpus | Aziel Corpus |
| askjeeves | Ask Jeeves |
| azbrowser | AZBrowser |
| azmail | AZMail |
| azhub | AZHub |
| azinterface | AZInterface |
| spectrallock | SpectralLock — leftover-bytes recover; Worker LIVE /v1/unredact (deep PDF + revision_graph + per-revision copies), /v1/recover (NO-LIE; LIVE vs SLOT), /v1/handwriting (not lab/ESDA/court); opaque rewrite refuses SL-UNREDACT-OPAQUE; heatmap ≠ transcript; inject ON is paint not pigment; never OCR-from-black-box; not FragGate invent |
| shadowlock | ShadowLock |
| foldlock | FoldLock |
| codelock | CodeLock |
| vibelock | VibeLock |

## Ecosystem cross-references

| Label | URL |
|-------|-----|
| Official site | https://www.azieleliab.com/ |
| Corpus | https://www.azielcorpuslibrary.net/ |
| Corpus · Aziel Eliab | https://www.azielcorpuslibrary.net/AzielEliab |
| Corpus · Software | https://www.azielcorpuslibrary.net/software |
| Corpus · Runtime | https://www.azielcorpuslibrary.net/runtime |
| GodLock | https://godlock.uk/ |
| GodLock · Aziel Eliab | https://godlock.uk/AzielEliab |
| GodLock repo | https://github.com/AzielEliab/godlock |
| He Didn't Jump | https://www.hedidntjump.com/ |
| aziel-runtime (2.0.0-rc1) | https://github.com/AzielEliab/aziel-runtime |
| Official Runtime | https://aziel-runtime.vibelock.workers.dev/ |
| Runtime docs | https://github.com/AzielEliab/aziel-runtime/tree/main/docs/2.0 |
| Try on Glama | https://glama.ai/mcp/servers/AzielEliab/aziel-runtime |
| Donate AZL-DONATE-1.0 | https://www.azieleliab.com/donate |
| This repo | https://github.com/AzielEliab/azieleliab |

Sister product SEO template: [aziel-runtime/docs/PRODUCT_SEO.md](https://github.com/AzielEliab/aziel-runtime/blob/main/docs/PRODUCT_SEO.md).

Profile README pack (GitHub-side index; `AzielEliab/AzielEliab` cannot exist): [github-profile-readme/](github-profile-readme/) · [OPERATOR.md](github-profile-readme/OPERATOR.md).

## Compatible AI clients

Full set (do not shrink to Grok / ChatGPT / Venice only):

- ChatGPT (GPT Actions / OpenAI)
- Grok (xAI)
- Venice
- Claude (Anthropic Desktop / custom tools)
- Cursor (MCP)
- Glama (Install Server / MCP)
- Perplexity
- Microsoft Copilot / Bing
- Google Gemini / Vertex AI
- Mistral
- Meta AI
- Apple Intelligence / Applebot surfaces
- Amazon Q / Amazonbot tooling
- DuckAssist / DuckDuckGo AI
- You.com
- Cohere
- plus other MCP/OpenAPI-capable assistants

Always send `User-Agent: Mozilla/5.0`.

## Identity law

Public identity is **Aziel Eliab** only. Elroi appears only as aka / `alternateName`. Do not invent Zenodo DOIs. Cite live `/cite.json` and `/shelves`.

INGEST-AS-RECEIPT-1.0 sha256:c71e8c07d838b148fc8ec5f18c7e261d53566ea8a090ca81445e3483586082a5 https://www.azieleliab.com/
