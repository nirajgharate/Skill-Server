import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LogoutModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Clear the secure session
    localStorage.removeItem('skillUser');
    localStorage.removeItem('skillRole');
    
    // 2. Close modal and redirect to the gateway
    onClose();
    navigate('/');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Layer 1: Atmosphere (The calm backdrop) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-md"
          />

          {/* Layer 2: Orientation & Focus (The Modal) */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="w-full max-w-[400px] bg-white rounded-[2.5rem] p-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border border-slate-100 pointer-events-auto relative"
            >
              
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center space-y-6 pt-4">
                
                {/* Visual Anchor */}
                <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center shadow-inner border border-slate-100">
                  <LogOut className="text-slate-700" size={28} strokeWidth={2.5} />
                </div>

                {/* Typography Hierarchy */}
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Log out of SkillServer?
                  </h2>
                  <p className="text-sm font-medium text-slate-500 max-w-[250px] mx-auto">
                    You can securely sign back in at any time.
                  </p>
                </div>

                {/* Interaction Design: Action Buttons */}
                <div className="w-full grid grid-cols-2 gap-3 pt-2">
                  <motion.button 
                    whileHover={{ y: -1 }} 
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="w-full py-4 bg-slate-50 text-slate-600 text-[11px] font-black uppercase tracking-[0.15em] rounded-2xl hover:bg-slate-100 transition-all border border-slate-200/60"
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ y: -1 }} 
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="w-full py-4 bg-[#0F172A] text-white text-[11px] font-black uppercase tracking-[0.15em] rounded-2xl shadow-xl hover:bg-indigo-600 transition-all"
                  >
                    Log Out
                  </motion.button>
                </div>

              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}