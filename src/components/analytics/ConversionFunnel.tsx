import React from 'react';

interface FunnelStage {
  name: string;
  count: number;
  percentage: number;
}

interface ConversionFunnelProps {
  stages: FunnelStage[];
}

export const ConversionFunnel: React.FC<ConversionFunnelProps> = ({ stages }) => {
  const maxCount = stages[0]?.count || 1;

  return (
    <div className="space-y-3">
      {stages.map((stage, index) => (
        <div key={index} className="relative">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-white">{stage.name}</span>
            <span className="text-sm text-gray-400">{stage.count.toLocaleString()} ({stage.percentage}%)</span>
          </div>
          <div className="relative h-12 bg-white/5 rounded-lg overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500 flex items-center justify-center"
              style={{ width: `${(stage.count / maxCount) * 100}%` }}
            >
              <span className="text-white text-xs font-bold">{stage.percentage}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
