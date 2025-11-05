import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, TrendingUp, Users, DollarSign } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Variation {
  id: string;
  name: string;
  is_control: boolean;
}

interface Result {
  variation_id: string;
  visitors: number;
  conversions: number;
  conversion_rate: number;
  revenue: number;
}

interface ABTestResultsProps {
  testId: string;
}

export function ABTestResults({ testId }: ABTestResultsProps) {
  const [variations, setVariations] = useState<Variation[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [significance, setSignificance] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [testId]);

  const fetchData = async () => {
    const { data: vars } = await supabase
      .from('ab_test_variations')
      .select('*')
      .eq('ab_test_id', testId);
    
    const { data: res } = await supabase
      .from('ab_test_results')
      .select('*')
      .eq('ab_test_id', testId);

    if (vars) setVariations(vars);
    if (res) setResults(res);

    const { data: sig } = await supabase.functions.invoke('calculate-ab-significance', {
      body: { testId }
    });
    if (sig) setSignificance(sig);
  };

  return (
    <div className="space-y-4">
      {variations.map(variation => {
        const result = results.find(r => r.variation_id === variation.id);
        const sig = significance?.results?.find((s: any) => s.variationId === variation.id);
        
        return (
          <Card key={variation.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {variation.name}
                  {variation.is_control && <Badge variant="outline">Control</Badge>}
                  {sig?.isSignificant && <Trophy className="h-5 w-5 text-yellow-500" />}
                </CardTitle>
                {sig && (
                  <Badge className={sig.isSignificant ? 'bg-green-500' : 'bg-gray-500'}>
                    {sig.confidence}% Confidence
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Users className="h-4 w-4" />
                    Visitors
                  </div>
                  <div className="text-2xl font-bold">{result?.visitors || 0}</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <TrendingUp className="h-4 w-4" />
                    Conversions
                  </div>
                  <div className="text-2xl font-bold">{result?.conversions || 0}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Conv. Rate</div>
                  <div className="text-2xl font-bold">{result?.conversion_rate.toFixed(2) || 0}%</div>
                  <Progress value={result?.conversion_rate || 0} className="mt-2" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <DollarSign className="h-4 w-4" />
                    Revenue
                  </div>
                  <div className="text-2xl font-bold">${result?.revenue.toFixed(2) || 0}</div>
                </div>
              </div>
              {sig && !variation.is_control && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium">
                    Lift: <span className={sig.lift > 0 ? 'text-green-600' : 'text-red-600'}>
                      {sig.lift > 0 ? '+' : ''}{sig.lift.toFixed(2)}%
                    </span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
