import { useState } from 'react';
import { Button } from '@/components/ui/button';
// We now call our Vercel API route instead of a Supabase Edge Function
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CheckoutButtonProps {
  planName: string;
  planPrice: number;
  userId?: string;
  email?: string;
}

export function CheckoutButton({ planName, planPrice, userId, email }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckout = async () => {
    // DEMO MODE: Use demo values if user is not authenticated
    const demoUserId = userId || 'demo-user-id';
    const demoEmail = email || 'webprofitsninja@gmail.com';

    setLoading(true);
    try {
      const resp = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          planName, 
          planPrice, 
          userId: demoUserId, 
          email: demoEmail 
        })
      })

      if (!resp.ok) throw new Error('Failed to create session')

      const data = await resp.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('Missing checkout url')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start checkout. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleCheckout} disabled={loading} className="w-full">
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {loading ? 'Processing...' : 'Start 14-Day Free Trial'}
    </Button>
  );
}
