import React from 'react';
import { motion } from 'framer-motion';
import { User, Hammer } from 'lucide-react';

export default function RoleSelector({ role, setRole }) {
  const options = [
    { id: 'user', label: 'User', icon: User },
    { id: 'worker', label: 'Worker', icon: Hammer },
  ];

  return (
    <div className="relative p-1.5 bg-slate-100/50 backdrop-blur-sm rounded-full border border-slate-200/50 flex items-center w-full max-w-[320px] mx-auto mb-10">
      {options.map((option) => {
        const isActive = role === option.id;
        return (
          <button
            key={option.id}
            onClick={() => setRole(option.id)}
            className="relative flex-1 flex items-center justify-center gap-2 py-3.5 z-10 transition-colors duration-300"
          >
            {/* The Text/Icon */}
            <span className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
              <option.icon size={14} strokeWidth={isActive ? 3 : 2} />
              {option.label}
            </span>

            {/* THE SLIDING PILL */}
            {isActive && (
              <motion.div
                layoutId="activePill"
                className="absolute inset-0 bg-white rounded-full shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_4px_10px_-3px_rgba(0,0,0,0.02)] border border-slate-100"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}