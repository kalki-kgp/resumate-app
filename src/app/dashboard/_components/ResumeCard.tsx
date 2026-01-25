'use client';

import { FileText, Trash2 } from 'lucide-react';
import type { ResumeCardProps } from '@/types';

export const ResumeCard = ({ resume, onDelete, onEdit }: ResumeCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
          <FileText size={24} />
        </div>
        <div className="relative z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(resume.id);
            }}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 truncate">
        {resume.title}
      </h3>
      <p className="text-sm text-slate-500 mb-6">Last edited: {resume.updatedAt}</p>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-400">
            ATS Score
          </span>
          <span className={`text-lg font-bold ${getScoreColor(resume.atsScore)}`}>
            {resume.atsScore}/100
          </span>
        </div>
        <button
          onClick={() => onEdit(resume.id)}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold transition-colors"
        >
          Edit
        </button>
      </div>
    </div>
  );
};
