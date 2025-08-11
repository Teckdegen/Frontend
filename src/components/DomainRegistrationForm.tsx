'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useWallet } from '@/hooks/useWallet';
import { usePepuDomainsContract } from '@/hooks/useContract';
import { 
  WalletIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const registrationSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
  years: z.number().min(1, 'Must register for at least 1 year').max(10, 'Maximum 10 years allowed'),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface DomainRegistrationFormProps {
  name: string;
  tld: string;
  isAvailable: boolean;
  baseFee: bigint;
  onSuccess?: () => void;
}

export default function DomainRegistrationForm({
  name,
  tld,
  isAvailable,
  baseFee,
  onSuccess
}: DomainRegistrationFormProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationStep, setRegistrationStep] = useState<'form' | 'approve' | 'register' | 'success'>('form');
  const [txHash, setTxHash] = useState<string>('');
  const [years, setYears] = useState(1);

  const { address, isConnected } = useWallet();
  const contract = usePepuDomainsContract();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      walletAddress: address || '',
      years: 1,
    },
    mode: 'onChange'
  });

  const watchedYears = watch('years');
  const totalFee = baseFee * BigInt(watchedYears);

  // Update form when wallet connects
  useEffect(() => {
    if (address) {
      setValue('walletAddress', address);
    }
  }, [address, setValue]);

  // Update years in form when local state changes
  useEffect(() => {
    setValue('years', years);
  }, [years, setValue]);

  const handleYearsChange = (newYears: number) => {
    const clampedYears = Math.max(1, Math.min(10, newYears));
    setYears(clampedYears);
  };

  const onSubmit = async (data: RegistrationFormData) => {
    if (!isAvailable) {
      toast.error('Domain is not available');
      return;
    }

    try {
      setIsRegistering(true);
      setRegistrationStep('approve');

      // Step 1: Approve USDC spending
      toast.loading('Approving USDC spending...', { id: 'registration' });
      
      const approveResult = await contract.approveUSDC(totalFee);
      if (!approveResult.success) {
        throw new Error(approveResult.error || 'Failed to approve USDC');
      }

      // Wait for approval confirmation
      await approveResult.wait?.();
      
      setRegistrationStep('register');
      toast.loading('Registering domain...', { id: 'registration' });

      // Step 2: Register domain with multiple years
      const registerResult = await contract.registerDomain(name, tld, data.walletAddress, data.years);
      if (!registerResult.success) {
        throw new Error(registerResult.error || 'Failed to register domain');
      }

      setTxHash(registerResult.hash || '');
      
      // Wait for registration confirmation
      await registerResult.wait?.();
      
      setRegistrationStep('success');
      toast.success(`Successfully registered ${name}${tld} for ${data.years} year${data.years > 1 ? 's' : ''}!`, { 
        id: 'registration',
        duration: 5000 
      });

      onSuccess?.();

    } catch (error: any) {
      console.error('Registration failed:', error);
      toast.error(error.message || 'Registration failed', { id: 'registration' });
      setRegistrationStep('form');
    } finally {
      setIsRegistering(false);
    }
  };

  if (!isAvailable) {
    return (
      <div className="card border-red-500/20 bg-red-500/5">
        <div className="flex items-center space-x-3 text-red-400">
          <ExclamationTriangleIcon className="h-6 w-6" />
          <div>
            <h3 className="font-semibold">Domain Not Available</h3>
            <p className="text-sm text-red-300">
              {name}{tld} is already registered or reserved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (registrationStep === 'success') {
    return (
      <div className="card border-green-500/20 bg-green-500/5">
        <div className="text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-green-400 mb-2">
            Registration Successful!
          </h3>
          <p className="text-gray-300 mb-4">
            {name}{tld} has been registered for {watchedYears} year{watchedYears > 1 ? 's' : ''} and is now yours.
          </p>
          {txHash && (
            <a
              href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm"
            >
              View Transaction
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">
          Register {name}{tld}
        </h3>
        <p className="text-gray-400">
          Complete the form below to register your domain.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Years Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            <CalendarDaysIcon className="h-4 w-4 inline mr-2" />
            Registration Period
          </label>
          
          <div className="space-y-4">
            {/* Years Counter */}
            <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-lg border border-dark-600">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => handleYearsChange(years - 1)}
                  disabled={years <= 1}
                  className="w-8 h-8 rounded-full bg-primary-600 hover:bg-primary-700 disabled:bg-dark-600 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                  <MinusIcon className="h-4 w-4 text-white" />
                </button>
                
                <div className="text-center min-w-[100px]">
                  <div className="text-2xl font-bold text-white">{years}</div>
                  <div className="text-sm text-gray-400">
                    year{years > 1 ? 's' : ''}
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => handleYearsChange(years + 1)}
                  disabled={years >= 10}
                  className="w-8 h-8 rounded-full bg-primary-600 hover:bg-primary-700 disabled:bg-dark-600 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                  <PlusIcon className="h-4 w-4 text-white" />
                </button>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-semibold text-primary-400">
                  ${(Number(totalFee) / 1e6).toFixed(2)} USDC
                </div>
                <div className="text-sm text-gray-400">
                  ${(Number(baseFee) / 1e6).toFixed(2)} USDC/year
                </div>
              </div>
            </div>

            {/* Quick Selection Buttons */}
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 5, 10].map((yearOption) => (
                <button
                  key={yearOption}
                  type="button"
                  onClick={() => handleYearsChange(yearOption)}
                  className={`p-2 rounded-lg text-sm font-medium transition-all ${
                    years === yearOption
                      ? 'bg-primary-600 text-white shadow-purple'
                      : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white'
                  }`}
                >
                  {yearOption}yr{yearOption > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>
          
          {errors.years && (
            <p className="mt-1 text-sm text-red-400">{errors.years.message}</p>
          )}
        </div>

        {/* Wallet Address */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <WalletIcon className="h-4 w-4 inline mr-2" />
            Wallet Address
          </label>
          <input
            {...register('walletAddress')}
            type="text"
            placeholder="0x..."
            className={`input ${errors.walletAddress ? 'input-error' : ''}`}
          />
          {errors.walletAddress && (
            <p className="mt-1 text-sm text-red-400">{errors.walletAddress.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-400">
            This domain will resolve to this wallet address
          </p>
        </div>

        {/* Registration Summary */}
        <div className="bg-dark-800/30 rounded-lg p-4 border border-dark-600">
          <h4 className="font-semibold text-white mb-3">Registration Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Domain:</span>
              <span className="text-white font-mono">{name}{tld}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Period:</span>
              <span className="text-white">{years} year{years > 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Rate:</span>
              <span className="text-white">${(Number(baseFee) / 1e6).toFixed(2)} USDC/year</span>
            </div>
            <div className="flex justify-between border-t border-dark-600 pt-2">
              <span className="text-gray-300 font-medium">Total Cost:</span>
              <span className="text-primary-400 font-bold">
                ${(Number(totalFee) / 1e6).toFixed(2)} USDC
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Expires:</span>
              <span className="text-gray-300">
                {new Date(Date.now() + years * 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="space-y-3">
          {!isConnected ? (
            <div className="text-center">
              <p className="text-gray-400 mb-3">Connect your wallet to register</p>
            </div>
          ) : (
            <button
              type="submit"
              disabled={!isValid || isRegistering || !isConnected}
              className="btn-primary w-full py-3 text-base font-semibold"
            >
              {isRegistering ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="loading-dots">
                    <div style={{ '--delay': 0 } as any}></div>
                    <div style={{ '--delay': 1 } as any}></div>
                    <div style={{ '--delay': 2 } as any}></div>
                  </div>
                  <span>
                    {registrationStep === 'approve' && 'Approving USDC...'}
                    {registrationStep === 'register' && 'Registering Domain...'}
                  </span>
                </div>
              ) : (
                <>
                  <CurrencyDollarIcon className="h-5 w-5" />
                  Register for ${(Number(totalFee) / 1e6).toFixed(2)} USDC
                </>
              )}
            </button>
          )}

          <p className="text-xs text-gray-400 text-center">
            Registration requires two transactions: USDC approval and domain registration.
            Make sure you have sufficient USDC and gas fees.
          </p>
        </div>
      </form>
    </div>
  );
}
