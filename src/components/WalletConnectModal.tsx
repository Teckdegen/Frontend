'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, WalletIcon } from '@heroicons/react/24/outline';
import { useWallet } from '@/hooks/useWallet';
import Image from 'next/image';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletConnectModal({ isOpen, onClose }: WalletConnectModalProps) {
  const { connectWallet, connectors, isConnecting } = useWallet();
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const handleConnect = async (connectorId: string) => {
    try {
      setConnectingId(connectorId);
      await connectWallet(connectorId);
      onClose();
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setConnectingId(null);
    }
  };

  const walletOptions = [
    {
      id: 'metamask',
      name: 'MetaMask',
      description: 'Connect using MetaMask wallet',
      icon: (
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">M</span>
        </div>
      ),
      connector: 'metaMask',
    },
  ];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                    Connect Wallet
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {walletOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleConnect(option.connector)}
                      disabled={isConnecting || connectingId === option.connector}
                      className="wallet-option w-full"
                    >
                      <div className="flex items-center space-x-3">
                        {option.icon}
                        <div className="flex-1 text-left">
                          <div className="font-medium text-gray-900">
                            {option.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {option.description}
                          </div>
                        </div>
                        {(isConnecting || connectingId === option.connector) && (
                          <div className="loading-dots">
                            <div style={{ '--delay': 0 } as any}></div>
                            <div style={{ '--delay': 1 } as any}></div>
                            <div style={{ '--delay': 2 } as any}></div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-pepu-100 rounded-full flex items-center justify-center">
                        <span className="text-pepu-600 text-xs font-bold">!</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium mb-1">New to Pepe Unchained?</p>
                      <p>
                        You'll need to add the Pepe Unchained network to your wallet. 
                        We'll help you switch networks after connecting.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    By connecting a wallet, you agree to our{' '}
                    <a href="/terms" className="text-pepu-600 hover:text-pepu-700">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-pepu-600 hover:text-pepu-700">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
