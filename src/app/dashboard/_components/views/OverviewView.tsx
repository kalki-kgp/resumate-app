'use client';

import { Upload, Plus, Shield, TrendingUp, Briefcase, Loader } from 'lucide-react';
import { ResumeCard } from '../ResumeCard';
import type { Resume } from '@/types';

interface OverviewViewProps {
  resumes: Resume[];
  loading: boolean;
  onExtractOpen: () => void;
  onCreateNew: () => void;
  onDeleteResume: (id: string) => void;
  onEditResume: (id: string) => void;
}

export const OverviewView = ({
  resumes,
  loading,
  onExtractOpen,
  onCreateNew,
  onDeleteResume,
  onEditResume,
}: OverviewViewProps) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 md:p-12 text-white shadow-2xl overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready for your next big role?
          </h2>
          <p className="text-blue-100 max-w-xl mb-8 text-lg">
            Your profile matches 12 new high-paying jobs this week. Update your
            resume to increase visibility.
          </p>
          <div className="flex gap-4">
            <button
              onClick={onExtractOpen}
              className="flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg"
            >
              <Upload size={20} /> Extract Content
            </button>
            <button
              onClick={onCreateNew}
              className="flex items-center gap-2 bg-blue-500/30 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-500/50 backdrop-blur-sm transition-colors border border-white/20"
            >
              <Plus size={20} /> Create Blank
            </button>
          </div>
        </div>
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-20 w-64 h-64 bg-purple-500 opacity-20 rounded-full blur-3xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400">
            <Shield size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Avg. ATS Score</p>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
              78/100
            </h4>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Profile Views</p>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
              1,240
            </h4>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Applications</p>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
              12 Pending
            </h4>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Recent Documents
        </h3>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader className="animate-spin text-slate-400" />
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl">
            <p className="text-slate-500 mb-4">No resumes found.</p>
            <button
              onClick={onCreateNew}
              className="text-blue-600 font-bold hover:underline"
            >
              Create your first resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.slice(0, 3).map((r) => (
              <ResumeCard
                key={r.id}
                resume={r}
                onDelete={onDeleteResume}
                onEdit={onEditResume}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
