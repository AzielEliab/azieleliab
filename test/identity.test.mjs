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
  NOT_OTHER_PERSON_ANSWER,
  SOFTWARE_DEVELOPER_ANSWER,
  LIBRARY_STATS,
  LIBRARY_STATS_FALLBACK,
  STATS_COUNTERS,
  STATS_DATASET_ID,
  ABOUT_ALIAS_HREFS,
  ABOUT_MACHINE_HREFS,
  ABOUT_PAGE_ID,
  ABOUT_PUBLISHED_ANSWER,
  ABOUT_PUBLISHED_LINES,
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

  it("puts canonical aka only on Person alternateName", () => {
    const names = personAlternateNames();
    assert.deepEqual(names, AUTHOR_AKA_LIST);
    assert.deepEqual(personJsonLd().alternateName, AUTHOR_AKA_LIST);
    assert.ok(!names.includes(HEBREW_NAME_FORMS.phrase));
    assert.ok(!names.includes("Aziell"));
    for (const miss of NAME_MISSPELLINGS) assert.ok(!names.includes(miss) || AUTHOR_AKA_LIST.includes(miss));
  });

  it("resolves to products, not Flutter or concordance essays, and keeps no biography fields", () => {
    const person = personJsonLd();
    assert.match(person.disambiguatingDescription, /GodLock/);
    assert.match(person.disambiguatingDescription, /Aziel Digital Library/);
    assert.match(person.disambiguatingDescription, /Aziel Runtime/);
    assert.match(person.disambiguatingDescription, /Zioncheck archive/);
    assert.match(person.disambiguatingDescription, /share only the given name Aziel/);
    assert.match(person.description, /living publisher of azieleliab\.com/i);
    assert.match(person.description, /GodLock/);
    assert.match(person.description, /Aziel Digital Library/);
    assert.match(person.description, /Aziel Runtime/);
    assert.match(person.description, /Zioncheck archive/);
    assert.deepEqual(person.knowsAbout, ["GodLock", "Aziel Digital Library", "Aziel Runtime", "Zioncheck archive"]);
    assert.ok(!("jobTitle" in person));
    assert.ok(!("additionalName" in person));
    assert.ok(!("birthDate" in person));
    assert.deepEqual(person.sameAs, PERSON_SAME_AS);
    assert.ok(person.sameAs.includes("https://www.azieleliab.com/"));
    assert.ok(person.sameAs.includes("https://www.azielcorpuslibrary.net/"));
    assert.ok(person.sameAs.includes("https://godlock.uk/"));
    assert.ok(person.sameAs.includes("https://www.hedidntjump.com/"));
    assert.ok(person.sameAs.includes("https://github.com/AzielEliab"));
    assert.ok(person.sameAs.includes("https://glama.ai/mcp/servers/AzielEliab/aziel-runtime"));
    assert.equal(person.sameAs.length, 6);
    assert.ok(!person.sameAs.includes("https://www.azieleliab.com/runtime"));
    assert.ok(!("birthDate" in person));
    assert.ok(!("homeLocation" in person));
    assert.ok(!("address" in person));
    assert.ok(!("worksFor" in person));
    assert.ok(!("familyName" in person && person.nationality));
    const blob = JSON.stringify(person) + whoIsTxt() + JSON.stringify(wellKnownAziel());
    assert.doesNotMatch(blob, /10\.\d{4,}\//);
    assert.doesNotMatch(blob, /prophesy|prophet of|revelation of the sealed/i);
    assert.doesNotMatch(blob, /Aziel S\./);
    assert.doesNotMatch(blob, /Flutter|React|euaziel/i);
    assert.doesNotMatch(JSON.stringify(person), /1 Chronicles|biblical Aziel|Jaaziel/i);
    assert.doesNotMatch(person.description, /1 Chronicles|biblical/i);
    assert.doesNotMatch(person.disambiguatingDescription, /1 Chronicles|biblical/i);
  });

  it("serves graph.jsonld with Person, five+ FAQ, four hub WebSites, Runtime, Dataset", async () => {
    const res = await fetchPath("/graph.jsonld");
    assert.equal(res.status, 200);
    assert.match(contentType(res), /application\/ld\+json/);
    const doc = JSON.parse(await res.text());
    assert.deepEqual(doc, graphJsonLd());
    const types = doc["@graph"].map((n) => n["@type"]);
    assert.ok(types.includes("Person"));
    assert.equal(doc["@graph"].filter((n) => n["@type"] === "Person").length, 1);
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
    assert.equal(faq.name, "Who is Aziel Eliab?");
    const questions = faq.mainEntity.map((q) => q.name);
    assert.ok(questions.includes("Who is Aziel Eliab?"));
    assert.equal(questions[0], "Who is Aziel Eliab?");
    assert.ok(questions.includes("Who is Aziel Eliab the software developer?"));
    assert.ok(questions.some((q) => /other Aziel or Eliab names/i.test(q)));
    assert.ok(questions.some((q) => /Hebrew/i.test(q)));
    assert.ok(questions.some((q) => /misspell/i.test(q)));
    assert.ok(questions.includes("What does the published About say?"));
    assert.ok(!questions.some((q) => /1 Chronicles/i.test(q)));
    const answers = faq.mainEntity.map((q) => q.acceptedAnswer.text);
    assert.ok(answers.includes(WHO_IS_ANSWER));
    assert.ok(answers.includes(SOFTWARE_DEVELOPER_ANSWER));
    assert.ok(answers.includes(NOT_OTHER_PERSON_ANSWER));
    assert.ok(answers.includes(HEBREW_NAME_ANSWER));
    assert.ok(answers.includes(MISSPELLINGS_ANSWER));
    assert.ok(answers.includes(ABOUT_PUBLISHED_ANSWER));
    const faqBlob = JSON.stringify(faq);
    assert.doesNotMatch(faqBlob, /1 Chronicles|Jaaziel|Aziel S\.|Flutter/i);
    const about = doc["@graph"].find((n) => n["@id"] === ABOUT_PAGE_ID);
    assert.ok(about);
    assert.equal(about["@type"], "AboutPage");
    assert.ok(ABOUT_ALIAS_HREFS.every((href) => about.significantLink.includes(href)));
    assert.ok(ABOUT_MACHINE_HREFS.every((href) => about.significantLink.includes(href)));
    assert.deepEqual(person.mainEntityOfPage, ABOUT_ALIAS_HREFS);
    const dataset = doc["@graph"].find((n) => n["@id"] === STATS_DATASET_ID);
    assert.ok(dataset);
    const urls = dataset.distribution.map((d) => d.contentUrl);
    assert.ok(urls.includes(CANON_ORIGIN + "/v1/stats"));
    assert.ok(urls.includes(LIBRARY_STATS));
    assert.ok(urls.includes(LIBRARY_STATS_FALLBACK));
    assert.ok(urls.includes(HEDIDNTJUMP + "/api/stats"));
    assert.ok(!urls.includes(LIBRARY + "/v1/stats"));
  });

  it("cites Digital Library counters at /stats, not /v1/stats", () => {
    const corpus = STATS_COUNTERS.find((row) => row.host === "azielcorpuslibrary.net");
    assert.ok(corpus);
    assert.ok(corpus.url.endsWith("/stats"));
    assert.ok(!corpus.url.endsWith("/v1/stats"));
    assert.equal(corpus.url, LIBRARY + "/stats");
    assert.equal(corpus.url, LIBRARY_STATS);
    assert.equal(corpus.fallback, LIBRARY_STATS_FALLBACK);
    assert.ok(!LIBRARY_STATS.endsWith("/v1/stats"));
    assert.ok(LIBRARY_STATS.endsWith("/stats"));
  });

  it("serves who-is text with verbatim answer, software-dev FAQ, 7 rules, Hebrew, stats", async () => {
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
    assert.ok(body.includes(SOFTWARE_DEVELOPER_ANSWER));
    assert.equal(MODEL_RULES.length, 7);
    assert.match(MODEL_RULES[6], /Do not merge this Person with other people/);
    assert.ok(body.includes("7. " + MODEL_RULES[6]));
    assert.ok(body.includes(HEBREW_NAME_FORMS.phrase));
    assert.ok(!body.includes("Aziell"));
    assert.doesNotMatch(body, /1 Chronicles|biblical Aziel|Aziel S\.|Flutter/i);
    assert.ok(body.includes(LIBRARY_STATS));
    assert.ok(body.includes(LIBRARY_STATS_FALLBACK));
    assert.ok(!body.includes(LIBRARY + "/v1/stats"));
    assert.ok(body.includes(HEDIDNTJUMP + "/api/stats"));
    assert.ok(body.includes("## Published About (work, not biography)"));
    for (const line of ABOUT_PUBLISHED_LINES) assert.ok(body.includes(line), line);
    assert.ok(body.includes("You don’t get to know me. You get to understand the work."));
    assert.ok(body.includes("If the work holds, the name was only a handle on the door."));
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
    assert.ok(doc.stats.counters.some((row) => row.url === LIBRARY_STATS && row.fallback === LIBRARY_STATS_FALLBACK));
    assert.ok(!doc.stats.counters.some((row) => row.url === LIBRARY + "/v1/stats"));
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
    assert.ok(robots.includes("Allow: /mission"));
    assert.ok(robots.includes("Allow: /aziel"));
    assert.ok(robots.includes("User-agent: GPTBot"));
    assert.doesNotMatch(robots, /Disallow:\s*\/?$/m);
    assert.doesNotMatch(robots, /User-agent: GPTBot[\s\S]*?Disallow:/);
    assert.ok(map.includes("<loc>" + CANON_ORIGIN + "/mission</loc>"));
    assert.ok(map.includes("<loc>" + CANON_ORIGIN + "/AzielEliab</loc>"));
    assert.ok(llms.includes("GROKBOT-EXEC 1.0"));
    assert.ok(llms.includes("He Didn't Jump: " + HEDIDNTJUMP + "/"));
    assert.ok(llms.includes("sameAs: " + PERSON_SAME_AS.join(" · ")));
    assert.ok(llms.includes("## Software"));
    assert.ok(llms.includes("## Aziel Runtime"));
    assert.ok(llms.includes(HEBREW_NAME_FORMS.phrase));
    assert.match(llms, /## Doors[\s\S]*He Didn't Jump/);
    assert.match(llms, /## Mission/);
    assert.match(llms, /## Identity[\s\S]*About machine/);
    for (const line of ABOUT_PUBLISHED_LINES) assert.ok(llms.includes(line), "llms " + line);
    assert.ok(llms.includes(LIBRARY_STATS));
    assert.ok(!llms.includes(LIBRARY + "/v1/stats"));
  });

  it("embeds identity alternates and awareness receipts on public HTML", () => {
    const html = pageHtml();
    assert.ok(html.includes('href="/person.jsonld"'));
    assert.ok(html.includes('href="/graph.jsonld"'));
    assert.ok(html.includes('href="/who-is-aziel-eliab.txt"'));
    assert.ok(html.includes('href="/.well-known/aziel.json"'));
    assert.ok(html.includes('id="mission"'));
    assert.ok(html.includes("Awareness of published work, not vanity"));
    assert.ok(html.includes(LIBRARY_STATS));
    assert.ok(!html.includes(LIBRARY + "/v1/stats"));
    assert.ok(html.includes(HEDIDNTJUMP + "/api/stats"));
    assert.ok(html.includes("/v1/stats"));
    const embedded = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    const person = embedded["@graph"].find((n) => n["@type"] === "Person");
    assert.equal(person["@id"], PERSON_ID);
    assert.equal(person.disambiguatingDescription, DISAMBIGUATING_DESCRIPTION);
    const cite = citeDoc();
    assert.equal(cite.person_id, PERSON_ID);
    assert.deepEqual(cite.alternateName, AUTHOR_AKA_LIST);
    assert.equal(cite.who_is_answer, WHO_IS_ANSWER);
    assert.equal(cite.software_developer_answer, SOFTWARE_DEVELOPER_ANSWER);
    assert.doesNotMatch(JSON.stringify(cite.alternateName), /Aziell|עזיאל/);
    assert.equal(cite.library_stats, LIBRARY_STATS);
    assert.equal(cite.library_stats_fallback, LIBRARY_STATS_FALLBACK);
    assert.ok(cite.library_stats.endsWith("/stats"));
    assert.ok(!cite.library_stats.endsWith("/v1/stats"));
    assert.equal(cite.hedidntjump_stats, HEDIDNTJUMP + "/api/stats");
    assert.ok(cite.stats.counters.some((row) => row.url === CANON_ORIGIN + "/v1/stats"));
    assert.deepEqual(cite.about_pages, ABOUT_ALIAS_HREFS);
    assert.deepEqual(cite.about_published, ABOUT_PUBLISHED_LINES);
    assert.deepEqual(cite.about_machine, ABOUT_MACHINE_HREFS);
    const htmlAbout = embedded["@graph"].find((n) => n["@type"] === "AboutPage");
    assert.ok(htmlAbout.significantLink.includes(CANON_ORIGIN + "/person.jsonld"));
    assert.ok(htmlAbout.significantLink.includes(CANON_ORIGIN + "/who-is"));
    assert.ok(htmlAbout.significantLink.includes(CANON_ORIGIN + "/graph.jsonld"));
    assert.deepEqual(person.mainEntityOfPage, ABOUT_ALIAS_HREFS);
  });

  it("keeps docs/aziel-identity-schema copies in lockstep with generators", () => {
    assert.equal(read("docs/aziel-identity-schema/person.jsonld"), prettyJson(personJsonLd()));
    assert.equal(read("docs/aziel-identity-schema/identity.jsonld"), prettyJson(personJsonLd()));
    assert.equal(read("docs/aziel-identity-schema/graph.jsonld"), prettyJson(graphJsonLd()));
    assert.equal(read("docs/aziel-identity-schema/who-is-aziel-eliab.txt"), whoIsTxt());
    assert.equal(read("docs/aziel-identity-schema/aziel.json"), prettyJson(wellKnownAziel()));
  });
});
