import fs from "node:fs/promises";
import path from "node:path";
import XLSX from "xlsx";

const root = process.cwd();
const input = process.argv[2];
if (!input) throw new Error("Usage: npm run translations:import -- <file.xlsx>");

const workbook = XLSX.readFile(path.resolve(input));
const sheet = workbook.Sheets.Translations;
if (!sheet) throw new Error("Workbook must contain a Translations sheet.");
const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
const sourceRows = JSON.parse(await fs.readFile(path.join(root, "translations/source.json"), "utf8"));
const sourceByKey = new Map(sourceRows.map((row) => [row.key, row]));
const seen = new Set();
const placeholders = (value) => [...String(value).matchAll(/\{\{(\w+)\}\}/g)].map((match) => match[1]).sort().join(",");

for (const [index, row] of rows.entries()) {
  const line = index + 2;
  if (!row.key || seen.has(row.key)) throw new Error(`Duplicate or missing key at row ${line}.`);
  seen.add(row.key);
  const source = sourceByKey.get(row.key);
  if (!source) throw new Error(`Unknown key ${row.key} at row ${line}.`);
  if (row.English !== source.english) throw new Error(`English source changed for ${row.key}.`);
  if (!String(row.Hindi).trim() || !String(row.Bengali).trim()) throw new Error(`Missing required translation for ${row.key}.`);
  for (const value of [row.Hindi, row.Bengali]) {
    if (placeholders(value) !== placeholders(row.English)) throw new Error(`Placeholder mismatch for ${row.key}.`);
  }
}
if (seen.size !== sourceRows.length) throw new Error(`Workbook has ${seen.size} rows; expected ${sourceRows.length}.`);

const catalogs = { hi: {}, bn: {} };
for (const row of rows) {
  catalogs.hi[row.English] = row.Hindi;
  catalogs.bn[row.English] = row.Bengali;
}
await fs.writeFile(
  path.join(root, "packages/shared/src/generated/translations.json"),
  JSON.stringify(catalogs, null, 2) + "\n"
);
console.log(`Imported ${rows.length} translations for hi and bn.`);
