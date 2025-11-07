import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  plan_name: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  trial_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
}

export const PLAN_LIMITS = {
  starter: {
    campaigns: 5,
    integrations: 3,
    visitors: 10000,
  },
  professional: {
    campaigns: Infinity,
    integrations: Infinity,
    visitors: 100000,
  },
  enterprise: {
    campaigns: Infinity,
    integrations: Infinity,
    visitors: Infinity,
  },
};

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Owner override: grant Enterprise access without payment when email matches
  // Configure in Vercel (and local .env): VITE_OWNER_EMAILS="owner@example.com,other@domain.com"
  const ownerEmails = (import.meta.env.VITE_OWNER_EMAILS as string | undefined)?.split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean) || [];

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const email = (user.email || '').toLowerCase();
    const isOwner = !!email && ownerEmails.includes(email);

    if (isOwner) {
      // Synthesize an active Enterprise subscription for the owner
      const now = new Date();
      const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 days
      const synthetic: Subscription = {
        id: 'synthetic-owner-sub',
        user_id: user.id,
        stripe_subscription_id: 'synthetic',
        stripe_customer_id: 'synthetic',
        plan_name: 'enterprise',
        status: 'active',
        current_period_start: now.toISOString(),
        current_period_end: end.toISOString(),
        trial_end: null,
        cancel_at_period_end: false,
        created_at: now.toISOString(),
      };
      setSubscription(synthetic);
      setLoading(false);
      return;
    }

    fetchSubscription();
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
      }
      setSubscription(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPlanLimits = () => {
    if (!subscription) return PLAN_LIMITS.starter;
    const planKey = subscription.plan_name.toLowerCase() as keyof typeof PLAN_LIMITS;
    return PLAN_LIMITS[planKey] || PLAN_LIMITS.starter;
  };

  const isOnTrial = () => {
    if (!subscription?.trial_end) return false;
    return new Date(subscription.trial_end) > new Date();
  };

  return {
    subscription,
    loading,
    getPlanLimits,
    isOnTrial,
    refetch: fetchSubscription,
  };
}
