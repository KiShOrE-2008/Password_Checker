import React, { useState, useEffect } from 'react';
import { Settings2, RefreshCw, Copy, Check } from 'lucide-react';
import { generateSecurePassword } from '../utils/crypto';

const Generator = ({ setPassword }) => {
  const [length, setLength] = useState(24);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(true);
  
  const [generated, setGenerated] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    // Need at least one charset
    if (!upper && !lower && !numbers && !symbols) {
      setLower(true);
      return;
    }
    const pwd = generateSecurePassword({ length, upper, lower, numbers, symbols, excludeAmbiguous });
    setGenerated(pwd);
  };

  // Removed auto-generation on mount/change as requested by user
  // User must explicitly click the generate button

  const copyToClipboard = async () => {
    if (!generated) return;
    await navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const usePassword = () => {
    setPassword(generated);
  };

  return (
    <div className="glass-panel">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
        <Settings2 className="w-5 h-5" /> Secure Cryptographic Generator
      </h2>

      <div className="bg-black/40 border border-white/10 rounded-xl p-4 mb-6 flex items-center justify-between">
        <div className="font-mono text-lg truncate text-white mr-4 select-all">
          {generated ? generated : <span className="text-secondary/50 text-sm italic">Click generate to create...</span>}
        </div>
        <div className="flex gap-2 shrink-0">
          <button 
            onClick={handleGenerate}
            className="p-2 bg-primary/20 hover:bg-primary text-primary hover:text-black rounded-lg transition-colors font-bold text-sm flex items-center gap-1"
            title="Generate Password"
          >
            <RefreshCw className={`w-4 h-4 ${!generated && 'animate-pulse'}`} /> 
            {generated ? 'Regenerate' : 'Generate'}
          </button>
          <button 
            onClick={copyToClipboard}
            className="p-2 bg-white/5 hover:bg-primary/20 rounded-lg text-secondary hover:text-primary transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-sm text-secondary mb-2">
            <span>Length: <span className="text-primary font-mono">{length}</span></span>
            <span>[8 - 64]</span>
          </div>
          <input 
            type="range" 
            min="8" max="64" 
            value={length} 
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full accent-primary bg-black/50 h-2 rounded-full outline-none appearance-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} className="accent-primary w-4 h-4" />
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Uppercase</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" checked={lower} onChange={(e) => setLower(e.target.checked)} className="accent-primary w-4 h-4" />
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Lowercase</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" checked={numbers} onChange={(e) => setNumbers(e.target.checked)} className="accent-primary w-4 h-4" />
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Numbers</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} className="accent-primary w-4 h-4" />
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Symbols</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group col-span-2">
            <input type="checkbox" checked={excludeAmbiguous} onChange={(e) => setExcludeAmbiguous(e.target.checked)} className="accent-primary w-4 h-4" />
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Exclude Ambiguous (I, l, 1, O, 0)</span>
          </label>
        </div>

        <button 
          onClick={usePassword}
          className="w-full py-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg font-bold tracking-wide transition-all uppercase text-sm neon-border"
        >
          Inject into Analyzer
        </button>
      </div>
    </div>
  );
};

export default Generator;
