import { formatDataToCSV } from "@/src/app/sheets/format";
import { extractSheetId, fetchSheet } from "@/src/app/sheets/google";

describe("sheets", () => {
  it("google", async () => {
    const url =
      "https://docs.google.com/spreadsheets/d/1arxFjc-pLh9m_Uf27EGsqNtu3PNcUsyzA4J0__cUnk4/export?format=csv";
    const sheet = await fetchSheet(url);
    const asStr = formatDataToCSV(sheet);
    console.log(asStr);
  });

  it("sheetId", async () => {
    const expected = "1arxFjc-pLh9m_Uf27EGsqNtu3PNcUsyzA4J0__cUnk4";
    expect(
      extractSheetId(
        "https://docs.google.com/spreadsheets/d/1arxFjc-pLh9m_Uf27EGsqNtu3PNcUsyzA4J0__cUnk4/edit?gid=0#gid=0",
      ),
    ).toBe(expected);
    expect(
      extractSheetId(
        "https://docs.google.com/spreadsheets/d/1arxFjc-pLh9m_Uf27EGsqNtu3PNcUsyzA4J0__cUnk4/export?format=csv",
      ),
    ).toBe(expected);
  });
});
