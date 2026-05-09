import React from 'react';
import { AlertOctagon, RefreshCw, Home, ShieldAlert, WifiOff, ServerCrash } from 'lucide-react';

const ErrorPage = ({ statusCode = 404, message, onRetry, onHome }) => {
  
  // Determine error icon and default messages based on status code
  let Icon = ShieldAlert;
  let title = 'Error';
  let defaultMessage = 'An unexpected anomaly occurred within the system.';
  
  if (statusCode === 404) {
    Icon = AlertOctagon;
    title = 'Resource Not Found';
    defaultMessage = 'The intelligence asset you are looking for does not exist or has been relocated.';
  } else if (statusCode === 0 || statusCode === 'NETWORK_ERROR') {
    Icon = WifiOff;
    title = 'Connection Interrupted';
    defaultMessage = 'We lost contact with the mainframe. Check your network connection and try again.';
  } else if (statusCode >= 500) {
    Icon = ServerCrash;
    title = 'Server Anomaly';
    defaultMessage = 'The server encountered a critical error while processing your request.';
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center animate-fade-in p-4">
      <div className="glass-panel max-w-lg w-full text-center p-10 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-500 to-rose-600"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-pulse-slow">
            <Icon className="w-12 h-12 text-red-500" />
          </div>

          <h1 className="text-6xl font-black text-white mb-2 tracking-tighter drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
            {statusCode !== 'NETWORK_ERROR' ? statusCode : 'ERR'}
          </h1>
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            {title}
          </h2>
          
          <p className="text-secondary mb-8 text-lg leading-relaxed">
            {message || defaultMessage}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] font-semibold"
              >
                <RefreshCw className="w-5 h-5" />
                Retry Connection
              </button>
            )}
            {onHome && (
              <button
                onClick={onHome}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary/10 border border-primary/30 text-primary rounded-xl hover:bg-primary hover:text-black transition-all shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] font-semibold"
              >
                <Home className="w-5 h-5" />
                Return to Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
