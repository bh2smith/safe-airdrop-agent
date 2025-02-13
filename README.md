# Safe Airdrop Agent

A Next.js project that provides an AI assistant for generating multi-asset-transfers for  [Safe](https://safe.global) accounts. This agent performs equivalent functionality to the existing CSV Airdrop in the Safe App Store.

## Features

### Multisend Endpoint
`/api/multisend`
- Enables batch transfers of tokens (ERC20, ERC721, ERC1155) to multiple recipients
- Accepts CSV input as url reference to a google sheet or a plain csv file with the following format:
  ```csv
  receiver,token_type,token_address,amount,id
  0x123...,erc20,0xabc...,100,
  0x456...,erc721,0xdef...,1,42
  0x789...,erc1155,0xghi...,5,123
  ```
- Supports ENS resolution for receiver addresses
- Validates token addresses and transfer parameters

### Drain Safe Endpoint
`/api/drain-safe`
- Transfers all tokens from a Safe to a specified address
- Supports multiple token types:
  - Native tokens (ETH)
  - ERC20 tokens
  - NFTs (ERC721 and ERC1155)
- Automatically detects and processes all token balances


## Getting Started

Run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to access the API.