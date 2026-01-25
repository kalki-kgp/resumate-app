'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Upload,
  BarChart3,
  Search,
  Send,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Rocket,
  PartyPopper,
  FileText,
  PenTool,
  FileUp,
} from 'lucide-react';
import type { OnboardingStep } from '@/types';

interface OnboardingWizardProps {
  onComplete: () => void;
  onStepAction: (stepId: number) => void;
}

type OnboardingPhase = 'choice' | 'steps';

const initialSteps: OnboardingStep[] = [
  {
    id: 1,
    title: 'Upload Resume',
    description: 'Import your existing resume for AI-powered optimization',
    icon: 'upload',
    action: 'Upload Resume',
    completed: false,
  },
  {
    id: 2,
    title: 'AI Analysis',
    description: 'Get instant ATS score and AI-powered improvement suggestions',
    icon: 'analyze',
    action: 'Analyze Resume',
    completed: false,
  },
  {
    id: 3,
    title: 'Find Jobs',
    description: 'Discover jobs that match your skills and experience',
    icon: 'search',
    action: 'Browse Jobs',
    completed: false,
  },
  {
    id: 4,
    title: 'Apply & Track',
    description: 'Apply with tailored resumes and track your applications',
    icon: 'apply',
    action: 'Start Applying',
    completed: false,
  },
];

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  upload: Upload,
  analyze: BarChart3,
  search: Search,
  apply: Send,
};

export const OnboardingWizard = ({ onComplete, onStepAction }: OnboardingWizardProps) => {
  const router = useRouter();
  const [phase, setPhase] = useState<OnboardingPhase>('choice');
  const [steps, setSteps] = useState<OnboardingStep[]>(initialSteps);
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [choiceHover, setChoiceHover] = useState<'upload' | 'create' | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChooseUpload = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setPhase('steps');
      setIsAnimating(false);
    }, 300);
  };

  const handleChooseCreate = () => {
    // Navigate to editor page
    // The editor will have its own onboarding tooltips
    router.push('/editor');
  };

  const handleBackToChoice = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setPhase('choice');
      setIsAnimating(false);
    }, 300);
  };

  const handleStepComplete = (stepId: number) => {
    if (isAnimating) return;

    setIsAnimating(true);

    // Mark step as completed
    setSteps(prev =>
      prev.map(step =>
        step.id === stepId ? { ...step, completed: true } : step
      )
    );

    // Trigger the action callback
    onStepAction(stepId);

    // Move to next step after animation
    setTimeout(() => {
      if (stepId < 4) {
        setCurrentStep(stepId + 1);
      } else {
        // All steps completed
        setShowConfetti(true);
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
      setIsAnimating(false);
    }, 600);
  };

  const completedCount = steps.filter(s => s.completed).length;
  const progress = (completedCount / steps.length) * 100;

  if (!mounted) return null;

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-float"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'][Math.floor(Math.random() * 5)],
                width: '10px',
                height: '10px',
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl w-full">
        {/* ============ PHASE: CHOICE ============ */}
        {phase === 'choice' && (
          <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            {/* Header */}
            <div className="text-center mb-12 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Welcome to ResuMate
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                How Would You Like to Start?
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Choose your path to create the perfect resume
              </p>
            </div>

            {/* Choice Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-12">
              {/* Upload Existing Resume */}
              <button
                onClick={handleChooseUpload}
                onMouseEnter={() => setChoiceHover('upload')}
                onMouseLeave={() => setChoiceHover(null)}
                className={`
                  relative group p-8 rounded-3xl border-2 text-left
                  transition-all duration-500 transform
                  ${choiceHover === 'upload'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105 shadow-2xl shadow-blue-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300'}
                  animate-fade-in-up
                `}
                style={{ animationDelay: '0.2s' }}
              >
                {/* Recommended Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold shadow-lg">
                    Recommended
                  </span>
                </div>

                {/* Icon */}
                <div className={`
                  w-20 h-20 rounded-2xl flex items-center justify-center mb-6
                  transition-all duration-300
                  ${choiceHover === 'upload'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                    : 'bg-blue-100 dark:bg-blue-900/30'}
                `}>
                  <FileUp
                    size={40}
                    className={`
                      transition-all duration-300
                      ${choiceHover === 'upload' ? 'text-white' : 'text-blue-600 dark:text-blue-400'}
                    `}
                  />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                  Upload Existing Resume
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Already have a resume? Upload it and let our AI analyze and optimize it for better ATS scores.
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {['AI-powered analysis', 'ATS optimization', 'Instant feedback'].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle2 size={16} className="text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className={`
                  flex items-center gap-2 font-semibold
                  transition-all duration-300
                  ${choiceHover === 'upload' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}
                `}>
                  <span>Get Started</span>
                  <ArrowRight size={18} className={`transition-transform duration-300 ${choiceHover === 'upload' ? 'translate-x-1' : ''}`} />
                </div>

                {/* Glow Effect */}
                {choiceHover === 'upload' && (
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none" />
                )}
              </button>

              {/* Create From Scratch */}
              <button
                onClick={handleChooseCreate}
                onMouseEnter={() => setChoiceHover('create')}
                onMouseLeave={() => setChoiceHover(null)}
                className={`
                  relative group p-8 rounded-3xl border-2 text-left
                  transition-all duration-500 transform
                  ${choiceHover === 'create'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 scale-105 shadow-2xl shadow-purple-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-300'}
                  animate-fade-in-up
                `}
                style={{ animationDelay: '0.3s' }}
              >
                {/* Icon */}
                <div className={`
                  w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mt-4
                  transition-all duration-300
                  ${choiceHover === 'create'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                    : 'bg-purple-100 dark:bg-purple-900/30'}
                `}>
                  <PenTool
                    size={40}
                    className={`
                      transition-all duration-300
                      ${choiceHover === 'create' ? 'text-white' : 'text-purple-600 dark:text-purple-400'}
                    `}
                  />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                  Create From Scratch
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Start fresh with our guided editor. Perfect if you&apos;re building your first resume or want a complete redesign.
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {['Guided step-by-step', 'Professional templates', 'AI suggestions'].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle2 size={16} className="text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className={`
                  flex items-center gap-2 font-semibold
                  transition-all duration-300
                  ${choiceHover === 'create' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-500'}
                `}>
                  <span>Open Editor</span>
                  <ArrowRight size={18} className={`transition-transform duration-300 ${choiceHover === 'create' ? 'translate-x-1' : ''}`} />
                </div>

                {/* Glow Effect */}
                {choiceHover === 'create' && (
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 pointer-events-none" />
                )}
              </button>
            </div>

            {/* Skip Option */}
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <button
                onClick={onComplete}
                className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
              >
                <span>Skip for now, explore dashboard</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ============ PHASE: STEPS ============ */}
        {phase === 'steps' && (
          <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            {/* Back Button */}
            <button
              onClick={handleBackToChoice}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors mb-6 animate-fade-in-up"
            >
              <ArrowLeft size={18} />
              <span>Back to options</span>
            </button>

            {/* Header */}
            <div className="text-center mb-12 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6">
                <FileText className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Upload & Optimize
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                Let&apos;s Optimize Your Resume
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Follow these steps to transform your resume into an ATS-friendly job magnet
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Progress
                </span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {completedCount}/{steps.length} completed
                </span>
              </div>
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                </div>
              </div>
            </div>

            {/* Steps Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              {steps.map((step, index) => {
                const Icon = iconMap[step.icon];
                const isActive = currentStep === step.id;
                const isCompleted = step.completed;
                const isLocked = step.id > currentStep && !isCompleted;

                return (
                  <div
                    key={step.id}
                    className={`
                      relative group animate-fade-in-up
                      ${isActive ? 'scale-105' : ''}
                      transition-all duration-500
                    `}
                    style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                  >
                    {/* Connector Line */}
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute top-12 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5">
                        <div
                          className={`h-full transition-all duration-700 ${
                            isCompleted
                              ? 'bg-gradient-to-r from-green-500 to-green-400'
                              : 'bg-slate-200 dark:bg-slate-700'
                          }`}
                        />
                      </div>
                    )}

                    {/* Step Card */}
                    <div
                      className={`
                        relative p-6 rounded-2xl border-2 transition-all duration-500
                        ${isCompleted
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-500 shadow-lg shadow-green-500/20'
                          : isActive
                            ? 'bg-white dark:bg-slate-800 border-blue-500 shadow-xl shadow-blue-500/20'
                            : isLocked
                              ? 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-60'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                        }
                        ${isActive && !isCompleted ? 'animate-pulse-border' : ''}
                      `}
                    >
                      {/* Step Number / Check */}
                      <div
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center mb-4
                          transition-all duration-500 transform
                          ${isCompleted
                            ? 'bg-green-500 text-white scale-110'
                            : isActive
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white animate-bounce-subtle'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                          }
                        `}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 animate-scale-in" />
                        ) : (
                          <span className="font-bold">{step.id}</span>
                        )}
                      </div>

                      {/* Icon */}
                      <div
                        className={`
                          w-14 h-14 rounded-xl flex items-center justify-center mb-4
                          transition-all duration-300
                          ${isCompleted
                            ? 'bg-green-100 dark:bg-green-900/30'
                            : isActive
                              ? 'bg-blue-100 dark:bg-blue-900/30'
                              : 'bg-slate-100 dark:bg-slate-700/50'
                          }
                        `}
                      >
                        <Icon
                          size={28}
                          className={`
                            transition-all duration-300
                            ${isCompleted
                              ? 'text-green-600 dark:text-green-400'
                              : isActive
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-slate-400'
                            }
                          `}
                        />
                      </div>

                      {/* Content */}
                      <h3 className={`
                        font-bold mb-2 transition-colors duration-300
                        ${isCompleted
                          ? 'text-green-700 dark:text-green-300'
                          : 'text-slate-900 dark:text-white'
                        }
                      `}>
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                        {step.description}
                      </p>

                      {/* Action Button */}
                      {isActive && !isCompleted ? (
                        <button
                          onClick={() => handleStepComplete(step.id)}
                          disabled={isAnimating}
                          className={`
                            w-full py-2.5 px-4 rounded-xl font-semibold text-sm
                            flex items-center justify-center gap-2
                            bg-gradient-to-r from-blue-600 to-purple-600 text-white
                            hover:from-blue-700 hover:to-purple-700
                            transform hover:scale-105 active:scale-95
                            transition-all duration-300
                            shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40
                            disabled:opacity-50 disabled:cursor-not-allowed
                          `}
                        >
                          {step.action}
                          <ArrowRight size={16} className="animate-bounce-x" />
                        </button>
                      ) : isCompleted ? (
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                          <CheckCircle2 size={18} />
                          <span>Completed</span>
                        </div>
                      ) : (
                        <div className="text-sm text-slate-400 dark:text-slate-500">
                          {isLocked ? 'Complete previous step' : 'Ready to start'}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Skip Option */}
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <button
                onClick={onComplete}
                className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
              >
                <span>Skip for now</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Completion Modal */}
        {showConfetti && (
          <div className="fixed inset-0 flex items-center justify-center z-40 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full mx-4 text-center animate-scale-in shadow-2xl">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 animate-bounce-subtle">
                <PartyPopper className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
                You&apos;re All Set!
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Welcome to ResuMate! Your journey to landing your dream job starts now.
              </p>
              <button
                onClick={onComplete}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Rocket size={18} />
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
