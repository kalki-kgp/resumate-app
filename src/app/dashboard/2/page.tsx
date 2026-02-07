'use client';

import { useMemo, useState } from 'react';
import { Fraunces, DM_Sans } from 'next/font/google';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Heart,
  Leaf,
  LogOut,
  MessageCircle,
  Plus,
  Sparkles,
  Target,
} from 'lucide-react';

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
type Tab = 'today' | 'resumes' | 'jobs' | 'coach';

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

const onboardingSteps = [
  {
    title: 'Upload Resume',
    description: 'Import your existing resume for AI-powered optimization',
  },
  {
    title: 'AI Analysis',
    description: 'Get instant ATS score and AI-powered improvement suggestions',
  },
  {
    title: 'Find Jobs',
    description: 'Discover jobs that match your skills and experience',
  },
  {
    title: 'Apply & Track',
    description: 'Apply with tailored resumes and track your applications',
  },
] as const;

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

export default function DashboardTwoPage() {
  const [stage, setStage] = useState<Stage>('onboarding');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [uploadSource, setUploadSource] = useState<'pdf' | 'docx' | 'linkedin' | null>(null);
  const [analysisReady, setAnalysisReady] = useState(false);
  const name = 'Jordan';
  const [targetRole, setTargetRole] = useState('');
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [drafts, setDrafts] = useState<ResumeDraft[]>(initialDrafts);
  const [leads, setLeads] = useState<JobLead[]>(initialLeads);
  const [coachNotes, setCoachNotes] = useState<string[]>([
    'Your profile language is strong. Keep your summary human and specific.',
    'This week, focus on fewer applications with better tailoring.',
  ]);
  const [noteDraft, setNoteDraft] = useState('');

  const completedToday = useMemo(
    () => checklistItems.filter((item) => checked[item]).length,
    [checked]
  );

  const avgScore = useMemo(
    () => Math.round(drafts.reduce((sum, draft) => sum + draft.score, 0) / drafts.length),
    [drafts]
  );

  const canContinueStep0 = uploadSource !== null;
  const canContinueStep1 = analysisReady;
  const canContinueStep2 = targetRole.trim().length > 2;
  const canContinueStep3 = checklistItems.some((item) => checked[item]);

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

  const addCoachNote = () => {
    const clean = noteDraft.trim();
    if (!clean) return;
    setCoachNotes((prev) => [clean, ...prev]);
    setNoteDraft('');
  };

  const signOut = () => {
    window.location.href = '/home/2';
  };

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

        <div className="relative mx-auto max-w-3xl rounded-[34px] border border-[#eadfce] bg-[#fffaf4] p-6 shadow-[0_30px_70px_rgba(44,24,16,0.16)] sm:p-8">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#2d5a3d]">Warm & Human Journey</p>
              <h1 className="mt-2 text-3xl font-bold" style={{ fontFamily: 'var(--font-fraunces), serif' }}>Guided Onboarding</h1>
              <p className="mt-2 text-sm text-[#8b7355]">
                Complete the same four-step flow before entering your workspace.
              </p>
            </div>
            <Heart className="h-7 w-7 text-[#c96442]" />
          </div>

          <div className="mb-6 h-2 overflow-hidden rounded-full bg-[#f2e8da]">
            <div className="h-full bg-gradient-to-r from-[#2d5a3d] to-[#c96442] transition-all" style={{ width: `${((onboardingStep + 1) / 4) * 100}%` }} />
          </div>

          <div className="mb-4 rounded-2xl border border-[#eadfce] bg-white px-4 py-3">
            <p className="text-sm font-semibold text-[#2c1810]">{onboardingSteps[onboardingStep].title}</p>
            <p className="text-xs text-[#8b7355]">{onboardingSteps[onboardingStep].description}</p>
          </div>

          {onboardingStep === 0 && (
            <div>
              <h2 className="mb-4 text-xl font-semibold" style={{ fontFamily: 'var(--font-fraunces), serif' }}>Select source</h2>
              <div className="space-y-3">
                {[
                  { id: 'pdf', label: 'Upload PDF Resume', note: 'Best for complete resumes with fixed formatting.' },
                  { id: 'docx', label: 'Upload DOCX Resume', note: 'Best for editable resumes and structured sections.' },
                  { id: 'linkedin', label: 'Import from LinkedIn', note: 'Pull profile data and refine in one place.' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setUploadSource(item.id as 'pdf' | 'docx' | 'linkedin')}
                    className="w-full rounded-2xl border px-4 py-3 text-left"
                    style={{
                      borderColor: uploadSource === item.id ? '#c96442' : '#eadfce',
                      backgroundColor: uploadSource === item.id ? '#fff1e8' : '#ffffff',
                    }}
                  >
                    <p className="font-semibold text-[#2c1810]">{item.label}</p>
                    <p className="text-sm text-[#8b7355]">{item.note}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {onboardingStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-fraunces), serif' }}>Run analysis</h2>
              <div className="rounded-2xl border border-[#eadfce] bg-white p-4">
                <p className="text-sm text-[#5f4c3a]">
                  Analyze your uploaded resume to get ATS insights, tone improvements, and missing keywords.
                </p>
                <button
                  type="button"
                  onClick={() => setAnalysisReady(true)}
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#c96442] px-4 py-2 text-sm font-semibold text-white"
                >
                  <Sparkles className="h-4 w-4" />
                  Analyze Resume
                </button>
                {analysisReady && (
                  <p className="mt-3 text-sm text-[#2d5a3d]">
                    Analysis complete: ATS score and optimization hints generated.
                  </p>
                )}
              </div>
            </div>
          )}

          {onboardingStep === 2 && (
            <div>
              <h2 className="mb-4 text-xl font-semibold" style={{ fontFamily: 'var(--font-fraunces), serif' }}>Set job match target</h2>
              <label className="block">
                <span className="mb-1 block text-sm text-[#8b7355]">Target Role</span>
                <input
                  value={targetRole}
                  onChange={(event) => setTargetRole(event.target.value)}
                  className="w-full rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm text-[#2c1810] outline-none"
                  placeholder="Senior Product Designer"
                />
              </label>
              <p className="mt-2 text-sm text-[#8b7355]">
                We&apos;ll prioritize job matches for this role once you enter the dashboard.
              </p>
            </div>
          )}

          {onboardingStep === 3 && (
            <div>
              <h2 className="mb-4 text-xl font-semibold" style={{ fontFamily: 'var(--font-fraunces), serif' }}>Confirm tracking checklist</h2>
              <div className="space-y-3">
                {checklistItems.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleChecklist(item)}
                    className="flex w-full items-center justify-between rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-left"
                  >
                    <span className="text-sm text-[#5f4c3a]">{item}</span>
                    <CheckCircle2 className={`h-4 w-4 ${checked[item] ? 'text-[#2d5a3d]' : 'text-[#d2c3af]'}`} />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {onboardingStep > 0 && (
              <button type="button" onClick={() => setOnboardingStep((step) => step - 1)} className="rounded-full border border-[#eadfce] px-5 py-2.5 text-sm text-[#8b7355]">
                Back
              </button>
            )}

            {onboardingStep < 3 && (
              <button
                type="button"
                onClick={() => setOnboardingStep((step) => step + 1)}
                disabled={
                  (onboardingStep === 0 && !canContinueStep0) ||
                  (onboardingStep === 1 && !canContinueStep1) ||
                  (onboardingStep === 2 && !canContinueStep2)
                }
                className="inline-flex items-center gap-2 rounded-full bg-[#c96442] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            )}

            {onboardingStep === 3 && (
              <button
                type="button"
                onClick={() => setStage('workspace')}
                disabled={!canContinueStep3}
                className="inline-flex items-center gap-2 rounded-full bg-[#2d5a3d] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Open Dashboard
                <Leaf className="h-4 w-4" />
              </button>
            )}
          </div>
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
              <p className="text-xs uppercase tracking-[0.2em] text-[#2d5a3d]">Hello {name || 'friend'}</p>
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
              <button type="button" onClick={() => (window.location.href = '/editor/2')} className="inline-flex items-center gap-2 rounded-full bg-[#2d5a3d] px-4 py-2 text-sm font-semibold text-white">
                <ArrowRight className="h-4 w-4" />
                Open Editor
              </button>
              <button type="button" onClick={signOut} className="inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-white px-4 py-2 text-sm text-[#8b7355]">
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <div className="mb-5 flex flex-wrap gap-2">
          {(['today', 'resumes', 'jobs', 'coach'] as Tab[]).map((tab) => (
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

        {activeTab === 'today' && (
          <section className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
            <article className="rounded-[28px] border border-[#eadfce] bg-[#fffaf4] p-5">
              <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
                Today&apos;s gentle plan
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

        {activeTab === 'coach' && (
          <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            <article className="rounded-[28px] border border-[#eadfce] bg-[#fffaf4] p-5">
              <h2 className="mb-4 text-xl font-semibold" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
                Coach journal
              </h2>
              <label className="mb-3 block">
                <span className="mb-1 block text-sm text-[#8b7355]">Write a note</span>
                <textarea value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} className="min-h-28 w-full rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm text-[#2c1810] outline-none" placeholder="What did you learn from today&apos;s applications?" />
              </label>
              <button type="button" onClick={addCoachNote} className="inline-flex items-center gap-2 rounded-full bg-[#c96442] px-4 py-2 text-sm font-semibold text-white">
                <MessageCircle className="h-4 w-4" />
                Add Note
              </button>
            </article>

            <article className="rounded-[28px] border border-[#eadfce] bg-[#fffaf4] p-5">
              <h3 className="mb-4 text-lg font-semibold" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
                Recent reflections
              </h3>
              <div className="space-y-2">
                {coachNotes.map((note) => (
                  <div key={note} className="rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm text-[#5f4c3a]">
                    {note}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-[#2d5a3d]">
                <BookOpen className="h-4 w-4" />
                Keep writing to track momentum.
              </div>
            </article>
          </section>
        )}
      </div>
    </div>
  );
}
