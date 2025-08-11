'use client';

import { useState, useCallback, useEffect } from 'react';
import { MagnifyingGlassIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { usePepuDomainsContract } from '@/hooks/useContract';
import { validateDomainName, isDomainBanned, calculateRegistrationFee, DEFAULT_TLD } from '@/lib/web3';
import { useDebounce } from '@/hooks/useDebounce';
import Link from 'next/link';

interface DomainSearchProps {
  onDomainSelect?: (domain: string, available: boolean) => void;
  showRegisterButton?: boolean;
}

export default function DomainSearch({ onDomainSelect, showRegisterButton = true }: DomainSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    name: string;
    tld: string;
    isAvailable: boolean;
    isReserved: boolean;
    fee: bigint;
    error?: string;
  } | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const contract = usePepuDomainsContract();

  const checkDomain = useCallback(async (domain: string) => {
    if (!domain.trim()) {
      setSearchResult(null);
      return;
    }

    setIsSearching(true);
    setSearchResult(null);

    try {
      // First validate the domain name format and check banned words
      const validation = validateDomainName(domain);
      if (!validation.isValid) {
        setSearchResult({
          name: domain,
          tld: DEFAULT_TLD,
          isAvailable: false,
          isReserved: true,
          fee: 0n,
          error: validation.error,
        });
        return;
      }

      // Check if domain is banned
      if (isDomainBanned(domain)) {
        setSearchResult({
          name: domain,
          tld: DEFAULT_TLD,
          isAvailable: false,
          isReserved: true,
          fee: 0n,
          error: 'This domain name is reserved and cannot be registered',
        });
        return;
      }

      // Check availability with contract
      const isAvailable = await contract.checkAvailability(domain, DEFAULT_TLD);
      const fee = calculateRegistrationFee(domain);

      setSearchResult({
        name: domain,
        tld: DEFAULT_TLD,
        isAvailable: isAvailable || false,
        isReserved: false,
        fee,
        error: isAvailable ? undefined : 'Domain is already registered',
      });

    } catch (error) {
      console.error('Domain search error:', error);
      setSearchResult({
        name: domain,
        tld: DEFAULT_TLD,
        isAvailable: false,
        isReserved: false,
        fee: 0n,
        error: 'Failed to check domain availability',
      });
    } finally {
      setIsSearching(false);
    }
  }, [contract]);

  useEffect(() => {
    checkDomain(debouncedSearchTerm);
  }, [debouncedSearchTerm, checkDomain]);

  const isLoading = isSearching;

  const getStatusIcon = () => {
    if (isLoading) {
      return <ClockIcon className="h-5 w-5 text-gray-400 animate-spin" />;
    }
    
    if (searchResult?.error) {
      return <XCircleIcon className="h-5 w-5 text-red-500" />;
    }
    
    if (searchResult?.isAvailable) {
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    }
    
    return <XCircleIcon className="h-5 w-5 text-red-500" />;
  };

  const getStatusText = () => {
    if (isLoading) return 'Searching...';
    if (searchResult?.error) return searchResult.error;
    if (searchResult?.isAvailable) return 'Available';
    return 'Not Available';
  };

  const getStatusClass = () => {
    if (isLoading) return 'text-gray-500';
    if (searchResult?.error) return 'text-red-600';
    if (searchResult?.isAvailable) return 'text-green-600';
    return 'text-red-600';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <div className="domain-search">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for your perfect domain..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            className="input pl-10 pr-20 py-4 text-lg"
            autoComplete="off"
            spellCheck="false"
          />
          <span className="domain-tld">{DEFAULT_TLD}</span>
        </div>
      </div>

      {/* Search Results */}
      {debouncedSearchTerm && (
        <div className="mt-4 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon()}
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-lg font-semibold">
                    {debouncedSearchTerm}{DEFAULT_TLD}
                  </span>
                  <span className={`text-sm font-medium ${getStatusClass()}`}>
                    {getStatusText()}
                  </span>
                </div>
                
                {searchResult && !searchResult.error && (
                  <div className="mt-1 text-sm text-gray-600">
                    {searchResult.isAvailable ? (
                      <span>Registration fee: <strong>${searchResult.fee.toString()} USDC/year</strong></span>
                    ) : (
                      <span>Owned by unknown</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {searchResult && !searchResult.error && showRegisterButton && (
              <div className="flex items-center space-x-3">
                {searchResult.isAvailable ? (
                  <Link
                    href={`/register?domain=${debouncedSearchTerm}`}
                    className="btn-primary"
                  >
                    Register Domain
                  </Link>
                ) : (
                  <div className="text-sm text-gray-500">
                    Not available
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Additional Info */}
          {searchResult && !searchResult.error && !searchResult.isAvailable && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Domain Information</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Not available</div>
              </div>
            </div>
          )}

          {/* Pricing Info for Available Domains */}
          {searchResult && searchResult.isAvailable && !searchResult.error && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <h4 className="text-sm font-medium text-green-900 mb-2">Pricing Information</h4>
              <div className="text-sm text-green-700 space-y-1">
                <div>1 year: ${searchResult.fee.toString()} USDC</div>
                <div>5 years: ${(parseFloat(searchResult.fee.toString()) * 5).toFixed(2)} USDC</div>
                <div>10 years: ${(parseFloat(searchResult.fee.toString()) * 10).toFixed(2)} USDC</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search Tips */}
      {!debouncedSearchTerm && (
        <div className="mt-6 text-center text-gray-500">
          <p className="text-sm">
            Enter a domain name to check availability. Domain names can contain letters, numbers, and hyphens.
          </p>
          <div className="mt-2 text-xs">
            <span className="inline-block mx-2">• 1 char: $50/year</span>
            <span className="inline-block mx-2">• 3 chars: $35/year</span>
            <span className="inline-block mx-2">• 4 chars: $20/year</span>
            <span className="inline-block mx-2">• 5+ chars: $10/year</span>
          </div>
        </div>
      )}
    </div>
  );
}
