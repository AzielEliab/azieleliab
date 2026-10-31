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
| Aka only | Aziel Elroi Eliab \| AzielEliab \| azieleliab \| The Revealer of the Sealed \| Elias Artista, then AzielElroiEliab \| The Revealer of The Sealed \| Revealer of The Sealed |

Machine lock line (home and `/aziel` meta, llms, who-is txt, aziel.json — not pasted into body chrome or H1):

> Aziel Eliab (also Aziel Elroi Eliab) is an online pseudonymous developer, researcher, author, and digital-rights activist. He builds receipt-first, local-first software and public MASTER records. Canonical Person https://www.azieleliab.com/#aziel.

`person.jsonld` and `identity.jsonld` are the same Person JSON-LD. One Person `@id` only. `jobTitle` and `hasOccupation` are Digital rights activist, Software developer, Software engineer, Engineer, Designer, Philosopher, Author, Artist, Researcher, Archivist (He Didn't Jump / Marion Zioncheck archive), Open-hardware designer. Curated `workExample` cites verified works. The full list is `GET /works.json`. `graph.jsonld` is Person + FAQPage (primary “Who is Aziel Eliab?” plus locked “What does Aziel Eliab do?” / “What Aziel Eliab does” / “Who is Aziel Eliab the developer?” / “What software does Aziel Eliab make?” — Softwares designed-purpose list from Worker GET /v1/software `one_line`, plus The ARK deniable-vault designed-purpose and Whitestone Case Mode designed-purpose, plus SpectralLock designed-purpose FAQ (“What is SpectralLock?” — Preview a 256-pixel overlay, paint membership from the Spectral Harmonic Wheel, and restore faded pigment where the pixels still carry it), plus research MASTER + public hardware halves — plus locked Why FAQ (“Why does Aziel Eliab do this?” / “Why Aziel Eliab” / “Why does Aziel Eliab keep looking?” from published Why + mission goal) — plus “Is Aziel Eliab the two musicians named in 1 Chronicles 15:20?” — both name Aziel and Eliab + verse 15:20; short, no Chronicles essays; plus site-coverage FAQ and Official Aziel ecosystem FAQ: sister sites, GitHub AzielEliab, Try on Glama, X @AzielEliab, Softwares list) + indexable section WebPages (`/why`, `/software`, `/research`, `/doors`, `/aziel`) + WebSite nodes for the four hubs + Runtime `SoftwareApplication` `@id` `https://www.azieleliab.com/runtime#runtime` + Dataset of live stats URLs. Machine site-coverage blurbs cover ae (this hub), corpus library, godlock.uk, hedidntjump.com, and aziel-runtime FragGate/MCP. Official ecosystem cite adds GitHub AzielEliab, Try on Glama, X @AzielEliab, and the Softwares list. PeaceLock designed-purpose: Record chosen silence or chosen inaction as a hash-chained receipt. Trades-Runtime stays extras / sister (software_tab false) with public Softwares/cite. One public Softwares version: live GET https://aziel-runtime.vibelock.workers.dev/v1/software is SoT (fallback /v1/fraggate/list, then frozen 2.0.0-rc1).

`alternateName` starts with Aziel Elroi Eliab, AzielEliab, azieleliab, The Revealer of the Sealed, and Elias Artista, then keeps compact Hebrew forms, listed misspellings, and AzielElroiEliab / The Revealer of The Sealed / Revealer of The Sealed. Person `description` and `knowsAbout` include the living Hebrew name definition (Aziel = God is my strength; Elroi = God who sees; Eliab = God is father). `knowsLanguage` includes `he`. `disambiguatingDescription` names Aziel Eliab as one living person (digital rights activist, software developer and engineer, designer, philosopher, author, artist, and researcher) and says he is not the two Levitical musicians Aziel and Eliab named together in 1 Chronicles 15:20. `/about` carries a `ProfilePage` whose `mainEntity` is this Person. Do not invent biography. `sameAs` lattice: GitHub AzielEliab, secondary source, Glama runtime, azieleliab.com, corpus, godlock.uk, hedidntjump.com, X. Never sameAs euaziel.site. `GET /.well-known/person.jsonld` is identical to `/person.jsonld`.

`graph.jsonld` also lists human-page WebPages for `/receipts`, `/comics`, `/donate`, `/who`, `/ingest`, `/verify`, and `/embryolock`. Spine tabs `/why`, `/software`, `/research`, `/doors`, and `/aziel` stay the indexable section WebPages. `/` stays the film theater. Cap-7 `public_icann` stays false. Cap-7 is not an ICANN registration. Paid satellite stays HELD. `/aziel` lists the public handles. TimeToUnsealTheBook (`https://timetounsealthebook.net/aziel`, Cos tip `5b3c878e`) is a handle, not a Live Node, and is not LIVE on this hub until Dual CLEAR + Aziel merge OK + Cos. Growth-ON Allow. The shared ecosystem footer is on `/who` and the other HTML pages. No extra visible 15:20 identity-lock chrome.

Published About (exact homepage / `/about` / `/AzielEliab` lines, not biography) is factored into who-is, FAQPage, AboutPage, llms Mission, and cite.json. Person `mainEntityOfPage` is `/who`. AboutPage `significantLink` also points at `/person.jsonld`, `/who`, `/who-is`, `/graph.jsonld`, and indexable section paths. `/` is the film theater only. `/about` and `/AzielEliab` 200 the same hub HTML as `/aziel`. Enter on `/` opens `/aziel`.

Live stats (do not invent numbers): `https://www.azieleliab.com/v1/stats`, Digital Library `https://www.azielcorpuslibrary.net/stats` (not `/v1/stats`; version is `GET /v1/health`; tracker fallback `https://aziel-corpus-download-tracker.vibelock.workers.dev/stats`), `https://www.hedidntjump.com/api/stats`.

`zenodo_dois` is `[]`. `openalex` is `null`. Do not invent DOIs. Do not add biography fields (legal name, home, county, employer, family, health, court matter). No prophetic claims. No “Aziel Systems” / paper counts.

Hub aliases: `GET /who` is visible HTML; `GET /who-is` = `/who-is-aziel-eliab.txt`; `GET /.well-known/person.jsonld` = `/person.jsonld`.

Live generators: `src/identity.js` on [AzielEliab/azieleliab](https://github.com/AzielEliab/azieleliab).
