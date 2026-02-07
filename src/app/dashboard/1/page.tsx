'use client';

import { useMemo, useState } from 'react';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import {
  ArrowRight,
  BriefcaseBusiness,
  FileText,
  LogOut,
  Radar,
  Rocket,
  ShieldCheck,
  Sparkles,
  Terminal,
  TrendingUp,
  Upload,
} from 'lucide-react';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains',
});

type Stage = 'boot' | 'workspace';
type View = 'overview' | 'resumes' | 'jobs' | 'pipeline';
type PipelineStage = 'Queued' | 'Submitted' | 'Interview' | 'Offer';

type ResumeDoc = {
  id: string;
  title: string;
  ats: number;
  updatedAt: string;
};

type JobMatch = {
  id: string;
  role: string;
  company: string;
  fit: number;
  remote: boolean;
};

type PipelineItem = {
  id: string;
  role: string;
  company: string;
  stage: PipelineStage;
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

const initialResumes: ResumeDoc[] = [
  { id: 'r1', title: 'Senior Frontend Engineer', ats: 88, updatedAt: 'Today' },
  { id: 'r2', title: 'Platform Engineer', ats: 81, updatedAt: 'Yesterday' },
  { id: 'r3', title: 'Engineering Manager', ats: 74, updatedAt: '2 days ago' },
];

const initialJobs: JobMatch[] = [
  { id: 'j1', role: 'Staff Frontend Engineer', company: 'Figma', fit: 94, remote: true },
  { id: 'j2', role: 'Senior UI Platform Engineer', company: 'Stripe', fit: 91, remote: true },
  { id: 'j3', role: 'Frontend Tech Lead', company: 'Notion', fit: 89, remote: false },
  { id: 'j4', role: 'Product Engineer', company: 'Linear', fit: 86, remote: true },
];

const stageOrder: PipelineStage[] = ['Queued', 'Submitted', 'Interview', 'Offer'];

export default function DashboardOnePage() {
  const [stage, setStage] = useState<Stage>('boot');
  const [bootIndex, setBootIndex] = useState(0);
  const [activeView, setActiveView] = useState<View>('overview');
  const [resumes, setResumes] = useState<ResumeDoc[]>(initialResumes);
  const [jobs] = useState<JobMatch[]>(initialJobs);
  const [pipeline, setPipeline] = useState<PipelineItem[]>([]);

  const avgAts = useMemo(
    () => Math.round(resumes.reduce((sum, resume) => sum + resume.ats, 0) / resumes.length),
    [resumes]
  );

  const bootProgress = Math.round((bootIndex / onboardingSteps.length) * 100);

  const runNextBootStep = () => {
    setBootIndex((current) => Math.min(current + 1, onboardingSteps.length));
  };

  const createResume = () => {
    const next: ResumeDoc = {
      id: `r${Date.now()}`,
      title: 'Untitled Command Resume',
      ats: 42,
      updatedAt: 'Just now',
    };
    setResumes((prev) => [next, ...prev]);
    setActiveView('resumes');
  };

  const importResume = () => {
    const imported: ResumeDoc = {
      id: `r${Date.now()}`,
      title: 'Imported Resume (Parsed)',
      ats: 78,
      updatedAt: 'Just now',
    };
    setResumes((prev) => [imported, ...prev]);
    setActiveView('resumes');
  };

  const rescanResume = (id: string) => {
    setResumes((prev) =>
      prev.map((resume) =>
        resume.id === id
          ? {
              ...resume,
              ats: Math.min(99, resume.ats + Math.floor(Math.random() * 8) + 2),
              updatedAt: 'Just now',
            }
          : resume
      )
    );
  };

  const queueApplication = (job: JobMatch) => {
    setPipeline((prev) => {
      if (prev.some((item) => item.id === job.id)) return prev;
      return [...prev, { id: job.id, role: job.role, company: job.company, stage: 'Queued' }];
    });
    setActiveView('pipeline');
  };

  const advancePipelineStage = (id: string) => {
    setPipeline((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const index = stageOrder.indexOf(item.stage);
        return { ...item, stage: stageOrder[Math.min(index + 1, stageOrder.length - 1)] };
      })
    );
  };

  const signOut = () => {
    window.location.href = '/home/1';
  };

  if (stage === 'boot') {
    return (
      <div
        className={`${outfit.variable} ${jetbrains.variable} min-h-screen bg-[#06080f] text-[#e2e8f0] px-4 py-10`}
        style={{ fontFamily: 'var(--font-outfit)' }}
      >
        <div className="pointer-events-none fixed inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
        <div className="pointer-events-none fixed left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#00e5a0]/15 blur-3xl" />

        <div className="relative mx-auto max-w-4xl rounded-3xl border border-[#1e2736] bg-[#0b111a]/95 p-6 sm:p-8">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#00e5a0]" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                Dark Command Center
              </p>
              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Onboarding Sequence</h1>
              <p className="mt-2 text-sm text-[#64748b]">
                Complete the core resume workflow before entering mission control.
              </p>
            </div>
            <Terminal className="h-8 w-8 text-[#00e5a0]" />
          </div>

          <div className="mb-6 h-2 overflow-hidden rounded-full bg-[#1e2736]">
            <div className="h-full bg-gradient-to-r from-[#00e5a0] to-[#3b82f6] transition-all duration-300" style={{ width: `${bootProgress}%` }} />
          </div>

          <div className="space-y-3">
            {onboardingSteps.map((step, index) => {
              const done = index < bootIndex;
              const current = index === bootIndex;
              return (
                <div key={step.title} className="flex items-center justify-between rounded-xl border border-[#1e2736] bg-[#06080f] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs ${done ? 'border-[#00e5a0] text-[#00e5a0]' : 'border-[#334155] text-[#64748b]'}`} style={{ fontFamily: 'var(--font-jetbrains)' }}>
                      {index + 1}
                    </span>
                    <div>
                      <p className={`text-sm ${current ? 'text-[#e2e8f0]' : 'text-[#94a3b8]'}`}>{step.title}</p>
                      <p className="text-xs text-[#64748b]">{step.description}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold uppercase tracking-[0.16em] ${done ? 'text-[#00e5a0]' : current ? 'text-[#3b82f6]' : 'text-[#64748b]'}`} style={{ fontFamily: 'var(--font-jetbrains)' }}>
                    {done ? 'Done' : current ? 'Running' : 'Queued'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {bootIndex < onboardingSteps.length ? (
              <button type="button" onClick={runNextBootStep} className="inline-flex items-center gap-2 rounded-lg bg-[#00e5a0] px-5 py-3 text-sm font-semibold text-[#06080f] hover:bg-[#00cc8e]">
                Run Next Check
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button type="button" onClick={() => setStage('workspace')} className="inline-flex items-center gap-2 rounded-lg bg-[#00e5a0] px-5 py-3 text-sm font-semibold text-[#06080f] hover:bg-[#00cc8e]">
                Enter Command Center
                <Rocket className="h-4 w-4" />
              </button>
            )}
            <button type="button" onClick={signOut} className="inline-flex items-center gap-2 rounded-lg border border-[#1e2736] px-5 py-3 text-sm text-[#94a3b8] hover:text-[#e2e8f0]">
              <LogOut className="h-4 w-4" />
              Exit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${outfit.variable} ${jetbrains.variable} min-h-screen bg-[#06080f] text-[#e2e8f0]`}
      style={{ fontFamily: 'var(--font-outfit)' }}
    >
      <div className="pointer-events-none fixed inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)', backgroundSize: '52px 52px' }} />
      <div className="pointer-events-none fixed right-8 top-10 h-64 w-64 rounded-full bg-[#00e5a0]/10 blur-3xl" />

      <div className="relative grid min-h-screen lg:grid-cols-[220px_1fr]">
        <aside className="border-r border-[#1e2736] bg-[#0b111a]/95 p-4 sm:p-5">
          <div className="mb-8 flex items-center gap-2">
            <Terminal className="h-5 w-5 text-[#00e5a0]" />
            <p className="font-semibold">ResuMate Ops</p>
          </div>

          <nav className="space-y-2">
            {(['overview', 'resumes', 'jobs', 'pipeline'] as View[]).map((view) => (
              <button
                key={view}
                type="button"
                onClick={() => setActiveView(view)}
                className={`w-full rounded-lg px-3 py-2.5 text-left text-sm capitalize transition-colors ${
                  activeView === view
                    ? 'bg-[#00e5a0]/15 text-[#00e5a0]'
                    : 'text-[#64748b] hover:bg-[#111827] hover:text-[#e2e8f0]'
                }`}
                style={{ fontFamily: 'var(--font-jetbrains)' }}
              >
                {view}
              </button>
            ))}
          </nav>

          <button type="button" onClick={signOut} className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#1e2736] px-3 py-2.5 text-sm text-[#94a3b8] hover:text-[#e2e8f0]">
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </aside>

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-[#1e2736] bg-[#0b111a]/95 p-4">
              <p className="text-xs text-[#64748b]">Average ATS</p>
              <p className="mt-1 text-3xl font-bold text-[#00e5a0]">{avgAts}%</p>
            </article>
            <article className="rounded-2xl border border-[#1e2736] bg-[#0b111a]/95 p-4">
              <p className="text-xs text-[#64748b]">Live Job Matches</p>
              <p className="mt-1 text-3xl font-bold">{jobs.length}</p>
            </article>
            <article className="rounded-2xl border border-[#1e2736] bg-[#0b111a]/95 p-4">
              <p className="text-xs text-[#64748b]">Pipeline Active</p>
              <p className="mt-1 text-3xl font-bold">{pipeline.length}</p>
            </article>
          </div>

          <div className="mb-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => (window.location.href = '/editor/1')}
              className="inline-flex items-center gap-2 rounded-lg bg-[#00e5a0] px-4 py-2 text-sm font-semibold text-[#06080f]"
            >
              Open Themed Editor
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {activeView === 'overview' && (
            <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
              <article className="rounded-2xl border border-[#1e2736] bg-[#0b111a]/95 p-5">
                <h2 className="text-xl font-bold">System Snapshot</h2>
                <div className="mt-4 space-y-3 text-sm">
                  <p className="flex items-center gap-2 text-[#94a3b8]"><ShieldCheck className="h-4 w-4 text-[#00e5a0]" /> ATS parser health is stable.</p>
                  <p className="flex items-center gap-2 text-[#94a3b8]"><Radar className="h-4 w-4 text-[#00e5a0]" /> 4 high-fit roles surfaced in the last 24h.</p>
                  <p className="flex items-center gap-2 text-[#94a3b8]"><TrendingUp className="h-4 w-4 text-[#00e5a0]" /> Response rate trend is up 18% week-over-week.</p>
                </div>
              </article>

              <article className="rounded-2xl border border-[#1e2736] bg-[#0b111a]/95 p-5">
                <h3 className="text-lg font-semibold">Quick Actions</h3>
                <div className="mt-4 grid gap-2">
                  <button type="button" onClick={importResume} className="inline-flex items-center justify-between rounded-lg border border-[#1e2736] bg-[#06080f] px-3 py-2.5 text-sm hover:border-[#00e5a0]/40">
                    Import Resume
                    <Upload className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={createResume} className="inline-flex items-center justify-between rounded-lg border border-[#1e2736] bg-[#06080f] px-3 py-2.5 text-sm hover:border-[#00e5a0]/40">
                    Create Resume
                    <FileText className="h-4 w-4" />
                  </button>
                </div>
              </article>
            </section>
          )}

          {activeView === 'resumes' && (
            <section className="rounded-2xl border border-[#1e2736] bg-[#0b111a]/95 p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-bold">Resume Fleet</h2>
                <button type="button" onClick={createResume} className="inline-flex items-center gap-2 rounded-lg bg-[#00e5a0] px-3 py-2 text-sm font-semibold text-[#06080f]">
                  <Sparkles className="h-4 w-4" />
                  New Draft
                </button>
              </div>
              <div className="space-y-3">
                {resumes.map((resume) => (
                  <div key={resume.id} className="rounded-xl border border-[#1e2736] bg-[#06080f] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{resume.title}</p>
                        <p className="text-xs text-[#64748b]">Updated {resume.updatedAt}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#00e5a0]">{resume.ats}%</p>
                        <button type="button" onClick={() => rescanResume(resume.id)} className="text-xs text-[#3b82f6] hover:text-[#60a5fa]">
                          Re-run Scan
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeView === 'jobs' && (
            <section className="rounded-2xl border border-[#1e2736] bg-[#0b111a]/95 p-5">
              <h2 className="mb-4 text-xl font-bold">Job Match Radar</h2>
              <div className="space-y-3">
                {jobs.map((job) => (
                  <div key={job.id} className="rounded-xl border border-[#1e2736] bg-[#06080f] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{job.role}</p>
                        <p className="text-xs text-[#64748b]">{job.company} · {job.remote ? 'Remote' : 'Hybrid / Onsite'}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm text-[#00e5a0]">Fit {job.fit}%</p>
                        <button type="button" onClick={() => queueApplication(job)} className="inline-flex items-center gap-1 rounded-lg bg-[#00e5a0] px-3 py-1.5 text-xs font-semibold text-[#06080f]">
                          Queue
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeView === 'pipeline' && (
            <section className="rounded-2xl border border-[#1e2736] bg-[#0b111a]/95 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Application Pipeline</h2>
                <span className="text-xs text-[#64748b]" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                  Track • Promote • Offer
                </span>
              </div>

              {pipeline.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#1e2736] bg-[#06080f] px-4 py-8 text-center text-sm text-[#64748b]">
                  Queue a job from the radar to start the pipeline.
                </div>
              ) : (
                <div className="space-y-3">
                  {pipeline.map((item) => (
                    <div key={item.id} className="rounded-xl border border-[#1e2736] bg-[#06080f] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{item.role}</p>
                          <p className="text-xs text-[#64748b]">{item.company}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-[#00e5a0]/15 px-2 py-1 text-xs text-[#00e5a0]">{item.stage}</span>
                          <button type="button" onClick={() => advancePipelineStage(item.id)} className="inline-flex items-center gap-1 rounded-lg border border-[#1e2736] px-2.5 py-1.5 text-xs text-[#94a3b8] hover:text-[#e2e8f0]">
                            Advance
                            <BriefcaseBusiness className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
