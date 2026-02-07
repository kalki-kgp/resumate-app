'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import {
  Sparkles,
  ScanSearch,
  BriefcaseBusiness,
  LayoutTemplate,
  FileText,
  Mic,
  Upload,
  BotMessageSquare,
  Rocket,
  ChevronRight,
  Play,
  Star,
  Github,
  Twitter,
  Linkedin,
  Mail,
  ArrowRight,
  Terminal,
  CheckCircle2,
  TrendingUp,
  Users,
  Award,
  Lock,
  X,
} from 'lucide-react';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains',
});

/* -------------------------------------------------------------------------- */
/*  Color constants (used as Tailwind arbitrary values)                        */
/* -------------------------------------------------------------------------- */
// bg:      #06080f
// surface: #0d1117
// border:  #1e2736
// accent:  #00e5a0
// blue:    #3b82f6
// text:    #e2e8f0
// muted:   #64748b

/* -------------------------------------------------------------------------- */
/*  FEATURES DATA                                                              */
/* -------------------------------------------------------------------------- */
const features = [
  {
    icon: Sparkles,
    title: 'AI Resume Writer',
    description:
      'Generate polished, keyword-rich bullet points from a brief description of your experience. Sounds like you, tuned for recruiters.',
  },
  {
    icon: ScanSearch,
    title: 'ATS Score Analyzer',
    description:
      'Instant compatibility scoring against real applicant tracking systems. See exactly what parsers see and fix issues in one click.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Job Match Engine',
    description:
      'Paste any job listing and our AI maps your skills to requirements, highlighting gaps and suggesting improvements.',
  },
  {
    icon: LayoutTemplate,
    title: 'Smart Templates',
    description:
      'Professionally designed, ATS-tested layouts that adapt to your content length. Switch templates without losing a single word.',
  },
  {
    icon: FileText,
    title: 'Cover Letter AI',
    description:
      'Generate tailored cover letters in seconds. Each one mirrors the job description language while staying uniquely you.',
  },
  {
    icon: Mic,
    title: 'Interview Prep',
    description:
      'AI-generated practice questions based on your resume and target role. Get feedback on answers and build confidence fast.',
  },
];

/* -------------------------------------------------------------------------- */
/*  STEPS DATA                                                                 */
/* -------------------------------------------------------------------------- */
const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload or Start Fresh',
    description:
      'Import your existing resume in any format or start from a blank canvas. Our parser extracts your content intelligently.',
  },
  {
    number: '02',
    icon: BotMessageSquare,
    title: 'AI Optimizes Everything',
    description:
      'Our AI rewrites bullet points, formats sections, checks ATS compatibility, and scores your resume against target roles.',
  },
  {
    number: '03',
    icon: Rocket,
    title: 'Apply & Track',
    description:
      'Match with relevant positions, generate tailored cover letters, submit applications, and track every stage of your pipeline.',
  },
];

/* -------------------------------------------------------------------------- */
/*  TESTIMONIALS DATA                                                          */
/* -------------------------------------------------------------------------- */
const testimonials = [
  {
    quote:
      'I rewrote my resume with ResuMate on a Sunday night and had three interview requests by Wednesday. The ATS analyzer alone is worth it.',
    name: 'Priya Sharma',
    role: 'Senior Software Engineer',
    company: 'Stripe',
  },
  {
    quote:
      'As a PM, storytelling on a resume is everything. ResuMate helped me quantify impact I didn\'t even realize I had. Landed my dream role.',
    name: 'Marcus Chen',
    role: 'Product Manager',
    company: 'Figma',
  },
  {
    quote:
      'I was mass-applying with a generic resume for months. ResuMate\'s job-match feature showed me exactly what to change for each role. Game changer.',
    name: 'Elena Vasquez',
    role: 'UX Designer',
    company: 'Airbnb',
  },
];

/* -------------------------------------------------------------------------- */
/*  STATS DATA                                                                 */
/* -------------------------------------------------------------------------- */
const stats = [
  { value: '50,000+', label: 'Resumes created', icon: FileText },
  { value: '92%', label: 'ATS pass rate', icon: CheckCircle2 },
  { value: '3x', label: 'Faster job placement', icon: TrendingUp },
  { value: '4.8/5', label: 'User rating', icon: Star },
];

/* -------------------------------------------------------------------------- */
/*  ATS GAUGE COMPONENT                                                        */
/* -------------------------------------------------------------------------- */
const ATSGauge = () => {
  const [score, setScore] = useState(0);
  const gaugeRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let current = 0;
          const target = 92;
          const interval = setInterval(() => {
            current += 1;
            setScore(current);
            if (current >= target) clearInterval(interval);
          }, 18);
        }
      },
      { threshold: 0.3 }
    );
    if (gaugeRef.current) observer.observe(gaugeRef.current);
    return () => observer.disconnect();
  }, []);

  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div ref={gaugeRef} className="flex flex-col items-center gap-1">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#1e2736"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
          />
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00e5a0" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl font-bold text-[#00e5a0]"
            style={{ fontFamily: 'var(--font-jetbrains)' }}
          >
            {score}
          </span>
          <span className="text-[10px] text-[#64748b] uppercase tracking-wider">
            ATS Score
          </span>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  SKILL BAR COMPONENT                                                        */
/* -------------------------------------------------------------------------- */
const SkillBar = ({
  label,
  percent,
  delay,
}: {
  label: string;
  percent: number;
  delay: number;
}) => {
  const [width, setWidth] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          setTimeout(() => setWidth(percent), delay);
        }
      },
      { threshold: 0.3 }
    );
    if (barRef.current) observer.observe(barRef.current);
    return () => observer.disconnect();
  }, [percent, delay]);

  return (
    <div ref={barRef} className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-[#e2e8f0]">{label}</span>
        <span
          className="text-[#64748b]"
          style={{ fontFamily: 'var(--font-jetbrains)' }}
        >
          {width}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-[#1e2736] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#00e5a0] to-[#3b82f6]"
          style={{
            width: `${width}%`,
            transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  SECTION REVEAL HOOK                                                        */
/* -------------------------------------------------------------------------- */
const useSectionReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};

type AuthMode = 'signin' | 'signup';

const HomeOneAuthModal = ({
  isOpen,
  mode,
  onModeChange,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
  onSubmit: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-4 py-8">
      <button
        type="button"
        className="absolute inset-0 bg-[#03060d]/85 backdrop-blur-md"
        onClick={onClose}
        aria-label="Close login modal"
      />
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-[#1e2736] bg-[#0b111a] shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-28 right-8 h-56 w-56 rounded-full bg-[#00e5a0]/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-4 h-44 w-44 rounded-full bg-[#3b82f6]/15 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
        </div>

        <div className="relative border-b border-[#1e2736] px-6 py-5 sm:px-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p
                className="text-[11px] uppercase tracking-[0.22em] text-[#00e5a0]"
                style={{ fontFamily: 'var(--font-jetbrains)' }}
              >
                Secure Session
              </p>
              <h3 className="mt-1 text-2xl font-bold text-[#e2e8f0]">
                {mode === 'signin' ? 'Access Command Center' : 'Create Operator Profile'}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#1e2736] text-[#64748b] transition-colors hover:text-[#e2e8f0]"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="inline-flex rounded-lg border border-[#1e2736] bg-[#06080f] p-1">
            <button
              type="button"
              onClick={() => onModeChange('signin')}
              className={`rounded-md px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-all ${
                mode === 'signin'
                  ? 'bg-[#00e5a0] text-[#06080f]'
                  : 'text-[#64748b] hover:text-[#e2e8f0]'
              }`}
              style={{ fontFamily: 'var(--font-jetbrains)' }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => onModeChange('signup')}
              className={`rounded-md px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-all ${
                mode === 'signup'
                  ? 'bg-[#00e5a0] text-[#06080f]'
                  : 'text-[#64748b] hover:text-[#e2e8f0]'
              }`}
              style={{ fontFamily: 'var(--font-jetbrains)' }}
            >
              Sign Up
            </button>
          </div>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
          className="relative space-y-4 px-6 py-6 sm:px-8 sm:py-7"
        >
          {mode === 'signup' && (
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-[#64748b]">
                Full Name
              </span>
              <input
                type="text"
                placeholder="Jane Doe"
                className="w-full rounded-lg border border-[#1e2736] bg-[#06080f] px-3 py-3 text-sm text-[#e2e8f0] outline-none transition-colors placeholder:text-[#475569] focus:border-[#00e5a0]/60"
              />
            </label>
          )}

          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-[#64748b]">
              Email
            </span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#475569]" />
              <input
                type="email"
                placeholder="you@company.com"
                className="w-full rounded-lg border border-[#1e2736] bg-[#06080f] py-3 pr-3 pl-10 text-sm text-[#e2e8f0] outline-none transition-colors placeholder:text-[#475569] focus:border-[#00e5a0]/60"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-[#64748b]">
              Password
            </span>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#475569]" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-[#1e2736] bg-[#06080f] py-3 pr-3 pl-10 text-sm text-[#e2e8f0] outline-none transition-colors placeholder:text-[#475569] focus:border-[#00e5a0]/60"
              />
            </div>
          </label>

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#00e5a0] px-4 py-3 text-sm font-semibold text-[#06080f] transition-all hover:bg-[#00cc8e] hover:shadow-[0_0_28px_rgba(0,229,160,0.35)]"
          >
            {mode === 'signin' ? 'Launch Session' : 'Create Account'}
            <ArrowRight className="h-4 w-4" />
          </button>

          <p
            className="pt-1 text-center text-[11px] uppercase tracking-[0.16em] text-[#64748b]"
            style={{ fontFamily: 'var(--font-jetbrains)' }}
          >
            Encrypted authentication. No spam.
          </p>
        </form>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  MAIN PAGE COMPONENT                                                        */
/* -------------------------------------------------------------------------- */
export default function DarkCommandCenter() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setIsAuthOpen(true);
    setMobileMenuOpen(false);
  };

  const handleAuthSubmit = () => {
    setIsAuthOpen(false);
    router.push('/dashboard/1');
  };

  // Scroll detection for navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isAuthOpen) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsAuthOpen(false);
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isAuthOpen]);

  // Section reveal hooks
  const heroReveal = useSectionReveal();
  const featuresReveal = useSectionReveal();
  const stepsReveal = useSectionReveal();
  const statsReveal = useSectionReveal();
  const testimonialsReveal = useSectionReveal();
  const ctaReveal = useSectionReveal();

  return (
    <div
      className={`${outfit.variable} ${jetbrainsMono.variable} min-h-screen bg-[#06080f] text-[#e2e8f0] overflow-x-hidden`}
      style={{ fontFamily: 'var(--font-outfit)' }}
    >
      {/* ================================================================== */}
      {/*  NAVIGATION                                                        */}
      {/* ================================================================== */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#06080f]/80 backdrop-blur-xl border-b border-[#1e2736]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <a href="#" className="flex items-center gap-1.5 group">
              <Terminal className="w-5 h-5 text-[#00e5a0]" />
              <span className="text-lg font-bold tracking-tight text-[#e2e8f0]">
                ResuMate
              </span>
              <span className="inline-block w-[2px] h-5 bg-[#00e5a0] animate-pulse" />
            </a>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm text-[#64748b] hover:text-[#e2e8f0] transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm text-[#64748b] hover:text-[#e2e8f0] transition-colors"
              >
                How it Works
              </a>
              <a
                href="#pricing"
                className="text-sm text-[#64748b] hover:text-[#e2e8f0] transition-colors"
              >
                Pricing
              </a>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              <button
                type="button"
                onClick={() => openAuth('signin')}
                className="text-sm text-[#64748b] hover:text-[#e2e8f0] transition-colors"
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => openAuth('signup')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-[#00e5a0] text-[#06080f] hover:bg-[#00cc8e] transition-colors"
              >
                Get Started
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-[#64748b] hover:text-[#e2e8f0]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-5 flex flex-col gap-1.5">
                <span
                  className={`block h-[2px] bg-current transition-all duration-300 ${
                    mobileMenuOpen ? 'rotate-45 translate-y-[5px]' : ''
                  }`}
                />
                <span
                  className={`block h-[2px] bg-current transition-all duration-300 ${
                    mobileMenuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`block h-[2px] bg-current transition-all duration-300 ${
                    mobileMenuOpen ? '-rotate-45 -translate-y-[5px]' : ''
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-[#1e2736] py-4 space-y-3 animate-fade-in">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-[#64748b] hover:text-[#e2e8f0] py-2"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-[#64748b] hover:text-[#e2e8f0] py-2"
              >
                How it Works
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-[#64748b] hover:text-[#e2e8f0] py-2"
              >
                Pricing
              </a>
              <div className="pt-2 border-t border-[#1e2736] flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => openAuth('signin')}
                  className="text-sm text-[#64748b] hover:text-[#e2e8f0] text-left py-1"
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => openAuth('signup')}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#00e5a0] text-[#06080f]"
                >
                  Get Started
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ================================================================== */}
      {/*  HERO SECTION                                                       */}
      {/* ================================================================== */}
      <section className="relative pt-32 md:pt-40 pb-20 md:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-[0.07]"
            style={{
              background:
                'radial-gradient(ellipse at center, #00e5a0 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full opacity-[0.04]"
            style={{
              background:
                'radial-gradient(ellipse at center, #3b82f6 0%, transparent 70%)',
            }}
          />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div
          ref={heroReveal.ref}
          className={`max-w-7xl mx-auto relative transition-all duration-1000 ${
            heroReveal.isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left column - Copy */}
            <div className="max-w-xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1e2736] bg-[#0d1117] mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e5a0] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00e5a0]" />
                </span>
                <span
                  className="text-xs text-[#64748b]"
                  style={{ fontFamily: 'var(--font-jetbrains)' }}
                >
                  v2.0 now live — AI Cover Letters
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
                Your career,{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      'linear-gradient(135deg, #00e5a0 0%, #3b82f6 100%)',
                  }}
                >
                  engineered.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#64748b] leading-relaxed mb-8 max-w-lg">
                AI-powered resume building and job matching. Analyze, optimize,
                and land interviews 3x faster.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <button
                  type="button"
                  onClick={() => openAuth('signup')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-[#00e5a0] text-[#06080f] hover:bg-[#00cc8e] transition-all hover:shadow-[0_0_24px_rgba(0,229,160,0.25)]"
                >
                  Start Building — Free
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold border border-[#1e2736] text-[#e2e8f0] hover:border-[#00e5a0]/40 hover:text-[#00e5a0] transition-all">
                  <Play className="w-4 h-4" />
                  Watch Demo
                </button>
              </div>

              {/* Mini stats row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#64748b]">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#00e5a0]" />
                  50K+ resumes built
                </span>
                <span className="hidden sm:inline text-[#1e2736]">|</span>
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#00e5a0]" />
                  92% ATS pass rate
                </span>
                <span className="hidden sm:inline text-[#1e2736]">|</span>
                <span className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-[#00e5a0]" />
                  4.8&#9733; rating
                </span>
              </div>
            </div>

            {/* Right column - Mock dashboard card */}
            <div className="relative">
              {/* Glow behind card */}
              <div
                className="absolute -inset-4 rounded-3xl opacity-20 blur-3xl pointer-events-none"
                style={{
                  background:
                    'linear-gradient(135deg, #00e5a0 0%, #3b82f6 100%)',
                }}
              />
              <div className="relative rounded-2xl border border-[#1e2736] bg-[#0d1117] p-6 shadow-2xl">
                {/* Card header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                  </div>
                  <span
                    className="text-[10px] text-[#64748b] px-2 py-0.5 rounded bg-[#06080f] border border-[#1e2736]"
                    style={{ fontFamily: 'var(--font-jetbrains)' }}
                  >
                    resume_analysis.rs
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* ATS Gauge */}
                  <div className="flex flex-col items-center justify-center">
                    <ATSGauge />
                  </div>

                  {/* Skill Match Bars */}
                  <div className="space-y-3">
                    <h4
                      className="text-[10px] uppercase tracking-widest text-[#64748b] mb-2"
                      style={{ fontFamily: 'var(--font-jetbrains)' }}
                    >
                      Skill Match
                    </h4>
                    <SkillBar label="React" percent={95} delay={200} />
                    <SkillBar label="TypeScript" percent={88} delay={400} />
                    <SkillBar label="Node.js" percent={82} delay={600} />
                    <SkillBar label="System Design" percent={74} delay={800} />
                  </div>
                </div>

                {/* Mini resume preview */}
                <div className="mt-6 pt-5 border-t border-[#1e2736]">
                  <div className="flex gap-4">
                    {/* Mini resume skeleton */}
                    <div className="w-24 flex-shrink-0 rounded-lg border border-[#1e2736] bg-[#06080f] p-2.5 space-y-2">
                      <div className="h-1.5 w-12 rounded-full bg-[#00e5a0]/40" />
                      <div className="h-1 w-full rounded-full bg-[#1e2736]" />
                      <div className="h-1 w-4/5 rounded-full bg-[#1e2736]" />
                      <div className="h-1 w-full rounded-full bg-[#1e2736]" />
                      <div className="mt-2 h-1.5 w-10 rounded-full bg-[#3b82f6]/40" />
                      <div className="h-1 w-full rounded-full bg-[#1e2736]" />
                      <div className="h-1 w-3/4 rounded-full bg-[#1e2736]" />
                      <div className="h-1 w-full rounded-full bg-[#1e2736]" />
                      <div className="h-1 w-2/3 rounded-full bg-[#1e2736]" />
                    </div>
                    {/* Status info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#e2e8f0] font-medium">
                          senior_swe_resume.pdf
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00e5a0]/10 text-[#00e5a0] border border-[#00e5a0]/20">
                          Optimized
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-md bg-[#06080f] border border-[#1e2736] px-2.5 py-2">
                          <div className="text-[10px] text-[#64748b] mb-0.5">
                            Keywords
                          </div>
                          <div
                            className="text-sm font-bold text-[#00e5a0]"
                            style={{ fontFamily: 'var(--font-jetbrains)' }}
                          >
                            24/26
                          </div>
                        </div>
                        <div className="rounded-md bg-[#06080f] border border-[#1e2736] px-2.5 py-2">
                          <div className="text-[10px] text-[#64748b] mb-0.5">
                            Sections
                          </div>
                          <div
                            className="text-sm font-bold text-[#3b82f6]"
                            style={{ fontFamily: 'var(--font-jetbrains)' }}
                          >
                            6/6
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 rounded-full bg-[#1e2736] overflow-hidden">
                          <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-[#00e5a0] to-[#3b82f6]" />
                        </div>
                        <span
                          className="text-[10px] text-[#64748b]"
                          style={{ fontFamily: 'var(--font-jetbrains)' }}
                        >
                          92%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/*  FEATURES GRID                                                      */}
      {/* ================================================================== */}
      <section id="features" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div
          ref={featuresReveal.ref}
          className={`max-w-7xl mx-auto transition-all duration-1000 ${
            featuresReveal.isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Section header */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span
              className="inline-block text-xs uppercase tracking-widest text-[#00e5a0] mb-3"
              style={{ fontFamily: 'var(--font-jetbrains)' }}
            >
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Built for modern job seekers
            </h2>
            <p className="text-[#64748b] leading-relaxed">
              Everything you need to craft the perfect resume, match with the
              right roles, and land interviews faster than ever.
            </p>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group relative rounded-xl border border-[#1e2736] bg-[#0d1117] p-6 transition-all duration-300 hover:border-[#00e5a0]/30 hover:shadow-[0_0_30px_rgba(0,229,160,0.06)]"
                  style={{
                    transitionDelay: `${i * 50}ms`,
                  }}
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-[#00e5a0]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#00e5a0]/10 text-[#00e5a0] mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-[#64748b] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/*  HOW IT WORKS                                                       */}
      {/* ================================================================== */}
      <section
        id="how-it-works"
        className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative"
      >
        {/* Subtle background accent */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, #3b82f6 0%, transparent 70%)',
          }}
        />

        <div
          ref={stepsReveal.ref}
          className={`max-w-7xl mx-auto relative transition-all duration-1000 ${
            stepsReveal.isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Section header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span
              className="inline-block text-xs uppercase tracking-widest text-[#00e5a0] mb-3"
              style={{ fontFamily: 'var(--font-jetbrains)' }}
            >
              How it works
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              From blank page to interview in 3 steps
            </h2>
            <p className="text-[#64748b] leading-relaxed">
              No learning curve. No friction. Just results.
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8 md:gap-6 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-16 left-[calc(16.67%+12px)] right-[calc(16.67%+12px)] h-[2px]">
              <div className="h-full bg-gradient-to-r from-[#00e5a0]/40 via-[#3b82f6]/40 to-[#00e5a0]/40" />
            </div>

            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative text-center">
                  {/* Step number + icon */}
                  <div className="relative inline-flex flex-col items-center mb-6">
                    <div className="w-32 h-32 rounded-2xl border border-[#1e2736] bg-[#0d1117] flex items-center justify-center relative overflow-hidden">
                      {/* Background number */}
                      <span
                        className="absolute text-7xl font-black text-[#1e2736]/60 select-none"
                        style={{ fontFamily: 'var(--font-jetbrains)' }}
                      >
                        {step.number}
                      </span>
                      <Icon className="w-10 h-10 text-[#00e5a0] relative z-10" />
                    </div>
                    {/* Dot on connecting line (desktop) */}
                    {i < 2 && (
                      <div className="hidden md:block absolute -right-[calc(50%+12px)] top-16 -translate-y-1/2">
                        <div className="w-3 h-3 rounded-full bg-[#0d1117] border-2 border-[#00e5a0]" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-[#64748b] leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>

                  {/* Mobile connecting arrow */}
                  {i < 2 && (
                    <div className="md:hidden flex justify-center my-6">
                      <div className="w-[2px] h-8 bg-gradient-to-b from-[#00e5a0]/40 to-[#3b82f6]/40" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/*  STATS BAR                                                          */}
      {/* ================================================================== */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-y border-[#1e2736] bg-[#0d1117]/50">
        <div
          ref={statsReveal.ref}
          className={`max-w-7xl mx-auto transition-all duration-1000 ${
            statsReveal.isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#00e5a0]/10 text-[#00e5a0] mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div
                    className="text-3xl sm:text-4xl font-extrabold text-[#00e5a0] mb-1"
                    style={{ fontFamily: 'var(--font-jetbrains)' }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-[#64748b]">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/*  TESTIMONIALS                                                       */}
      {/* ================================================================== */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div
          ref={testimonialsReveal.ref}
          className={`max-w-7xl mx-auto transition-all duration-1000 ${
            testimonialsReveal.isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Section header */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span
              className="inline-block text-xs uppercase tracking-widest text-[#00e5a0] mb-3"
              style={{ fontFamily: 'var(--font-jetbrains)' }}
            >
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Trusted by engineers, designers, and PMs
            </h2>
            <p className="text-[#64748b] leading-relaxed">
              See what real users have to say about their experience.
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className="relative rounded-xl bg-[#0d1117] border border-[#1e2736] p-6 pl-7 transition-all duration-300 hover:border-[#1e2736]/80"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Green left accent */}
                <div className="absolute left-0 top-6 bottom-6 w-[3px] rounded-full bg-gradient-to-b from-[#00e5a0] to-[#3b82f6]" />

                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className="w-3.5 h-3.5 fill-[#00e5a0] text-[#00e5a0]"
                    />
                  ))}
                </div>

                <p className="text-sm text-[#e2e8f0]/90 leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  {/* Avatar placeholder */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00e5a0] to-[#3b82f6] flex items-center justify-center text-xs font-bold text-[#06080f]">
                    {t.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-[#64748b]">
                      {t.role} at {t.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/*  CTA SECTION                                                        */}
      {/* ================================================================== */}
      <section id="cta" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div
          ref={ctaReveal.ref}
          className={`max-w-3xl mx-auto transition-all duration-1000 ${
            ctaReveal.isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="relative rounded-2xl overflow-hidden">
            {/* Gradient border effect */}
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                padding: '1px',
                background:
                  'linear-gradient(135deg, #00e5a0, #3b82f6, #00e5a0)',
                WebkitMask:
                  'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            />
            <div className="relative rounded-2xl bg-[#0d1117] px-6 py-12 md:px-12 md:py-16 text-center">
              {/* Background glow */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] opacity-[0.06] pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at center, #00e5a0 0%, transparent 70%)',
                }}
              />
              <div className="relative">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                  Ready to engineer your next
                  <br />
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        'linear-gradient(135deg, #00e5a0 0%, #3b82f6 100%)',
                    }}
                  >
                    career move?
                  </span>
                </h2>
                <p className="text-[#64748b] mb-8 max-w-md mx-auto">
                  Join 50,000+ professionals who build, optimize, and land roles
                  faster with ResuMate.
                </p>

                {/* Email form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    openAuth('signup');
                  }}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-md mx-auto mb-4"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="flex-1 px-4 py-3 rounded-lg bg-[#06080f] border border-[#1e2736] text-sm text-[#e2e8f0] placeholder-[#64748b] outline-none focus:border-[#00e5a0]/50 focus:ring-1 focus:ring-[#00e5a0]/20 transition-all"
                    style={{ fontFamily: 'var(--font-jetbrains)' }}
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-[#00e5a0] text-[#06080f] hover:bg-[#00cc8e] transition-all hover:shadow-[0_0_24px_rgba(0,229,160,0.25)] whitespace-nowrap"
                  >
                    Get Started Free
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <p className="text-xs text-[#64748b]">
                  No credit card required &middot; Free forever tier
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/*  FOOTER                                                             */}
      {/* ================================================================== */}
      <footer className="border-t border-[#1e2736] py-12 px-4 sm:px-6 lg:px-8 bg-[#0d1117]/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Logo */}
            <div className="flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-[#00e5a0]" />
              <span className="text-sm font-bold tracking-tight">ResuMate</span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#64748b]">
              <a href="#" className="hover:text-[#e2e8f0] transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-[#e2e8f0] transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-[#e2e8f0] transition-colors">
                Blog
              </a>
              <a href="#" className="hover:text-[#e2e8f0] transition-colors">
                GitHub
              </a>
            </div>

            {/* Social */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-[#64748b] hover:text-[#e2e8f0] transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="text-[#64748b] hover:text-[#e2e8f0] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="text-[#64748b] hover:text-[#e2e8f0] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="text-[#64748b] hover:text-[#e2e8f0] transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-6 border-t border-[#1e2736] text-center">
            <p className="text-xs text-[#64748b]">
              &copy; {new Date().getFullYear()} ResuMate. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <HomeOneAuthModal
        isOpen={isAuthOpen}
        mode={authMode}
        onModeChange={setAuthMode}
        onClose={() => setIsAuthOpen(false)}
        onSubmit={handleAuthSubmit}
      />
    </div>
  );
}
