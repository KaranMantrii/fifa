import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-neutral-900 p-4">
          <div className="glass-panel max-w-md w-full p-8 rounded-3xl text-center shadow-[0_8px_32px_rgba(239,68,68,0.2)] border border-red-500/20 animate-fade-in">
            <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 font-display">System Recovery</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              We encountered an unexpected anomaly in the data stream. The operator module has been safely halted to prevent data corruption.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold tracking-wide shadow-lg hover:shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              Reboot Terminal
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
