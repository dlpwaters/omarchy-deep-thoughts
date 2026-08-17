#!/usr/bin/env node

import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const sourceUrl = "https://www.gutenberg.org/files/972/972-0.txt";
const sourcePage = "https://www.gutenberg.org/ebooks/972";
const headingPattern = /^([A-Z][A-Z'’ -]{1,45}),\s+(.{1,22}?)\s{2,}(.*)$/;
const excludedTerms = new Set([
  "ABORIGINIES", "AFRICAN", "ALIEN", "CHINESE", "HEATHEN", "INDIAN",
  "JEW", "MARRIAGE", "NEGRO", "WIDOW", "WIFE", "WOMAN"
]);
const excludedLanguage =
  /\b(?:aborigin\w*|afric\w*|arab\w*|asian\w*|chinaman|chinese|christian\w*|female\w*|girl\w*|heathen\w*|hebrew\w*|indian\w*|jew\w*|mahom\w*|male\w*|mohammedan\w*|mormon\w*|mulatto|negro|nigger|oriental\w*|race\w*|redskin|savage|squaw|tribe\w*|wife|wives|woman|women)\b/i;

function normalize(lines) {
  return lines.join(" ").replace(/-\s+/g, "-").replace(/\s+/g, " ").trim();
}

function parse(text) {
  const body = text.split("*** START OF THE PROJECT GUTENBERG EBOOK 972 ***")[1]
    ?.split("*** END OF THE PROJECT GUTENBERG EBOOK 972 ***")[0];
  if (!body) throw new Error("Project Gutenberg book markers were not found.");
  const lines = body.replace(/\r/g, "").split("\n");
  const records = [];

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(headingPattern);
    if (!match || !/[a-z]\./.test(match[2])) continue;
    const [, term, partOfSpeech, opening] = match;
    const paragraph = [opening];
    for (let cursor = index + 1; cursor < lines.length && lines[cursor].trim() !== ""; cursor += 1) {
      if (headingPattern.test(lines[cursor])) break;
      paragraph.push(lines[cursor].trim());
    }
    const thought = normalize(paragraph);
    if (excludedTerms.has(term) || excludedLanguage.test(`${term} ${thought}`)
        || thought.length < 12 || thought.length > 360 || /^\[/.test(thought)) continue;

    records.push({
      id: `bierce-${String(records.length + 1).padStart(4, "0")}`,
      creator: "Ambrose Bierce",
      title: term,
      part_of_speech: partOfSpeech.trim(),
      text: thought,
      work: "The Devil's Dictionary",
      source_url: sourcePage,
    });
  }
  return records;
}

const response = await fetch(sourceUrl, { headers: { "user-agent": "omarchy-deep-thoughts/1.0" } });
if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
const records = parse(await response.text());
const collection = {
  schema_version: "1.0.0",
  title: "Deep Thoughts",
  description: "Public-domain satirical definitions curated for an absurdist, aphoristic tone.",
  source_url: sourcePage,
  record_count: records.length,
  records,
};
await writeFile(join(repositoryRoot, "thoughts.json"), `${JSON.stringify(collection, null, 2)}\n`);
process.stdout.write(`Wrote ${records.length} thoughts.\n`);
