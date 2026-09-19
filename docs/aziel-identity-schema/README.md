# AZindex / GROKBOT-FIX 1.1 identity lock

Mirror copies of the locked identity surfaces on [www.azieleliab.com](https://www.azieleliab.com/). Other hosts (Corpus, GodLock, He Didn't Jump, Runtime) should serve **identical machine bytes** for these routes.

| Route | Content-Type | File |
|-------|--------------|------|
| `GET /who` | `text/html` | Visible H1 `Who is Aziel Eliab` + who-answer paragraph |
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
| Aka only | Aziel Elroi Eliab \| Elias Artista \| AzielEliab \| AzielElroiEliab \| The Revealer of The Sealed \| Revealer of The Sealed |

Machine lock line (llms, who-is txt, aziel.json — not rendered in visible `/` or `/who` HTML):

> Aziel Eliab is a living researcher, digital rights activist, software developer/designer, author, and philosopher of published work.

`person.jsonld` and `identity.jsonld` are the same Person JSON-LD. One Person `@id` only. `jobTitle` is researcher, digital rights activist, software developer/designer, author, philosopher of published work. `graph.jsonld` is Person + FAQPage (primary “Who is Aziel Eliab?” plus locked “What does Aziel Eliab do?” / “What Aziel Eliab does” / “Who is Aziel Eliab the developer?” / “What software does Aziel Eliab make?” — locked Softwares short sentence unforked, plus The ARK deniable-vault note and optional Whitestone cite, plus SpectralLock leftover-bytes / OCR refuse after spectrallock#13 LIVE (“Does SpectralLock OCR or invent letters from a black-box redaction?” — leftover_bytes recover; SL-UNREDACT-OPAQUE; never invent letters; never OCR-from-black-box; Worker `/v1/unredact` deep PDF + revision_graph + per-revision copies; `/v1/recover` NO-LIE LIVE vs SLOT; `/v1/handwriting`), plus research MASTER + public hardware halves — plus “Is Aziel Eliab the two musicians named in 1 Chronicles 15:20?” — both name Aziel and Eliab + verse 15:20; short, no Chronicles essays; plus site-coverage FAQ) + indexable section WebPages (`/why`, `/software`, `/research`, `/doors`, `/aziel`) + WebSite nodes for the four hubs + Runtime `SoftwareApplication` `@id` `https://www.azieleliab.com/runtime#runtime` + Dataset of live stats URLs. Machine site-coverage blurbs cover ae (this hub), corpus library, godlock.uk, hedidntjump.com, and aziel-runtime FragGate/MCP.

`alternateName` keeps compact Hebrew forms and listed misspellings as AZindex tethers, plus aka Aziel Elroi Eliab / Elias Artista / AzielEliab / AzielElroiEliab / The Revealer of The Sealed / Revealer of The Sealed. Person `description` and `knowsAbout` include the living Hebrew name definition (Aziel = God is my strength; Elroi = God who sees; Eliab = God is father). `knowsLanguage` includes `he`. `disambiguatingDescription` names Aziel Eliab as one living person and notes that concordance pages list two Levitical musicians Aziel and Eliab named together in 1 Chronicles 15:20. Do not invent biography. `sameAs` lattice: GitHub AzielEliab, secondary source, Glama runtime, azieleliab.com, corpus, godlock.uk, hedidntjump.com, X. Never sameAs euaziel.site. `GET /.well-known/person.jsonld` is identical to `/person.jsonld`.

Published About (exact homepage / `/about` / `/AzielEliab` lines, not biography) is factored into who-is, FAQPage, AboutPage, llms Mission, and cite.json. Person `mainEntityOfPage` is `/who`. AboutPage `significantLink` also points at `/person.jsonld`, `/who`, `/who-is`, `/graph.jsonld`, and indexable section paths. `/about` and `/AzielEliab` 200 the same homepage HTML.

Live stats (do not invent numbers): `https://www.azieleliab.com/v1/stats`, Digital Library `https://www.azielcorpuslibrary.net/stats` (not `/v1/stats`; version is `GET /v1/health`; tracker fallback `https://aziel-corpus-download-tracker.vibelock.workers.dev/stats`), `https://www.hedidntjump.com/api/stats`.

`zenodo_dois` is `[]`. `openalex` is `null`. Do not invent DOIs. Do not add biography fields (legal name, home, county, employer, family, health, court matter). No prophetic claims. No “Aziel Systems” / paper counts.

Hub aliases: `GET /who` is visible HTML; `GET /who-is` = `/who-is-aziel-eliab.txt`; `GET /.well-known/person.jsonld` = `/person.jsonld`.

Live generators: `src/identity.js` on [AzielEliab/azieleliab](https://github.com/AzielEliab/azieleliab).
