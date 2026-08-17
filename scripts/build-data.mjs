#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const upstreamCommit = "82bdab83d4b8b63901b575d92e86b2b976b741c8";
const upstreamRepository = "https://github.com/TheCodeArtist/deep-thought-tabs";
const sourcePath = join(repositoryRoot, "sources", "deep-thought-tabs", "deepThoughtsArray.js");

const source = await readFile(sourcePath, "utf8");
const quotes = vm.runInNewContext(`${source}\nquotes`, Object.create(null), { timeout: 1000 });

if (!Array.isArray(quotes) || quotes.length === 0) {
  throw new Error("The vendored Deep Thought Tabs source did not produce a quote array.");
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
  return decodeHtml(html)
    .replace(/<br\s*\/?\s*>/gi, " ")
    .replace(/<br\s*\\?>/gi, " ")
    .replace(/<\/p>\s*<p>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\/?p>/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const seen = new Set();
const records = [];

for (const quote of quotes) {
  const text = plainText(quote);
  if (!text || seen.has(text)) continue;
  seen.add(text);
  records.push({
    id: `deep-thought-${String(records.length + 1).padStart(4, "0")}`,
    creator: "Deep Thought Tabs collection",
    title: "Deep Thought",
    category: "human-curated",
    kind: "upstream-collection",
    text,
    work: "Deep Thought Tabs",
    source_url: `${upstreamRepository}/blob/${upstreamCommit}/addon-src/deepThoughtsArray.js`,
    source_commit: upstreamCommit
  });
}

if (records.length !== quotes.length) {
  throw new Error(`Expected ${quotes.length} unique source entries, produced ${records.length}.`);
}

const collection = {
  schema_version: "3.0.0",
  title: "Deep Thoughts",
  description: "Human-curated funny and mock-profound observations from the Deep Thought Tabs repository.",
  license: "BSD-3-Clause",
  generated_at: "2026-02-04T19:57:37Z",
  generation_notes: "Mechanical HTML-to-plain-text conversion of a pinned upstream collection; no AI-generated entries.",
  record_count: records.length,
  counts_by_category: { "human-curated": records.length },
  upstream: {
    repository: upstreamRepository,
    commit: upstreamCommit,
    source_file: "addon-src/deepThoughtsArray.js"
  },
  records
};

await writeFile(join(repositoryRoot, "thoughts.json"), `${JSON.stringify(collection, null, 2)}\n`);
process.stdout.write(`Wrote ${records.length} human-curated thoughts from Deep Thought Tabs.\n`);
