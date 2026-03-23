'use client';

import { useState } from 'react';
import { X, Check, FileText, AlertCircle } from 'lucide-react';
import type { DashboardResume, DashboardSavedResume } from './dashboard-types';
import { formatRelativeTime } from './utils';
import { AuthImage } from './AuthImage';

export interface ResumeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (resumeId: string) => void;
  onSelectSaved?: (savedResumeId: string) => void;
  resumes: DashboardResume[];
  savedResumes?: DashboardSavedResume[];
}

export const ResumeSelectionModal = ({
  isOpen,
  onClose,
  onSelect,
  onSelectSaved,
  resumes,
  savedResumes = [],
}: ResumeSelectionModalProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'uploaded' | 'saved' | null>(null);

  if (!isOpen) return null;

  const handleContinue = () => {
    if (selectedId && selectedType === 'uploaded') {
      onSelect(selectedId);
      onClose();
    } else if (selectedId && selectedType === 'saved' && onSelectSaved) {
      onSelectSaved(selectedId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-4 py-8">
      <button
        type="button"
        className="absolute inset-0 bg-[rgba(27,29,33,0.55)] backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close resume selection modal"
      />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-[24px] border border-[#e4e7eb] bg-white shadow-[0_30px_70px_rgba(20,24,31,0.2)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e4e7eb] px-6 py-4">
          <h2 className="text-lg font-bold text-[#282c36]">Choose a Resume</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-[#8a909b] hover:bg-[#f3f4f6] hover:text-[#282c36] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[400px] overflow-y-auto p-6">
          {resumes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText size={40} className="text-[#ccd0d5] mb-3" />
              <p className="text-sm font-medium text-[#8a909b]">No resumes uploaded yet</p>
              <p className="text-xs text-[#b0b5be] mt-1">Upload and analyze a resume first.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {resumes.map((resume) => {
                const isSelected = selectedId === resume.id;
                const hasAnalysis = !!resume.analysis;
                const atsScore = resume.analysis?.ats_score_estimate;

                return (
                  <button
                    key={resume.id}
                    type="button"
                    onClick={() => {
                      if (hasAnalysis) {
                        setSelectedId(resume.id);
                        setSelectedType('uploaded');
                      }
                    }}
                    disabled={!hasAnalysis}
                    className={`relative flex gap-3 rounded-xl border p-3 text-left transition-all ${
                      isSelected
                        ? 'border-[#ff8b2f] bg-[#fff8f1] shadow-sm'
                        : hasAnalysis
                          ? 'border-[#e4e7eb] bg-white hover:border-[#ccd0d5] hover:shadow-sm'
                          : 'border-[#e4e7eb] bg-[#f9fafb] opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 w-14 h-18 rounded-md overflow-hidden bg-[#f3f4f6] border border-[#e4e7eb]">
                      {resume.thumbnail_url ? (
                        <AuthImage
                          apiPath={resume.thumbnail_url}
                          alt={resume.title}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText size={20} className="text-[#ccd0d5]" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#282c36] truncate">{resume.title}</p>
                      <p className="text-[11px] text-[#8a909b] mt-0.5">{formatRelativeTime(resume.uploaded_at)}</p>
                      {hasAnalysis && atsScore != null ? (
                        <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#eaf8e2] px-2 py-0.5 text-[10px] font-semibold text-[#2d8b46]">
                          ATS {atsScore}%
                        </span>
                      ) : (
                        <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#f3f4f6] px-2 py-0.5 text-[10px] font-medium text-[#8a909b]">
                          <AlertCircle size={10} />
                          Not analyzed
                        </span>
                      )}
                    </div>

                    {/* Selected check */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff8b2f] text-white">
                        <Check size={12} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {savedResumes && savedResumes.length > 0 && (
            <>
              <div className="mt-4 mb-2 flex items-center gap-2">
                <div className="h-px flex-1 bg-[#e4e7eb]" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8a909b]">Saved Resumes</span>
                <div className="h-px flex-1 bg-[#e4e7eb]" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {savedResumes.map((sr) => {
                  const isSelected = selectedId === sr.id && selectedType === 'saved';
                  return (
                    <button
                      key={sr.id}
                      type="button"
                      onClick={() => { setSelectedId(sr.id); setSelectedType('saved'); }}
                      className={`relative flex gap-3 rounded-xl border p-3 text-left transition-all ${
                        isSelected
                          ? 'border-[#ff8b2f] bg-[#fff8f1] shadow-sm'
                          : 'border-[#e4e7eb] bg-white hover:border-[#ccd0d5] hover:shadow-sm'
                      }`}
                    >
                      <div className="flex-shrink-0 w-14 h-18 rounded-md overflow-hidden bg-[#f3f4f6] border border-[#e4e7eb] flex items-center justify-center">
                        <FileText size={20} className="text-[#ff8b2f]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#282c36] truncate">{sr.title}</p>
                        <p className="text-[11px] text-[#8a909b] mt-0.5">{formatRelativeTime(sr.updated_at)}</p>
                        <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#fff1e8] px-2 py-0.5 text-[10px] font-semibold text-[#c96442]">
                          {sr.template} template
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff8b2f] text-white">
                          <Check size={12} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[#e4e7eb] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#e1e4e8] bg-white px-5 py-2 text-sm font-semibold text-[#626a77] hover:bg-[#f8f9fb] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={!selectedId || !selectedType}
            className="rounded-full bg-[#ff8b2f] px-5 py-2 text-sm font-semibold text-white hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
