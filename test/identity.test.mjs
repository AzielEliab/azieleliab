import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";
import { pageHtml } from "../src/page.js";
import { citeDoc, jsonLd, llmsTxt, robotsTxt, sitemapXml } from "../src/seo.js";
import {
  AUTHOR_AKA_LIST,
  CANON_ORIGIN,
  HEDIDNTJUMP,
  LIBRARY,
  PERSON_ID,
  PERSON_SAME_AS,
  RUNTIME_ID,
} from "../src/copy.js";
import {
  DISAMBIGUATING_DESCRIPTION,
  HEBREW_NAME_ANSWER,
  HEBREW_NAME_FORMS,
  MISSPELLINGS_ANSWER,
  MODEL_RULES,
  NAME_MISSPELLINGS,
  NOT_BIBLICAL_AZIEL_ANSWER,
  NOT_BIBLICAL_ELIAB_ANSWER,
  STATS_COUNTERS,
  STATS_DATASET_ID,
  WHO_IS_ANSWER,
  graphJsonLd,
  personAlternateNames,
  personJsonLd,
  prettyJson,
  wellKnownAziel,
  whoIsTxt,
} from "../src/identity.js";

const read = (rel) => readFileSync(new URL("../" + rel, import.meta.url), "utf8");

async function fetchPath(path) {
  return worker.fetch(new Request("https://www.azieleliab.com" + path), {});
}

function contentType(res) {
  return String(res.headers.get("content-type") || "");
}

describe("GROKBOT-EXEC 1.0 identity lock", () => {
  it("locks Person @id and serves identical person/identity JSON-LD", async () => {
    assert.equal(PERSON_ID, "https://www.azieleliab.com/#aziel");
    const person = personJsonLd();
    assert.equal(person["@id"], PERSON_ID);
    assert.equal(person.name, "Aziel Eliab");
    assert.equal(person.description, WHO_IS_ANSWER);
    assert.equal(person.disambiguatingDescription, DISAMBIGUATING_DESCRIPTION);
    assert.deepEqual(person.knowsLanguage, ["en", "he"]);
    assert.deepEqual(person.sameAs, PERSON_SAME_AS);

    const a = await fetchPath("/person.jsonld");
    const b = await fetchPath("/identity.jsonld");
    assert.equal(a.status, 200);
    assert.equal(b.status, 200);
    assert.match(contentType(a), /application\/ld\+json/);
    assert.match(contentType(b), /application\/ld\+json/);
    const bodyA = await a.text();
    const bodyB = await b.text();
    assert.equal(bodyA, bodyB);
    assert.equal(bodyA, prettyJson(person));
    assert.equal(JSON.parse(bodyA)["@id"], PERSON_ID);
    const wellKnownPerson = await fetchPath("/.well-known/person.jsonld");
    assert.equal(wellKnownPerson.status, 200);
    assert.match(contentType(wellKnownPerson), /application\/ld\+json/);
    assert.equal(await wellKnownPerson.text(), bodyA);
  });

  it("puts canonical aka, Hebrew forms, and misspellings on alternateName", () => {
    const names = personAlternateNames();
    for (const aka of AUTHOR_AKA_LIST) assert.ok(names.includes(aka), aka);
    for (const he of [
      HEBREW_NAME_FORMS.aziel.he,
      HEBREW_NAME_FORMS.aziel.pointed,
      HEBREW_NAME_FORMS.elroi.he,
      HEBREW_NAME_FORMS.elroi.pointed,
      HEBREW_NAME_FORMS.elroi.compact,
      HEBREW_NAME_FORMS.eliab.he,
      HEBREW_NAME_FORMS.eliab.pointed,
      HEBREW_NAME_FORMS.phrase,
    ]) {
      assert.ok(names.includes(he), he);
    }
    for (const miss of NAME_MISSPELLINGS) assert.ok(names.includes(miss), miss);
    assert.deepEqual(personJsonLd().alternateName, names);
  });

  it("disambiguates biblical Aziel and Eliab and keeps no biography fields", () => {
    const person = personJsonLd();
    assert.match(person.disambiguatingDescription, /living public work identity/i);
    assert.match(person.disambiguatingDescription, /Not biblical Aziel/);
    assert.match(person.disambiguatingDescription, /Not biblical Eliab/);
    assert.match(person.disambiguatingDescription, /1 Chronicles/);
    assert.ok(!("birthDate" in person));
    assert.ok(!("homeLocation" in person));
    assert.ok(!("address" in person));
    assert.ok(!("worksFor" in person));
    assert.ok(!("familyName" in person && person.nationality));
    const blob = JSON.stringify(person) + whoIsTxt() + JSON.stringify(wellKnownAziel());
    assert.doesNotMatch(blob, /10\.\d{4,}\//);
    assert.doesNotMatch(blob, /prophesy|prophet of|revelation of the sealed/i);
  });

  it("serves graph.jsonld with Person, five+ FAQ, four hub WebSites, Runtime, Dataset", async () => {
    const res = await fetchPath("/graph.jsonld");
    assert.equal(res.status, 200);
    assert.match(contentType(res), /application\/ld\+json/);
    const doc = JSON.parse(await res.text());
    assert.deepEqual(doc, graphJsonLd());
    const types = doc["@graph"].map((n) => n["@type"]);
    assert.ok(types.includes("Person"));
    assert.ok(types.includes("FAQPage"));
    assert.ok(types.includes("SoftwareApplication"));
    assert.ok(types.includes("Dataset"));
    assert.equal(doc["@graph"].filter((n) => n["@type"] === "WebSite").length, 4);
    const person = doc["@graph"].find((n) => n["@type"] === "Person");
    assert.equal(person["@id"], PERSON_ID);
    const runtime = doc["@graph"].find((n) => n["@id"] === RUNTIME_ID);
    assert.ok(runtime);
    assert.equal(runtime["@type"], "SoftwareApplication");
    const faq = doc["@graph"].find((n) => n["@type"] === "FAQPage");
    const questions = faq.mainEntity.map((q) => q.name);
    assert.ok(questions.includes("Who is Aziel Eliab?"));
    assert.ok(questions.some((q) => /biblical Aziel/i.test(q)));
    assert.ok(questions.some((q) => /biblical Eliab/i.test(q)));
    assert.ok(questions.some((q) => /Hebrew/i.test(q)));
    assert.ok(questions.some((q) => /misspell/i.test(q)));
    const answers = faq.mainEntity.map((q) => q.acceptedAnswer.text);
    assert.ok(answers.includes(WHO_IS_ANSWER));
    assert.ok(answers.includes(NOT_BIBLICAL_AZIEL_ANSWER));
    assert.ok(answers.includes(NOT_BIBLICAL_ELIAB_ANSWER));
    assert.ok(answers.includes(HEBREW_NAME_ANSWER));
    assert.ok(answers.includes(MISSPELLINGS_ANSWER));
    const dataset = doc["@graph"].find((n) => n["@id"] === STATS_DATASET_ID);
    assert.ok(dataset);
    const urls = dataset.distribution.map((d) => d.contentUrl);
    assert.ok(urls.includes(CANON_ORIGIN + "/v1/stats"));
    assert.ok(urls.includes(LIBRARY + "/v1/stats"));
    assert.ok(urls.includes(HEDIDNTJUMP + "/api/stats"));
  });

  it("serves who-is text with verbatim answer, 7 rules, Hebrew, misspellings, stats", async () => {
    const res = await fetchPath("/who-is-aziel-eliab.txt");
    assert.equal(res.status, 200);
    assert.match(contentType(res), /text\/plain/);
    const body = await res.text();
    assert.equal(body, whoIsTxt());
    const alias = await fetchPath("/who-is");
    assert.equal(alias.status, 200);
    assert.match(contentType(alias), /text\/plain/);
    assert.equal(await alias.text(), body);
    assert.ok(body.startsWith(WHO_IS_ANSWER));
    assert.equal(MODEL_RULES.length, 7);
    assert.match(MODEL_RULES[6], /Bible concordance hits.*different persons/);
    assert.ok(body.includes("7. " + MODEL_RULES[6]));
    assert.ok(body.includes(HEBREW_NAME_FORMS.phrase));
    assert.ok(body.includes("Aziell"));
    assert.ok(body.includes(LIBRARY + "/v1/stats"));
    assert.ok(body.includes(HEDIDNTJUMP + "/api/stats"));
  });

  it("serves well-known aziel.json with empty DOIs and live stats URLs only", async () => {
    const res = await fetchPath("/.well-known/aziel.json");
    assert.equal(res.status, 200);
    assert.match(contentType(res), /application\/json/);
    const doc = JSON.parse(await res.text());
    assert.deepEqual(doc, wellKnownAziel());
    assert.equal(doc.person_id, PERSON_ID);
    assert.deepEqual(doc.aka, AUTHOR_AKA_LIST);
    assert.deepEqual(doc.zenodo_dois, []);
    assert.equal(doc.openalex, null);
    assert.equal(doc.hebrew_name_forms.phrase, HEBREW_NAME_FORMS.phrase);
    assert.ok(doc.stats.counters.every((row) => row.url && !("views" in row) && !("count" in row)));
    assert.ok(doc.stats.counters.some((row) => row.url === LIBRARY + "/v1/stats"));
    assert.ok(doc.stats.counters.some((row) => row.url === HEDIDNTJUMP + "/api/stats"));
  });

  it("allows and sitemaps the five identity paths; llms keeps catalog plus lock", () => {
    const robots = robotsTxt();
    const map = sitemapXml();
    const llms = llmsTxt();
    for (const path of [
      "/person.jsonld",
      "/identity.jsonld",
      "/graph.jsonld",
      "/who-is-aziel-eliab.txt",
      "/who-is",
      "/.well-known/aziel.json",
      "/.well-known/person.jsonld",
    ]) {
      assert.ok(robots.includes("Allow: " + path), path);
      assert.ok(map.includes("<loc>" + CANON_ORIGIN + path + "</loc>"), path);
      assert.ok(llms.includes("GET " + CANON_ORIGIN + path), path);
    }
    assert.ok(llms.includes("GROKBOT-EXEC 1.0"));
    assert.ok(llms.includes("He Didn't Jump: " + HEDIDNTJUMP + "/"));
    assert.ok(llms.includes("sameAs: " + PERSON_SAME_AS.join(" · ")));
    assert.ok(llms.includes("## Software"));
    assert.ok(llms.includes("## Aziel Runtime"));
    assert.ok(llms.includes(HEBREW_NAME_FORMS.phrase));
    assert.match(llms, /## Doors[\s\S]*He Didn't Jump/);
  });

  it("embeds identity alternates and awareness receipts on public HTML", () => {
    const html = pageHtml();
    assert.ok(html.includes('href="/person.jsonld"'));
    assert.ok(html.includes('href="/graph.jsonld"'));
    assert.ok(html.includes('href="/who-is-aziel-eliab.txt"'));
    assert.ok(html.includes('href="/.well-known/aziel.json"'));
    assert.ok(html.includes('id="mission"'));
    assert.ok(html.includes("Awareness of published work, not vanity"));
    assert.ok(html.includes(LIBRARY + "/v1/stats"));
    assert.ok(html.includes(HEDIDNTJUMP + "/api/stats"));
    assert.ok(html.includes("/v1/stats"));
    const embedded = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    const person = embedded["@graph"].find((n) => n["@type"] === "Person");
    assert.equal(person["@id"], PERSON_ID);
    assert.equal(person.disambiguatingDescription, DISAMBIGUATING_DESCRIPTION);
    const cite = citeDoc();
    assert.equal(cite.person_id, PERSON_ID);
    assert.equal(cite.library_stats, LIBRARY + "/v1/stats");
    assert.equal(cite.hedidntjump_stats, HEDIDNTJUMP + "/api/stats");
    assert.ok(cite.stats.counters.some((row) => row.url === CANON_ORIGIN + "/v1/stats"));
  });

  it("keeps docs/aziel-identity-schema copies in lockstep with generators", () => {
    assert.equal(read("docs/aziel-identity-schema/person.jsonld"), prettyJson(personJsonLd()));
    assert.equal(read("docs/aziel-identity-schema/identity.jsonld"), prettyJson(personJsonLd()));
    assert.equal(read("docs/aziel-identity-schema/graph.jsonld"), prettyJson(graphJsonLd()));
    assert.equal(read("docs/aziel-identity-schema/who-is-aziel-eliab.txt"), whoIsTxt());
    assert.equal(read("docs/aziel-identity-schema/aziel.json"), prettyJson(wellKnownAziel()));
  });
});
