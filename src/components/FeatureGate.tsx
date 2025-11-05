import React from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Link } from 'react-router-dom';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog';

interface FeatureGateProps {
  feature: 'campaigns' | 'integrations' | 'visitors';
  currentCount: number;
  children: React.ReactNode;
  onBlock?: () => void;
}

export function FeatureGate({ feature, currentCount, children, onBlock }: FeatureGateProps) {
  const { getPlanLimits, subscription } = useSubscription();
  const [showUpgrade, setShowUpgrade] = React.useState(false);
  const limits = getPlanLimits();
  const limit = limits[feature];
  const isAtLimit = limit !== Infinity && currentCount >= limit;

  const handleClick = (e: React.MouseEvent) => {
    if (isAtLimit) {
      e.preventDefault();
      e.stopPropagation();
      setShowUpgrade(true);
      onBlock?.();
    }
  };

  return (
    <>
      <div onClick={handleClick} className={isAtLimit ? 'cursor-not-allowed opacity-60' : ''}>
        {children}
      </div>

      <AlertDialog open={showUpgrade} onOpenChange={setShowUpgrade}>
        <AlertDialogContent className="bg-[#1a1a2e] border-purple-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Upgrade Required</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              You've reached the limit of {limit} {feature} on your {subscription?.plan_name || 'current'} plan.
              Upgrade to unlock more {feature}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 text-white border-white/30">Cancel</AlertDialogCancel>
            <Link to="/billing" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg">
              Upgrade Plan
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
