import React, { useEffect, useState } from 'react';

interface MetricCardProps {
  title: string;
  value: number;
  suffix?: string;
  icon: string;
  color: string;
  trend?: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, suffix = '', icon, color, trend }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all hover:transform hover:scale-105">
      <div className="flex items-start justify-between mb-4">
        <div className={`text-3xl ${color}`}>{icon}</div>
        {trend !== undefined && (
          <span className={`text-sm font-semibold ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold text-white">
        {count.toLocaleString()}{suffix}
      </p>
    </div>
  );
};
