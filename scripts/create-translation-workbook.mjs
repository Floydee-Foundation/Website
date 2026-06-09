import fs from "node:fs/promises";
import path from "node:path";
import XLSX from "xlsx";

const root = process.cwd();
const rows = JSON.parse(await fs.readFile(path.join(root, "translations/source.json"), "utf8"));
const output = path.join(root, "floydee-website-translations.xlsx");

const instructions = [
  ["Floydee Website Translation Workbook"],
  ["Purpose", "Review and update all English, Hindi, and Bengali website copy."],
  ["Workflow", "Edit only Hindi, Bengali, status, and translator notes. Keep keys and English source text unchanged."],
  ["Import", "Export as .xlsx, then run: npm run translations:import -- <path-to-file.xlsx>"],
  ["Validation", "The importer rejects duplicate keys, missing translations, changed English source, and mismatched {{placeholders}}."],
  ["Status", "Change status from AI draft - review to Reviewed after translator approval."],
  ["Protected terms", "Use the Glossary sheet. Program names, legal identifiers, URLs, emails, and phone numbers stay unchanged."]
];
const translationRows = rows.map((row) => ({
  key: row.key,
  surface: row.surface,
  "page name": row.pageName,
  route: row.route,
  section: row.section,
  context: row.context,
  English: row.english,
  Hindi: row.hindi,
  Bengali: row.bengali,
  status: row.status,
  "translator notes": row.translatorNotes
}));
const glossary = [
  ["Term", "Rule", "Notes"],
  ["AAROHI", "Keep unchanged", "Program name"],
  ["SAKHI", "Keep unchanged", "Program name"],
  ["VIDYA", "Keep unchanged", "Program name"],
  ["Floydee Future Foundation", "Keep unchanged", "Registered organization name"],
  ["PAN", "Keep unchanged", "Legal identifier label"],
  ["80G", "Keep unchanged", "Tax benefit identifier"],
  ["AAGCF6699F", "Keep unchanged", "PAN value"],
  ["AAGCF6699FF20261", "Keep unchanged", "80G value"],
  ["contact@floydeefoundation.org", "Keep unchanged", "Email"],
  ["URLs, phone numbers, personal names", "Keep unchanged", "Do not translate"]
];

const workbook = XLSX.utils.book_new();
const instructionSheet = XLSX.utils.aoa_to_sheet(instructions);
const translationsSheet = XLSX.utils.json_to_sheet(translationRows);
const glossarySheet = XLSX.utils.aoa_to_sheet(glossary);
instructionSheet["!cols"] = [{ wch: 24 }, { wch: 110 }];
translationsSheet["!cols"] = [
  { wch: 14 }, { wch: 16 }, { wch: 38 }, { wch: 24 }, { wch: 16 }, { wch: 28 },
  { wch: 55 }, { wch: 55 }, { wch: 55 }, { wch: 20 }, { wch: 34 }
];
translationsSheet["!autofilter"] = { ref: translationsSheet["!ref"] };
translationsSheet["!freeze"] = { xSplit: 0, ySplit: 1 };
glossarySheet["!cols"] = [{ wch: 34 }, { wch: 22 }, { wch: 48 }];
XLSX.utils.book_append_sheet(workbook, instructionSheet, "Instructions");
XLSX.utils.book_append_sheet(workbook, translationsSheet, "Translations");
XLSX.utils.book_append_sheet(workbook, glossarySheet, "Glossary");
XLSX.writeFile(workbook, output);
console.log(output);
