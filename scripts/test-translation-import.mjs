import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import XLSX from "xlsx";

const root = process.cwd();
const sourcePath = path.join(root, "floydee-website-translations.xlsx");

function runImport(file) {
  return spawnSync(process.execPath, [path.join(root, "scripts/import-translations.mjs"), file], {
    cwd: root,
    encoding: "utf8"
  });
}

function writeVariant(name, mutate) {
  const workbook = XLSX.readFile(sourcePath);
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets.Translations, { defval: "" });
  mutate(rows);
  workbook.Sheets.Translations = XLSX.utils.json_to_sheet(rows);
  const file = path.join(os.tmpdir(), `floydee-translations-${name}.xlsx`);
  XLSX.writeFile(workbook, file);
  return file;
}

const valid = runImport(sourcePath);
if (valid.status !== 0) throw new Error(`Valid workbook failed: ${valid.stderr}`);

const cases = [
  ["duplicate", (rows) => rows.push({ ...rows[0] })],
  ["blank", (rows) => { rows[0].Hindi = ""; }],
  ["placeholder", (rows) => { rows[0].Hindi += " {{unexpected}}"; }]
];

for (const [name, mutate] of cases) {
  const result = runImport(writeVariant(name, mutate));
  if (result.status === 0) throw new Error(`Invalid ${name} workbook was accepted.`);
}

console.log("Translation importer accepted the valid workbook and rejected duplicate, blank, and placeholder-invalid workbooks.");
