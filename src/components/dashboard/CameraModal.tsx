import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface Sector {
  id: string;
  name: string;
}

interface CameraModalProps {
  selectedSector: Sector | null;
  onClose: () => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ selectedSector, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Trap focus and handle escape key for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    // Focus the modal when opened
    if (modalRef.current) {
      modalRef.current.focus();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!selectedSector) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="camera-modal-title"
      onClick={onClose} // Close when clicking backdrop
    >
      <div 
        ref={modalRef}
        tabIndex={-1}
        className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col focus:outline-none"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
          <h3 id="camera-modal-title" className="font-bold text-white font-display text-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true"></span>
            Live Feeds: {selectedSector.name}
          </h3>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white text-xl leading-none p-2 focus:ring-2 focus:ring-white/50 rounded-sm outline-none"
            aria-label="Close camera feeds"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-1 bg-black p-1">
          {[1, 2, 3, 4].map((cam) => (
            <div key={cam} className="relative aspect-video bg-neutral-800 overflow-hidden" role="img" aria-label={`Camera ${cam} view: No signal`}>
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay animate-pulse" aria-hidden="true"></div>
              <div className="absolute top-3 left-3 flex items-center gap-2 text-white/80 text-xs font-mono font-bold bg-black/50 px-2 py-1 rounded">
                <span className="text-red-500" aria-hidden="true">•</span> CAM 0{cam}
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
  );
};

export default CameraModal;
