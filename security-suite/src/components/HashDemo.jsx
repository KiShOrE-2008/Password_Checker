import React, { useState, useEffect } from 'react';
import { Hash, Cpu, Timer } from 'lucide-react';
import { demoPbkdf2Hash } from '../utils/crypto';
import { motion } from 'framer-motion';

const HashDemo = ({ password }) => {
  const [hashData, setHashData] = useState(null);
  const [computing, setComputing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const compute = async () => {
      if (!password) {
        setHashData(null);
        return;
      }
      setComputing(true);
      const res = await demoPbkdf2Hash(password);
      if (isMounted) {
        setHashData(res);
        setComputing(false);
      }
    };

    const timeout = setTimeout(compute, 500);
    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [password]);

  return (
    <div className="glass-panel">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
        <Hash className="w-5 h-5" /> Cryptographic Transform
      </h2>

      <p className="text-sm text-secondary mb-4">
        Educational demonstration of key derivation using PBKDF2. This simulates how a backend server should securely store a password.
      </p>

      <div className="bg-black/50 border border-white/5 rounded-xl p-4 font-mono text-sm space-y-3">
        <div className="flex flex-col">
          <span className="text-secondary text-xs uppercase tracking-wider mb-1">Algorithm Structure</span>
          <span className="text-primary font-bold">PBKDF2-HMAC-SHA256 (100,000 iter)</span>
        </div>

        <div className="flex flex-col">
          <span className="text-secondary text-xs uppercase tracking-wider mb-1">Random Salt (128-bit)</span>
          <span className="text-white break-all">{computing || !password ? '...' : hashData?.salt}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-secondary text-xs uppercase tracking-wider mb-1">Derived Key (256-bit)</span>
          <span className="text-white break-all">{computing || !password ? '...' : hashData?.hash}</span>
        </div>

        <div className="pt-2 mt-2 border-t border-white/10 flex justify-between items-center text-xs text-secondary">
          <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> Client-side WebCrypto API</span>
          <span className="flex items-center gap-1 text-primary"><Timer className="w-3 h-3" /> {computing ? 'computing...' : hashData ? `${hashData.timeMs}ms compute time` : '0ms'}</span>
        </div>
      </div>
    </div>
  );
};

export default HashDemo;
