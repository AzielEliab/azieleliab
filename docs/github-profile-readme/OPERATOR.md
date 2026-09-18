# Operator: create `AzielEliab/AzielEliab`

GitHub shows a profile README on https://github.com/AzielEliab only when a **public** repo named **exactly** `AzielEliab` (same case as the login) has a non-empty root `README.md`.

This folder is the file pack for that special repo. It is **not** the profile README while it lives under `AzielEliab/azieleliab`.

## Why this agent could not create the repo

1. **Name collision.** GitHub repository names are case-insensitive. `GET /repos/AzielEliab/AzielEliab` already resolves to the landing Worker `AzielEliab/azieleliab` (same `id`). A second repo that differs only by case cannot exist.
2. **Token scope.** This Cursor GitHub App installation can write `AzielEliab/azieleliab` only. `POST /user/repos` and `gh repo create` return `Resource not accessible by integration`. The user `blog` / Website field also needs `user` scope — this token cannot set it.

Do **not** rename or replace the Worker repo from this pack. The operator chooses one of the paths below.

## Path A (separate repos — matches the requested layout)

Free the exact-case name, then create the profile repo.

```bash
# 1. Rename the landing Worker so AzielEliab is free
gh repo rename azieleliab-com --repo AzielEliab/azieleliab

# 2. Create the profile special repo
gh repo create AzielEliab/AzielEliab --public \
  --homepage "https://www.azieleliab.com/" \
  --description "Aziel Eliab profile README. Person hub azieleliab.com · Corpus · GodLock · He Didn't Jump · Aziel Runtime · Glama. Identity Aziel Eliab only."

# 3. Copy this folder to the new repo root (README.md, CITATION.cff, person.jsonld, llms.txt, cite.json)

# 4. About box
gh repo edit AzielEliab/AzielEliab \
  --homepage "https://www.azieleliab.com/" \
  --description "Aziel Eliab profile README. Person hub azieleliab.com · Corpus · GodLock · He Didn't Jump · Aziel Runtime · Glama. Identity Aziel Eliab only." \
  --add-topic aziel-eliab \
  --add-topic profile-readme \
  --add-topic seo \
  --add-topic google-ai \
  --add-topic json-ld \
  --add-topic mcp
```

After Path A, https://github.com/AzielEliab will render this `README.md`. Update Worker remotes / badges from `azieleliab` to `azieleliab-com`.

## Path B (same repo, exact-case name)

Case-rename the Worker so it *becomes* the profile special repo, then put this short README at the Worker root and move Worker docs aside. This is **not** a separate repo.

```bash
gh repo rename AzielEliab --repo AzielEliab/azieleliab
```

Only use Path B if you accept one repo for both Worker and profile.

## Website field (user profile)

This token cannot set GitHub **Settings → Public profile → Website**. Operator: set Website = `https://www.azieleliab.com/`.

## About box (copy)

| Field | Value |
|-------|--------|
| Homepage | `https://www.azieleliab.com/` |
| Description | `Aziel Eliab profile README. Person hub azieleliab.com · Corpus · GodLock · He Didn't Jump · Aziel Runtime · Glama. Identity Aziel Eliab only.` |
| Topics | `aziel-eliab` · `profile-readme` · `seo` · `google-ai` · `json-ld` · `mcp` |
