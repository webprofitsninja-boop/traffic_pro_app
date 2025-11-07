import React, { useEffect, useState } from 'react';

/**
 * CheckoutSuccessBanner
 * Detects the presence of ?checkout=success in the URL (after Stripe redirect)
 * and shows a dismissible success banner. It then cleans the query param from the URL
 * to avoid re-showing on refresh.
 */
export const CheckoutSuccessBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const success = params.get('checkout');
    if (success === 'success') {
      setVisible(true);
      // Clean the URL (remove query params) without reloading
      params.delete('checkout');
      const newSearch = params.toString();
      const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '');
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="mb-6 rounded-lg border border-green-500/30 bg-gradient-to-r from-green-900/50 to-emerald-900/50 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-white font-semibold flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            Subscription Activated
          </h3>
          <p className="text-sm text-green-100 mt-1">
            Your subscription is now active. Welcome aboard! You’ve unlocked all premium features.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label="Dismiss"
            className="rounded-md px-2 py-1 text-white bg-white/10 hover:bg-white/20"
            onClick={() => setVisible(false)}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};
