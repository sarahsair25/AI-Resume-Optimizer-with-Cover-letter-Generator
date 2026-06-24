import React from 'react';

/**
 * Hero component for the landing page.
 * Features a strong headline, sub-headline, and primary CTA.
 */
export const Hero: React.FC = () => {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-white">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-1/2 -right-24 w-64 h-64 bg-sky-50 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2"></span>
            AI-Powered Resume Optimization
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
            Land Your Dream Job with <span className="text-indigo-600 relative">
              AI Optimization
              <svg className="absolute -bottom-2 left-0 w-full h-2 text-indigo-200" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-slate-600 mb-12 leading-relaxed max-w-2xl mx-auto">
            Stop guessing what ATS systems want. ResuMatch AI analyzes your resume against any job description and gives you actionable improvements in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
            <button className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white font-bold rounded-xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all duration-200">
              Optimize Your Resume for Free
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:border-indigo-600 hover:text-indigo-600 transition-all duration-200">
              See How It Works
            </button>
          </div>

          <div className="mt-16 flex items-center justify-center gap-8 opacity-50 grayscale">
            <span className="font-bold text-xl text-slate-400">TRUSTED BY 10,000+ JOB SEEKERS</span>
          </div>
        </div>
      </div>
      
      {/* Bottom Grid Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none opacity-40"></div>
    </section>
  );
};

export default Hero;
