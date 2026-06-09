import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const file = path.join(root, "translations/source.json");
const rows = JSON.parse(await fs.readFile(file, "utf8"));

async function translate(text, target) {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "en");
  url.searchParams.set("tl", target);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", text);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Translation request failed (${response.status})`);
  const result = await response.json();
  return result[0].map((part) => part[0]).join("");
}

async function worker(queue) {
  while (queue.length) {
    const row = queue.shift();
    if (!row) return;
    if (!row.hindi) row.hindi = await translate(row.english, "hi");
    if (!row.bengali) row.bengali = await translate(row.english, "bn");
    console.log(`Translated ${row.key}`);
  }
}

const queue = rows.filter((row) => !row.hindi || !row.bengali);
await Promise.all(Array.from({ length: 8 }, () => worker(queue)));
await fs.writeFile(file, JSON.stringify(rows, null, 2) + "\n");
console.log(`Populated ${rows.length} rows.`);
