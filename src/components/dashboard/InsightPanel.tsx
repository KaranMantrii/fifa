import { Zap } from 'lucide-react';
import React from 'react';

export interface Insight {
  id: string | number;
  type?: 'warning' | 'info' | 'success';
  severity?: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  time: string;
}

interface InsightPanelProps {
  insights: Insight[];
}

const InsightPanel: React.FC<InsightPanelProps> = ({ insights }) => {
  return (
    <div className="w-full md:w-[380px] flex flex-col gap-4">
      <div className="glass-panel p-6 rounded-[1.5rem] flex items-center justify-between border border-fifa-amber/20 relative overflow-hidden group shadow-[0_8px_32px_rgba(245,158,11,0.1)]">
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-gradient-to-br from-fifa-amber/20 to-orange-500/10 rounded-full blur-3xl animate-pulse group-hover:bg-fifa-amber/30 transition-colors duration-700" aria-hidden="true"></div>
        <div className="relative z-10">
          <h3 className="text-fifa-amber font-bold font-display text-lg flex items-center gap-2 tracking-tight">
            <Zap size={18} className="fill-fifa-amber text-fifa-amber drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" aria-hidden="true" />
            GenAI Operator Mode
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-medium">Actively analyzing 142 data streams</p>
        </div>
        <div className="relative z-10 h-3.5 w-3.5 bg-fifa-amber rounded-full animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.8)] border border-neutral-900" aria-label="System Active Indicator"></div>
      </div>

      <div className="flex-1 glass-panel rounded-2xl p-5 flex flex-col gap-4">
        <h4 className="font-semibold text-white">Recommended Actions</h4>
        
        <div className="flex flex-col gap-3" aria-live="polite" aria-atomic="true">
          {insights.map(insight => (
            <div 
              key={insight.id} 
              className={`p-4 rounded-xl border bg-black/20 relative overflow-hidden group hover:bg-black/40 transition-colors
                ${(insight.severity === 'high' || insight.type === 'warning') ? 'border-red-500/30' : 
                  (insight.severity === 'medium' || insight.type === 'info') ? 'border-fifa-amber/30' : 
                  'border-fifa-green/30'}`}
            >
              <div className={`absolute top-0 left-0 w-1 h-full 
                ${(insight.severity === 'high' || insight.type === 'warning') ? 'bg-red-500' : 
                  (insight.severity === 'medium' || insight.type === 'info') ? 'bg-fifa-amber' : 
                  'bg-fifa-green'}`} aria-hidden="true"></div>
              
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-semibold text-sm text-slate-100">{insight.title}</h5>
                <span className="text-[10px] text-slate-500">{insight.time}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {insight.description}
              </p>
              <div className="mt-3 flex gap-2">
                {(insight.severity === 'high' || insight.type === 'warning') ? (
                  <button 
                    className="text-[10px] uppercase font-bold bg-red-600/20 text-red-400 hover:bg-red-600/40 hover:text-white px-2 py-1 rounded border border-red-500/30 transition-colors focus:ring-2 focus:ring-red-500/50 focus:outline-none animate-pulse"
                    aria-label={`Execute emergency action: ${insight.title}`}
                  >
                    Deploy Emergency Broadcast
                  </button>
                ) : (
                  <button 
                    className="text-[10px] uppercase font-bold bg-white/5 hover:bg-white/10 px-2 py-1 rounded border border-white/10 transition-colors focus:ring-2 focus:ring-white/50 focus:outline-none"
                    aria-label={`Execute action: ${insight.title}`}
                  >
                    Execute
                  </button>
                )}
                <button 
                  className="text-[10px] uppercase font-bold text-slate-500 hover:text-slate-300 px-2 py-1 transition-colors focus:ring-2 focus:ring-slate-500/50 focus:outline-none"
                  aria-label={`Dismiss action: ${insight.title}`}
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Use React.memo so the insight panel doesn't re-render on every stadium data tick unless insights change
export default React.memo(InsightPanel);
