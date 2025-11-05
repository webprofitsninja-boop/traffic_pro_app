import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Gift, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function ReferralSystem() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const referralCode = user?.id?.substring(0, 8).toUpperCase() || 'DEMO123';
  const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaEmail = () => {
    const subject = 'Try this amazing analytics platform!';
    const body = `I've been using this analytics platform and thought you'd love it too! Sign up with my link and we both get rewards: ${referralLink}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Refer Friends, Earn Rewards
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">How it works:</p>
            <ul className="text-sm space-y-1 text-slate-600">
              <li>✓ Share your unique referral link</li>
              <li>✓ Friend signs up and subscribes</li>
              <li>✓ You both get 1 month free!</li>
            </ul>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Your Referral Link</label>
            <div className="flex gap-2">
              <Input value={referralLink} readOnly />
              <Button onClick={copyToClipboard} variant="outline">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={shareViaEmail} className="flex-1">
              Share via Email
            </Button>
            <Button variant="outline" className="flex-1">
              Share on Twitter
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Your Referrals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">0</div>
              <div className="text-sm text-slate-600">Pending</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">0</div>
              <div className="text-sm text-slate-600">Active</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">$0</div>
              <div className="text-sm text-slate-600">Earned</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
