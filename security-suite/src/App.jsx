import React, { useState } from 'react';
import { Shield, Key, Eye, EyeOff, Hash, Activity, ShieldAlert, UserCircle, Database, Settings2 } from 'lucide-react';
import { analyzePassword } from './utils/crypto';
import Analyzer from './components/Analyzer';
import Generator from './components/Generator';
import BreachChecker from './components/BreachChecker';
import HashDemo from './components/HashDemo';
import ProfileModal from './components/ProfileModal';
import Auth from './components/Auth';
import Vault from './components/Vault';
import ErrorPage from './components/ErrorPage';

function App() {
  const [globalError, setGlobalError] = useState(null); // e.g. { statusCode: 404, message: '...' }
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('analyzer'); // analyzer | vault | generator
  const [vaultInitialPassword, setVaultInitialPassword] = useState('');
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem('loggedInUser') || sessionStorage.getItem('guestMode') === 'true');
  
  const analysis = analyzePassword(password);

  const handleLogin = (username) => {
    setIsAuthenticated(true);
  };

  const handleContinueAsGuest = () => {
    sessionStorage.setItem('guestMode', 'true');
    setIsAuthenticated(true);
  };

  if (globalError) {
    return (
      <ErrorPage 
        statusCode={globalError.statusCode} 
        message={globalError.message} 
        onRetry={() => setGlobalError(null)} 
        onHome={() => {
          setGlobalError(null);
          setActiveTab('analyzer');
        }} 
      />
    );
  }

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} onContinueAsGuest={handleContinueAsGuest} setGlobalError={setGlobalError} />;
  }

  // Intercept the generator inject button to switch back to analyzer
  const handleSetPassword = (pwd) => {
    setPassword(pwd);
    setActiveTab('analyzer');
  };

  const handleStoreSecurePassword = (pwd) => {
    setVaultInitialPassword(pwd);
    setActiveTab('vault');
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      
      <div className="flex justify-end mb-6">
        <button 
          onClick={() => setIsProfileOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 text-primary rounded-lg hover:bg-primary hover:text-black transition-all shadow-[0_0_10px_rgba(0,240,255,0.2)]">
          <UserCircle className="w-5 h-5" />
          <span className="font-semibold">Profile</span>
        </button>
      </div>

      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-4 glow-text">
          <Shield className="w-12 h-12 text-primary" />
          Vanguard Security Suite
        </h1>
        <p className="text-secondary text-lg">Next-Generation Password Intelligence & Cryptography</p>
      </header>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <button 
          onClick={() => setActiveTab('analyzer')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'analyzer' ? 'bg-primary text-black shadow-[0_0_15px_rgba(0,240,255,0.4)] scale-105' : 'bg-black/30 text-secondary hover:text-white border border-white/10 hover:border-primary/50'}`}
        >
          <Activity className="w-5 h-5" /> Intelligence Analyzer
        </button>
        <button 
          onClick={() => setActiveTab('vault')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'vault' ? 'bg-primary text-black shadow-[0_0_15px_rgba(0,240,255,0.4)] scale-105' : 'bg-black/30 text-secondary hover:text-white border border-white/10 hover:border-primary/50'}`}
        >
          <Database className="w-5 h-5" /> Secure Vault
        </button>
        <button 
          onClick={() => setActiveTab('generator')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'generator' ? 'bg-primary text-black shadow-[0_0_15px_rgba(0,240,255,0.4)] scale-105' : 'bg-black/30 text-secondary hover:text-white border border-white/10 hover:border-primary/50'}`}
        >
          <Settings2 className="w-5 h-5" /> Cryptographic Generator
        </button>
      </div>

      {/* Page Content */}
      <div className="animate-fade-in">
        
        {/* PAGE 1: ANALYZER DASHBOARD */}
        {activeTab === 'analyzer' && (
          <div className="space-y-12">
            <div className="max-w-4xl mx-auto mb-8">
              <div className="glass-panel">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-primary justify-center">
                  <Key className="w-6 h-6" /> Target Input
                </h2>
                <div className="relative max-w-2xl mx-auto">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-black/30 border border-white/10 rounded-xl py-4 pl-4 pr-12 text-xl font-mono text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-center"
                    placeholder="Enter payload..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <div className="space-y-8">
                <Analyzer password={password} analysis={analysis} onStoreSecure={handleStoreSecurePassword} />
              </div>
              <div className="space-y-8">
                <BreachChecker password={password} />
                <HashDemo password={password} />
              </div>
            </div>
          </div>
        )}

        {/* PAGE 2: SECURE VAULT */}
        {activeTab === 'vault' && (
          <div className="max-w-4xl mx-auto">
            <Vault initialPassword={vaultInitialPassword} setGlobalError={setGlobalError} />
          </div>
        )}

        {/* PAGE 3: CRYPTO GENERATOR */}
        {activeTab === 'generator' && (
          <div className="max-w-3xl mx-auto">
            <Generator setPassword={handleSetPassword} />
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
