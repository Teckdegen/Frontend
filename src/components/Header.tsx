'use client';

import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { formatAddress } from '@/lib/web3';
import WalletConnectModal from './WalletConnectModal';
import { 
  Bars3Icon, 
  XMarkIcon, 
  WalletIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { 
    address, 
    isConnected, 
    isConnecting, 
    isWrongNetwork, 
    balance, 
    disconnectWallet, 
    switchToCorrectNetwork 
  } = useWallet();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Register', href: '/register' },
    { name: 'My Domains', href: '/domains' },
  ];

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-pepu-500 to-pepu-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="text-xl font-bold gradient-text">Pepu Domains</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-pepu-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Wallet Section */}
            <div className="flex items-center space-x-4">
              {/* Wrong Network Warning */}
              {isConnected && isWrongNetwork && (
                <button
                  onClick={switchToCorrectNetwork}
                  className="flex items-center space-x-2 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors"
                >
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <span>Wrong Network</span>
                </button>
              )}

              {/* Wallet Button */}
              {isConnected ? (
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                    <WalletIcon className="h-4 w-4" />
                    <span>{formatAddress(address!)}</span>
                    <ChevronDownIcon className="h-4 w-4" />
                  </Menu.Button>
                  
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="p-4 border-b border-gray-100">
                        <div className="text-sm text-gray-500">Connected Wallet</div>
                        <div className="font-mono text-sm font-medium">{formatAddress(address!)}</div>
                        {balance && (
                          <div className="text-sm text-gray-500 mt-1">
                            Balance: {parseFloat(balance).toFixed(4)} PEPU
                          </div>
                        )}
                      </div>
                      
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/domains"
                              className={`${
                                active ? 'bg-gray-50' : ''
                              } block px-4 py-2 text-sm text-gray-700`}
                            >
                              My Domains
                            </Link>
                          )}
                        </Menu.Item>
                        
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={disconnectWallet}
                              className={`${
                                active ? 'bg-gray-50' : ''
                              } block w-full text-left px-4 py-2 text-sm text-red-600`}
                            >
                              Disconnect
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              ) : (
                <button
                  onClick={() => setIsWalletModalOpen(true)}
                  disabled={isConnecting}
                  className="btn-primary"
                >
                  {isConnecting ? (
                    <div className="loading-dots">
                      <div style={{ '--delay': 0 } as any}></div>
                      <div style={{ '--delay': 1 } as any}></div>
                      <div style={{ '--delay': 2 } as any}></div>
                    </div>
                  ) : (
                    <>
                      <WalletIcon className="h-4 w-4" />
                      <span>Connect Wallet</span>
                    </>
                  )}
                </button>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-pepu-600 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Wallet Connect Modal */}
      <WalletConnectModal 
        isOpen={isWalletModalOpen} 
        onClose={() => setIsWalletModalOpen(false)} 
      />
    </>
  );
}
