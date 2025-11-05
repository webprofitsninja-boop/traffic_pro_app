import React from 'react';


interface PricingCardProps {
  name: string;
  price: number;
  period: string;
  features: string[];
  popular?: boolean;
  onSelect?: () => void;
  // Optional custom call-to-action element (e.g., a CheckoutButton)
  cta?: React.ReactNode;
}

export const PricingCard: React.FC<PricingCardProps> = ({ name, price, period, features, popular, onSelect, cta }) => {
  return (
    <div className={`relative bg-white/5 backdrop-blur-lg rounded-xl p-8 border transition-all hover:transform hover:scale-105 ${
      popular ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-white/10'
    }`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold rounded-full">
          Most Popular
        </div>
      )}
      <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
      <div className="mb-6">
        <span className="text-5xl font-bold text-white">${price}</span>
        <span className="text-gray-400">/{period}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-gray-300">
            <span className="text-green-400 mt-1">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {cta ? (
        cta
      ) : (
        <button onClick={onSelect} className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all">
          Get Started
        </button>
      )}

    </div>
  );
};

