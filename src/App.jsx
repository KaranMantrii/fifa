import { useState } from 'react'
import FanAssistant from './components/FanAssistant'
import StaffDashboard from './components/StaffDashboard'
import StaffLogin from './components/StaffLogin'
import { Activity, MessageSquare, LogOut } from 'lucide-react'

function App() {
  const [activeMode, setActiveMode] = useState('fan') // 'fan' | 'staff'
  const [isStaffAuthenticated, setIsStaffAuthenticated] = useState(false)

  const handleLogout = () => {
    setIsStaffAuthenticated(false)
    setActiveMode('fan')
  }

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 min-h-screen flex flex-col">
      
      {/* Outer Background Animations (Fan Mode Only) */}
      <div className={`fixed inset-0 z-0 overflow-hidden pointer-events-none transition-opacity duration-700 ${activeMode === 'fan' ? 'opacity-100' : 'opacity-0'}`}>
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="absolute animate-float opacity-0"
              style={{ 
                left: `${5 + Math.random() * 90}%`, 
                '--delay': `${Math.random() * 10}s`,
                '--duration': `${15 + Math.random() * 15}s`
              }}
            >
              <img 
                src="/football.png?v=3" 
                alt="" 
                className="w-24 h-24 object-contain opacity-10 blur-[2px] animate-spin-slow mix-blend-screen"
                style={{ animationDuration: `${5 + Math.random() * 10}s` }}
              />
            </div>
          ))}
        </div>

      <header className="relative z-20 flex flex-col md:flex-row justify-between items-center p-3 px-6 glass-panel rounded-[2rem] md:rounded-full mb-10 mt-2 gap-4 sticky top-4 shadow-2xl transition-all">
        <div className="flex items-center gap-3 text-xl md:text-2xl font-bold text-white font-display tracking-tight">
          <div className="bg-gradient-to-br from-fifa-green to-emerald-600 p-2 rounded-xl text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"></path>
              <path d="M12 12 2 12"></path>
              <path d="M12 12 12 22"></path>
              <path d="m12 12 8.5-4.5"></path>
            </svg>
          </div>
          FIFA '26 Smart Hub
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-black/40 p-1 rounded-full border border-white/10 shadow-inner backdrop-blur-md">
            <button 
              onClick={() => setActiveMode('fan')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-out ${
                activeMode === 'fan' 
                  ? 'bg-gradient-to-r from-fifa-green to-emerald-500 text-black shadow-[0_4px_15px_rgba(16,185,129,0.4)] scale-100' 
                  : 'text-slate-400 hover:text-white scale-95 hover:scale-100'
              }`}
            >
              <MessageSquare size={16} strokeWidth={2.5} />
              Fan Companion
            </button>
            <button 
              onClick={() => setActiveMode('staff')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-out ${
                activeMode === 'staff' 
                  ? 'bg-gradient-to-r from-fifa-blue to-indigo-500 text-white shadow-[0_4px_15px_rgba(59,130,246,0.4)] scale-100' 
                  : 'text-slate-400 hover:text-white scale-95 hover:scale-100'
              }`}
            >
              <Activity size={16} strokeWidth={2.5} />
              Staff Dashboard
            </button>
          </div>
          
          {isStaffAuthenticated && (
            <button 
              onClick={handleLogout}
              className="p-2.5 rounded-full text-slate-400 hover:text-red-400 bg-black/40 hover:bg-white/10 border border-white/10 transition-colors shadow-inner"
              title="Logout"
            >
              <LogOut size={16} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </header>

      <main className="relative z-10 flex-1 w-full animate-fade-in">
        <div className={activeMode === 'fan' ? 'block animate-fade-in' : 'hidden'}>
          <FanAssistant />
        </div>
        
        <div className={activeMode === 'staff' ? 'block animate-fade-in' : 'hidden'}>
          {isStaffAuthenticated ? (
            <StaffDashboard />
          ) : (
            <StaffLogin onLogin={() => setIsStaffAuthenticated(true)} />
          )}
        </div>
      </main>
    </div>
  )
}

export default App
