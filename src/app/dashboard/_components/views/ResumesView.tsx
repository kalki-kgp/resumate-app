'use client';

import { Plus, Upload, Loader } from 'lucide-react';
import { ResumeCard } from '../ResumeCard';
import type { Resume } from '@/types';

interface ResumesViewProps {
  resumes: Resume[];
  loading: boolean;
  onExtractOpen: () => void;
  onCreateNew: () => void;
  onDeleteResume: (id: string) => void;
  onEditResume: (id: string) => void;
}

export const ResumesView = ({
  resumes,
  loading,
  onExtractOpen,
  onCreateNew,
  onDeleteResume,
  onEditResume,
}: ResumesViewProps) => {
  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
            My Resumes
          </h2>
          <p className="text-slate-500">Manage your documents and ATS scores.</p>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg"
        >
          <Plus size={20} /> Create New
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Upload Card */}
          <div
            onClick={onExtractOpen}
            className="bg-slate-100 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center p-8 cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group min-h-[250px]"
          >
            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full shadow-sm flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
              <Upload size={32} />
            </div>
            <h3 className="font-bold text-slate-700 dark:text-slate-200">
              Import Resume
            </h3>
            <p className="text-xs text-slate-500 text-center mt-2 px-4">
              Upload PDF/DOCX to extract content with AI
            </p>
          </div>

          {resumes.map((r) => (
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
  );
};
