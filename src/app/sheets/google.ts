import Papa from "papaparse";
import {
  ParsedCSVResponse,
  TokenEntry,
  MetaData,
  RawTokenEntry,
  TokenType,
} from "./types";

export async function fetchSheet(url: string): Promise<ParsedCSVResponse> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const csvText = await response.text();
    const parsedData = Papa.parse<RawTokenEntry>(csvText, {
      header: true,
      skipEmptyLines: true,
    });
    const formattedData: TokenEntry[] = parsedData.data.map((entry) => ({
      token_type: (entry.token_type ??
        (entry.token_address ? "erc20" : "native")) as TokenType,
      token_address: entry.token_address ?? null,
      // TODO(bh2smith) These two are required - handle this better!
      receiver: entry.receiver!,
      amount: entry.amount!,
      id: entry.id ?? null,
    }));

    return {
      data: formattedData,
      errors: parsedData.errors,
      meta: parsedData.meta as MetaData,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error fetching or parsing CSV:", message);
    return {
      data: [],
      errors: [{ message }],
      meta: {
        delimiter: ",",
        linebreak: "\n",
        aborted: true,
        truncated: false,
        cursor: 0,
        renamedHeaders: {},
        fields: [],
      },
    };
  }
}
