"use client";

import React, { useState, useEffect } from 'react';
import { Share2, Copy, Check, X, Gift, Send, User, Mail } from 'lucide-react';
import { captureEvent } from '@/lib/analytics';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode?: string;
}

export default function ReferralModal({ isOpen, onClose, referralCode = "RESUMATCH-55" }: ReferralModalProps) {
  const [copied, setCopied] = useState(false);
  const referralLink = `https://resumatch-ai.com/signup?ref=${referralCode}`;

  useEffect(() => {
    if (isOpen) {
      captureEvent('referral_modal_opened');
    }
  }, [isOpen]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    captureEvent('referral_link_copied', { referralCode });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    captureEvent('referral_share_clicked', { platform, referralCode });
    // In a real app, these would open share dialogs
    console.log(`Sharing on ${platform}`);
  };

  const handleClose = () => {
    captureEvent('referral_modal_closed');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all z-10"
        >
          <X size={20} />
        </button>

        {/* Header/Banner Area */}
        <div className="bg-indigo-600 p-8 text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
              <Gift className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Share the Career Boost!</h2>
            <p className="text-indigo-100 text-sm">Give your friends 5 free credits, and you'll get 5 too.</p>
          </div>
          
          {/* Decorative shapes */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-indigo-400/20 rounded-full blur-xl" />
        </div>

        {/* Content Area */}
        <div className="p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Your Referral Link</label>
              <div className="flex gap-2">
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-600 text-sm font-medium truncate">
                  {referralLink}
                </div>
                <button 
                  onClick={copyToClipboard}
                  className={`px-6 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${copied ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => handleShare('Twitter')}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
              >
                <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform">
                  <Send size={20} fill="currentColor" />
                </div>
                <span className="text-xs font-bold text-slate-600">Twitter</span>
              </button>
              <button 
                onClick={() => handleShare('LinkedIn')}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 group-hover:scale-110 transition-transform">
                  <User size={20} fill="currentColor" />
                </div>
                <span className="text-xs font-bold text-slate-600">LinkedIn</span>
              </button>
              <button 
                onClick={() => handleShare('Email')}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
              >
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 group-hover:scale-110 transition-transform">
                  <Mail size={20} />
                </div>
                <span className="text-xs font-bold text-slate-600">Email</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <Share2 size={16} />
                  <span>Total Friends Referred:</span>
                </div>
                <span className="font-bold text-slate-900">0</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <div className="flex items-center gap-2 text-slate-500">
                  <Gift size={16} />
                  <span>Credits Earned:</span>
                </div>
                <span className="font-bold text-emerald-600">0 Credits</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-6 text-center">
          <p className="text-xs text-slate-400">
            Terms apply. Credits are added after your friend completes their first analysis.
          </p>
        </div>
      </div>
    </div>
  );
}
