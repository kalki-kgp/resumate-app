'use client';

import type { ATSScoreProps } from '@/types';

export const ATSScore = ({ score }: ATSScoreProps) => {
  const r = 30;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;

  const getScoreColor = () => {
    if (score > 80) return 'stroke-green-500';
    if (score > 50) return 'stroke-yellow-500';
    return 'stroke-red-500';
  };

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={r}
          className="stroke-slate-200 dark:stroke-slate-700"
          strokeWidth="6"
          fill="transparent"
        />
        <circle
          cx="40"
          cy="40"
          r={r}
          className={`${getScoreColor()} transition-all duration-1000 ease-out`}
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-bold text-slate-900 dark:text-white">
          {score}
        </span>
        <span className="text-[10px] uppercase text-slate-500 font-semibold">
          ATS
        </span>
      </div>
    </div>
  );
};
