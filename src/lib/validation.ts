// Banned domain names list
export const BANNED_WORDS = [
  'pepeunchained', 'pepeunchainedairdrop', 'pepeunchained-airdrop', 'pepeunchainedfree', 'pepeunchained-mint',
  'pepeunchainedmint', 'pepeunchained-mintnow', 'pepeunchainedclaim', 'pepeunchained-claim', 'pepeunchainedpresale',
  'pepeunchained-sale', 'pepeunchainedbuy', 'pepeunchainedapp', 'pepeunchainedlogin', 'pepeunchainedwallet',
  'pepeunchainedportal', 'pepeunchainedsupport', 'pepeunchained-support', 'pepeunchainedadmin', 'pepeunchained-team',
  'pepeunchainedofficial', 'pepeunchainedmod', 'officialpepeunchained', 'pepu-token', 'pepe-token', 'pepe-token-claim',
  'pepu-token-airdrop', 'realpepeunchained', 'realpepu', 'buy-pepeunchained', 'buy-pepu', 'pepeunchained-nft',
  'pepewallet', 'pepuwallet', 'admin', 'official', 'support', 'test', 'app', 'pepuns', 'pns', 'pepuname', 'pepunames',
  'pepunameservice', 'wallet', 'pens', 'ramp', 'onramp', 'offramp', 'buy'
];

// Domain validation with banned words check
export const validateDomainName = (name: string) => {
  if (!name || name.length === 0) {
    return { isValid: false, error: 'Domain name is required' };
  }
  
  if (name.length > 63) {
    return { isValid: false, error: 'Domain name too long (max 63 characters)' };
  }
  
  // Check for banned words
  const lowerName = name.toLowerCase();
  if (BANNED_WORDS.includes(lowerName)) {
    return { isValid: false, error: 'This domain name is reserved and cannot be registered' };
  }
  
  // Check if domain contains any banned words as substrings
  const containsBannedWord = BANNED_WORDS.some(bannedWord => 
    lowerName.includes(bannedWord.toLowerCase())
  );
  
  if (containsBannedWord) {
    return { isValid: false, error: 'Domain name contains reserved words and cannot be registered' };
  }
  
  // Check for valid characters (alphanumeric and hyphens, but not at start/end)
  const validPattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
  if (!validPattern.test(name)) {
    return { isValid: false, error: 'Invalid characters in domain name. Use only letters, numbers, and hyphens (not at start/end)' };
  }
  
  // Additional checks for reserved patterns
  if (name.startsWith('-') || name.endsWith('-')) {
    return { isValid: false, error: 'Domain name cannot start or end with a hyphen' };
  }
  
  if (name.includes('--')) {
    return { isValid: false, error: 'Domain name cannot contain consecutive hyphens' };
  }
  
  return { isValid: true };
};

// Check if domain is banned (for quick validation)
export const isDomainBanned = (name: string): boolean => {
  const lowerName = name.toLowerCase();
  return BANNED_WORDS.includes(lowerName) || 
         BANNED_WORDS.some(bannedWord => lowerName.includes(bannedWord.toLowerCase()));
};
