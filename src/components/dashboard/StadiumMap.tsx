import React from 'react';

export interface SectorData {
  id: string;
  name: string;
  occupancy: number;
  status: string;
  color: string;
  incidents: number;
  waitTime: string;
}

export interface StadiumData {
  [key: string]: SectorData;
}

interface StadiumMapProps {
  stadiumData: StadiumData;
  selectedSector: SectorData | null;
  handleSectorClick: (sectorKey: string) => void;
}

const StadiumMap: React.FC<StadiumMapProps> = ({ stadiumData, selectedSector, handleSectorClick }) => {
  // Helper to make sectors accessible
  const getSectorProps = (sectorKey: string) => {
    const sector = stadiumData[sectorKey];
    const isSelected = selectedSector?.id === sectorKey;
    return {
      onClick: () => handleSectorClick(sectorKey),
      onKeyDown: (e: React.KeyboardEvent<SVGGElement>) => { 
        if (e.key === 'Enter' || e.key === ' ') { 
          e.preventDefault(); 
          handleSectorClick(sectorKey); 
        } 
      },
      role: "button",
      tabIndex: 0,
      "aria-label": `${sector.name}, Occupancy ${sector.occupancy}%, Status ${sector.status}`,
      "aria-pressed": isSelected,
      className: `cursor-pointer transition-all duration-300 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-lg outline-none origin-center ${isSelected ? 'ring-2 ring-white/50 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]' : ''}`
    };
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-[300px] border border-white/5 rounded-2xl bg-neutral-900/60 shadow-inner p-4 relative overflow-hidden group perspective-1000">
      {/* Decorative pulse rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div className="w-[80%] aspect-video border border-white/5 rounded-full animate-pulse-slow"></div>
        <div className="absolute w-[60%] aspect-video border border-white/5 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <svg viewBox="0 0 400 300" className="w-full max-w-[550px] drop-shadow-lg relative z-10 transition-transform duration-500 group-hover:scale-105" role="graphics-document" aria-label="Interactive Stadium Map">
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
        <rect x="20" y="20" width="360" height="260" rx="60" fill="none" stroke="#2a2a2a" strokeWidth="2" aria-hidden="true" />
        <rect x="40" y="40" width="320" height="220" rx="40" fill="none" stroke="#1a1a1a" strokeWidth="4" aria-hidden="true" />
        
        {/* Pitch */}
        <g aria-hidden="true">
          <rect x="90" y="70" width="220" height="160" rx="10" fill="url(#pitchGrad)" stroke="#10b981" strokeWidth="1" strokeOpacity="0.2" />
          <line x1="200" y1="70" x2="200" y2="230" stroke="#10b981" strokeWidth="1" strokeOpacity="0.2" />
          <circle cx="200" cy="150" r="20" fill="none" stroke="#10b981" strokeWidth="1" strokeOpacity="0.2" />
          <circle cx="200" cy="150" r="2" fill="#10b981" strokeOpacity="0.2" />
        </g>
        
        {/* North Stand */}
        <g {...getSectorProps('north')}>
          <path d="M 100 45 L 300 45 Q 310 45 315 55 L 295 65 Q 290 60 280 60 L 120 60 Q 110 60 105 65 L 85 55 Q 90 45 100 45 Z" 
            fill={stadiumData.north.color} fillOpacity={selectedSector?.id === 'north' ? "0.4" : "0.15"} 
            stroke={stadiumData.north.color} strokeOpacity="0.5" strokeWidth={selectedSector?.id === 'north' ? "2" : "1"} />
          <text x="200" y="55" fill={stadiumData.north.color} fontSize="8" textAnchor="middle" fontWeight="bold" aria-hidden="true">NORTH STAND - {stadiumData.north.occupancy}%</text>
        </g>

        {/* South Stand */}
        <g {...getSectorProps('south')}>
          <path d="M 100 255 L 300 255 Q 310 255 315 245 L 295 235 Q 290 240 280 240 L 120 240 Q 110 240 105 235 L 85 245 Q 90 255 100 255 Z" 
            fill={stadiumData.south.color} fillOpacity={selectedSector?.id === 'south' ? "0.4" : "0.15"} 
            stroke={stadiumData.south.color} strokeOpacity="0.5" strokeWidth={selectedSector?.id === 'south' ? "2" : "1"} />
          <text x="200" y="249" fill={stadiumData.south.color} fontSize="8" textAnchor="middle" fontWeight="bold" aria-hidden="true">SOUTH STAND - {stadiumData.south.occupancy}%</text>
        </g>

        {/* East Stand */}
        <g {...getSectorProps('east')}>
          <path d="M 320 75 L 320 225 Q 320 235 310 240 L 300 220 Q 305 215 305 205 L 305 95 Q 305 85 300 80 L 310 60 Q 320 65 320 75 Z" 
            fill={stadiumData.east.color} fillOpacity={selectedSector?.id === 'east' ? "0.4" : "0.15"} 
            stroke={stadiumData.east.color} strokeOpacity="0.5" strokeWidth={selectedSector?.id === 'east' ? "2" : "1"} />
          <text x="312" y="150" fill={stadiumData.east.color} fontSize="8" textAnchor="middle" fontWeight="bold" transform="rotate(90, 312, 150)" aria-hidden="true">EAST STAND - {stadiumData.east.occupancy}%</text>
        </g>

        {/* West Stand */}
        <g {...getSectorProps('west')}>
          <path d="M 80 75 L 80 225 Q 80 235 90 240 L 100 220 Q 95 215 95 205 L 95 95 Q 95 85 100 80 L 90 60 Q 80 65 80 75 Z" 
            fill={stadiumData.west.color} fillOpacity={selectedSector?.id === 'west' ? "0.4" : "0.15"} 
            stroke={stadiumData.west.color} strokeOpacity="0.5" strokeWidth={selectedSector?.id === 'west' ? "2" : "1"} />
          <text x="88" y="150" fill={stadiumData.west.color} fontSize="8" textAnchor="middle" fontWeight="bold" transform="rotate(-90, 88, 150)" aria-hidden="true">WEST STAND - {stadiumData.west.occupancy}%</text>
        </g>

        {/* Gates / Entry Points */}
        <g {...getSectorProps('g1')} transform="translate(70, 30)">
          <circle cx="0" cy="0" r="8" fill="#1a1a1a" stroke={stadiumData.g1.color} strokeWidth={selectedSector?.id === 'g1' ? "3" : "2"} />
          <text x="0" y="3" fill="#fff" fontSize="8" textAnchor="middle" fontWeight="bold" aria-hidden="true">G1</text>
        </g>
        <g {...getSectorProps('g2')} transform="translate(330, 30)">
          <circle cx="0" cy="0" r="8" fill="#1a1a1a" stroke={stadiumData.g2.color} strokeWidth={selectedSector?.id === 'g2' ? "3" : "2"} />
          <text x="0" y="3" fill="#fff" fontSize="8" textAnchor="middle" fontWeight="bold" aria-hidden="true">G2</text>
        </g>
        <g {...getSectorProps('g3')} transform="translate(340, 150)">
          <circle cx="0" cy="0" r="9" fill={stadiumData.g3.color} fillOpacity="0.2" stroke={stadiumData.g3.color} strokeWidth={selectedSector?.id === 'g3' ? "3" : "2"} filter="url(#glow)" />
          <text x="0" y="3" fill="#fff" fontSize="8" textAnchor="middle" fontWeight="bold" aria-hidden="true">G3</text>
        </g>
        <g {...getSectorProps('g4')} transform="translate(330, 270)">
          <circle cx="0" cy="0" r="8" fill="#1a1a1a" stroke={stadiumData.g4.color} strokeWidth={selectedSector?.id === 'g4' ? "3" : "2"} />
          <text x="0" y="3" fill="#fff" fontSize="8" textAnchor="middle" fontWeight="bold" aria-hidden="true">G4</text>
        </g>
      </svg>
    </div>
  );
};

export default React.memo(StadiumMap);
