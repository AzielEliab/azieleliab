# SOT-OUTLET-1.0 — hub-azieleliab

Author: Aziel Eliab. Identity is Aziel Eliab only.

This hub is one outlet for the aziel-runtime source-of-truth mesh updater. One live change of `GET /v1/software` can fan out here. The hub does not invent a second SoT.

Frozen cite strings in this repo (`231b02f` / `2.0.0-rc1`, no `version_id`) are the cold last-known pin. After a confirm, Worker cite surfaces read the stored pin. They do not wait for another hand-edited cite PR.

## Register

| Field | Value |
| --- | --- |
| Outlet id | `hub-azieleliab` |
| Contract | `SOT-OUTLET-1.0` |
| Discovery | `GET https://www.azieleliab.com/v1/mesh/outlet` |
| Sync | `POST https://www.azieleliab.com/v1/mesh/outlet/sync` |
| Receipt | `GET https://www.azieleliab.com/v1/mesh/outlet/receipt` |
| Authority | `GET https://aziel-runtime.vibelock.workers.dev/v1/software` |
| Binding | `AZIEL_RUNTIME` is tried first, then that HTTPS origin |
| KV key | `sot:outlet:hub-azieleliab` on the existing `VIEWS` namespace |

`GET /v1/mesh/outlet` is the registration card. It does not pull live SoT. Fields the outlet will copy: `version`, `git_sha` (40 hex; short form is the first 7), `count`, and `version_id` only when the live document exposes a non-empty string.

## Pull

The runtime mesh updater (or an operator) posts:

```json
{ "outlet_id": "hub-azieleliab", "dry_run": true }
```

The hub pulls live `GET /v1/software` and returns the pin it would publish, including the cite line, llms line, JSON-LD `softwareVersion`, and homepage runtime line. `dry_run` does not write the pin and does not mint a receipt.

Apply the same body with `"confirm": true` instead of `dry_run`. Confirm stores the pin and appends an `ACT-RECEIPT-1.0` receipt whose `event.kind` is `sot.sync`.

`dry_run` and `confirm` together are refused (`SOT-OUTLET-MODE`). Neither is refused (`SOT-OUTLET-NEEDS-MODE`). `mode` may be `"dry_run"` or `"confirm"` in place of the booleans.

## Push

The same sync URL accepts a signed envelope. The signature is integrity of the fan-out body. It is not permission to publish a different SoT. The hub still pulls live `GET /v1/software` and accepts the push only when `version`, `git_sha`, `count`, and `version_id` match.

```json
{
  "outlet_id": "hub-azieleliab",
  "confirm": true,
  "sot_sync": {
    "v": "SOT-SYNC-1.0",
    "kind": "sot_sync",
    "outlet_id": "hub-azieleliab",
    "authority": "https://aziel-runtime.vibelock.workers.dev/v1/software",
    "sot": {
      "version": "2.0.0-rc1",
      "git_sha": "231b02fcbb7b50fbd52762a49329042bc1715fe9",
      "count": 42
    },
    "sig": "<sha256 hex>"
  }
}
```

`sig` is SHA-256 hex of the canonical JSON of that object with `sig` removed. Canonical JSON sorts keys. `alg` other than `sha256` is refused. A mismatch with the live pull is `SOT-SYNC-MISMATCH` (409). The previous pin stays.

`products`, `software`, `items`, `entries`, `extras`, `downloads`, `views`, and `download` on the body are ignored. They are not turned into Softwares rows and they do not move download counters.

## Unreachable and incomplete

If live `GET /v1/software` does not answer, confirm does not replace the pin and does not mint a receipt. Status is `unreachable`. The served cite stays on the last confirmed pin, or the frozen pin when no confirm has landed. The note says the live SoT was unreachable.

If live answers without a usable `version` and 40-hex `git_sha`, or with a `version_id` that is present but not a string token, status is `incomplete`. Nothing is invented to fill the gap.

## Surfaces a confirm updates

- `GET /cite.json` `runtime_sot` and the top-level git fields
- `GET /llms.txt` and `GET /ai.txt` SoT lines
- JSON-LD `softwareVersion` plus `git_sha` / `git_short` on HTML pages and `GET /graph.jsonld`
- Homepage runtime cite (`aziel-runtime · version · main <short>`)

`GET /v1/software` on this hub remains the product catalog. Its row count is the rows it actually has. The outlet `count` is recorded on the pin and the receipt. A catalog `count` of 42 does not cause this hub to synthesize rows. Ask Jeeves stays suite help, not a Softwares card.

Download and pageview counters use other keys in the same KV namespace. Sync does not write them.

## How this pairs with the runtime mesh updater

The runtime updater owns the fan-out. This outlet is the hub receiver.

1. Read `GET https://www.azieleliab.com/v1/mesh/outlet` and check `outlet_id` is `hub-azieleliab`.
2. `POST /v1/mesh/outlet/sync` with `dry_run: true`. Optionally include `sot_sync` signed as above, built from the same live `GET /v1/software` document the updater just read (`version`, `git_sha`, `count`, and `version_id` only if that document has it).
3. When the dry run reports `would_apply: true`, `POST` the same body with `confirm: true`.
4. Read `GET /v1/mesh/outlet/receipt`. A confirm returns `event.kind` `sot.sync`, `spec` `ACT-RECEIPT-1.0`, and `verified: true` when the stored suffix still links.

If the hub reports `status: "unreachable"` or `status: "incomplete"`, leave the outlet on its last-known pin and retry later. Do not send a substitute version, sha, or `version_id`.

Today’s live authority (checked while this contract was written): `version` `2.0.0-rc1`, `git_sha` `231b02fcbb7b50fbd52762a49329042bc1715fe9`, `count` 42. `version_id` is not exposed.
