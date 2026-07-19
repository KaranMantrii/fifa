import React, { useState } from 'react';
import { Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { login, AuthUser } from '../services/authService';

interface StaffLoginProps {
  onLogin: (user: AuthUser) => void;
}

export default function StaffLogin({ onLogin }: StaffLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await login(username, password);
      if (response && response.token) {
        onLogin(response.user);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Invalid credentials.');
      } else {
        setError('Invalid credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center min-h-[500px] animate-fade-in relative">
      
      {/* Ambient background glow for login */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-fifa-blue/10 rounded-full blur-[100px] pointer-events-none" aria-hidden="true"></div>

      <div className="glass-panel p-10 rounded-[2rem] w-full max-w-md flex flex-col items-center shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-fifa-blue/20 to-indigo-500/10 rounded-full blur-2xl group-hover:bg-fifa-blue/30 transition-colors duration-700" aria-hidden="true"></div>
        
        <div className="w-16 h-16 bg-gradient-to-tr from-fifa-blue/20 to-indigo-500/20 rounded-full flex items-center justify-center text-fifa-blue mb-6 border border-fifa-blue/30 shadow-[0_0_20px_rgba(59,130,246,0.2)] relative z-10">
          <Lock size={28} strokeWidth={2.5} aria-hidden="true" />
        </div>
        
        <h2 className="text-2xl font-bold font-display text-white mb-2 tracking-tight relative z-10">Staff Portal</h2>
        <p className="text-sm text-slate-400 mb-8 text-center relative z-10">Enter your credentials to access the live stadium operations dashboard.</p>
        
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 relative z-10" noValidate>
          <div className="relative group">
            <label htmlFor="username-input" className="sr-only">Username</label>
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-fifa-blue transition-colors" aria-hidden="true" />
            <input 
              id="username-input"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              aria-invalid={error ? 'true' : 'false'}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-fifa-blue/50 focus:ring-2 focus:ring-fifa-blue/20 focus:bg-black/60 transition-all shadow-inner disabled:opacity-50"
            />
          </div>
          
          <div className="relative group">
            <label htmlFor="password-input" className="sr-only">Password</label>
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-fifa-blue transition-colors" aria-hidden="true" />
            <input 
              id="password-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              aria-invalid={error ? 'true' : 'false'}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-fifa-blue/50 focus:ring-2 focus:ring-fifa-blue/20 focus:bg-black/60 transition-all shadow-inner disabled:opacity-50"
            />
          </div>

          <div aria-live="polite" className="min-h-[24px]">
            {error && <p className="text-red-400 text-xs font-medium bg-red-400/10 py-2 px-3 rounded-md border border-red-400/20">{error}</p>}
          </div>

          <button 
            type="submit"
            disabled={isLoading || !username || !password}
            className="w-full mt-2 bg-gradient-to-r from-fifa-blue to-indigo-600 text-white rounded-xl py-3.5 font-semibold transition-all flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.5)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-fifa-blue/50"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden="true" /> Authenticating...
              </>
            ) : (
              <>
                Authenticate <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
