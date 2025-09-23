export interface ParsedCSVResponse {
  data: TokenEntry[];
  errors: unknown[];
  meta: MetaData;
}

export type TokenType = "erc20" | "nft" | "native" | "erc721" | "erc1155";

export interface TokenEntry {
  token_type: TokenType;
  token_address: string | null;
  receiver: string;
  amount: string;
  id: string | null;
}

export interface MetaData {
  delimiter: string;
  linebreak: string;
  aborted: boolean;
  truncated: boolean;
  cursor: number;
  renamedHeaders: Record<string, string>;
  fields: string[];
}

export interface RawTokenEntry {
  token_type?: string;
  token_address?: string;
  receiver?: string;
  amount?: string;
  id?: string;
}
