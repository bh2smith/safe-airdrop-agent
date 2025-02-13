export const NAME = "Bitte Distribute Tokens";
export const DESCRIPTION =
  "Agent API for Multi-Token Transfers on EVM Chains. Only for Smart Contract Wallets (like Safe).";

export const IMAGE = "icon.svg";
// Important - this is the agent prompt.
// Encodes Safe account transactions as signature requests such as add recovery address and deployment.
// This assistant is only for EVM networks.
// Passes the transaction response to generate-evm-tx tool for signing and displays response meta containing Safe Interface URL to the user.
// Before deploy ask the user if they would also like to add a recovery address,
// if they do, call add recovery instead with the address they supply,
// otherwise proceed with deploy.
// Tells the user that they must sign the transaction before the url will display the results.
// Always passes evmAddress as the safeAddress."
export const INSTRUCTIONS =
  "Transforms chainId and csv text or url reference to a single transaction encoding multiple asset transfers. Shows the user any warnings returned in meta and suggests how to fix the proposed CSV file if warnings are trivial. Passes multisend requests to the multisend route and drain safe request to drain-safe route. Both routes require chainId and safeAddress. multisend route takes a csv parameter (test or URL) and drain-safe takes a recipient address paramter. Always uses the connected account as safeAddress parameter.";

export const CATEGORIES = ["multisend", "csv", "airdrop", "defi"];
// All EIP155 Chains Supported by Safe: https://github.com/safe-global/safe-deployments/blob/main/src/assets/v1.3.0/gnosis_safe.json
export const CHAIN_IDS = [
  1, 10, 16, 18, 19, 25, 28, 43, 44, 46, 56, 57, 61, 63, 69, 81, 82, 83, 100,
  106, 108, 109, 111, 130, 137, 146, 148, 155, 179, 195, 196, 204, 250, 252,
  255, 288, 314, 336, 338, 360, 420, 480, 570, 588, 595, 599, 648, 686, 690,
  787, 919, 1001, 1088, 1101, 1111, 1112, 1135, 1230, 1231, 1294, 1337, 1442,
  1513, 1516, 1559, 1663, 1923, 1924, 2192, 2221, 2222, 2358, 2810, 2818, 4157,
  4653, 4689, 5000, 5001, 5003, 5700, 6102, 6398, 7000, 7001, 7332, 7560, 7700,
  8192, 8194, 8217, 8453, 8822, 9000, 9001, 9728, 10000, 10001, 10081, 10242,
  10243, 11011, 13371, 13473, 14800, 17000, 17069, 17172, 23294, 23295, 25327,
  33139, 34443, 41455, 42161, 42220, 42793, 43111, 43113, 43114, 43288, 48899,
  48900, 54211, 56288, 57000, 57073, 59140, 59144, 60808, 71401, 71402, 80085,
  81457, 84531, 84532, 103454, 128123, 167000, 167009, 314159, 490000, 534351,
  534352, 534353, 656476, 713715, 763373, 808813, 6038361, 7225878, 7777777,
  11155111, 11155420, 94204209, 111557560, 123420111, 245022926, 245022934,
  666666666, 999999999, 1313161554, 1666600000, 1666700000, 88153591557,
];
