import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ReferralModal from './ReferralModal';

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, pageTitle }) => {
  const [isReferralOpen, setIsReferralOpen] = useState(false);

  useEffect(() => {
    const handleOpenReferral = () => setIsReferralOpen(true);
    window.addEventListener('open-referral-modal', handleOpenReferral);
    return () => window.removeEventListener('open-referral-modal', handleOpenReferral);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar onReferClick={() => setIsReferralOpen(true)} />
      
      <main className="pl-64">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-900">{pageTitle}</h1>
          
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-colors text-slate-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="w-px h-6 bg-slate-200 mx-2"></div>
            <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors">
              New Analysis
            </button>
          </div>
        </header>
        
        <div className="p-10">
          {children}
        </div>
      </main>

      <ReferralModal isOpen={isReferralOpen} onClose={() => setIsReferralOpen(false)} />
    </div>
  );
};

export default DashboardLayout;
