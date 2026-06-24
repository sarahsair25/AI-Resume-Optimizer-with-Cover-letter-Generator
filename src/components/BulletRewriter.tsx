import React, { useState } from 'react';

interface BulletPoint {
  id: string;
  original: string;
  improved?: string;
  why?: string;
  isRewriting: boolean;
}

import { BulletRewrite } from '@/types/api';

interface BulletRewriterProps {
  initialBullets?: string[];
}

export const BulletRewriter: React.FC<BulletRewriterProps> = ({ initialBullets = [] }) => {
  const [bullets, setBullets] = useState<BulletPoint[]>(
    initialBullets.map((b, i) => ({ id: String(i), original: b, isRewriting: false }))
  );

  const handleRewrite = async (id: string, text: string) => {
    setBullets(bullets.map(b => b.id === id ? { ...b, isRewriting: true } : b));
    
    try {
      const resp = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bulletPoints: [text] }),
      });
      
      if (!resp.ok) throw new Error("Rewrite failed");
      const data = await resp.json();
      const rewrite: BulletRewrite = data.rewrites[0];

      setBullets(prev => prev.map(b => b.id === id ? { 
        ...b, 
        improved: rewrite.improved,
        why: rewrite.why,
        isRewriting: false 
      } : b));
    } catch (err) {
      console.error(err);
      setBullets(prev => prev.map(b => b.id === id ? { ...b, isRewriting: false } : b));
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">AI Bullet Point Rewriter</h3>
        <span className="px-3 py-1 bg-indigo-50 rounded-full text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Powered by GPT-4o</span>
      </div>

      <div className="space-y-6">
        {bullets.map((bullet) => (
          <div key={bullet.id} className="p-5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <div className="flex justify-between items-start gap-4 mb-3">
              <p className="text-sm text-slate-600 italic">"{bullet.original}"</p>
              <button 
                onClick={() => handleRewrite(bullet.id, bullet.original)}
                disabled={bullet.isRewriting}
                className="flex-shrink-0 px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {bullet.isRewriting ? 'Rewriting...' : 'Rewrite with AI'}
              </button>
            </div>

            {bullet.improved && (
              <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-lg animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">Improved Version</span>
                  <div className="h-px flex-1 bg-emerald-100"></div>
                </div>
                <p className="text-sm text-slate-900 font-medium leading-relaxed">
                  {bullet.improved}
                </p>
                {bullet.why && (
                  <p className="mt-2 text-xs text-slate-500 italic leading-relaxed">
                    💡 {bullet.why}
                  </p>
                )}
                <div className="mt-3 flex justify-end gap-2">
                  <button className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase transition-colors">Discard</button>
                  <button className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase transition-colors">Copy to Resume</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BulletRewriter;
