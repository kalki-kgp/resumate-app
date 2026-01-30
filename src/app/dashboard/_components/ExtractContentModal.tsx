'use client';

import { useState } from 'react';
import { X, Upload, Sparkles, CheckCircle } from 'lucide-react';
import type { ExtractContentModalProps } from '@/types';

type Step = 'upload' | 'processing' | 'complete';

export const ExtractContentModal = ({
  isOpen,
  onClose,
  onComplete,
}: ExtractContentModalProps) => {
  const [step, setStep] = useState<Step>('upload');
  const [progress, setProgress] = useState(0);

  // Reset state when modal closes
  const handleClose = () => {
    setStep('upload');
    setProgress(0);
    onClose();
  };

  const handleSimulateUpload = () => {
    setStep('processing');
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15;
      if (p > 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
          onClose();
        }, 800);
      }
      setProgress(p);
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-white/20 animate-fade-in-up">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Extract Resume Content
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Upload your existing resume. Our AI will analyze skills, work history,
          and formatting scores.
        </p>

        {step === 'upload' && (
          <div
            onClick={handleSimulateUpload}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl p-12 flex flex-col items-center cursor-pointer transition-all group"
          >
            <div className="w-16 h-16 bg-blue-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="text-blue-600 dark:text-blue-400" size={32} />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Click to Upload PDF/DOCX
            </h3>
            <p className="text-sm text-slate-500 mt-2">Max file size 10MB</p>
          </div>
        )}

        {step === 'processing' && (
          <div className="py-12 flex flex-col items-center">
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 mb-4 overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold animate-pulse">
              <Sparkles size={18} />
              <span>AI Analyzing Content... {Math.round(progress)}%</span>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li
                className={`flex items-center gap-2 ${
                  progress > 30 ? 'text-green-500' : ''
                }`}
              >
                <CheckCircle size={14} /> Extracting Contact Info
              </li>
              <li
                className={`flex items-center gap-2 ${
                  progress > 60 ? 'text-green-500' : ''
                }`}
              >
                <CheckCircle size={14} /> Parsing Work History
              </li>
              <li
                className={`flex items-center gap-2 ${
                  progress > 90 ? 'text-green-500' : ''
                }`}
              >
                <CheckCircle size={14} /> Calculating ATS Score
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
