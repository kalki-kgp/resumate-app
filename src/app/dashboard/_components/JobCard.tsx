'use client';

import { memo } from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import type { JobCardProps } from '@/types';

export const JobCard = memo(({ job }: JobCardProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all group cursor-pointer">
      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center text-2xl font-bold text-slate-600 dark:text-slate-400 shrink-0">
        {job.company[0]}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
              {job.title}
            </h3>
            <p className="text-slate-500">
              {job.company} • {job.type}
            </p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-lg text-xs font-bold mb-1">
              <Sparkles size={12} /> {job.match}% Match
            </div>
            <p className="text-xs text-slate-400">{job.posted}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {job.skills.map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-md"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center">
        <button className="p-3 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-colors">
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
});

JobCard.displayName = 'JobCard';
