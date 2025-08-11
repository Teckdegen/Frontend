export interface DomainRecord {
  walletAddress: string;
  owner: string;
  registrationTimestamp: bigint;
  expiryTimestamp: bigint;
  tld: string;
}

export interface DomainInfo {
  name: string;
  tld: string;
  walletAddress: string;
  owner: string;
  registrationTimestamp: Date;
  expiryTimestamp: Date;
  isExpired: boolean;
  remainingDays: number;
}

export interface DomainStatus {
  exists: boolean;
  expired: boolean;
  remainingDays: bigint;
  fee: bigint;
}

export interface RegistrationFees {
  1: bigint; // 1 character
  2: bigint; // 2 characters
  3: bigint; // 3 characters
  4: bigint; // 4 characters
  5: bigint; // 5+ characters
}

export interface DomainSearchResult {
  name: string;
  tld: string;
  available: boolean;
  price: string;
  priceWei: bigint;
  exists: boolean;
  expired: boolean;
  owner?: string;
  expiryDate?: Date;
}

export interface TransactionStatus {
  hash?: string;
  status: 'idle' | 'pending' | 'success' | 'error';
  error?: string;
}

export interface WalletInfo {
  address: string;
  isConnected: boolean;
  chainId?: number;
  balance?: string;
}

export interface ContractConfig {
  address: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
}

// Contract ABI types
export const PEPUDOMAINS_ABI = [
  // Read functions
  "function resolveName(string calldata name, string calldata tld) external view returns (address walletAddress)",
  "function getDomainInfo(string calldata name, string calldata tld) external view returns (address walletAddress, address owner, uint256 registrationTimestamp, uint256 expiryTimestamp, string memory tldInfo)",
  "function isDomainAvailable(string calldata name, string calldata tld) external view returns (bool)",
  "function getDomainByWallet(address wallet) external view returns (string memory name, string memory tld)",
  "function getDomainStatus(string calldata name, string calldata tld) external view returns (bool exists, bool expired, uint256 remainingDays, uint256 fee)",
  "function getRegistrationFee(string calldata name, uint256 duration) external view returns (uint256)",
  "function validateDomainName(string calldata name) external pure returns (bool)",
  "function getDomainNameInfo(string calldata name) external pure returns (uint256 charCount, uint256 byteLength, bool isValid)",
  
  // Write functions
  "function registerDomain(string calldata name, string calldata tld, uint256 duration) external",
  "function renewDomain(string calldata name, string calldata tld, uint256 duration) external",
  "function setDomainWallet(string calldata name, string calldata tld, address newWallet) external",
  "function batchRegisterDomains(string[] calldata names, string[] calldata tlds, uint256[] calldata durations) external",
  
  // Admin functions
  "function adminRegister(string calldata name, string calldata tld, address walletAddress, uint256 duration) external",
  "function setRegistrationFee(uint256 chars, uint256 fee) external",
  "function setUsdcAddress(address usdc) external",
  "function setTreasuryAddress(address treasury) external",
  "function addTld(string calldata tld) external",
  "function removeTld(string calldata tld) external",
  
  // State variables
  "function domains(string memory name, string memory tld) external view returns (address walletAddress, address owner, uint256 registrationTimestamp, uint256 expiryTimestamp, string memory tldInfo)",
  "function walletToDomainName(address wallet) external view returns (string memory)",
  "function walletToDomainTld(address wallet) external view returns (string memory)",
  "function registrationFees(uint256 charCount) external view returns (uint256)",
  "function supportedTlds(string memory tld) external view returns (bool)",
  "function usdcAddress() external view returns (address)",
  "function treasuryAddress() external view returns (address)",
  "function owner() external view returns (address)",
  
  // Events
  "event DomainRegistered(string indexed name, string indexed tld, address indexed owner, address walletAddress, uint256 registrationTimestamp, uint256 expiryTimestamp)",
  "event DomainRenewed(string indexed name, string indexed tld, uint256 expiryTimestamp)",
  "event WalletUpdated(string indexed name, string indexed tld, address newWallet)",
  "event RegistrationFeeUpdated(uint256 charCount, uint256 newFee)",
  "event TreasuryAddressUpdated(address oldTreasury, address newTreasury)",
  "event UsdcAddressUpdated(address oldUsdc, address newUsdc)",
  "event TldAdded(string tld)",
  "event TldRemoved(string tld)",
  "event BatchDomainRegistered(uint256 count)",
  "event DomainNameValidated(string name, bool isValid)",
  "event UnicodeDomainRegistered(string name, string tld, address owner)"
] as const;

// USDC ABI for approvals
export const USDC_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
  "function symbol() external view returns (string)",
  "function name() external view returns (string)"
] as const;
