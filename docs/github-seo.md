# GitHub About + indexing (azieleliab)

GitHub-side SEO / indexing / AI pickup for [AzielEliab/azieleliab](https://github.com/AzielEliab/azieleliab). This file is the **About box spec**. It does **not** change live azieleliab.com Worker UI. No wrangler deploy.

Live crawl surfaces (`/robots.txt`, `/llms.txt`, `/ai.txt`, `/cite.json`, `/sitemap.xml`, JSON-LD) stay on the Worker. This repo’s README, CITATION.cff, and GitHub description / homepage / topics are what Google and AI crawlers see on GitHub.

## Apply on GitHub

Coordinator (repo admin) after merge:

```bash
gh repo edit AzielEliab/azieleliab \
  --homepage "https://www.azieleliab.com/" \
  --description "Public landing for Aziel Eliab. Canonical https://www.azieleliab.com/ · Person #aziel · Aziel Runtime 2.0.0-rc1 · Corpus · GodLock · Try on Glama · Donate AZL-DONATE-1.0. Identity Aziel Eliab only (Elroi aka)." \
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
| Description | `Public landing for Aziel Eliab. Canonical https://www.azieleliab.com/ · Person #aziel · Aziel Runtime 2.0.0-rc1 · Corpus · GodLock · Try on Glama · Donate AZL-DONATE-1.0. Identity Aziel Eliab only (Elroi aka).` |

Topics (≤20): `aziel-eliab` · `azieleliab` · `cloudflare-workers` · `mcp` · `model-context-protocol` · `website` · `apache-2-0` · `json-ld` · `schema-org` · `seo` · `aziel-runtime` · `godlock` · `digital-library` · `glama` · `ai-agents` · `donate` · `personal-website` · `openapi`

Why this matters: GitHub’s repository page is a second indexable URL. Empty homepage / topics hide the site from GitHub search, Google’s `site:github.com` results, and AI repo crawlers that read the About box first.

## Locked entity graph

| Node | `@id` | Notes |
|------|-------|--------|
| Person | `https://www.azieleliab.com/#aziel` | www, not apex. Fragment `#aziel`, not `#aziel-eliab`. Name **Aziel Eliab**. `alternateName` Aziel Elroi Eliab (aka only). |
| WebSite | `https://www.azieleliab.com/#website` | publisher / creator → Person |
| Runtime | `https://www.azieleliab.com/runtime#runtime` | Aziel Runtime **2.0.0-rc1**. `sameAs` GitHub repo + Glama. Worker is related/endpoint. |

Person `sameAs` only:

- https://github.com/AzielEliab
- https://glama.ai/mcp/servers/AzielEliab/aziel-runtime
- https://www.azielcorpuslibrary.net/
- https://godlock.uk/

Do not invent Glama UUIDs or extra `sameAs` identities.

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
| spectrallock | SpectralLock |
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
| aziel-runtime (2.0.0-rc1) | https://github.com/AzielEliab/aziel-runtime |
| Official Runtime | https://aziel-runtime.vibelock.workers.dev/ |
| Runtime docs | https://github.com/AzielEliab/aziel-runtime/tree/main/docs/2.0 |
| Try on Glama | https://glama.ai/mcp/servers/AzielEliab/aziel-runtime |
| Donate AZL-DONATE-1.0 | https://www.azieleliab.com/donate |
| This repo | https://github.com/AzielEliab/azieleliab |

Sister product SEO template: [aziel-runtime/docs/PRODUCT_SEO.md](https://github.com/AzielEliab/aziel-runtime/blob/main/docs/PRODUCT_SEO.md).

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

Public identity is **Aziel Eliab** only. Elroi appears only as aka / `alternateName`. Do not invent Zenodo DOIs. Cite live `/cite.json`.
