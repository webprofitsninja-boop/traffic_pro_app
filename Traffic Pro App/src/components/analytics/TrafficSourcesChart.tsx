import React from 'react';

interface TrafficSource {
  source: string;
  visits: number;
  percentage: number;
  color: string;
}

interface TrafficSourcesChartProps {
  sources: TrafficSource[];
}

export const TrafficSourcesChart: React.FC<TrafficSourcesChartProps> = ({ sources }) => {
  const total = sources.reduce((sum, s) => sum + s.visits, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center h-48">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {sources.reduce((acc, source, index) => {
              const offset = acc.offset;
              const percentage = (source.visits / total) * 100;
              const circumference = 2 * Math.PI * 40;
              const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
              acc.elements.push(
                <circle key={index} cx="50" cy="50" r="40" fill="none" stroke={source.color} strokeWidth="20" strokeDasharray={strokeDasharray} strokeDashoffset={-offset} />
              );
              acc.offset += (percentage / 100) * circumference;
              return acc;
            }, { elements: [] as JSX.Element[], offset: 0 }).elements}
          </svg>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {sources.map((source, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }}></div>
            <div className="flex-1">
              <p className="text-sm text-white font-medium">{source.source}</p>
              <p className="text-xs text-gray-400">{source.visits.toLocaleString()} ({source.percentage}%)</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
