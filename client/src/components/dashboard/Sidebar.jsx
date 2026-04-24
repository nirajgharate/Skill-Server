// Sidebar.jsx
const Sidebar = ({ role }) => {
  const menuItems = role === 'user' 
    ? [
        { name: 'Dashboard', icon: LayoutDashboard },
        { name: 'My Bookings', icon: Calendar },
        { name: 'Saved Pros', icon: Users },
        { name: 'Payments', icon: CreditCard },
      ]
    : [
        { name: 'Work Portal', icon: LayoutDashboard },
        { name: 'Job Requests', icon: Bell },
        { name: 'Earnings', icon: IndianRupee },
        { name: 'Reviews', icon: Star },
      ];

  return (
    <aside className="w-80 bg-white border-r border-slate-100 hidden lg:flex flex-col p-10">
      <div className="flex items-center gap-3 mb-16">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
          <Wrench size={20} className="text-white" />
        </div>
        <span className="text-xl font-black text-slate-900 tracking-tight">SkillServer</span>
      </div>
      
      <nav className="flex-1 space-y-2">
        {menuItems.map((item, i) => (
          <button key={i} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${i === 0 ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}>
            <item.icon size={20} />
            {item.name}
          </button>
        ))}
      </nav>

      <button className="flex items-center gap-4 px-6 py-4 text-slate-400 font-bold hover:text-rose-500 transition-colors">
        <LogOut size={20} /> Logout
      </button>
    </aside>
  );
};

const CheckCircle = ({ size, className }) => <CheckCircle size={size} className={className} />;
const Wrench = ({ size, className }) => <Wrench size={size} className={className} />;