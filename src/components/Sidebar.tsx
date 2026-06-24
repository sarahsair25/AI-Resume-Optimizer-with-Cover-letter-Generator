import React from 'react';

const navItems = [
  { label: 'Dashboard', icon: '🏠', active: true },
  { label: 'My Resumes', icon: '📄', active: false },
  { label: 'Cover Letters', icon: '✉️', active: false },
  { label: 'Job History', icon: '💼', active: false },
  { label: 'Settings', icon: '⚙️', active: false },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 z-20">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white">R</div>
          <span className="text-xl font-extrabold tracking-tight">ResuMatch <span className="text-indigo-400">AI</span></span>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                item.active 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-4">
        <div className="p-4 bg-slate-800 rounded-xl">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Premium Plan</p>
          <p className="text-sm text-slate-300 mb-3">Get unlimited optimizations and priority support.</p>
          <button className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-lg transition-colors">
            Upgrade Now
          </button>
        </div>

        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-lg">👤</div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate">John Doe</p>
            <p className="text-xs text-slate-500 truncate">john@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
