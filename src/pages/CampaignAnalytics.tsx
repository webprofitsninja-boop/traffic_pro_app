import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Users, Target, Clock } from 'lucide-react';
import { ConversionFunnel } from '@/components/analytics/ConversionFunnel';
import { TrafficSourcesChart } from '@/components/analytics/TrafficSourcesChart';
import { GeographicMap } from '@/components/analytics/GeographicMap';
import { DeviceStats } from '@/components/analytics/DeviceStats';
import { TimeSeriesChart } from '@/components/analytics/TimeSeriesChart';
import { ExportButton } from '@/components/analytics/ExportButton';
import { CommentSection } from '@/components/collaboration/CommentSection';
import { ActivityLog } from '@/components/collaboration/ActivityLog';
import { ApprovalWorkflow } from '@/components/collaboration/ApprovalWorkflow';
import { PermissionManager } from '@/components/permissions/PermissionManager';
import { Button } from '@/components/ui/button';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const CampaignAnalytics: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const { data: analyticsData, loading } = useAnalytics(id || '', timeRange);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading analytics...</div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">No analytics data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/')} variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">{analyticsData.campaignName}</h1>
              <p className="text-gray-400">Campaign Analytics Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
              <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Last 30 Days</SelectItem>
                <SelectItem value="weekly">Last 90 Days</SelectItem>
                <SelectItem value="monthly">Last 12 Months</SelectItem>
              </SelectContent>
            </Select>
            <ExportButton campaignName={analyticsData.campaignName} data={analyticsData} />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-purple-400" />
              <p className="text-gray-400 text-sm">Total Visits</p>
            </div>
            <p className="text-3xl font-bold text-white">{analyticsData.totalVisits.toLocaleString()}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-pink-400" />
              <p className="text-gray-400 text-sm">Conversions</p>
            </div>
            <p className="text-3xl font-bold text-white">{analyticsData.totalConversions.toLocaleString()}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <p className="text-gray-400 text-sm">Conversion Rate</p>
            </div>
            <p className="text-3xl font-bold text-white">{analyticsData.conversionRate}%</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <p className="text-gray-400 text-sm">Avg. Session</p>
            </div>
            <p className="text-3xl font-bold text-white">{analyticsData.avgSessionDuration}</p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Performance Over Time</h2>
          <TimeSeriesChart data={analyticsData.timeSeriesData} />
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Conversion Funnel</h2>
            <ConversionFunnel stages={analyticsData.funnelStages} />
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Traffic Sources</h2>
            <TrafficSourcesChart sources={analyticsData.trafficSources} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Geographic Distribution</h2>
            <GeographicMap data={analyticsData.geoData} />
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Device Breakdown</h2>
            <DeviceStats data={analyticsData.deviceData} />
          </div>
        </div>

        <Tabs defaultValue="comments" className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <TabsList className="bg-white/10">
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="approval">Approval</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>

          <TabsContent value="comments" className="mt-4">
            <CommentSection campaignId={id || ''} />
          </TabsContent>
          <TabsContent value="approval" className="mt-4">
            <ApprovalWorkflow campaignId={id || ''} />
          </TabsContent>
          <TabsContent value="activity" className="mt-4">
            <ActivityLog />
          </TabsContent>
          <TabsContent value="permissions" className="mt-4">
            <PermissionManager campaignId={id || ''} teamId="default-team" />
          </TabsContent>
        </Tabs>


      </div>
    </div>
  );
};
