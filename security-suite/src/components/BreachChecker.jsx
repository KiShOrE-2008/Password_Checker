import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Loader2, Lock } from 'lucide-react';
import { checkPwned } from '../utils/crypto';
import { motion, AnimatePresence } from 'framer-motion';

const BreachChecker = ({ password }) => {
  const [loading, setLoading] = useState(false);
  const [breaches, setBreaches] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const verify = async () => {
      if (!password) {
        setBreaches(null);
        return;
      }
      
      setLoading(true);
      const count = await checkPwned(password);
      if (isMounted) {
        setBreaches(count);
        setLoading(false);
      }
    };

    // Debounce the breach check
    const timeout = setTimeout(() => {
      verify();
    }, 800);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [password]);

  return (
    <div className="glass-panel">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
        <ShieldAlert className="w-5 h-5" /> Live Breach Intelligence
      </h2>
      
      <p className="text-sm text-secondary mb-6 flex items-center gap-2">
        <Lock className="w-4 h-4" /> 
        We use k-anonymity (sending only a 5-char hash prefix). Your full password never leaves your device.
      </p>

      <div className="min-h-[100px] flex items-center justify-center bg-black/30 rounded-xl border border-white/5 p-4">
        <AnimatePresence mode="wait">
          {!password ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-secondary text-center">
              Enter a password to cross-reference with known breaches.
            </motion.div>
          ) : loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-primary">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <span className="text-sm uppercase tracking-widest">Querying Global Databases...</span>
            </motion.div>
          ) : breaches === null ? (
            <motion.div key="error" className="text-red-400">Error connecting to intelligence servers.</motion.div>
          ) : breaches > 0 ? (
            <motion.div key="found" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center w-full">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 text-red-500 mb-4 neon-border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-red-400 mb-1">COMPROMISED</h3>
              <p className="text-red-200">
                Found in <span className="font-mono font-bold text-white">{breaches.toLocaleString()}</span> known data breaches.
              </p>
            </motion.div>
          ) : (
            <motion.div key="safe" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center w-full">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-500 mb-4 neon-border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-green-400 mb-1">CLEAR</h3>
              <p className="text-green-200">
                Not found in any known public data breaches.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BreachChecker;
