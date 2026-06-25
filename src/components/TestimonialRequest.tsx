import React, { useState } from 'react';
import { Star, Send, X } from 'lucide-react';

export default function TestimonialRequest() {
  const [isOpen, setIsOpen] = useState(true);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl shadow-sm animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
              <Star className="fill-current" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Thank you for your feedback!</h3>
              <p className="text-sm text-slate-600">Your success story helps us improve ResuMatch AI for everyone.</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm relative group">
      <button 
        onClick={() => setIsOpen(false)} 
        className="absolute top-4 right-4 text-slate-300 hover:text-slate-500 transition-colors opacity-0 group-hover:opacity-100"
      >
        <X size={18} />
      </button>

      <div className="flex gap-4 items-start mb-4">
        <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
          <Star size={20} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">Landing interviews?</h3>
          <p className="text-sm text-slate-600">We'd love to hear how ResuMatch AI is helping your job search.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <button 
              key={s} 
              onClick={() => setRating(s)}
              className={`transition-all ${rating >= s ? 'text-amber-400' : 'text-slate-200 hover:text-amber-200'}`}
            >
              <Star className={rating >= s ? 'fill-current' : ''} size={24} />
            </button>
          ))}
        </div>

        {rating > 0 && (
          <div className="animate-in slide-in-from-top-2 duration-300">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your experience (optional)..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-24"
            />
            <button 
              onClick={() => setSubmitted(true)}
              className="mt-2 w-full py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              <Send size={16} />
              Submit Feedback
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
