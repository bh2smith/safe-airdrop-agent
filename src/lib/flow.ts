import {
  defaultParser,
  checkAllBalances,
  getFungibleBalance,
  getCollectibleBalance,
  InsufficientBalanceInfo,
} from "multi-asset-transfer";
import { Address } from "viem";
import { fetchSheet, formatDataToCSV } from "./sheets";
import { ResponseData } from "./types";
import { isUrl } from "./util";

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
