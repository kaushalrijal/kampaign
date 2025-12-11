import * as XLSX from "xlsx";
import { ContactRow } from "../types";

// parse the input file to json
export async function parseFile(file: File): Promise<ContactRow[]> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json<ContactRow>(sheet, { defval: "" });
}