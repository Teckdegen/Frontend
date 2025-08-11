import DomainSearch from '@/components/DomainSearch';
import { 
  GlobeAltIcon, 
  ShieldCheckIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function HomePage() {
  const features = [
    {
      name: 'Decentralized Identity',
      description: 'Own your Web3 identity with .pepu domains on the Pepe Unchained blockchain.',
      icon: GlobeAltIcon,
    },
    {
      name: 'Secure & Permanent',
      description: 'Your domains are secured by blockchain technology and cannot be censored.',
      icon: ShieldCheckIcon,
    },
    {
      name: 'Affordable Pricing',
      description: 'Character-based pricing starting from just $10 USDC per year.',
      icon: CurrencyDollarIcon,
    },
    {
      name: 'Instant Resolution',
      description: 'Lightning-fast domain resolution with global availability.',
      icon: ClockIcon,
    },
  ];

  const stats = [
    { name: 'Domains Registered', value: '10,000+' },
    { name: 'Active Users', value: '5,000+' },
    { name: 'Total Value Locked', value: '$500K+' },
    { name: 'Network Uptime', value: '99.9%' },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Your Web3 Identity
              <span className="block gradient-text">Starts Here</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Secure your .pepu domain on the Pepe Unchained blockchain. 
              The premier decentralized naming service for the next generation of the internet.
            </p>
            
            {/* Search Component */}
            <div className="mb-12">
              <DomainSearch />
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-primary text-lg px-8 py-3">
                <SparklesIcon className="h-5 w-5" />
                Register Domain
              </Link>
              <Link href="/about" className="btn-outline text-lg px-8 py-3">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.name} className="text-center">
                <div className="text-3xl font-bold text-pepu-600 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Pepu Domains?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built on the Pepe Unchained blockchain, our domains offer unmatched 
              security, affordability, and performance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.name} className="card-hover text-center">
                <div className="w-12 h-12 bg-pepu-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-pepu-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.name}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Character-based pricing that scales with your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { chars: '1 Character', price: '$50', popular: false },
              { chars: '3 Characters', price: '$35', popular: true },
              { chars: '4 Characters', price: '$20', popular: false },
              { chars: '5+ Characters', price: '$10', popular: false },
            ].map((tier) => (
              <div 
                key={tier.chars} 
                className={`card relative ${tier.popular ? 'ring-2 ring-pepu-500' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-pepu-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {tier.chars}
                  </h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">{tier.price}</span>
                    <span className="text-gray-600"> USDC/year</span>
                  </div>
                  <Link 
                    href="/register" 
                    className={tier.popular ? 'btn-primary w-full' : 'btn-outline w-full'}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600">
              All prices are in USDC. Domains can be registered for up to 60 years.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="gradient-bg py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Claim Your Web3 Identity?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already secured their .pepu domains. 
            Your perfect domain is waiting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn bg-white text-pepu-600 hover:bg-gray-100 text-lg px-8 py-3">
              <UserGroupIcon className="h-5 w-5" />
              Register Now
            </Link>
            <Link href="/domains" className="btn border-white text-white hover:bg-white/10 text-lg px-8 py-3">
              View My Domains
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
