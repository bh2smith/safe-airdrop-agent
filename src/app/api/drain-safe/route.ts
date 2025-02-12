import {
  FieldParser,
  numberField,
  addressField,
  validateInput,
} from "@bitte-ai/agent-sdk";
import { NextRequest, NextResponse } from "next/server";
import { Address } from "viem";
import {
  drainSafe,
  getCollectibleBalance,
  getFungibleBalance,
} from "multi-asset-transfer";
import { buildResponse, csvAirdrop } from "../multisend/flow";

interface Input {
  chainId: number;
  recipient: Address;
  safeAddress: Address;
}

const parsers: FieldParser<Input> = {
  chainId: numberField,
  recipient: addressField,
  safeAddress: addressField,
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  console.log("Request Headers", request.headers);
  const { searchParams } = request.nextUrl;
  console.log("MultiSend Request", searchParams);
  const { chainId, recipient, safeAddress } = validateInput<Input>(
    searchParams,
    parsers,
  );
  const [ft, nft] = await Promise.all([
    getFungibleBalance(chainId, safeAddress, true, true),
    getCollectibleBalance(chainId, safeAddress, true, true),
  ]);

  const csv = drainSafe(recipient, { ft, nft });
  const response = await csvAirdrop(
    chainId,
    safeAddress,
    csv,
    true, // Skip Balance Check.
  );
  return buildResponse(chainId, response);
}
