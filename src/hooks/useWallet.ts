import { useAccount, useConnect, useDisconnect, useBalance, useChainId, useSwitchChain } from 'wagmi';
import { useEffect, useState } from 'react';
import { pepeUnchained } from '@/lib/web3';
import toast from 'react-hot-toast';

export function useWallet() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  // Get balance
  const { data: balance, isLoading: balanceLoading } = useBalance({
    address,
    chainId: pepeUnchained.id,
  });

  // Check if on correct network
  useEffect(() => {
    if (isConnected && chainId !== pepeUnchained.id) {
      setIsWrongNetwork(true);
      toast.error('Please switch to Pepe Unchained network');
    } else {
      setIsWrongNetwork(false);
    }
  }, [isConnected, chainId]);

  const connectWallet = async (connectorId?: string) => {
    try {
      const connector = connectorId 
        ? connectors.find(c => c.id === connectorId) 
        : connectors[0];
      
      if (connector) {
        connect({ connector });
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet');
    }
  };

  const disconnectWallet = () => {
    try {
      disconnect();
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      toast.error('Failed to disconnect wallet');
    }
  };

  const switchToCorrectNetwork = async () => {
    try {
      await switchChain({ chainId: pepeUnchained.id });
      toast.success('Switched to Pepe Unchained network');
    } catch (error) {
      console.error('Failed to switch network:', error);
      toast.error('Failed to switch network');
    }
  };

  return {
    // Connection state
    address,
    isConnected,
    isConnecting: isConnecting || isPending,
    
    // Network state
    chainId,
    isWrongNetwork,
    
    // Balance
    balance: balance?.formatted,
    balanceLoading,
    
    // Actions
    connectWallet,
    disconnectWallet,
    switchToCorrectNetwork,
    
    // Available connectors
    connectors,
  };
}
