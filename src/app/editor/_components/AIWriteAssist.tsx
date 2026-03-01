'use client';

import { useState, useRef, useCallback } from 'react';
import { Sparkles, SendHorizonal, X, Undo2, Loader2 } from 'lucide-react';
import { apiRequest, getStoredAccessToken } from '@/lib/api';
import type { AIWriteResponse } from '@/types';

interface AIWriteAssistProps {
  sectionType: 'summary' | 'experience' | 'project' | 'skills';
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
  currentValue,
  onValueChange,
  context = {},
  children,
}: AIWriteAssistProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
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
      setIsOpen(false);

      setTimeout(() => setShowResult(false), 2000);
    } catch {
      // Keep existing text on error
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
    <div className="relative">
      {/* AI trigger button — visible when prompt bar is closed */}
      {!isOpen && (
        <div className="flex items-center gap-1.5 mb-2">
          <button
            type="button"
            onClick={handleOpen}
            className="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#f3e8ff] to-[#ede4ff] hover:from-[#ebe0ff] hover:to-[#e0d4ff] border border-[#d8c8f0] hover:border-[#c4a8e8] transition-all text-xs font-semibold text-[#7c4dba] hover:text-[#6a3dad] shadow-sm hover:shadow"
          >
            <Sparkles size={12} className="text-[#9b6dd7] group-hover:text-[#7c4dba] transition-colors" />
            AI Write
          </button>
          {previousValueRef.current !== null && !loading && (
            <button
              type="button"
              onClick={handleUndo}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-[#8b7355] hover:text-[#c96442] hover:bg-[#f4ecdf] transition-colors"
              title="Undo AI change"
            >
              <Undo2 size={12} />
              Undo
            </button>
          )}
        </div>
      )}

      {/* Prompt input bar — replaces the trigger button */}
      {isOpen && (
        <div className={`mb-2 rounded-xl overflow-hidden ${loading ? 'ai-neon-border' : ''}`}>
          <div className="flex items-center gap-1.5 bg-[#1a1a2e] rounded-xl p-1.5">
            <Sparkles size={14} className="text-[#a78bfa] ml-1.5 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={PLACEHOLDERS[sectionType]}
              disabled={loading}
              className="flex-1 px-2 py-1.5 text-xs bg-transparent text-[#e2e0ff] placeholder:text-[#5a5680] focus:outline-none disabled:opacity-50"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!prompt.trim() || loading}
              className="p-1.5 rounded-lg bg-[#7c4dba] hover:bg-[#6a3dad] text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
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
              className="p-1.5 rounded-lg text-[#6b6894] hover:text-[#e2e0ff] hover:bg-[#2a2a4a] transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Wrapped textarea with success glow */}
      <div className={`rounded-2xl ${showResult ? 'ai-result-border' : ''}`}>
        {children}
      </div>
    </div>
  );
};
