import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Plus, Trash2, Globe, User, Lock, Eye, EyeOff } from 'lucide-react';

const Vault = () => {
  const [vaultItems, setVaultItems] = useState([]);
  const [website, setWebsite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showPasswords, setShowPasswords] = useState({});

  const token = sessionStorage.getItem('token');

  const fetchVault = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/vault', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setVaultItems(data);
      }
    } catch (err) {
      console.error('Failed to fetch vault', err);
    }
  };

  useEffect(() => {
    fetchVault();
  }, [token]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!website || !username || !password) {
      setError('All fields are required');
      return;
    }

    try {
      const res = await fetch('/api/vault', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ website, username, password })
      });
      
      if (res.ok) {
        setWebsite('');
        setUsername('');
        setPassword('');
        setIsAdding(false);
        setError('');
        fetchVault();
      } else {
        setError('Failed to add item');
      }
    } catch (err) {
      setError('Server connection error');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/vault/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchVault();
    } catch (err) {
      console.error('Failed to delete item', err);
    }
  };

  const togglePasswordVisibility = (id) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!token) {
    return (
      <div className="glass-panel p-8 text-center">
        <Database className="w-12 h-12 text-secondary mx-auto mb-4 opacity-50" />
        <h2 className="text-xl font-bold text-white mb-2">Secure Vault Offline</h2>
        <p className="text-secondary">Please create an account and log in to use the encrypted password vault.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-8">
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
          <Database className="w-6 h-6" /> Secure Vault
        </h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-primary/20 hover:bg-primary text-primary hover:text-black px-4 py-2 rounded-lg transition-colors font-semibold text-sm"
        >
          {isAdding ? 'Cancel' : <><Plus className="w-4 h-4" /> Add Credential</>}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddItem}
            className="bg-black/30 p-6 rounded-xl border border-primary/20 mb-8 space-y-6 overflow-hidden"
          >
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
                <input 
                  type="text" placeholder="Website / App" 
                  value={website} onChange={(e) => setWebsite(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-white focus:border-primary focus:outline-none"
                />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
                <input 
                  type="text" placeholder="Username / Email" 
                  value={username} onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-white focus:border-primary focus:outline-none"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
                <input 
                  type="text" placeholder="Password" 
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-white focus:border-primary focus:outline-none"
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-primary/20 hover:bg-primary text-primary hover:text-black py-3 rounded-lg transition-colors font-bold mt-2">
              Save Credential
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-5">
        {vaultItems.length === 0 ? (
          <p className="text-secondary text-center py-6">Your vault is empty.</p>
        ) : (
          vaultItems.map(item => (
            <motion.div 
              key={item._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/20 border border-white/5 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-primary/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-white font-semibold mb-1">
                  <Globe className="w-4 h-4 text-primary" />
                  <span className="truncate">{item.website}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-secondary mt-2">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {item.username}</span>
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3" /> 
                    {showPasswords[item._id] ? item.password : '••••••••••••'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => togglePasswordVisibility(item._id)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-secondary hover:text-white transition-colors"
                  title="Toggle Password Visibility"
                >
                  {showPasswords[item._id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => handleDelete(item._id)}
                  className="p-2 bg-red-500/10 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                  title="Delete Credential"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Vault;
