import React from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

const strengthColors = {
  0: 'bg-veryWeak shadow-[0_0_10px_rgba(255,75,75,0.8)]',
  1: 'bg-weak shadow-[0_0_10px_rgba(255,142,60,0.8)]',
  2: 'bg-moderate shadow-[0_0_10px_rgba(248,198,48,0.8)]',
  3: 'bg-strong shadow-[0_0_10px_rgba(32,226,83,0.8)]',
  4: 'bg-veryStrong shadow-[0_0_10px_rgba(0,240,255,0.8)]',
};

const strengthLabels = ['Very Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong'];

const Analyzer = ({ password, analysis }) => {
  if (!password) {
    return (
      <div className="glass-panel text-center py-12 text-secondary">
        <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Awaiting input for analysis...</p>
      </div>
    );
  }

  const { score, entropy, crackTimes, warnings, suggestions } = analysis;
  const barWidth = `${(score + 1) * 20}%`;

  return (
    <div className="glass-panel space-y-8">
      {/* Strength Meter */}
      <div>
        <div className="flex justify-between items-end mb-2">
          <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
            <Activity className="w-5 h-5" /> Threat Analysis
          </h2>
          <span className="text-sm font-mono text-secondary">Entropy: {entropy} bits</span>
        </div>
        
        <div className="h-3 bg-black/50 rounded-full overflow-hidden mb-2">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: barWidth }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`h-full rounded-full ${strengthColors[score]}`}
          />
        </div>
        <div className="text-right font-bold tracking-wider" style={{ color: strengthColors[score].split(' ')[0].replace('bg-', 'var(--') + ')' }}>
          {strengthLabels[score].toUpperCase()}
        </div>
      </div>

      {/* Crack Times */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
          <Clock className="w-5 h-5" /> Estimated Crack Times
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-black/30 rounded-lg border border-white/5">
            <div className="text-xs text-secondary mb-1">Worst Case (GPU Cluster)</div>
            <div className="font-mono text-lg font-bold text-red-400">{crackTimes.offlineGpu}</div>
          </div>
          <div className="p-3 bg-black/30 rounded-lg border border-white/5">
            <div className="text-xs text-secondary mb-1">Offline (PBKDF2)</div>
            <div className="font-mono text-lg font-bold text-orange-400">{crackTimes.offlinePbkdf2}</div>
          </div>
          <div className="p-3 bg-black/30 rounded-lg border border-white/5">
            <div className="text-xs text-secondary mb-1">Online (No Limits)</div>
            <div className="font-mono text-lg font-bold text-yellow-400">{crackTimes.onlineUnlimited}</div>
          </div>
          <div className="p-3 bg-black/30 rounded-lg border border-white/5">
            <div className="text-xs text-secondary mb-1">Online (Rate Limited)</div>
            <div className="font-mono text-lg font-bold text-green-400">{crackTimes.onlineLimited}</div>
          </div>
        </div>
      </div>

      {/* Advanced Pattern Analysis */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
          <ShieldCheck className="w-5 h-5" /> Pattern Heuristics
        </h3>
        <div className="space-y-2">
          {warnings.length === 0 && suggestions.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 p-3 bg-green-500/10 border-l-4 border-strong rounded">
              <CheckCircle2 className="text-strong" />
              <span className="text-green-100">No obvious predictable patterns detected.</span>
            </motion.div>
          ) : (
            <>
              {warnings.map((w, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-start gap-3 p-3 bg-red-500/10 border-l-4 border-veryWeak rounded">
                  <AlertTriangle className="text-veryWeak shrink-0 mt-0.5" />
                  <span className="text-red-100">{w}</span>
                </motion.div>
              ))}
              {suggestions.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }} className="flex items-start gap-3 p-3 bg-yellow-500/10 border-l-4 border-moderate rounded">
                  <Activity className="text-moderate shrink-0 mt-0.5" />
                  <span className="text-yellow-100">{s}</span>
                </motion.div>
              ))}
            </>
          )}
        </div>
      </div>

    </div>
  );
};

export default Analyzer;
