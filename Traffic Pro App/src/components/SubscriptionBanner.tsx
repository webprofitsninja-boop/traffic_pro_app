import React from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export function SubscriptionBanner() {
  const { subscription, loading, isOnTrial } = useSubscription();

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-lg p-4 mb-6">
        <div className="animate-pulse flex items-center justify-between">
          <div className="h-4 bg-white/20 rounded w-48"></div>
          <div className="h-4 bg-white/20 rounded w-24"></div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 border border-red-500/30 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold">No Active Subscription</h3>
            <p className="text-gray-300 text-sm">Subscribe to unlock all features</p>
          </div>
          <Link to="/billing" className="px-4 py-2 bg-white text-red-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
            Subscribe Now
          </Link>
        </div>
      </div>
    );
  }

  const trialActive = isOnTrial();
  const daysUntilRenewal = Math.ceil((new Date(subscription.current_period_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-semibold capitalize">{subscription.plan_name} Plan</h3>
              {trialActive && <Badge className="bg-green-500 text-white">Trial Active</Badge>}
              {subscription.cancel_at_period_end && <Badge className="bg-orange-500 text-white">Cancels Soon</Badge>}
            </div>
            <p className="text-gray-300 text-sm">
              {trialActive ? `Trial ends in ${Math.ceil((new Date(subscription.trial_end!).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days` : `Renews in ${daysUntilRenewal} days`}
            </p>
          </div>
        </div>
        <Link to="/billing" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors">
          Manage Subscription
        </Link>
      </div>
    </div>
  );
}
