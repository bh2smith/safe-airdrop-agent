import {
  Transfer,
  InsufficientBalanceInfo,
  CodeWarning,
} from "multi-asset-transfer";

export type ResponseData = {
  transfers: Transfer[];
  warnings: CodeWarning[];
  balances: InsufficientBalanceInfo[];
};
