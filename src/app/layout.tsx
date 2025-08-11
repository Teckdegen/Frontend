import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Header from '@/components/Header';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pepu Domains - Decentralized Naming Service',
  description: 'Secure your .pepu domain on the Pepe Unchained blockchain. The premier decentralized naming service for Web3 identity.',
  keywords: ['pepu', 'domains', 'blockchain', 'web3', 'pepe unchained', 'naming service'],
  authors: [{ name: 'Pepu Domains Team' }],
  creator: 'Pepu Domains',
  publisher: 'Pepu Domains',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://pepudomains.com'),
  openGraph: {
    title: 'Pepu Domains - Decentralized Naming Service',
    description: 'Secure your .pepu domain on the Pepe Unchained blockchain.',
    url: 'https://pepudomains.com',
    siteName: 'Pepu Domains',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pepu Domains',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pepu Domains - Decentralized Naming Service',
    description: 'Secure your .pepu domain on the Pepe Unchained blockchain.',
    images: ['/og-image.png'],
    creator: '@PepuDomains',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <Providers>
          <div className="min-h-full flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <footer className="bg-gray-50 border-t border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-pepu-500 to-pepu-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">P</span>
                      </div>
                      <span className="text-xl font-bold gradient-text">Pepu Domains</span>
                    </div>
                    <p className="text-gray-600 mb-4 max-w-md">
                      The premier decentralized naming service for the Pepe Unchained blockchain. 
                      Secure your Web3 identity with .pepu domains.
                    </p>
                    <div className="flex space-x-4">
                      <a 
                        href="https://twitter.com/pepudomains" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-pepu-600 transition-colors"
                      >
                        Twitter
                      </a>
                      <a 
                        href="https://discord.gg/pepudomains" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-pepu-600 transition-colors"
                      >
                        Discord
                      </a>
                      <a 
                        href="https://github.com/pepudomains" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-pepu-600 transition-colors"
                      >
                        GitHub
                      </a>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
                    <ul className="space-y-2">
                      <li><a href="/" className="text-gray-600 hover:text-pepu-600 transition-colors">Search Domains</a></li>
                      <li><a href="/register" className="text-gray-600 hover:text-pepu-600 transition-colors">Register</a></li>
                      <li><a href="/domains" className="text-gray-600 hover:text-pepu-600 transition-colors">My Domains</a></li>
                      <li><a href="/about" className="text-gray-600 hover:text-pepu-600 transition-colors">About</a></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
                    <ul className="space-y-2">
                      <li><a href="/docs" className="text-gray-600 hover:text-pepu-600 transition-colors">Documentation</a></li>
                      <li><a href="/api" className="text-gray-600 hover:text-pepu-600 transition-colors">API</a></li>
                      <li><a href="/support" className="text-gray-600 hover:text-pepu-600 transition-colors">Support</a></li>
                      <li><a href="/terms" className="text-gray-600 hover:text-pepu-600 transition-colors">Terms</a></li>
                      <li><a href="/privacy" className="text-gray-600 hover:text-pepu-600 transition-colors">Privacy</a></li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm">
                      © 2024 Pepu Domains. All rights reserved.
                    </p>
                    <div className="mt-4 md:mt-0 flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        Contract: {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS?.slice(0, 6)}...{process.env.NEXT_PUBLIC_CONTRACT_ADDRESS?.slice(-4)}
                      </span>
                      <a 
                        href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/address/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-pepu-600 hover:text-pepu-700 transition-colors"
                      >
                        View on Explorer
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </div>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#374151',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
