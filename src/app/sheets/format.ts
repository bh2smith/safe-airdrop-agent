import { ParsedCSVResponse } from "./types";

// TODO(bh2smith): Maybe use sheet.meta here.
export function formatDataToCSV(sheet: ParsedCSVResponse): string {
  // Define CSV header
  const csvHeader = "token_type,token_address,receiver,amount,id";

  // Map data into CSV rows
  const csvRows = sheet.data.map(
    (entry) =>
      `${entry.token_type},${entry.token_address},${entry.receiver},${entry.amount},${entry.id}`,
  );

  // Join header and rows with newline separator
  return [csvHeader, ...csvRows].join("\n");
}
