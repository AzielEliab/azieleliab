import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const read = (rel) => readFileSync(new URL("../" + rel, import.meta.url), "utf8");

const PERSON_ID = "https://www.azieleliab.com/#aziel";
const RUNTIME_ID = "https://www.azieleliab.com/runtime#runtime";
const CANON = "https://www.azieleliab.com/";
const CORPUS = "https://www.azielcorpuslibrary.net/";
const GODLOCK = "https://godlock.uk/";
const HEDIDNTJUMP = "https://www.hedidntjump.com/";
const RUNTIME_REPO = "https://github.com/AzielEliab/aziel-runtime";
const GLAMA = "https://glama.ai/mcp/servers/AzielEliab/aziel-runtime";
const DONATE = "https://www.azieleliab.com/donate";
const RUNTIME_WORKER = "https://aziel-runtime.vibelock.workers.dev/";
const TRADES_WORKER = "https://trades-runtime.vibelock.workers.dev/";
const TRADES_REPO = "https://github.com/AzielEliab/trades-runtime";
const GITHUB_USER = "https://github.com/AzielEliab";
const X_URL = "https://x.com/AzielEliab";
const PUBLIC_WEBSITES = [
  CANON,
  CORPUS,
  GODLOCK,
  HEDIDNTJUMP,
  RUNTIME_WORKER,
  GLAMA,
  GITHUB_USER,
  X_URL,
];

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

  it("cross-links Corpus, GodLock, He Didn't Jump, aziel-runtime, Try on Glama, Donate", () => {
    assert.ok(citation.includes(HEDIDNTJUMP), "CITATION.cff He Didn't Jump URL");
    assert.match(citation, /He Didn't Jump/);
    for (const [name, text] of [
      ["README.md", readme],
      ["docs/github-seo.md", docs],
    ]) {
      assert.match(text, /Corpus/, name);
      assert.ok(text.includes(CORPUS), name + " Corpus URL");
      assert.ok(text.includes(GODLOCK), name + " GodLock URL");
      assert.ok(text.includes(HEDIDNTJUMP), name + " He Didn't Jump URL");
      assert.match(text, /He Didn't Jump/, name);
      assert.ok(text.includes(RUNTIME_REPO), name + " aziel-runtime repo");
      assert.ok(text.includes(GLAMA), name + " Try on Glama");
      assert.match(text, /Try on Glama/, name);
      assert.ok(text.includes(DONATE), name + " Donate");
      assert.match(text, /AZL-DONATE-1\.0/, name);
      assert.ok(text.includes(TRADES_WORKER), name + " Trades-Runtime Worker");
      assert.ok(text.includes(TRADES_REPO), name + " Trades-Runtime GitHub");
      assert.match(text, /live_backends false/, name);
      assert.match(text, /sister product/, name);
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
    assert.match(readme, /Softwares via `fraggate_call` only/);
    assert.doesNotMatch(readme, /hasPart[\s\S]{0,800}fraggate_call/);
    assert.doesNotMatch(readme, /runtime_run/);
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

  it("ships a profile README pack that lists every public website", () => {
    const profile = read("docs/github-profile-readme/README.md");
    const profileCite = read("docs/github-profile-readme/cite.json");
    const profileLlms = read("docs/github-profile-readme/llms.txt");
    const profilePerson = read("docs/github-profile-readme/person.jsonld");
    const profileCff = read("docs/github-profile-readme/CITATION.cff");
    const operator = read("docs/github-profile-readme/OPERATOR.md");
    for (const [name, text] of [
      ["docs/github-seo.md", docs],
      ["profile README", profile],
      ["profile llms.txt", profileLlms],
      ["profile cite.json", profileCite],
      ["profile CITATION.cff", profileCff],
    ]) {
      assert.ok(text.includes(PERSON_ID), name + " Person @id");
      for (const url of PUBLIC_WEBSITES) {
        assert.ok(text.includes(url), name + " " + url);
      }
    }
    assert.ok(profilePerson.includes(PERSON_ID));
    assert.match(profile, /researcher/);
    assert.match(profile, /digital rights activist/);
    assert.match(profile, /software developer/);
    assert.match(profile, /author/);
    assert.match(profile, /philosopher/);
    assert.match(profile, /User-Agent: Mozilla\/5\.0/);
    assert.match(profile, /GodLock challenge\/score product/);
    assert.match(profile, /Zioncheck 7 Aug 1936 archive/);
    assert.match(profile, /who-is/);
    assert.ok(profile.includes(TRADES_WORKER));
    assert.ok(profile.includes(TRADES_REPO));
    assert.ok(profileLlms.includes(TRADES_WORKER));
    assert.ok(profileCite.includes(TRADES_WORKER));
    assert.match(profileLlms, /Sister products/);
    assert.match(profileCite, /sister_products/);
    assert.doesNotMatch(profile, /1 Chronicles 15:20/);
    assert.doesNotMatch(profile + profileLlms + profileCite + profileCff, /10\.\d{4,9}\/[\w.-]+/);
    assert.match(profileCff, /alias: Aziel Elroi Eliab/);
    assert.match(profileCff, /repository-code: "https:\/\/github\.com\/AzielEliab\/azieleliab"/);
    assert.match(operator, /Website = `https:\/\/www\.azieleliab\.com\/`/);
    assert.match(operator, /GitHub-side index/);
    assert.match(operator, /cannot\*\* create `AzielEliab\/AzielEliab`/);
    assert.match(docs, /Public websites \(Google AI \/ LLM \/ SEO\)/);
    assert.ok(readme.includes("docs/github-profile-readme/"));
    assert.ok(docs.includes("github-profile-readme/"));
  });

  it("drops scoreboard / survival copy from tip SEO/docs/README", () => {
    const SCOREBOARD = [
      //i,
      //i,
      /durable/i,
      /hard to kill/i,
      /unkillable/i,
      //i,
      /fielded[_-]?100/i,
      /fielded 100/i,
      /69\/100/,
      //,
      /80\+/,
      //i,
      /scoreboard/i,
      /preempt toward/i,
      /never publish fielded/i,
      /never fielded/i,
    ];
    const files = [
      ["README.md", readme],
      ["docs/github-seo.md", docs],
      ["SKILL.md", skill],
      ["docs/github-profile-readme/README.md", read("docs/github-profile-readme/README.md")],
      ["docs/github-profile-readme/llms.txt", read("docs/github-profile-readme/llms.txt")],
      ["docs/github-profile-readme/cite.json", read("docs/github-profile-readme/cite.json")],
      ["docs/aziel-identity-schema/README.md", read("docs/aziel-identity-schema/README.md")],
      ["docs/aziel-identity-schema/who-is-aziel-eliab.txt", read("docs/aziel-identity-schema/who-is-aziel-eliab.txt")],
    ];
    for (const [name, text] of files) {
      for (const ban of SCOREBOARD) {
        assert.doesNotMatch(text, ban, name + " " + ban);
      }
    }
    assert.match(readme, /COLD-MULTI-SHELF|Plane B|SLOT/);
    assert.match(skill, /Plane A/);
    assert.match(skill, /Plane B/);
    assert.match(skill, /SLOT/);
  });
});
