import { X, Users, AlertCircle, Clock, ShieldAlert } from 'lucide-react';
import React from 'react';
import { SectorData } from './StadiumMap';

interface SectorDetailsProps {
  selectedSector: SectorData | null;
  setSelectedSector: (sector: SectorData | null) => void;
  deployments: string[];
  setDeployments: React.Dispatch<React.SetStateAction<string[]>>;
  setShowCameras: (show: boolean) => void;
}

const SectorDetails: React.FC<SectorDetailsProps> = ({ 
  selectedSector, 
  setSelectedSector, 
  deployments, 
  setDeployments, 
  setShowCameras 
}) => {
  if (!selectedSector) return null;
  
  const isDeployed = deployments.includes(selectedSector.id);

  return (
    <div 
      className="absolute top-6 right-6 w-64 bg-black/70 backdrop-blur-2xl border border-white/20 rounded-2xl p-5 shadow-[0_15px_40px_rgba(0,0,0,0.8)] animate-fade-in z-20"
      role="dialog"
      aria-labelledby="sector-details-title"
    >
      <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
        <h4 id="sector-details-title" className="font-bold text-white font-display tracking-tight text-lg">{selectedSector.name}</h4>
        <button 
          onClick={() => setSelectedSector(null)}
          aria-label="Close sector details"
          className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
      
      <div className="flex flex-col gap-3.5 mb-5">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400 flex items-center gap-2"><AlertCircle size={14} className="text-fifa-amber" aria-hidden="true" /> Status</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${
            selectedSector.status === 'Alert' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
            selectedSector.status === 'Busy' ? 'bg-fifa-amber/20 text-fifa-amber border border-fifa-amber/30' : 
            'bg-fifa-green/20 text-fifa-green border border-fifa-green/30'
          }`}>{selectedSector.status}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400 flex items-center gap-2"><Users size={14} className="text-fifa-blue" aria-hidden="true" /> Occupancy</span>
          <span className="text-sm font-bold text-white font-mono">{selectedSector.occupancy}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400 flex items-center gap-2"><Clock size={14} className="text-fifa-blue" aria-hidden="true" /> Wait Time</span>
          <span className="text-sm font-bold text-white font-mono">{selectedSector.waitTime}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400 flex items-center gap-2"><ShieldAlert size={14} className="text-red-400" aria-hidden="true" /> Incidents</span>
          <span className="text-sm font-bold text-white font-mono">{selectedSector.incidents}</span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={() => {
            if (isDeployed) {
              setDeployments(d => d.filter(id => id !== selectedSector.id));
            } else {
              setDeployments(d => [...d, selectedSector.id]);
            }
          }}
          aria-pressed={isDeployed}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 ${
            isDeployed 
              ? 'bg-fifa-amber text-black hover:bg-yellow-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]' 
              : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
          }`}
        >
          {isDeployed ? 'Team Active' : 'Deploy Staff'}
        </button>
        <button 
          onClick={() => setShowCameras(true)}
          aria-label={`View camera feeds for ${selectedSector.name}`}
          className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded py-2 text-xs font-bold uppercase tracking-wider text-slate-300 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          Cameras
        </button>
      </div>
    </div>
  );
};

export default React.memo(SectorDetails);
