'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { usePepuDomainsContract } from '@/hooks/useContract';
import DomainCard from '@/components/DomainCard';
import { 
  GlobeAltIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import type { DomainInfo } from '@/types/contract';

export default function DomainsPage() {
  const [domains, setDomains] = useState<DomainInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'expiring' | 'expired'>('all');
  
  const { address, isConnected } = useWallet();
  const contract = usePepuDomainsContract();

  // Get user's domain
  const { data: userDomain, refetch: refetchUserDomain } = contract.useGetDomainByWallet(address || '');

  useEffect(() => {
    const fetchDomains = async () => {
      if (!isConnected || !address || !userDomain) {
        setDomains([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // For now, we'll just fetch the user's single domain
        // In a real implementation, you might want to index all domains or have a subgraph
        const [name, tld] = userDomain;
        
        if (name && tld) {
          const domainInfo = await contract.useGetDomainInfo(name, tld);
          
          if (domainInfo.data) {
            const [walletAddress, owner, registrationTimestamp, expiryTimestamp] = domainInfo.data;
            
            const domain: DomainInfo = {
              name,
              tld,
              walletAddress,
              owner,
              registrationTimestamp: new Date(Number(registrationTimestamp) * 1000),
              expiryTimestamp: new Date(Number(expiryTimestamp) * 1000),
              isExpired: new Date() > new Date(Number(expiryTimestamp) * 1000),
              remainingDays: Math.max(0, Math.floor((Number(expiryTimestamp) * 1000 - Date.now()) / (1000 * 60 * 60 * 24))),
            };
            
            setDomains([domain]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch domains:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDomains();
  }, [isConnected, address, userDomain, contract]);

  const handleDomainUpdate = () => {
    // Refetch user domain data
    refetchUserDomain();
  };

  const filteredDomains = domains.filter(domain => {
    // Search filter
    if (searchTerm && !domain.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Status filter
    switch (filter) {
      case 'active':
        return !domain.isExpired && domain.remainingDays > 30;
      case 'expiring':
        return !domain.isExpired && domain.remainingDays <= 30;
      case 'expired':
        return domain.isExpired;
      default:
        return true;
    }
  });

  const getFilterCounts = () => {
    return {
      all: domains.length,
      active: domains.filter(d => !d.isExpired && d.remainingDays > 30).length,
      expiring: domains.filter(d => !d.isExpired && d.remainingDays <= 30).length,
      expired: domains.filter(d => d.isExpired).length,
    };
  };

  const filterCounts = getFilterCounts();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <ExclamationTriangleIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600 mb-6">
            You need to connect your wallet to view your domains.
          </p>
          <Link href="/" className="btn-primary">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GlobeAltIcon className="h-8 w-8 text-pepu-500" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Domains</h1>
                <p className="text-gray-600">
                  Manage your .pepu domains and Web3 identity
                </p>
              </div>
            </div>
            
            <Link href="/register" className="btn-primary">
              <PlusIcon className="h-5 w-5" />
              Register Domain
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-gray-900">{filterCounts.all}</div>
            <div className="text-sm text-gray-600">Total Domains</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600">{filterCounts.active}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-yellow-600">{filterCounts.expiring}</div>
            <div className="text-sm text-gray-600">Expiring Soon</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-red-600">{filterCounts.expired}</div>
            <div className="text-sm text-gray-600">Expired</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search domains..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
            
            {/* Filter Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {[
                { key: 'all', label: 'All', count: filterCounts.all },
                { key: 'active', label: 'Active', count: filterCounts.active },
                { key: 'expiring', label: 'Expiring', count: filterCounts.expiring },
                { key: 'expired', label: 'Expired', count: filterCounts.expired },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === tab.key
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Domains List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="loading-dots">
              <div style={{ '--delay': 0 } as any}></div>
              <div style={{ '--delay': 1 } as any}></div>
              <div style={{ '--delay': 2 } as any}></div>
            </div>
          </div>
        ) : filteredDomains.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDomains.map((domain) => (
              <DomainCard
                key={`${domain.name}${domain.tld}`}
                name={domain.name}
                tld={domain.tld}
                walletAddress={domain.walletAddress}
                owner={domain.owner}
                expiryDate={domain.expiryTimestamp}
                onUpdate={handleDomainUpdate}
              />
            ))}
          </div>
        ) : domains.length === 0 ? (
          // No domains at all
          <div className="text-center py-12">
            <GlobeAltIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No domains found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You don't have any registered domains yet. 
              Register your first .pepu domain to get started with Web3 identity.
            </p>
            <Link href="/register" className="btn-primary">
              <PlusIcon className="h-5 w-5" />
              Register Your First Domain
            </Link>
          </div>
        ) : (
          // No domains match filter
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No domains match your search
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilter('all');
              }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Help Section */}
        {domains.length > 0 && (
          <div className="mt-12 card bg-blue-50 border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-bold">?</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Domain Management Tips</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Click the pencil icon to update where your domain resolves</li>
                  <li>• Use the refresh icon to renew domains before they expire</li>
                  <li>• Domains expiring within 30 days are marked as "Expiring Soon"</li>
                  <li>• Expired domains can be registered by anyone - renew quickly!</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
