import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      // Return English text based on the keys we used, to satisfy tests
      const translations: Record<string, string> = {
        'app.title': "FIFA '26 Smart Hub",
        'app.fanAssistant': "Fan Companion",
        'app.staffPortal': "Staff Dashboard",
        'dashboard.stadiumMap': "Live Interactive Stadium Map",
        'dashboard.insights': "AI Operator Insights",
        'assistant.welcome': "Welcome to the stadium! I'm your GenAI Companion. How can I enhance your matchday experience?",
        'assistant.placeholder': "Ask about navigation, wait times, or food...",
        'assistant.stadiumAssistant': "Stadium Assistant",
        'assistant.online': "GenAI Online",
      };
      return translations[key] || key;
    },
    i18n: {
      changeLanguage: () => new Promise(() => {}),
      language: 'en'
    }
  })
}));

// Mock Worker
class WorkerMock {
  url: string;
  onmessage: any;
  listeners: Record<string, Function[]> = {};

  constructor(stringUrl: string) {
    this.url = stringUrl;
    this.onmessage = () => {};
  }
  
  postMessage(msg: any) {
    // Immediately invoke the mocked response using microtask so findByText works
    Promise.resolve().then(() => {
      const responseEvent: any = { data: { id: msg.id } };
      
      if (msg.type === 'AI_CHAT') {
        responseEvent.data.type = 'AI_CHAT_RESULT';
        responseEvent.data.data = 'Mock AI Response';
      } else if (msg.type === 'FETCH_MATCH_DATA') {
        responseEvent.data.type = 'FETCH_MATCH_DATA_RESULT';
        responseEvent.data.data = { homeTeamCode: "ESP", awayTeamCode: "ARG", homeScore: 0, awayScore: 0, event: "Test event" };
      }
      
      if (this.listeners['message']) {
        this.listeners['message'].forEach(cb => cb(responseEvent));
      }
      if (this.onmessage) {
        this.onmessage(responseEvent);
      }
    });
  }
  
  terminate() {}
  
  addEventListener(event: string, callback: any) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }
  
  removeEventListener(event: string, callback: any) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }
}

(window as any).Worker = WorkerMock;
