import { MetaTransaction, SignRequest } from "@bitte-ai/agent-sdk/evm";
import { buildMetaTransactions } from "multi-asset-transfer";
import { ResponseData } from "./types.js";
export function isUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function buildResponse(
  chainId: number,
  { transfers, warnings, balances }: ResponseData,
): { transaction: SignRequest; meta: ResponseData } {
  return {
    transaction: {
      method: "eth_sendTransaction",
      chainId,
      params: buildMetaTransactions(transfers) as MetaTransaction[],
    },
    meta: { transfers, warnings, balances },
  };
}
