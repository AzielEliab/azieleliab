---
name: Aziel Eliab hub cite
description: >-
  Public landing and hub cite Worker for Aziel Eliab (www.azieleliab.com).
  Software strip is live catalog, not this repo. Suite mesh is default OFF.
  QNS-CD-1.0 is hub cite / mesh.js cross-map only (photon QNS1 packet
  transfer). Local qnsd is AzielEliab/qnm-node. Runtime cites live in
  AzielEliab/aziel-runtime. AZInterface has pair custody. No Node Gate.
  No public qnsd proxy. Not a Softwares-tab product. Identity Aziel Eliab only.
---

# Aziel Eliab hub cite

This Worker is the **public landing** and **hub cite** surface. It is **not** a Softwares-tab product. Identity is **Aziel Eliab** only.

Canonical: https://www.azieleliab.com/

## Mesh (default OFF)

Suite node mesh doors stay **default OFF** until aziel-runtime enables them. VPN/hop mesh is not claimed. No Node Gate.

| Path | What |
|------|------|
| `GET /v1/mesh/status` | Same-origin mesh status (runtime via `AZIEL_RUNTIME`, else HTTPS) |
| `GET /v1/mesh/nodes` | Live Nodes roster (empty while off) |
| `GET /runtime/v1/mesh/status` | Same JSON through the quiet `/runtime` door |
| `GET /runtime/v1/mesh/nodes` | Same |
| `GET /cite.json` | Hub citation record, including mesh + QNS-CD |

`GET /v1/mesh/status` never enables radios. A 404 or missing origin is `{ enabled: false, mesh: "off", default: "off" }`.

Agent skill for the runtime door: https://www.azieleliab.com/runtime/v1/skill  
Origin skill: https://aziel-runtime.vibelock.workers.dev/v1/skill

## QNS-CD-1.0 cross-map

Coded in `src/mesh.js` as `QNS_CD_SPEC` and `QNS_CD`. Peers read it from mesh status, Live Nodes, `/v1/software` `mesh`, and `/cite.json`.

**THIS IS:** photon QNS1 packet transfer cite. Local qnsd is coded in [qnm-node](https://github.com/AzielEliab/qnm-node). Runtime cites + catalog field live in [aziel-runtime](https://github.com/AzielEliab/aziel-runtime) (`docs/designs/`, `docs/NODE_MESH.md`, `/v1/skill`). Pair custody: [azinterface](https://github.com/AzielEliab/azinterface).

**THIS IS NOT:** a Softwares-tab product, a public qnsd proxy, a Node Gate, or a reason to turn mesh on.

`MESH_NOTE` cites QNS-CD-1.0. Do not implement qnsd on this Worker.

## Compatible clients

ChatGPT, Grok, Venice, Claude, Cursor, Glama, Perplexity, Copilot, Gemini, Mistral, Meta AI, Apple Intelligence, Amazon Q, DuckAssist, You.com, Cohere, plus other MCP/OpenAPI-capable assistants.

Always send `User-Agent: Mozilla/5.0`. Author: **Aziel Eliab** only.
