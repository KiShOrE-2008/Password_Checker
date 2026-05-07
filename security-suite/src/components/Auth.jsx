import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, UserPlus, LogIn, Mail, Lock, User, ArrowRight } from 'lucide-react';

const Auth = ({ onLogin, onContinueAsGuest }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password || (!isLogin && !confirmPassword)) {
      setError('Please fill in all fields');
      return;
    }

    if (!isLogin) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }
      if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        setError('Password must contain an uppercase letter, lowercase letter, number, and special character');
        return;
      }
    }

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Authentication failed');
        return;
      }
      
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('loggedInUser', data.username);
      onLogin(data.username);
    } catch (err) {
      setError('Failed to connect to the server. Ensure the backend is running on port 5000.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark text-white p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold glow-text">Vanguard Security</h1>
          <p className="text-secondary mt-2">Sign in to access the Intelligence Suite</p>
        </div>

        <div className="glass-panel p-8">
          <div className="flex gap-4 mb-6">
            <button 
              className={`flex-1 pb-2 border-b-2 font-semibold transition-colors ${isLogin ? 'border-primary text-primary' : 'border-white/10 text-secondary hover:text-white'}`}
              onClick={() => { setIsLogin(true); setError(''); }}
            >
              Login
            </button>
            <button 
              className={`flex-1 pb-2 border-b-2 font-semibold transition-colors ${!isLogin ? 'border-primary text-primary' : 'border-white/10 text-secondary hover:text-white'}`}
              onClick={() => { setIsLogin(false); setError(''); }}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-veryWeak/10 border border-veryWeak/30 text-veryWeak p-3 rounded-lg text-sm text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />
              <input 
                type="text" 
                placeholder="Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            <AnimatePresence>
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative overflow-hidden"
                >
                  <div className="pt-4">
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />
                      <input 
                        type="password" 
                        placeholder="Confirm Password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit"
              className="w-full py-3 bg-primary text-black hover:bg-[#5ffff0] rounded-xl font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2 mt-4"
            >
              {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
              {isLogin ? 'Authenticate' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/10 pt-6">
            <button 
              onClick={onContinueAsGuest}
              className="text-secondary hover:text-primary transition-colors text-sm flex items-center justify-center gap-2 mx-auto group"
            >
              Skip & Continue as Guest
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
