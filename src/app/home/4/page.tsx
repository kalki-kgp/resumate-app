'use client';

import { useState, useEffect } from 'react';
import { Sora, Plus_Jakarta_Sans } from 'next/font/google';
import {
  Sparkles,
  ScanSearch,
  Briefcase,
  LayoutTemplate,
  FileText,
  BarChart3,
  ArrowRight,
  Play,
  Star,
  Quote,
  Upload,
  Cpu,
  Rocket,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sora',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
});

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const navLinks = ['Features', 'Templates', 'Pricing', 'About'];

const features = [
  {
    icon: Sparkles,
    title: 'AI Writer',
    description:
      'Generate polished bullet points and summaries powered by GPT. Just describe your role and watch magic happen.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: ScanSearch,
    title: 'ATS Scanner',
    description:
      'Real-time scoring against applicant tracking systems. Know your pass rate before you hit apply.',
    gradient: 'from-pink-500 to-blue-500',
  },
  {
    icon: Briefcase,
    title: 'Job Matcher',
    description:
      'Paste a job listing and our AI tailors your resume to match keywords, tone, and requirements.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: LayoutTemplate,
    title: 'Template Studio',
    description:
      'Dozens of designer-crafted templates with live preview. Switch layouts without losing content.',
    gradient: 'from-cyan-500 to-purple-500',
  },
  {
    icon: FileText,
    title: 'Cover Letters',
    description:
      'Auto-generate targeted cover letters that complement your resume and match the job posting.',
    gradient: 'from-purple-500 to-blue-500',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description:
      'Track views, downloads, and application success rates. Data-driven career decisions.',
    gradient: 'from-pink-500 to-cyan-500',
  },
];

const steps = [
  {
    number: '01',
    title: 'Import or Start Fresh',
    description:
      'Upload an existing resume or start from a blank canvas. Our parser extracts every detail in seconds.',
    icon: Upload,
  },
  {
    number: '02',
    title: 'AI Perfects Your Resume',
    description:
      'Our AI rewrites, restructures, and optimizes your content for maximum impact and ATS compatibility.',
    icon: Cpu,
  },
  {
    number: '03',
    title: 'Apply & Get Hired',
    description:
      'Export in multiple formats, track applications, and land interviews faster than ever before.',
    icon: Rocket,
  },
];

const testimonials = [
  {
    quote:
      'ResuMate completely transformed my job search. I went from zero callbacks to 5 interviews in two weeks. The AI suggestions were eerily accurate.',
    name: 'Sarah Chen',
    role: 'Product Designer at Figma',
    avatar: 'SC',
  },
  {
    quote:
      'The ATS scanner alone is worth it. I had no idea my resume was being filtered out. After optimizing with ResuMate, my score jumped from 34% to 96%.',
    name: 'Marcus Johnson',
    role: 'Senior Engineer at Stripe',
    avatar: 'MJ',
  },
  {
    quote:
      'I used to spend hours formatting resumes. Now I just describe my experience and ResuMate handles the rest. It feels like having a personal career coach.',
    name: 'Priya Patel',
    role: 'Data Scientist at Netflix',
    avatar: 'PP',
  },
];

const templatePreviews = [
  { name: 'Minimal', accent: 'from-purple-500 to-pink-500' },
  { name: 'Executive', accent: 'from-blue-500 to-cyan-500' },
  { name: 'Creative', accent: 'from-pink-500 to-purple-500' },
  { name: 'Technical', accent: 'from-cyan-500 to-blue-500' },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function VividGlassHomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`${sora.variable} ${plusJakarta.variable} relative min-h-screen overflow-x-hidden`}
      style={{ background: '#0a0118', fontFamily: 'var(--font-plus-jakarta), sans-serif' }}
    >
      {/* ============================================================ */}
      {/*  GRADIENT MESH BACKGROUND                                     */}
      {/* ============================================================ */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        {/* Purple blob - top left */}
        <div
          className="absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
        {/* Pink blob - center right */}
        <div
          className="absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)',
            filter: 'blur(120px)',
          }}
        />
        {/* Blue blob - bottom left */}
        <div
          className="absolute -left-20 bottom-1/4 h-[550px] w-[550px] rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
        {/* Cyan blob - far right */}
        <div
          className="absolute -right-20 bottom-0 h-[400px] w-[400px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
            filter: 'blur(110px)',
          }}
        />
      </div>

      {/* ============================================================ */}
      {/*  NAVIGATION                                                   */}
      {/* ============================================================ */}
      <nav
        className={`fixed left-1/2 top-4 z-50 w-[95%] max-w-6xl -translate-x-1/2 rounded-2xl border border-white/10 px-6 py-3 transition-all duration-500 ${
          scrolled ? 'bg-white/10 shadow-lg shadow-purple-500/5' : 'bg-white/5'
        }`}
        style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500" />
            <span
              className="text-xl font-bold text-white"
              style={{ fontFamily: 'var(--font-sora), sans-serif' }}
            >
              ResuMate
            </span>
          </div>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-sm text-white/60 transition-colors hover:text-white hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <button className="rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 px-5 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-purple-500/25 active:scale-95">
              Get Started
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="text-white md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="mt-4 flex flex-col gap-4 border-t border-white/10 pt-4 md:hidden">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-sm text-white/60 transition-colors hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link}
              </a>
            ))}
            <button className="mt-1 w-full rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white">
              Get Started
            </button>
          </div>
        )}
      </nav>

      {/* ============================================================ */}
      {/*  HERO SECTION                                                 */}
      {/* ============================================================ */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-28 pb-20 text-center">
        {/* Extra decorative orb behind hero */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/3 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, #a855f7 0%, #ec4899 40%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        <div className="relative z-10 mx-auto max-w-4xl">
          <h1
            className="mb-6 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ fontFamily: 'var(--font-sora), sans-serif' }}
          >
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Build resumes
            </span>
            <br />
            <span className="text-white">from the future.</span>
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-lg text-white/60 sm:text-xl">
            AI-powered. ATS-optimized. Impossibly fast.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:shadow-purple-500/30 active:scale-95">
              Start Creating
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
            <button
              className="flex items-center gap-2 rounded-2xl border border-white/10 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/5"
              style={{ backdropFilter: 'blur(12px)' }}
            >
              <Play size={16} className="text-purple-400" />
              See How It Works
            </button>
          </div>
        </div>

        {/* Floating stat cards */}
        <div className="relative z-10 mx-auto mt-20 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { value: '50K+', label: 'Active Users', y: '0' },
            { value: '92%', label: 'ATS Score', y: '-12px' },
            { value: '4.8\u2605', label: 'Rating', y: '4px' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-center transition-all hover:border-white/20 hover:bg-white/[0.08]"
              style={{
                backdropFilter: 'blur(16px)',
                transform: `translateY(${stat.y})`,
              }}
            >
              <p
                className="mb-1 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-3xl font-bold text-transparent"
                style={{ fontFamily: 'var(--font-sora), sans-serif' }}
              >
                {stat.value}
              </p>
              <p className="text-sm text-white/50">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FEATURES SECTION                                             */}
      {/* ============================================================ */}
      <section id="features" className="relative z-10 px-4 py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2
              className="mb-4 text-4xl font-bold text-white sm:text-5xl"
              style={{ fontFamily: 'var(--font-sora), sans-serif' }}
            >
              Supercharged{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Features
              </span>
            </h2>
            <p className="mx-auto max-w-lg text-white/50">
              Everything you need to craft the perfect resume, powered by cutting-edge AI.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group relative rounded-2xl border border-white/10 bg-white/5 p-7 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:shadow-lg hover:shadow-purple-500/5"
                  style={{ backdropFilter: 'blur(16px)' }}
                >
                  {/* Hover glow */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background:
                        'radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 80%), rgba(168,85,247,0.06), transparent 60%)',
                    }}
                  />

                  {/* Gradient icon circle */}
                  <div
                    className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg`}
                    style={{
                      boxShadow: '0 8px 24px -6px rgba(168,85,247,0.3)',
                    }}
                  >
                    <Icon size={22} className="text-white" />
                  </div>

                  <h3
                    className="mb-2 text-lg font-semibold text-white"
                    style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/50">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  PRODUCT SHOWCASE                                             */}
      {/* ============================================================ */}
      <section className="relative z-10 px-4 py-28">
        {/* Decorative orbs */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-10 top-1/3 h-[300px] w-[300px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #a855f7, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-10 top-1/2 h-[250px] w-[250px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, #3b82f6, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2
              className="mb-4 text-4xl font-bold sm:text-5xl"
              style={{ fontFamily: 'var(--font-sora), sans-serif' }}
            >
              <span className="text-white">See the </span>
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                magic
              </span>
            </h2>
            <p className="mx-auto max-w-lg text-white/50">
              A powerful editor that makes resume building feel effortless.
            </p>
          </div>

          {/* Editor mockup - large glass panel */}
          <div
            className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/5"
            style={{ backdropFilter: 'blur(20px)' }}
          >
            {/* Top bar */}
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
              <div className="h-3 w-3 rounded-full bg-red-400/70" />
              <div className="h-3 w-3 rounded-full bg-yellow-400/70" />
              <div className="h-3 w-3 rounded-full bg-green-400/70" />
              <span className="ml-4 text-xs text-white/30">ResuMate Editor</span>
            </div>

            <div className="flex min-h-[420px] flex-col md:flex-row">
              {/* Sidebar */}
              <div className="w-full border-b border-white/10 p-6 md:w-72 md:border-b-0 md:border-r">
                <p
                  className="mb-4 text-sm font-semibold text-white/80"
                  style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                >
                  Personal Info
                </p>
                {['Full Name', 'Email Address', 'Phone', 'Location'].map((label) => (
                  <div key={label} className="mb-3">
                    <label className="mb-1 block text-xs text-white/40">{label}</label>
                    <div className="h-9 rounded-lg border border-white/10 bg-white/5" />
                  </div>
                ))}
                <p
                  className="mb-3 mt-6 text-sm font-semibold text-white/80"
                  style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                >
                  Experience
                </p>
                <div className="mb-2 rounded-lg border border-white/10 bg-white/5 p-3">
                  <div className="mb-1.5 h-3 w-3/4 rounded bg-white/10" />
                  <div className="mb-1.5 h-2 w-1/2 rounded bg-white/5" />
                  <div className="h-2 w-5/6 rounded bg-white/5" />
                </div>
                <button className="mt-1 flex items-center gap-1 text-xs text-purple-400">
                  <Sparkles size={12} /> AI Enhance
                </button>
              </div>

              {/* Preview area */}
              <div className="flex-1 p-8">
                <div className="mx-auto max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  {/* Name */}
                  <div className="mb-1 h-5 w-40 rounded bg-gradient-to-r from-purple-400/30 to-pink-400/30" />
                  <div className="mb-4 h-3 w-56 rounded bg-white/10" />
                  {/* Divider */}
                  <div className="mb-4 h-px w-full bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-transparent" />
                  {/* Summary */}
                  <div className="mb-1 h-2.5 w-full rounded bg-white/10" />
                  <div className="mb-1 h-2.5 w-full rounded bg-white/10" />
                  <div className="mb-5 h-2.5 w-3/4 rounded bg-white/10" />
                  {/* Experience header */}
                  <div className="mb-3 h-3.5 w-24 rounded bg-purple-400/20" />
                  <div className="mb-1 h-2.5 w-48 rounded bg-white/10" />
                  <div className="mb-1 h-2 w-32 rounded bg-white/5" />
                  <div className="mb-1 h-2 w-full rounded bg-white/5" />
                  <div className="mb-1 h-2 w-full rounded bg-white/5" />
                  <div className="mb-4 h-2 w-5/6 rounded bg-white/5" />
                  {/* Skills */}
                  <div className="mb-3 h-3.5 w-16 rounded bg-purple-400/20" />
                  <div className="flex flex-wrap gap-2">
                    {['React', 'TypeScript', 'Node.js', 'Python', 'AWS'].map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] text-white/40"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Template previews */}
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {templatePreviews.map((tpl) => (
              <div
                key={tpl.name}
                className="group cursor-pointer rounded-xl border border-white/10 bg-white/5 p-4 text-center transition-all hover:border-white/20 hover:bg-white/[0.08]"
                style={{ backdropFilter: 'blur(12px)' }}
              >
                <div
                  className={`mx-auto mb-3 h-20 w-14 rounded-lg bg-gradient-to-b ${tpl.accent} opacity-30 transition-opacity group-hover:opacity-50`}
                />
                <p className="text-xs font-medium text-white/60 group-hover:text-white/80">
                  {tpl.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  HOW IT WORKS                                                 */}
      {/* ============================================================ */}
      <section className="relative z-10 px-4 py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <h2
              className="mb-4 text-4xl font-bold text-white sm:text-5xl"
              style={{ fontFamily: 'var(--font-sora), sans-serif' }}
            >
              How It{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="mx-auto max-w-md text-white/50">
              Three simple steps to a job-winning resume.
            </p>
          </div>

          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Gradient connecting line (desktop) */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-[16.6%] right-[16.6%] top-16 hidden h-0.5 md:block"
              style={{
                background: 'linear-gradient(90deg, #a855f7, #ec4899, #3b82f6)',
                opacity: 0.25,
              }}
            />

            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="relative rounded-2xl border border-white/10 bg-white/5 p-8 text-center transition-all hover:border-white/20 hover:bg-white/[0.08]"
                  style={{ backdropFilter: 'blur(16px)' }}
                >
                  {/* Large gradient number */}
                  <p
                    className="mx-auto mb-4 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-6xl font-extrabold text-transparent opacity-30"
                    style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                  >
                    {step.number}
                  </p>

                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400">
                    <Icon size={26} />
                  </div>

                  <h3
                    className="mb-2 text-lg font-semibold text-white"
                    style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/50">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  TESTIMONIALS                                                 */}
      {/* ============================================================ */}
      <section className="relative z-10 px-4 py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2
              className="mb-4 text-4xl font-bold text-white sm:text-5xl"
              style={{ fontFamily: 'var(--font-sora), sans-serif' }}
            >
              Loved by{' '}
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                thousands
              </span>
            </h2>
            <p className="mx-auto max-w-md text-white/50">
              Hear from people who transformed their job search with ResuMate.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => {
              const yOffsets = ['0px', '-16px', '8px'];
              return (
                <div
                  key={t.name}
                  className="relative rounded-2xl border border-white/10 bg-white/5 p-7 transition-all hover:border-white/20 hover:bg-white/[0.08]"
                  style={{
                    backdropFilter: 'blur(16px)',
                    transform: `translateY(${yOffsets[i]})`,
                    borderLeft: '2px solid',
                    borderImage: 'linear-gradient(to bottom, #a855f7, #ec4899) 1',
                  }}
                >
                  <Quote size={28} className="mb-4 text-purple-500/30" />

                  <p className="mb-6 text-sm leading-relaxed text-white/70">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-xs font-bold text-white">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-white/40">{t.role}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CTA SECTION                                                  */}
      {/* ============================================================ */}
      <section className="relative z-10 px-4 py-28">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl px-8 py-20 text-center sm:px-16">
          {/* Filled gradient background */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                'linear-gradient(135deg, #a855f7 0%, #ec4899 40%, #3b82f6 100%)',
            }}
          />

          {/* Decorative floating glass shapes */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-8 -top-8 h-36 w-36 rounded-2xl border border-white/20 bg-white/10 rotate-12"
            style={{ backdropFilter: 'blur(8px)' }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-6 -right-6 h-28 w-28 rounded-full border border-white/15 bg-white/10"
            style={{ backdropFilter: 'blur(8px)' }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-1/4 top-4 h-16 w-16 rounded-xl border border-white/10 bg-white/5 -rotate-6"
          />

          <h2
            className="relative mb-4 text-3xl font-bold text-white sm:text-5xl"
            style={{ fontFamily: 'var(--font-sora), sans-serif' }}
          >
            Your future career starts now.
          </h2>
          <p className="relative mb-10 text-lg text-white/80">
            Join 50,000+ professionals building smarter resumes.
          </p>

          <button className="relative rounded-2xl bg-white px-10 py-4 text-base font-bold text-purple-600 shadow-xl transition-all hover:shadow-2xl hover:shadow-white/20 active:scale-95">
            Start Building &mdash; Free
          </button>

          <p className="relative mt-5 text-sm text-white/60">
            No credit card &middot; Free forever plan
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FOOTER                                                       */}
      {/* ============================================================ */}
      <footer className="relative z-10 border-t border-white/10 bg-white/[0.02] px-4 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {/* Brand */}
            <div className="col-span-2 sm:col-span-1">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500" />
                <span
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                >
                  ResuMate
                </span>
              </div>
              <p className="text-sm leading-relaxed text-white/40">
                AI-powered resume builder for the modern job seeker.
              </p>
            </div>

            {/* Links */}
            {[
              {
                title: 'Product',
                links: ['Features', 'Templates', 'Pricing', 'Changelog'],
              },
              {
                title: 'Company',
                links: ['About', 'Blog', 'Careers', 'Contact'],
              },
              {
                title: 'Legal',
                links: ['Privacy', 'Terms', 'Cookies', 'Licenses'],
              },
            ].map((col) => (
              <div key={col.title}>
                <p
                  className="mb-4 text-sm font-semibold text-white/70"
                  style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                >
                  {col.title}
                </p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-white/40 transition-colors hover:text-white/70"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
            <p className="text-xs text-white/30">
              &copy; {new Date().getFullYear()} ResuMate. All rights reserved.
            </p>
            <div className="flex gap-6">
              {['Twitter', 'GitHub', 'LinkedIn'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-xs text-white/30 transition-colors hover:text-white/60"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
