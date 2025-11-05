import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface ABTest {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  campaign_id: string;
  start_date: string;
  end_date: string;
  winner_variation_id?: string;
  confidence_level: number;
}

export interface ABTestVariation {
  id: string;
  ab_test_id: string;
  name: string;
  description: string;
  traffic_percentage: number;
  is_control: boolean;
  config: any;
}

export interface ABTestResult {
  id: string;
  variation_id: string;
  visitors: number;
  conversions: number;
  conversion_rate: number;
  revenue: number;
  statistical_significance: number;
}

export function useABTesting() {
  const [tests, setTests] = useState<ABTest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTests = async () => {
    const { data } = await supabase
      .from('ab_tests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setTests(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const createTest = async (testData: Partial<ABTest>) => {
    const { data, error } = await supabase
      .from('ab_tests')
      .insert(testData)
      .select()
      .single();
    
    if (data) {
      setTests([data, ...tests]);
      return data;
    }
    throw error;
  };

  const trackEvent = async (testId: string, variationId: string, eventType: 'visitor' | 'conversion', value?: number) => {
    await supabase.functions.invoke('track-ab-test-event', {
      body: { testId, variationId, eventType, value }
    });
  };

  const calculateSignificance = async (testId: string) => {
    const { data } = await supabase.functions.invoke('calculate-ab-significance', {
      body: { testId }
    });
    return data;
  };

  return {
    tests,
    loading,
    createTest,
    trackEvent,
    calculateSignificance,
    refetch: fetchTests
  };
}
