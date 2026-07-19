import { useState, useEffect } from 'react';
import { getStaffInsights, getStadiumMetrics } from '../services/aiSim';
import { Users, Clock, AlertTriangle, TrendingUp, Zap } from 'lucide-react';

export default function StaffDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [insights, setInsights] = useState([]);
  const [selectedSector, setSelectedSector] = useState(null);
  const [deployments, setDeployments] = useState([]);
  const [showCameras, setShowCameras] = useState(false);

  const [stadiumData, setStadiumData] = useState({
    north: { id: 'north', name: 'North Stand', occupancy: 65, status: 'Optimal', color: '#10b981', incidents: 0, waitTime: '2m' },
    south: { id: 'south', name: 'South Stand', occupancy: 85, status: 'Busy', color: '#f59e0b', incidents: 1, waitTime: '8m' },
    east:  { id: 'east', name: 'East Stand', occupancy: 95, status: 'Alert', color: '#ef4444', incidents: 2, waitTime: '15m' },
    west:  { id: 'west', name: 'West Stand', occupancy: 55, status: 'Optimal', color: '#10b981', incidents: 0, waitTime: '1m' },
    g1:    { id: 'g1', name: 'Gate 1', occupancy: 30, status: 'Optimal', color: '#10b981', incidents: 0, waitTime: '0m' },
    g2:    { id: 'g2', name: 'Gate 2', occupancy: 70, status: 'Busy', color: '#f59e0b', incidents: 0, waitTime: '5m' },
    g3:    { id: 'g3', name: 'Gate 3', occupancy: 98, status: 'Alert', color: '#ef4444', incidents: 1, waitTime: '22m' },
    g4:    { id: 'g4', name: 'Gate 4', occupancy: 40, status: 'Optimal', color: '#10b981', incidents: 0, waitTime: '1m' },
  });

  const handleSectorClick = (sectorKey) => {
    setSelectedSector(stadiumData[sectorKey]);
  };

  useEffect(() => {
    setInsights(getStaffInsights());
    setMetrics(getStadiumMetrics());

    // Live data simulation interval
    const interval = setInterval(() => {
      setStadiumData(prev => {
        const newData = { ...prev };
        let totalOccupancy = 0;
        let totalWait = 0;

        Object.keys(newData).forEach(key => {
          const sector = newData[key];
          // Check if there is an active deployment for this sector
          const isDeployed = deployments.includes(key);

          let newOcc = sector.occupancy;
          let currentWait = parseInt(sector.waitTime);
          let newWait = currentWait;

          if (isDeployed) {
            // Actively reduce occupancy and wait time
            newOcc = Math.max(10, newOcc - Math.floor(Math.random() * 5 + 2));
            newWait = Math.max(0, currentWait - Math.floor(Math.random() * 3 + 1));
            
            // Auto-resolve deployment if levels return to normal
            if (newOcc < 60 && newWait < 5) {
              setDeployments(d => d.filter(id => id !== key));
            }
          } else {
            // Normal random fluctuation
            const change = Math.floor(Math.random() * 7) - 3;
            newOcc = Math.max(10, Math.min(100, sector.occupancy + change));
            let waitChange = Math.floor(Math.random() * 3) - 1;
            newWait = Math.max(0, currentWait + (newOcc > 80 ? Math.abs(waitChange) : waitChange));
          }
          
          // Update status based on occupancy
          let newStatus = 'Optimal';
          let newColor = '#10b981';
          if (newOcc >= 90) { newStatus = 'Alert'; newColor = '#ef4444'; }
          else if (newOcc >= 70) { newStatus = 'Busy'; newColor = '#f59e0b'; }

          newData[key] = { ...sector, occupancy: newOcc, status: newStatus, color: newColor, waitTime: `${newWait}m` };
          
          totalOccupancy += newOcc;
          totalWait += newWait;
        });

        // Update selected sector if one is currently open so the details panel updates live
        setSelectedSector(current => current ? newData[current.id] : null);

        // Also subtly update top-level metrics
        setMetrics(prevMetrics => ({
          ...prevMetrics,
          occupancy: Math.floor(totalOccupancy / 8),
          avgWaitTime: Math.floor(totalWait / 8)
        }));

        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!metrics) return null;

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 animate-fade-in">
      
      {/* Left Sidebar - AI Insights */}
      <div className="w-full md:w-[380px] flex flex-col gap-4">
        <div className="glass-panel p-6 rounded-[1.5rem] flex items-center justify-between border border-fifa-amber/20 relative overflow-hidden group shadow-[0_8px_32px_rgba(245,158,11,0.1)]">
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-gradient-to-br from-fifa-amber/20 to-orange-500/10 rounded-full blur-3xl animate-pulse group-hover:bg-fifa-amber/30 transition-colors duration-700"></div>
          <div className="relative z-10">
            <h3 className="text-fifa-amber font-bold font-display text-lg flex items-center gap-2 tracking-tight">
              <Zap size={18} className="fill-fifa-amber text-fifa-amber drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              GenAI Operator Mode
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">Actively analyzing 142 data streams</p>
          </div>
          <div className="relative z-10 h-3.5 w-3.5 bg-fifa-amber rounded-full animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.8)] border border-neutral-900"></div>
        </div>

        <div className="flex-1 glass-panel rounded-2xl p-5 flex flex-col gap-4">
          <h4 className="font-semibold text-white">Recommended Actions</h4>
          
          <div className="flex flex-col gap-3">
            {insights.map(insight => (
              <div 
                key={insight.id} 
                className={`p-4 rounded-xl border bg-black/20 relative overflow-hidden group hover:bg-black/40 transition-colors
                  ${insight.type === 'warning' ? 'border-red-500/30' : 
                    insight.type === 'info' ? 'border-fifa-amber/30' : 
                    'border-fifa-green/30'}`}
              >
                <div className={`absolute top-0 left-0 w-1 h-full 
                  ${insight.type === 'warning' ? 'bg-red-500' : 
                    insight.type === 'info' ? 'bg-fifa-amber' : 
                    'bg-fifa-green'}`}>
                </div>
                
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-semibold text-sm text-slate-100">{insight.title}</h5>
                  <span className="text-[10px] text-slate-500">{insight.time}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {insight.description}
                </p>
                <div className="mt-3 flex gap-2">
                  <button className="text-[10px] uppercase font-bold bg-white/5 hover:bg-white/10 px-2 py-1 rounded border border-white/10 transition-colors">
                    Execute
                  </button>
                  <button className="text-[10px] uppercase font-bold text-slate-500 hover:text-slate-300 px-2 py-1 transition-colors">
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - Map & Metrics */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Top Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Occupancy', value: `${metrics.occupancy}%`, icon: <Users size={20} className="text-fifa-blue" /> },
            { label: 'Avg Wait', value: `${metrics.avgWaitTime}m`, icon: <Clock size={20} className="text-fifa-amber" /> },
            { label: 'Incidents', value: metrics.incidents, icon: <AlertTriangle size={20} className="text-red-400" /> },
            { label: 'Sentiment', value: metrics.sentiment, icon: <TrendingUp size={20} className="text-fifa-green" /> }
          ].map((stat, i) => (
            <div key={i} className="glass-panel p-5 rounded-[1.5rem] flex flex-col gap-2 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors duration-500"></div>
              <div className="flex justify-between items-center relative z-10">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                <div className="p-2 bg-black/40 rounded-xl shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
              </div>
              <div className="text-3xl font-bold font-display text-white relative z-10 mt-1 drop-shadow-md">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Stadium Map Visualization */}
        <div className="flex-1 glass-panel rounded-[1.5rem] p-6 md:p-8 flex flex-col relative shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl font-display tracking-tight text-white">Live Interactive Stadium Map</h3>
            <div className="flex gap-4 text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-fifa-green shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span> Optimal</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-fifa-amber shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span> Busy</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span> Congested</span>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center min-h-[300px] border border-white/5 rounded-2xl bg-neutral-900/60 shadow-inner p-4 relative overflow-hidden group">
            
            {/* SVG Stadium Map */}
            <svg viewBox="0 0 400 300" className="w-full max-w-[550px] drop-shadow-lg relative z-10 transition-transform duration-500 group-hover:scale-105">
              <defs>
                <linearGradient id="pitchGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.05" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Outer Stadium Ring */}
              <rect x="20" y="20" width="360" height="260" rx="60" fill="none" stroke="#2a2a2a" strokeWidth="2" />
              <rect x="40" y="40" width="320" height="220" rx="40" fill="none" stroke="#1a1a1a" strokeWidth="4" />
              
              {/* Pitch */}
              <rect x="90" y="70" width="220" height="160" rx="10" fill="url(#pitchGrad)" stroke="#10b981" strokeWidth="1" strokeOpacity="0.2" />
              <line x1="200" y1="70" x2="200" y2="230" stroke="#10b981" strokeWidth="1" strokeOpacity="0.2" />
              <circle cx="200" cy="150" r="20" fill="none" stroke="#10b981" strokeWidth="1" strokeOpacity="0.2" />
              <circle cx="200" cy="150" r="2" fill="#10b981" strokeOpacity="0.2" />
              
              {/* North Stand */}
              <g onClick={() => handleSectorClick('north')} className="cursor-pointer transition-all duration-300 hover:opacity-80">
                <path d="M 100 45 L 300 45 Q 310 45 315 55 L 295 65 Q 290 60 280 60 L 120 60 Q 110 60 105 65 L 85 55 Q 90 45 100 45 Z" 
                  fill={stadiumData.north.color} fillOpacity={selectedSector?.id === 'north' ? "0.4" : "0.15"} 
                  stroke={stadiumData.north.color} strokeOpacity="0.5" strokeWidth={selectedSector?.id === 'north' ? "2" : "1"} />
                <text x="200" y="55" fill={stadiumData.north.color} fontSize="8" textAnchor="middle" fontWeight="bold">NORTH STAND - {stadiumData.north.occupancy}%</text>
              </g>

              {/* South Stand */}
              <g onClick={() => handleSectorClick('south')} className="cursor-pointer transition-all duration-300 hover:opacity-80">
                <path d="M 100 255 L 300 255 Q 310 255 315 245 L 295 235 Q 290 240 280 240 L 120 240 Q 110 240 105 235 L 85 245 Q 90 255 100 255 Z" 
                  fill={stadiumData.south.color} fillOpacity={selectedSector?.id === 'south' ? "0.4" : "0.15"} 
                  stroke={stadiumData.south.color} strokeOpacity="0.5" strokeWidth={selectedSector?.id === 'south' ? "2" : "1"} />
                <text x="200" y="249" fill={stadiumData.south.color} fontSize="8" textAnchor="middle" fontWeight="bold">SOUTH STAND - {stadiumData.south.occupancy}%</text>
              </g>

              {/* East Stand */}
              <g onClick={() => handleSectorClick('east')} className="cursor-pointer transition-all duration-300 hover:opacity-80">
                <path d="M 320 75 L 320 225 Q 320 235 310 240 L 300 220 Q 305 215 305 205 L 305 95 Q 305 85 300 80 L 310 60 Q 320 65 320 75 Z" 
                  fill={stadiumData.east.color} fillOpacity={selectedSector?.id === 'east' ? "0.4" : "0.15"} 
                  stroke={stadiumData.east.color} strokeOpacity="0.5" strokeWidth={selectedSector?.id === 'east' ? "2" : "1"} />
                <text x="312" y="150" fill={stadiumData.east.color} fontSize="8" textAnchor="middle" fontWeight="bold" transform="rotate(90, 312, 150)">EAST STAND - {stadiumData.east.occupancy}%</text>
              </g>

              {/* West Stand */}
              <g onClick={() => handleSectorClick('west')} className="cursor-pointer transition-all duration-300 hover:opacity-80">
                <path d="M 80 75 L 80 225 Q 80 235 90 240 L 100 220 Q 95 215 95 205 L 95 95 Q 95 85 100 80 L 90 60 Q 80 65 80 75 Z" 
                  fill={stadiumData.west.color} fillOpacity={selectedSector?.id === 'west' ? "0.4" : "0.1"} 
                  stroke={stadiumData.west.color} strokeOpacity="0.5" strokeWidth={selectedSector?.id === 'west' ? "2" : "1"} />
                <text x="88" y="150" fill={stadiumData.west.color} fontSize="8" textAnchor="middle" fontWeight="bold" transform="rotate(-90, 88, 150)">WEST STAND - {stadiumData.west.occupancy}%</text>
              </g>

              {/* Gates / Entry Points */}
              <g onClick={() => handleSectorClick('g1')} transform="translate(70, 30)" className="cursor-pointer transition-all duration-300 hover:opacity-80">
                <circle cx="0" cy="0" r="8" fill="#1a1a1a" stroke={stadiumData.g1.color} strokeWidth={selectedSector?.id === 'g1' ? "3" : "2"} />
                <text x="0" y="3" fill="#fff" fontSize="8" textAnchor="middle" fontWeight="bold">G1</text>
              </g>
              <g onClick={() => handleSectorClick('g2')} transform="translate(330, 30)" className="cursor-pointer transition-all duration-300 hover:opacity-80">
                <circle cx="0" cy="0" r="8" fill="#1a1a1a" stroke={stadiumData.g2.color} strokeWidth={selectedSector?.id === 'g2' ? "3" : "2"} />
                <text x="0" y="3" fill="#fff" fontSize="8" textAnchor="middle" fontWeight="bold">G2</text>
              </g>
              <g onClick={() => handleSectorClick('g3')} transform="translate(340, 150)" className="cursor-pointer transition-all duration-300 hover:opacity-80">
                <circle cx="0" cy="0" r="9" fill={stadiumData.g3.color} fillOpacity="0.2" stroke={stadiumData.g3.color} strokeWidth={selectedSector?.id === 'g3' ? "3" : "2"} filter="url(#glow)" />
                <text x="0" y="3" fill="#fff" fontSize="8" textAnchor="middle" fontWeight="bold">G3</text>
              </g>
              <g onClick={() => handleSectorClick('g4')} transform="translate(330, 270)" className="cursor-pointer transition-all duration-300 hover:opacity-80">
                <circle cx="0" cy="0" r="8" fill="#1a1a1a" stroke={stadiumData.g4.color} strokeWidth={selectedSector?.id === 'g4' ? "3" : "2"} />
                <text x="0" y="3" fill="#fff" fontSize="8" textAnchor="middle" fontWeight="bold">G4</text>
              </g>
            </svg>

            {/* Selected Sector Details Overlay */}
            {selectedSector && (
              <div className="absolute top-6 right-6 w-64 bg-black/70 backdrop-blur-2xl border border-white/20 rounded-2xl p-5 shadow-[0_15px_40px_rgba(0,0,0,0.8)] animate-fade-in z-20">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
                  <h4 className="font-bold text-white text-sm" style={{ color: selectedSector.color }}>{selectedSector.name}</h4>
                  <button onClick={() => setSelectedSector(null)} className="text-slate-400 hover:text-white text-xs">&times;</button>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status</span>
                    <span className="font-semibold" style={{ color: selectedSector.color }}>{selectedSector.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Occupancy</span>
                    <span className="font-mono text-white">{selectedSector.occupancy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Wait Time</span>
                    <span className="font-mono text-white">{selectedSector.waitTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Incidents</span>
                    <span className="font-mono text-white">{selectedSector.incidents}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => {
                      if (!deployments.includes(selectedSector.id)) {
                        setDeployments(d => [...d, selectedSector.id]);
                      }
                    }}
                    disabled={deployments.includes(selectedSector.id)}
                    className={`flex-1 rounded py-2 text-xs font-bold uppercase tracking-wider transition-all shadow-lg ${
                      deployments.includes(selectedSector.id)
                        ? 'bg-fifa-amber/20 text-fifa-amber border border-fifa-amber/50 cursor-not-allowed animate-pulse'
                        : 'bg-gradient-to-r from-fifa-blue to-indigo-600 text-white hover:scale-[1.02] active:scale-95'
                    }`}
                  >
                    {deployments.includes(selectedSector.id) ? 'Team Active' : 'Deploy Team'}
                  </button>
                  <button 
                    onClick={() => setShowCameras(true)}
                    className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded py-2 text-xs font-bold uppercase tracking-wider text-slate-300 transition-colors hover:text-white"
                  >
                    Cameras
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Mock Security Camera Modal */}
      {showCameras && selectedSector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
              <h3 className="font-bold text-white font-display text-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                Live Feeds: {selectedSector.name}
              </h3>
              <button onClick={() => setShowCameras(false)} className="text-slate-400 hover:text-white text-xl leading-none">&times;</button>
            </div>
            
            <div className="grid grid-cols-2 gap-1 bg-black p-1">
              {[1, 2, 3, 4].map((cam) => (
                <div key={cam} className="relative aspect-video bg-neutral-800 overflow-hidden">
                  {/* Static placeholder for camera feed */}
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay animate-pulse"></div>
                  <div className="absolute top-3 left-3 flex items-center gap-2 text-white/80 text-xs font-mono font-bold bg-black/50 px-2 py-1 rounded">
                    <span className="text-red-500">•</span> CAM 0{cam}
                  </div>
                  <div className="absolute bottom-3 right-3 text-white/50 text-[10px] font-mono">
                    {new Date().toISOString().split('T')[0]} {new Date().toLocaleTimeString()}
                  </div>
                  <div className="flex items-center justify-center w-full h-full text-white/20 font-display text-2xl font-bold tracking-widest">
                    NO SIGNAL
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
