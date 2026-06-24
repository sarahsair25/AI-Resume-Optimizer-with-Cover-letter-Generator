import React, { useState } from 'react';

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze?: () => void;
}

export const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ value, onChange, onAnalyze }) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">Target Job Description</h3>
        <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500 uppercase tracking-wider">Required</span>
      </div>
      
      <p className="text-sm text-slate-500 mb-4">
        Paste the job description you're targeting to get a precise match score and optimization suggestions.
      </p>
      
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste job title and description here..."
          className="w-full h-64 p-5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none text-slate-700 placeholder-slate-400"
        />
        
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Words: {value.trim().split(/\s+/).filter(Boolean).length}</span>
        </div>
      </div>
      
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Keywords will be automatically extracted
          </span>
        </div>
        
        <button 
          onClick={onAnalyze}
          disabled={!value.trim()}
          className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {onAnalyze ? 'Analyze Resume' : 'Save Description'}
        </button>
      </div>
    </div>
  );
};

export default JobDescriptionInput;
