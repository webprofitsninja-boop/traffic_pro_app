import React, { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ExportButtonProps {
  campaignName: string;
  data: any;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ campaignName, data }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const exportToCSV = () => {
    const csvContent = [
      ['Metric', 'Value'],
      ['Campaign Name', campaignName],
      ['Total Visits', data.totalVisits],
      ['Total Conversions', data.totalConversions],
      ['Conversion Rate', `${data.conversionRate}%`],
      ['Average Session Duration', data.avgSessionDuration],
      ['Bounce Rate', `${data.bounceRate}%`],
      ['', ''],
      ['Traffic Sources', ''],
      ...data.trafficSources.map((s: any) => [s.source, s.visits]),
      ['', ''],
      ['Geographic Data', ''],
      ...data.geoData.map((g: any) => [g.country, g.visits]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${campaignName}-analytics.csv`;
    a.click();
  };

  const exportToPDF = async () => {
    setLoading(true);
    try {
      const reportData = {
        totalVisitors: data.totalVisits,
        totalConversions: data.totalConversions,
        conversionRate: data.conversionRate,
        period: campaignName,
        trafficSources: data.trafficSources.map((s: any) => ({ source: s.source, count: s.visits })),
        topPages: [],
        deviceStats: data.deviceData.reduce((acc: any, d: any) => {
          acc[d.device.toLowerCase()] = d.percentage;
          return acc;
        }, {}),
        geoData: data.geoData
      };

      const { data: pdfData, error } = await supabase.functions.invoke('generate-analytics-pdf', {
        body: { reportData, frequency: 'campaign' }
      });

      if (error) throw error;

      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${pdfData.pdf}`;
      link.download = `${campaignName}-analytics.pdf`;
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
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2" disabled={loading}>
          <Download className="w-4 h-4" />
          {loading ? 'Exporting...' : 'Export Report'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={exportToCSV}>
          <FileText className="w-4 h-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF}>
          <FileText className="w-4 h-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

