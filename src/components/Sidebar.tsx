import React from "react";
import Link from "next/link";
import { captureEvent } from "@/lib/analytics";

const navItems = [
  { label: "Dashboard", icon: "🏠", href: "/dashboard" },
  { label: "Analysis History", icon: "📋", href: "/history" },
  { label: "Cover Letters", icon: "✉️", href: "/history#cover-letters" },
  { label: "Settings", icon: "⚙️", href: "/dashboard/settings" },
];

interface SidebarProps {
  onReferClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onReferClick }) => {
  const handleReferClick = () => {
    captureEvent('sidebar_refer_clicked');
    onReferClick?.();
  };

  return (
    <aside className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 z-20">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white">
            R
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            ResuMatch <span className="text-indigo-400">AI</span>
          </span>
        </Link>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-slate-400 hover:bg-slate-800 hover:text-white"
              onClick={() => captureEvent('nav_item_clicked', { label: item.label })}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
          <button
            onClick={handleReferClick}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-slate-400 hover:bg-slate-800 hover:text-white text-left"
          >
            <span className="text-lg">🎁</span>
            <span className="font-medium">Refer & Earn</span>
          </button>
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-4">
        <div className="p-4 bg-slate-800 rounded-xl">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
            Free Plan
          </p>
          <p className="text-sm text-slate-300 mb-3">
            Upgrade for unlimited optimizations.
          </p>
          <Link
            href="/pricing"
            className="block w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-lg transition-colors text-center"
            onClick={() => captureEvent('upgrade_clicked', { source: 'sidebar' })}
          >
            Upgrade Now
          </Link>
        </div>

        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-lg">
            👤
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate">Signed in</p>
            <Link
              href="/sign-out"
              className="text-xs text-slate-500 hover:text-white transition-colors"
            >
              Sign out
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;