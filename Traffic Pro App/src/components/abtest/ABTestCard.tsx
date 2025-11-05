import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Pause, TrendingUp, Users } from 'lucide-react';
import { ABTest } from '@/hooks/useABTesting';

interface ABTestCardProps {
  test: ABTest;
  onViewDetails: (test: ABTest) => void;
  onToggleStatus: (testId: string, newStatus: string) => void;
}

export function ABTestCard({ test, onViewDetails, onToggleStatus }: ABTestCardProps) {
  const statusColors = {
    draft: 'bg-gray-500',
    running: 'bg-green-500',
    paused: 'bg-yellow-500',
    completed: 'bg-blue-500'
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">{test.name}</CardTitle>
        <Badge className={statusColors[test.status]}>
          {test.status.toUpperCase()}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{test.description}</p>
        
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-gray-500" />
            <span>Traffic Split</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-gray-500" />
            <span>{test.confidence_level}% Confidence</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={() => onViewDetails(test)}
            className="flex-1"
            variant="outline"
          >
            View Results
          </Button>
          {test.status === 'running' ? (
            <Button 
              onClick={() => onToggleStatus(test.id, 'paused')}
              variant="outline"
              size="icon"
            >
              <Pause className="h-4 w-4" />
            </Button>
          ) : test.status === 'paused' || test.status === 'draft' ? (
            <Button 
              onClick={() => onToggleStatus(test.id, 'running')}
              variant="outline"
              size="icon"
            >
              <Play className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
