import React from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("SkillServer Crash Log:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Something went wrong</h2>
            <p className="text-slate-500 text-sm font-medium mb-8">
              We couldn't load this section. This is usually due to a missing data point or a connection error.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2"
              >
                <RefreshCcw size={14} /> Reload Page
              </button>
              <a 
                href="/"
                className="w-full py-4 bg-slate-50 text-slate-400 text-[11px] font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2"
              >
                <Home size={14} /> Back to Safety
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;