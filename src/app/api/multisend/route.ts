import {
  defaultParser,
  buildMetaTransactions,
  checkAllBalances,
  getFungibleBalance,
  getCollectibleBalance,
} from "multi-asset-transfer";
import {
  FieldParser,
  signRequestFor,
  numberField,
  addressField,
  validateInput,
} from "@bitte-ai/agent-sdk";
import { NextRequest, NextResponse } from "next/server";
import { Address } from "viem";

interface Input {
  chainId: number;
  safeAddress: Address;
}

const parsers: FieldParser<Input> = {
  chainId: numberField,
  safeAddress: addressField,
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  console.log("MultiSend Request", searchParams);
  const { chainId, safeAddress } = validateInput<Input>(searchParams, parsers);
  const csv = searchParams.get("csv");
  // TODO: Validate CSV and allow fetch from URL.
  if (!csv) {
    return NextResponse.json({ error: "CSV is required" }, { status: 400 });
  }

  const parser = defaultParser(chainId);
  const [transfers, warnings] = await parser(csv);
  if (warnings.length > 0) {
    console.warn("Parser Warnings", warnings);
  }
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

  const signRequest = signRequestFor({
    chainId,
    metaTransactions: buildMetaTransactions(transfers),
  });
  console.log("Sign Request", signRequest);
  return NextResponse.json({
    transaction: signRequest,
    meta: {
      transfers,
      warnings: { parse: warnings, balance: insufficientBalances },
    },
  });
}
