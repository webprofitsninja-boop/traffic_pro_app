import React from 'react';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

interface DeviceData {
  device: string;
  visits: number;
  percentage: number;
}

interface DeviceStatsProps {
  data: DeviceData[];
}

export const DeviceStats: React.FC<DeviceStatsProps> = ({ data }) => {
  const icons = {
    Desktop: Monitor,
    Mobile: Smartphone,
    Tablet: Tablet
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {data.map((item, index) => {
        const Icon = icons[item.device as keyof typeof icons] || Monitor;
        return (
          <div key={index} className="bg-white/5 rounded-lg p-4 text-center">
            <Icon className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <p className="text-2xl font-bold text-white mb-1">{item.percentage}%</p>
            <p className="text-sm text-gray-400">{item.device}</p>
            <p className="text-xs text-gray-500 mt-1">{item.visits.toLocaleString()} visits</p>
          </div>
        );
      })}
    </div>
  );
};
