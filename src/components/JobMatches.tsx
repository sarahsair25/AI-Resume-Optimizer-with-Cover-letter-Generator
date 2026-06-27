import React from 'react';
import { Briefcase, MapPin, Star, ChevronRight, CheckCircle2 } from 'lucide-react';

interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  matchScore: number;
  highlights: string[];
}

const MOCK_JOBS: JobMatch[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: 'TechFlow Systems',
    location: 'Remote',
    type: 'Full-time',
    matchScore: 94,
    highlights: ['Expertise in React & Tailwind', 'Strong experience with Next.js', 'Background in SaaS products'],
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    company: 'DataScale AI',
    location: 'San Francisco, CA',
    type: 'Full-time',
    matchScore: 88,
    highlights: ['Proficient in TypeScript', 'Experience with Node.js & PostgreSQL', 'Previous AI project involvement'],
  },
  {
    id: '3',
    title: 'Product Engineer',
    company: 'BrightPath Inc.',
    location: 'Austin, TX (Hybrid)',
    type: 'Full-time',
    matchScore: 76,
    highlights: ['User-centric mindset', 'Proficiency in frontend performance'],
  },
];

export default function JobMatches() {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 border-emerald-100 bg-emerald-50';
    if (score >= 70) return 'text-amber-600 border-amber-100 bg-amber-50';
    return 'text-rose-600 border-rose-100 bg-rose-50';
  };

  const getScoreRingColor = (score: number) => {
    if (score >= 85) return 'stroke-emerald-500';
    if (score >= 70) return 'stroke-amber-500';
    return 'stroke-rose-500';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Recommended Jobs</h2>
          <p className="text-slate-500 text-sm">Based on your optimized resume profile</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full border border-indigo-100">
            {MOCK_JOBS.length} Matches Found
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        {MOCK_JOBS.map((job) => (
          <div 
            key={job.id} 
            className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all group"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                      <p className="text-slate-600 font-medium">{job.company}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                    <MapPin size={16} />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                    {job.type}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Why you match</p>
                  <div className="flex flex-wrap gap-2">
                    {job.highlights.map((highlight, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-slate-700 text-xs rounded-lg border border-slate-100 font-medium"
                      >
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:w-48 flex flex-col items-center justify-between border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-6">
                <div className="relative w-24 h-24 mb-4">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      className="stroke-slate-100 fill-none"
                      strokeWidth="3"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={`fill-none transition-all duration-1000 ease-out ${getScoreRingColor(job.matchScore)}`}
                      strokeWidth="3"
                      strokeDasharray={`${job.matchScore}, 100`}
                      strokeLinecap="round"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-xl font-extrabold ${getScoreColor(job.matchScore).split(' ')[0]}`}>
                      {job.matchScore}%
                    </span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase">Match</span>
                  </div>
                </div>

                <button className="w-full py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 active:scale-95">
                  Quick Apply
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-2">Want more tailored matches?</h3>
          <p className="text-indigo-100 text-sm mb-6 max-w-md">Upgrade to Premium to unlock daily job alerts and priority matching with our hiring partners.</p>
          <button className="px-6 py-3 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-950/20 active:scale-95">
            Upgrade to Premium
          </button>
        </div>
        {/* Decorative background circle */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl" />
      </div>
    </div>
  );
}
