'use client';
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Fraunces, DM_Sans } from 'next/font/google';
import { ArrowRight, Check, LoaderCircle, Mail, Trash2, ExternalLink, Search, MapPin, Clock, Building2, Briefcase, ChevronDown } from 'lucide-react';
import { ApiError, apiRequest, clearStoredAccessToken, getStoredAccessToken } from '@/lib/api';
import { TemplateThumbnail } from '@/app/editor/_components';
import {
  OnboardingWizard,
  DashboardSidebar,
  ResumeSelectionModal,
  defaultOnboardingSteps,
  exampleJobs,
  templateCards,
  getSectionHeading,
  formatFileSize,
  formatRelativeTime,
  resumeThumbnailSrc,
  clamp,
  isPdfFile,
} from '@/app/dashboard/_components';
import type {
  Stage,
  OnboardingPhase,
  OnboardingStep,
  DashboardSection,
  DashboardResume,
  DashboardCoverLetter,
  RemoteJob,
  ResumeAnalysisResult,
  OnboardingStateResponse,
  AnalyzeResumeResponse,
  UploadResumeResponse,
  AnalyzeDashboardResumeResponse,
  DashboardResponse,
  MeResponse,
  ExampleJob,
} from '@/app/dashboard/_components';

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

export default function DashboardTwoPage() {
  const router = useRouter();

  const [stage, setStage] = useState<Stage>('onboarding');
  const [onboardingPhase, setOnboardingPhase] = useState<OnboardingPhase>('choice');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>(defaultOnboardingSteps);
  const [displayName, setDisplayName] = useState('friend');
  const [profileFullName, setProfileFullName] = useState('ResuMate User');
  const [profileEmail, setProfileEmail] = useState('user@resumate.app');
  const [profileCreatedAt, setProfileCreatedAt] = useState<string | null>(null);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [targetRole, setTargetRole] = useState('');
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');
  const [dashboardResumes, setDashboardResumes] = useState<DashboardResume[]>([]);
  const [dashboardCoverLetters, setDashboardCoverLetters] = useState<DashboardCoverLetter[]>([]);
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
  const [isResumeAnalysisBusy, setIsResumeAnalysisBusy] = useState(false);
  const [dashboardAnalysisProgress, setDashboardAnalysisProgress] = useState(0);
  const [dashboardAnalysisStatusText, setDashboardAnalysisStatusText] = useState(
    'Ready to analyze selected resume.'
  );
  const [dashboardNotice, setDashboardNotice] = useState<string | null>(null);
  const [joinedWaitlist, setJoinedWaitlist] = useState<Set<string>>(new Set());
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [actionToast, setActionToast] = useState<{ message: string } | null>(null);
  const [isCoverLetterModalOpen, setIsCoverLetterModalOpen] = useState(false);
  const [jobListings, setJobListings] = useState<RemoteJob[]>([]);
  const [isJobsLoading, setIsJobsLoading] = useState(false);
  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [jobCategoryFilter, setJobCategoryFilter] = useState('all');
  const [jobSourceFilter, setJobSourceFilter] = useState<'all' | 'remotive' | 'arbeitnow'>('all');
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyJobUrl, setApplyJobUrl] = useState<string | null>(null);
  const [selectedApplyResumeId, setSelectedApplyResumeId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const workspaceUploadInputRef = useRef<HTMLInputElement | null>(null);
  const profilePopupRef = useRef<HTMLDivElement | null>(null);
  const analysisTimerRef = useRef<number | null>(null);
  const dashboardAnalysisTimerRef = useRef<number | null>(null);

  const stopAnalysisAnimation = useCallback(() => {
    if (analysisTimerRef.current !== null) {
      window.clearInterval(analysisTimerRef.current);
      analysisTimerRef.current = null;
    }
  }, []);

  const stopDashboardAnalysisAnimation = useCallback(() => {
    if (dashboardAnalysisTimerRef.current !== null) {
      window.clearInterval(dashboardAnalysisTimerRef.current);
      dashboardAnalysisTimerRef.current = null;
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
      stopDashboardAnalysisAnimation();
    };
  }, [stopAnalysisAnimation, stopDashboardAnalysisAnimation]);

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
        setProfileFullName(me.full_name?.trim() || firstName || 'ResuMate User');
        setProfileEmail(me.email?.trim() || 'user@resumate.app');
        setProfileCreatedAt(me.created_at ?? null);

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

  useEffect(() => {
    if (!actionToast) return;
    const timer = window.setTimeout(() => setActionToast(null), 2500);
    return () => window.clearTimeout(timer);
  }, [actionToast]);

  const showActionToast = useCallback((message: string) => {
    setActionToast({ message });
  }, []);

  const handleJoinWaitlist = useCallback((experimentName: string) => {
    setJoinedWaitlist((prev) => new Set(prev).add(experimentName));
    showActionToast('Joined Waitlist');
  }, [showActionToast]);

  const handleSaveJob = useCallback((roleTitle: string) => {
    setSavedJobs((prev) => new Set(prev).add(roleTitle));
    showActionToast('Saved');
  }, [showActionToast]);

  useEffect(() => {
    if (!isProfilePopupOpen) return;

    const onClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (profilePopupRef.current && !profilePopupRef.current.contains(target)) {
        setIsProfilePopupOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsProfilePopupOpen(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEscape);
    };
  }, [isProfilePopupOpen]);

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
      setDashboardCoverLetters(data.cover_letters ?? []);
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

  const fetchJobListings = useCallback(async () => {
    setIsJobsLoading(true);
    try {
      const [remotiveRes, arbeitnowRes] = await Promise.allSettled([
        fetch('https://remotive.com/api/remote-jobs?limit=50').then((r) => r.json()),
        fetch('https://www.arbeitnow.com/api/job-board-api').then((r) => r.json()),
      ]);

      const jobs: RemoteJob[] = [];

      if (remotiveRes.status === 'fulfilled' && Array.isArray(remotiveRes.value?.jobs)) {
        for (const j of remotiveRes.value.jobs) {
          jobs.push({
            id: `remotive-${j.id}`,
            url: j.url ?? '',
            title: j.title ?? '',
            company_name: j.company_name ?? '',
            company_logo: j.company_logo_url || j.company_logo || null,
            category: j.category ?? '',
            tags: Array.isArray(j.tags) ? j.tags : [],
            job_type: (j.job_type ?? '').replace(/_/g, ' '),
            publication_date: j.publication_date ?? '',
            candidate_required_location: j.candidate_required_location ?? 'Worldwide',
            salary: j.salary ?? '',
            description: j.description ?? '',
            source: 'remotive',
          });
        }
      }

      if (arbeitnowRes.status === 'fulfilled' && Array.isArray(arbeitnowRes.value?.data)) {
        for (const j of arbeitnowRes.value.data) {
          jobs.push({
            id: `arbeitnow-${j.slug}`,
            url: j.url ?? '',
            title: j.title ?? '',
            company_name: j.company_name ?? '',
            company_logo: null,
            category: Array.isArray(j.tags) ? j.tags[0] ?? '' : '',
            tags: Array.isArray(j.tags) ? j.tags : [],
            job_type: Array.isArray(j.job_types) ? j.job_types.join(', ') : '',
            publication_date: j.created_at ? new Date(j.created_at * 1000).toISOString() : '',
            candidate_required_location: j.location ?? (j.remote ? 'Remote' : ''),
            salary: '',
            description: j.description ?? '',
            source: 'arbeitnow',
          });
        }
      }

      setJobListings(jobs);
    } catch {
      // Silently fail — jobs are non-critical
    } finally {
      setIsJobsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (stage !== 'workspace') return;
    if (activeSection === 'jobs' && jobListings.length === 0 && !isJobsLoading) {
      void fetchJobListings();
    }
  }, [activeSection, fetchJobListings, isJobsLoading, jobListings.length, stage]);

  const selectedDashboardResume = useMemo(() => {
    if (dashboardResumes.length === 0) return null;
    return dashboardResumes.find((resume) => resume.id === selectedDashboardResumeId) ?? dashboardResumes[0];
  }, [dashboardResumes, selectedDashboardResumeId]);

  const hasSelectedResume = Boolean(selectedDashboardResume);
  const selectedDashboardAnalysis = selectedDashboardResume?.analysis ?? null;
  const hasSelectedAnalysis = Boolean(
    selectedDashboardAnalysis && selectedDashboardAnalysis.ats_score_estimate !== null
  );

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

  const sectionHeading = getSectionHeading(activeSection, displayName);

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

  const analyzeSelectedResume = async () => {
    if (!token || !selectedDashboardResume) {
      setDashboardNotice('Select a resume first.');
      return;
    }

    setDashboardNotice(null);
    setIsResumeAnalysisBusy(true);
    setDashboardAnalysisProgress(7);
    setDashboardAnalysisStatusText('Preparing resume pages for dashboard analysis...');
    const startedAt = Date.now();

    stopDashboardAnalysisAnimation();
    dashboardAnalysisTimerRef.current = window.setInterval(() => {
      setDashboardAnalysisProgress((previous) => {
        const next = Math.min(previous + Math.floor(Math.random() * 6) + 3, 93);
        if (next < 24) {
          setDashboardAnalysisStatusText('Parsing layout blocks and section order...');
        } else if (next < 52) {
          setDashboardAnalysisStatusText('Running ATS heuristics and section scoring...');
        } else if (next < 78) {
          setDashboardAnalysisStatusText('Generating role-fit signals and rewrite hints...');
        } else {
          setDashboardAnalysisStatusText('Packaging insights for dashboard cards...');
        }
        return next;
      });
    }, 680);

    try {
      const updatedResume = await apiRequest<AnalyzeDashboardResumeResponse>(
        `/api/v1/resumes/${selectedDashboardResume.id}/analyze`,
        {
          method: 'POST',
          token,
        }
      );

      const elapsedMs = Date.now() - startedAt;
      const minimumAnimationMs = 2200;
      if (elapsedMs < minimumAnimationMs) {
        await new Promise((resolve) => setTimeout(resolve, minimumAnimationMs - elapsedMs));
      }

      setDashboardAnalysisProgress(100);
      setDashboardAnalysisStatusText('Analysis complete. ATS and AI insights are now available.');

      setDashboardResumes((previous) => previous.map((resume) => (
        resume.id === updatedResume.id ? updatedResume : resume
      )));
      setSelectedDashboardResumeId(updatedResume.id);
      setDashboardNotice(`Analysis complete for ${updatedResume.title}.`);
    } catch (error) {
      setDashboardAnalysisProgress(0);
      setDashboardAnalysisStatusText('Analysis failed. Please try again.');
      if (error instanceof ApiError) {
        if (error.status === 401) {
          clearStoredAccessToken();
          router.replace('/');
          return;
        }
        setDashboardNotice(error.detail);
      } else {
        setDashboardNotice('Could not analyze this resume right now. Please try again.');
      }
    } finally {
      stopDashboardAnalysisAnimation();
      setIsResumeAnalysisBusy(false);
    }
  };

  const renderDashboardSection = () => {
    const renderNoResumeState = (message: string, hint: string) => (
      <div className="rounded-2xl border border-dashed border-[#d9dee5] bg-[#fafbfd] px-4 py-8 text-center">
        <p className="text-sm font-semibold text-[#2b313b]">{message}</p>
        <p className="mt-1 text-xs text-[#8a909b]">{hint}</p>
      </div>
    );

    const renderNeedsAnalysisState = (message: string, hint: string) => (
      <div className="rounded-2xl border border-dashed border-[#d9dee5] bg-[#fafbfd] px-4 py-8 text-center">
        <p className="text-sm font-semibold text-[#2b313b]">{message}</p>
        <p className="mt-1 text-xs text-[#8a909b]">{hint}</p>
        {isResumeAnalysisBusy ? (
          <div className="mx-auto mt-4 w-full max-w-md rounded-2xl border border-[#edd7c0] bg-[#fffaf4] p-3 text-left shadow-[0_12px_28px_rgba(34,25,15,0.08)]">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-[#5f4c3a]">
              <span className="inline-flex items-center gap-1">
                <LoaderCircle className="h-3.5 w-3.5 animate-spin text-[#d9733b]" />
                Dashboard AI Analysis
              </span>
              <span className="text-[#2d5a3d]">{dashboardAnalysisProgress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#efe5d8]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#ff9a38] via-[#f97344] to-[#2d8b46] transition-all duration-500"
                style={{ width: `${dashboardAnalysisProgress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-[#775f49]">{dashboardAnalysisStatusText}</p>
            <div className="mt-2 flex items-center gap-1">
              {[0, 1, 2, 3].map((dot) => (
                <span
                  key={dot}
                  className="h-1.5 w-1.5 rounded-full bg-[#d88b57] animate-pulse"
                  style={{ animationDelay: `${dot * 0.18}s` }}
                />
              ))}
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              void analyzeSelectedResume();
            }}
            disabled={!selectedDashboardResume}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#ff8b2f] px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Analyze Resume
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );

    if (activeSection === 'overview') {
      return (
        <>
          <div className="mb-4 grid gap-3 md:grid-cols-3">
            {[
              {
                title: 'Help me build my resume',
                subtitle: 'Start from AI-guided layout and impact bullets.',
                onClick: () => router.push('/editor'),
              },
              {
                title: 'Help me craft a cover letter',
                subtitle: 'Generate a personalized letter in minutes.',
                onClick: () => setIsCoverLetterModalOpen(true),
              },
              {
                title: 'Help me find the right job match',
                subtitle: 'Browse real remote jobs and apply with your resume.',
                onClick: () => {
                  setActiveSection('jobs');
                  if (jobListings.length === 0 && !isJobsLoading) void fetchJobListings();
                },
              },
            ].map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={item.onClick}
                disabled={!item.onClick}
                className="rounded-2xl border border-[#e4e7eb] bg-white px-4 py-4 shadow-[0_8px_16px_rgba(20,24,31,0.05)] text-left transition-all hover:border-[#ccd0d5] hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <p className="text-2xl font-semibold leading-tight text-[#282c36]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
                  {item.title}
                </p>
                <p className="mt-3 text-xs text-[#8a909b]">{item.subtitle}</p>
              </button>
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
                <div className="mt-4">
                  {renderNoResumeState(
                    'Select a resume to view ATS details',
                    'Upload a resume or pick one from the Recently Opened list.'
                  )}
                </div>
              ) : !hasSelectedAnalysis ? (
                <div className="mt-4">
                  {renderNeedsAnalysisState(
                    'This resume has not been analyzed yet',
                    'Run AI analysis to generate ATS score, category breakdown, and section insights.'
                  )}
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

                  <button
                    type="button"
                    onClick={() => router.push(`/editor?resume_id=${selectedDashboardResume!.id}`)}
                    className="mt-4 w-full rounded-full bg-[#ff8b2f] px-4 py-2 text-sm font-semibold text-white"
                  >
                    Open in Editor
                  </button>
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
                    {hasSelectedAnalysis ? (
                      <p className="text-2xl font-black text-[#2d8b46]">{selectedDashboardResume.analysis?.ats_score_estimate}%</p>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          void analyzeSelectedResume();
                        }}
                        disabled={isResumeAnalysisBusy}
                        className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#ff8b2f] px-2.5 py-1 text-[11px] font-semibold text-white disabled:opacity-60"
                      >
                        {isResumeAnalysisBusy ? (
                          <>
                            <LoaderCircle className="h-3 w-3 animate-spin" />
                            {dashboardAnalysisProgress > 0 ? `Analyzing ${dashboardAnalysisProgress}%` : 'Analyzing...'}
                          </>
                        ) : (
                          'Analyze Resume'
                        )}
                      </button>
                    )}
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
                  onClick={() => router.push(`/editor?resume_id=${selectedDashboardResume.id}`)}
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

    if (activeSection === 'cover-letters') {
      return (
        <section>
          {dashboardCoverLetters.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff1e8]">
                <Mail className="h-7 w-7 text-[#ff8b2f]" />
              </div>
              <h3 className="text-lg font-semibold text-[#2a2f3a]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
                No cover letters yet
              </h3>
              <p className="mt-1 text-sm text-[#8a909b] max-w-sm">
                Generate a cover letter from one of your resumes and save it to see it here.
              </p>
              <button
                type="button"
                onClick={() => setIsCoverLetterModalOpen(true)}
                className="mt-4 rounded-xl bg-[#ff8b2f] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110 transition-all"
              >
                Create Cover Letter
              </button>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {dashboardCoverLetters.map((cl) => (
                <article
                  key={cl.id}
                  className="group relative rounded-2xl border border-[#e5e8ec] bg-white p-5 shadow-[0_4px_12px_rgba(20,24,31,0.04)] transition-all hover:border-[#ccd0d5] hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-semibold text-[#2a2f3a]">
                        {cl.company_name || 'Unknown Company'}
                      </h3>
                      <p className="mt-0.5 text-xs text-[#8a909b]">
                        {cl.sender_name}
                      </p>
                    </div>
                    <span className="flex-shrink-0 rounded-full bg-[#f0f1f3] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#6b7280]">
                      {cl.tone}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-[#9298a3]">
                    {formatRelativeTime(cl.created_at)}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => router.push(`/cover-letter?saved_id=${cl.id}`)}
                      className="flex items-center gap-1.5 rounded-lg bg-[#f7f8f9] px-3 py-1.5 text-xs font-semibold text-[#535a66] hover:bg-[#eceff3] transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> View
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        const token = getStoredAccessToken();
                        if (!token) return;
                        try {
                          await apiRequest(`/api/v1/cover-letter/${cl.id}`, { method: 'DELETE', token });
                          setDashboardCoverLetters((prev) => prev.filter((c) => c.id !== cl.id));
                        } catch { /* ignore */ }
                      }}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-[#9298a3] hover:bg-[#fef2f2] hover:text-[#c94242] transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </article>
              ))}

              {/* New cover letter card */}
              <button
                type="button"
                onClick={() => setIsCoverLetterModalOpen(true)}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#dfe2e6] bg-[#fafbfc] p-8 text-[#9298a3] transition-all hover:border-[#ff8b2f] hover:text-[#ff8b2f]"
              >
                <Mail className="h-6 w-6" />
                <span className="text-sm font-semibold">New Cover Letter</span>
              </button>
            </div>
          )}
        </section>
      );
    }

    if (activeSection === 'jobs') {
      const jobCategories = Array.from(new Set(jobListings.map((j) => j.category).filter(Boolean))).sort();

      const filteredJobs = jobListings.filter((job) => {
        const matchesSearch =
          !jobSearchQuery ||
          job.title.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
          job.company_name.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
          job.tags.some((t) => t.toLowerCase().includes(jobSearchQuery.toLowerCase()));
        const matchesCategory = jobCategoryFilter === 'all' || job.category === jobCategoryFilter;
        const matchesSource = jobSourceFilter === 'all' || job.source === jobSourceFilter;
        return matchesSearch && matchesCategory && matchesSource;
      });

      const formatJobDate = (dateStr: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
        if (diff === 0) return 'Today';
        if (diff === 1) return 'Yesterday';
        if (diff < 7) return `${diff}d ago`;
        if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
        return `${Math.floor(diff / 30)}mo ago`;
      };

      return (
        <section>
          {/* Search & Filters */}
          <div className="mb-5 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9298a3]" />
                <input
                  type="text"
                  value={jobSearchQuery}
                  onChange={(e) => setJobSearchQuery(e.target.value)}
                  placeholder="Search jobs by title, company, or skill..."
                  className="w-full rounded-xl border border-[#e1e4e8] bg-white py-2.5 pl-10 pr-4 text-sm text-[#2a2f3a] placeholder:text-[#b0b5be] outline-none focus:border-[#ff8b2f] focus:ring-2 focus:ring-[#ff8b2f]/10 transition-all"
                />
              </div>

              <div className="relative">
                <select
                  value={jobSourceFilter}
                  onChange={(e) => setJobSourceFilter(e.target.value as 'all' | 'remotive' | 'arbeitnow')}
                  className="appearance-none rounded-xl border border-[#e1e4e8] bg-white px-4 py-2.5 pr-9 text-sm font-medium text-[#3a414f] outline-none focus:border-[#ff8b2f] cursor-pointer"
                >
                  <option value="all">All Sources</option>
                  <option value="remotive">Remotive</option>
                  <option value="arbeitnow">Arbeitnow</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9298a3]" />
              </div>

              <div className="relative">
                <select
                  value={jobCategoryFilter}
                  onChange={(e) => setJobCategoryFilter(e.target.value)}
                  className="appearance-none rounded-xl border border-[#e1e4e8] bg-white px-4 py-2.5 pr-9 text-sm font-medium text-[#3a414f] outline-none focus:border-[#ff8b2f] cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  {jobCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9298a3]" />
              </div>

              <button
                type="button"
                onClick={() => void fetchJobListings()}
                disabled={isJobsLoading}
                className="rounded-xl border border-[#e1e4e8] bg-white px-4 py-2.5 text-sm font-semibold text-[#3a414f] hover:bg-[#f4f6f8] disabled:opacity-60 transition-colors"
              >
                {isJobsLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs text-[#8a909b]">
              <span>{filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found</span>
              <span className="h-1 w-1 rounded-full bg-[#d0d4da]" />
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#6366f1]" /> Remotive
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#f59e0b]" /> Arbeitnow
              </span>
            </div>
          </div>

          {/* Loading state */}
          {isJobsLoading && jobListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <LoaderCircle className="mb-3 h-8 w-8 animate-spin text-[#ff8b2f]" />
              <p className="text-sm font-semibold text-[#2b313c]">Fetching jobs from Remotive & Arbeitnow...</p>
              <p className="mt-1 text-xs text-[#8a909b]">This may take a few seconds</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f3f4f6]">
                <Briefcase className="h-7 w-7 text-[#9298a3]" />
              </div>
              <h3 className="text-lg font-semibold text-[#2a2f3a]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
                No jobs match your search
              </h3>
              <p className="mt-1 text-sm text-[#8a909b] max-w-sm">
                Try adjusting your filters or search query.
              </p>
              <button
                type="button"
                onClick={() => { setJobSearchQuery(''); setJobCategoryFilter('all'); setJobSourceFilter('all'); }}
                className="mt-4 rounded-xl bg-[#ff8b2f] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110 transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredJobs.slice(0, 50).map((job) => {
                const isExpanded = expandedJobId === job.id;
                return (
                  <article
                    key={job.id}
                    className={`group rounded-2xl border bg-white transition-all duration-200 ${
                      isExpanded
                        ? 'border-[#ff8b2f]/30 shadow-[0_8px_24px_rgba(255,139,47,0.1)]'
                        : 'border-[#e5e8ec] shadow-[0_2px_8px_rgba(20,24,31,0.03)] hover:border-[#ccd0d5] hover:shadow-md'
                    }`}
                  >
                    <div
                      className="flex items-start gap-4 px-5 py-4 cursor-pointer"
                      onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                    >
                      {/* Company logo */}
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#edf0f3] bg-[#f8f9fb]">
                        {job.company_logo ? (
                          <img
                            src={job.company_logo}
                            alt={job.company_name}
                            className="h-full w-full object-contain p-1.5"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : (
                          <Building2 className="h-5 w-5 text-[#b0b5be]" />
                        )}
                      </div>

                      {/* Job details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-base font-semibold text-[#1e232d] leading-tight">{job.title}</h3>
                            <p className="mt-0.5 text-sm text-[#5a6271]">{job.company_name}</p>
                          </div>
                          <div className="flex flex-shrink-0 items-center gap-2">
                            <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                              job.source === 'remotive'
                                ? 'bg-[#eef0ff] text-[#6366f1]'
                                : 'bg-[#fff8eb] text-[#d97706]'
                            }`}>
                              {job.source === 'remotive' ? 'Remotive' : 'Arbeitnow'}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#8a909b]">
                          {job.candidate_required_location && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {job.candidate_required_location}
                            </span>
                          )}
                          {job.job_type && (
                            <span className="inline-flex items-center gap-1">
                              <Briefcase className="h-3 w-3" /> {job.job_type}
                            </span>
                          )}
                          {job.publication_date && (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {formatJobDate(job.publication_date)}
                            </span>
                          )}
                          {job.salary && (
                            <span className="inline-flex items-center gap-1 font-semibold text-[#2d8b46]">
                              {job.salary}
                            </span>
                          )}
                        </div>

                        {job.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {job.tags.slice(0, 5).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-md border border-[#e8ebf0] bg-[#f6f7f9] px-2 py-0.5 text-[10px] font-medium text-[#5a6271]"
                              >
                                {tag}
                              </span>
                            ))}
                            {job.tags.length > 5 && (
                              <span className="text-[10px] text-[#9298a3]">+{job.tags.length - 5} more</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Expanded content */}
                    {isExpanded && (
                      <div className="border-t border-[#f0f1f3] px-5 pb-5 pt-4">
                        <div
                          className="prose prose-sm max-w-none text-sm text-[#4a5260] leading-relaxed max-h-64 overflow-y-auto pr-2 [&_a]:text-[#ff8b2f] [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:mb-1 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-[#2a2f3a] [&_h2]:mt-3 [&_h2]:mb-1 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-[#2a2f3a] [&_h3]:mt-2 [&_h3]:mb-1 [&_p]:mb-2 [&_strong]:text-[#2a2f3a]"
                          dangerouslySetInnerHTML={{ __html: job.description.slice(0, 3000) }}
                        />

                        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[#f0f1f3] pt-4">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setApplyJobUrl(job.url);
                              setSelectedApplyResumeId(selectedDashboardResume?.id ?? null);
                              setIsApplyModalOpen(true);
                            }}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#ff8b2f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#f47f22] transition-colors"
                          >
                            <ArrowRight className="h-4 w-4" />
                            Apply with Resume
                          </button>
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-[#e1e4e8] bg-white px-4 py-2.5 text-sm font-semibold text-[#3a414f] hover:bg-[#f4f6f8] transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            View Original
                          </a>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}

              {filteredJobs.length > 50 && (
                <p className="py-4 text-center text-xs text-[#8a909b]">
                  Showing first 50 of {filteredJobs.length} results. Use filters to narrow down.
                </p>
              )}
            </div>
          )}

          {/* Apply with Resume Modal */}
          {isApplyModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="mx-4 w-full max-w-md rounded-2xl border border-[#e5e8ec] bg-white p-6 shadow-2xl animate-scale-in">
                <h3 className="text-xl font-bold text-[#1e232d]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
                  Apply with your Resume
                </h3>
                <p className="mt-1 text-sm text-[#8a909b]">
                  Select a resume to take with you to the application page.
                </p>

                {dashboardResumes.length === 0 ? (
                  <div className="mt-4 rounded-xl border border-dashed border-[#d8dde4] bg-[#fafbfd] px-4 py-6 text-center">
                    <p className="text-sm text-[#7d8694]">No resumes uploaded yet.</p>
                    <p className="mt-1 text-xs text-[#9298a3]">Upload a resume first to use it when applying.</p>
                  </div>
                ) : (
                  <div className="mt-4 max-h-64 space-y-2 overflow-y-auto">
                    {dashboardResumes.map((resume) => {
                      const isSelected = selectedApplyResumeId === resume.id;
                      return (
                        <button
                          key={resume.id}
                          type="button"
                          onClick={() => setSelectedApplyResumeId(resume.id)}
                          className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${
                            isSelected
                              ? 'border-[#ff9a38] bg-[#fff8f1] shadow-sm'
                              : 'border-[#e6e9ed] bg-[#fbfcfd] hover:bg-white'
                          }`}
                        >
                          <p className="truncate text-sm font-semibold text-[#2a303a]">{resume.title}</p>
                          <div className="mt-1 flex items-center gap-3 text-[11px] text-[#8a909b]">
                            <span>{formatRelativeTime(resume.uploaded_at)}</span>
                            {resume.analysis?.ats_score_estimate != null && (
                              <span className="rounded-full bg-[#edf8e5] px-2 py-0.5 font-semibold text-[#5da727]">
                                ATS {resume.analysis.ats_score_estimate}%
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="mt-5 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="rounded-xl border border-[#e1e4e8] bg-white px-4 py-2 text-sm font-semibold text-[#3a414f] hover:bg-[#f4f6f8] transition-colors"
                  >
                    Cancel
                  </button>
                  <a
                    href={applyJobUrl ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#ff8b2f] px-5 py-2 text-sm font-semibold text-white hover:bg-[#f47f22] transition-colors"
                  >
                    Go to Application
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </section>
      );
    }

    if (activeSection === 'templates') {
      return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {templateCards.map((tpl) => (
            <article key={tpl.id} className="rounded-2xl border border-[#e5e8ec] bg-white p-4">
              <div className="mb-3 rounded-xl border border-[#eceff3] bg-gradient-to-b from-[#f8fafd] to-[#f0f3f7] p-3">
                <div className="mx-auto flex items-center justify-center overflow-hidden rounded-lg border border-[#dfe4ea] bg-white shadow-[0_10px_18px_rgba(26,34,48,0.10)]">
                  <TemplateThumbnail template={tpl.id} shrink={0.385} />
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
      if (!hasSelectedResume) {
        return renderNoResumeState(
          'Select a resume to view analytics',
          'Choose one from My Resumes to load category and section performance.'
        );
      }
      if (!hasSelectedAnalysis) {
        return renderNeedsAnalysisState(
          'No analytics available yet',
          'Analyze the selected resume to unlock score breakdown and priority fixes.'
        );
      }
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
      if (!hasSelectedResume) {
        return renderNoResumeState(
          'Select a resume to see AI insights',
          'Pick any resume first to inspect strengths, gaps, and keywords.'
        );
      }
      if (!hasSelectedAnalysis) {
        return renderNeedsAnalysisState(
          'Insights are locked for this resume',
          'Run AI analysis to generate strengths, gaps, and keyword recommendations.'
        );
      }
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
      if (!hasSelectedResume) {
        return renderNoResumeState(
          'Select a resume to view role matches',
          'Choose one from your library to load role fit recommendations.'
        );
      }
      if (!hasSelectedAnalysis) {
        return renderNeedsAnalysisState(
          'Role matching needs analysis first',
          'Analyze this resume to generate job-fit role suggestions.'
        );
      }
      const roleCards = recommendedRoles.length > 0
        ? recommendedRoles.map((role, idx) => ({ ...role, match: Math.max(70, 95 - idx * 6) }))
        : jobOptions.map((job) => ({ title: job.title, reason: job.reason || `${job.company} · ${job.type}`, match: job.match }));

      return (
        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {roleCards.map((role) => {
            const isSaved = savedJobs.has(role.title);
            return (
              <article key={role.title} className="rounded-2xl border border-[#e5e8ec] bg-white p-4 transition-all duration-300">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8a909b]">Match Role</p>
                <h3 className="mt-2 text-xl font-semibold text-[#252b34]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>{role.title}</h3>
                <p className="mt-2 text-sm text-[#5a6271]">{role.reason}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full bg-[#eaf8e2] px-3 py-1 text-xs font-semibold text-[#4f9b28]">{role.match}% fit</span>
                  <button
                    type="button"
                    onClick={() => handleSaveJob(role.title)}
                    disabled={isSaved}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300 ${
                      isSaved
                        ? 'border border-[#67bf2b] bg-[#eaf8e2] text-[#2d8b46]'
                        : 'border border-[#dbe1e8] bg-[#f8fafc] text-[#38404d] hover:border-[#ff9a38] hover:bg-[#fff8f1]'
                    }`}
                  >
                    {isSaved ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Saved
                      </>
                    ) : (
                      'Save'
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      );
    }

    if (activeSection === 'ai-assistant') {
      if (!hasSelectedResume) {
        return renderNoResumeState(
          'Select a resume to use AI Assistant',
          'Pick a resume first to load prompts and rewrite suggestions.'
        );
      }
      if (!hasSelectedAnalysis) {
        return renderNeedsAnalysisState(
          'Assistant suggestions need analysis',
          'Analyze this resume to generate improved bullet rewrites and tailored prompt context.'
        );
      }
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
      const experiments = [
        { name: 'Resume Voice Clone', status: 'Preview', desc: 'Maintain your tone while tightening ATS alignment.' },
        { name: 'Keyword Heatmap', status: 'Beta', desc: 'Visual keyword coverage against target role descriptions.' },
        { name: 'One-Click Tailor', status: 'Alpha', desc: 'Generate role-specific variants from a master resume.' },
      ];
      return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {experiments.map((exp) => {
            const isJoined = joinedWaitlist.has(exp.name);
            return (
              <article key={exp.name} className="rounded-2xl border border-[#e5e8ec] bg-white p-4 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#2a2f3a]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>{exp.name}</h3>
                  <span className="rounded-full bg-[#fff1e6] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#d88f54]">{exp.status}</span>
                </div>
                <p className="mt-2 text-sm text-[#5a6271]">{exp.desc}</p>
                <button
                  type="button"
                  onClick={() => handleJoinWaitlist(exp.name)}
                  disabled={isJoined}
                  className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300 ${
                    isJoined
                      ? 'border border-[#67bf2b] bg-[#eaf8e2] text-[#2d8b46]'
                      : 'border border-[#dbe1e8] bg-[#f8fafc] text-[#38404d] hover:border-[#ff9a38] hover:bg-[#fff8f1]'
                  }`}
                >
                  {isJoined ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Joined Waitlist
                    </>
                  ) : (
                    'Join Waitlist'
                  )}
                </button>
              </article>
            );
          })}
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
        <OnboardingWizard
          onboardingPhase={onboardingPhase}
          apiError={apiError}
          onboardingSteps={onboardingSteps}
          completedOnboardingSteps={completedOnboardingSteps}
          onboardingProgress={onboardingProgress}
          currentOnboardingStep={currentOnboardingStep}
          isOnboardingBusy={isOnboardingBusy}
          targetRole={targetRole}
          isDragOver={isDragOver}
          selectedResumeFile={selectedResumeFile}
          analysisProgress={analysisProgress}
          analysisStatusText={analysisStatusText}
          analysisResult={analysisResult}
          jobOptions={jobOptions}
          selectedJobId={selectedJobId}
          onChooseUpload={handleChooseUpload}
          onChooseCreate={handleChooseCreate}
          onBackToOptions={handleBackToOptions}
          onSkipOnboarding={handleSkipOnboarding}
          onFileSelected={handleFileSelected}
          onOpenFilePicker={openFilePicker}
          onUploadStep={handleUploadStep}
          onAnalyzeStep={handleAnalyzeStep}
          onJobsStep={handleJobsStep}
          onFinalStep={handleFinalStep}
          onSelectJob={(id) => {
            setSelectedJobId(id);
            setApiError(null);
          }}
          onDragOver={() => setIsDragOver(true)}
          onDragLeave={() => setIsDragOver(false)}
          fileInputRef={fileInputRef}
        />
      </div>
    );
  }

  return (
    <div
      className={`${fraunces.variable} ${dmSans.variable} h-screen overflow-hidden bg-[#f3f4f6] text-[#1b1d21]`}
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
      <div className="mx-auto flex h-full w-full max-w-[1680px] gap-4 p-4 lg:p-5">
        <DashboardSidebar
          activeSection={activeSection}
          profileFullName={profileFullName}
          profileEmail={profileEmail}
          profileCreatedAt={profileCreatedAt}
          isProfilePopupOpen={isProfilePopupOpen}
          onSetActiveSection={setActiveSection}
          onToggleProfilePopup={() => setIsProfilePopupOpen((v) => !v)}
          onSignOut={signOut}
          profilePopupRef={profilePopupRef}
        />

        <main className="h-full flex-1 overflow-y-auto rounded-[30px] border border-[#e3e5e8] bg-[#fafafa] p-5 shadow-[0_20px_45px_rgba(24,30,43,0.08)] sm:p-6">
          {apiError && (
            <div className="mb-4 rounded-xl border border-[#f3c8be] bg-[#fff4f1] px-4 py-3 text-sm text-[#9e3f29]">
              {apiError}
            </div>
          )}

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-4xl font-bold text-[#1e232d]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
                {sectionHeading.title}
              </h1>
              <p className="mt-1 text-sm text-[#7a818d]">{sectionHeading.subtitle}</p>
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

        {actionToast && (
          <div
            className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 animate-slide-up-fade"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center gap-2 rounded-2xl border border-[#67bf2b] bg-[#eaf8e2] px-5 py-3 shadow-[0_12px_32px_rgba(45,139,70,0.25)]">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#67bf2b] text-white animate-scale-in">
                <Check className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="text-sm font-semibold text-[#2d8b46]">{actionToast.message}</span>
            </div>
          </div>
        )}

        <ResumeSelectionModal
          isOpen={isCoverLetterModalOpen}
          onClose={() => setIsCoverLetterModalOpen(false)}
          onSelect={(id) => router.push(`/cover-letter?resume_id=${id}`)}
          resumes={dashboardResumes}
        />
      </div>
    </div>
  );
}
