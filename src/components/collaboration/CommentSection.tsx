import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { MessageSquare, Send } from 'lucide-react';
import { toast } from 'sonner';

export const CommentSection = ({ campaignId }: { campaignId: string }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchComments();
  }, [campaignId]);

  const fetchComments = async () => {
    const { data } = await supabase.from('campaign_comments').select('*').eq('campaign_id', campaignId).order('created_at', { ascending: false });
    setComments(data || []);
  };

  const handleSubmit = async () => {
    if (!user || !newComment.trim()) return;
    
    const mentions = newComment.match(/@(\S+)/g)?.map(m => m.slice(1)) || [];
    
    const { error } = await supabase.from('campaign_comments').insert({
      campaign_id: campaignId,
      user_id: user.id,
      user_email: user.email,
      comment: newComment,
      mentions
    });

    if (!error) {
      if (mentions.length > 0) {
        await supabase.functions.invoke('send-team-notification', {
          body: { mentionedUsers: mentions, subject: 'You were mentioned', message: `${user.email} mentioned you: ${newComment}` }
        });
      }
      setNewComment('');
      fetchComments();
      toast.success('Comment added');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add comment (use @email to mention)" />
        <Button onClick={handleSubmit}><Send className="w-4 h-4" /></Button>
      </div>
      {comments.map((c) => (
        <Card key={c.id} className="p-4">
          <div className="flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <div className="flex-1">
              <div className="font-semibold text-sm">{c.user_email}</div>
              <p className="text-sm mt-1">{c.comment}</p>
              <div className="text-xs text-gray-500 mt-2">{new Date(c.created_at).toLocaleString()}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
