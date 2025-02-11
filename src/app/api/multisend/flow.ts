import {
  defaultParser,
  checkAllBalances,
  getFungibleBalance,
  getCollectibleBalance,
  Transfer,
  InsufficientBalanceInfo,
} from "multi-asset-transfer";
import { Address } from "viem";
import { isUrl } from "../../util";
import { fetchSheet, formatDataToCSV } from "../../sheets/";

interface CodeWarning {
  message: string;
  severity: string;
  lineNum: number;
}

export async function csvAirdrop(
  chainId: number,
  safeAddress: Address,
  csv: string | null,
): Promise<{
  transfers: Transfer[];
  warnings: CodeWarning[];
  balances: InsufficientBalanceInfo[];
}> {
  if (!csv) {
    throw new Error("CSV is required");
  }

  if (isUrl(csv)) {
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
  const [fungibleBalances, nftBalances] = await Promise.all([
    getFungibleBalance(chainId, safeAddress),
    getCollectibleBalance(chainId, safeAddress),
  ]);
  const insufficientBalances = checkAllBalances(
    fungibleBalances,
    nftBalances,
    transfers,
  );
  if (insufficientBalances.length > 0) {
    console.warn("Insufficient balance warning", insufficientBalances);
  }
  return { transfers, warnings, balances: insufficientBalances };
}
