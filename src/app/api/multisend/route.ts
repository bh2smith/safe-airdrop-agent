import {
  FieldParser,
  signRequestFor,
  numberField,
  addressField,
  validateInput,
} from "@bitte-ai/agent-sdk";
import { NextRequest, NextResponse } from "next/server";
import { Address } from "viem";
import { csvAirdrop } from "./flow";
import { buildMetaTransactions } from "multi-asset-transfer";

interface Input {
  chainId: number;
  safeAddress: Address;
}

const parsers: FieldParser<Input> = {
  chainId: numberField,
  safeAddress: addressField,
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  console.log("Request Headers", request.headers);
  const { searchParams } = request.nextUrl;
  console.log("MultiSend Request", searchParams);
  const { chainId, safeAddress } = validateInput<Input>(searchParams, parsers);
  const { transfers, warnings, balances } = await csvAirdrop(
    chainId,
    safeAddress,
    searchParams.get("csv"),
  );

  const signRequest = signRequestFor({
    chainId,
    metaTransactions: buildMetaTransactions(transfers),
  });
  console.log("Sign Request", signRequest);
  return NextResponse.json({
    transaction: signRequestFor({
      chainId,
      metaTransactions: buildMetaTransactions(transfers),
    }),
    meta: {
      transfers,
      warnings: { parse: warnings, balances },
    },
  });
}
