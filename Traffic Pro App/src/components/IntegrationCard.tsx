import React from 'react';

interface IntegrationCardProps {
  name: string;
  logo: string;
  connected: boolean;
  onToggle: () => void;
}

export const IntegrationCard: React.FC<IntegrationCardProps> = ({ name, logo, connected, onToggle }) => {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all hover:transform hover:scale-105">
      <div className="flex flex-col items-center text-center">
        <img src={logo} alt={name} className="w-16 h-16 mb-4 rounded-lg" />
        <h3 className="text-white font-semibold mb-2">{name}</h3>
        <div className="flex items-center gap-2 mb-4">
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-gray-500'}`}></span>
          <span className="text-sm text-gray-400">{connected ? 'Connected' : 'Not Connected'}</span>
        </div>
        <button
          onClick={onToggle}
          className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${
            connected
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {connected ? 'Disconnect' : 'Connect'}
        </button>
      </div>
    </div>
  );
};
