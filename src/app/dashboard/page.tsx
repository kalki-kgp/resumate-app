'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Fraunces, DM_Sans } from 'next/font/google';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileUp,
  Heart,
  LoaderCircle,
  LogOut,
  PenTool,
  Plus,
  Sparkles,
  Target,
} from 'lucide-react';
import { ApiError, apiRequest, clearStoredAccessToken, getStoredAccessToken } from '@/lib/api';

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

type Stage = 'onboarding' | 'workspace';
type OnboardingPhase = 'choice' | 'steps';
type OnboardingPath = 'upload' | 'create';
type Tab = 'overview' | 'resumes' | 'jobs' | 'templates';

type ResumeDraft = {
  id: string;
  title: string;
  score: number;
  mood: string;
};

type JobLead = {
  id: string;
  title: string;
  company: string;
  match: number;
  saved: boolean;
};

type OnboardingStep = {
  index: number;
  title: string;
  description: string;
  action: string;
};

type ResumeAnalysisRole = {
  title: string;
  reason: string;
};

type ResumeAnalysisBullet = {
  original: string;
  improved: string;
};

type ResumeAnalysisResult = {
  candidate_headline: string | null;
  summary: string | null;
  ats_score_estimate: number | null;
  strengths: string[];
  gaps: string[];
  priority_fixes: string[];
  keywords_to_add: string[];
  recommended_roles: ResumeAnalysisRole[];
  improved_bullets: ResumeAnalysisBullet[];
  confidence_note: string | null;
  raw_response: string | null;
  analyzed_at: string | null;
};

type OnboardingStateResponse = {
  stage: Stage;
  phase: OnboardingPhase;
  selected_path: OnboardingPath | null;
  current_step: number;
  target_role: string | null;
  steps: OnboardingStep[];
  analysis: ResumeAnalysisResult | null;
  updated_at: string;
};

type AnalyzeResumeResponse = {
  onboarding: OnboardingStateResponse;
  analysis: ResumeAnalysisResult;
};

type MeResponse = {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
};

type ExampleJob = {
  id: string;
  title: string;
  company: string;
  match: number;
  type: string;
  reason?: string;
};

const defaultOnboardingSteps: OnboardingStep[] = [
  {
    index: 0,
    title: 'Upload Resume',
    description: 'Import your existing resume for AI-powered optimization',
    action: 'Upload Resume',
  },
  {
    index: 1,
    title: 'AI Analysis',
    description: 'Get instant ATS score and AI-powered improvement suggestions',
    action: 'Analyze Resume',
  },
  {
    index: 2,
    title: 'Find Jobs',
    description: 'Discover jobs that match your skills and experience',
    action: 'Browse Jobs',
  },
  {
    index: 3,
    title: 'Apply & Track',
    description: 'Apply with tailored resumes and track your applications',
    action: 'Start Applying',
  },
];

const exampleJobs: ExampleJob[] = [
  { id: 'j1', title: 'Senior Product Designer', company: 'Notion', match: 93, type: 'Remote' },
  { id: 'j2', title: 'Design Systems Lead', company: 'Airbnb', match: 89, type: 'Hybrid' },
  { id: 'j3', title: 'Principal UX Designer', company: 'Stripe', match: 86, type: 'Remote' },
];

const initialDrafts: ResumeDraft[] = [
  { id: 'd1', title: 'Product Designer Resume', score: 91, mood: 'Warm and clear' },
  { id: 'd2', title: 'UX Strategist CV', score: 84, mood: 'Needs metrics' },
  { id: 'd3', title: 'Design Ops Profile', score: 76, mood: 'Polish summary tone' },
];

const initialLeads: JobLead[] = [
  { id: 'l1', title: 'Senior Product Designer', company: 'Notion', match: 93, saved: false },
  { id: 'l2', title: 'Design Systems Lead', company: 'Airbnb', match: 89, saved: true },
  { id: 'l3', title: 'Principal UX Designer', company: 'Stripe', match: 86, saved: false },
];

const checklistItems = [
  'Tailor summary for top company',
  'Quantify two impact bullets',
  'Send one follow-up message',
] as const;

const templateLibrary = [
  {
    name: 'Modern',
    description: 'Balanced hierarchy for product and tech roles.',
  },
  {
    name: 'Classic',
    description: 'Traditional format for consulting and finance roles.',
  },
  {
    name: 'Creative',
    description: 'Expressive structure for design and brand roles.',
  },
  {
    name: 'Minimal',
    description: 'Lightweight layout focused on concise impact.',
  },
] as const;

const isPdfFile = (file: File): boolean => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

export default function DashboardTwoPage() {
  const router = useRouter();

  const [stage, setStage] = useState<Stage>('onboarding');
  const [onboardingPhase, setOnboardingPhase] = useState<OnboardingPhase>('choice');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>(defaultOnboardingSteps);
  const [displayName, setDisplayName] = useState('friend');
  const [targetRole, setTargetRole] = useState('');
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [drafts, setDrafts] = useState<ResumeDraft[]>(initialDrafts);
  const [leads, setLeads] = useState<JobLead[]>(initialLeads);

  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isOnboardingBusy, setIsOnboardingBusy] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStatusText, setAnalysisStatusText] = useState('Ready to run resume analysis.');

  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedResumeFile, setSelectedResumeFile] = useState<File | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const analysisTimerRef = useRef<number | null>(null);

  const stopAnalysisAnimation = useCallback(() => {
    if (analysisTimerRef.current !== null) {
      window.clearInterval(analysisTimerRef.current);
      analysisTimerRef.current = null;
    }
  }, []);

  const applyOnboardingState = useCallback((state: OnboardingStateResponse) => {
    setStage(state.stage);
    setOnboardingPhase(state.phase);
    setOnboardingStep(state.current_step);
    setTargetRole(state.target_role ?? '');
    setAnalysisResult(state.analysis ?? null);

    if (Array.isArray(state.steps) && state.steps.length > 0) {
      const orderedSteps = [...state.steps].sort((a, b) => a.index - b.index);
      setOnboardingSteps(orderedSteps);
    } else {
      setOnboardingSteps(defaultOnboardingSteps);
    }

    if (state.current_step !== 0) {
      setSelectedResumeFile(null);
      setIsDragOver(false);
    }

    if (state.current_step !== 2) {
      setSelectedJobId(null);
    }

    if (state.current_step !== 1) {
      stopAnalysisAnimation();
      setAnalysisProgress(0);
      setAnalysisStatusText('Ready to run resume analysis.');
    }
  }, [stopAnalysisAnimation]);

  useEffect(() => {
    return () => {
      stopAnalysisAnimation();
    };
  }, [stopAnalysisAnimation]);

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      const storedToken = getStoredAccessToken();
      if (!storedToken) {
        router.replace('/');
        return;
      }

      setToken(storedToken);

      try {
        const me = await apiRequest<MeResponse>('/api/v1/auth/me', { token: storedToken });
        if (cancelled) return;

        const firstName = me.full_name.trim().split(/\s+/)[0];
        setDisplayName(firstName || 'friend');

        const onboardingState = await apiRequest<OnboardingStateResponse>('/api/v1/onboarding', {
          token: storedToken,
        });
        if (cancelled) return;

        applyOnboardingState(onboardingState);
      } catch {
        if (cancelled) return;
        clearStoredAccessToken();
        router.replace('/');
        return;
      } finally {
        if (!cancelled) setIsInitializing(false);
      }
    };

    void initialize();

    return () => {
      cancelled = true;
    };
  }, [applyOnboardingState, router]);

  const completedToday = useMemo(
    () => checklistItems.filter((item) => checked[item]).length,
    [checked]
  );

  const avgScore = useMemo(
    () => Math.round(drafts.reduce((sum, draft) => sum + draft.score, 0) / drafts.length),
    [drafts]
  );

  const completedOnboardingSteps = Math.min(onboardingStep, onboardingSteps.length);
  const onboardingProgress = onboardingSteps.length > 0
    ? (completedOnboardingSteps / onboardingSteps.length) * 100
    : 0;

  const currentOnboardingStep = onboardingSteps.find((step) => step.index === onboardingStep) ?? onboardingSteps[0];

  const jobOptions = useMemo<ExampleJob[]>(() => {
    const aiRoles = analysisResult?.recommended_roles ?? [];
    if (aiRoles.length === 0) return exampleJobs;

    return aiRoles.slice(0, 5).map((role, index) => ({
      id: `ai-${index}`,
      title: role.title,
      company: 'AI Recommendation',
      match: Math.max(72, 94 - index * 5),
      type: 'Suggested',
      reason: role.reason,
    }));
  }, [analysisResult]);

  const selectedJob = jobOptions.find((job) => job.id === selectedJobId) ?? null;

  useEffect(() => {
    if (onboardingStep !== 2) return;
    if (jobOptions.length === 0) return;

    const hasSelected = selectedJobId ? jobOptions.some((job) => job.id === selectedJobId) : false;
    if (!hasSelected) {
      setSelectedJobId(jobOptions[0].id);
    }
  }, [jobOptions, onboardingStep, selectedJobId]);

  const toggleChecklist = (item: string) => {
    setChecked((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const addDraft = () => {
    const next: ResumeDraft = {
      id: `d${Date.now()}`,
      title: `${targetRole || 'New Role'} Resume`,
      score: 68,
      mood: 'Fresh draft started',
    };
    setDrafts((prev) => [next, ...prev]);
    setActiveTab('resumes');
  };

  const polishDraft = (id: string) => {
    setDrafts((prev) =>
      prev.map((draft) =>
        draft.id === id
          ? {
              ...draft,
              score: Math.min(98, draft.score + Math.floor(Math.random() * 6) + 2),
              mood: 'Improved by AI coach',
            }
          : draft
      )
    );
  };

  const toggleSaveLead = (id: string) => {
    setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, saved: !lead.saved } : lead)));
  };

  const runOnboardingMutation = useCallback(
    async (path: string, body?: unknown): Promise<OnboardingStateResponse | null> => {
      if (!token) return null;

      setApiError(null);
      setIsOnboardingBusy(true);

      try {
        const nextState = await apiRequest<OnboardingStateResponse>(path, {
          method: 'POST',
          token,
          body,
        });
        applyOnboardingState(nextState);
        return nextState;
      } catch (error) {
        if (error instanceof ApiError) {
          if (error.status === 401) {
            clearStoredAccessToken();
            router.replace('/');
            return null;
          }
          setApiError(error.detail);
        } else {
          setApiError('Could not update onboarding right now. Please try again.');
        }
        return null;
      } finally {
        setIsOnboardingBusy(false);
      }
    },
    [applyOnboardingState, router, token]
  );

  const signOut = async () => {
    if (token) {
      try {
        await apiRequest<{ detail: string }>('/api/v1/auth/signout', {
          method: 'POST',
          token,
        });
      } catch {
        // Signout cleanup should still happen locally.
      }
    }

    clearStoredAccessToken();
    router.push('/');
  };

  const handleChooseUpload = async () => {
    await runOnboardingMutation('/api/v1/onboarding/choose', { path: 'upload' });
  };

  const handleChooseCreate = async () => {
    const nextState = await runOnboardingMutation('/api/v1/onboarding/choose', { path: 'create' });
    if (nextState) {
      router.push('/editor');
    }
  };

  const handleBackToOptions = async () => {
    await runOnboardingMutation('/api/v1/onboarding/back-to-options');
  };

  const handleSkipOnboarding = async () => {
    await runOnboardingMutation('/api/v1/onboarding/skip');
  };

  const handleAnalyzeStep = async () => {
    if (!token) return;

    setApiError(null);
    setIsOnboardingBusy(true);
    setAnalysisProgress(6);
    setAnalysisStatusText('Preparing resume pages for analysis...');

    const startedAt = Date.now();
    stopAnalysisAnimation();
    analysisTimerRef.current = window.setInterval(() => {
      setAnalysisProgress((previous) => {
        const next = Math.min(previous + Math.floor(Math.random() * 7) + 2, 94);

        if (next < 28) {
          setAnalysisStatusText('Converting PDF pages to images...');
        } else if (next < 50) {
          setAnalysisStatusText('Encoding page snapshots to base64...');
        } else if (next < 72) {
          setAnalysisStatusText('Running ATS and recruiter-grade review...');
        } else {
          setAnalysisStatusText('Generating structured recommendations...');
        }

        return next;
      });
    }, 650);

    try {
      const response = await apiRequest<AnalyzeResumeResponse>('/api/v1/onboarding/analyze-resume', {
        method: 'POST',
        token,
      });

      const elapsedMs = Date.now() - startedAt;
      const minimumAnimationMs = 2500;
      if (elapsedMs < minimumAnimationMs) {
        await new Promise((resolve) => setTimeout(resolve, minimumAnimationMs - elapsedMs));
      }

      setAnalysisProgress(100);
      setAnalysisStatusText('Analysis complete. Moving to role targeting...');
      setAnalysisResult(response.analysis);
      applyOnboardingState(response.onboarding);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          clearStoredAccessToken();
          router.replace('/');
          return;
        }
        setApiError(error.detail);
      } else {
        setApiError('Could not run AI analysis right now. Please try again.');
      }
    } finally {
      stopAnalysisAnimation();
      setIsOnboardingBusy(false);
    }
  };

  const handleJobsStep = async () => {
    if (!selectedJob) {
      setApiError('Select a job to continue.');
      return;
    }

    await runOnboardingMutation('/api/v1/onboarding/step-action', {
      step_index: 2,
      target_role: selectedJob.title,
    });
  };

  const handleFinalStep = async () => {
    await runOnboardingMutation('/api/v1/onboarding/step-action', { step_index: 3 });
  };

  const handleFileSelected = (file: File | null) => {
    if (!file) return;

    if (!isPdfFile(file)) {
      setApiError('Please upload a PDF file.');
      return;
    }

    setApiError(null);
    setSelectedResumeFile(file);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleUploadStep = async () => {
    if (!token || !selectedResumeFile) {
      setApiError('Select a PDF file before continuing.');
      return;
    }

    setApiError(null);
    setIsOnboardingBusy(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedResumeFile);

      const nextState = await apiRequest<OnboardingStateResponse>('/api/v1/onboarding/upload-resume', {
        method: 'POST',
        token,
        body: formData,
      });

      stopAnalysisAnimation();
      setAnalysisProgress(0);
      setAnalysisStatusText('Ready to run resume analysis.');
      applyOnboardingState(nextState);
      setSelectedResumeFile(null);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          clearStoredAccessToken();
          router.replace('/');
          return;
        }
        setApiError(error.detail);
      } else {
        setApiError('Resume upload failed. Please try again.');
      }
    } finally {
      setIsOnboardingBusy(false);
    }
  };

  const renderStepDetails = () => {
    if (!currentOnboardingStep) return null;

    if (currentOnboardingStep.index === 0) {
      return (
        <div className="space-y-5">
          <div
            className={`rounded-3xl border-2 border-dashed px-6 py-10 text-center transition-all ${
              isDragOver
                ? 'border-[#c96442] bg-[#fff3ec]'
                : 'border-[#e4d3be] bg-white'
            }`}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragOver(false);
              const droppedFile = event.dataTransfer.files?.[0] ?? null;
              handleFileSelected(droppedFile);
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                handleFileSelected(file);
              }}
            />

            <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff1e8] text-[#c96442]">
              <FileUp className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-semibold text-[#2c1810]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
              Drag and drop your resume PDF
            </h3>
            <p className="mt-2 text-sm text-[#8b7355]">
              Drop your file here or browse from your computer. We only accept PDF.
            </p>
            <button
              type="button"
              onClick={openFilePicker}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-[#fffaf4] px-4 py-2 text-sm font-semibold text-[#8b7355] hover:bg-[#f8f1e8]"
            >
              Choose PDF
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm text-[#8b7355]">
            {selectedResumeFile ? (
              <span>
                Selected: <span className="font-semibold text-[#2c1810]">{selectedResumeFile.name}</span>
              </span>
            ) : (
              'No file selected yet.'
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              void handleUploadStep();
            }}
            disabled={isOnboardingBusy || !selectedResumeFile}
            className="inline-flex items-center gap-2 rounded-full bg-[#c96442] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-65"
          >
            {isOnboardingBusy ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                Upload Resume
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      );
    }

    if (currentOnboardingStep.index === 1) {
      return (
        <div className="space-y-5">
          <div className="rounded-3xl border border-[#eadfce] bg-white px-6 py-6">
            <div className="relative mb-6 overflow-hidden rounded-2xl border border-[#f0e5d6] bg-[#faf7f2] p-5">
              <div className="absolute -right-8 -top-6 h-24 w-24 rounded-full bg-[#c96442]/15 blur-2xl" />
              <div className="absolute -left-10 bottom-0 h-20 w-20 rounded-full bg-[#2d5a3d]/15 blur-2xl" />

              <div className="relative mb-4 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-[#8b7355]">
                <span>AI Analysis Progress</span>
                <span className="text-[#2d5a3d]">{analysisProgress}%</span>
              </div>

              <div className="relative mb-4 h-2 overflow-hidden rounded-full bg-[#e8dfd2]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#2d5a3d] via-[#c96442] to-[#8b7355] transition-all duration-500"
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>

              <p className="mb-4 text-sm text-[#5f4c3a]">{analysisStatusText}</p>

              <div className="grid gap-2 sm:grid-cols-3">
                <div className="rounded-xl border border-[#eadfce] bg-white px-3 py-2">
                  <p className="text-[11px] font-semibold text-[#8b7355]">Document Parsing</p>
                  <p className="mt-1 text-xs text-[#2c1810]">PDF pages to image snapshots</p>
                </div>
                <div className="rounded-xl border border-[#eadfce] bg-white px-3 py-2">
                  <p className="text-[11px] font-semibold text-[#8b7355]">Vision Review</p>
                  <p className="mt-1 text-xs text-[#2c1810]">Gemma reads structure and content</p>
                </div>
                <div className="rounded-xl border border-[#eadfce] bg-white px-3 py-2">
                  <p className="text-[11px] font-semibold text-[#8b7355]">Output Build</p>
                  <p className="mt-1 text-xs text-[#2c1810]">ATS score + improvements + roles</p>
                </div>
              </div>

              <div className="mt-4 inline-flex items-center gap-1.5">
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#c96442]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#2d5a3d]" style={{ animationDelay: '120ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#8b7355]" style={{ animationDelay: '240ms' }} />
                <span className="ml-2 text-xs font-medium text-[#8b7355]">Live processing</span>
              </div>
            </div>

            {analysisResult && !isOnboardingBusy && (
              <div className="rounded-2xl border border-[#e7d9c7] bg-[#fffaf4] px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8b7355]">Latest Analysis Snapshot</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {analysisResult.ats_score_estimate !== null && (
                    <span className="rounded-full bg-[#edf6ef] px-3 py-1 text-xs font-semibold text-[#2d5a3d]">
                      ATS Estimate: {analysisResult.ats_score_estimate}%
                    </span>
                  )}
                  {(analysisResult.recommended_roles ?? []).slice(0, 2).map((role) => (
                    <span key={role.title} className="rounded-full bg-[#fff1e8] px-3 py-1 text-xs font-semibold text-[#c96442]">
                      {role.title}
                    </span>
                  ))}
                </div>
                {analysisResult.summary && (
                  <p className="mt-2 text-xs text-[#6d5a46]">{analysisResult.summary}</p>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              void handleAnalyzeStep();
            }}
            disabled={isOnboardingBusy}
            className="inline-flex items-center gap-2 rounded-full bg-[#2d5a3d] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-65"
          >
            {isOnboardingBusy ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Running AI analysis...
              </>
            ) : (
              <>
                Run Deep AI Analysis
                <Sparkles className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      );
    }

    if (currentOnboardingStep.index === 2) {
      return (
        <div className="space-y-5">
          <div className="grid gap-3 md:grid-cols-3">
            {jobOptions.map((job) => {
              const isSelected = selectedJobId === job.id;

              return (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => {
                    setSelectedJobId(job.id);
                    setApiError(null);
                  }}
                  className={`rounded-2xl border px-4 py-4 text-left transition-all ${
                    isSelected
                      ? 'border-[#2d5a3d] bg-[#edf6ef]'
                      : 'border-[#eadfce] bg-white hover:border-[#cbb7a0]'
                  }`}
                >
                  <p className="text-sm font-semibold text-[#2c1810]">{job.title}</p>
                  <p className="mt-1 text-xs text-[#8b7355]">{job.company} · {job.type}</p>
                  {job.reason && (
                    <p className="mt-2 text-[11px] text-[#6d5a46]">{job.reason}</p>
                  )}
                  <p className="mt-3 text-xs font-semibold text-[#2d5a3d]">{job.match}% match</p>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              void handleJobsStep();
            }}
            disabled={isOnboardingBusy || !selectedJob}
            className="inline-flex items-center gap-2 rounded-full bg-[#c96442] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-65"
          >
            {isOnboardingBusy ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Saving selection...
              </>
            ) : (
              <>
                Continue with Selected Role
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <div className="rounded-3xl border border-[#eadfce] bg-white px-6 py-6">
          <p className="text-sm text-[#5f4c3a]">
            Your profile is now calibrated. We&apos;ll guide you to apply with tailored resumes and track outcomes.
          </p>
          <div className="mt-4 space-y-2 text-sm text-[#8b7355]">
            <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#2d5a3d]" /> Resume imported and analyzed</p>
            <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#2d5a3d]" /> Target role selected: {targetRole || 'Product Designer'}</p>
            <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#2d5a3d]" /> Application workflow ready</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            void handleFinalStep();
          }}
          disabled={isOnboardingBusy}
          className="inline-flex items-center gap-2 rounded-full bg-[#2d5a3d] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-65"
        >
          {isOnboardingBusy ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Finalizing...
            </>
          ) : (
            <>
              Start Applying
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    );
  };

  if (isInitializing) {
    return (
      <div
        className={`${fraunces.variable} ${dmSans.variable} min-h-screen bg-[#faf7f2] text-[#2c1810] flex items-center justify-center px-4`}
        style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}
      >
        <div className="rounded-2xl border border-[#eadfce] bg-[#fffaf4] px-6 py-4 text-sm text-[#8b7355]">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (stage === 'onboarding') {
    return (
      <div
        className={`${fraunces.variable} ${dmSans.variable} min-h-screen bg-[#faf7f2] text-[#2c1810] px-4 py-10`}
        style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}
      >
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-16 top-20 h-72 w-72 rounded-full bg-[#f0e6d8] opacity-60 blur-3xl" />
          <div className="absolute -right-16 top-10 h-72 w-72 rounded-full bg-[#c96442] opacity-20 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#2d5a3d] opacity-15 blur-3xl" />
        </div>

        <div
          className={`relative mx-auto rounded-[34px] border border-[#eadfce] bg-[#fffaf4] p-6 shadow-[0_30px_70px_rgba(44,24,16,0.16)] sm:p-8 ${
            onboardingPhase === 'choice' ? 'max-w-5xl' : 'max-w-4xl'
          }`}
        >
          {apiError && (
            <div className="mb-6 rounded-2xl border border-[#f0c6b8] bg-[#fff3ef] px-4 py-3 text-sm text-[#9e3f29]">
              {apiError}
            </div>
          )}

          {onboardingPhase === 'choice' ? (
            <>
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#2d5a3d]">Warm & Human Journey</p>
                  <h1 className="mt-2 text-3xl font-bold" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
                    How would you like to start?
                  </h1>
                  <p className="mt-2 text-sm text-[#8b7355]">
                    Pick your preferred onboarding path from the previous flow.
                  </p>
                </div>
                <Heart className="h-7 w-7 text-[#c96442]" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    void handleChooseUpload();
                  }}
                  disabled={isOnboardingBusy}
                  className="relative rounded-3xl border border-[#e4d3be] bg-white p-6 text-left transition-all hover:border-[#c96442] hover:shadow-[0_15px_35px_rgba(201,100,66,0.15)] disabled:opacity-70"
                >
                  <span className="absolute -top-3 left-6 rounded-full bg-[#2d5a3d] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                    Recommended
                  </span>
                  <div className="mb-4 mt-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1e8] text-[#c96442]">
                    <FileUp className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-semibold text-[#2c1810]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
                    Upload Existing Resume
                  </h2>
                  <p className="mt-2 text-sm text-[#8b7355]">
                    Already have a resume? Upload it and optimize with ATS scoring and AI feedback.
                  </p>
                  <ul className="mt-4 space-y-2">
                    {['AI-powered analysis', 'ATS optimization', 'Instant feedback'].map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-[#5f4c3a]">
                        <CheckCircle2 className="h-4 w-4 text-[#2d5a3d]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#c96442]">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    void handleChooseCreate();
                  }}
                  disabled={isOnboardingBusy}
                  className="rounded-3xl border border-[#e4d3be] bg-white p-6 text-left transition-all hover:border-[#2d5a3d] hover:shadow-[0_15px_35px_rgba(45,90,61,0.12)] disabled:opacity-70"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef5ef] text-[#2d5a3d]">
                    <PenTool className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-semibold text-[#2c1810]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
                    Create From Scratch
                  </h2>
                  <p className="mt-2 text-sm text-[#8b7355]">
                    Start fresh in the editor and build a new resume with guided templates.
                  </p>
                  <ul className="mt-4 space-y-2">
                    {['Guided step-by-step', 'Professional templates', 'AI suggestions'].map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-[#5f4c3a]">
                        <CheckCircle2 className="h-4 w-4 text-[#2d5a3d]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#2d5a3d]">
                    Open Editor
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </button>
              </div>

              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => {
                    void handleSkipOnboarding();
                  }}
                  disabled={isOnboardingBusy}
                  className="inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-white px-5 py-2.5 text-sm text-[#8b7355] hover:bg-[#f8f1e8] disabled:opacity-70"
                >
                  Skip for now
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  void handleBackToOptions();
                }}
                disabled={isOnboardingBusy}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-white px-4 py-2 text-sm text-[#8b7355] hover:bg-[#f8f1e8] disabled:opacity-70"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to options
              </button>

              <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#2d5a3d]">
                  <Heart className="h-4 w-4 text-[#c96442]" />
                  Upload & Optimize
                </div>
                <h1 className="mt-4 text-3xl font-bold text-[#2c1810]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
                  Let&apos;s optimize your resume
                </h1>
                <p className="mt-2 text-sm text-[#8b7355]">
                  One focused step at a time with richer guidance.
                </p>
              </div>

              <div className="mb-8 rounded-2xl border border-[#eadfce] bg-white px-4 py-3">
                <div className="mb-2 flex items-center justify-between text-xs font-medium text-[#8b7355]">
                  <span>Progress</span>
                  <span className="text-[#2d5a3d]">{completedOnboardingSteps}/{onboardingSteps.length} completed</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#f2e8da]">
                  <div
                    className="h-full bg-gradient-to-r from-[#2d5a3d] to-[#c96442] transition-all duration-300"
                    style={{ width: `${onboardingProgress}%` }}
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-[#eadfce] bg-[#fffdf9] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2d5a3d]">
                  Step {currentOnboardingStep.index + 1} · {currentOnboardingStep.title}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-[#2c1810]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
                  {currentOnboardingStep.action}
                </h2>
                <p className="mt-2 text-sm text-[#8b7355]">{currentOnboardingStep.description}</p>

                <div className="mt-6">{renderStepDetails()}</div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => {
                    void handleSkipOnboarding();
                  }}
                  disabled={isOnboardingBusy}
                  className="inline-flex items-center gap-2 text-sm text-[#8b7355] underline-offset-4 hover:underline disabled:opacity-70"
                >
                  Skip for now
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${fraunces.variable} ${dmSans.variable} min-h-screen bg-[#faf7f2] text-[#2c1810]`}
      style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}
    >
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-16 top-20 h-72 w-72 rounded-full bg-[#f0e6d8] opacity-60 blur-3xl" />
        <div className="absolute -right-16 top-10 h-72 w-72 rounded-full bg-[#c96442] opacity-15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-[30px] border border-[#eadfce] bg-[#fffaf4] px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#2d5a3d]">Hello {displayName || 'friend'}</p>
              <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
                Your Career Garden
              </h1>
              <p className="text-sm text-[#8b7355]">Target role: {targetRole || 'Not set yet'}</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={addDraft} className="inline-flex items-center gap-2 rounded-full bg-[#c96442] px-4 py-2 text-sm font-semibold text-white">
                <Plus className="h-4 w-4" />
                New Draft
              </button>
              <button type="button" onClick={() => router.push('/editor')} className="inline-flex items-center gap-2 rounded-full bg-[#2d5a3d] px-4 py-2 text-sm font-semibold text-white">
                <ArrowRight className="h-4 w-4" />
                Open Editor
              </button>
              <button type="button" onClick={() => void signOut()} className="inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-white px-4 py-2 text-sm text-[#8b7355]">
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <div className="mb-5 flex flex-wrap gap-2">
          {(['overview', 'resumes', 'jobs', 'templates'] as Tab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className="rounded-full px-4 py-2 text-sm font-medium capitalize"
              style={{
                backgroundColor: activeTab === tab ? '#2d5a3d' : '#ffffff',
                color: activeTab === tab ? '#ffffff' : '#8b7355',
                border: activeTab === tab ? '1px solid #2d5a3d' : '1px solid #eadfce',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <section className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
            <article className="rounded-[28px] border border-[#eadfce] bg-[#fffaf4] p-5">
              <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
                Dashboard overview
              </h2>
              <div className="mt-4 space-y-2">
                {checklistItems.map((item) => (
                  <button key={item} type="button" onClick={() => toggleChecklist(item)} className="flex w-full items-center justify-between rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-left">
                    <span className="text-sm text-[#5f4c3a]">{item}</span>
                    <CheckCircle2 className={`h-4 w-4 ${checked[item] ? 'text-[#2d5a3d]' : 'text-[#d2c3af]'}`} />
                  </button>
                ))}
              </div>
            </article>

            <article className="rounded-[28px] border border-[#eadfce] bg-[#fffaf4] p-5">
              <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
                Weekly pulse
              </h3>
              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-2xl border border-[#eadfce] bg-white px-4 py-3">
                  <p className="text-[#8b7355]">Checklist progress</p>
                  <p className="text-xl font-bold text-[#2c1810]">{completedToday}/{checklistItems.length}</p>
                </div>
                <div className="rounded-2xl border border-[#eadfce] bg-white px-4 py-3">
                  <p className="text-[#8b7355]">Average ATS score</p>
                  <p className="text-xl font-bold text-[#2d5a3d]">{avgScore}%</p>
                </div>
                <div className="rounded-2xl border border-[#eadfce] bg-white px-4 py-3">
                  <p className="text-[#8b7355]">Saved opportunities</p>
                  <p className="text-xl font-bold text-[#2c1810]">{leads.filter((lead) => lead.saved).length}</p>
                </div>
              </div>
            </article>
          </section>
        )}

        {activeTab === 'resumes' && (
          <section className="rounded-[28px] border border-[#eadfce] bg-[#fffaf4] p-5">
            <h2 className="mb-4 text-xl font-semibold" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
              Resume drafts
            </h2>
            <div className="space-y-3">
              {drafts.map((draft) => (
                <div key={draft.id} className="rounded-2xl border border-[#eadfce] bg-white px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#2c1810]">{draft.title}</p>
                      <p className="text-xs text-[#8b7355]">{draft.mood}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-[#2d5a3d]">{draft.score}%</span>
                      <button type="button" onClick={() => polishDraft(draft.id)} className="inline-flex items-center gap-1 rounded-full bg-[#2d5a3d] px-3 py-1.5 text-xs font-semibold text-white">
                        <Sparkles className="h-3 w-3" />
                        Polish
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'jobs' && (
          <section className="rounded-[28px] border border-[#eadfce] bg-[#fffaf4] p-5">
            <h2 className="mb-4 text-xl font-semibold" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
              Opportunity board
            </h2>
            <div className="space-y-3">
              {leads.map((lead) => (
                <div key={lead.id} className="rounded-2xl border border-[#eadfce] bg-white px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#2c1810]">{lead.title}</p>
                      <p className="text-xs text-[#8b7355]">{lead.company}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-[#2d5a3d]">Match {lead.match}%</span>
                      <button type="button" onClick={() => toggleSaveLead(lead.id)} className="inline-flex items-center gap-1 rounded-full border border-[#eadfce] px-3 py-1.5 text-xs text-[#8b7355]">
                        <Target className="h-3 w-3" />
                        {lead.saved ? 'Saved' : 'Save'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'templates' && (
          <section className="rounded-[28px] border border-[#eadfce] bg-[#fffaf4] p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
                Templates
              </h2>
              <button
                type="button"
                onClick={() => router.push('/editor')}
                className="inline-flex items-center gap-2 rounded-full bg-[#2d5a3d] px-4 py-2 text-sm font-semibold text-white"
              >
                <ArrowRight className="h-4 w-4" />
                Open Editor
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {templateLibrary.map((templateItem) => (
                <div key={templateItem.name} className="rounded-2xl border border-[#eadfce] bg-white px-4 py-3">
                  <p className="font-semibold text-[#2c1810]">{templateItem.name}</p>
                  <p className="mt-1 text-xs text-[#8b7355]">{templateItem.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
