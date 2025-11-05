import React, { useState } from 'react';
import { MetricCard } from './MetricCard';
import { CampaignCard } from './CampaignCard';
import { IntegrationCard } from './IntegrationCard';
import { URLShortener } from './URLShortener';
import { PricingCard } from './PricingCard';
import { TrafficChart } from './TrafficChart';
import { CampaignModal } from './CampaignModal';
import { SubscriptionBanner } from './SubscriptionBanner';
import { FeatureGate } from './FeatureGate';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/hooks/useSubscription';

export default function AppLayout() {

  const [modalOpen, setModalOpen] = useState(false);
  const [campaigns, setCampaigns] = useState([
    { id: 1, name: 'Summer Sale 2025', status: 'active' as const, clicks: 15420, conversions: 342, spend: 1250 },
    { id: 2, name: 'Product Launch', status: 'active' as const, clicks: 8930, conversions: 178, spend: 890 },
    { id: 3, name: 'Brand Awareness', status: 'paused' as const, clicks: 22100, conversions: 445, spend: 2100 },
    { id: 4, name: 'Retargeting Campaign', status: 'active' as const, clicks: 12340, conversions: 567, spend: 980 },
    { id: 5, name: 'Holiday Special', status: 'completed' as const, clicks: 45200, conversions: 1230, spend: 3500 },
    { id: 6, name: 'Email Marketing', status: 'active' as const, clicks: 6780, conversions: 234, spend: 450 },
  ]);

  const [integrations, setIntegrations] = useState([
    { id: 1, name: 'Google Ads', logo: 'https://d64gsuwffb70l.cloudfront.net/68fb6c0cffc67425074cb26d_1761307713515_3c541ef9.webp', connected: true },
    { id: 2, name: 'Facebook', logo: 'https://d64gsuwffb70l.cloudfront.net/68fb6c0cffc67425074cb26d_1761307714542_40044f8f.webp', connected: true },
    { id: 3, name: 'Instagram', logo: 'https://d64gsuwffb70l.cloudfront.net/68fb6c0cffc67425074cb26d_1761307715251_fdef4d3f.webp', connected: false },
    { id: 4, name: 'TikTok', logo: 'https://d64gsuwffb70l.cloudfront.net/68fb6c0cffc67425074cb26d_1761307716847_7492499d.webp', connected: true },
    { id: 5, name: 'LinkedIn', logo: 'https://d64gsuwffb70l.cloudfront.net/68fb6c0cffc67425074cb26d_1761307717909_5df77a83.webp', connected: false },
    { id: 6, name: 'Twitter', logo: 'https://d64gsuwffb70l.cloudfront.net/68fb6c0cffc67425074cb26d_1761307718630_d71a23c7.webp', connected: true },
    { id: 7, name: 'YouTube', logo: 'https://d64gsuwffb70l.cloudfront.net/68fb6c0cffc67425074cb26d_1761307719354_615d2ba0.webp', connected: false },
    { id: 8, name: 'Pinterest', logo: 'https://d64gsuwffb70l.cloudfront.net/68fb6c0cffc67425074cb26d_1761307720069_2e2c1e8b.webp', connected: false },
  ]);

  const toggleCampaign = (id: number) => {
    setCampaigns(campaigns.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'paused' as const : 'active' as const } : c));
  };

  const toggleIntegration = (id: number) => {
    setIntegrations(integrations.map(i => i.id === id ? { ...i, connected: !i.connected } : i));
  };

  const { user, signOut } = useAuth();
  const { getPlanLimits } = useSubscription();
  const limits = getPlanLimits();
  const connectedIntegrations = integrations.filter(i => i.connected).length;

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      {/* Navigation Bar */}
      <nav className="bg-black/30 border-b border-white/10 sticky top-0 z-50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">TrafficPro</h1>
          <div className="flex gap-4 items-center">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
            <Link to="/ab-testing" className="text-gray-300 hover:text-white transition-colors">A/B Testing</Link>
            <Link to="/teams" className="text-gray-300 hover:text-white transition-colors">Teams</Link>
            <Link to="/permissions" className="text-gray-300 hover:text-white transition-colors">Permissions</Link>
            <Link to="/billing" className="text-gray-300 hover:text-white transition-colors">Billing</Link>


            <div className="text-gray-400 text-sm">{user?.email}</div>
            <Button variant="outline" size="sm" onClick={() => signOut()} className="text-white border-white/30 hover:bg-white/10">
              Logout
            </Button>
          </div>
        </div>
      </nav>


      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://d64gsuwffb70l.cloudfront.net/68fb6c0cffc67425074cb26d_1761307711686_88158f4f.webp" alt="Hero" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1a2e]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 text-center">
          <h1 className="text-6xl font-bold text-white mb-6">
            Drive Traffic That <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Converts</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Generate targeted traffic to any offer with our powerful analytics platform and multi-channel integration</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => setModalOpen(true)} className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105">
              Start Free Trial
            </button>
            <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 border border-white/30 hover:border-white/50 text-white font-semibold rounded-lg transition-all">
              View Pricing
            </button>
          </div>
        </div>
      </div>


      {/* Metrics Dashboard */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <SubscriptionBanner />
        <h2 className="text-3xl font-bold text-white mb-8">Real-Time Analytics</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <MetricCard title="Total Visitors" value={125340} icon="👥" color="text-purple-400" trend={12.5} />
          <MetricCard title="Conversions" value={3456} icon="✓" color="text-green-400" trend={8.3} />
          <MetricCard title="Click-Through Rate" value={4.2} suffix="%" icon="📊" color="text-blue-400" trend={-2.1} />
          <MetricCard title="Revenue" value={45230} suffix="" icon="💰" color="text-yellow-400" trend={15.7} />
          <MetricCard title="Avg. Session" value={3.4} suffix="m" icon="⏱️" color="text-cyan-400" trend={5.2} />
          <MetricCard title="Bounce Rate" value={32} suffix="%" icon="↩️" color="text-red-400" trend={-4.5} />
          <MetricCard title="Pages/Session" value={5.8} icon="📄" color="text-indigo-400" trend={7.8} />
          <MetricCard title="Active Campaigns" value={campaigns.filter(c => c.status === 'active').length} icon="🚀" color="text-pink-400" trend={10} />
        </div>
        
        <TrafficChart sources={[
          { name: 'Organic Search', value: 42, color: 'bg-green-500' },
          { name: 'Paid Ads', value: 28, color: 'bg-purple-500' },
          { name: 'Social Media', value: 18, color: 'bg-blue-500' },
          { name: 'Referral', value: 12, color: 'bg-yellow-500' }
        ]} />
      </div>


      {/* Campaigns Section */}

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-3xl font-bold text-white">Active Campaigns</h2>
            <p className="text-gray-400 text-sm mt-1">
              {campaigns.length} of {limits.campaigns === Infinity ? '∞' : limits.campaigns} campaigns used
            </p>
          </div>
          <FeatureGate feature="campaigns" currentCount={campaigns.length}>
            <button onClick={() => setModalOpen(true)} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all">
              + New Campaign
            </button>
          </FeatureGate>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map(campaign => (
            <CampaignCard
              key={campaign.id}
              {...campaign}
              onToggle={() => toggleCampaign(campaign.id)}
              onEdit={() => alert(`Editing ${campaign.name}`)}
            />
          ))}
        </div>
      </div>

      {/* URL Shortener */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <URLShortener />
      </div>

      {/* Integrations */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Platform Integrations</h2>
          <p className="text-gray-400 mb-2">Connect with your favorite marketing platforms</p>
          <p className="text-gray-400 text-sm">
            {connectedIntegrations} of {limits.integrations === Infinity ? '∞' : limits.integrations} integrations connected
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {integrations.map(integration => (
            <FeatureGate feature="integrations" currentCount={connectedIntegrations} key={integration.id}>
              <IntegrationCard {...integration} onToggle={() => toggleIntegration(integration.id)} />
            </FeatureGate>
          ))}
        </div>
      </div>

      {/* Pricing */}

      <div id="pricing" className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-4 text-center">Simple, Transparent Pricing</h2>
        <p className="text-gray-400 text-center mb-12">Choose the plan that fits your needs</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PricingCard
            name="Starter"
            price={29}
            period="month"
            features={['10,000 visitors/month', '5 campaigns', 'Basic analytics', 'Email support', '3 integrations']}
            onSelect={() => alert('Starting Starter trial')}
          />
          <PricingCard
            name="Professional"
            price={99}
            period="month"
            popular
            features={['100,000 visitors/month', 'Unlimited campaigns', 'Advanced analytics', 'Priority support', 'All integrations', 'Custom domains', 'API access']}
            onSelect={() => alert('Starting Professional trial')}
          />
          <PricingCard
            name="Enterprise"
            price={299}
            period="month"
            features={['Unlimited visitors', 'Unlimited campaigns', 'Enterprise analytics', '24/7 dedicated support', 'All integrations', 'White label', 'Custom solutions']}
            onSelect={() => alert('Starting Enterprise trial')}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/30 border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-xl mb-4">TrafficPro</h3>
              <p className="text-gray-400 text-sm">Drive traffic that converts with powerful analytics and multi-channel integration.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2025 TrafficPro. All rights reserved.
          </div>
        </div>
      </footer>

      <CampaignModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={(data) => console.log('New campaign:', data)} />
    </div>
  );
}
