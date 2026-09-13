# AZindex / GROKBOT-EXEC 1.0 identity lock

Mirror copies of the locked identity surfaces on [www.azieleliab.com](https://www.azieleliab.com/). Other hosts (Corpus, GodLock, He Didn't Jump, Runtime) should serve **identical machine bytes** for these five routes.

| Route | Content-Type | File |
|-------|--------------|------|
| `GET /person.jsonld` | `application/ld+json` | [person.jsonld](person.jsonld) |
| `GET /identity.jsonld` | `application/ld+json` | [identity.jsonld](identity.jsonld) (identical to person) |
| `GET /graph.jsonld` | `application/ld+json` | [graph.jsonld](graph.jsonld) |
| `GET /who-is-aziel-eliab.txt` | `text/plain` | [who-is-aziel-eliab.txt](who-is-aziel-eliab.txt) |
| `GET /.well-known/aziel.json` | `application/json` | [aziel.json](aziel.json) |

## Canonical lock (never change)

| Field | Value |
|-------|--------|
| Person `@id` | `https://www.azieleliab.com/#aziel` |
| Name | Aziel Eliab |
| Aka only | Aziel Elroi Eliab \| AzielEliab \| AzielElroiEliab |

`person.jsonld` and `identity.jsonld` are the same Person JSON-LD. One Person `@id` only. `graph.jsonld` is Person + FAQPage (primary “Who is Aziel Eliab?” and the software-developer Q lead with GodLock / Aziel Digital Library / aziel-runtime MCP / He Didn't Jump; one short “other Aziel names?” Q) + indexable section WebPages (`/why`, `/software`, `/research`, `/doors`, `/aziel`) + WebSite nodes for the four hubs + Runtime `SoftwareApplication` `@id` `https://www.azieleliab.com/runtime#runtime` + Dataset of live stats URLs.

`alternateName` keeps compact Hebrew forms and listed misspellings as AZindex tethers, plus aka Aziel Elroi Eliab / AzielEliab / AzielElroiEliab / The Revealer of The Sealed / Revealer of The Sealed. `knowsLanguage` includes `he`. Thin `description` fields lead with the living stack. `disambiguatingDescription` is the publisher we-are-NOT one-liner: Not biblical Aziel; not biblical Eliab; not euaziel.site; not Aziel S. (Flutter/portfolio); not other engineers named Aziel. Do not copy 1 Chronicles essays into description, cite, llms, or About. Do not invent biography beyond published About. `sameAs` lattice: azieleliab.com, corpus, godlock.uk, hedidntjump.com, GitHub AzielEliab, Glama runtime. Never sameAs euaziel.site. GodLock is a product, not this Person. `GET /.well-known/person.jsonld` is identical to `/person.jsonld`.

Published About (exact homepage / `/about` / `/AzielEliab` lines, not biography) is factored into who-is, FAQPage, AboutPage, llms Mission, and cite.json. Person `mainEntityOfPage` lists `/`, `/about`, `/AzielEliab`. AboutPage `significantLink` also points at `/person.jsonld`, `/who-is`, `/graph.jsonld`, and indexable section paths. `/about` and `/AzielEliab` 200 the same homepage HTML.

Live stats (do not invent numbers): `https://www.azieleliab.com/v1/stats`, Digital Library `https://www.azielcorpuslibrary.net/stats` (not `/v1/stats`; version is `GET /v1/health`; tracker fallback `https://aziel-corpus-download-tracker.vibelock.workers.dev/stats`), `https://www.hedidntjump.com/api/stats`.

`zenodo_dois` is `[]`. `openalex` is `null`. Do not invent DOIs. Do not add biography fields (legal name, home, county, employer, family, health, court matter). GodLock is a product, not identity. No prophetic claims.

Hub aliases (same bytes, not extra identities): `GET /who-is` = `/who-is-aziel-eliab.txt`; `GET /.well-known/person.jsonld` = `/person.jsonld`.

Live generators: `src/identity.js` on [AzielEliab/azieleliab](https://github.com/AzielEliab/azieleliab).
