import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const read = (rel) => readFileSync(new URL("../" + rel, import.meta.url), "utf8");

const PERSON_ID = "https://www.azieleliab.com/#aziel";
const RUNTIME_ID = "https://www.azieleliab.com/runtime#runtime";
const CANON = "https://www.azieleliab.com/";
const CORPUS = "https://www.azielcorpuslibrary.net/";
const GODLOCK = "https://godlock.uk/";
const RUNTIME_REPO = "https://github.com/AzielEliab/aziel-runtime";
const GLAMA = "https://glama.ai/mcp/servers/AzielEliab/aziel-runtime";
const DONATE = "https://www.azieleliab.com/donate";

const AI_CLIENTS = [
  "ChatGPT",
  "Grok",
  "Venice",
  "Claude",
  "Cursor",
  "Glama",
  "Perplexity",
  "Copilot",
  "Gemini",
  "Mistral",
  "Meta AI",
  "Apple Intelligence",
  "Amazon Q",
  "DuckAssist",
  "You.com",
  "Cohere",
];

const NAMED_TOOLS = [
  "FragGate",
  "ForgeReceipts",
  "DecisionGate",
  "TemporalLock",
  "TrajectoryLock",
  "PeaceLock",
  "GodLock",
  "AZ-OS",
  "AZCoherence",
  "4DMap",
  "Aziel Corpus",
  "Ask Jeeves",
  "AZBrowser",
  "AZMail",
  "AZHub",
  "AZInterface",
  "SpectralLock",
  "ShadowLock",
  "FoldLock",
  "CodeLock",
  "VibeLock",
];

describe("GitHub-side SEO / ecosystem docs", () => {
  const readme = read("README.md");
  const docs = read("docs/github-seo.md");
  const skill = read("SKILL.md");
  const citation = read("CITATION.cff");
  const funding = read(".github/FUNDING.yml");
  const pkg = JSON.parse(read("package.json"));

  it("locks Person and Runtime @ids on GitHub-facing files", () => {
    for (const [name, text] of [
      ["README.md", readme],
      ["docs/github-seo.md", docs],
      ["SKILL.md", skill],
      ["CITATION.cff", citation],
    ]) {
      assert.match(text, new RegExp(PERSON_ID.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), name + " Person @id");
      assert.match(text, new RegExp(RUNTIME_ID.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), name + " Runtime @id");
    }
  });

  it("cross-links Corpus, GodLock, aziel-runtime, Try on Glama, Donate", () => {
    for (const [name, text] of [
      ["README.md", readme],
      ["docs/github-seo.md", docs],
    ]) {
      assert.match(text, /Corpus/, name);
      assert.ok(text.includes(CORPUS), name + " Corpus URL");
      assert.ok(text.includes(GODLOCK), name + " GodLock URL");
      assert.ok(text.includes(RUNTIME_REPO), name + " aziel-runtime repo");
      assert.ok(text.includes(GLAMA), name + " Try on Glama");
      assert.match(text, /Try on Glama/, name);
      assert.ok(text.includes(DONATE), name + " Donate");
      assert.match(text, /AZL-DONATE-1\.0/, name);
    }
  });

  it("cites Aziel Runtime 2.0.0-rc1 and hasPart named tools", () => {
    assert.match(readme, /2\.0\.0-rc1/);
    assert.match(docs, /2\.0\.0-rc1/);
    assert.match(citation, /2\.0\.0-rc1/);
    assert.match(readme, /hasPart/);
    assert.match(docs, /hasPart/);
    for (const name of NAMED_TOOLS) {
      assert.ok(readme.includes(name), "README named tool " + name);
      assert.ok(docs.includes(name), "docs named tool " + name);
    }
    assert.doesNotMatch(readme, /fraggate_call|runtime_run/);
    assert.doesNotMatch(docs, /as schema entities[\s\S]*fraggate_call/);
  });

  it("lists the full AI client set", () => {
    for (const [name, text] of [
      ["README.md", readme],
      ["docs/github-seo.md", docs],
      ["SKILL.md", skill],
    ]) {
      for (const client of AI_CLIENTS) {
        assert.ok(text.includes(client), name + " client " + client);
      }
    }
  });

  it("keeps identity Aziel Eliab only (Elroi as aka)", () => {
    assert.match(readme, /Aziel Eliab/);
    assert.match(readme, /Aziel Elroi Eliab/);
    assert.match(readme, /aka only|alternateName/);
    assert.match(docs, /Elroi appears only as aka|alternateName/);
    assert.match(citation, /alias: Aziel Elroi Eliab/);
    assert.doesNotMatch(readme + docs + skill, /https:\/\/azieleliab\.com\/#aziel(?!-eliab)/);
    assert.doesNotMatch(readme + docs + skill, /https:\/\/www\.azieleliab\.com\/#aziel-eliab/);
  });

  it("specifies GitHub homepage, description, and topics", () => {
    assert.ok(docs.includes("--homepage \"https://www.azieleliab.com/\""));
    assert.match(docs, /--description "Public landing for Aziel Eliab/);
    for (const topic of [
      "aziel-eliab",
      "aziel-runtime",
      "godlock",
      "glama",
      "mcp",
      "json-ld",
      "seo",
      "donate",
    ]) {
      assert.ok(docs.includes("--add-topic " + topic), "topic " + topic);
    }
    assert.ok(readme.includes("docs/github-seo.md"));
    assert.equal(CANON, "https://www.azieleliab.com/");
  });

  it("points package.json and FUNDING at the www landing / Donate", () => {
    assert.match(pkg.description, /azieleliab\.com/);
    assert.match(pkg.description, /Aziel Eliab/);
    assert.match(pkg.description, /2\.0\.0-rc1|#aziel/);
    assert.ok(funding.includes(DONATE));
    assert.match(funding, /AZL-DONATE-1\.0/);
  });
});
