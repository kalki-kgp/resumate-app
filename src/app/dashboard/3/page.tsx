'use client';

import { useMemo, useState } from 'react';
import { Playfair_Display, Source_Sans_3 } from 'next/font/google';
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Crown,
  FileText,
  LogOut,
  NotebookText,
  PenSquare,
  Sparkles,
} from 'lucide-react';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-playfair',
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-source-sans',
  display: 'swap',
});

type Stage = 'setup' | 'workspace';
type Tab = 'briefing' | 'portfolio' | 'market' | 'letters';

type PortfolioDoc = {
  id: string;
  title: string;
  score: number;
  status: string;
};

type MarketLead = {
  id: string;
  role: string;
  company: string;
  match: number;
};

type Letter = {
  id: string;
  company: string;
  tone: string;
  state: string;
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

const setupTracks = [
  { id: 'executive', title: 'Executive track', note: 'Leadership-first narrative and metrics.' },
  { id: 'product', title: 'Product track', note: 'Outcome-driven positioning and influence.' },
  { id: 'design', title: 'Design track', note: 'Portfolio-backed storytelling and craft.' },
] as const;

const setupTones = [
  { id: 'modern', label: 'Modern authority' },
  { id: 'classic', label: 'Classic boardroom' },
  { id: 'concise', label: 'Concise strategic' },
] as const;

const pillarOptions = [
  'Leadership impact',
  'Cross-functional influence',
  'Revenue / efficiency results',
] as const;

const initialDocs: PortfolioDoc[] = [
  { id: 'p1', title: 'Chief Product Officer Resume', score: 92, status: 'Published' },
  { id: 'p2', title: 'VP Product Narrative CV', score: 86, status: 'In Review' },
  { id: 'p3', title: 'Board Bio One-Pager', score: 79, status: 'Draft' },
];

const initialLeads: MarketLead[] = [
  { id: 'm1', role: 'Head of Product', company: 'Notion', match: 97 },
  { id: 'm2', role: 'Director, Platform', company: 'Stripe', match: 91 },
  { id: 'm3', role: 'Principal PM', company: 'Airbnb', match: 88 },
];

const initialLetters: Letter[] = [
  { id: 'c1', company: 'Notion', tone: 'Modern authority', state: 'Drafted' },
  { id: 'c2', company: 'Stripe', tone: 'Concise strategic', state: 'Ready' },
];

export default function DashboardThreePage() {
  const [stage, setStage] = useState<Stage>('setup');
  const [setupStep, setSetupStep] = useState(0);
  const [uploadSource, setUploadSource] = useState<'pdf' | 'docx' | 'linkedin' | null>(null);
  const [analysisReady, setAnalysisReady] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [selectedTone, setSelectedTone] = useState<string | null>(null);
  const [selectedPillars, setSelectedPillars] = useState<Record<string, boolean>>({});

  const [activeTab, setActiveTab] = useState<Tab>('briefing');
  const [docs, setDocs] = useState<PortfolioDoc[]>(initialDocs);
  const [leads] = useState<MarketLead[]>(initialLeads);
  const [letters, setLetters] = useState<Letter[]>(initialLetters);

  const avgScore = useMemo(
    () => Math.round(docs.reduce((sum, doc) => sum + doc.score, 0) / docs.length),
    [docs]
  );

  const selectedPillarCount = useMemo(
    () => Object.values(selectedPillars).filter(Boolean).length,
    [selectedPillars]
  );

  const canContinueStep0 = uploadSource !== null;
  const canContinueStep1 = analysisReady && selectedTone !== null;
  const canContinueStep2 = selectedTrack !== null;
  const canContinueStep3 = selectedPillarCount > 0;

  const improveDoc = (id: string) => {
    setDocs((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              score: Math.min(99, doc.score + Math.floor(Math.random() * 5) + 2),
              status: 'Refined',
            }
          : doc
      )
    );
  };

  const addDoc = () => {
    const next: PortfolioDoc = {
      id: `p${Date.now()}`,
      title: 'New Executive Draft',
      score: 70,
      status: 'Draft',
    };
    setDocs((prev) => [next, ...prev]);
    setActiveTab('portfolio');
  };

  const shortlistLead = (id: string) => {
    const lead = leads.find((item) => item.id === id);
    if (!lead) return;
    setLetters((prev) => {
      if (prev.some((letter) => letter.company === lead.company)) return prev;
      return [
        {
          id: `c${Date.now()}`,
          company: lead.company,
          tone: selectedTone || 'Modern authority',
          state: 'Drafted',
        },
        ...prev,
      ];
    });
    setActiveTab('letters');
  };

  const updateLetterState = (id: string) => {
    setLetters((prev) =>
      prev.map((letter) =>
        letter.id === id
          ? {
              ...letter,
              state: letter.state === 'Drafted' ? 'Ready' : 'Sent',
            }
          : letter
      )
    );
  };

  const togglePillar = (pillar: string) => {
    setSelectedPillars((prev) => ({ ...prev, [pillar]: !prev[pillar] }));
  };

  const signOut = () => {
    window.location.href = '/home/3';
  };

  if (stage === 'setup') {
    return (
      <div
        className={`${playfair.variable} ${sourceSans.variable} min-h-screen bg-[#fafafa] text-[#111111] px-4 py-10`}
        style={{ fontFamily: 'var(--font-source-sans), sans-serif' }}
      >
        <div className="pointer-events-none fixed inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#111111 1px, transparent 1px), linear-gradient(90deg, #111111 1px, transparent 1px)', backgroundSize: '66px 66px' }} />
        <div className="pointer-events-none fixed right-8 top-8 h-64 w-64 rounded-full bg-[#c9a84c]/15 blur-3xl" />

        <div className="relative mx-auto max-w-4xl border border-[#e5e5e5] bg-[#fcfaf6] p-6 shadow-[0_34px_80px_rgba(0,0,0,0.18)] sm:p-8">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#9a8451]">Editorial Setup</p>
              <h1 className="mt-2 text-4xl font-black" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                Guided Onboarding
              </h1>
              <p className="mt-2 text-sm text-[#666666]">Complete the same four-step onboarding flow before entering your workspace.</p>
            </div>
            <Crown className="h-8 w-8 text-[#c9a84c]" />
          </div>

          <div className="mb-6 h-1.5 overflow-hidden bg-[#e5e5e5]">
            <div className="h-full bg-[#c9a84c] transition-all" style={{ width: `${((setupStep + 1) / 4) * 100}%` }} />
          </div>

          <div className="mb-4 border border-[#e5e5e5] bg-white px-4 py-3">
            <p className="text-sm font-semibold text-[#111111]">{onboardingSteps[setupStep].title}</p>
            <p className="text-xs text-[#666666]">{onboardingSteps[setupStep].description}</p>
          </div>

          {setupStep === 0 && (
            <div className="space-y-3">
              <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair), serif' }}>Select source</h2>
              {[
                { id: 'pdf', label: 'Upload PDF Resume', note: 'Parse existing resume while preserving hierarchy.' },
                { id: 'docx', label: 'Upload DOCX Resume', note: 'Import editable content for structured refinement.' },
                { id: 'linkedin', label: 'Import from LinkedIn', note: 'Bring profile content directly into your workspace.' },
              ].map((source) => (
                <button
                  key={source.id}
                  type="button"
                  onClick={() => setUploadSource(source.id as 'pdf' | 'docx' | 'linkedin')}
                  className="w-full border px-4 py-3 text-left"
                  style={{
                    borderColor: uploadSource === source.id ? '#c9a84c' : '#dfdfdf',
                    backgroundColor: uploadSource === source.id ? '#fff9eb' : '#ffffff',
                  }}
                >
                  <p className="font-semibold text-[#111111]">{source.label}</p>
                  <p className="text-sm text-[#666666]">{source.note}</p>
                </button>
              ))}
            </div>
          )}

          {setupStep === 1 && (
            <div className="space-y-3">
              <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair), serif' }}>Run AI analysis</h2>
              {setupTones.map((tone) => (
                <button
                  key={tone.id}
                  type="button"
                  onClick={() => setSelectedTone(tone.label)}
                  className="w-full border px-4 py-3 text-left"
                  style={{
                    borderColor: selectedTone === tone.label ? '#c9a84c' : '#dfdfdf',
                    backgroundColor: selectedTone === tone.label ? '#fff9eb' : '#ffffff',
                  }}
                >
                  <p className="font-semibold text-[#111111]">{tone.label}</p>
                </button>
              ))}
              <div className="border border-[#dfdfdf] bg-white p-4">
                <button
                  type="button"
                  onClick={() => setAnalysisReady(true)}
                  className="inline-flex items-center gap-2 border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]"
                  style={{ borderColor: '#111111' }}
                >
                  <Sparkles className="h-4 w-4" />
                  Analyze Resume
                </button>
                {analysisReady && (
                  <p className="mt-3 text-sm text-[#666666]">
                    Analysis complete: ATS diagnostics and optimization notes are ready.
                  </p>
                )}
              </div>
            </div>
          )}

          {setupStep === 2 && (
            <div className="space-y-3">
              <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair), serif' }}>Select job focus track</h2>
              {setupTracks.map((track) => (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => setSelectedTrack(track.id)}
                  className="w-full border px-4 py-3 text-left"
                  style={{
                    borderColor: selectedTrack === track.id ? '#c9a84c' : '#dfdfdf',
                    backgroundColor: selectedTrack === track.id ? '#fff9eb' : '#ffffff',
                  }}
                >
                  <p className="font-semibold text-[#111111]">{track.title}</p>
                  <p className="text-sm text-[#666666]">{track.note}</p>
                </button>
              ))}
            </div>
          )}

          {setupStep === 3 && (
            <div className="space-y-3">
              <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair), serif' }}>Enable tracking pillars</h2>
              {pillarOptions.map((pillar) => (
                <button
                  key={pillar}
                  type="button"
                  onClick={() => togglePillar(pillar)}
                  className="flex w-full items-center justify-between border px-4 py-3 text-left"
                  style={{
                    borderColor: selectedPillars[pillar] ? '#c9a84c' : '#dfdfdf',
                    backgroundColor: selectedPillars[pillar] ? '#fff9eb' : '#ffffff',
                  }}
                >
                  <span className="text-sm text-[#333333]">{pillar}</span>
                  <Check className={`h-4 w-4 ${selectedPillars[pillar] ? 'text-[#111111]' : 'text-[#b9b9b9]'}`} />
                </button>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {setupStep > 0 && (
              <button type="button" onClick={() => setSetupStep((step) => step - 1)} className="border px-5 py-2.5 text-sm text-[#666666]" style={{ borderColor: '#dfdfdf' }}>
                Back
              </button>
            )}

            {setupStep < 3 && (
              <button
                type="button"
                onClick={() => setSetupStep((step) => step + 1)}
                disabled={
                  (setupStep === 0 && !canContinueStep0) ||
                  (setupStep === 1 && !canContinueStep1) ||
                  (setupStep === 2 && !canContinueStep2)
                }
                className="inline-flex items-center gap-2 border px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                style={{ borderColor: '#111111', backgroundColor: '#ffffff', color: '#111111' }}
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            )}

            {setupStep === 3 && (
              <button
                type="button"
                onClick={() => setStage('workspace')}
                disabled={!canContinueStep3}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#111111] disabled:cursor-not-allowed disabled:opacity-40"
                style={{ backgroundColor: '#c9a84c' }}
              >
                Enter Atelier
                <Sparkles className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${playfair.variable} ${sourceSans.variable} min-h-screen bg-[#fafafa] text-[#111111]`}
      style={{ fontFamily: 'var(--font-source-sans), sans-serif' }}
    >
      <div className="pointer-events-none fixed inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#111111 1px, transparent 1px), linear-gradient(90deg, #111111 1px, transparent 1px)', backgroundSize: '72px 72px' }} />

      <div className="relative mx-auto grid min-h-screen max-w-7xl gap-0 lg:grid-cols-[240px_1fr]">
        <aside className="border-r border-[#e5e5e5] bg-[#f7f5f1] p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-[#9a8451]">ResuMate</p>
          <h1 className="mt-3 text-3xl font-black" style={{ fontFamily: 'var(--font-playfair), serif' }}>
            Editorial
            <br />
            Atelier
          </h1>

          <div className="mt-8 space-y-2">
            {(['briefing', 'portfolio', 'market', 'letters'] as Tab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className="w-full border px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.22em]"
                style={{
                  borderColor: activeTab === tab ? '#c9a84c' : '#e0dccf',
                  color: activeTab === tab ? '#111111' : '#666666',
                  backgroundColor: activeTab === tab ? '#fff9eb' : 'transparent',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <button type="button" onClick={signOut} className="mt-8 inline-flex w-full items-center justify-center gap-2 border px-3 py-2.5 text-sm text-[#666666]" style={{ borderColor: '#dfdfdf' }}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </aside>

        <main className="p-5 sm:p-7 lg:p-8">
          <header className="mb-6 border-b border-[#e5e5e5] pb-4">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#9a8451]">Premium command sheet</p>
                <h2 className="mt-1 text-4xl font-black" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                  {activeTab === 'briefing' && 'Weekly Briefing'}
                  {activeTab === 'portfolio' && 'Portfolio Desk'}
                  {activeTab === 'market' && 'Market Watch'}
                  {activeTab === 'letters' && 'Letters Studio'}
                </h2>
              </div>
              <button type="button" onClick={addDoc} className="inline-flex items-center gap-2 border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]" style={{ borderColor: '#c9a84c', backgroundColor: '#fff9eb' }}>
                <PenSquare className="h-4 w-4" />
                New Draft
              </button>
              <button type="button" onClick={() => (window.location.href = '/editor/3')} className="inline-flex items-center gap-2 border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]" style={{ borderColor: '#111111', backgroundColor: '#ffffff' }}>
                Open Editor
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </header>

          {activeTab === 'briefing' && (
            <section className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
              <article className="border border-[#e5e5e5] bg-white p-5">
                <h3 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair), serif' }}>Editorial highlights</h3>
                <div className="mt-4 space-y-2 text-sm text-[#555]">
                  <p className="border border-[#ececec] bg-[#fcfcfc] px-3 py-2">Narrative consistency improved by 11 points this week.</p>
                  <p className="border border-[#ececec] bg-[#fcfcfc] px-3 py-2">Leadership impact language now appears in all primary resumes.</p>
                  <p className="border border-[#ececec] bg-[#fcfcfc] px-3 py-2">Three high-fit roles are ready for tailored applications.</p>
                </div>
              </article>

              <article className="border border-[#e5e5e5] bg-white p-5">
                <h3 className="text-lg font-semibold">Performance index</h3>
                <div className="mt-3 space-y-3 text-sm">
                  <div className="border border-[#ececec] bg-[#fcfcfc] px-3 py-2">
                    <p className="text-[#777]">Portfolio average</p>
                    <p className="text-2xl font-bold text-[#111]">{avgScore}%</p>
                  </div>
                  <div className="border border-[#ececec] bg-[#fcfcfc] px-3 py-2">
                    <p className="text-[#777]">Live market leads</p>
                    <p className="text-2xl font-bold text-[#111]">{leads.length}</p>
                  </div>
                </div>
              </article>
            </section>
          )}

          {activeTab === 'portfolio' && (
            <section className="space-y-3">
              {docs.map((doc) => (
                <article key={doc.id} className="border border-[#e5e5e5] bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#111]">{doc.title}</p>
                      <p className="text-xs text-[#777]">Status: {doc.status}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-[#9a8451]">{doc.score}%</span>
                      <button type="button" onClick={() => improveDoc(doc.id)} className="inline-flex items-center gap-1 border px-3 py-1.5 text-xs" style={{ borderColor: '#dfdfdf' }}>
                        <Sparkles className="h-3 w-3" />
                        Refine
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}

          {activeTab === 'market' && (
            <section className="space-y-3">
              {leads.map((lead) => (
                <article key={lead.id} className="border border-[#e5e5e5] bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#111]">{lead.role}</p>
                      <p className="text-xs text-[#777]">{lead.company}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-[#9a8451]">Match {lead.match}%</span>
                      <button type="button" onClick={() => shortlistLead(lead.id)} className="inline-flex items-center gap-1 border px-3 py-1.5 text-xs" style={{ borderColor: '#dfdfdf' }}>
                        <BriefcaseBusiness className="h-3 w-3" />
                        Shortlist
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}

          {activeTab === 'letters' && (
            <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
              <article className="border border-[#e5e5e5] bg-white p-5">
                <h3 className="mb-4 text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair), serif' }}>Cover letter desk</h3>
                <div className="space-y-3">
                  {letters.map((letter) => (
                    <div key={letter.id} className="border border-[#ececec] bg-[#fcfcfc] px-3 py-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[#111]">{letter.company}</p>
                          <p className="text-xs text-[#777]">Tone: {letter.tone}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#9a8451]">{letter.state}</span>
                          <button type="button" onClick={() => updateLetterState(letter.id)} className="inline-flex items-center gap-1 border px-2.5 py-1 text-xs" style={{ borderColor: '#dfdfdf' }}>
                            Update
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="border border-[#e5e5e5] bg-white p-5">
                <h3 className="mb-3 text-lg font-semibold">Editorial checklist</h3>
                <div className="space-y-2 text-sm text-[#555]">
                  <p className="flex items-center gap-2"><Check className="h-4 w-4 text-[#111]" /> Use one quantified achievement in opening paragraph.</p>
                  <p className="flex items-center gap-2"><Check className="h-4 w-4 text-[#111]" /> Mirror two strategic terms from job description.</p>
                  <p className="flex items-center gap-2"><Check className="h-4 w-4 text-[#111]" /> Close with ownership-focused call to action.</p>
                </div>
                <div className="mt-4 border border-[#ececec] bg-[#fcfcfc] px-3 py-3 text-sm text-[#666]">
                  <p className="mb-1 flex items-center gap-2"><NotebookText className="h-4 w-4 text-[#9a8451]" /> Track: {selectedTrack || 'Not selected'}</p>
                  <p className="flex items-center gap-2"><FileText className="h-4 w-4 text-[#9a8451]" /> Tone: {selectedTone || 'Not selected'}</p>
                </div>
              </article>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
