import React from 'react';
import { Users, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

export interface Metrics {
  occupancy: number;
  avgWaitTime: number;
  incidents: number;
  sentiment: string | number;
}

interface MetricsCardsProps {
  metrics: Metrics;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics }) => {
  const stats = [
    { label: 'Occupancy', value: `${metrics.occupancy}%`, icon: <Users size={20} className="text-fifa-blue" aria-hidden="true" /> },
    { label: 'Avg Wait', value: `${metrics.avgWaitTime}m`, icon: <Clock size={20} className="text-fifa-amber" aria-hidden="true" /> },
    { label: 'Incidents', value: metrics.incidents, icon: <AlertTriangle size={20} className="text-red-400" aria-hidden="true" /> },
    { label: 'Sentiment', value: metrics.sentiment, icon: <TrendingUp size={20} className="text-fifa-green" aria-hidden="true" /> }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" role="region" aria-label="Stadium Metrics">
      {stats.map((stat, i) => (
        <div key={i} className="glass-panel p-5 rounded-[1.5rem] flex flex-col gap-2 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors duration-500" aria-hidden="true"></div>
          <div className="flex justify-between items-center relative z-10">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
            <div className="p-2 bg-black/40 rounded-xl shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-300">
              {stat.icon}
            </div>
          </div>
          <div className="text-3xl font-bold font-display text-white relative z-10 mt-1 drop-shadow-md">
            {stat.value}
          </div>
          {/* Hidden text for screen readers so it reads nicely */}
          <span className="sr-only">{stat.label} is currently at {stat.value}</span>
        </div>
      ))}
    </div>
  );
};

export default React.memo(MetricsCards);
