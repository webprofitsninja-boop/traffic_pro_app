import React, { useState } from 'react';

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  campaign?: any; // For editing existing campaigns
}

export const CampaignModal: React.FC<CampaignModalProps> = ({ isOpen, onClose, onSubmit, campaign }) => {
  const [formData, setFormData] = useState({
    name: '',
    budget: '',
    platform: 'google'
  });

  // Update form when campaign prop changes (for editing)
  React.useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name || '',
        budget: campaign.spend?.toString() || '',
        platform: 'google'
      });
    } else {
      setFormData({ name: '', budget: '', platform: 'google' });
    }
  }, [campaign]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', budget: '', platform: 'google' });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-[#1a1a2e] rounded-xl p-8 max-w-md w-full mx-4 border border-white/10" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-white mb-6">
          {campaign ? 'Edit Campaign' : 'Create New Campaign'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Campaign Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Daily Budget ($)</label>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Platform</label>
            <select
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="google">Google Ads</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
            </select>
          </div>
          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-white/20 hover:border-white/40 text-white rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all">
              {campaign ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
