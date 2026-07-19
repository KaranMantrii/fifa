import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MapPin, Coffee, Info, Volume2, Activity } from 'lucide-react';
import { simulateAIResponse, simulateLiveMatchData } from '../services/aiSim';

const SUGGESTIONS = [
  { icon: <Coffee size={14} />, text: "Where's the nearest food?" },
  { icon: <MapPin size={14} />, text: "Fastest way back downtown?" },
  { icon: <Info size={14} />, text: "Queue time for Gate 4?" }
];

export default function FanAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Welcome to the stadium! I'm your GenAI Companion. How can I enhance your matchday experience?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [matchMinute, setMatchMinute] = useState(0);
  const [matchData, setMatchData] = useState({ 
    homeTeamCode: "ESP", awayTeamCode: "ARG", homeScore: 0, awayScore: 0, event: "The Final kicks off!" 
  });
  const messagesEndRef = useRef(null);

  // Match Simulation Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setMatchMinute(m => {
        const next = m + 1;
        // Fetch new AI-generated event every 10 simulated minutes
        if (next % 10 === 0 && next <= 90) {
          simulateLiveMatchData(next).then(data => {
            if (data) setMatchData(data);
          });
        }
        return next <= 95 ? next : 90; // Stop after stoppage time
      });
    }, 2000); // 1 game minute every 2 seconds for demo

    return () => clearInterval(timer);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    if (!text.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setIsTyping(true);

    // Fetch AI response
    const response = await simulateAIResponse(text);
    
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsTyping(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[calc(100vh-160px)] min-h-[600px] flex flex-col relative z-10 animate-fade-in">
      
      {/* Main Glass Container */}
      <div className="flex-1 flex flex-col glass-panel rounded-[2rem] overflow-hidden shadow-2xl relative border-t border-white/20">
        
        {/* Blurred Football Background */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.12] bg-center bg-cover blur-[2px] pointer-events-none mix-blend-screen"
          style={{ backgroundImage: "url('/football.png?v=3')" }}
        ></div>

        <div className="relative z-10 flex flex-col w-full h-full">
          
          {/* Premium Chat Header */}
          <div className="p-5 px-8 bg-black/20 border-b border-white/10 flex items-center justify-between backdrop-blur-xl relative z-20">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-fifa-green to-emerald-400 rounded-full blur group-hover:blur-md transition-all duration-300"></div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-fifa-green to-emerald-500 flex items-center justify-center p-[2px] relative">
                  <div className="w-full h-full bg-neutral-900 rounded-full flex items-center justify-center relative shadow-inner">
                    <Bot size={22} className="text-fifa-green" />
                  </div>
                </div>
                {/* Status Dot */}
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-fifa-green rounded-full border-[2.5px] border-neutral-900 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
              </div>
              
              <div>
                <h2 className="font-bold text-white text-lg font-display tracking-tight">Stadium Assistant</h2>
                <p className="text-xs font-medium text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                  </span>
                  GenAI Online
                </p>
              </div>
            </div>
            
            <button className="p-3 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-full hover:bg-white/10 border border-white/5 hover:border-white/20 hover:shadow-lg active:scale-95" title="Text-to-Speech (Demo)">
              <Volume2 size={18} />
            </button>
          </div>

          {/* Live Match Center Widget */}
          <div className="bg-black/40 border-b border-white/5 p-4 px-6 flex flex-col gap-3 backdrop-blur-md relative z-10 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-2 bg-red-500/10 px-2 py-1 rounded-md border border-red-500/20">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  Live
                </span>
                <div className="flex items-center gap-4 text-white font-display font-bold text-2xl tracking-tight">
                  <span className="text-fifa-blue">{matchData.homeTeamCode}</span>
                  <span className="bg-white/10 px-4 py-1 rounded-lg shadow-inner">{matchData.homeScore} - {matchData.awayScore}</span>
                  <span className="text-fifa-green">{matchData.awayTeamCode}</span>
                </div>
              </div>
              <div className="text-fifa-amber font-mono font-bold text-base bg-fifa-amber/10 px-4 py-1.5 rounded-lg border border-fifa-amber/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                {matchMinute <= 90 ? `${matchMinute}:00` : 'FT'}
              </div>
            </div>
            
            {/* Live Event Ticker */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-white/5 p-2 rounded-md border border-white/10">
              <Activity size={14} className="text-fifa-blue animate-pulse" />
              <span className="truncate">"{matchData.event}"</span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scroll-smooth">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex items-end gap-3.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'animate-fade-in'}`}>
                
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-lg ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-tr from-slate-700 to-slate-600 text-white' 
                    : 'bg-gradient-to-tr from-fifa-green/20 to-emerald-500/20 border border-fifa-green/30 text-fifa-green'
                }`}>
                  {msg.role === 'user' ? <User size={16} strokeWidth={2.5} /> : <Bot size={16} strokeWidth={2.5} />}
                </div>
                
                {/* Bubble */}
                <div className={`max-w-[80%] p-4 px-5 text-[15px] leading-relaxed shadow-lg ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-fifa-blue to-indigo-600 text-white rounded-[1.5rem] rounded-br-sm shadow-[0_4px_25px_rgba(59,130,246,0.3)]' 
                    : 'bg-neutral-900/60 backdrop-blur-xl text-slate-100 rounded-[1.5rem] rounded-bl-sm border border-white/10'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-end gap-3.5 animate-fade-in">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-fifa-green/20 to-emerald-500/20 border border-fifa-green/30 text-fifa-green flex items-center justify-center shrink-0 shadow-lg">
                  <Bot size={16} strokeWidth={2.5} />
                </div>
                <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-[1.5rem] rounded-bl-sm p-4 px-5 flex gap-1.5 items-center h-[52px]">
                  <span className="w-2 h-2 rounded-full bg-fifa-green animate-bounce shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                  <span className="w-2 h-2 rounded-full bg-fifa-green animate-bounce shadow-[0_0_8px_rgba(16,185,129,0.8)]" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 rounded-full bg-fifa-green animate-bounce shadow-[0_0_8px_rgba(16,185,129,0.8)]" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Floating Input Area */}
          <div className="p-6 pt-0">
            {/* Suggestions */}
            {messages.length === 1 && (
              <div className="pb-4 flex flex-wrap gap-2.5 animate-fade-in">
                {SUGGESTIONS.map((s, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSend(s.text)}
                    className="text-sm font-medium bg-black/40 backdrop-blur-md hover:bg-white/10 border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 text-slate-200 hover:text-white hover:border-white/30 transition-all active:scale-95 shadow-lg"
                  >
                    {s.icon} {s.text}
                  </button>
                ))}
              </div>
            )}

            {/* Input Box */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
              className="relative flex items-center group"
            >
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about navigation, wait times, or food..."
                className="w-full bg-black/50 backdrop-blur-xl border border-white/10 rounded-full py-4 pl-6 pr-14 text-white placeholder-slate-400 focus:outline-none focus:border-fifa-green/50 focus:ring-2 focus:ring-fifa-green/20 focus:bg-black/70 transition-all shadow-inner text-base"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className={`absolute right-2 p-2.5 rounded-full transition-all duration-300 ${
                  input.trim() && !isTyping 
                    ? 'bg-gradient-to-r from-fifa-green to-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95' 
                    : 'bg-white/10 text-slate-400 opacity-50 cursor-not-allowed'
                }`}
              >
                <Send size={18} strokeWidth={2.5} className={input.trim() && !isTyping ? "ml-0.5" : ""} />
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
}
