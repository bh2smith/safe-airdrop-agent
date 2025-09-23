import { Router, Request, Response } from "express";
import {
  FieldParser,
  numberField,
  addressField,
  validateInput,
} from "@bitte-ai/agent-sdk";
import { Address } from "viem";
import {
  drainSafe,
  getCollectibleBalance,
  getFungibleBalance,
} from "multi-asset-transfer";
import { csvAirdrop } from "../../lib/flow.js";
import { buildResponse } from "../../lib/util.js";

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

const drainRouter = Router();

drainRouter.get("/", async (req: Request, res: Response) => {
  const search = new URLSearchParams(req.url);
  console.log("MultiSend Request", search);
  const { chainId, recipient, safeAddress } = validateInput<Input>(
    search,
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
  return res.status(200).json(buildResponse(chainId, response));
});

export default drainRouter;
