import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';

interface CampaignCardProps {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  clicks: number;
  conversions: number;
  spend: number;
  onToggle: () => void;
  onEdit: () => void;
}


export const CampaignCard: React.FC<CampaignCardProps> = ({
  id, name, status, clicks, conversions, spend, onToggle, onEdit
}) => {
  const navigate = useNavigate();

  const statusColors = {
    active: 'bg-green-500',
    paused: 'bg-yellow-500',
    completed: 'bg-gray-500'
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-2">{name}</h3>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${statusColors[status]}`}></span>
            <span className="text-sm text-gray-400 capitalize">{status}</span>
          </div>
        </div>
        <button onClick={onToggle} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors">
          {status === 'active' ? 'Pause' : 'Activate'}
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-gray-400 text-xs mb-1">Clicks</p>
          <p className="text-white font-bold">{clicks.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-1">Conversions</p>
          <p className="text-white font-bold">{conversions}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-1">Spend</p>
          <p className="text-white font-bold">${spend}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={onEdit} className="py-2 border border-white/20 hover:border-white/40 text-white rounded-lg text-sm transition-colors">
          Edit Campaign
        </button>
        <button onClick={() => navigate(`/campaign/${id}/analytics`)} className="py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Analytics
        </button>
      </div>
    </div>
  );
};
