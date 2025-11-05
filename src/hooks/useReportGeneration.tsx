import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function useReportGeneration() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateAndSendReport = async (userId: string, frequency: 'weekly' | 'monthly') => {
    setLoading(true);
    try {
      // Fetch analytics data
      const endDate = new Date();
      const startDate = new Date();
      if (frequency === 'weekly') {
        startDate.setDate(endDate.getDate() - 7);
      } else {
        startDate.setMonth(endDate.getMonth() - 1);
      }

      const { data: events, error: eventsError } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (eventsError) throw eventsError;

      // Calculate metrics
      const totalVisitors = new Set(events?.map(e => e.session_id)).size;
      const totalConversions = events?.filter(e => e.event_type === 'conversion').length || 0;
      const conversionRate = totalVisitors > 0 ? ((totalConversions / totalVisitors) * 100).toFixed(2) : '0';

      // Get user email
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) throw new Error('User email not found');

      // Get report config
      const { data: config } = await supabase
        .from('report_configurations')
        .select('recipients')
        .eq('user_id', userId)
        .single();

      const recipients = config?.recipients || [user.email];

      // Send report to each recipient
      for (const email of recipients) {
        const { error: sendError } = await supabase.functions.invoke('send-analytics-report', {
          body: {
            email,
            frequency,
            reportData: {
              totalVisitors,
              totalConversions,
              conversionRate,
              period: frequency === 'weekly' ? 'Last 7 Days' : 'Last 30 Days'
            }
          }
        });

        if (sendError) throw sendError;
      }

      toast({
        title: 'Report sent',
        description: `Analytics report sent to ${recipients.length} recipient(s)`,
      });

      return { success: true };
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate and send report',
        variant: 'destructive',
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return { generateAndSendReport, loading };
}
