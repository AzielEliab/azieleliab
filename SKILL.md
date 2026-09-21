---
name: Aziel Eliab hub cite
description: >-
  Public landing and hub cite Worker for Aziel Eliab (www.azieleliab.com).
  Software strip is live catalog, not this repo. Read-only suite presence is on
  (display from runtime). GET never enables.
  QNS-CD-1.0 is hub cite / mesh.js cross-map only (photon QNS1 packet
  transfer). Local qnsd is AzielEliab/qnm-node. Runtime cites live in
  AzielEliab/aziel-runtime. AZInterface has pair custody. QNS-CD is not
  Node Gate. Mesh Node Gate is operator-armed (2026-09-17), not a login
  panel. No public qnsd proxy. Not a Softwares-tab product. Identity
  Aziel Eliab only.
---

# Aziel Eliab hub cite

This Worker is the **public landing** and **hub cite** surface. It is **not** a Softwares-tab product. Identity is **Aziel Eliab** only.

Canonical: https://www.azieleliab.com/
Person `@id`: https://www.azieleliab.com/#aziel (www, not apex; `#aziel` not `#aziel-eliab`)
Runtime parent `@id`: https://www.azieleliab.com/runtime#runtime (`hasPart` named tools only; not MCP ops)
Runtime version: **2.0.0-rc1**
Runtime SoT LIVE: main **6a3798a** / version_id **105fa1ee** / 2.0.0-rc1 at https://aziel-runtime.vibelock.workers.dev

Softwares list: https://www.azieleliab.com/software (`/#software` maps here)

Donate door (AZL-DONATE-1.0, not a Softwares product): https://www.azieleliab.com/donate

Receipts tab (kept): https://www.azieleliab.com/receipts

INGEST-AS-RECEIPT-1.0 sha256:c71e8c07d838b148fc8ec5f18c7e261d53566ea8a090ca81445e3483586082a5 https://www.azieleliab.com/

Same tip in Receipts-tab first-screen HTML (`/receipts`), `/ingest`, `/cite.json`, `/llms.txt`, GitHub. Not a visible homepage card. Cite, don't merge. Verify paste-hash yes/no at `/verify`. `/ingest.txt` is the hashed page bytes. RE-EXPAND-FROM-ARCHIVE-1.0: bytes survive, not summaries; verify receipts/`previous_hash` then stand a local node — not mesh from index. Crawlers do not re-expand. Training residue is rumor. Growth-ON Allow. COLD-MULTI-SHELF-1.0: Plane A is 5 published surfaces / 2 family radii (not 5 shelves). Plane B Codeberg + archive.org tip-pack hash-verify PASS (https://archive.org/details/aziel-lockset-tip and https://archive.org/details/aziel-lockset-tip_202609, same blast_radius, pack b549362c…; zip wrap on 202609 — flat IA sha256 may be null; inner tar hash-verifies); still SLOT until Framagit verifies. Never invent URLs. Never LIVE yet. Plane C USB stays SLOT until CNS-OPERATOR-ATTEST. Canonical shelves registry: https://www.azielcorpuslibrary.net/shelves. Cap-7 is design_of only (`resolves_to_hub: false` if a bridge is present). Shuffle via MirageGrid LIVE `https://miragegrid.vibelock.workers.dev` (`/v1/health` · `/bridge` · `/v1/shuffle`). `/cite.json` pointers: REDLINE-2026-09-14, Cap-7 `design_of` + `resolves_to_hub: false`, BAN-SURVIVAL-1.0 pull of runtime `/survival`, SPORE-1.0 last-resort failsafe, RE-COLD-STORE (allowed, destinations[], no invent; cold shelves not marked failed), attack-sim refuse, FoldLock tip-safe (never fold the lockset tip). Lamb Lens path: Service → Clarity → Peace. NO-FAN. CROSS-NETWORK-SURVIVAL + NO-LIE.

GitHub About / indexing (no Worker UI change): [docs/github-seo.md](docs/github-seo.md). Homepage `https://www.azieleliab.com/`. Cross-link Corpus, GodLock, He Didn't Jump, aziel-runtime, Trades-Runtime (sister product extra; `live_backends` false), GitHub AzielEliab, Try on Glama, X @AzielEliab, Donate.

About aliases `/about`, `/AzielEliab`, `/aziel-eliab` 200 the same homepage HTML. Tab pages `/why`, `/software`, `/research`, `/doors` are distinct URLs. `/aziel` 200s the homepage (Person `#aziel`). `/mission` 301s to `/`. Old hashes `/#why` `/#software` `/#research` `/#doors` (`/#mission`) map to those paths.

## Mesh (read-only ON)

Read-only suite presence is **on**. Display `live_nodes` from aziel-runtime `GET /v1/mesh` (human mesh users + cited human uses). `software_nodes` never feeds Live Nodes. Mesh ON. Operator-armed Node Gate + neighbor heal + network ON (not a login-recovery / IP panel). AZVPN auto_use + vpn:true (HTTPS/WS REAL; WireGuard/OpenVPN SLOT; GET cites only). Channel plane wifi/bluetooth/rf/photon ON cites; worker_hardware:false. Softwares via fraggate_call only; master_33:false; FragGate sole door.

| Path | What |
|------|------|
| `GET /v1/mesh` | Live Nodes SoT. Hoists `live_nodes`, `live_nodes_note`, `human_mesh_users`, `human_uses` from Worker `GET /v1/mesh`. Softwares count never feeds the pill. |
| `GET /v1/mesh/status` | Same-origin QNM-BUILD-1.0 rollup (runtime via `AZIEL_RUNTIME`, else HTTPS). Same Live Nodes fields. |
| `GET /v1/mesh/nodes` | Node roster (display from runtime; Live Nodes number is `GET /v1/mesh` `live_nodes`, not roster length) |
| `GET /runtime/v1/mesh` | Same JSON through the quiet `/runtime` door |
| `GET /runtime/v1/mesh/status` | Same |
| `GET /runtime/v1/mesh/nodes` | Same |
| `GET /survival` · `GET /v1/survival` | BAN-SURVIVAL-1.0 hub pull of runtime `GET /survival` (short TTL). Mutual backup, live_doors, platforms.all_live, calling_name, cap7_aznet, SPORE-1.0 last-resort failsafe, RE-COLD-STORE (allowed, destinations[], no invent). Cold shelves not marked failed. No visible 15:20 chrome. |
| `GET /runtime/survival` · `GET /runtime/v1/survival` | Same JSON through the quiet `/runtime` door |
| `GET /cite.json` | Hub citation record, including mesh + QNM rollup + QNS-CD + COLD-MULTI-SHELF + BAN-SURVIVAL + SPORE-1.0 + RE-COLD-STORE |
| `GET /shelves` · `GET /v1/shelves` | COLD-MULTI-SHELF-1.0 machine registry (same level as live corpus `/shelves`). Canonical registry: https://www.azielcorpuslibrary.net/shelves. No visible 15:20 chrome. |

`GET /v1/mesh` never enables radios. Operator enable on runtime requires a declared bearer (example: `suite-presence`). A 404 or missing origin still returns identity Aziel Eliab with `live_nodes: 0`. Public UI never renders an off-state quiet mesh label.

Homepage and Softwares-tab brandrow show `Nodes#/LiveNodes#` next to Views from mesh SSoT. Nodes = human mesh users + human uses (`j.nodes` preferred; fallback sum or legacy `j.live_nodes` if `nodes` absent). Live Nodes = presence (`j.human_mesh_users`, or `j.live_nodes` only when `j.nodes` is also present). Softwares list: live `GET /v1/software` designed-purpose `one_line` / `description` (42 catalog products; VeilLock local_only; Whitestone Worker-only, FragGate status none). In-runtime placements AZVPN / MMConsensus / ToolBench / ZKAttest door to `#task-*`. Softwares UI is name + designed-purpose one_line. Plain A–Z → Gate A–Z → Lock A–Z (StaticClock is Plain). Cap-7 shuffle is MirageGrid LIVE (`https://miragegrid.vibelock.workers.dev` `/v1/health` · `/bridge` · `/v1/shuffle`); `resolves_to_hub: false`.

Agent skill for the runtime door: https://www.azieleliab.com/runtime/v1/skill  
Origin skill: https://aziel-runtime.vibelock.workers.dev/v1/skill

## QNS-CD-1.0 cross-map

Coded in `src/mesh.js` as `QNS_CD_SPEC` and `QNS_CD`. Peers read it from mesh status, Live Nodes, `/v1/software` `mesh`, and `/cite.json`.

**THIS IS:** photon QNS1 packet transfer cite. Local qnsd is coded in [qnm-node](https://github.com/AzielEliab/qnm-node). Runtime cites + catalog field live in [aziel-runtime](https://github.com/AzielEliab/aziel-runtime) (`docs/designs/`, `docs/NODE_MESH.md`, `/v1/skill`). Pair custody: [azinterface](https://github.com/AzielEliab/azinterface).

`MESH_NOTE` cites QNS-CD-1.0. Do not implement qnsd on this Worker.

## Compatible clients

ChatGPT (GPT Actions / OpenAI), Grok (xAI), Venice, Claude (Anthropic Desktop / custom tools), Cursor (MCP), Glama (Install Server / MCP), Perplexity, Microsoft Copilot / Bing, Google Gemini / Vertex AI, Mistral, Meta AI, Apple Intelligence / Applebot surfaces, Amazon Q / Amazonbot tooling, DuckAssist / DuckDuckGo AI, You.com, Cohere, plus other MCP/OpenAPI-capable assistants.

Always send `User-Agent: Mozilla/5.0`. Author: **Aziel Eliab** only. Elroi / AzielEliab / AzielElroiEliab / The Revealer of The Sealed / Revealer of The Sealed are aka / `alternateName` only.

Identity lock (GROKBOT-FIX 1.1): `GET /who` is visible HTML (H1 `Who is Aziel Eliab` + who-answer). The 15:20 lock line is machine-only. Machine “What Aziel Eliab does” brief (Softwares + research MASTER + public hardware) is on `/llms.txt`, `/ai.txt`, `/cite.json`, `/who-is`, `/person.jsonld`, `/graph.jsonld` FAQPage. Mirror: [docs/aziel-identity-schema/](docs/aziel-identity-schema/). Person `@id` stays `https://www.azieleliab.com/#aziel`.
