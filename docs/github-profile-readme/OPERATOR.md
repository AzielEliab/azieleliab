# Operator: GitHub profile README pack

GitHub **cannot** create `AzielEliab/AzielEliab`. The name case-collides with this Worker repo `AzielEliab/azieleliab` (same repo id). Do not rename or replace the Worker.

This folder is the **GitHub-side index** for Google AI Search, Gemini, GPTBot, and humans: Person `@id`, every public website, machine crawl pointers, and `CITATION.cff`. https://github.com/AzielEliab will not auto-render a profile README until GitHub allows a same-case special repo. This pack is the substitute.

## What to do

**Keep the pack here (default).** After merge, crawlers that read `AzielEliab/azieleliab` can follow [README.md](README.md) and the raw files:

- https://github.com/AzielEliab/azieleliab/blob/main/docs/github-profile-readme/README.md
- https://raw.githubusercontent.com/AzielEliab/azieleliab/main/docs/github-profile-readme/llms.txt
- https://raw.githubusercontent.com/AzielEliab/azieleliab/main/docs/github-profile-readme/cite.json
- https://raw.githubusercontent.com/AzielEliab/azieleliab/main/docs/github-profile-readme/person.jsonld
- https://raw.githubusercontent.com/AzielEliab/azieleliab/main/docs/github-profile-readme/CITATION.cff

Also listed for Google AI in [../github-seo.md](../github-seo.md).

**Or publish the README elsewhere.** Copy [README.md](README.md) (plus `CITATION.cff` / `person.jsonld` / `llms.txt` / `cite.json` if useful) to any public surface you control — a gist, a docs host, or another repo whose name does **not** collide with `azieleliab`. Do not invent tips or DOIs. Do not invent biography, legal name, or home.

**Website field.** GitHub Settings → Public profile → Website = `https://www.azieleliab.com/` (needs `user` scope; this token cannot set `blog`).

## Confirmed non-goals

- Do not `gh repo create AzielEliab/AzielEliab` — GitHub rejects it (same name as `azieleliab`).
- Do not rename this Worker to free the case.
- Hub About boxes (azieleliab / aziel-corpus / godlock / hedidntjump.com / aziel-runtime) are already updated. This pack is the profile-index only.
