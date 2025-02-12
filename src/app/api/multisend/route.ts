import {
  FieldParser,
  numberField,
  addressField,
  validateInput,
} from "@bitte-ai/agent-sdk";
import { NextRequest, NextResponse } from "next/server";
import { Address } from "viem";
import { buildResponse, csvAirdrop } from "./flow";

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
  const response = await csvAirdrop(
    chainId,
    safeAddress,
    searchParams.get("csv"),
  );

  return buildResponse(chainId, response);
}
