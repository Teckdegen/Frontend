'use client';

import { useState } from 'react';
import { usePepuDomainsContract } from '@/hooks/useContract';
import { useWallet } from '@/hooks/useWallet';
import { formatAddress, DEFAULT_TLD, getExplorerUrl } from '@/lib/web3';
import { 
  CalendarIcon,
  PencilIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { format, isAfter, differenceInDays } from 'date-fns';
import toast from 'react-hot-toast';

interface DomainCardProps {
  name: string;
  tld: string;
  walletAddress: string;
  owner: string;
  expiryDate: Date;
  onUpdate?: () => void;
}

export default function DomainCard({
  name,
  tld,
  walletAddress,
  owner,
  expiryDate,
  onUpdate
}: DomainCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newWalletAddress, setNewWalletAddress] = useState(walletAddress);
  const [isRenewing, setIsRenewing] = useState(false);
  const [renewalYears, setRenewalYears] = useState(1);
  
  const { address } = useWallet();
  const contract = usePepuDomainsContract();
  
  const isExpired = !isAfter(expiryDate, new Date());
  const daysUntilExpiry = differenceInDays(expiryDate, new Date());
  const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  const isOwner = address?.toLowerCase() === owner.toLowerCase();

  const handleUpdateWallet = async () => {
    if (!newWalletAddress || newWalletAddress === walletAddress) {
      setIsEditing(false);
      return;
    }

    try {
      await contract.setDomainWallet(name, tld, newWalletAddress);
      toast.success('Wallet address updated!');
      setIsEditing(false);
      onUpdate?.();
    } catch (error: any) {
      toast.error(`Failed to update wallet: ${error.message}`);
    }
  };

  const handleRenewal = async () => {
    try {
      setIsRenewing(true);
      await contract.renewDomain(name, tld, renewalYears);
      toast.success('Domain renewal submitted!');
      onUpdate?.();
    } catch (error: any) {
      toast.error(`Renewal failed: ${error.message}`);
    } finally {
      setIsRenewing(false);
    }
  };

  const getStatusColor = () => {
    if (isExpired) return 'text-red-600 bg-red-50 border-red-200';
    if (isExpiringSoon) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getStatusText = () => {
    if (isExpired) return 'Expired';
    if (isExpiringSoon) return `Expires in ${daysUntilExpiry} days`;
    return 'Active';
  };

  const getStatusIcon = () => {
    if (isExpired) return <ExclamationTriangleIcon className="h-4 w-4" />;
    if (isExpiringSoon) return <ClockIcon className="h-4 w-4" />;
    return <CheckCircleIcon className="h-4 w-4" />;
  };

  return (
    <div className="card-hover">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 font-mono">
            {name}{tld}
          </h3>
          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
            {getStatusIcon()}
            <span>{getStatusText()}</span>
          </div>
        </div>
        
        {isOwner && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Edit domain"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsRenewing(!isRenewing)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Renew domain"
            >
              <ArrowPathIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Domain Info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Resolves to:</span>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newWalletAddress}
                  onChange={(e) => setNewWalletAddress(e.target.value)}
                  className="input text-xs w-40"
                  placeholder="0x..."
                />
                <button
                  onClick={handleUpdateWallet}
                  className="btn-primary text-xs px-2 py-1"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setNewWalletAddress(walletAddress);
                  }}
                  className="btn-secondary text-xs px-2 py-1"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <span className="font-mono text-sm">{formatAddress(walletAddress)}</span>
                <a
                  href={getExplorerUrl(walletAddress, 'address')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                </a>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Owner:</span>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-sm">{formatAddress(owner)}</span>
            <a
              href={getExplorerUrl(owner, 'address')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600"
            >
              <ArrowTopRightOnSquareIcon className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Expires:</span>
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{format(expiryDate, 'MMM dd, yyyy')}</span>
          </div>
        </div>
      </div>

      {/* Renewal Section */}
      {isRenewing && isOwner && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Renew Domain</h4>
          <div className="flex items-center space-x-3">
            <select
              value={renewalYears}
              onChange={(e) => setRenewalYears(Number(e.target.value))}
              className="input text-sm flex-1"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((year) => (
                <option key={year} value={year}>
                  {year} {year === 1 ? 'year' : 'years'}
                </option>
              ))}
            </select>
            <button
              onClick={handleRenewal}
              disabled={contract.isWriting}
              className="btn-primary text-sm"
            >
              {contract.isWriting ? 'Renewing...' : 'Renew'}
            </button>
            <button
              onClick={() => setIsRenewing(false)}
              className="btn-secondary text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Expiry Warning */}
      {(isExpired || isExpiringSoon) && (
        <div className={`mt-4 p-3 rounded-lg border ${
          isExpired ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-start space-x-2">
            <ExclamationTriangleIcon className={`h-5 w-5 mt-0.5 ${
              isExpired ? 'text-red-500' : 'text-yellow-500'
            }`} />
            <div className={`text-sm ${isExpired ? 'text-red-800' : 'text-yellow-800'}`}>
              {isExpired ? (
                <p>
                  <strong>Domain has expired!</strong> Renew immediately to prevent losing ownership.
                </p>
              ) : (
                <p>
                  <strong>Domain expires soon!</strong> Consider renewing to avoid losing your domain.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
