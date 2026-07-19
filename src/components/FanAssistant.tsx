import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, MapPin, Coffee, Info, Volume2, Activity } from 'lucide-react';
import DOMPurify from 'dompurify';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import SimulationWorker from '../services/simulation.worker.ts?worker';
import fifaBg from '../../Assets/fifa.png';

const SUGGESTIONS = [
  { icon: <Coffee size={14} aria-hidden="true" />, text: "Where's the nearest food?" },
  { icon: <MapPin size={14} aria-hidden="true" />, text: "Where is the FIFA Fan Festival™?" },
  { icon: <Info size={14} aria-hidden="true" />, text: "Where can I buy official merch?" }
];

// Zod Schema for strict input validation
const chatInputSchema = z.string()
  .min(1, "Message cannot be empty")
  .max(500, "Message is too long")
  .refine(val => !/<[^>]*>?/gm.test(val), {
    message: "HTML tags are not allowed"
  });

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Memoized message bubble for efficiency
const MessageBubble = React.memo(({ msg }: { msg: Message }) => (
  <div className={`flex items-end gap-3.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'animate-fade-in'}`}>
    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user'
      ? 'bg-gradient-to-tr from-slate-700 to-slate-600 text-white'
      : 'bg-gradient-to-tr from-fifa-green/20 to-emerald-500/20 border border-fifa-green/30 text-fifa-green'
      }`}>
      {msg.role === 'user' ? <User size={16} strokeWidth={2.5} aria-hidden="true" /> : <Bot size={16} strokeWidth={2.5} aria-hidden="true" />}
    </div>

    <div className={`max-w-[80%] p-4 px-5 text-[15px] leading-relaxed shadow-lg ${msg.role === 'user'
      ? 'bg-gradient-to-br from-fifa-blue to-indigo-600 text-white rounded-[1.5rem] rounded-br-sm shadow-[0_4px_25px_rgba(59,130,246,0.3)]'
      : 'bg-neutral-900/60 backdrop-blur-xl text-slate-100 rounded-[1.5rem] rounded-bl-sm border border-white/10'
      }`}>
      {msg.content}
    </div>
  </div>
));
MessageBubble.displayName = 'MessageBubble';

export default function FanAssistant() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t('assistant.welcome') }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [matchMinute, setMatchMinute] = useState(0);
  const [matchData, setMatchData] = useState({
    homeTeamCode: "USA", awayTeamCode: "MEX", homeScore: 0, awayScore: 0, event: "Welcome to the World Cup!"
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new SimulationWorker();
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  // Match Simulation Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setMatchMinute(m => {
        const next = m + 1;
        // Fetch new AI-generated event every 10 simulated minutes
        if (next % 10 === 0 && next <= 90 && workerRef.current) {
          const id = Date.now();

          const handleWorkerMessage = (e: MessageEvent) => {
            if (e.data.id === id && e.data.type === 'FETCH_MATCH_DATA_RESULT' && e.data.data) {
              setMatchData(e.data.data);
              workerRef.current?.removeEventListener('message', handleWorkerMessage);
            }
          };

          workerRef.current.addEventListener('message', handleWorkerMessage);
          workerRef.current.postMessage({ id, type: 'FETCH_MATCH_DATA', payload: { minute: next } });
        }
        return next <= 95 ? next : 90; // Stop after stoppage time
      });
    }, 2000); // 1 game minute every 2 seconds for demo

    return () => clearInterval(timer);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleSend = useCallback((text: string) => {
    if (!text.trim()) return;

    try {
      // 1. Zod Validation
      const validatedText = chatInputSchema.parse(text.trim());

      // 2. DOMPurify Sanitization
      const cleanText = DOMPurify.sanitize(validatedText);

      setMessages(prev => [...prev, { role: 'user', content: cleanText }]);
      setInput('');
      setIsTyping(true);

      if (workerRef.current) {
        const id = Date.now();

        const handleWorkerMessage = (e: MessageEvent) => {
          if (e.data.id === id) {
            if (e.data.type === 'AI_CHAT_RESULT') {
              setMessages(prev => [...prev, { role: 'assistant', content: e.data.data }]);
            } else if (e.data.type === 'ERROR') {
              setMessages(prev => [...prev, { role: 'assistant', content: "An error occurred connecting to the AI." }]);
            }
            setIsTyping(false);
            workerRef.current?.removeEventListener('message', handleWorkerMessage);
          }
        };

        workerRef.current.addEventListener('message', handleWorkerMessage);
        workerRef.current.postMessage({ id, type: 'AI_CHAT', payload: { message: cleanText } });
      } else {
        setIsTyping(false);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.issues[0].message}` }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "An error occurred processing your request." }]);
      }
      setIsTyping(false);
    }
  }, []);

  return (
    <section className="w-full max-w-4xl mx-auto h-[calc(100vh-160px)] min-h-[600px] flex flex-col relative z-10 animate-fade-in" aria-label="Fan Assistant Chat">

      {/* Main Glass Container */}
      <div className="flex-1 flex flex-col glass-panel rounded-[2rem] overflow-hidden shadow-2xl relative border-t border-white/20">

        {/* Blurred Football Background */}
        <div
          className="absolute inset-0 z-0 opacity-[0.12] bg-center bg-cover blur-[2px] pointer-events-none mix-blend-screen"
          style={{ backgroundImage: `url(${fifaBg})`, height: "100%", width: "75%", left: "11%" }}
          aria-hidden="true"
        ></div>

        <div className="relative z-10 flex flex-col w-full h-full">

          {/* Premium Chat Header */}
          <header className="p-5 px-8 bg-black/20 border-b border-white/10 flex items-center justify-between backdrop-blur-xl relative z-20">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-fifa-green to-emerald-400 rounded-full blur group-hover:blur-md transition-all duration-300" aria-hidden="true"></div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-fifa-green to-emerald-500 flex items-center justify-center p-[2px] relative">
                  <div className="w-full h-full bg-neutral-900 rounded-full flex items-center justify-center relative shadow-inner">
                    <Bot size={22} className="text-fifa-green" aria-hidden="true" />
                  </div>
                </div>
                {/* Status Dot */}
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-fifa-green rounded-full border-[2.5px] border-neutral-900 shadow-[0_0_10px_rgba(16,185,129,0.8)]" aria-label="Online Status"></div>
              </div>

              <div>
                <h2 className="font-bold text-white text-lg font-display tracking-tight">FIFA '26 AI Assistant</h2>
                <p className="text-xs font-medium text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" aria-hidden="true"></span>
                  Connected to MetLife Stadium Node
                </p>
              </div>
            </div>

            <button
              className="p-3 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-full hover:bg-white/10 border border-white/5 hover:border-white/20 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50"
              title="Text-to-Speech (Demo)"
              aria-label="Toggle Text-to-Speech"
            >
              <Volume2 size={18} aria-hidden="true" />
            </button>
          </header>

          {/* Live Match Center Widget */}
          <aside className="bg-black/40 border-b border-white/5 p-4 px-6 flex flex-col gap-3 backdrop-blur-md relative z-10 shadow-lg" aria-label="Live Match Status" aria-live="polite">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-2 bg-red-500/10 px-2 py-1 rounded-md border border-red-500/20">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true"></span>
                  Live
                </span>
                <div className="flex items-center gap-4 text-white font-display font-bold text-2xl tracking-tight">
                  <span className="text-fifa-blue" aria-label={`Home team: ${matchData.homeTeamCode}`}>{matchData.homeTeamCode}</span>
                  <span className="bg-white/10 px-4 py-1 rounded-lg shadow-inner" aria-label={`Score: ${matchData.homeScore} to ${matchData.awayScore}`}>{matchData.homeScore} - {matchData.awayScore}</span>
                  <span className="text-fifa-green" aria-label={`Away team: ${matchData.awayTeamCode}`}>{matchData.awayTeamCode}</span>
                </div>
              </div>
              <div className="text-fifa-amber font-mono font-bold text-base bg-fifa-amber/10 px-4 py-1.5 rounded-lg border border-fifa-amber/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]" aria-label={`Match minute: ${matchMinute}`}>
                {matchMinute <= 90 ? `${matchMinute}'` : 'FT'}
              </div>
            </div>

            {/* Live Event Ticker */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-white/5 p-2 rounded-md border border-white/10">
              <Activity size={14} className="text-fifa-blue animate-pulse" aria-hidden="true" />
              <span className="truncate">"{matchData.event}"</span>
            </div>
          </aside>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scroll-smooth" aria-live="polite" aria-atomic="false">
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} msg={msg} />
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-end gap-3.5 animate-fade-in" aria-label="Assistant is typing...">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-fifa-green/20 to-emerald-500/20 border border-fifa-green/30 text-fifa-green flex items-center justify-center shrink-0 shadow-lg">
                  <Bot size={16} strokeWidth={2.5} aria-hidden="true" />
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
              <div className="pb-4 flex flex-wrap gap-2.5 animate-fade-in" aria-label="Suggested questions">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s.text)}
                    className="text-sm font-medium bg-black/40 backdrop-blur-md hover:bg-white/10 border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 text-slate-200 hover:text-white hover:border-white/30 transition-all active:scale-95 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
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
              <label htmlFor="chat-input" className="sr-only">Type your message</label>
              <input
                id="chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('assistant.placeholder')}
                className="w-full bg-black/50 backdrop-blur-xl border border-white/10 rounded-full py-4 pl-6 pr-14 text-white placeholder-slate-400 focus:outline-none focus:border-fifa-green/50 focus:ring-2 focus:ring-fifa-green/20 focus:bg-black/70 transition-all shadow-inner text-base"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                aria-label="Send message"
                className={`absolute right-2 p-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-fifa-green/50 ${input.trim() && !isTyping
                  ? 'bg-gradient-to-r from-fifa-green to-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95'
                  : 'bg-white/10 text-slate-400 opacity-50 cursor-not-allowed'
                  }`}
              >
                <Send size={18} strokeWidth={2.5} className={input.trim() && !isTyping ? "ml-0.5" : ""} aria-hidden="true" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
