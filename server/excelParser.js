import xlsx from "xlsx";

export function parseExcel(path) {
  const workbook = xlsx.readFile(path);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const json = xlsx.utils.sheet_to_json(sheet);

  return json.map((row) => `${row.Question}: ${row.Answer}`);
}
