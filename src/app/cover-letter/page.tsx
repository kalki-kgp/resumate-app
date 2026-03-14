'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fraunces, DM_Sans } from 'next/font/google';
import {
  ArrowLeft,
  Leaf,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Download,
  Save,
  Check,
  Loader2,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { apiRequest, getStoredAccessToken } from '@/lib/api';
import type { CoverLetterData, GenerateCoverLetterResponse, SavedCoverLetterResponse } from '@/types';
import { CoverLetterPreview, ToneSelector } from './_components';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-fraunces',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const MIN_SIDEBAR_WIDTH = 320;
const MAX_SIDEBAR_WIDTH = 620;
const MIN_MAIN_WIDTH = 420;

export default function CoverLetterPage() {
  return (
    <Suspense fallback={null}>
      <CoverLetterInner />
    </Suspense>
  );
}

function CoverLetterInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeId = searchParams.get('resume_id') || null;
  const savedId = searchParams.get('saved_id') || null;
  const savedResumeId = searchParams.get('saved_resume_id') || null;

  // Redirect if no resume reference provided
  useEffect(() => {
    if (!resumeId && !savedId && !savedResumeId) {
      router.push('/dashboard');
    }
  }, [resumeId, savedId, savedResumeId, router]);

  // Form state
  const [jobDescription, setJobDescription] = useState('');
  const [tone, setTone] = useState('professional');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingSaved, setIsLoadingSaved] = useState(!!savedId);
  const [error, setError] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState<CoverLetterData | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loadedResumeId, setLoadedResumeId] = useState<string | null>(resumeId);

  // Load saved cover letter
  useEffect(() => {
    if (!savedId) return;

    const token = getStoredAccessToken();
    if (!token) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await apiRequest<SavedCoverLetterResponse>(
          `/api/v1/cover-letter/${savedId}`,
          { token }
        );
        if (cancelled) return;
        setCoverLetter(res.cover_letter);
        setTone(res.tone || 'professional');
        setHasGenerated(true);
        setLoadedResumeId(res.resume_id);
      } catch {
        if (!cancelled) setError('Failed to load saved cover letter.');
      } finally {
        if (!cancelled) setIsLoadingSaved(false);
      }
    })();

    return () => { cancelled = true; };
  }, [savedId]);

  // Layout state
  const [zoom, setZoom] = useState(0.85);
  const [sidebarWidth, setSidebarWidth] = useState(380);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const resizeStateRef = useRef<{ startX: number; startWidth: number } | null>(null);

  const clampSidebarWidth = (width: number) => {
    const maxAllowed = Math.max(
      MIN_SIDEBAR_WIDTH,
      Math.min(MAX_SIDEBAR_WIDTH, window.innerWidth - MIN_MAIN_WIDTH)
    );
    return Math.min(maxAllowed, Math.max(MIN_SIDEBAR_WIDTH, width));
  };

  const handleResizeStart = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    resizeStateRef.current = { startX: event.clientX, startWidth: sidebarWidth };
    setIsResizingSidebar(true);
  };

  useEffect(() => {
    if (!isResizingSidebar) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (!resizeStateRef.current) return;
      const delta = event.clientX - resizeStateRef.current.startX;
      const nextWidth = clampSidebarWidth(resizeStateRef.current.startWidth + delta);
      setSidebarWidth(nextWidth);
    };

    const stopResizing = () => {
      setIsResizingSidebar(false);
      resizeStateRef.current = null;
    };

    const originalUserSelect = document.body.style.userSelect;
    const originalCursor = document.body.style.cursor;
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', stopResizing);
    window.addEventListener('pointercancel', stopResizing);

    return () => {
      document.body.style.userSelect = originalUserSelect;
      document.body.style.cursor = originalCursor;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', stopResizing);
      window.removeEventListener('pointercancel', stopResizing);
    };
  }, [isResizingSidebar]);

  useEffect(() => {
    const handleWindowResize = () => {
      setSidebarWidth((current) => clampSidebarWidth(current));
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  const activeResumeId = resumeId || loadedResumeId || savedResumeId;

  const handleGenerate = async () => {
    if (!jobDescription.trim() || !activeResumeId) return;

    const token = getStoredAccessToken();
    if (!token) return;

    setIsGenerating(true);
    setError(null);

    try {
      const generateUrl = savedResumeId && !resumeId
        ? `/api/v1/cover-letter/from-saved/${savedResumeId}/generate`
        : `/api/v1/cover-letter/${activeResumeId}/generate`;
      const res = await apiRequest<GenerateCoverLetterResponse>(
        generateUrl,
        {
          method: 'POST',
          token,
          body: {
            job_description: jobDescription.trim(),
            tone,
            additional_instructions: additionalInstructions.trim(),
          },
        }
      );

      setCoverLetter(res.cover_letter);
      setHasGenerated(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate cover letter';
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFieldChange = (field: keyof CoverLetterData, value: string) => {
    if (!coverLetter) return;
    setCoverLetter({ ...coverLetter, [field]: value });
  };

  const handleBodyChange = (index: number, value: string) => {
    if (!coverLetter) return;
    const newBody = [...coverLetter.body];
    newBody[index] = value;
    setCoverLetter({ ...coverLetter, body: newBody });
  };

  const handleExportPdf = () => {
    window.print();
  };

  const handleSave = async () => {
    if (!coverLetter) return;

    const token = getStoredAccessToken();
    if (!token) return;

    setIsSaving(true);
    try {
      await apiRequest<SavedCoverLetterResponse>('/api/v1/cover-letter/save', {
        method: 'POST',
        token,
        body: {
          resume_id: activeResumeId || '',
          job_description: jobDescription.trim(),
          tone,
          cover_letter: coverLetter,
        },
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } catch {
      setError('Failed to save cover letter.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!resumeId && !savedId && !savedResumeId) return null;

  return (
    <div
      className={`${fraunces.variable} ${dmSans.variable} h-screen flex overflow-hidden bg-[#faf7f2] text-[#2c1810]`}
      style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}
    >
      <div className="fixed inset-0 -z-10 bg-[#faf7f2]" />
      <div className="pointer-events-none fixed -left-20 top-20 -z-10 h-72 w-72 rounded-full bg-[#f0e6d8] opacity-55 blur-3xl" />
      <div className="pointer-events-none fixed right-0 top-0 -z-10 h-72 w-72 rounded-full bg-[#c96442] opacity-20 blur-3xl" />

      {/* Left sidebar */}
      <aside
        className="flex-shrink-0 flex flex-col h-full bg-[#fffaf4]/95 backdrop-blur-xl border-r border-[#eadfce] z-20"
        style={{ width: `${sidebarWidth}px` }}
      >
        {/* Header */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-[#eadfce]">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 -ml-1 rounded-full hover:bg-[#f4ecdf] text-[#8b7355] hover:text-[#2c1810] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Leaf size={20} className="text-[#2d5a3d]" />
            <span className="font-bold" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
              Cover Letter
            </span>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Job Description */}
          <div>
            <label className="block text-xs font-bold uppercase text-[#8b7355] mb-1.5 ml-1">
              Job Description <span className="text-[#c96442]">*</span>
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full p-3 rounded-2xl bg-white border border-[#eadfce] focus:border-[#c96442] focus:outline-none transition-all text-sm min-h-[200px] resize-y text-[#2c1810] placeholder:text-[#c4b29e]"
            />
          </div>

          {/* Tone Selector */}
          <div>
            <label className="block text-xs font-bold uppercase text-[#8b7355] mb-1.5 ml-1">
              Tone
            </label>
            <ToneSelector value={tone} onChange={setTone} />
          </div>

          {/* Additional Instructions */}
          <div>
            <label className="block text-xs font-bold uppercase text-[#8b7355] mb-1.5 ml-1">
              Additional Instructions
            </label>
            <textarea
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
              placeholder="e.g. Emphasize my leadership experience, mention relocation..."
              className="w-full p-3 rounded-2xl bg-white border border-[#eadfce] focus:border-[#c96442] focus:outline-none transition-all text-sm min-h-[80px] resize-y text-[#2c1810] placeholder:text-[#c4b29e]"
            />
          </div>

          {/* Error display */}
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-[#f5c6c6] bg-[#fef2f2] px-3 py-2.5">
              <AlertCircle size={16} className="text-[#c94242] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#c94242]">{error}</p>
            </div>
          )}

          {/* Generate button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!jobDescription.trim() || !activeResumeId || isGenerating}
            className="w-full py-3 rounded-2xl bg-[#c96442] text-white font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating...
              </>
            ) : hasGenerated ? (
              'Regenerate'
            ) : (
              'Generate Cover Letter'
            )}
          </button>
        </div>

        {/* Bottom tip */}
        <div className="p-4 border-t border-[#eadfce]">
          <div className="p-4 rounded-2xl bg-[#fff1e8] border border-[#f1d7c7]">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[#c96442]" />
              <span className="font-semibold text-[#c96442]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
                AI Refinement
              </span>
            </div>
            <p className="text-sm text-[#8b7355]">
              Hover over any paragraph in the preview to refine it with AI, or click to edit manually.
            </p>
          </div>
        </div>
      </aside>

      {/* Resize handle */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize sidebar"
        onPointerDown={handleResizeStart}
        className={`hidden lg:block h-full w-1 flex-shrink-0 cursor-col-resize transition-colors ${
          isResizingSidebar ? 'bg-[#c96442]/40' : 'bg-transparent hover:bg-[#c96442]/30'
        }`}
      />

      {/* Right main area */}
      <main className="flex-1 h-full relative flex flex-col items-center bg-[#f3ece2]/50 overflow-auto pt-20 pb-8">
        {/* Zoom toolbar */}
        <div className="absolute top-6 flex items-center gap-2 bg-[#fffaf4]/95 rounded-full px-4 py-2 shadow-lg z-30 border border-[#eadfce]">
          <button
            onClick={() => setZoom(Math.max(0.35, zoom - 0.05))}
            className="p-2 hover:bg-[#f4ecdf] rounded-full text-[#8b7355] hover:text-[#2c1810] transition-colors"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-xs font-mono font-bold w-12 text-center text-[#8b7355]">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(Math.min(0.85, zoom + 0.05))}
            className="p-2 hover:bg-[#f4ecdf] rounded-full text-[#8b7355] hover:text-[#2c1810] transition-colors"
          >
            <ZoomIn size={16} />
          </button>
          <div className="w-px h-4 bg-[#eadfce] mx-2" />
          <button
            onClick={handleExportPdf}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#f4ecdf] rounded-lg text-xs font-bold text-[#8b7355] transition-colors"
          >
            <Download size={14} /> Export PDF
          </button>
          {coverLetter && (
            <>
              <div className="w-px h-4 bg-[#eadfce]" />
              <button
                onClick={handleSave}
                disabled={isSaving || isSaved}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#f4ecdf] rounded-lg text-xs font-bold text-[#8b7355] transition-colors disabled:opacity-60"
              >
                {isSaved ? (
                  <><Check size={14} className="text-[#2d5a3d]" /> Saved</>
                ) : isSaving ? (
                  <><Loader2 size={14} className="animate-spin" /> Saving...</>
                ) : (
                  <><Save size={14} /> Save</>
                )}
              </button>
            </>
          )}
        </div>

        {/* Content area */}
        {isGenerating || isLoadingSaved ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-3">
            <div className="w-10 h-10 border-3 border-[#c96442] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-[#8b7355]">
              {isLoadingSaved ? 'Loading cover letter...' : 'Crafting your cover letter...'}
            </span>
          </div>
        ) : coverLetter ? (
          <div id="cover-letter-print" className="bg-white shadow-2xl rounded-sm overflow-hidden transition-all duration-200">
            <CoverLetterPreview
              data={coverLetter}
              scale={zoom}
              editable={true}
              onFieldChange={handleFieldChange}
              onBodyChange={handleBodyChange}
              context={{
                job_description: jobDescription,
                tone,
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center px-8">
            <div className="w-16 h-16 rounded-2xl bg-[#fff1e8] flex items-center justify-center">
              <FileText size={28} className="text-[#c96442]" />
            </div>
            <div>
              <h3
                className="text-lg font-bold text-[#2c1810] mb-1"
                style={{ fontFamily: 'var(--font-fraunces), serif' }}
              >
                Your cover letter will appear here
              </h3>
              <p className="text-sm text-[#8b7355] max-w-sm">
                Paste a job description on the left and click Generate to create a personalized cover letter from your resume.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
