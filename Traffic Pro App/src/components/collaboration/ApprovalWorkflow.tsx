import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export const ApprovalWorkflow = ({ campaignId }: { campaignId: string }) => {
  const { user } = useAuth();
  const [approval, setApproval] = useState<any>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchApproval();
  }, [campaignId]);

  const fetchApproval = async () => {
    const { data } = await supabase.from('campaign_approvals').select('*').eq('campaign_id', campaignId).single();
    setApproval(data);
  };

  const requestApproval = async () => {
    if (!user) return;
    const { error } = await supabase.from('campaign_approvals').insert({
      campaign_id: campaignId,
      requested_by: user.id,
      requested_by_email: user.email,
      status: 'pending'
    });
    if (!error) {
      fetchApproval();
      toast.success('Approval requested');
    }
  };

  const handleApproval = async (status: 'approved' | 'rejected') => {
    if (!user || !approval) return;
    const { error } = await supabase.from('campaign_approvals').update({
      status,
      approver_id: user.id,
      approver_email: user.email,
      notes,
      reviewed_at: new Date().toISOString()
    }).eq('id', approval.id);
    
    if (!error) {
      fetchApproval();
      toast.success(`Campaign ${status}`);
    }
  };

  const getStatusBadge = () => {
    if (!approval) return null;
    const config = {
      pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
      approved: { icon: CheckCircle, color: 'bg-green-100 text-green-800' },
      rejected: { icon: XCircle, color: 'bg-red-100 text-red-800' }
    };
    const { icon: Icon, color } = config[approval.status as keyof typeof config];
    return <Badge className={color}><Icon className="w-3 h-3 mr-1" />{approval.status}</Badge>;
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Approval Status</h3>
      {!approval ? (
        <Button onClick={requestApproval}>Request Approval</Button>
      ) : (
        <div className="space-y-4">
          {getStatusBadge()}
          {approval.status === 'pending' && approval.requested_by !== user?.id && (
            <div className="space-y-2">
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add review notes" />
              <div className="flex gap-2">
                <Button onClick={() => handleApproval('approved')} className="bg-green-600">Approve</Button>
                <Button onClick={() => handleApproval('rejected')} variant="destructive">Reject</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
