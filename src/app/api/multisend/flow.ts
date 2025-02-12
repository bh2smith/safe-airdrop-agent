import {
  defaultParser,
  checkAllBalances,
  getFungibleBalance,
  getCollectibleBalance,
  Transfer,
  InsufficientBalanceInfo,
  CodeWarning,
  buildMetaTransactions,
} from "multi-asset-transfer";
import { Address } from "viem";
import { isUrl } from "../../util";
import { fetchSheet, formatDataToCSV } from "../../sheets/";
import { NextResponse } from "next/server";
import { signRequestFor } from "@bitte-ai/agent-sdk";

type ResponseData = {
  transfers: Transfer[];
  warnings: CodeWarning[];
  balances: InsufficientBalanceInfo[];
};

export async function csvAirdrop(
  chainId: number,
  safeAddress: Address,
  csv: string | null,
  skipBalanceCheck: boolean = false,
): Promise<ResponseData> {
  if (!csv) {
    throw new Error("CSV is required");
  }

  if (isUrl(csv)) {
    console.log("Got CSV URL", csv);
    const sheet = await fetchSheet(csv);
    csv = formatDataToCSV(sheet);
  }
  console.log("Parse CSV\n", csv);

  const parser = defaultParser(chainId);
  const [transfers, warnings] = await parser(csv);
  if (warnings.length > 0) {
    console.warn("Parser Warnings", warnings);
  }
  // Add From to NFT transfers:
  transfers.forEach((transfer) => {
    if ("from" in transfer) {
      transfer.from = safeAddress;
    }
  });
  let insufficientBalances: InsufficientBalanceInfo[] = [];
  if (!skipBalanceCheck) {
    const [fungibleBalances, nftBalances] = await Promise.all([
      getFungibleBalance(chainId, safeAddress),
      getCollectibleBalance(chainId, safeAddress),
    ]);
    insufficientBalances = checkAllBalances(
      fungibleBalances,
      nftBalances,
      transfers,
    );
    if (insufficientBalances.length > 0) {
      console.warn("Insufficient balance warning", insufficientBalances);
    }
  }
  return { transfers, warnings, balances: insufficientBalances };
}

export function buildResponse(
  chainId: number,
  { transfers, warnings, balances }: ResponseData,
): NextResponse {
  const transaction = signRequestFor({
    chainId,
    metaTransactions: buildMetaTransactions(transfers),
  });
  console.log("Sign Request", transaction);
  return NextResponse.json({
    transaction,
    meta: {
      transfers,
      warnings: { parse: warnings, balances },
    },
  });
}
