import React from 'react';

interface Category {
  label: string;
  value: number;
}

interface MatchScoreProps {
  score: number;
  categories: Category[];
}

/**
 * MatchScore component for visualizing the 0-100 score.
 * Displays a large donut-style percentage and category breakdowns.
 */
export const MatchScore: React.FC<MatchScoreProps> = ({ score, categories }) => {
  // Determine color based on score
  const getColor = (s: number) => {
    if (s >= 80) return 'text-emerald-600 border-emerald-600';
    if (s >= 50) return 'text-amber-500 border-amber-500';
    return 'text-rose-600 border-rose-600';
  };

  const getBarColor = (s: number) => {
    if (s >= 80) return 'bg-emerald-500';
    if (s >= 50) return 'bg-amber-400';
    return 'bg-rose-500';
  };

  const colorClass = getColor(score);

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl border border-slate-200 shadow-sm w-full max-w-md">
      <h3 className="text-sm font-medium uppercase tracking-wider text-slate-500 mb-6">Overall Match Score</h3>
      
      {/* Donut Chart Visual */}
      <div className={`relative flex items-center justify-center w-40 h-40 rounded-full border-[10px] ${colorClass} transition-all duration-500`}>
        <div className="flex flex-col items-center">
          <span className="text-4xl font-extrabold">{score}%</span>
          <span className="text-[10px] font-semibold uppercase tracking-tight opacity-70">Match</span>
        </div>
      </div>

      <div className="w-full mt-10 space-y-5">
        {categories.map((cat) => (
          <div key={cat.label} className="group">
            <div className="flex justify-between text-xs font-semibold mb-1.5 transition-colors group-hover:text-slate-900">
              <span className="text-slate-500">{cat.label}</span>
              <span className="text-slate-700">{cat.value}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor(cat.value)}`}
                style={{ width: `${cat.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchScore;
