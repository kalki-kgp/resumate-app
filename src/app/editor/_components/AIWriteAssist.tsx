'use client';

import { useState, useRef, useCallback } from 'react';
import { Sparkles, SendHorizonal, X, Undo2, Loader2, AlertCircle, Coins } from 'lucide-react';
import Link from 'next/link';
import { ApiError, apiRequest, getStoredAccessToken } from '@/lib/api';
import type { AIWriteResponse } from '@/types';

interface AIWriteAssistProps {
  sectionType: 'summary' | 'experience' | 'project' | 'skills';
  label: string;
  currentValue: string;
  onValueChange: (value: string) => void;
  context?: Record<string, string>;
  children: React.ReactNode;
}

const PLACEHOLDERS: Record<string, string> = {
  summary: 'e.g. Write a compelling summary for a senior engineer',
  experience: 'e.g. Write achievement-focused bullets for this role',
  project: 'e.g. Describe this project highlighting technical depth',
  skills: 'e.g. List relevant skills for a full-stack developer',
};

export const AIWriteAssist = ({
  sectionType,
  label,
  currentValue,
  onValueChange,
  context = {},
  children,
}: AIWriteAssistProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [insufficientCredits, setInsufficientCredits] = useState(false);
  const previousValueRef = useRef<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handleClose = useCallback(() => {
    if (loading) return;
    setIsOpen(false);
    setPrompt('');
  }, [loading]);

  const handleSend = useCallback(async () => {
    if (!prompt.trim() || loading) return;

    const token = getStoredAccessToken();
    if (!token) return;

    previousValueRef.current = currentValue;
    setLoading(true);
    setShowResult(false);

    try {
      const res = await apiRequest<AIWriteResponse>('/api/v1/resumes/ai-write', {
        method: 'POST',
        token,
        body: {
          section_type: sectionType,
          prompt: prompt.trim(),
          current_text: currentValue,
          context,
        },
      });

      onValueChange(res.generated_text);
      setShowResult(true);
      setPrompt('');
      setInsufficientCredits(false);

      setTimeout(() => setShowResult(false), 2000);
    } catch (err) {
      if (err instanceof ApiError && err.status === 402) {
        setInsufficientCredits(true);
      }
    } finally {
      setLoading(false);
    }
  }, [prompt, loading, currentValue, sectionType, context, onValueChange]);

  const handleUndo = useCallback(() => {
    if (previousValueRef.current !== null) {
      onValueChange(previousValueRef.current);
      previousValueRef.current = null;
      setShowResult(false);
    }
  }, [onValueChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
      if (e.key === 'Escape') {
        handleClose();
      }
    },
    [handleSend, handleClose]
  );

  return (
    <div>
      {/* Label row: label text + AI Write button + Undo (all same line) */}
      <div className="flex items-center mb-1.5 ml-1">
        <label className="block text-xs font-bold uppercase text-[#8b7355]">
          {label}
        </label>
        <div className="ml-auto flex items-center gap-1">
          {previousValueRef.current !== null && !loading && (
            <button
              type="button"
              onClick={handleUndo}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium text-[#8b7355] hover:text-[#c96442] hover:bg-[#f4ecdf] transition-colors"
              title="Undo AI change"
            >
              <Undo2 size={10} />
              Undo
            </button>
          )}
          <button
            type="button"
            onClick={isOpen ? handleClose : handleOpen}
            className={`group flex items-center gap-1 px-2 py-0.5 rounded-md transition-all text-[10px] font-semibold ${
              isOpen
                ? 'bg-[#ebe0ff] text-[#7c4dba] border border-[#c4a8e8]'
                : 'bg-gradient-to-r from-[#f3e8ff] to-[#ede4ff] hover:from-[#ebe0ff] hover:to-[#e0d4ff] text-[#7c4dba] hover:text-[#6a3dad] border border-[#d8c8f0] hover:border-[#c4a8e8]'
            }`}
          >
            <Sparkles size={10} className="text-[#9b6dd7]" />
            AI Write
            <span className="flex items-center gap-0.5 text-[9px] opacity-70"><Coins size={8} />5</span>
          </button>
        </div>
      </div>

      {/* Prompt input bar */}
      {isOpen && (
        <div className={`mb-2 rounded-2xl ${loading ? 'ai-neon-border' : ''}`}>
          <div className="flex items-center gap-1.5 rounded-2xl border border-[#eadfce] bg-[#fff8f1] p-1.5">
            <Sparkles size={14} className="text-[#9b6dd7] ml-1.5 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={PLACEHOLDERS[sectionType]}
              disabled={loading}
              className="flex-1 px-2 py-1.5 text-xs bg-transparent text-[#2c1810] placeholder:text-[#c4b29e] focus:outline-none disabled:opacity-50"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!prompt.trim() || loading}
              className="p-1.5 rounded-xl bg-[#7c4dba] hover:bg-[#6a3dad] text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <SendHorizonal size={14} />
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="p-1.5 rounded-xl text-[#b59e86] hover:text-[#c96442] hover:bg-[#f4ecdf] transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Insufficient credits banner */}
      {insufficientCredits && (
        <div className="mb-2 flex items-center gap-2 rounded-xl border border-[#f5c6c6] bg-[#fef2f2] px-3 py-2">
          <AlertCircle size={14} className="text-[#c94242] flex-shrink-0" />
          <p className="flex-1 text-[11px] text-[#c94242]">Not enough credits for AI write.</p>
          <Link href="/pricing" className="text-[11px] font-semibold text-[#c96442] hover:underline flex-shrink-0">
            Buy Credits
          </Link>
        </div>
      )}

      {/* Textarea only — neon result glow wraps just this */}
      <div className={`rounded-2xl ${showResult ? 'ai-result-border' : ''}`}>
        {children}
      </div>
    </div>
  );
};
