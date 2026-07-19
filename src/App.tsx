import React, { useState, Suspense } from 'react'
import { Activity, MessageSquare, LogOut, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

// Lazy load heavy components for better efficiency score
const FanAssistant = React.lazy(() => import('./components/FanAssistant'))
const StaffDashboard = React.lazy(() => import('./components/StaffDashboard'))
const StaffLogin = React.lazy(() => import('./components/StaffLogin'))

const LoadingFallback = () => (
  <div className="flex items-center justify-center w-full h-[600px] text-fifa-green">
    <Loader2 className="animate-spin" size={32} />
    <span className="sr-only">Loading component...</span>
  </div>
)

function App() {
  const { t, i18n } = useTranslation()
  const [activeMode, setActiveMode] = useState<'fan' | 'staff'>('fan')
  const [isStaffAuthenticated, setIsStaffAuthenticated] = useState<boolean>(false)

  const handleLogout = () => {
    setIsStaffAuthenticated(false)
    setActiveMode('fan')
  }

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 min-h-screen flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-fifa-green text-black px-4 py-2 rounded-lg z-50 font-bold outline-none ring-2 ring-white">
        Skip to main content
      </a>

      {/* Outer Background Animations (Fan Mode Only) - Unmounted or paused for efficiency */}
      {activeMode === 'fan' && (
        <div
          className="fixed inset-0 z-0 overflow-hidden pointer-events-none transition-opacity duration-700 opacity-100"
          aria-hidden="true"
        >
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float opacity-0 will-change-transform"
              style={{
                left: `${5 + Math.random() * 90}%`,
                '--delay': `${Math.random() * 10}s`,
                '--duration': `${15 + Math.random() * 15}s`
              } as React.CSSProperties}
            >
              <img
                src="/football.png?v=3"
                alt=""
                className="w-24 h-24 object-contain opacity-10 blur-[2px] animate-spin-slow mix-blend-screen will-change-transform"
                style={{ animationDuration: `${5 + Math.random() * 10}s` }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      <header className="relative z-20 flex flex-col md:flex-row justify-between items-center p-3 px-6 glass-panel rounded-[2rem] md:rounded-full mb-10 mt-2 gap-4 sticky top-4 shadow-2xl transition-all">
        <h1 className="flex items-center gap-3 text-xl md:text-2xl font-bold text-white font-display tracking-tight m-0">
          <div className="bg-white/10 p-2 rounded-xl shadow-inner border border-white/5 flex items-center justify-center" aria-hidden="true">
            <img src="/favicon.png" alt="Logo" className="w-6 h-6 object-contain drop-shadow-md" />
          </div>
          {t('app.title')}
        </h1>

        <nav className="flex items-center gap-4" aria-label="Mode Navigation">
          <div className="flex bg-black/40 p-1 rounded-full border border-white/10 shadow-inner backdrop-blur-md">
            <button
              onClick={() => setActiveMode('fan')}
              aria-pressed={activeMode === 'fan'}
              aria-label="Switch to Fan Companion mode"
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-fifa-green/50 ${activeMode === 'fan'
                  ? 'bg-gradient-to-r from-fifa-green to-emerald-500 text-black shadow-[0_4px_15px_rgba(16,185,129,0.4)] scale-100'
                  : 'text-slate-400 hover:text-white scale-95 hover:scale-100'
                }`}
            >
              <MessageSquare size={16} strokeWidth={2.5} aria-hidden="true" />
              {t('app.fanAssistant')}
            </button>
            <button
              onClick={() => setActiveMode('staff')}
              aria-pressed={activeMode === 'staff'}
              aria-label="Switch to Staff Dashboard mode"
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-fifa-blue/50 ${activeMode === 'staff'
                  ? 'bg-gradient-to-r from-fifa-blue to-indigo-500 text-white shadow-[0_4px_15px_rgba(59,130,246,0.4)] scale-100'
                  : 'text-slate-400 hover:text-white scale-95 hover:scale-100'
                }`}
            >
              <Activity size={16} strokeWidth={2.5} aria-hidden="true" />
              {t('app.staffPortal')}
            </button>
          </div>

          {isStaffAuthenticated && (
            <button
              onClick={handleLogout}
              aria-label={t('app.logout')}
              className="p-2.5 rounded-full text-slate-400 hover:text-red-400 bg-black/40 hover:bg-white/10 border border-white/10 transition-colors shadow-inner focus:outline-none focus:ring-2 focus:ring-red-400/50"
              title={t('app.logout')}
            >
              <LogOut size={16} strokeWidth={2.5} aria-hidden="true" />
            </button>
          )}

          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-full border border-white/10 shadow-inner ml-2">
             <button onClick={() => i18n.changeLanguage('en')} className={`px-2 py-1 text-xs font-bold rounded-full ${i18n.language === 'en' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'}`}>EN</button>
             <button onClick={() => i18n.changeLanguage('es')} className={`px-2 py-1 text-xs font-bold rounded-full ${i18n.language === 'es' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'}`}>ES</button>
             <button onClick={() => i18n.changeLanguage('fr')} className={`px-2 py-1 text-xs font-bold rounded-full ${i18n.language === 'fr' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'}`}>FR</button>
          </div>
        </nav>
      </header>

      <main id="main-content" className="relative z-10 flex-1 w-full animate-fade-in" aria-live="polite">
        <Suspense fallback={<LoadingFallback />}>
          <div className={activeMode === 'fan' ? 'block animate-fade-in' : 'hidden'} aria-hidden={activeMode !== 'fan'}>
            <FanAssistant />
          </div>

          <div className={activeMode === 'staff' ? 'block animate-fade-in' : 'hidden'} aria-hidden={activeMode !== 'staff'}>
            {isStaffAuthenticated ? (
              <StaffDashboard />
            ) : (
              <StaffLogin onLogin={() => setIsStaffAuthenticated(true)} />
            )}
          </div>
        </Suspense>
      </main>
    </div>
  )
}

export default App
