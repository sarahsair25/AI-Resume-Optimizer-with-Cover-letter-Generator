import React from 'react';

const steps = [
  {
    number: '01',
    title: 'Upload Your Resume',
    description: 'Drop your PDF or Word document into our secure analyzer. We support all standard formats.',
  },
  {
    number: '02',
    title: 'Paste Job Description',
    description: 'Copy and paste the job you are targeting. Our AI identifies the specific skills they want.',
  },
  {
    number: '03',
    title: 'Get Your Score',
    description: 'See exactly how you rank against the ATS and get a detailed breakdown of keyword gaps.',
  },
  {
    number: '04',
    title: 'Optimize & Apply',
    description: 'Use AI-powered bullet rewrites to boost your impact and download your optimized resume.',
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3">Simple Process</h2>
          <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">How it works</h3>
          <p className="text-lg text-slate-600">Get your resume optimized in four easy steps and start landing more interviews.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((step, index) => (
            <div key={step.title} className="relative group">
              {/* Connector line (desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-px bg-slate-100 -z-10 -translate-x-12"></div>
              )}
              
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 text-2xl font-bold transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-indigo-200">
                {step.number}
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h4>
              <p className="text-slate-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
