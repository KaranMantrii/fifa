import { useState } from 'react';
import { Lock, User, ArrowRight } from 'lucide-react';

export default function StaffLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock authentication logic
    if (username === 'admin' && password === 'fifa2026') {
      onLogin();
    } else {
      setError('Invalid credentials. (Hint: admin / fifa2026)');
    }
  };

  return (
    <div className="w-full flex items-center justify-center min-h-[500px] animate-fade-in relative">
      
      {/* Ambient background glow for login */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-fifa-blue/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="glass-panel p-10 rounded-[2rem] w-full max-w-md flex flex-col items-center shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-fifa-blue/20 to-indigo-500/10 rounded-full blur-2xl group-hover:bg-fifa-blue/30 transition-colors duration-700"></div>
        
        <div className="w-16 h-16 bg-gradient-to-tr from-fifa-blue/20 to-indigo-500/20 rounded-full flex items-center justify-center text-fifa-blue mb-6 border border-fifa-blue/30 shadow-[0_0_20px_rgba(59,130,246,0.2)] relative z-10">
          <Lock size={28} strokeWidth={2.5} />
        </div>
        
        <h2 className="text-2xl font-bold font-display text-white mb-2 tracking-tight relative z-10">Staff Portal</h2>
        <p className="text-sm text-slate-400 mb-8 text-center relative z-10">Enter your credentials to access the live stadium operations dashboard.</p>
        
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 relative z-10">
          <div className="relative group">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-fifa-blue transition-colors" />
            <input 
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-fifa-blue/50 focus:ring-2 focus:ring-fifa-blue/20 focus:bg-black/60 transition-all shadow-inner"
            />
          </div>
          
          <div className="relative group">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-fifa-blue transition-colors" />
            <input 
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-fifa-blue/50 focus:ring-2 focus:ring-fifa-blue/20 focus:bg-black/60 transition-all shadow-inner"
            />
          </div>

          {error && <p className="text-red-400 text-xs font-medium bg-red-400/10 py-2 px-3 rounded-md border border-red-400/20">{error}</p>}

          <button 
            type="submit"
            className="w-full mt-2 bg-gradient-to-r from-fifa-blue to-indigo-600 text-white rounded-xl py-3.5 font-semibold transition-all flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.5)] hover:scale-[1.02] active:scale-95"
          >
            Authenticate <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </form>
      </div>
    </div>
  );
}
