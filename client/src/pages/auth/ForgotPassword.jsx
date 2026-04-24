import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  KeyRound, Mail, ArrowRight, ArrowLeft, 
  ShieldCheck, CheckCircle2, Lock 
} from 'lucide-react';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');

  // Reusable Input Component for consistent premium styling
  const Input = ({ label, type = "text", placeholder, value, onChange }) => (
    <div className="space-y-1.5 group">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-indigo-600 transition-colors">
        {label}
      </label>
      <input 
        type={type} 
        placeholder={placeholder} 
        value={value}
        onChange={onChange}
        className="w-full px-5 py-4 bg-slate-50 border border-slate-200/60 rounded-2xl outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-900 placeholder:text-slate-300" 
      />
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Layer 1: Atmosphere (Calm lighting) */}
      <div className="absolute top-[10%] right-[20%] w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[20%] w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        
        {/* Layer 2: Orientation (The focused glass card) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white/80 backdrop-blur-xl p-10 md:p-12 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 min-h-[480px] flex flex-col"
        >
          
          {/* Header Animation Area */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-indigo-100/50">
              {step === 4 ? (
                <CheckCircle2 className="text-emerald-500" size={28} />
              ) : (
                <KeyRound className="text-indigo-600" size={28} />
              )}
            </div>
            
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="h1" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Recover Account</h2>
                  <p className="text-sm font-medium text-slate-500 mt-2">Enter your email and we'll send a secure reset link.</p>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="h2" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Verify Identity</h2>
                  <p className="text-sm font-medium text-slate-500 mt-2">We sent a 6-digit code to <span className="font-bold text-slate-700">{email || 'your email'}</span></p>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="h3" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">New Password</h2>
                  <p className="text-sm font-medium text-slate-500 mt-2">Create a strong password to protect your account.</p>
                </motion.div>
              )}
              {step === 4 && (
                <motion.div key="h4" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Account Secured</h2>
                  <p className="text-sm font-medium text-slate-500 mt-2">Your password has been successfully updated.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Form Content Area */}
          <div className="flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: Email Input */}
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <Input 
                    label="Email Address" 
                    type="email" 
                    placeholder="name@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <motion.button onClick={() => setStep(2)} whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="w-full py-5 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 group">
                    Send Reset Code <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </motion.div>
              )}

              {/* STEP 2: OTP Verification */}
              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <input type="text" placeholder="0 0 0 0 0 0" className="w-full py-6 bg-slate-50 border border-slate-200/60 rounded-2xl outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-center text-2xl tracking-[0.5em] font-black text-slate-900 placeholder:text-slate-300" />
                  <motion.button onClick={() => setStep(3)} whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="w-full py-5 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-indigo-600 transition-all">
                    Verify Code
                  </motion.button>
                </motion.div>
              )}

              {/* STEP 3: New Password */}
              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <Input label="New Password" type="password" placeholder="••••••••" />
                  <Input label="Confirm Password" type="password" placeholder="••••••••" />
                  <motion.button onClick={() => setStep(4)} whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="w-full mt-4 py-5 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-2">
                    Update Password <Lock size={14} />
                  </motion.button>
                </motion.div>
              )}

              {/* STEP 4: Success State */}
              {step === 4 && (
                <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
                    <ShieldCheck className="text-emerald-600 mt-0.5" size={20} />
                    <p className="text-sm font-medium text-emerald-800">Your account is now secure. You can use your new password to log in to SkillServer.</p>
                  </div>
                  <motion.button onClick={() => navigate('/login')} whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="w-full py-5 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-200 transition-all">
                    Back to Login
                  </motion.button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Layer 5: Contextual Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center h-10 items-center">
            {step < 4 ? (
              <button 
                onClick={() => step === 1 ? navigate('/login') : setStep(step - 1)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ArrowLeft size={14} /> {step === 1 ? "Return to Login" : "Back"}
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                <Lock size={10} /> 256-bit Encrypted Process
              </div>
            )}
          </div>

        </motion.div>
      </div>
    </div>
  );
}