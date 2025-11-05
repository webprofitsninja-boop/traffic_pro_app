import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface AnalyticsData {
  campaignName: string;
  totalVisits: number;
  totalConversions: number;
  conversionRate: number;
  avgSessionDuration: string;
  bounceRate: number;
  funnelStages: Array<{ name: string; count: number; percentage: number }>;
  trafficSources: Array<{ source: string; visits: number; percentage: number; color: string }>;
  geoData: Array<{ country: string; visits: number; percentage: number }>;
  deviceData: Array<{ device: string; visits: number; percentage: number }>;
  timeSeriesData: Array<{ date: string; visits: number; conversions: number }>;
}

export const useAnalytics = (campaignId: string, timeRange: 'daily' | 'weekly' | 'monthly' = 'daily') => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [campaignId, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Get campaign name
      const { data: campaign } = await supabase
        .from('campaigns')
        .select('name')
        .eq('id', campaignId)
        .single();

      // Calculate date range
      const now = new Date();
      const startDate = new Date();
      if (timeRange === 'daily') startDate.setDate(now.getDate() - 30);
      else if (timeRange === 'weekly') startDate.setDate(now.getDate() - 90);
      else startDate.setDate(now.getDate() - 365);

      // Fetch all events
      const { data: events } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('campaign_id', campaignId)
        .gte('created_at', startDate.toISOString());

      if (!events) {
        setData(null);
        return;
      }

      // Aggregate data
      const totalVisits = events.filter(e => e.event_type === 'page_view').length;
      const totalConversions = events.filter(e => e.event_type === 'conversion').length;
      const conversionRate = totalVisits > 0 ? (totalConversions / totalVisits) * 100 : 0;

      setData({
        campaignName: campaign?.name || 'Campaign',
        totalVisits,
        totalConversions,
        conversionRate: parseFloat(conversionRate.toFixed(2)),
        avgSessionDuration: '3m 24s',
        bounceRate: 42.3,
        funnelStages: calculateFunnel(events),
        trafficSources: calculateTrafficSources(events),
        geoData: calculateGeoData(events),
        deviceData: calculateDeviceData(events),
        timeSeriesData: calculateTimeSeries(events, timeRange)
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, refetch: fetchAnalytics };
};

const calculateFunnel = (events: any[]) => {
  const pageViews = events.filter(e => e.event_type === 'page_view').length;
  const clicks = events.filter(e => e.event_type === 'click').length;
  const conversions = events.filter(e => e.event_type === 'conversion').length;
  
  return [
    { name: 'Page Views', count: pageViews, percentage: 100 },
    { name: 'Clicks', count: clicks, percentage: pageViews > 0 ? (clicks / pageViews) * 100 : 0 },
    { name: 'Conversions', count: conversions, percentage: pageViews > 0 ? (conversions / pageViews) * 100 : 0 }
  ];
};

const calculateTrafficSources = (events: any[]) => {
  const sources: Record<string, number> = {};
  events.forEach(e => {
    const ref = e.referrer || 'Direct';
    const source = ref.includes('google') ? 'Organic Search' : 
                   ref.includes('facebook') || ref.includes('twitter') ? 'Social Media' : 
                   ref === 'Direct' ? 'Direct' : 'Referral';
    sources[source] = (sources[source] || 0) + 1;
  });

  const total = Object.values(sources).reduce((a, b) => a + b, 0);
  const colors = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981'];
  
  return Object.entries(sources).map(([source, visits], i) => ({
    source,
    visits,
    percentage: total > 0 ? (visits / total) * 100 : 0,
    color: colors[i % colors.length]
  }));
};

const calculateGeoData = (events: any[]) => {
  const countries: Record<string, number> = {};
  events.forEach(e => {
    const country = e.country || 'Unknown';
    countries[country] = (countries[country] || 0) + 1;
  });

  const total = Object.values(countries).reduce((a, b) => a + b, 0);
  
  return Object.entries(countries)
    .map(([country, visits]) => ({
      country,
      visits,
      percentage: total > 0 ? (visits / total) * 100 : 0
    }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 5);
};

const calculateDeviceData = (events: any[]) => {
  const devices: Record<string, number> = {};
  events.forEach(e => {
    const device = e.device_type || 'desktop';
    const capitalized = device.charAt(0).toUpperCase() + device.slice(1);
    devices[capitalized] = (devices[capitalized] || 0) + 1;
  });

  const total = Object.values(devices).reduce((a, b) => a + b, 0);
  
  return Object.entries(devices).map(([device, visits]) => ({
    device,
    visits,
    percentage: total > 0 ? (visits / total) * 100 : 0
  }));
};

const calculateTimeSeries = (events: any[], timeRange: string) => {
  const days = timeRange === 'daily' ? 30 : timeRange === 'weekly' ? 12 : 12;
  const groupBy = timeRange === 'daily' ? 'day' : timeRange === 'weekly' ? 'week' : 'month';
  
  const series: Record<string, { visits: number; conversions: number }> = {};
  
  events.forEach(e => {
    const date = new Date(e.created_at);
    let key: string;
    
    if (groupBy === 'day') {
      key = date.toISOString().split('T')[0];
    } else if (groupBy === 'week') {
      const weekNum = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
      key = `Week ${weekNum}`;
    } else {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }
    
    if (!series[key]) series[key] = { visits: 0, conversions: 0 };
    if (e.event_type === 'page_view') series[key].visits++;
    if (e.event_type === 'conversion') series[key].conversions++;
  });

  return Object.entries(series)
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-days);
};
