export const SUPPORTED_NETWORKS = {
  1: 'Ethereum Mainnet',
  5: 'Goerli Testnet',
  11155111: 'Sepolia Testnet',
  137: 'Polygon Mainnet',
  80001: 'Mumbai Testnet'
} as const;

export const NETWORK_URLS = {
  1: process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL,
  5: `https://goerli.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
  11155111: `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
  137: `https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
  80001: `https://polygon-mumbai.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`
} as const;

export const NETWORK_EXPLORERS = {
  1: 'https://etherscan.io',
  5: 'https://goerli.etherscan.io',
  11155111: 'https://sepolia.etherscan.io',
  137: 'https://polygonscan.com',
  80001: 'https://mumbai.polygonscan.com'
} as const;

export const CONTRACT_ADDRESSES = {
  1: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  5: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_GOERLI,
  11155111: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_SEPOLIA,
  137: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_POLYGON,
  80001: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MUMBAI
} as const;

export const DEFAULT_CHAIN_ID = Number(process.env.NEXT_PUBLIC_NETWORK_ID) || 1;

export const MIN_COLLATERAL_RATIO = 150; // 150% collateralization ratio
export const LIQUIDATION_THRESHOLD = 120; // 120% threshold for liquidation
export const MAX_LOAN_DURATION_DAYS = 90;
export const MIN_LOAN_AMOUNT = '100'; // in USD
export const MAX_LOAN_AMOUNT = '100000'; // in USD