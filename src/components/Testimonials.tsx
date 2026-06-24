import React from 'react';

const testimonials = [
  {
    quote: "I was struggling to get past the initial screening for months. After using ResuMatch AI to optimize my bullet points, I landed three interviews in a single week.",
    author: "Sarah J.",
    role: "Software Engineer",
    avatar: "S",
  },
  {
    quote: "The match score is incredibly accurate. It highlighted exactly what was missing from my application. I finally feel confident when I hit 'Apply'.",
    author: "Michael R.",
    role: "Product Manager",
    avatar: "M",
  },
  {
    quote: "The cover letter generator saved me so much time. It feels human and tailored, not like generic template garbage. Highly recommend!",
    author: "Elena G.",
    role: "Marketing Director",
    avatar: "E",
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3">Testimonials</h2>
          <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Success Stories</h3>
          <p className="text-lg text-slate-600">Join thousands of job seekers who have accelerated their career with ResuMatch AI.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="p-8 bg-slate-50 rounded-3xl relative">
              <div className="absolute top-8 left-8 text-indigo-200 opacity-50">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H7.1c.5-2.2 2.4-4 4.9-4V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6.9c.5-2.2 2.4-4 4.9-4V8z" />
                </svg>
              </div>
              <div className="relative z-10">
                <p className="text-slate-700 leading-relaxed mb-8 italic">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{t.author}</h4>
                    <p className="text-sm text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
