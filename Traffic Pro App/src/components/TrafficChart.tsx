import React from 'react';

interface TrafficSource {
  name: string;
  value: number;
  color: string;
}

interface TrafficChartProps {
  sources: TrafficSource[];
}

export const TrafficChart: React.FC<TrafficChartProps> = ({ sources }) => {
  const total = sources.reduce((sum, source) => sum + source.value, 0);

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
      <h3 className="text-xl font-bold text-white mb-6">Traffic Sources</h3>
      <div className="space-y-4">
        {sources.map((source, index) => {
          const percentage = ((source.value / total) * 100).toFixed(1);
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">{source.name}</span>
                <span className="text-white font-semibold">{percentage}%</span>
              </div>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full ${source.color} transition-all duration-1000`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
