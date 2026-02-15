'use client';
/* eslint-disable @next/next/no-img-element */

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileUp,
  Heart,
  LoaderCircle,
  PenTool,
  Sparkles,
} from 'lucide-react';
import type {
  ExampleJob,
  OnboardingPhase,
  OnboardingStep,
  ResumeAnalysisResult,
} from './dashboard-types';

export type OnboardingWizardProps = {
  onboardingPhase: OnboardingPhase;
  apiError: string | null;
  onboardingSteps: OnboardingStep[];
  completedOnboardingSteps: number;
  onboardingProgress: number;
  currentOnboardingStep: OnboardingStep;
  isOnboardingBusy: boolean;
  targetRole: string;
  isDragOver: boolean;
  selectedResumeFile: File | null;
  analysisProgress: number;
  analysisStatusText: string;
  analysisResult: ResumeAnalysisResult | null;
  jobOptions: ExampleJob[];
  selectedJobId: string | null;
  onChooseUpload: () => Promise<void>;
  onChooseCreate: () => Promise<void>;
  onBackToOptions: () => Promise<void>;
  onSkipOnboarding: () => Promise<void>;
  onFileSelected: (file: File | null) => void;
  onOpenFilePicker: () => void;
  onUploadStep: () => Promise<void>;
  onAnalyzeStep: () => Promise<void>;
  onJobsStep: () => Promise<void>;
  onFinalStep: () => Promise<void>;
  onSelectJob: (jobId: string) => void;
  onDragOver: () => void;
  onDragLeave: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
};

export const OnboardingWizard = ({
  onboardingPhase,
  apiError,
  onboardingSteps,
  completedOnboardingSteps,
  onboardingProgress,
  currentOnboardingStep,
  isOnboardingBusy,
  targetRole,
  isDragOver,
  selectedResumeFile,
  analysisProgress,
  analysisStatusText,
  analysisResult,
  jobOptions,
  selectedJobId,
  onChooseUpload,
  onChooseCreate,
  onBackToOptions,
  onSkipOnboarding,
  onFileSelected,
  onOpenFilePicker,
  onUploadStep,
  onAnalyzeStep,
  onJobsStep,
  onFinalStep,
  onSelectJob,
  onDragOver,
  onDragLeave,
  fileInputRef,
}: OnboardingWizardProps) => {
  const renderStepDetails = () => {
    if (!currentOnboardingStep) return null;

    if (currentOnboardingStep.index === 0) {
      return (
        <div className="space-y-5">
          <div
            className={`rounded-3xl border-2 border-dashed px-6 py-10 text-center transition-all ${
              isDragOver ? 'border-[#c96442] bg-[#fff3ec]' : 'border-[#e4d3be] bg-white'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              onDragOver();
            }}
            onDragLeave={onDragLeave}
            onDrop={(e) => {
              e.preventDefault();
              const droppedFile = e.dataTransfer.files?.[0] ?? null;
              onFileSelected(droppedFile);
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) => onFileSelected(e.target.files?.[0] ?? null)}
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
              onClick={onOpenFilePicker}
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
            onClick={() => void onUploadStep()}
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
            onClick={() => void onAnalyzeStep()}
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
                  onClick={() => onSelectJob(job.id)}
                  className={`rounded-2xl border px-4 py-4 text-left transition-all ${
                    isSelected ? 'border-[#2d5a3d] bg-[#edf6ef]' : 'border-[#eadfce] bg-white hover:border-[#cbb7a0]'
                  }`}
                >
                  <p className="text-sm font-semibold text-[#2c1810]">{job.title}</p>
                  <p className="mt-1 text-xs text-[#8b7355]">{job.company} · {job.type}</p>
                  {job.reason && <p className="mt-2 text-[11px] text-[#6d5a46]">{job.reason}</p>}
                  <p className="mt-3 text-xs font-semibold text-[#2d5a3d]">{job.match}% match</p>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => void onJobsStep()}
            disabled={isOnboardingBusy || !selectedJobId}
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
          onClick={() => void onFinalStep()}
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

  return (
    <>
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
              <p className="mt-2 text-sm text-[#8b7355]">Pick your preferred onboarding path from the previous flow.</p>
            </div>
            <Heart className="h-7 w-7 text-[#c96442]" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => void onChooseUpload()}
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
              onClick={() => void onChooseCreate()}
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
              onClick={() => void onSkipOnboarding()}
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
            onClick={() => void onBackToOptions()}
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
            <p className="mt-2 text-sm text-[#8b7355]">One focused step at a time with richer guidance.</p>
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
              onClick={() => void onSkipOnboarding()}
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
    </>
  );
};
