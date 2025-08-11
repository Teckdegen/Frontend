import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useState, useCallback } from 'react';
import { CONTRACT_ADDRESSES, DEFAULT_TLD, formatUSDC, calculateRegistrationFee } from '@/lib/web3';
import { PEPUDOMAINS_ABI, USDC_ABI } from '@/types/contract';
import type { DomainInfo, DomainSearchResult, TransactionStatus } from '@/types/contract';
import toast from 'react-hot-toast';

export function usePepuDomainsContract() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const [txStatus, setTxStatus] = useState<TransactionStatus>({ status: 'idle' });

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Read functions
  const useResolveName = (name: string, tld: string = DEFAULT_TLD) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.PEPUDOMAINS as `0x${string}`,
      abi: PEPUDOMAINS_ABI,
      functionName: 'resolveName',
      args: [name, tld],
      query: {
        enabled: !!name && name.length > 0,
      },
    });
  };

  const useIsDomainAvailable = (name: string, tld: string = DEFAULT_TLD) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.PEPUDOMAINS as `0x${string}`,
      abi: PEPUDOMAINS_ABI,
      functionName: 'isDomainAvailable',
      args: [name, tld],
      query: {
        enabled: !!name && name.length > 0,
      },
    });
  };

  const useGetDomainInfo = (name: string, tld: string = DEFAULT_TLD) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.PEPUDOMAINS as `0x${string}`,
      abi: PEPUDOMAINS_ABI,
      functionName: 'getDomainInfo',
      args: [name, tld],
      query: {
        enabled: !!name && name.length > 0,
      },
    });
  };

  const useGetDomainStatus = (name: string, tld: string = DEFAULT_TLD) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.PEPUDOMAINS as `0x${string}`,
      abi: PEPUDOMAINS_ABI,
      functionName: 'getDomainStatus',
      args: [name, tld],
      query: {
        enabled: !!name && name.length > 0,
      },
    });
  };

  const useGetRegistrationFee = (name: string, duration: number) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.PEPUDOMAINS as `0x${string}`,
      abi: PEPUDOMAINS_ABI,
      functionName: 'getRegistrationFee',
      args: [name, BigInt(duration)],
      query: {
        enabled: !!name && name.length > 0 && duration > 0,
      },
    });
  };

  const useGetDomainByWallet = (walletAddress: string) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.PEPUDOMAINS as `0x${string}`,
      abi: PEPUDOMAINS_ABI,
      functionName: 'getDomainByWallet',
      args: [walletAddress as `0x${string}`],
      query: {
        enabled: !!walletAddress && walletAddress.length === 42,
      },
    });
  };

  // Write functions
  const registerDomain = useCallback(async (name: string, tld: string = DEFAULT_TLD, years: number = 1) => {
    try {
      setTxStatus({ status: 'pending' });
      
      const result = await writeContract({
        address: CONTRACT_ADDRESSES.PEPUDOMAINS as `0x${string}`,
        abi: PEPUDOMAINS_ABI,
        functionName: 'registerDomain',
        args: [name, tld, BigInt(years)],
      });

      setTxStatus({ status: 'pending', hash: result });
      toast.success('Registration transaction submitted!');
      
      return result;
    } catch (error: any) {
      setTxStatus({ status: 'error', error: error.message });
      toast.error(`Registration failed: ${error.message}`);
      throw error;
    }
  }, [writeContract]);

  const renewDomain = useCallback(async (name: string, tld: string = DEFAULT_TLD, duration: number) => {
    try {
      setTxStatus({ status: 'pending' });
      
      const result = await writeContract({
        address: CONTRACT_ADDRESSES.PEPUDOMAINS as `0x${string}`,
        abi: PEPUDOMAINS_ABI,
        functionName: 'renewDomain',
        args: [name, tld, BigInt(duration)],
      });

      setTxStatus({ status: 'pending', hash: result });
      toast.success('Renewal transaction submitted!');
      
      return result;
    } catch (error: any) {
      setTxStatus({ status: 'error', error: error.message });
      toast.error(`Renewal failed: ${error.message}`);
      throw error;
    }
  }, [writeContract]);

  const setDomainWallet = useCallback(async (name: string, tld: string = DEFAULT_TLD, newWallet: string) => {
    try {
      setTxStatus({ status: 'pending' });
      
      const result = await writeContract({
        address: CONTRACT_ADDRESSES.PEPUDOMAINS as `0x${string}`,
        abi: PEPUDOMAINS_ABI,
        functionName: 'setDomainWallet',
        args: [name, tld, newWallet as `0x${string}`],
      });

      setTxStatus({ status: 'pending', hash: result });
      toast.success('Wallet update transaction submitted!');
      
      return result;
    } catch (error: any) {
      setTxStatus({ status: 'error', error: error.message });
      toast.error(`Wallet update failed: ${error.message}`);
      throw error;
    }
  }, [writeContract]);

  // Update transaction status based on confirmation
  useState(() => {
    if (isConfirmed && txStatus.status === 'pending') {
      setTxStatus({ status: 'success', hash });
      toast.success('Transaction confirmed!');
    }
  });

  return {
    // Read hooks
    useResolveName,
    useIsDomainAvailable,
    useGetDomainInfo,
    useGetDomainStatus,
    useGetRegistrationFee,
    useGetDomainByWallet,
    
    // Write functions
    registerDomain,
    renewDomain,
    setDomainWallet,
    
    // Transaction state
    txStatus,
    isWriting: isPending,
    isConfirming,
    isConfirmed,
    txHash: hash,
  };
}

// Hook for USDC operations
export function useUSDCContract() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  
  const useUSDCBalance = (address: string) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.USDC as `0x${string}`,
      abi: USDC_ABI,
      functionName: 'balanceOf',
      args: [address as `0x${string}`],
      query: {
        enabled: !!address && address.length === 42,
      },
    });
  };

  const useUSDCAllowance = (owner: string, spender: string) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.USDC as `0x${string}`,
      abi: USDC_ABI,
      functionName: 'allowance',
      args: [owner as `0x${string}`, spender as `0x${string}`],
      query: {
        enabled: !!owner && !!spender && owner.length === 42 && spender.length === 42,
      },
    });
  };

  const approveUSDC = useCallback(async (amount: bigint) => {
    try {
      const result = await writeContract({
        address: CONTRACT_ADDRESSES.USDC as `0x${string}`,
        abi: USDC_ABI,
        functionName: 'approve',
        args: [CONTRACT_ADDRESSES.PEPUDOMAINS as `0x${string}`, amount],
      });

      toast.success('USDC approval transaction submitted!');
      return result;
    } catch (error: any) {
      toast.error(`USDC approval failed: ${error.message}`);
      throw error;
    }
  }, [writeContract]);

  return {
    useUSDCBalance,
    useUSDCAllowance,
    approveUSDC,
    isApproving: isPending,
    approvalHash: hash,
  };
}

// Combined hook for domain search
export function useDomainSearch() {
  const contract = usePepuDomainsContract();

  const searchDomain = useCallback(async (name: string, tld: string = DEFAULT_TLD): Promise<DomainSearchResult> => {
    try {
      // Get domain availability and status in parallel
      const [isAvailable, domainStatus, domainInfo] = await Promise.allSettled([
        contract.useIsDomainAvailable(name, tld),
        contract.useGetDomainStatus(name, tld),
        contract.useGetDomainInfo(name, tld),
      ]);

      const available = isAvailable.status === 'fulfilled' ? isAvailable.value : false;
      const status = domainStatus.status === 'fulfilled' ? domainStatus.value : null;
      const info = domainInfo.status === 'fulfilled' ? domainInfo.value : null;

      // Calculate price for 1 year
      const priceWei = calculateRegistrationFee(name, 1);
      const price = formatUSDC(priceWei);

      return {
        name,
        tld,
        available,
        price,
        priceWei,
        exists: status?.exists || false,
        expired: status?.expired || false,
        owner: info?.owner,
        expiryDate: info?.expiryTimestamp ? new Date(Number(info.expiryTimestamp) * 1000) : undefined,
      };
    } catch (error) {
      console.error('Domain search failed:', error);
      throw error;
    }
  }, [contract]);

  return { searchDomain };
}
