import { Router, Request, Response } from "express";
import {
  FieldParser,
  numberField,
  addressField,
  validateInput,
} from "@bitte-ai/agent-sdk";
import { Address } from "viem";
import { csvAirdrop } from "../../lib/flow.js";
import { buildResponse } from "../../lib/util.js";

interface Input {
  chainId: number;
  safeAddress: Address;
}

const parsers: FieldParser<Input> = {
  chainId: numberField,
  safeAddress: addressField,
};
const multisendRouter = Router();

multisendRouter.get("/", async (req: Request, res: Response) => {
  const search = new URLSearchParams(req.url);
  console.log("MultiSend Request", search);
  const { chainId, safeAddress } = validateInput<Input>(search, parsers);
  const response = await csvAirdrop(chainId, safeAddress, search.get("csv"));
  return res.status(200).json(buildResponse(chainId, response));
});

export default multisendRouter;
