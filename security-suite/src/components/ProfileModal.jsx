import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserCircle, LogOut, LogIn } from 'lucide-react';

const ProfileModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Check if they logged in using the original HTML pages (stored in sessionStorage)
  const username = sessionStorage.getItem('loggedInUser');

  const handleAuthAction = () => {
    if (username) {
      sessionStorage.removeItem('loggedInUser');
      sessionStorage.removeItem('token');
      window.location.reload(); // Refresh to show auth page
    } else {
      sessionStorage.removeItem('guestMode');
      window.location.reload(); // Refresh to show auth page
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#0f111a] border border-primary/30 shadow-[0_0_30px_rgba(0,240,255,0.15)] rounded-2xl p-8 max-w-md w-full relative"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-secondary hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 text-primary mb-4 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <UserCircle className="w-16 h-16" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-2">
              {username ? `@${username}` : 'Guest User'}
            </h2>
            
            <div className="flex justify-center gap-4 mt-6">
              <div className="bg-black/40 border border-white/5 rounded-lg p-3 text-center w-1/2">
                <div className="text-secondary text-xs uppercase tracking-wider mb-1">Status</div>
                <div className="text-primary font-mono font-bold">Active</div>
              </div>
              <div className="bg-black/40 border border-white/5 rounded-lg p-3 text-center w-1/2">
                <div className="text-secondary text-xs uppercase tracking-wider mb-1">Auth Type</div>
                <div className="text-primary font-mono font-bold">{username ? 'Local' : 'Anonymous'}</div>
              </div>
            </div>

            <button 
              onClick={handleAuthAction}
              className="mt-8 w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-gray-300 hover:text-white"
            >
              {username ? (
                <>
                  <LogOut className="w-5 h-5" /> Logout
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" /> Login / Register
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProfileModal;
