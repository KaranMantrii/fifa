import { useState, useEffect, useCallback } from 'react';
import { getStaffInsights, getStadiumMetrics } from '../services/aiSim';
import InsightPanel, { Insight } from './dashboard/InsightPanel';
import MetricsCards, { Metrics } from './dashboard/MetricsCards';
import StadiumMap, { StadiumData, SectorData } from './dashboard/StadiumMap';
import SectorDetails from './dashboard/SectorDetails';
import CameraModal from './dashboard/CameraModal';
import { MockWebSocket } from '../services/wsSim';

export default function StaffDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [selectedSector, setSelectedSector] = useState<SectorData | null>(null);
  const [deployments, setDeployments] = useState<string[]>([]);
  const [showCameras, setShowCameras] = useState<boolean>(false);
  const [region, setRegion] = useState<'USA' | 'MEX' | 'CAN'>('USA');

  const getStadiumDataForRegion = (reg: string): StadiumData => {
    if (reg === 'MEX') {
      return {
        north: { id: 'north', name: 'Azteca North', occupancy: 70, status: 'Busy', color: '#f59e0b', incidents: 1, waitTime: '6m' },
        south: { id: 'south', name: 'Azteca South', occupancy: 95, status: 'Alert', color: '#ef4444', incidents: 2, waitTime: '15m' },
        east:  { id: 'east', name: 'Akron East', occupancy: 55, status: 'Optimal', color: '#10b981', incidents: 0, waitTime: '2m' },
        west:  { id: 'west', name: 'Akron West', occupancy: 40, status: 'Optimal', color: '#10b981', incidents: 0, waitTime: '1m' },
        g1:    { id: 'g1', name: 'Gate 1', occupancy: 30, status: 'Optimal', color: '#10b981', incidents: 0, waitTime: '0m' },
        g2:    { id: 'g2', name: 'Gate 2', occupancy: 70, status: 'Busy', color: '#f59e0b', incidents: 0, waitTime: '5m' },
        g3:    { id: 'g3', name: 'Gate 3', occupancy: 88, status: 'Busy', color: '#f59e0b', incidents: 1, waitTime: '12m' },
        g4:    { id: 'g4', name: 'Gate 4', occupancy: 40, status: 'Optimal', color: '#10b981', incidents: 0, waitTime: '1m' },
      };
    }
    if (reg === 'CAN') {
      return {
        north: { id: 'north', name: 'BMO Field North', occupancy: 60, status: 'Optimal', color: '#10b981', incidents: 0, waitTime: '4m' },
        south: { id: 'south', name: 'BMO Field South', occupancy: 80, status: 'Busy', color: '#f59e0b', incidents: 1, waitTime: '7m' },
        east:  { id: 'east', name: 'BC Place East', occupancy: 45, status: 'Optimal', color: '#10b981', incidents: 0, waitTime: '2m' },
        west:  { id: 'west', name: 'BC Place West', occupancy: 35, status: 'Optimal', color: '#10b981', incidents: 0, waitTime: '1m' },
        g1:    { id: 'g1', name: 'Gate A', occupancy: 20, status: 'Optimal', color: '#10b981', incidents: 0, waitTime: '0m' },
        g2:    { id: 'g2', name: 'Gate B', occupancy: 50, status: 'Optimal', color: '#10b981', incidents: 0, waitTime: '3m' },
        g3:    { id: 'g3', name: 'Gate C', occupancy: 40, status: 'Optimal', color: '#10b981', incidents: 0, waitTime: '2m' },
        g4:    { id: 'g4', name: 'Gate D', occupancy: 30, status: 'Optimal', color: '#10b981', incidents: 0, waitTime: '1m' },
      };
    }
    return {
      north: { id: 'north', name: 'MetLife North (NY/NJ)', occupancy: 65, status: 'Optimal', color: '#10b981', incidents: 0, waitTime: '2m' },
      south: { id: 'south', name: 'MetLife South', occupancy: 85, status: 'Busy', color: '#f59e0b', incidents: 1, waitTime: '8m' },
      east:  { id: 'east', name: 'SoFi East (LA)', occupancy: 95, status: 'Alert', color: '#ef4444', incidents: 2, waitTime: '15m' },
      west:  { id: 'west', name: 'AT&T West (DAL)', occupancy: 55, status: 'Optimal', color: '#10b981', incidents: 0, waitTime: '1m' },
      g1:    { id: 'g1', name: 'Gate 1', occupancy: 30, status: 'Optimal', color: '#10b981', incidents: 0, waitTime: '0m' },
      g2:    { id: 'g2', name: 'Gate 2', occupancy: 70, status: 'Busy', color: '#f59e0b', incidents: 0, waitTime: '5m' },
      g3:    { id: 'g3', name: 'Gate 3', occupancy: 98, status: 'Alert', color: '#ef4444', incidents: 1, waitTime: '22m' },
      g4:    { id: 'g4', name: 'Gate 4', occupancy: 40, status: 'Optimal', color: '#10b981', incidents: 0, waitTime: '1m' },
    };
  };

  const [stadiumData, setStadiumData] = useState<StadiumData>(getStadiumDataForRegion('USA'));

  const handleSectorClick = useCallback((sectorKey: string) => {
    setStadiumData((prevData) => {
      setSelectedSector(prevData[sectorKey]);
      return prevData;
    });
  }, []);

  useEffect(() => {
    // Initial fetch (this may change to API call in real app)
    const initialInsights = getStaffInsights(region) as unknown as Insight[];
    setInsights(initialInsights);
    
    const initialMetrics = getStadiumMetrics(region) as unknown as Metrics;
    setMetrics(initialMetrics);

    // Initialize Mock WebSocket for push-based architecture
    const ws = new MockWebSocket('wss://api.fifa26.com/live-stadium');

    const handleMessage = (e: Event) => {
      const messageEvent = e as MessageEvent;
      const data = JSON.parse(messageEvent.data);
      
      if (data.type === 'match_update') {
        setStadiumData(prev => {
          const newData: StadiumData = { ...prev };
          let totalOccupancy = 0;
          let totalWait = 0;

          Object.keys(newData).forEach(key => {
            const sector = newData[key];
            const isDeployed = deployments.includes(key);

            let newOcc = sector.occupancy;
            let currentWait = parseInt(sector.waitTime);
            let newWait = currentWait;

            if (isDeployed) {
              newOcc = Math.max(10, newOcc - Math.floor(Math.random() * 5 + 2));
              newWait = Math.max(0, currentWait - Math.floor(Math.random() * 3 + 1));
              
              if (newOcc < 60 && newWait < 5) {
                setDeployments(d => d.filter(id => id !== key));
              }
            } else {
              const change = Math.floor(Math.random() * 7) - 3;
              newOcc = Math.max(10, Math.min(100, sector.occupancy + change));
              let waitChange = Math.floor(Math.random() * 3) - 1;
              newWait = Math.max(0, currentWait + (newOcc > 80 ? Math.abs(waitChange) : waitChange));
            }
            
            let newStatus = 'Optimal';
            let newColor = '#10b981';
            if (newOcc >= 90) { newStatus = 'Alert'; newColor = '#ef4444'; }
            else if (newOcc >= 70) { newStatus = 'Busy'; newColor = '#f59e0b'; }

            newData[key] = { ...sector, occupancy: newOcc, status: newStatus, color: newColor, waitTime: `${newWait}m` };
            
            totalOccupancy += newOcc;
            totalWait += newWait;
          });

          setSelectedSector(current => current ? newData[current.id] : null);

          setMetrics(prevMetrics => {
            if (!prevMetrics) return null;
            return {
              ...prevMetrics,
              occupancy: Math.floor(totalOccupancy / 8),
              avgWaitTime: Math.floor(totalWait / 8)
            };
          });

          return newData;
        });
      }
    };

    ws.addEventListener('message', handleMessage);

    return () => {
      ws.removeEventListener('message', handleMessage);
      ws.close();
    };
  }, [deployments]);

  const handleRegionChange = (newRegion: 'USA' | 'MEX' | 'CAN') => {
    setRegion(newRegion);
    setStadiumData(getStadiumDataForRegion(newRegion));
    setSelectedSector(null);
    
    // Update metrics and insights based on region
    setInsights(getStaffInsights(newRegion) as unknown as Insight[]);
    setMetrics(getStadiumMetrics(newRegion) as unknown as Metrics);
  };

  if (!metrics) return null;

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 animate-fade-in" role="main" aria-label="Staff Dashboard">
      {/* Left Sidebar - AI Insights */}
      <InsightPanel insights={insights} />

      {/* Main Content - Map & Metrics */}
      <div className="flex-1 flex flex-col gap-6">
        <MetricsCards metrics={metrics} />

        {/* Stadium Map Visualization */}
        <div className="flex-1 glass-panel rounded-[1.5rem] p-6 md:p-8 flex flex-col relative shadow-2xl">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            {/* FIFA 26 specific context */}
            <div>
              <h3 className="font-bold text-xl font-display tracking-tight text-white">FIFA World Cup 26™ Global Command Center</h3>
              <p className="text-slate-400 text-sm mt-1">Cross-border Venue Analytics & Security Overview</p>
            </div>
            
            <div className="flex gap-2 bg-black/40 p-1 rounded-lg border border-white/10">
              <button 
                onClick={() => handleRegionChange('USA')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${region === 'USA' ? 'bg-fifa-blue text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                USA 🇺🇸
              </button>
              <button 
                onClick={() => handleRegionChange('MEX')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${region === 'MEX' ? 'bg-fifa-green text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                MEX 🇲🇽
              </button>
              <button 
                onClick={() => handleRegionChange('CAN')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${region === 'CAN' ? 'bg-fifa-amber text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                CAN 🇨🇦
              </button>
            </div>
          </div>
          
          <StadiumMap 
            stadiumData={stadiumData} 
            selectedSector={selectedSector} 
            handleSectorClick={handleSectorClick} 
          />

          {/* Selected Sector Details Overlay */}
          <SectorDetails 
            selectedSector={selectedSector}
            setSelectedSector={setSelectedSector}
            deployments={deployments}
            setDeployments={setDeployments}
            setShowCameras={setShowCameras}
          />
        </div>
      </div>

      {/* Mock Security Camera Modal */}
      {showCameras && selectedSector && (
        <CameraModal 
          selectedSector={selectedSector} 
          onClose={() => setShowCameras(false)} 
        />
      )}
    </div>
  );
}
