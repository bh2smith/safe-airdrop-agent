import { csvAirdrop } from "@/src/app/api/multisend/flow";
import { buildMetaTransactions } from "multi-asset-transfer";

describe.skip("sheets", () => {
  it("google: Gnosis", async () => {
    const url =
      "https://docs.google.com/spreadsheets/d/1arxFjc-pLh9m_Uf27EGsqNtu3PNcUsyzA4J0__cUnk4/export?format=csv";
    const res = await csvAirdrop(
      100,
      "0x54F08c27e75BeA0cdDdb8aA9D69FD61551B19BbA",
      url,
    );

    console.log("End Game", res);
    console.log(buildMetaTransactions(res.transfers));
  });

  it("google: Polygon", async () => {
    const url =
      "https://docs.google.com/spreadsheets/d/13-StGsODhPt4knVB0ynfIgu0sLeTZkHiKoWMbHHNchM/export?format=csv";
    const res = await csvAirdrop(
      137,
      "0x54F08c27e75BeA0cdDdb8aA9D69FD61551B19BbA",
      url,
    );

    console.log("End Game", res);
    console.log(buildMetaTransactions(res.transfers));
  });
});
