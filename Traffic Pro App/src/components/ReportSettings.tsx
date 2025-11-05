import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useReportGeneration } from '@/hooks/useReportGeneration';
import { Mail, Plus, X, Send, Download } from 'lucide-react';



export function ReportSettings({ userId }: { userId: string }) {
  const [frequency, setFrequency] = useState('disabled');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeInsights, setIncludeInsights] = useState(true);
  const [nextSendDate, setNextSendDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();
  const { generateAndSendReport, loading: sendingReport } = useReportGeneration();




  useEffect(() => {
    loadConfig();
  }, [userId]);

  const loadConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('report_configurations')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setFrequency(data.frequency);
        setRecipients(data.recipients || []);
        setIncludeCharts(data.include_charts);
        setIncludeInsights(data.include_insights);
        setNextSendDate(data.next_send_date);
      }

    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      // Calculate next_send_date based on frequency
      let nextSendDate = null;
      if (frequency === 'weekly') {
        const now = new Date();
        nextSendDate = new Date(now);
        // Set to next Monday at 8 AM UTC
        const daysUntilMonday = (8 - now.getDay()) % 7 || 7;
        nextSendDate.setDate(now.getDate() + daysUntilMonday);
        nextSendDate.setHours(8, 0, 0, 0);
      } else if (frequency === 'monthly') {
        const now = new Date();
        // Set to first day of next month at 8 AM UTC
        nextSendDate = new Date(now.getFullYear(), now.getMonth() + 1, 1, 8, 0, 0);
      }

      const config = {
        user_id: userId,
        frequency,
        recipients,
        include_charts: includeCharts,
        include_insights: includeInsights,
        next_send_date: nextSendDate?.toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('report_configurations')
        .upsert(config, { onConflict: 'user_id' });

      if (error) throw error;

      setNextSendDate(nextSendDate?.toISOString() || null);

      toast({
        title: 'Settings saved',
        description: nextSendDate 
          ? `Your report preferences have been updated. Next report: ${nextSendDate.toLocaleDateString()}`
          : 'Your report preferences have been updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };




  const addRecipient = () => {
    if (newEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setRecipients([...recipients, newEmail]);
      setNewEmail('');
    }
  };

  const removeRecipient = (email: string) => {
    setRecipients(recipients.filter(e => e !== email));
  };

  const sendTestReport = async () => {
    await generateAndSendReport(userId, frequency === 'weekly' ? 'weekly' : 'monthly');
  };

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      if (frequency === 'weekly') {
        startDate.setDate(endDate.getDate() - 7);
      } else {
        startDate.setMonth(endDate.getMonth() - 1);
      }

      const { data: events } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      const totalVisitors = new Set(events?.map(e => e.session_id)).size;
      const totalConversions = events?.filter(e => e.event_type === 'conversion').length || 0;
      const conversionRate = totalVisitors > 0 ? ((totalConversions / totalVisitors) * 100).toFixed(2) : '0';

      const sourceCounts: Record<string, number> = {};
      events?.forEach(e => {
        const source = e.metadata?.source || 'direct';
        sourceCounts[source] = (sourceCounts[source] || 0) + 1;
      });
      const trafficSources = Object.entries(sourceCounts).map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count);

      const pageCounts: Record<string, number> = {};
      events?.forEach(e => {
        if (e.page_url) {
          pageCounts[e.page_url] = (pageCounts[e.page_url] || 0) + 1;
        }
      });
      const topPages = Object.entries(pageCounts).map(([page, views]) => ({ page, views }))
        .sort((a, b) => b.views - a.views);

      const deviceCounts: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0 };
      events?.forEach(e => {
        const device = e.metadata?.device || 'desktop';
        deviceCounts[device] = (deviceCounts[device] || 0) + 1;
      });

      const reportData = {
        totalVisitors,
        totalConversions,
        conversionRate,
        period: frequency === 'weekly' ? 'Last 7 Days' : 'Last 30 Days',
        trafficSources,
        topPages,
        deviceStats: deviceCounts
      };

      const { data, error } = await supabase.functions.invoke('generate-analytics-pdf', {
        body: { reportData, frequency }
      });

      if (error) throw error;

      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${data.pdf}`;
      link.download = `analytics-report-${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();

      toast({
        title: 'PDF Downloaded',
        description: 'Your analytics report has been downloaded successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate PDF report.',
        variant: 'destructive',
      });
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Reports
        </CardTitle>
        <CardDescription>
          Configure automated analytics reports delivered to your inbox
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Report Frequency</Label>
          <Select value={frequency} onValueChange={setFrequency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="disabled">Disabled</SelectItem>
              <SelectItem value="weekly">Weekly (Every Monday)</SelectItem>
              <SelectItem value="monthly">Monthly (1st of month)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Recipients</Label>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="email@example.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addRecipient()}
            />
            <Button onClick={addRecipient} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2 mt-2">
            {recipients.map((email) => (
              <div key={email} className="flex items-center justify-between bg-muted p-2 rounded">
                <span className="text-sm">{email}</span>
                <Button variant="ghost" size="sm" onClick={() => removeRecipient(email)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Include Charts</Label>
            <Switch checked={includeCharts} onCheckedChange={setIncludeCharts} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Include Insights</Label>
            <Switch checked={includeInsights} onCheckedChange={setIncludeInsights} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button onClick={saveConfig} disabled={saving} className="flex-1">
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
            <Button onClick={sendTestReport} disabled={sendingReport || frequency === 'disabled'} variant="outline" className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              {sendingReport ? 'Sending...' : 'Send Test Report'}
            </Button>
          </div>
          <Button onClick={downloadPDF} disabled={downloading} variant="secondary" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            {downloading ? 'Generating PDF...' : 'Download PDF Report'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
