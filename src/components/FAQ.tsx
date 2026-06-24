"use client";

import React, { useState } from 'react';

const faqs = [
  {
    question: "How does the AI optimize my resume?",
    answer: "Our AI analyzes your resume against the specific job description you provide. It identifies missing keywords, assesses the impact of your bullet points, and suggests specific rewrites that highlight your achievements using industry-standard action verbs and metrics.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes. We take privacy seriously. Your uploaded resumes are encrypted and stored securely. We do not sell your data to third parties, and you can delete your data at any time.",
  },
  {
    question: "Will this actually help me get past an ATS?",
    answer: "Absolutely. Most ATS (Applicant Tracking Systems) rank candidates based on keyword relevance. By identifying exactly which keywords are missing from your resume and helping you integrate them naturally, ResuMatch AI significantly increases your visibility to recruiters.",
  },
  {
    question: "Can I use ResuMatch AI for different industries?",
    answer: "Yes, our AI is trained on millions of data points across tech, finance, healthcare, marketing, and more. It understands the specific terminology and requirements of various sectors.",
  },
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3">Questions?</h2>
          <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h3>
          <p className="text-lg text-slate-600">Everything you need to know about the product and how it works.</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-bold text-slate-900">{faq.question}</span>
                <span className={`transform transition-transform duration-200 ${openIndex === i ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              {openIndex === i && (
                <div className="p-6 pt-0 text-slate-600 leading-relaxed bg-slate-50/50">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
