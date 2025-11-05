import React from 'react';

interface GeoData {
  country: string;
  visits: number;
  percentage: number;
}

interface GeographicMapProps {
  data: GeoData[];
}

export const GeographicMap: React.FC<GeographicMapProps> = ({ data }) => {
  const maxVisits = Math.max(...data.map(d => d.visits));

  return (
    <div className="space-y-3">
      {data.map((country, index) => (
        <div key={index} className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">{country.country}</span>
            <span className="text-sm text-gray-400">{country.visits.toLocaleString()} ({country.percentage}%)</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${(country.visits / maxVisits) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};
