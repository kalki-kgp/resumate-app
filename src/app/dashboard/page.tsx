'use client';
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Fraunces, DM_Sans } from 'next/font/google';
import {
  Bot,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleHelp,
  Compass,
  FileText,
  FileUp,
  FolderOpen,
  Heart,
  LayoutGrid,
  LoaderCircle,
  LogOut,
  Search,
  Settings,
  PenTool,
  Sparkles,
  Target,
  WandSparkles,
} from 'lucide-react';
import { ApiError, apiRequest, clearStoredAccessToken, getApiBaseUrl, getStoredAccessToken } from '@/lib/api';
import { TemplatePreview } from '@/app/editor/_components';
import type { ResumeData, TemplateType } from '@/types';

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
type DashboardSection =
  | 'overview'
  | 'resumes'
  | 'templates'
  | 'analytics'
  | 'ai-insights'
  | 'job-match'
  | 'ai-assistant'
  | 'ai-experiments'
  | 'faq'
  | 'settings';

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

type ResumeAnalysisCategoryScores = {
  impact: number | null;
  brevity: number | null;
  style: number | null;
  soft_skills: number | null;
};

type ResumeAnalysisSectionScores = {
  headline: number | null;
  summary: number | null;
  experience: number | null;
  education: number | null;
};

type ResumeAnalysisResult = {
  candidate_headline: string | null;
  summary: string | null;
  ats_score_estimate: number | null;
  category_scores: ResumeAnalysisCategoryScores | null;
  section_scores: ResumeAnalysisSectionScores | null;
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

type DashboardResume = {
  id: string;
  filename: string;
  title: string;
  uploaded_at: string;
  file_size_bytes: number;
  analysis: ResumeAnalysisResult | null;
  thumbnail_url: string | null;
};

type UploadResumeResponse = DashboardResume;

type DashboardResponse = {
  display_name: string;
  target_role: string | null;
  selected_resume_id: string | null;
  resumes: DashboardResume[];
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

const templateCards: { id: TemplateType; name: string; tone: string }[] = [
  { id: 'modern', name: 'Modern', tone: 'Balanced hierarchy for product and tech roles.' },
  { id: 'classic', name: 'Classic', tone: 'Sharper structure for leadership and consulting applications.' },
  { id: 'creative', name: 'Creative', tone: 'Expressive style for design and brand-facing positions.' },
  { id: 'minimal', name: 'Minimal', tone: 'Compact high-signal format for recruiter scans.' },
];

const templatePreviewData: ResumeData = {
  personal: {
    fullName: 'Alex Morgan',
    role: 'Senior Product Designer',
    email: 'alex@resumate.ai',
    phone: '+1 (555) 908-1102',
    location: 'San Francisco, CA',
    summary: 'Product designer focused on shipping user-centered, measurable outcomes.',
  },
  experience: [
    {
      id: 1,
      role: 'Senior Product Designer',
      company: 'Figma',
      date: '2021 - Present',
      description: 'Led onboarding redesign and improved activation metrics by 24%.',
    },
    {
      id: 2,
      role: 'Product Designer',
      company: 'Notion',
      date: '2018 - 2021',
      description: 'Built design systems and workflow features for distributed teams.',
    },
  ],
  education: [
    {
      id: 1,
      degree: 'B.S. in HCI',
      school: 'UC San Diego',
      date: '2014 - 2018',
    },
  ],
  skills: ['Figma', 'Product Strategy', 'UX Research', 'Design Systems', 'Prototyping'],
};

const sidebarPrimaryItems = [
  { key: 'overview', label: 'Overview', icon: LayoutGrid },
  { key: 'resumes', label: 'My Resumes', icon: FolderOpen },
  { key: 'templates', label: 'Templates Library', icon: FileText },
  { key: 'analytics', label: 'Analytics', icon: Target },
] as const;

const sidebarAiItems = [
  { key: 'ai-insights', label: 'AI Insights', icon: Sparkles, badge: undefined },
  { key: 'job-match', label: 'Job Match', icon: Compass, badge: undefined },
  { key: 'ai-assistant', label: 'AI Assistant', icon: Bot, badge: undefined },
  { key: 'ai-experiments', label: 'AI Experiments', icon: WandSparkles, badge: 'Beta' },
] as const;

const isPdfFile = (file: File): boolean => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

const formatRelativeTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return 'edited just now';
  if (diffMs < hour) return `edited ${Math.max(1, Math.floor(diffMs / minute))}m ago`;
  if (diffMs < day) return `edited ${Math.max(1, Math.floor(diffMs / hour))}h ago`;
  return `edited ${Math.max(1, Math.floor(diffMs / day))}d ago`;
};

const resumeThumbnailSrc = (resume: DashboardResume): string | null => {
  if (!resume.thumbnail_url) return null;
  return `${getApiBaseUrl()}${resume.thumbnail_url}`;
};

export default function DashboardTwoPage() {
  const router = useRouter();

  const [stage, setStage] = useState<Stage>('onboarding');
  const [onboardingPhase, setOnboardingPhase] = useState<OnboardingPhase>('choice');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>(defaultOnboardingSteps);
  const [displayName, setDisplayName] = useState('friend');
  const [targetRole, setTargetRole] = useState('');
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');
  const [dashboardResumes, setDashboardResumes] = useState<DashboardResume[]>([]);
  const [selectedDashboardResumeId, setSelectedDashboardResumeId] = useState<string | null>(null);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);

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
  const [isResumeUploadBusy, setIsResumeUploadBusy] = useState(false);
  const [dashboardNotice, setDashboardNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const workspaceUploadInputRef = useRef<HTMLInputElement | null>(null);
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

  const fetchDashboardData = useCallback(async () => {
    if (!token) return;

    setIsDashboardLoading(true);
    try {
      const data = await apiRequest<DashboardResponse>('/api/v1/dashboard', { token });
      setDisplayName(data.display_name || 'friend');
      setTargetRole(data.target_role ?? '');
      setDashboardResumes(data.resumes ?? []);
      setSelectedDashboardResumeId((current) => {
        const hasCurrent = current ? (data.resumes ?? []).some((resume) => resume.id === current) : false;
        if (hasCurrent) return current;
        return data.selected_resume_id ?? data.resumes?.[0]?.id ?? null;
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearStoredAccessToken();
        router.replace('/');
      }
    } finally {
      setIsDashboardLoading(false);
    }
  }, [router, token]);

  useEffect(() => {
    if (stage !== 'workspace' || !token) return;
    void fetchDashboardData();
  }, [fetchDashboardData, stage, token]);

  const selectedDashboardResume = useMemo(() => {
    if (dashboardResumes.length === 0) return null;
    return dashboardResumes.find((resume) => resume.id === selectedDashboardResumeId) ?? dashboardResumes[0];
  }, [dashboardResumes, selectedDashboardResumeId]);

  const hasSelectedResume = Boolean(selectedDashboardResume);
  const selectedDashboardAnalysis = selectedDashboardResume?.analysis ?? null;

  const atsScore = clamp(Math.round(selectedDashboardAnalysis?.ats_score_estimate ?? 0), 0, 100);
  const ringStyle = {
    background: `conic-gradient(#67bf2b ${atsScore * 3.6}deg, #e9eaec ${atsScore * 3.6}deg)`,
  };

  const categoryScores = {
    impact: clamp(
      selectedDashboardAnalysis?.category_scores?.impact ?? atsScore - 10,
      0,
      100
    ),
    brevity: clamp(
      selectedDashboardAnalysis?.category_scores?.brevity ?? atsScore + 8,
      0,
      100
    ),
    style: clamp(
      selectedDashboardAnalysis?.category_scores?.style ?? atsScore + 5,
      0,
      100
    ),
    softSkills: clamp(
      selectedDashboardAnalysis?.category_scores?.soft_skills ?? atsScore - 2,
      0,
      100
    ),
  };

  const sectionScores = {
    headline: clamp(selectedDashboardAnalysis?.section_scores?.headline ?? Math.round(atsScore / 10), 0, 10),
    summary: clamp(selectedDashboardAnalysis?.section_scores?.summary ?? Math.round(atsScore / 10), 0, 10),
    experience: clamp(
      selectedDashboardAnalysis?.section_scores?.experience ?? Math.round((atsScore - 8) / 10),
      0,
      10
    ),
    education: clamp(
      selectedDashboardAnalysis?.section_scores?.education ?? Math.round((atsScore - 15) / 10),
      0,
      10
    ),
  };

  const getCategoryBadge = (value: number): { label: string; className: string } => {
    if (value >= 90) return { label: 'Excellent', className: 'bg-[#eaf8e2] text-[#67bf2b]' };
    if (value >= 75) return { label: 'Good', className: 'bg-[#ecf6ec] text-[#2d8b46]' };
    return { label: 'Average', className: 'bg-[#fff1e6] text-[#d88f54]' };
  };

  const recommendedRoles = selectedDashboardAnalysis?.recommended_roles ?? [];
  const strengths = selectedDashboardAnalysis?.strengths ?? [];
  const gaps = selectedDashboardAnalysis?.gaps ?? [];
  const fixes = selectedDashboardAnalysis?.priority_fixes ?? [];
  const keywords = selectedDashboardAnalysis?.keywords_to_add ?? [];
  const improvedBullets = selectedDashboardAnalysis?.improved_bullets ?? [];

  const sectionHeading: Record<DashboardSection, { title: string; subtitle: string }> = {
    overview: {
      title: `Good Morning, ${displayName || 'there'}!`,
      subtitle: "A new day, a new opportunity. Let's create something amazing together.",
    },
    resumes: {
      title: 'My Resumes',
      subtitle: 'Browse uploaded resumes, analysis status, and select one to inspect.',
    },
    templates: {
      title: 'Templates Library',
      subtitle: 'Pick a visual direction and continue in the editor.',
    },
    analytics: {
      title: 'Analytics',
      subtitle: 'Track ATS quality, section health, and high-impact fixes.',
    },
    'ai-insights': {
      title: 'AI Insights',
      subtitle: 'Strengths, gaps, and actionable suggestions from analysis.',
    },
    'job-match': {
      title: 'Job Match',
      subtitle: 'Role alignment suggestions generated from your selected resume.',
    },
    'ai-assistant': {
      title: 'AI Assistant',
      subtitle: 'Use guided prompts and rewritten bullets to speed up edits.',
    },
    'ai-experiments': {
      title: 'AI Experiments',
      subtitle: 'Preview beta workflows and advanced optimization tools.',
    },
    faq: {
      title: 'FAQ',
      subtitle: 'Quick answers for common resume and ATS questions.',
    },
    settings: {
      title: 'Settings',
      subtitle: 'Manage preferences for dashboard behavior and AI output.',
    },
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

  const openWorkspaceUploadPicker = () => {
    workspaceUploadInputRef.current?.click();
  };

  const uploadResumeFromDashboard = async (file: File | null) => {
    if (!file || !token) return;
    if (!isPdfFile(file)) {
      setDashboardNotice('Please upload a PDF file.');
      return;
    }

    setDashboardNotice(null);
    setIsResumeUploadBusy(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('source', 'dashboard');

      const created = await apiRequest<UploadResumeResponse>('/api/v1/resumes/upload', {
        method: 'POST',
        token,
        body: formData,
      });

      setSelectedDashboardResumeId(created.id);
      await fetchDashboardData();
      setDashboardNotice('Resume uploaded to My Resumes.');
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          clearStoredAccessToken();
          router.replace('/');
          return;
        }
        setDashboardNotice(error.detail);
      } else {
        setDashboardNotice('Upload failed. Please try again.');
      }
    } finally {
      setIsResumeUploadBusy(false);
      if (workspaceUploadInputRef.current) {
        workspaceUploadInputRef.current.value = '';
      }
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

  const renderDashboardSection = () => {
    if (activeSection === 'overview') {
      return (
        <>
          <div className="mb-4 grid gap-3 md:grid-cols-3">
            {[
              {
                title: 'Help me build my resume',
                subtitle: 'Start from AI-guided layout and impact bullets.',
              },
              {
                title: 'Help me craft a cover letter',
                subtitle: 'Generate a personalized letter in minutes.',
              },
              {
                title: 'Help me find the right job match',
                subtitle: 'See how well your resume fits each role.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-[#e4e7eb] bg-white px-4 py-4 shadow-[0_8px_16px_rgba(20,24,31,0.05)]">
                <p className="text-2xl font-semibold leading-tight text-[#282c36]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
                  {item.title}
                </p>
                <p className="mt-3 text-xs text-[#8a909b]">{item.subtitle}</p>
              </div>
            ))}
          </div>

          <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-[#ece5d5] bg-[#fff8ea] px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-[#443727]">Have doubts? Start with our free trial now!</p>
              <p className="text-xs text-[#8d7861]">No payment today. Unlock all AI features and workflow tools.</p>
            </div>
            <button type="button" className="rounded-full bg-[#ff9a38] px-4 py-2 text-xs font-semibold text-white">
              Start Free Trial
            </button>
          </div>

          <section className="grid gap-4 xl:grid-cols-[1.3fr_0.8fr]">
            <article className="rounded-2xl border border-[#e5e8ec] bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#2a2f3a]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
                    Recently Opened
                  </h2>
                  <p className="text-xs text-[#8a909b]">Uploaded resumes from onboarding are available here.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={openWorkspaceUploadPicker}
                    disabled={isResumeUploadBusy}
                    className="rounded-full border border-[#e1e4e8] bg-white px-3 py-1 text-xs font-semibold text-[#626a77] hover:bg-[#f8f9fb] disabled:opacity-60"
                  >
                    {isResumeUploadBusy ? 'Uploading...' : 'Upload Resume'}
                  </button>
                  <div className="rounded-full border border-[#e1e4e8] bg-[#f8f9fb] px-3 py-1 text-xs text-[#717987]">
                    All Files
                  </div>
                </div>
              </div>
              {dashboardNotice && (
                <div className="mb-3 rounded-xl border border-[#e5e8ec] bg-[#f9fafb] px-3 py-2 text-xs text-[#646c79]">
                  {dashboardNotice}
                </div>
              )}

              {isDashboardLoading ? (
                <div className="rounded-xl border border-[#e8ebf0] bg-[#fafbfd] px-4 py-8 text-center text-sm text-[#7d8694]">
                  Loading resumes...
                </div>
              ) : dashboardResumes.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#d8dde4] bg-[#fafbfd] px-4 py-8 text-center">
                  <p className="text-sm font-semibold text-[#2b313c]">No resume uploaded yet</p>
                  <p className="mt-1 text-xs text-[#8a909b]">Upload your resume in onboarding to see it here.</p>
                  <button
                    type="button"
                    onClick={openWorkspaceUploadPicker}
                    className="mt-3 rounded-full border border-[#dfe4eb] bg-white px-3 py-1.5 text-xs font-semibold text-[#3b4352] hover:bg-[#f8fafc]"
                  >
                    Upload your first resume
                  </button>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {dashboardResumes.map((resume) => {
                    const selected = selectedDashboardResume?.id === resume.id;

                    return (
                      <button
                        key={resume.id}
                        type="button"
                        onClick={() => setSelectedDashboardResumeId(resume.id)}
                        className={`rounded-2xl border p-3 text-left transition-all ${
                          selected
                            ? 'border-[#ff9a38] bg-[#fff8f1] shadow-[0_10px_24px_rgba(255,154,56,0.16)]'
                            : 'border-[#e5e8ec] bg-white hover:border-[#cfd6df]'
                        }`}
                      >
                        <div className="mb-3 overflow-hidden rounded-xl border border-[#eceff3] bg-[#f6f8fb]">
                          {resumeThumbnailSrc(resume) ? (
                            <img
                              src={resumeThumbnailSrc(resume) ?? undefined}
                              alt={`${resume.title} preview`}
                              className="h-32 w-full object-cover object-top"
                              loading="lazy"
                            />
                          ) : (
                            <div className="p-3">
                              <div className="space-y-1">
                                <div className="h-1.5 w-3/4 rounded-full bg-[#d7dde7]" />
                                <div className="h-1.5 w-1/2 rounded-full bg-[#e0e5ec]" />
                                <div className="h-1.5 w-4/5 rounded-full bg-[#dce2eb]" />
                              </div>
                            </div>
                          )}
                        </div>
                        <p className="truncate text-sm font-semibold text-[#262c36]">{resume.title}</p>
                        <p className="mt-1 text-xs text-[#7f8794]">{formatRelativeTime(resume.uploaded_at)}</p>
                        <div className="mt-3 flex items-center justify-between text-[11px]">
                          <span className="text-[#8a909b]">{formatFileSize(resume.file_size_bytes)}</span>
                          {resume.analysis?.ats_score_estimate !== null && resume.analysis?.ats_score_estimate !== undefined ? (
                            <span className="rounded-full bg-[#edf8e5] px-2 py-0.5 font-semibold text-[#5da727]">
                              ATS {resume.analysis.ats_score_estimate}%
                            </span>
                          ) : (
                            <span className="rounded-full bg-[#f4f5f7] px-2 py-0.5 font-semibold text-[#8b8f98]">
                              Not analyzed
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </article>

            <article className="rounded-2xl border border-[#e5e8ec] bg-white p-4">
              <h2 className="text-4xl font-bold text-[#181d16]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
                Overview
              </h2>
              <p className="mt-1 text-sm text-[#6c7280]">
                {selectedDashboardResume ? `Selected: ${selectedDashboardResume.title}` : 'Select a resume to inspect'}
              </p>
              {!hasSelectedResume ? (
                <div className="mt-4 rounded-2xl border border-dashed border-[#d9dee5] bg-[#fafbfd] px-4 py-8 text-center">
                  <p className="text-sm font-semibold text-[#2b313b]">Select a resume to view ATS details</p>
                  <p className="mt-1 text-xs text-[#8a909b]">Upload a resume or pick one from the Recently Opened list.</p>
                </div>
              ) : (
                <>
                  <div className="mx-auto mt-5 flex h-48 w-48 items-center justify-center rounded-full p-3" style={ringStyle}>
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-5xl font-black text-[#1d2619]">
                      {atsScore}%
                    </div>
                  </div>

                  <p className="mt-4 text-center text-sm font-semibold text-[#2a3039]">
                    Your resume scored {atsScore} out of 100
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {[
                      { key: 'impact', label: 'Impact', value: categoryScores.impact },
                      { key: 'brevity', label: 'Brevity', value: categoryScores.brevity },
                      { key: 'style', label: 'Style', value: categoryScores.style },
                      { key: 'soft-skills', label: 'Soft Skills', value: categoryScores.softSkills },
                    ].map((item) => {
                      const badge = getCategoryBadge(item.value);
                      return (
                        <div key={item.key} className="rounded-xl border border-[#e6e8eb] bg-[#fbfcfd] px-3 py-2">
                          <p className="text-xs font-semibold text-[#6e7583]">{item.label}</p>
                          <div className="mt-1 flex items-center justify-between">
                            <p className="text-3xl font-bold text-[#181f2a]">{item.value}</p>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${badge.className}`}>
                              {badge.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-3 space-y-2">
                    {[
                      { label: 'Headline', value: sectionScores.headline },
                      { label: 'Summary', value: sectionScores.summary },
                      { label: 'Experience', value: sectionScores.experience },
                      { label: 'Education', value: sectionScores.education },
                    ].map((section) => (
                      <div key={section.label} className="flex items-center justify-between rounded-xl bg-[#f6f7f8] px-3 py-2">
                        <span className="text-sm font-semibold text-[#303744]">{section.label}</span>
                        <span className="text-2xl font-bold text-[#ef8a30]">{section.value}/10</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </article>
          </section>
        </>
      );
    }

    if (activeSection === 'resumes') {
      return (
        <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <article className="rounded-2xl border border-[#e5e8ec] bg-white p-4">
            <h2 className="text-xl font-semibold text-[#2a2f3a]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
              Resume Library
            </h2>
            <p className="mt-1 text-xs text-[#8a909b]">Select any uploaded resume to inspect details.</p>
            <div className="mt-4 space-y-3">
              {dashboardResumes.map((resume) => {
                const selected = resume.id === selectedDashboardResume?.id;
                return (
                  <button
                    key={resume.id}
                    type="button"
                    onClick={() => setSelectedDashboardResumeId(resume.id)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left ${
                      selected ? 'border-[#ff9a38] bg-[#fff8f1]' : 'border-[#e6e9ed] bg-[#fbfcfd] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded-md border border-[#e7ebf0] bg-[#f4f6f9]">
                        {resumeThumbnailSrc(resume) ? (
                          <img
                            src={resumeThumbnailSrc(resume) ?? undefined}
                            alt={`${resume.title} preview`}
                            className="h-full w-full object-cover object-top"
                            loading="lazy"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[#2a303a]">{resume.title}</p>
                        <p className="mt-1 truncate text-xs text-[#808792]">{resume.filename}</p>
                        <div className="mt-2 flex items-center justify-between text-[11px]">
                          <span className="text-[#8a909b]">{formatRelativeTime(resume.uploaded_at)}</span>
                          <span className="text-[#8a909b]">{formatFileSize(resume.file_size_bytes)}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
              {dashboardResumes.length === 0 && (
                <div className="rounded-xl border border-dashed border-[#d8dde4] bg-[#fafbfd] px-4 py-6 text-center text-sm text-[#7d8694]">
                  No uploaded resumes found.
                </div>
              )}
            </div>
          </article>

          <article className="rounded-2xl border border-[#e5e8ec] bg-white p-4">
            <h2 className="text-xl font-semibold text-[#2a2f3a]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
              Resume Details
            </h2>
            {selectedDashboardResume ? (
              <div className="mt-4 space-y-3">
                {resumeThumbnailSrc(selectedDashboardResume) && (
                  <div className="overflow-hidden rounded-xl border border-[#e7ebf0] bg-[#f6f8fb]">
                    <img
                      src={resumeThumbnailSrc(selectedDashboardResume) ?? undefined}
                      alt={`${selectedDashboardResume.title} preview`}
                      className="h-48 w-full object-cover object-top"
                    />
                  </div>
                )}
                <div className="rounded-xl bg-[#f6f8fb] px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-[#8a909b]">Selected Resume</p>
                  <p className="mt-1 text-lg font-semibold text-[#222832]">{selectedDashboardResume.title}</p>
                  <p className="text-xs text-[#7f8793]">{selectedDashboardResume.filename}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-[#e6e9ed] bg-[#fbfcfd] px-3 py-2">
                    <p className="text-xs text-[#8a909b]">ATS Score</p>
                    <p className="text-2xl font-black text-[#2d8b46]">{selectedDashboardResume.analysis?.ats_score_estimate ?? '--'}%</p>
                  </div>
                  <div className="rounded-xl border border-[#e6e9ed] bg-[#fbfcfd] px-3 py-2">
                    <p className="text-xs text-[#8a909b]">Target Role</p>
                    <p className="text-sm font-semibold text-[#2a303a]">{targetRole || 'Not set'}</p>
                  </div>
                </div>
                <div className="rounded-xl border border-[#e6e9ed] bg-white px-3 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#8a909b]">Summary</p>
                  <p className="mt-2 text-sm text-[#4a5260]">
                    {selectedDashboardResume.analysis?.summary || 'No AI summary available for this resume yet.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push('/editor')}
                  className="rounded-full bg-[#ff8b2f] px-4 py-2 text-sm font-semibold text-white"
                >
                  Open in Editor
                </button>
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-[#d8dde4] bg-[#fafbfd] px-4 py-6 text-center text-sm text-[#7d8694]">
                Select a resume from the library.
              </div>
            )}
          </article>
        </section>
      );
    }

    if (activeSection === 'templates') {
      return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {templateCards.map((tpl) => (
            <article key={tpl.id} className="rounded-2xl border border-[#e5e8ec] bg-white p-4">
              <div className="mb-3 overflow-hidden rounded-xl border border-[#eceff3] bg-[#f4f6f9]">
                <div className="origin-top-left scale-[0.62] p-2" style={{ width: '160%', transformOrigin: 'top left' }}>
                  <TemplatePreview template={tpl.id} data={templatePreviewData} scale={0.12} />
                </div>
              </div>
              <p className="text-lg font-semibold text-[#252b34]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
                {tpl.name}
              </p>
              <p className="mt-1 text-sm text-[#7d8694]">{tpl.tone}</p>
              <button
                type="button"
                onClick={() => router.push(`/editor?template=${tpl.id}`)}
                className="mt-4 rounded-full border border-[#dfe4eb] bg-[#f8fafc] px-3 py-1.5 text-xs font-semibold text-[#3b4352]"
              >
                Use Template
              </button>
            </article>
          ))}
        </section>
      );
    }

    if (activeSection === 'analytics') {
      return (
        <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <article className="rounded-2xl border border-[#e5e8ec] bg-white p-4">
            <h3 className="text-lg font-semibold text-[#2a2f3a]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>Score Breakdown</h3>
            <div className="mt-4 space-y-3">
              {[
                { label: 'Impact', value: categoryScores.impact, color: '#5baa2f' },
                { label: 'Brevity', value: categoryScores.brevity, color: '#6dbb31' },
                { label: 'Style', value: categoryScores.style, color: '#7fc232' },
                { label: 'Soft Skills', value: categoryScores.softSkills, color: '#92c73a' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-[#333a46]">{item.label}</span>
                    <span className="font-semibold text-[#2f3641]">{item.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#edf0f3]">
                    <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-[#e5e8ec] bg-white p-4">
            <h3 className="text-lg font-semibold text-[#2a2f3a]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>Priority Fixes</h3>
            <div className="mt-3 space-y-2">
              {(fixes.length > 0 ? fixes : ['Add measurable outcomes to experience bullets', 'Align keywords with target role', 'Tighten summary for stronger role fit']).map((fix, idx) => (
                <div key={`${fix}-${idx}`} className="rounded-xl border border-[#e6e9ed] bg-[#fbfcfd] px-3 py-2 text-sm text-[#4b5463]">
                  {idx + 1}. {fix}
                </div>
              ))}
            </div>
          </article>
        </section>
      );
    }

    if (activeSection === 'ai-insights') {
      return (
        <section className="grid gap-4 xl:grid-cols-3">
          <article className="rounded-2xl border border-[#e5e8ec] bg-white p-4 xl:col-span-1">
            <h3 className="text-lg font-semibold text-[#2a2f3a]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>Strengths</h3>
            <div className="mt-3 space-y-2">
              {(strengths.length > 0 ? strengths : ['Well-structured professional profile', 'Clear section hierarchy', 'Good role alignment']).map((value, idx) => (
                <p key={`${value}-${idx}`} className="rounded-xl bg-[#eef8eb] px-3 py-2 text-sm text-[#326c2f]">{value}</p>
              ))}
            </div>
          </article>
          <article className="rounded-2xl border border-[#e5e8ec] bg-white p-4 xl:col-span-1">
            <h3 className="text-lg font-semibold text-[#2a2f3a]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>Gaps</h3>
            <div className="mt-3 space-y-2">
              {(gaps.length > 0 ? gaps : ['Missing quantified impact in several bullets', 'Keywords can be tightened for ATS', 'Summary can be more role-specific']).map((value, idx) => (
                <p key={`${value}-${idx}`} className="rounded-xl bg-[#fff2e8] px-3 py-2 text-sm text-[#9a5a2a]">{value}</p>
              ))}
            </div>
          </article>
          <article className="rounded-2xl border border-[#e5e8ec] bg-white p-4 xl:col-span-1">
            <h3 className="text-lg font-semibold text-[#2a2f3a]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>Keywords to Add</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {(keywords.length > 0 ? keywords : ['Roadmap', 'Stakeholder Management', 'A/B Testing', 'Figma', 'Product Strategy']).slice(0, 15).map((kw) => (
                <span key={kw} className="rounded-full border border-[#dce3ea] bg-[#f8fafc] px-3 py-1 text-xs font-semibold text-[#4e5868]">
                  {kw}
                </span>
              ))}
            </div>
          </article>
        </section>
      );
    }

    if (activeSection === 'job-match') {
      const roleCards = recommendedRoles.length > 0
        ? recommendedRoles.map((role, idx) => ({ ...role, match: Math.max(70, 95 - idx * 6) }))
        : jobOptions.map((job) => ({ title: job.title, reason: job.reason || `${job.company} · ${job.type}`, match: job.match }));

      return (
        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {roleCards.map((role) => (
            <article key={role.title} className="rounded-2xl border border-[#e5e8ec] bg-white p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8a909b]">Match Role</p>
              <h3 className="mt-2 text-xl font-semibold text-[#252b34]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>{role.title}</h3>
              <p className="mt-2 text-sm text-[#5a6271]">{role.reason}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="rounded-full bg-[#eaf8e2] px-3 py-1 text-xs font-semibold text-[#4f9b28]">{role.match}% fit</span>
                <button type="button" className="rounded-full border border-[#dbe1e8] bg-[#f8fafc] px-3 py-1 text-xs font-semibold text-[#38404d]">
                  Save
                </button>
              </div>
            </article>
          ))}
        </section>
      );
    }

    if (activeSection === 'ai-assistant') {
      return (
        <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-2xl border border-[#e5e8ec] bg-white p-4">
            <h3 className="text-lg font-semibold text-[#2a2f3a]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>Quick Prompts</h3>
            <div className="mt-3 space-y-2">
              {[
                'Rewrite my summary for a Senior Product role',
                'Make my bullets more metrics-driven',
                'Generate a short recruiter outreach message',
                'Optimize my resume for ATS keyword density',
              ].map((prompt) => (
                <button key={prompt} type="button" className="w-full rounded-xl border border-[#e6e9ed] bg-[#fbfcfd] px-3 py-2 text-left text-sm text-[#4d5664] hover:bg-white">
                  {prompt}
                </button>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-[#e5e8ec] bg-white p-4">
            <h3 className="text-lg font-semibold text-[#2a2f3a]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>Improved Bullets</h3>
            <div className="mt-3 space-y-2">
              {(improvedBullets.length > 0
                ? improvedBullets
                : [{ original: 'Managed projects across teams', improved: 'Led cross-functional projects across design, engineering, and product, improving on-time delivery by 22%.' }]
              ).slice(0, 8).map((bullet, idx) => (
                <div key={`${bullet.original}-${idx}`} className="rounded-xl border border-[#e6e9ed] bg-[#fbfcfd] px-3 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9097a3]">Original</p>
                  <p className="mt-1 text-sm text-[#596171]">{bullet.original}</p>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5a9a2d]">Improved</p>
                  <p className="mt-1 text-sm font-medium text-[#243023]">{bullet.improved}</p>
                </div>
              ))}
            </div>
          </article>
        </section>
      );
    }

    if (activeSection === 'ai-experiments') {
      return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            { name: 'Resume Voice Clone', status: 'Preview', desc: 'Maintain your tone while tightening ATS alignment.' },
            { name: 'Keyword Heatmap', status: 'Beta', desc: 'Visual keyword coverage against target role descriptions.' },
            { name: 'One-Click Tailor', status: 'Alpha', desc: 'Generate role-specific variants from a master resume.' },
          ].map((exp) => (
            <article key={exp.name} className="rounded-2xl border border-[#e5e8ec] bg-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#2a2f3a]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>{exp.name}</h3>
                <span className="rounded-full bg-[#fff1e6] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#d88f54]">{exp.status}</span>
              </div>
              <p className="mt-2 text-sm text-[#5a6271]">{exp.desc}</p>
              <button type="button" className="mt-4 rounded-full border border-[#dbe1e8] bg-[#f8fafc] px-3 py-1 text-xs font-semibold text-[#38404d]">
                Join Waitlist
              </button>
            </article>
          ))}
        </section>
      );
    }

    if (activeSection === 'faq') {
      return (
        <section className="space-y-3">
          {[
            {
              q: 'How is ATS score calculated?',
              a: 'Score combines structure quality, keyword relevance, brevity, and section completeness from AI analysis.',
            },
            {
              q: 'Can I analyze multiple resumes?',
              a: 'Yes. Upload multiple PDFs and select any one in My Resumes. The latest analyzed resume includes full ATS insights.',
            },
            {
              q: 'Does ResuMate store my files securely?',
              a: 'Files are stored per user account and only accessible through authenticated API requests.',
            },
          ].map((faq) => (
            <article key={faq.q} className="rounded-2xl border border-[#e5e8ec] bg-white p-4">
              <p className="text-sm font-semibold text-[#2b313b]">{faq.q}</p>
              <p className="mt-2 text-sm text-[#5c6472]">{faq.a}</p>
            </article>
          ))}
        </section>
      );
    }

    return (
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-[#e5e8ec] bg-white p-4">
          <h3 className="text-lg font-semibold text-[#2a2f3a]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>Account</h3>
          <p className="mt-2 text-sm text-[#5a6271]">Signed in as {displayName}</p>
          <p className="text-sm text-[#5a6271]">Target role: {targetRole || 'Not set'}</p>
        </article>
        <article className="rounded-2xl border border-[#e5e8ec] bg-white p-4">
          <h3 className="text-lg font-semibold text-[#2a2f3a]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>Preferences</h3>
          <div className="mt-3 space-y-2 text-sm text-[#4f5867]">
            <p className="rounded-xl bg-[#f6f8fb] px-3 py-2">AI hints in editor: Enabled</p>
            <p className="rounded-xl bg-[#f6f8fb] px-3 py-2">Auto-save drafts: Enabled</p>
            <p className="rounded-xl bg-[#f6f8fb] px-3 py-2">Email notifications: Weekly summary</p>
          </div>
        </article>
      </section>
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
      className={`${fraunces.variable} ${dmSans.variable} min-h-screen bg-[#f3f4f6] text-[#1b1d21]`}
      style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}
    >
      <input
        ref={workspaceUploadInputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0] ?? null;
          void uploadResumeFromDashboard(file);
        }}
      />
      <div className="mx-auto flex min-h-screen w-full max-w-[1680px] gap-4 p-4 lg:p-5">
        <aside className="flex w-full max-w-[270px] flex-col rounded-[28px] border border-[#e3e5e8] bg-[#f7f7f8] p-4 shadow-[0_10px_30px_rgba(26,31,44,0.06)]">
          <div className="mb-4 rounded-2xl border border-[#e3e5e8] bg-white px-3 py-3">
            <p className="text-sm font-semibold text-[#1d2026]">ResuMate</p>
            <p className="text-xs text-[#8b8f98]">Free Plan</p>
          </div>

          <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#e3e5e8] bg-white px-3 py-2 text-[#8a8f97]">
            <Search className="h-4 w-4" />
            <span className="text-xs">Search anything</span>
          </div>

          <div className="space-y-1">
            {sidebarPrimaryItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setActiveSection(item.key)}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm ${
                  activeSection === item.key
                    ? 'bg-[#eceff3] font-semibold text-[#272c35]'
                    : 'text-[#535a66] hover:bg-[#eceff3]'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9aa0aa]">AI Features</p>
            <div className="mt-2 space-y-1">
              {sidebarAiItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActiveSection(item.key)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm ${
                    activeSection === item.key
                      ? 'bg-[#eceff3] font-semibold text-[#272c35]'
                      : 'text-[#535a66] hover:bg-[#eceff3]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="rounded-full bg-[#ff9a38] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto space-y-1 pt-6">
            <button
              type="button"
              onClick={() => setActiveSection('faq')}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm ${
                activeSection === 'faq'
                  ? 'bg-[#eceff3] font-semibold text-[#272c35]'
                  : 'text-[#535a66] hover:bg-[#eceff3]'
              }`}
            >
              <CircleHelp className="h-4 w-4" />
              FAQ
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('settings')}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm ${
                activeSection === 'settings'
                  ? 'bg-[#eceff3] font-semibold text-[#272c35]'
                  : 'text-[#535a66] hover:bg-[#eceff3]'
              }`}
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
            <button
              type="button"
              onClick={() => void signOut()}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-[#535a66] hover:bg-[#eceff3]"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </aside>

        <main className="flex-1 rounded-[30px] border border-[#e3e5e8] bg-[#fafafa] p-5 shadow-[0_20px_45px_rgba(24,30,43,0.08)] sm:p-6">
          {apiError && (
            <div className="mb-4 rounded-xl border border-[#f3c8be] bg-[#fff4f1] px-4 py-3 text-sm text-[#9e3f29]">
              {apiError}
            </div>
          )}

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-4xl font-bold text-[#1e232d]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
                {sectionHeading[activeSection].title}
              </h1>
              <p className="mt-1 text-sm text-[#7a818d]">{sectionHeading[activeSection].subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => void fetchDashboardData()}
                className="rounded-full border border-[#dce0e5] bg-white px-4 py-2 text-sm font-semibold text-[#3a414f] hover:bg-[#f4f6f8]"
              >
                Refresh
              </button>
              <button
                type="button"
                onClick={() => router.push('/editor')}
                className="rounded-full bg-[#ff8b2f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#f47f22]"
              >
                Open Editor
              </button>
            </div>
          </div>

          {renderDashboardSection()}
        </main>
      </div>
    </div>
  );
}
