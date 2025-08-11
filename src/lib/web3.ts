import { createConfig, http } from 'wagmi';
import { defineChain } from 'viem';
import { metaMask } from 'wagmi/connectors';
import { validateDomainName, isDomainBanned } from './validation';

// Define Pepe Unchained V2 chain
export const pepeUnchained = defineChain({
  id: 97741,
  name: 'Pepe Unchained V2',
  nativeCurrency: {
    decimals: 18,
    name: 'PEPU',
    symbol: 'PEPU',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-pepu-v2-mainnet-0.t.conduit.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'PepuScan',
      url: 'https://pepuscan.com',
    },
  },
});

// Contract addresses
export const CONTRACT_ADDRESSES = {
  PEPUDOMAINS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x7Dd0f22672C9AC0B2a88C0a3C8fac1A517C7f324',
  USDC: process.env.NEXT_PUBLIC_USDC_ADDRESS || '0x20fB684Bfc1aBAaD3AceC5712f2Aa30bd494dF74',
} as const;

// Wagmi configuration
export const config = createConfig({
  chains: [pepeUnchained],
  connectors: [
    metaMask({
      dappMetadata: {
        name: 'Pepu Domains',
        url: 'https://domains.pepuns.xyz',
        iconUrl: 'https://domains.pepuns.xyz/favicon.ico',
      },
    }),
  ],
  transports: {
    [pepeUnchained.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
  },
});

// Chain configuration
export const CHAIN_CONFIG = {
  chainId: pepeUnchained.id,
  name: pepeUnchained.name,
  rpcUrl: pepeUnchained.rpcUrls.default.http[0],
  explorerUrl: pepeUnchained.blockExplorers.default.url,
  nativeCurrency: pepeUnchained.nativeCurrency,
};

// Export validation functions
export { validateDomainName, isDomainBanned };

// Registration constants
export const REGISTRATION_CONSTANTS = {
  MIN_YEARS: 1,
  MAX_YEARS: 60,
  MIN_NAME_LENGTH: 1,
  MAX_NAME_LENGTH: 63,
  MAX_BATCH_SIZE: 10,
} as const;

// Fee structure (in USDC with 6 decimals)
export const FEE_STRUCTURE = {
  1: '1000000000', // $1000 USDC
  2: '500000000',  // $500 USDC  
  3: '100000000',  // $100 USDC
  4: '50000000',   // $50 USDC
  5: '10000000',   // $10 USDC (5+ characters)
} as const;

// Calculate registration fee based on domain length
export const calculateRegistrationFee = (domainName: string, years: number): bigint => {
  const charCount = domainName.length;
  let feePerYear: string;
  
  if (charCount === 1) {
    feePerYear = FEE_STRUCTURE[1];
  } else if (charCount === 2) {
    feePerYear = FEE_STRUCTURE[2];
  } else if (charCount === 3) {
    feePerYear = FEE_STRUCTURE[3];
  } else if (charCount === 4) {
    feePerYear = FEE_STRUCTURE[4];
  } else {
    feePerYear = FEE_STRUCTURE[5];
  }
  
  return BigInt(feePerYear) * BigInt(years);
};

// Format USDC amount for display
export const formatUSDC = (amount: bigint): string => {
  return (Number(amount) / 1e6).toFixed(2);
};

// Parse USDC amount from string
export const parseUSDC = (amount: string): bigint => {
  return BigInt(Math.floor(parseFloat(amount) * 1e6));
};

// Get explorer URL for transaction
export const getExplorerUrl = (hash: string, type: 'tx' | 'address' = 'tx'): string => {
  const baseUrl = CHAIN_CONFIG.explorerUrl;
  return `${baseUrl}/${type}/${hash}`;
};

// Format address for display
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Check if address is valid
export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Default TLD
export const DEFAULT_TLD = '.pepu';
