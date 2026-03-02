'use client';

import { useState, useRef, useCallback } from 'react';
import { Sparkles, SendHorizonal, X, Undo2, Loader2 } from 'lucide-react';
import { apiRequest, getStoredAccessToken } from '@/lib/api';
import type { RefineParagraphResponse } from '@/types';

interface ParagraphRefineAssistProps {
  paragraphType: 'opening' | 'body' | 'closing';
  text: string;
  onChange: (value: string) => void;
  context?: Record<string, string>;
}

export const ParagraphRefineAssist = ({
  paragraphType,
  text,
  onChange,
  context = {},
}: ParagraphRefineAssistProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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

    previousValueRef.current = text;
    setLoading(true);

    try {
      const res = await apiRequest<RefineParagraphResponse>(
        '/api/v1/cover-letter/refine-paragraph',
        {
          method: 'POST',
          token,
          body: {
            paragraph_text: text,
            paragraph_type: paragraphType,
            prompt: prompt.trim(),
            context,
          },
        }
      );

      onChange(res.refined_text);
      setPrompt('');
      setIsOpen(false);
    } catch {
      // Keep existing text on error
    } finally {
      setLoading(false);
    }
  }, [prompt, loading, text, paragraphType, context, onChange]);

  const handleUndo = useCallback(() => {
    if (previousValueRef.current !== null) {
      onChange(previousValueRef.current);
      previousValueRef.current = null;
    }
  }, [onChange]);

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
    <div className="group/para relative">
      {/* Action buttons on hover */}
      <div className="absolute -top-3 right-0 flex items-center gap-1 opacity-0 group-hover/para:opacity-100 transition-opacity z-10">
        {previousValueRef.current !== null && !loading && (
          <button
            type="button"
            onClick={handleUndo}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white border border-[#eadfce] text-[10px] font-medium text-[#8b7355] hover:text-[#c96442] shadow-sm transition-colors"
            title="Undo AI change"
          >
            <Undo2 size={10} />
            Undo
          </button>
        )}
        <button
          type="button"
          onClick={isOpen ? handleClose : handleOpen}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all text-[10px] font-semibold shadow-sm ${
            isOpen
              ? 'bg-[#ebe0ff] text-[#7c4dba] border border-[#c4a8e8]'
              : 'bg-gradient-to-r from-[#f3e8ff] to-[#ede4ff] hover:from-[#ebe0ff] hover:to-[#e0d4ff] text-[#7c4dba] hover:text-[#6a3dad] border border-[#d8c8f0] hover:border-[#c4a8e8]'
          }`}
        >
          <Sparkles size={10} className="text-[#9b6dd7]" />
          Refine
        </button>
      </div>

      {/* Refine prompt bar */}
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
              placeholder="e.g. Make it more concise and impactful"
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

      {/* Paragraph text — click to edit */}
      {isEditing ? (
        <textarea
          value={text}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setIsEditing(false)}
          autoFocus
          className="w-full p-2 text-[13px] leading-relaxed text-[#2c2c2c] bg-white border border-[#c96442]/30 rounded-lg focus:outline-none focus:border-[#c96442] resize-y min-h-[60px]"
        />
      ) : (
        <p
          onClick={() => setIsEditing(true)}
          className="text-[13px] leading-relaxed text-[#2c2c2c] cursor-text hover:bg-[#faf7f2]/60 rounded-lg px-1 -mx-1 py-0.5 transition-colors"
          title="Click to edit"
        >
          {text}
        </p>
      )}
    </div>
  );
};
