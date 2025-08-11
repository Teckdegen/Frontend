'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import DomainRegistrationForm from '@/components/DomainRegistrationForm';
import DomainSearch from '@/components/DomainSearch';
import { useState } from 'react';
import { 
  SparklesIcon,
  InformationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

function RegisterContent() {
  const searchParams = useSearchParams();
  const initialDomain = searchParams.get('domain') || '';
  const [selectedDomain, setSelectedDomain] = useState(initialDomain);
  const [isDomainAvailable, setIsDomainAvailable] = useState(false);

  const handleDomainSelect = (domain: string, available: boolean) => {
    setSelectedDomain(domain);
    setIsDomainAvailable(available);
  };

  const handleRegistrationSuccess = (domain: string, txHash: string) => {
    // Could redirect to success page or show success message
    console.log('Registration successful:', { domain, txHash });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <SparklesIcon className="h-8 w-8 text-pepu-500 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">Register Domain</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Secure your .pepu domain on the Pepe Unchained blockchain. 
            Your Web3 identity starts here.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Domain Search */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Search Available Domains
              </h2>
              <DomainSearch 
                onDomainSelect={handleDomainSelect}
                showRegisterButton={false}
              />
            </div>

            {/* Domain Info */}
            {selectedDomain && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Domain Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Domain:</span>
                    <span className="font-mono font-semibold">
                      {selectedDomain}.pepu
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`flex items-center space-x-1 ${
                      isDomainAvailable ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <CheckCircleIcon className="h-4 w-4" />
                      <span>{isDomainAvailable ? 'Available' : 'Not Available'}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Length:</span>
                    <span>{selectedDomain.length} characters</span>
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Pricing Structure
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>1 character:</span>
                  <span className="font-semibold">$50 USDC/year</span>
                </div>
                <div className="flex justify-between">
                  <span>2 characters:</span>
                  <span className="font-semibold">$50 USDC/year</span>
                </div>
                <div className="flex justify-between">
                  <span>3 characters:</span>
                  <span className="font-semibold">$35 USDC/year</span>
                </div>
                <div className="flex justify-between">
                  <span>4 characters:</span>
                  <span className="font-semibold">$20 USDC/year</span>
                </div>
                <div className="flex justify-between">
                  <span>5+ characters:</span>
                  <span className="font-semibold">$10 USDC/year</span>
                </div>
              </div>
            </div>

            {/* Registration Info */}
            <div className="card bg-blue-50 border-blue-200">
              <div className="flex items-start space-x-3">
                <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <h4 className="font-semibold mb-1">Registration Requirements</h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Connect your wallet to the Pepe Unchained network</li>
                    <li>• Have sufficient USDC balance for registration fees</li>
                    <li>• Approve USDC spending (one-time setup)</li>
                    <li>• Confirm registration transaction</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Registration Form */}
          <div>
            <DomainRegistrationForm 
              initialDomain={selectedDomain}
              onSuccess={handleRegistrationSuccess}
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  What is a .pepu domain?
                </h3>
                <p className="text-gray-600">
                  A .pepu domain is a blockchain-based domain name on the Pepe Unchained network 
                  that resolves to your wallet address, providing a human-readable Web3 identity.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  How long can I register a domain for?
                </h3>
                <p className="text-gray-600">
                  You can register domains for anywhere from 1 to 60 years. 
                  Longer registrations offer better value and ensure you don't lose your domain.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Can I transfer my domain to another wallet?
                </h3>
                <p className="text-gray-600">
                  Yes, you can update the wallet address your domain points to at any time. 
                  You can also transfer ownership of the domain to another address.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  What happens if my domain expires?
                </h3>
                <p className="text-gray-600">
                  Expired domains become available for registration by anyone. 
                  Make sure to renew your domains before they expire to maintain ownership.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-dots">
          <div style={{ '--delay': 0 } as any}></div>
          <div style={{ '--delay': 1 } as any}></div>
          <div style={{ '--delay': 2 } as any}></div>
        </div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}
