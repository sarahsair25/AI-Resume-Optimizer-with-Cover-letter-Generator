"use client";

import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Target,
  AlertTriangle,
  Zap,
  FileText,
  Layers,
  CreditCard,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import { analytics } from '@/lib/analytics';

// Mock data simulating what the extension would detect from a job board page
const MOCK_JOB_DATA = {
  title: "Senior Frontend Engineer",
  company: "TechCorp Inc.",
  score: 72,
  matchedKeywords: ["React", "TypeScript", "CSS", "REST APIs", "Git"],
  missingKeywords: ["GraphQL", "Kubernetes", "Playwright", "Webpack", "CI/CD"],
  creditsRemaining: 8,
  plan: "Premium" as const,
};

interface BrowserExtensionProps {
  /** Override mock job data for demo/testing */
  jobData?: {
    title: string;
    company: string;
    score: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    creditsRemaining: number;
    plan: "Premium" | "Free" | "Starter";
  };
}

export const BrowserExtension: React.FC<BrowserExtensionProps> = ({
  jobData = MOCK_JOB_DATA,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Track opening events
  useEffect(() => {
    if (isOpen) {
      analytics.capture('extension_opened', {
        jobTitle: jobData.title,
        jobCompany: jobData.company,
        score: jobData.score
      });
    }
  }, [isOpen, jobData]);

  const getScoreRingColor = (score: number): string => {
    if (score >= 80) return 'stroke-emerald-500';
    if (score >= 50) return 'stroke-amber-400';
    return 'stroke-rose-500';
  };

  const getScoreTextColor = (score: number): string => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 50) return 'text-amber-500';
    return 'text-rose-600';
  };

  const isPremium = jobData.plan === "Premium";

  return (
    <>
      {/* Floating Action Button (FAB) - bottom-right corner */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-indigo-600 text-white rounded-2xl shadow-2xl hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center group"
        aria-label="Toggle ResuMatch AI extension"
      >
        <Sparkles
          size={24}
          className="group-hover:rotate-12 transition-transform duration-300"
        />
        {/* Live indicator pulsing dot */}
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
      </button>

      {/* Sidebar Overlay (click outside to close) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-transparent"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel - 320px width, slides from right */}
      <div
        className={`fixed top-0 right-0 z-40 h-full bg-white border-l border-slate-200 shadow-2xl transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: '320px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Brand bar */}
        <div className="h-16 bg-indigo-600 px-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-sm">ResuMatch AI</span>
              <p className="text-[10px] text-indigo-200 font-medium">Browser Extension</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 hover:bg-indigo-500 rounded-lg transition-colors text-indigo-200 hover:text-white"
              aria-label={isMinimized ? "Expand panel" : "Minimize panel"}
            >
              <ChevronDown
                size={18}
                className={`transition-transform duration-200 ${
                  isMinimized ? 'rotate-180' : ''
                }`}
              />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-indigo-500 rounded-lg transition-colors text-indigo-200 hover:text-white"
              aria-label="Close extension"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable content area */}
        <div
          className={`overflow-y-auto transition-all duration-200 ${
            isMinimized ? 'max-h-0 opacity-0' : 'max-h-[calc(100%-4rem)] opacity-100'
          }`}
        >
          {/* Detected Job Banner */}
          <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                Page Detected
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900 truncate">
              {jobData.title}
            </p>
            <p className="text-xs text-slate-500 font-medium">{jobData.company}</p>
          </div>

          <div className="p-5 space-y-5">
            {/* Contextual Match Score */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Target size={16} className="text-indigo-500" />
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Match Score
                </h3>
              </div>
              <div className="flex items-center gap-5">
                {/* Circular score indicator */}
                <div className="relative w-20 h-20 flex-shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    {/* Background ring */}
                    <path
                      className="stroke-slate-100 fill-none"
                      strokeWidth="3"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Score ring */}
                    <path
                      className={`fill-none transition-all duration-1000 ease-out ${getScoreRingColor(jobData.score)}`}
                      strokeWidth="3"
                      strokeDasharray={`${jobData.score}, 100`}
                      strokeLinecap="round"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className={`text-lg font-extrabold ${getScoreTextColor(jobData.score)}`}
                    >
                      {jobData.score}%
                    </span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                      Match
                    </span>
                  </div>
                </div>
                {/* Score breakdown text */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Your resume covers{' '}
                    <span className="font-bold text-slate-900">
                      {jobData.matchedKeywords.length}
                    </span>{' '}
                    of{' '}
                    <span className="font-bold text-slate-900">
                      {jobData.matchedKeywords.length + jobData.missingKeywords.length}
                    </span>{' '}
                    key requirements.
                  </p>
                  <p className="text-[11px] font-semibold text-amber-500 mt-1.5 flex items-center gap-1">
                    <AlertTriangle size={12} />
                    {jobData.missingKeywords.length} keyword{jobData.missingKeywords.length !== 1 ? 's' : ''} missing
                  </p>
                </div>
              </div>
            </div>

            {/* Real-time Keyword Tracker */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Layers size={16} className="text-rose-500" />
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Keywords to Add
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {jobData.missingKeywords.length > 0 ? (
                  jobData.missingKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="px-2.5 py-1 bg-rose-50 text-rose-700 text-[11px] rounded-md border border-rose-100 font-semibold"
                    >
                      + {kw}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    ✓ All keywords covered!
                  </span>
                )}
              </div>
              {jobData.missingKeywords.length > 0 && (
                <p className="text-[10px] text-slate-400 mt-3 leading-relaxed">
                  Adding these keywords could boost your match score by an estimated{' '}
                  <span className="font-semibold text-slate-600">15–20%</span>.
                </p>
              )}
            </div>

            {/* Action CTAs */}
            <div className="space-y-2.5">
              <button 
                onClick={() => analytics.capture('extension_tailor_clicked')}
                className="w-full py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Zap size={16} />
                Tailor Resume for this Job
              </button>
              <button 
                onClick={() => analytics.capture('extension_cover_letter_clicked')}
                className="w-full py-3 bg-white text-indigo-600 text-sm font-bold rounded-xl border border-indigo-200 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <FileText size={16} />
                Generate Cover Letter
              </button>
            </div>

            {/* Status Indicator */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard size={14} className="text-slate-400" />
                  <span className="text-xs font-medium text-slate-500">
                    Credits
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-900">
                  {isPremium ? (
                    <span className="flex items-center gap-1 text-emerald-600">
                      <Zap size={14} className="fill-emerald-500" />
                      Unlimited
                    </span>
                  ) : (
                    <>{jobData.creditsRemaining} remaining</>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-indigo-400" />
                  <span className="text-xs font-medium text-slate-500">
                    Plan
                  </span>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                    isPremium
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {jobData.plan}
                </span>
              </div>
            </div>

            {/* Upgrade prompt for non-premium users */}
            {!isPremium && (
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-5 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="text-sm font-bold mb-1">Unlock Unlimited Power</h4>
                  <p className="text-xs text-indigo-200 mb-4 leading-relaxed">
                    Get unlimited analyses, priority support, and real-time job matching.
                  </p>
                  <button 
                    onClick={() => analytics.capture('extension_upgrade_clicked')}
                    className="px-5 py-2.5 bg-white text-indigo-700 text-sm font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-lg active:scale-[0.98]"
                  >
                    Upgrade to Premium — $19/mo
                  </button>
                </div>
                {/* Decorative blur elements */}
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-indigo-400/20 rounded-full blur-2xl" />
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-white/5 rounded-full blur-xl" />
              </div>
            )}

            {/* Link to dashboard */}
            <a
              href="/dashboard"
              onClick={() => analytics.capture('extension_dashboard_link_clicked')}
              className="flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-indigo-600 font-medium transition-colors py-1"
            >
              View full analysis in Dashboard
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default BrowserExtension;