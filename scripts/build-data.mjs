#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)));

const sources = {
  fortunes: {
    repository: "https://github.com/JKirchartz/fortunes",
    commit: "e9657c7521887d83cd932e4a95a210e9cdde8fab"
  },
  deepThoughtTabs: {
    repository: "https://github.com/TheCodeArtist/deep-thought-tabs",
    commit: "82bdab83d4b8b63901b575d92e86b2b976b741c8"
  }
};

function normalize(text) {
  return text
    .replace(/``/g, '"')
    .replace(/''/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function parseFortunes(source) {
  return source
    .split(/^%\s*$/m)
    .map(entry => entry.trim())
    .filter(Boolean);
}

function decodeHtml(text) {
  return text
    .replace(/&quot;/gi, '"')
    .replace(/&#(?:39|x27);/gi, "'")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function plainText(html) {
  return normalize(decodeHtml(html)
    .replace(/<br\s*\/?\s*>/gi, " ")
    .replace(/<br\s*\\?>/gi, " ")
    .replace(/<\/p>\s*<p>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\/?p>/gi, " "));
}

function removeLastLine(entry) {
  const lines = entry.split("\n");
  const attribution = lines.pop().trim();
  return { text: normalize(lines.join("\n")), attribution };
}

const records = [];
const seen = new Set();
const sourceCounts = { "jack-handey": 0, showerthoughts: 0, "deep-thought-tabs": 0 };
const duplicateCounts = { "jack-handey": 0, showerthoughts: 0, "deep-thought-tabs": 0 };

function addRecord(record) {
  const text = normalize(record.text);
  const dedupeKey = text.toLocaleLowerCase("en-US");
  if (!text || seen.has(dedupeKey)) {
    duplicateCounts[record.category] += 1;
    return;
  }

  seen.add(dedupeKey);
  sourceCounts[record.category] += 1;
  records.push({
    id: `deep-thought-${String(records.length + 1).padStart(5, "0")}`,
    ...record,
    text
  });
}

const handeyPath = join(repositoryRoot, "sources", "jkirchartz-fortunes", "handey");
const handeyEntries = parseFortunes(await readFile(handeyPath, "utf8"));

for (const entry of handeyEntries) {
  const { text } = removeLastLine(entry);
  addRecord({
    creator: "Jack Handey",
    title: "Jack Handey",
    category: "jack-handey",
    kind: "attributed-quotation",
    text,
    work: "Deep Thoughts and other collected quotations",
    source_url: `${sources.fortunes.repository}/blob/${sources.fortunes.commit}/handey`,
    source_commit: sources.fortunes.commit
  });
}

const showerthoughtsPath = join(repositoryRoot, "sources", "jkirchartz-fortunes", "showerthoughts");
const showerthoughtEntries = parseFortunes(await readFile(showerthoughtsPath, "utf8"));

for (const entry of showerthoughtEntries) {
  const { text, attribution } = removeLastLine(entry);
  const match = attribution.match(/^―(.+?),\s*([A-Z][a-z]{2}\s+\d{4})$/u);
  addRecord({
    creator: match ? `u/${match[1]}` : attribution.replace(/^―/u, "").trim(),
    title: "Shower Thought",
    category: "showerthoughts",
    kind: "reddit-submission",
    text,
    work: "Reddit r/Showerthoughts collection",
    source_date: match ? match[2] : null,
    source_url: `${sources.fortunes.repository}/blob/${sources.fortunes.commit}/showerthoughts`,
    source_commit: sources.fortunes.commit
  });
}

const deepThoughtTabsPath = join(repositoryRoot, "sources", "deep-thought-tabs", "deepThoughtsArray.js");
const deepThoughtTabsSource = await readFile(deepThoughtTabsPath, "utf8");
const deepThoughtTabsQuotes = vm.runInNewContext(
  `${deepThoughtTabsSource}\nquotes`,
  Object.create(null),
  { timeout: 1000 }
);

for (const quote of deepThoughtTabsQuotes) {
  addRecord({
    creator: "Deep Thought Tabs collection",
    title: "Deep Thought",
    category: "deep-thought-tabs",
    kind: "upstream-collection",
    text: plainText(quote),
    work: "Deep Thought Tabs",
    source_url: `${sources.deepThoughtTabs.repository}/blob/${sources.deepThoughtTabs.commit}/addon-src/deepThoughtsArray.js`,
    source_commit: sources.deepThoughtTabs.commit
  });
}

if (handeyEntries.length !== 529) {
  throw new Error(`Expected 529 Handey source entries, received ${handeyEntries.length}.`);
}
if (showerthoughtEntries.length !== 10000) {
  throw new Error(`Expected 10000 Showerthought source entries, received ${showerthoughtEntries.length}.`);
}
if (!Array.isArray(deepThoughtTabsQuotes) || deepThoughtTabsQuotes.length !== 177) {
  throw new Error(`Expected 177 Deep Thought Tabs entries, received ${deepThoughtTabsQuotes.length}.`);
}

const collection = {
  schema_version: "4.0.0",
  title: "Deep Thoughts",
  description: "Human-written Jack Handey quotations, attributed Reddit shower thoughts, and the Deep Thought Tabs collection.",
  license: "Mixed; see DATA-LICENSE",
  generated_at: "2026-08-17T00:00:00Z",
  generation_notes: "Mechanical parsing and deduplication of pinned human-written collections; no AI-generated entries.",
  record_count: records.length,
  counts_by_category: sourceCounts,
  duplicates_omitted_by_category: duplicateCounts,
  upstream: sources,
  records
};

await writeFile(join(repositoryRoot, "thoughts.json"), `${JSON.stringify(collection, null, 2)}\n`);
process.stdout.write(`Wrote ${records.length} human-written thoughts.\n`);
process.stdout.write(`${JSON.stringify({ sourceCounts, duplicateCounts })}\n`);
