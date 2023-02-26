import { config } from "@onflow/fcl";

config({
 "accessNode.api": "https://rest-testnet.onflow.org", // Mainnet: "https://rest-mainnet.onflow.org"
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn", // Mainnet: "https://fcl-discovery.onflow.org/authn"
  '0xDojo': '0xb8564bff2e62329c', // The account address where the Profile smart contract lives on Testnet
})