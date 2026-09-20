import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";
import { donateHtml, embryoLockHtml, pageHtml, sectionPageHtml, whoHtml } from "../src/page.js";
import { aiTxt, citeDoc, jsonLd, llmsTxt, robotsTxt, sitemapXml } from "../src/seo.js";
import {
  ARK_DOWNLOAD,
  AUTHOR_AKA_LIST,
  CANON_ORIGIN,
  HEDIDNTJUMP,
  LIBRARY,
  PERSON_ID,
  PERSON_SAME_AS,
  RUNTIME_ID,
  TAB_PAGES,
  WHO_HREF,
} from "../src/copy.js";
import {
  CONCORDANCE_FAQ_ANSWER,
  CONCORDANCE_FAQ_NAME,
  DISAMBIGUATING_DESCRIPTION,
  HEBREW_ALTERNATE_NAMES,
  HEBREW_NAME_ANSWER,
  HEBREW_NAME_DEFINITION,
  HEBREW_NAME_FORMS,
  personDescription,
  MISSPELLINGS_ANSWER,
  MODEL_RULES,
  NAME_MISSPELLINGS,
  PERSON_JOB_TITLE,
  PERSON_KNOWS_ABOUT,
  SOFTWARE_DEVELOPER_ANSWER,
  WHAT_AZIEL_ELIAB_DOES,
  WHAT_HE_DOES_ANSWER,
  WHAT_HE_DOES_FAQ_NAMES,
  WHAT_HE_DOES_SOFTWARES,
  SOFTWARES_ADDENDUM,
  SPECTRALLOCK_FAQ_ANSWER,
  SPECTRALLOCK_FAQ_NAME,
  SPECTRALLOCK_SOFTWARES_LINE,
  RESEARCH_ADDENDUM,
  HARDWARE_ADDENDUM,
  SITE_COVERAGE,
  SITE_COVERAGE_ANSWER,
  WHY_ANSWER,
  WHY_AZIEL_ELIAB_DOES,
  WHY_FAQ_NAMES,
  MISSION,
  OFFICIAL_ECOSYSTEM_FAQ_NAME,
  LIBRARY_STATS,
  LIBRARY_STATS_FALLBACK,
  STATS_COUNTERS,
  STATS_DATASET_ID,
  ABOUT_ALIAS_HREFS,
  ABOUT_MACHINE_HREFS,
  ABOUT_PAGE_ID,
  ABOUT_PUBLISHED_ANSWER,
  ABOUT_PUBLISHED_LINES,
  VISIBLE_LOCK_LINE,
  WHO_DESCRIPTION,
  WHO_IS_ANSWER,
  WHO_IS_FAQ_ID,
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

describe("GROKBOT-FIX 1.1 identity lock", () => {
  it("locks Person @id and serves identical person/identity JSON-LD", async () => {
    assert.equal(PERSON_ID, "https://www.azieleliab.com/#aziel");
    const person = personJsonLd();
    assert.equal(person["@id"], PERSON_ID);
    assert.equal(person.name, "Aziel Eliab");
    assert.equal(person.description, personDescription());
    assert.ok(person.description.startsWith(WHAT_AZIEL_ELIAB_DOES));
    assert.ok(person.description.includes(WHO_IS_ANSWER));
    assert.ok(person.description.includes(HEBREW_NAME_DEFINITION));
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

  it("keeps compact Hebrew aka and misspelling alternateNames as AZindex tethers", () => {
    const names = personAlternateNames();
    for (const aka of AUTHOR_AKA_LIST) assert.ok(names.includes(aka), aka);
    for (const he of HEBREW_ALTERNATE_NAMES) assert.ok(names.includes(he), he);
    for (const miss of NAME_MISSPELLINGS) assert.ok(names.includes(miss), miss);
    assert.deepEqual(personJsonLd().alternateName, names);
    assert.ok(names.includes(HEBREW_NAME_FORMS.phrase));
    assert.ok(names.includes("עזיאל אלרועי אליאב"));
    assert.ok(names.includes("Aziell"));
    assert.ok(names.includes("The Revealer of The Sealed"));
    assert.ok(names.includes("Revealer of The Sealed"));
    assert.ok(names.includes("Elias Artista"));
    assert.ok(!names.some((n) => /euaziel|Aziel S|Flutter/i.test(n)));
    assert.ok(!names.some((n) => /Everblooming|Flower That Holds The Name/i.test(n)));
  });

  it("includes both Revealer of The Sealed alternateName forms", () => {
    const names = personJsonLd().alternateName;
    assert.ok(AUTHOR_AKA_LIST.includes("The Revealer of The Sealed"));
    assert.ok(AUTHOR_AKA_LIST.includes("Revealer of The Sealed"));
    assert.ok(AUTHOR_AKA_LIST.includes("Elias Artista"));
    assert.ok(names.includes("The Revealer of The Sealed"));
    assert.ok(names.includes("Revealer of The Sealed"));
    assert.ok(names.includes("Elias Artista"));
    assert.deepEqual(names, personAlternateNames());
  });

  it("locks living researcher copy and 15:20 concordance mention", () => {
    const person = personJsonLd();
    assert.equal(person["@id"], "https://www.azieleliab.com/#aziel");
    assert.ok(person.description.startsWith(WHAT_AZIEL_ELIAB_DOES));
    assert.match(person.description, /Aziel Eliab \(also Aziel Elroi Eliab\) is a researcher, digital rights activist, software developer\/designer, author, and philosopher of published work/);
    assert.match(person.description, /two Levitical musicians Aziel and Eliab named together in 1 Chronicles 15:20/);
    assert.ok(person.description.includes(HEBREW_NAME_DEFINITION));
    assert.ok(PERSON_KNOWS_ABOUT.includes(HEBREW_NAME_DEFINITION));
    assert.doesNotMatch(person.description, /Aziel S\.|euaziel|Flutter/i);
    assert.equal(person.disambiguatingDescription, DISAMBIGUATING_DESCRIPTION);
    assert.match(person.disambiguatingDescription, /two Levitical musicians Aziel and Eliab named together in 1 Chronicles 15:20/);
    assert.doesNotMatch(person.disambiguatingDescription, /euaziel|Aziel S\.|Flutter/i);
    assert.deepEqual(person.knowsAbout, PERSON_KNOWS_ABOUT);
    assert.deepEqual(person.jobTitle, PERSON_JOB_TITLE);
    assert.equal(person.additionalName, "Elroi");
    assert.ok(!("birthDate" in person));
    assert.equal(person.mainEntityOfPage, WHO_HREF);
    assert.deepEqual(person.subjectOf, { "@type": "FAQPage", "@id": WHO_IS_FAQ_ID });
    assert.deepEqual(person.sameAs, PERSON_SAME_AS);
    assert.deepEqual(person.relatedLink, [
      "https://www.azieleliab.com/software",
      "https://aziel-runtime.vibelock.workers.dev/",
      "https://www.azieleliab.com/runtime",
    ]);
    assert.ok(person.sameAs.includes("https://www.azieleliab.com/"));
    assert.ok(person.sameAs.includes("https://www.azielcorpuslibrary.net/"));
    assert.ok(person.sameAs.includes("https://godlock.uk/"));
    assert.ok(person.sameAs.includes("https://www.hedidntjump.com/"));
    assert.ok(person.sameAs.includes("https://github.com/AzielEliab"));
    assert.ok(person.sameAs.includes("https://glama.ai/mcp/servers/AzielEliab/aziel-runtime"));
    assert.ok(person.sameAs.includes("https://github.com/azieltherevealerofthesealed-arch"));
    assert.ok(person.sameAs.includes("https://x.com/AzielEliab"));
    assert.equal(person.sameAs.length, 8);
    assert.ok(!person.sameAs.includes("https://www.azieleliab.com/runtime"));
    assert.ok(!person.sameAs.some((href) => /euaziel|flutter|react/i.test(href)));
    assert.ok(!("birthDate" in person));
    assert.ok(!("homeLocation" in person));
    assert.ok(!("address" in person));
    assert.ok(!("worksFor" in person));
    assert.ok(!("givenName" in person));
    assert.ok(!("familyName" in person));
    const blob = JSON.stringify(person) + whoIsTxt() + JSON.stringify(wellKnownAziel());
    assert.doesNotMatch(blob, /10\.\d{4,}\//);
    assert.doesNotMatch(blob, /prophesy|prophet of|revelation of the sealed/i);
    assert.doesNotMatch(person.description + SOFTWARE_DEVELOPER_ANSWER, /Aziel S\.|euaziel|Flutter|React/i);
    assert.doesNotMatch(WHO_IS_ANSWER + SOFTWARE_DEVELOPER_ANSWER + ABOUT_PUBLISHED_ANSWER, /Flutter|React/i);
    assert.doesNotMatch(blob, /React/i);
    assert.doesNotMatch(blob, /Aziel Systems/i);
    assert.ok(!PERSON_SAME_AS.some((href) => /euaziel/i.test(href)));
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
    assert.deepEqual(WHAT_HE_DOES_FAQ_NAMES, [
      "What does Aziel Eliab do?",
      "What Aziel Eliab does",
      "Who is Aziel Eliab the developer?",
      "What software does Aziel Eliab make?",
    ]);
    for (const name of WHAT_HE_DOES_FAQ_NAMES) assert.ok(questions.includes(name), name);
    assert.ok(questions.includes("Who is Aziel Eliab the software developer?"));
    assert.ok(questions.includes(SPECTRALLOCK_FAQ_NAME));
    assert.equal(SPECTRALLOCK_FAQ_NAME, "Does SpectralLock OCR or invent letters from a black-box redaction?");
    assert.ok(questions.includes(CONCORDANCE_FAQ_NAME));
    assert.equal(CONCORDANCE_FAQ_NAME, "Is Aziel Eliab the two musicians named in 1 Chronicles 15:20?");
    assert.ok(questions.some((q) => /1 Chronicles 15:20/i.test(q)));
    assert.ok(questions.some((q) => /Hebrew/i.test(q)));
    assert.ok(questions.some((q) => /misspell/i.test(q)));
    assert.ok(questions.includes("What does the published About say?"));
    assert.ok(questions.includes("What public sites does Aziel Eliab publish?"));
    assert.ok(questions.includes(OFFICIAL_ECOSYSTEM_FAQ_NAME));
    for (const name of WHY_FAQ_NAMES) assert.ok(questions.includes(name), name);
    const answers = faq.mainEntity.map((q) => q.acceptedAnswer.text);
    assert.ok(answers.includes(WHO_IS_ANSWER));
    assert.ok(answers.includes(WHAT_HE_DOES_ANSWER));
    assert.ok(answers.includes(SPECTRALLOCK_FAQ_ANSWER));
    assert.ok(SPECTRALLOCK_FAQ_ANSWER.includes("SL-UNREDACT-OPAQUE"));
    assert.ok(SPECTRALLOCK_FAQ_ANSWER.includes("leftover_bytes"));
    assert.ok(SPECTRALLOCK_FAQ_ANSWER.includes("never invent letters"));
    assert.ok(SPECTRALLOCK_FAQ_ANSWER.includes("Never OCR-from-black-box"));
    assert.ok(SPECTRALLOCK_FAQ_ANSWER.includes("/v1/unredact"));
    assert.ok(SPECTRALLOCK_FAQ_ANSWER.includes("/v1/recover"));
    assert.ok(SPECTRALLOCK_FAQ_ANSWER.includes("/v1/handwriting"));
    assert.ok(SPECTRALLOCK_FAQ_ANSWER.includes("revision_graph"));
    assert.ok(SPECTRALLOCK_FAQ_ANSWER.includes("physical ink scan heuristics"));
    assert.ok(SPECTRALLOCK_FAQ_ANSWER.includes("OCR runs only after structural recovery"));
    assert.ok(WHAT_HE_DOES_ANSWER.startsWith(WHAT_AZIEL_ELIAB_DOES));
    assert.ok(WHAT_HE_DOES_ANSWER.includes(RESEARCH_ADDENDUM));
    assert.ok(WHAT_HE_DOES_ANSWER.includes(HARDWARE_ADDENDUM));
    assert.equal(WHAT_HE_DOES_SOFTWARES, "Softwares via FragGate (~41).");
    assert.ok(WHAT_HE_DOES_ANSWER.includes(WHAT_HE_DOES_SOFTWARES));
    assert.ok(WHAT_HE_DOES_ANSWER.includes(SOFTWARES_ADDENDUM));
    assert.ok(SOFTWARES_ADDENDUM.includes("The ARK"));
    assert.ok(SOFTWARES_ADDENDUM.includes("local deniable vault"));
    assert.ok(SOFTWARES_ADDENDUM.includes("one phrase opens one vault"));
    assert.ok(SOFTWARES_ADDENDUM.includes(ARK_DOWNLOAD));
    assert.ok(SOFTWARES_ADDENDUM.includes("worker_home same host"));
    assert.ok(SOFTWARES_ADDENDUM.includes("Whitestone: ephemeral pro se"));
    assert.ok(SPECTRALLOCK_SOFTWARES_LINE.includes("leftover container bytes recover honestly"));
    assert.ok(SPECTRALLOCK_SOFTWARES_LINE.includes("Never OCR-from-black-box"));
    assert.ok(SPECTRALLOCK_SOFTWARES_LINE.includes("/v1/recover"));
    assert.ok(SPECTRALLOCK_SOFTWARES_LINE.includes("/v1/handwriting"));
    assert.ok(SPECTRALLOCK_SOFTWARES_LINE.includes("revision_graph"));
    assert.doesNotMatch(MISSION.underrated_material, /SpectralLock\/TrajectoryLock advisory only/);
    assert.match(MISSION.underrated_material, /SpectralLock leftover-bytes recover/);
    assert.match(MISSION.underrated_material, /\/v1\/recover/);
    assert.match(MISSION.underrated_material, /\/v1\/handwriting/);
    assert.match(MISSION.underrated_material, /never OCR-from-black-box/);
    assert.match(MISSION.underrated_material, /TrajectoryLock advisory only/);
    assert.doesNotMatch(SOFTWARES_ADDENDUM, /\bviews?\b|\bdownloads?\s+\d|\bcount\s+\d/i);
    const softwareFaq = faq.mainEntity.find((q) => q.name === "What software does Aziel Eliab make?");
    assert.ok(softwareFaq);
    assert.equal(softwareFaq.acceptedAnswer.text, WHAT_HE_DOES_ANSWER);
    assert.ok(softwareFaq.acceptedAnswer.text.includes("The ARK"));
    assert.ok(answers.includes(SOFTWARE_DEVELOPER_ANSWER));
    assert.ok(answers.includes(CONCORDANCE_FAQ_ANSWER));
    assert.ok(answers.includes(HEBREW_NAME_ANSWER));
    assert.ok(answers.includes(MISSPELLINGS_ANSWER));
    assert.ok(answers.includes(ABOUT_PUBLISHED_ANSWER));
    assert.ok(answers.includes(SITE_COVERAGE_ANSWER));
    assert.ok(answers.includes(WHY_ANSWER));
    assert.equal(WHY_ANSWER, WHY_AZIEL_ELIAB_DOES);
    assert.match(WHY_ANSWER, /I keep looking/);
    assert.doesNotMatch(WHY_ANSWER, /1 Chronicles|Flutter|euaziel/i);
    assert.match(WHO_IS_ANSWER, /two Levitical musicians Aziel and Eliab named together in 1 Chronicles 15:20/);
    assert.match(WHO_IS_ANSWER, /x\.com\/AzielEliab/);
    assert.match(WHO_IS_ANSWER, /Try on Glama/);
    assert.match(SOFTWARE_DEVELOPER_ANSWER, /Try on Glama/);
    assert.match(SOFTWARE_DEVELOPER_ANSWER, /X @AzielEliab/);
    assert.match(CONCORDANCE_FAQ_ANSWER, /two Levitical musicians/);
    assert.match(CONCORDANCE_FAQ_ANSWER, /1 Chronicles 15:20/);
    assert.doesNotMatch(SOFTWARE_DEVELOPER_ANSWER, /1 Chronicles/);
    assert.doesNotMatch(HEBREW_NAME_ANSWER, /1 Chronicles/);
    assert.doesNotMatch(ABOUT_PUBLISHED_ANSWER, /1 Chronicles/);
    const faqBlob = JSON.stringify(faq);
    assert.match(faqBlob, /1 Chronicles 15:20/);
    assert.doesNotMatch(faqBlob, /Jaaziel/i);
    assert.ok(faqBlob.includes(CONCORDANCE_FAQ_ANSWER));
    assert.ok(faqBlob.includes(WHO_IS_ANSWER));
    const about = doc["@graph"].find((n) => n["@id"] === ABOUT_PAGE_ID);
    assert.equal(about.description, WHO_IS_ANSWER);
    assert.match(about.description, /1 Chronicles 15:20/);
    assert.ok(about);
    assert.equal(about["@type"], "AboutPage");
    assert.ok(ABOUT_ALIAS_HREFS.every((href) => about.significantLink.includes(href)));
    assert.ok(ABOUT_MACHINE_HREFS.every((href) => about.significantLink.includes(href)));
    assert.equal(person.mainEntityOfPage, WHO_HREF);
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
    assert.ok(body.startsWith(VISIBLE_LOCK_LINE));
    assert.ok(body.includes(WHAT_AZIEL_ELIAB_DOES));
    assert.ok(body.includes(WHAT_HE_DOES_ANSWER));
    assert.ok(body.includes("## What Aziel Eliab does"));
    assert.ok(body.includes("## Why"));
    assert.ok(body.includes(WHY_AZIEL_ELIAB_DOES));
    assert.ok(body.includes("## Official Aziel ecosystem"));
    assert.ok(body.includes("Try on Glama"));
    assert.ok(body.includes("https://x.com/AzielEliab"));
    assert.ok(body.includes("## Softwares"));
    assert.ok(body.includes(WHAT_HE_DOES_SOFTWARES));
    assert.ok(body.includes(SOFTWARES_ADDENDUM));
    assert.ok(body.includes(ARK_DOWNLOAD));
    assert.ok(body.includes("Whitestone — ephemeral pro se."));
    assert.ok(body.includes(SPECTRALLOCK_SOFTWARES_LINE));
    assert.ok(body.includes("PeaceLock — public git https://github.com/AzielEliab/peacelock"));
    assert.ok(body.includes("Runtime is local-only"));
    assert.ok(body.includes("/v1/recover"));
    assert.ok(body.includes("/v1/handwriting"));
    assert.ok(body.includes("revision_graph"));
    assert.ok(body.includes("## Research (Aziel Digital Library MASTER)"));
    assert.ok(body.includes("## Hardware designs (published engineering)"));
    assert.ok(body.includes("AZDOC-9B0E3D62EDCC"));
    assert.ok(body.includes("AZDOC-A011CAD23671"));
    for (const name of WHAT_HE_DOES_FAQ_NAMES) assert.ok(body.includes(name), name);
    assert.ok(body.includes(WHO_IS_ANSWER));
    assert.ok(body.includes(HEBREW_NAME_DEFINITION));
    assert.ok(body.includes(SOFTWARE_DEVELOPER_ANSWER));
    assert.equal(MODEL_RULES.length, 7);
    assert.match(MODEL_RULES[6], /Do not merge this Person with other people/);
    assert.ok(body.includes("7. " + MODEL_RULES[6]));
    assert.ok(body.includes(HEBREW_NAME_FORMS.phrase));
    assert.ok(body.includes("Aziell"));
    assert.ok(body.includes(DISAMBIGUATING_DESCRIPTION));
    assert.match(WHO_IS_ANSWER, /1 Chronicles 15:20/);
    assert.doesNotMatch(SOFTWARE_DEVELOPER_ANSWER, /1 Chronicles|Aziel S\.|Flutter/i);
    assert.doesNotMatch(DISAMBIGUATING_DESCRIPTION, /euaziel|Aziel S\.|Flutter/i);
    assert.doesNotMatch(WHO_IS_ANSWER + "\n" + SOFTWARE_DEVELOPER_ANSWER, /Flutter|euaziel/i);
    assert.doesNotMatch(body.replaceAll(DISAMBIGUATING_DESCRIPTION, ""), /Flutter/i);
    assert.ok(body.includes(LIBRARY_STATS));
    assert.ok(body.includes(LIBRARY_STATS_FALLBACK));
    assert.ok(!body.includes(LIBRARY + "/v1/stats"));
    assert.ok(body.includes(HEDIDNTJUMP + "/api/stats"));
    assert.ok(body.includes("## Published About"));
    assert.ok(body.includes("## Site coverage"));
    assert.equal(SITE_COVERAGE.length, 5);
    assert.deepEqual(SITE_COVERAGE.map((row) => row.id), ["ae", "corpus", "godlock", "hedidntjump", "runtime"]);
    for (const row of SITE_COVERAGE) {
      assert.ok(body.includes(row.label), row.label);
      assert.ok(body.includes(row.url), row.url);
      assert.ok(body.includes(row.blurb), row.blurb);
    }
    for (const line of ABOUT_PUBLISHED_LINES) assert.ok(body.includes(line), line);
    assert.ok(body.includes("You don’t get to know me. You get to understand the work."));
    assert.ok(body.includes("If the work holds, the name was only a handle on the door."));
  });

  it("serves /who HTML with H1 and who-answer, not the visible 15:20 lock line", async () => {
    const res = await fetchPath("/who");
    assert.equal(res.status, 200);
    assert.match(contentType(res), /text\/html/);
    const body = await res.text();
    const visible = body.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style>[\s\S]*?<\/style>/g, "");
    assert.ok(visible.includes("<h1>Who is Aziel Eliab</h1>"));
    assert.ok(visible.includes(WHO_IS_ANSWER));
    assert.ok(!visible.includes(VISIBLE_LOCK_LINE));
    assert.ok(!visible.includes(WHAT_AZIEL_ELIAB_DOES));
    assert.ok(!visible.includes(WHY_AZIEL_ELIAB_DOES));
    assert.ok(!visible.includes(RESEARCH_ADDENDUM));
    assert.ok(!visible.includes(HARDWARE_ADDENDUM));
    assert.ok(!visible.includes(SOFTWARES_ADDENDUM));
    assert.ok(!visible.includes("deniable vault"));
    assert.ok(!visible.includes(ARK_DOWNLOAD));
    assert.ok(!body.includes(VISIBLE_LOCK_LINE));
    assert.ok(body.includes("<title>Who is Aziel Eliab</title>"));
    assert.ok(body.includes('name="description" content="' + WHO_DESCRIPTION + '"'));
    assert.ok(body.includes('rel="canonical" href="' + WHO_HREF + '"'));
    assert.match(body, /two Levitical musicians Aziel and Eliab named together in 1 Chronicles 15:20/);
    const whoPerson = JSON.parse(body.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    assert.equal(whoPerson["@type"], "Person");
    assert.equal(whoPerson["@id"], PERSON_ID);
    assert.ok(whoPerson.alternateName.includes("Elias Artista"));
    assert.ok(whoPerson.description.includes(HEBREW_NAME_DEFINITION));
    assert.ok(whoPerson.sameAs.includes("https://github.com/AzielEliab"));
    assert.ok(whoPerson.sameAs.includes("https://github.com/azieltherevealerofthesealed-arch"));
    assert.ok(!visible.includes("Elias Artista"));
    assert.ok(!visible.includes(HEBREW_NAME_DEFINITION));
    const slash = await fetchPath("/who/");
    assert.equal(slash.status, 200);
    assert.match(contentType(slash), /text\/html/);
  });

  it("serves well-known aziel.json with empty DOIs and live stats URLs only", async () => {
    const res = await fetchPath("/.well-known/aziel.json");
    assert.equal(res.status, 200);
    assert.match(contentType(res), /application\/json/);
    const doc = JSON.parse(await res.text());
    assert.deepEqual(doc, wellKnownAziel());
    assert.equal(doc.person_id, PERSON_ID);
    assert.equal(doc.visible_lock, VISIBLE_LOCK_LINE);
    assert.equal(doc.what_aziel_eliab_does, WHAT_AZIEL_ELIAB_DOES);
    assert.equal(doc.what_he_does_answer, WHAT_HE_DOES_ANSWER);
    assert.deepEqual(doc.what_he_does_faq, WHAT_HE_DOES_FAQ_NAMES);
    assert.equal(doc.what_he_does_softwares, WHAT_HE_DOES_SOFTWARES);
    assert.equal(doc.softwares_addendum, SOFTWARES_ADDENDUM);
    assert.equal(doc.spectrallock.refuse_code, "SL-UNREDACT-OPAQUE");
    assert.equal(doc.spectrallock.fraggate_unredact_door_op, false);
    assert.equal(doc.spectrallock.fraggate_recover_door_op, false);
    assert.equal(doc.spectrallock.fraggate_handwriting_door_op, false);
    assert.equal(doc.spectrallock.sot, "spectrallock#13 LIVE (merge 4af8fcb)");
    assert.equal(doc.peacelock.slug, "peacelock");
    assert.equal(doc.peacelock.github, "https://github.com/AzielEliab/peacelock");
    assert.equal(doc.peacelock.runtime, "local-only");
    assert.equal(doc.peacelock.worker_home, "https://peacelock-download-tracker.vibelock.workers.dev/");
    assert.match(doc.peacelock_note, /public git/);
    assert.equal(doc.softwares_ssot.field, "version");
    assert.equal(doc.softwares_ssot.live, "https://aziel-runtime.vibelock.workers.dev/v1/software");
    assert.equal(doc.softwares_ssot.frozen, "2.0.0-rc1");
    assert.match(doc.softwares_ssot.note, /One public Softwares version/);
    assert.match(doc.spectrallock.recover, /\/v1\/recover$/);
    assert.match(doc.spectrallock.handwriting, /\/v1\/handwriting$/);
    assert.match(doc.mission.underrated_material, /SpectralLock leftover-bytes recover/);
    assert.match(doc.mission.underrated_material, /\/v1\/handwriting/);
    assert.equal(doc.research_addendum, RESEARCH_ADDENDUM);
    assert.equal(doc.hardware_addendum, HARDWARE_ADDENDUM);
    assert.equal(doc.library_front_door.records_packed, 326);
    assert.deepEqual(doc.job_title, PERSON_JOB_TITLE);
    assert.equal(doc.site_coverage.length, 5);
    assert.deepEqual(doc.aka, AUTHOR_AKA_LIST);
    assert.ok(doc.aka.includes("Elias Artista"));
    assert.equal(doc.hebrew_name_definition, HEBREW_NAME_DEFINITION);
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
      "/who",
      "/.well-known/aziel.json",
      "/.well-known/person.jsonld",
    ]) {
      assert.ok(robots.includes("Allow: " + path), path);
      assert.ok(map.includes("<loc>" + CANON_ORIGIN + path + "</loc>"), path);
      assert.ok(llms.includes("GET " + CANON_ORIGIN + path), path);
    }
    assert.ok(robots.includes("Content-Signal: search=yes, ai-input=yes, ai-train=yes"));
    assert.match(robots, /User-agent: \*\nContent-Signal: search=yes, ai-input=yes, ai-train=yes/);
    assert.match(robots, /^Allow: \/who$/m);
    assert.match(robots, /^Allow: \/who\/$/m);
    assert.ok(robots.includes("Allow: /mission"));
    assert.ok(robots.includes("Allow: /aziel"));
    assert.ok(robots.includes("User-agent: GPTBot"));
    assert.ok(robots.includes("User-agent: Claude"));
    assert.ok(robots.includes("User-agent: PerplexityBot"));
    assert.ok(robots.includes("User-agent: Google-Extended"));
    assert.doesNotMatch(robots, /Disallow:\s*\/?$/m);
    assert.doesNotMatch(robots, /User-agent: GPTBot[\s\S]*?Disallow:/);
    assert.doesNotMatch(robots, /User-agent: Claude[\s\S]*?Disallow:/);
    assert.ok(!map.includes("<loc>" + CANON_ORIGIN + "/mission</loc>"));
    assert.ok(map.includes("<loc>" + CANON_ORIGIN + "/why</loc>"));
    assert.ok(map.includes("<loc>" + CANON_ORIGIN + "/AzielEliab</loc>"));
    assert.ok(llms.includes("GROKBOT-FIX 1.1"));
    assert.ok(llms.includes(VISIBLE_LOCK_LINE));
    assert.ok(llms.includes(WHAT_AZIEL_ELIAB_DOES));
    assert.ok(llms.includes(WHAT_HE_DOES_ANSWER));
    assert.ok(llms.includes(WHAT_HE_DOES_SOFTWARES));
    assert.ok(llms.includes(SOFTWARES_ADDENDUM));
    assert.ok(llms.includes("Softwares note: " + SOFTWARES_ADDENDUM));
    assert.ok(llms.includes(RESEARCH_ADDENDUM));
    assert.ok(llms.includes(HARDWARE_ADDENDUM));
    assert.ok(llms.includes("AZDOC-9B0E3D62EDCC"));
    assert.ok(llms.includes("AZDOC-A011CAD23671"));
    for (const name of WHAT_HE_DOES_FAQ_NAMES) assert.ok(llms.includes(name), "llms " + name);
    assert.ok(llms.includes(SPECTRALLOCK_FAQ_NAME));
    assert.ok(llms.includes("SL-UNREDACT-OPAQUE"));
    assert.ok(llms.includes("leftover container bytes recover honestly"));
    assert.ok(llms.includes("physical ink scan heuristics"));
    assert.ok(llms.includes("/v1/recover"));
    assert.ok(llms.includes("/v1/handwriting"));
    assert.ok(llms.includes("revision_graph"));
    assert.ok(llms.includes("OCR runs only after structural recovery"));
    const aiHasBrief = aiTxt();
    assert.ok(aiHasBrief.includes(WHAT_AZIEL_ELIAB_DOES));
    assert.ok(aiHasBrief.includes(WHAT_HE_DOES_SOFTWARES));
    assert.ok(aiHasBrief.includes(SPECTRALLOCK_FAQ_NAME));
    assert.ok(aiHasBrief.includes("SL-UNREDACT-OPAQUE"));
    assert.ok(aiHasBrief.includes("never OCR-from-black-box"));
    assert.ok(aiHasBrief.includes("/v1/recover"));
    assert.ok(aiHasBrief.includes("/v1/handwriting"));
    assert.ok(aiHasBrief.includes("physical ink scan heuristics"));
    assert.ok(aiHasBrief.includes(SOFTWARES_ADDENDUM));
    assert.ok(aiHasBrief.includes("Softwares note: " + SOFTWARES_ADDENDUM));
    assert.ok(aiHasBrief.includes(RESEARCH_ADDENDUM));
    assert.ok(aiHasBrief.includes(HARDWARE_ADDENDUM));
    assert.ok(llms.includes("He Didn't Jump: " + HEDIDNTJUMP + "/"));
    assert.ok(llms.includes("sameAs: " + PERSON_SAME_AS.join(" · ")));
    assert.ok(llms.includes("## Site coverage"));
    assert.ok(llms.includes("ae (this hub)"));
    assert.ok(llms.includes("aziel-runtime FragGate/MCP"));
    const ai = aiTxt();
    assert.ok(ai.includes("## Site coverage"));
    assert.ok(ai.includes("ae (this hub)"));
    assert.ok(ai.includes("aziel-runtime FragGate/MCP"));
    assert.ok(llms.includes("## Software"));
    assert.ok(llms.includes("## Aziel Runtime"));
    assert.ok(llms.includes(HEBREW_NAME_FORMS.phrase));
    assert.ok(llms.includes(HEBREW_NAME_DEFINITION));
    assert.ok(llms.includes("Elias Artista"));
    assert.doesNotMatch(llms, /Everblooming|Flower That Holds The Name/);
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
    assert.ok(!html.includes(VISIBLE_LOCK_LINE));
    const visibleBody = html.split("<body>")[1] || "";
    assert.ok(!visibleBody.includes(VISIBLE_LOCK_LINE));
    assert.ok(!visibleBody.includes(SOFTWARES_ADDENDUM));
    assert.ok(!visibleBody.includes("deniable vault"));
    assert.ok(!visibleBody.includes(ARK_DOWNLOAD));
    assert.ok(!visibleBody.includes("Whitestone"));
    assert.ok(visibleBody.includes("You don’t get to know me."));
    assert.ok(html.includes('href="/.well-known/aziel.json"'));
    assert.ok(!html.includes('id="mission"'));
    assert.ok(!html.includes("<h2>Mission</h2>"));
    assert.ok(!html.includes("<h2>Status</h2>"));
    assert.ok(!html.includes("Awareness of published work, not vanity"));
    assert.ok(!html.includes('class="awareness"'));
    assert.ok(!html.includes(LIBRARY_STATS));
    assert.ok(!html.includes(LIBRARY + "/v1/stats"));
    assert.ok(!html.includes(HEDIDNTJUMP + "/api/stats"));
    assert.ok(html.includes("/v1/stats"));
    const embedded = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    const person = embedded["@graph"].find((n) => n["@type"] === "Person");
    assert.equal(person["@id"], PERSON_ID);
    assert.ok(person.alternateName.includes("Elias Artista"));
    assert.ok(person.description.includes(HEBREW_NAME_DEFINITION));
    assert.ok(person.sameAs.includes("https://github.com/AzielEliab"));
    assert.ok(person.sameAs.includes("https://github.com/azieltherevealerofthesealed-arch"));
    assert.ok(!person.alternateName.some((n) => /Everblooming|Flower That Holds The Name/i.test(n)));
    assert.equal(person.disambiguatingDescription, DISAMBIGUATING_DESCRIPTION);
    const cite = citeDoc();
    assert.equal(cite.person_id, PERSON_ID);
    assert.deepEqual(cite.alternateName, personAlternateNames());
    assert.ok(cite.alternateName.includes("Aziell"));
    assert.ok(cite.alternateName.includes(HEBREW_NAME_FORMS.phrase));
    assert.equal(cite.what_aziel_eliab_does, WHAT_AZIEL_ELIAB_DOES);
    assert.equal(cite.what_he_does_answer, WHAT_HE_DOES_ANSWER);
    assert.deepEqual(cite.what_he_does_faq, WHAT_HE_DOES_FAQ_NAMES);
    assert.equal(cite.what_he_does_softwares, WHAT_HE_DOES_SOFTWARES);
    assert.equal(cite.softwares_addendum, SOFTWARES_ADDENDUM);
    assert.equal(cite.spectrallock.slug, "spectrallock");
    assert.equal(cite.spectrallock.refuse_code, "SL-UNREDACT-OPAQUE");
    assert.equal(cite.spectrallock.fraggate_unredact_door_op, false);
    assert.equal(cite.spectrallock.heatmap_is_transcript, false);
    assert.equal(cite.spectrallock.ocr_from_black_box, false);
    assert.equal(cite.spectrallock.ocr_after_structural_only, true);
    assert.equal(cite.spectrallock.covered_letters_from_context, false);
    assert.equal(cite.spectrallock.esda, false);
    assert.equal(cite.spectrallock.revision_graph, true);
    assert.equal(cite.spectrallock.revision_copies, true);
    assert.equal(cite.spectrallock.fraggate_recover_door_op, false);
    assert.equal(cite.spectrallock.fraggate_handwriting_door_op, false);
    assert.equal(cite.spectrallock.sot, "spectrallock#13 LIVE (merge 4af8fcb)");
    assert.match(cite.spectrallock.recover, /\/v1\/recover$/);
    assert.match(cite.spectrallock.handwriting, /\/v1\/handwriting$/);
    assert.ok(!cite.spectrallock.fraggate_live_ops.includes("recover"));
    assert.ok(!cite.spectrallock.fraggate_live_ops.includes("handwriting"));
    assert.equal(cite.spectrallock.leftover_bytes, true);
    assert.equal(
      cite.spectrallock.engine_digest,
      "3427dbcf2932b6bf4c6cf80735efd171b75519066e013db6d0df275c65989fb4",
    );
    assert.deepEqual(cite.spectrallock.fraggate_live_ops, [
      "health",
      "modes",
      "targets",
      "overlay",
      "verify",
      "doctor",
      "skill",
    ]);
    assert.ok(!cite.spectrallock.fraggate_live_ops.includes("unredact"));
    assert.equal(cite.research_addendum, RESEARCH_ADDENDUM);
    assert.equal(cite.hardware_addendum, HARDWARE_ADDENDUM);
    assert.ok(cite.published_research.some((row) => row.records && row.records.includes("AZDOC-A011CAD23671")));
    assert.ok(cite.published_hardware.some((row) => row.records && row.records.includes("AZDOC-9B0E3D62EDCC")));
    assert.equal(cite.who_is_answer, WHO_IS_ANSWER);
    assert.equal(cite.why_aziel_eliab_does, WHY_AZIEL_ELIAB_DOES);
    assert.deepEqual(cite.why_faq, WHY_FAQ_NAMES);
    assert.equal(cite.official_ecosystem_faq, OFFICIAL_ECOSYSTEM_FAQ_NAME);
    assert.ok(cite.official_ecosystem.some((row) => row.label === "Try on Glama"));
    assert.ok(cite.official_ecosystem.some((row) => row.label === "X @AzielEliab" && row.url === "https://x.com/AzielEliab"));
    assert.ok(cite.official_ecosystem.some((row) => row.label === "Softwares"));
    assert.ok(!cite.official_ecosystem.some((row) => /donate/i.test(row.label)));
    assert.equal(cite.peacelock.slug, "peacelock");
    assert.equal(cite.peacelock.github, "https://github.com/AzielEliab/peacelock");
    assert.equal(cite.peacelock.runtime, "local-only");
    assert.equal(cite.peacelock.public_git, "https://github.com/AzielEliab/peacelock");
    assert.equal(cite.trades_runtime.public_softwares_cite, true);
    assert.equal(cite.softwares_ssot.field, "version");
    assert.equal(cite.softwares_ssot.live, "https://aziel-runtime.vibelock.workers.dev/v1/software");
    assert.equal(cite.softwares_ssot.frozen, "2.0.0-rc1");
    assert.match(cite.softwares_ssot.note, /One public Softwares version/);
    assert.equal(cite.hebrew_name_definition, HEBREW_NAME_DEFINITION);
    assert.ok(cite.aka.includes("Elias Artista"));
    assert.ok(cite.alternateName.includes("Elias Artista"));
    assert.ok(!cite.alternateName.some((n) => /Everblooming|Flower That Holds The Name/i.test(n)));
    assert.ok(cite.sameAs.includes("https://github.com/AzielEliab"));
    assert.ok(cite.sameAs.includes("https://github.com/azieltherevealerofthesealed-arch"));
    assert.equal(cite.github, "https://github.com/AzielEliab");
    assert.equal(cite.github_secondary, "https://github.com/azieltherevealerofthesealed-arch");
    assert.equal(cite.software_developer_answer, SOFTWARE_DEVELOPER_ANSWER);
    assert.equal(cite.disambiguatingDescription, DISAMBIGUATING_DESCRIPTION);
    assert.deepEqual(cite.job_title, PERSON_JOB_TITLE);
    assert.equal(cite.site_coverage.length, 5);
    assert.ok(cite.site_coverage.every((row) => row.id && row.label && row.url && row.blurb));
    assert.equal(cite.who, WHO_HREF);
    assert.equal(cite.visible_lock, VISIBLE_LOCK_LINE);
    assert.match(cite.who_is_answer, /1 Chronicles 15:20/);
    assert.match(JSON.stringify(cite), /1 Chronicles 15:20/);
    assert.match(llmsTxt(), /1 Chronicles 15:20/);
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
    assert.ok(htmlAbout.significantLink.includes(WHO_HREF));
    assert.ok(htmlAbout.significantLink.includes(CANON_ORIGIN + "/graph.jsonld"));
    assert.equal(person.mainEntityOfPage, WHO_HREF);
  });

  it("cross-tethers shared HTML JSON-LD Person on public pages", () => {
    const pages = [
      ["/", pageHtml()],
      ["/who", whoHtml()],
      ["/donate", donateHtml()],
      ["/embryolock", embryoLockHtml()],
      ...TAB_PAGES.map((section) => [section.path, sectionPageHtml(section)]),
    ];
    for (const [path, html] of pages) {
      const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
      const person = ld["@type"] === "Person" ? ld : (ld["@graph"] || []).find((n) => n["@type"] === "Person");
      assert.ok(person, path + " missing Person JSON-LD");
      assert.equal(person["@id"], PERSON_ID, path);
      assert.ok(person.alternateName.includes("Elias Artista"), path);
      assert.ok(person.alternateName.includes("The Revealer of The Sealed"), path);
      assert.ok(person.description.includes(HEBREW_NAME_DEFINITION), path);
      assert.ok(person.sameAs.includes("https://github.com/AzielEliab"), path);
      assert.ok(person.sameAs.includes("https://github.com/azieltherevealerofthesealed-arch"), path);
      assert.ok(!person.alternateName.some((n) => /Everblooming|Flower That Holds The Name/i.test(n)), path);
    }
  });

  it("keeps docs/aziel-identity-schema copies in lockstep with generators", () => {
    assert.equal(read("docs/aziel-identity-schema/person.jsonld"), prettyJson(personJsonLd()));
    assert.equal(read("docs/aziel-identity-schema/identity.jsonld"), prettyJson(personJsonLd()));
    assert.equal(read("docs/aziel-identity-schema/graph.jsonld"), prettyJson(graphJsonLd()));
    assert.equal(read("docs/aziel-identity-schema/who-is-aziel-eliab.txt"), whoIsTxt());
    assert.equal(read("docs/aziel-identity-schema/aziel.json"), prettyJson(wellKnownAziel()));
    assert.equal(read("docs/aziel-identity-schema/who.html"), whoHtml());
  });
});
