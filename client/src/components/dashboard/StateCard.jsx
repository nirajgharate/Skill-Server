// StatCard.jsx
const StatCard = ({ label, value, icon: Icon, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="p-8 bg-white border border-slate-50 rounded-[2.5rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.04)]"
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-slate-50 ${color}`}>
      <Icon size={24} />
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
    <h3 className="text-2xl font-black text-slate-900">{value}</h3>
  </motion.div>
);