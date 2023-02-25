const FLOW_ENV = process.env.NEXT_PUBLIC_FLOW_ENV || 'testnet';

const NETWORKS = {
  emulator: {
    flowNetwork: 'local',
    accessApi: process.env.NEXT_PUBLIC_EMULATOR_API || 'http://localhost:8888',
    walletDiscovery: 'https://fcl-discovery.onflow.org/local/authn',
    walletDiscoveryApi: 'https://fcl-discovery.onflow.org/api/local/authn',
    walletDiscoveryInclude: [],
    addresses: {
      FlowToken: '0x0ae53cb6e3f42a79',
      NonFungibleToken: '0x0ae53cb6e3f42a79',
      MetadataViews: '0x0ae53cb6e3f42a79',
      Dojo: '0x74225957ee4b7824',
    },
  },
  testnet: {
    flowNetwork: 'testnet',
    accessApi: 'https://testnet.onflow.org',
    walletDiscovery: 'https://fcl-discovery.onflow.org/testnet/authn',
    walletDiscoveryApi: 'https://fcl-discovery.onflow.org/api/testnet/authn',
    walletDiscoveryInclude: [
      '0x82ec283f88a62e65', // Dapper Wallet
    ],
    addresses: {
      NonFungibleToken: '0x631e88ae7f1d7c20',
      Dojo: '0x74225957ee4b7824',
    },
  },
  mainnet: {
    flowNetwork: 'mainnet',
    accessApi: 'https://rest-mainnet.onflow.org',
    walletDiscovery: 'https://fcl-discovery.onflow.org/authn',
    walletDiscoveryApi: 'https://fcl-discovery.onflow.org/api/authn',
    walletDiscoveryInclude: [
      '0xead892083b3e2c6c', // Dapper Wallet
    ],
    addresses: {
      NonFungibleToken: '0x1d7e57aa55817448',
      MetadataViews: '0x1d7e57aa55817448',
      Dojo: ''
    },
  },
} as const;

type NetworksKey = keyof typeof NETWORKS;

export const NETWORK = NETWORKS[FLOW_ENV as NetworksKey];

export const getNetwork = (flowEnv = 'testnet') =>
  NETWORKS[flowEnv as NetworksKey];
