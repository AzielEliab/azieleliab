---
name: Aziel Eliab hub cite
description: >-
  Public landing and hub cite Worker for Aziel Eliab (www.azieleliab.com).
  Software strip is live catalog, not this repo. Read-only suite presence is on
  (display from runtime). GET never enables.
  QNS-CD-1.0 is hub cite / mesh.js cross-map only (photon QNS1 packet
  transfer). Local qnsd is AzielEliab/qnm-node. Runtime cites live in
  AzielEliab/aziel-runtime. AZInterface has pair custody. No Node Gate.
  No public qnsd proxy. Not a Softwares-tab product. Identity Aziel Eliab only.
---

# Aziel Eliab hub cite

This Worker is the **public landing** and **hub cite** surface. It is **not** a Softwares-tab product. Identity is **Aziel Eliab** only.

Canonical: https://www.azieleliab.com/
Person `@id`: https://www.azieleliab.com/#aziel (www, not apex; `#aziel` not `#aziel-eliab`)
Runtime parent `@id`: https://www.azieleliab.com/runtime#runtime (`hasPart` named tools only; not MCP ops)
Runtime version: **2.0.0-rc1**

Softwares list: https://www.azieleliab.com/#software (`/software` 301s here)

Donate door (AZL-DONATE-1.0, not a Softwares product): https://www.azieleliab.com/donate

GitHub About / indexing (no Worker UI change): [docs/github-seo.md](docs/github-seo.md). Homepage `https://www.azieleliab.com/`. Cross-link Corpus, GodLock, He Didn't Jump, aziel-runtime, Try on Glama, Donate.

About aliases `/about`, `/AzielEliab`, `/aziel-eliab` 301 to the homepage.

## Mesh (read-only ON)

Read-only suite presence is **on**. Display `live_nodes` from aziel-runtime. VPN/hop mesh is not claimed. No Node Gate. Display only.

| Path | What |
|------|------|
| `GET /v1/mesh/status` | Same-origin QNM-BUILD-1.0 rollup (runtime via `AZIEL_RUNTIME`, else HTTPS). Hoists `live_nodes`. |
| `GET /v1/mesh/nodes` | Live Nodes roster (display from runtime; `Live Nodes · 0` when unavailable) |
| `GET /runtime/v1/mesh/status` | Same JSON through the quiet `/runtime` door |
| `GET /runtime/v1/mesh/nodes` | Same |
| `GET /cite.json` | Hub citation record, including mesh + QNM rollup + QNS-CD |

`GET /v1/mesh/status` never enables radios. Operator enable on runtime requires a declared bearer (example: `suite-presence`). A 404 or missing origin still returns identity Aziel Eliab with `live_nodes: 0`. Public UI never renders an off-state quiet mesh label.

Homepage brandrow shows `Live Nodes · N` (sister-hub pill) from origin `live_nodes`. Softwares list rules unchanged.

Agent skill for the runtime door: https://www.azieleliab.com/runtime/v1/skill  
Origin skill: https://aziel-runtime.vibelock.workers.dev/v1/skill

## QNS-CD-1.0 cross-map

Coded in `src/mesh.js` as `QNS_CD_SPEC` and `QNS_CD`. Peers read it from mesh status, Live Nodes, `/v1/software` `mesh`, and `/cite.json`.

**THIS IS:** photon QNS1 packet transfer cite. Local qnsd is coded in [qnm-node](https://github.com/AzielEliab/qnm-node). Runtime cites + catalog field live in [aziel-runtime](https://github.com/AzielEliab/aziel-runtime) (`docs/designs/`, `docs/NODE_MESH.md`, `/v1/skill`). Pair custody: [azinterface](https://github.com/AzielEliab/azinterface).

**THIS IS NOT:** a Softwares-tab product, a public qnsd proxy, a Node Gate, or a mesh-off control.

`MESH_NOTE` cites QNS-CD-1.0. Do not implement qnsd on this Worker.

## Compatible clients

ChatGPT (GPT Actions / OpenAI), Grok (xAI), Venice, Claude (Anthropic Desktop / custom tools), Cursor (MCP), Glama (Install Server / MCP), Perplexity, Microsoft Copilot / Bing, Google Gemini / Vertex AI, Mistral, Meta AI, Apple Intelligence / Applebot surfaces, Amazon Q / Amazonbot tooling, DuckAssist / DuckDuckGo AI, You.com, Cohere, plus other MCP/OpenAPI-capable assistants.

Always send `User-Agent: Mozilla/5.0`. Author: **Aziel Eliab** only. Elroi is aka / `alternateName` only.
