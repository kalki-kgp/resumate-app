'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Sparkles,
  Download,
  ArrowRight,
  Menu,
  X,
  Quote,
  CheckCircle,
  FileText,
  Briefcase,
  Star,
  ChevronRight,
  Leaf,
  Mail,
  Lock,
} from 'lucide-react';
import { Fraunces, DM_Sans } from 'next/font/google';

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

// ─── Avatar Data ─────────────────────────────────────────────
const avatars = [
  { initials: 'SK', bg: '#c96442' },
  { initials: 'JM', bg: '#2d5a3d' },
  { initials: 'AL', bg: '#8b7355' },
  { initials: 'RW', bg: '#c96442' },
  { initials: 'TP', bg: '#2d5a3d' },
];

// ─── Testimonial Data ────────────────────────────────────────
const testimonials = [
  {
    quote:
      "After being laid off, I felt lost. ResuMate helped me rediscover my strengths and present them in a way that actually resonated with hiring managers. I landed a senior role within three weeks.",
    name: 'Sarah Kim',
    role: 'Senior Product Designer at Figma',
  },
  {
    quote:
      "I was switching from teaching to tech and had no idea how to translate my experience. ResuMate's AI understood my story and helped me craft a resume that got me 5 interviews in my first week.",
    name: 'James Moreno',
    role: 'Software Engineer at Shopify',
  },
  {
    quote:
      "The ATS optimization is a game-changer. I'd been applying for months with no callbacks. After using ResuMate, I started hearing back within days. It genuinely changed my job search.",
    name: 'Amara Okafor',
    role: 'Marketing Manager at Stripe',
  },
];

// ─── Template Preview Data ───────────────────────────────────
const templatePreviews = [
  { name: 'Classic', accent: '#c96442' },
  { name: 'Modern', accent: '#2d5a3d' },
  { name: 'Minimal', accent: '#8b7355' },
  { name: 'Creative', accent: '#c96442' },
];

type AuthMode = 'signin' | 'signup';

const HomeTwoAuthModal = ({
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
        className="absolute inset-0 bg-[rgba(44,24,16,0.55)] backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close login modal"
      />

      <div className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-[#eadfce] bg-[#fffaf4] shadow-[0_30px_70px_rgba(44,24,16,0.25)]">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute -left-12 -top-16 h-44 w-44 opacity-70"
            style={{
              backgroundColor: '#f3e7d9',
              borderRadius: '62% 38% 56% 44% / 52% 41% 59% 48%',
            }}
          />
          <div
            className="absolute -right-10 -bottom-10 h-40 w-40 opacity-65"
            style={{
              backgroundColor: '#e6efe7',
              borderRadius: '57% 43% 31% 69% / 42% 53% 47% 58%',
            }}
          />
        </div>

        <div className="relative px-6 pt-7 pb-5 sm:px-8">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <p
                className="text-xs font-semibold tracking-[0.24em] uppercase"
                style={{ color: '#2d5a3d' }}
              >
                Welcome Back
              </p>
              <h3
                className="mt-1 text-3xl font-bold leading-tight"
                style={{
                  color: '#2c1810',
                  fontFamily: 'var(--font-fraunces), serif',
                }}
              >
                {mode === 'signin' ? 'Let’s pick up where you left off.' : 'Create your ResuMate account.'}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{ color: '#8b7355', backgroundColor: '#f4ecdf' }}
            >
              Close
            </button>
          </div>

          <div className="inline-flex rounded-full p-1" style={{ backgroundColor: '#f2e8da' }}>
            <button
              type="button"
              onClick={() => onModeChange('signin')}
              className="rounded-full px-4 py-2 text-xs font-semibold transition-colors"
              style={{
                backgroundColor: mode === 'signin' ? '#ffffff' : 'transparent',
                color: mode === 'signin' ? '#2c1810' : '#8b7355',
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => onModeChange('signup')}
              className="rounded-full px-4 py-2 text-xs font-semibold transition-colors"
              style={{
                backgroundColor: mode === 'signup' ? '#ffffff' : 'transparent',
                color: mode === 'signup' ? '#2c1810' : '#8b7355',
              }}
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
          className="relative space-y-4 px-6 pb-7 sm:px-8 sm:pb-8"
        >
          {mode === 'signup' && (
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium" style={{ color: '#8b7355' }}>
                Full Name
              </span>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: '#8b7355' }} />
                <input
                  type="text"
                  placeholder="Jordan Lee"
                  className="w-full rounded-2xl border px-10 py-3 text-sm outline-none transition-all"
                  style={{
                    borderColor: '#eadfce',
                    backgroundColor: '#ffffff',
                    color: '#2c1810',
                  }}
                />
              </div>
            </label>
          )}

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium" style={{ color: '#8b7355' }}>
              Email Address
            </span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: '#8b7355' }} />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-2xl border px-10 py-3 text-sm outline-none transition-all"
                style={{
                  borderColor: '#eadfce',
                  backgroundColor: '#ffffff',
                  color: '#2c1810',
                }}
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium" style={{ color: '#8b7355' }}>
              Password
            </span>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: '#8b7355' }} />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-2xl border px-10 py-3 text-sm outline-none transition-all"
                style={{
                  borderColor: '#eadfce',
                  backgroundColor: '#ffffff',
                  color: '#2c1810',
                }}
              />
            </div>
          </label>

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg"
            style={{ backgroundColor: '#c96442' }}
          >
            {mode === 'signin' ? 'Continue' : 'Create Account'}
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="text-center text-xs font-medium" style={{ color: '#8b7355' }}>
            By continuing, you agree to our terms and privacy policy.
          </p>
        </form>
      </div>
    </div>
  );
};

// ─── Main Page Component ─────────────────────────────────────
export default function HomePageTwo() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signin');

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setIsAuthOpen(true);
    setMobileMenuOpen(false);
  };

  const handleAuthSubmit = () => {
    setIsAuthOpen(false);
    router.push('/dashboard');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
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

  return (
    <div
      className={`${fraunces.variable} ${dmSans.variable} min-h-screen`}
      style={{
        fontFamily: 'var(--font-dm-sans), sans-serif',
        backgroundColor: '#faf7f2',
        color: '#2c1810',
      }}
    >
      {/* ═══════════════════ NAVIGATION ═══════════════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'shadow-md' : ''
        }`}
        style={{
          backgroundColor: scrolled ? 'rgba(250, 247, 242, 0.95)' : '#faf7f2',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
        }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: '#2d5a3d' }}
              >
                <Leaf className="h-4 w-4 text-white" />
              </div>
              <span
                className="text-xl font-bold tracking-tight md:text-2xl"
                style={{
                  fontFamily: 'var(--font-fraunces), serif',
                  color: '#2c1810',
                }}
              >
                ResuMate
              </span>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden items-center gap-8 md:flex">
              {['Features', 'Templates', 'Pricing', 'Blog'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-sm font-medium transition-colors duration-200 hover:opacity-80"
                  style={{ color: '#8b7355' }}
                >
                  {link}
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden items-center gap-4 md:flex">
              <button
                type="button"
                onClick={() => openAuth('signin')}
                className="text-sm font-medium transition-colors duration-200 hover:opacity-80"
                style={{ color: '#2c1810' }}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => openAuth('signup')}
                className="rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg"
                style={{
                  backgroundColor: '#c96442',
                }}
              >
                Start Free
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" style={{ color: '#2c1810' }} />
              ) : (
                <Menu className="h-6 w-6" style={{ color: '#2c1810' }} />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="border-t pb-6 md:hidden" style={{ borderColor: '#e8e0d4' }}>
              <div className="flex flex-col gap-4 pt-4">
                {['Features', 'Templates', 'Pricing', 'Blog'].map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-base font-medium"
                    style={{ color: '#8b7355' }}
                  >
                    {link}
                  </a>
                ))}
                <div className="flex flex-col gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => openAuth('signin')}
                    className="text-left text-base font-medium"
                    style={{ color: '#2c1810' }}
                  >
                    Log in
                  </button>
                  <button
                    type="button"
                    onClick={() => openAuth('signup')}
                    className="inline-block rounded-full px-6 py-2.5 text-center text-sm font-semibold text-white"
                    style={{ backgroundColor: '#c96442' }}
                  >
                    Start Free
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ═══════════════════ HERO SECTION ═══════════════════ */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
        {/* Organic Background Blobs */}
        <div
          className="absolute top-20 -left-20 h-72 w-72 opacity-30 md:h-96 md:w-96"
          style={{
            backgroundColor: '#f0e6d8',
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute top-40 -right-10 h-64 w-64 opacity-20 md:h-80 md:w-80"
          style={{
            backgroundColor: '#c96442',
            borderRadius: '70% 30% 30% 70% / 60% 40% 60% 40%',
            filter: 'blur(50px)',
          }}
        />
        <div
          className="absolute bottom-10 left-1/3 h-48 w-48 opacity-20 md:h-64 md:w-64"
          style={{
            backgroundColor: '#2d5a3d',
            borderRadius: '50% 50% 30% 70% / 40% 60% 40% 60%',
            filter: 'blur(60px)',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1
              className="text-4xl leading-tight font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
              style={{
                fontFamily: 'var(--font-fraunces), serif',
                color: '#2c1810',
              }}
            >
              Your story deserves
              <br />
              to be told{' '}
              <span className="relative inline-block">
                right
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 8C40 2 80 2 100 6C120 10 160 4 198 8"
                    stroke="#c96442"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
              .
            </h1>

            <p
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed md:mt-8 md:text-xl"
              style={{ color: '#8b7355' }}
            >
              ResuMate helps you craft resumes that capture who you really are
              — and gets them past every ATS.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:mt-10">
              <button
                type="button"
                onClick={() => openAuth('signup')}
                className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
                style={{ backgroundColor: '#c96442' }}
              >
                Create Your Resume
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Trust Bar */}
            <div className="mt-12 flex flex-col items-center gap-4 md:mt-16">
              <div className="flex -space-x-2">
                {avatars.map((avatar, i) => (
                  <div
                    key={i}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-bold text-white"
                    style={{
                      backgroundColor: avatar.bg,
                      borderColor: '#faf7f2',
                    }}
                  >
                    {avatar.initials}
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium" style={{ color: '#8b7355' }}>
                Trusted by{' '}
                <span style={{ color: '#2c1810' }} className="font-bold">
                  50,000+
                </span>{' '}
                professionals worldwide
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ WHY RESUMATE SECTION ═══════════════════ */}
      <section className="relative py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
            <p
              className="mb-3 text-sm font-semibold tracking-wider uppercase"
              style={{ color: '#c96442' }}
            >
              Why ResuMate?
            </p>
            <h2
              className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
              style={{
                fontFamily: 'var(--font-fraunces), serif',
                color: '#2c1810',
              }}
            >
              Built for the way you actually job search
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {/* Card 1 */}
            <div
              className="group relative overflow-hidden rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:p-10"
              style={{ backgroundColor: '#ffffff', border: '1px solid #e8e0d4' }}
            >
              <div
                className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ backgroundColor: '#f0e6d8' }}
              >
                <Sparkles className="h-7 w-7" style={{ color: '#c96442' }} />
              </div>
              <div
                className="mb-4 text-5xl font-black opacity-10"
                style={{
                  fontFamily: 'var(--font-fraunces), serif',
                  color: '#c96442',
                }}
              >
                AI
              </div>
              <h3
                className="mb-3 text-xl font-bold"
                style={{
                  fontFamily: 'var(--font-fraunces), serif',
                  color: '#2c1810',
                }}
              >
                AI That Understands You
              </h3>
              <p className="leading-relaxed" style={{ color: '#8b7355' }}>
                Not just keywords. Our AI captures your unique voice and
                experience, turning your career story into compelling content
                that resonates with hiring managers.
              </p>
            </div>

            {/* Card 2 */}
            <div
              className="group relative overflow-hidden rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:p-10"
              style={{ backgroundColor: '#ffffff', border: '1px solid #e8e0d4' }}
            >
              <div
                className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ backgroundColor: '#e8f5ed' }}
              >
                <CheckCircle className="h-7 w-7" style={{ color: '#2d5a3d' }} />
              </div>
              <div
                className="mb-4 text-5xl font-black opacity-10"
                style={{
                  fontFamily: 'var(--font-fraunces), serif',
                  color: '#2d5a3d',
                }}
              >
                92%
              </div>
              <h3
                className="mb-3 text-xl font-bold"
                style={{
                  fontFamily: 'var(--font-fraunces), serif',
                  color: '#2c1810',
                }}
              >
                Beat Every ATS
              </h3>
              <p className="leading-relaxed" style={{ color: '#8b7355' }}>
                92% of our users pass ATS screening on first try. Our
                intelligent formatting and keyword optimization ensures your
                resume never gets lost in the black hole.
              </p>
            </div>

            {/* Card 3 */}
            <div
              className="group relative overflow-hidden rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:p-10"
              style={{ backgroundColor: '#ffffff', border: '1px solid #e8e0d4' }}
            >
              <div
                className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ backgroundColor: '#f0e6d8' }}
              >
                <Briefcase className="h-7 w-7" style={{ color: '#c96442' }} />
              </div>
              <div
                className="mb-4 text-5xl font-black opacity-10"
                style={{
                  fontFamily: 'var(--font-fraunces), serif',
                  color: '#c96442',
                }}
              >
                3x
              </div>
              <h3
                className="mb-3 text-xl font-bold"
                style={{
                  fontFamily: 'var(--font-fraunces), serif',
                  color: '#2c1810',
                }}
              >
                Land Interviews Faster
              </h3>
              <p className="leading-relaxed" style={{ color: '#8b7355' }}>
                Users report 3x more interview callbacks within 2 weeks.
                Because when your resume speaks your language, employers
                listen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ PRODUCT SHOWCASE ═══════════════════ */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
            <p
              className="mb-3 text-sm font-semibold tracking-wider uppercase"
              style={{ color: '#c96442' }}
            >
              Product
            </p>
            <h2
              className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
              style={{
                fontFamily: 'var(--font-fraunces), serif',
                color: '#2c1810',
              }}
            >
              See it in action
            </h2>
          </div>

          {/* Editor Mockup */}
          <div
            className="mx-auto max-w-5xl overflow-hidden rounded-2xl md:rounded-3xl"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e8e0d4',
              boxShadow: '0 25px 60px -12px rgba(44, 24, 16, 0.12)',
            }}
          >
            {/* Mockup Top Bar */}
            <div
              className="flex items-center gap-2 border-b px-4 py-3 md:px-6"
              style={{ borderColor: '#e8e0d4', backgroundColor: '#faf7f2' }}
            >
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#e8e0d4' }} />
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#e8e0d4' }} />
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#e8e0d4' }} />
              </div>
              <div
                className="ml-4 flex-1 rounded-lg px-4 py-1.5 text-center text-xs"
                style={{ backgroundColor: '#f0e6d8', color: '#8b7355' }}
              >
                resumate.app/editor
              </div>
            </div>

            {/* Mockup Content - Split View */}
            <div className="grid md:grid-cols-2">
              {/* Left: Form Fields */}
              <div
                className="border-b p-6 md:border-r md:border-b-0 md:p-8"
                style={{ borderColor: '#e8e0d4' }}
              >
                <div className="mb-6 flex items-center gap-2">
                  <FileText className="h-5 w-5" style={{ color: '#c96442' }} />
                  <span className="text-sm font-semibold" style={{ color: '#2c1810' }}>
                    Resume Editor
                  </span>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label
                      className="mb-1.5 block text-xs font-medium"
                      style={{ color: '#8b7355' }}
                    >
                      Full Name
                    </label>
                    <div
                      className="rounded-xl px-4 py-3 text-sm"
                      style={{
                        backgroundColor: '#faf7f2',
                        border: '1px solid #e8e0d4',
                        color: '#2c1810',
                      }}
                    >
                      Sarah Kim
                    </div>
                  </div>
                  <div>
                    <label
                      className="mb-1.5 block text-xs font-medium"
                      style={{ color: '#8b7355' }}
                    >
                      Job Title
                    </label>
                    <div
                      className="rounded-xl px-4 py-3 text-sm"
                      style={{
                        backgroundColor: '#faf7f2',
                        border: '1px solid #e8e0d4',
                        color: '#2c1810',
                      }}
                    >
                      Senior Product Designer
                    </div>
                  </div>
                  <div>
                    <label
                      className="mb-1.5 block text-xs font-medium"
                      style={{ color: '#8b7355' }}
                    >
                      Professional Summary
                    </label>
                    <div
                      className="rounded-xl px-4 py-3 text-sm leading-relaxed"
                      style={{
                        backgroundColor: '#faf7f2',
                        border: '1px solid #e8e0d4',
                        color: '#2c1810',
                        minHeight: '80px',
                      }}
                    >
                      Creative product designer with 8+ years of experience building
                      user-centered digital experiences...
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <div
                      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-white"
                      style={{ backgroundColor: '#c96442' }}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      AI Enhance
                    </div>
                    <div
                      className="rounded-lg px-3 py-2 text-xs font-medium"
                      style={{
                        color: '#8b7355',
                        border: '1px solid #e8e0d4',
                      }}
                    >
                      + Add Section
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Resume Preview */}
              <div className="p-6 md:p-8" style={{ backgroundColor: '#faf7f2' }}>
                <div className="mb-6 flex items-center gap-2">
                  <Star className="h-5 w-5" style={{ color: '#2d5a3d' }} />
                  <span className="text-sm font-semibold" style={{ color: '#2c1810' }}>
                    Live Preview
                  </span>
                </div>

                {/* Resume Preview Card */}
                <div
                  className="overflow-hidden rounded-xl p-6 shadow-sm"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e8e0d4',
                  }}
                >
                  <div
                    className="mb-1 h-2 w-16 rounded"
                    style={{ backgroundColor: '#c96442' }}
                  />
                  <div className="mt-3 space-y-0.5">
                    <div
                      className="text-base font-bold"
                      style={{
                        fontFamily: 'var(--font-fraunces), serif',
                        color: '#2c1810',
                      }}
                    >
                      Sarah Kim
                    </div>
                    <div className="text-xs" style={{ color: '#8b7355' }}>
                      Senior Product Designer
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div>
                      <div
                        className="mb-1 text-[10px] font-bold tracking-wider uppercase"
                        style={{ color: '#c96442' }}
                      >
                        Summary
                      </div>
                      <div
                        className="h-2 w-full rounded"
                        style={{ backgroundColor: '#f0e6d8' }}
                      />
                      <div
                        className="mt-1 h-2 w-4/5 rounded"
                        style={{ backgroundColor: '#f0e6d8' }}
                      />
                      <div
                        className="mt-1 h-2 w-3/5 rounded"
                        style={{ backgroundColor: '#f0e6d8' }}
                      />
                    </div>
                    <div>
                      <div
                        className="mb-1 text-[10px] font-bold tracking-wider uppercase"
                        style={{ color: '#c96442' }}
                      >
                        Experience
                      </div>
                      <div
                        className="h-2 w-full rounded"
                        style={{ backgroundColor: '#f0e6d8' }}
                      />
                      <div
                        className="mt-1 h-2 w-5/6 rounded"
                        style={{ backgroundColor: '#f0e6d8' }}
                      />
                      <div
                        className="mt-1 h-2 w-4/5 rounded"
                        style={{ backgroundColor: '#f0e6d8' }}
                      />
                      <div
                        className="mt-1 h-2 w-2/3 rounded"
                        style={{ backgroundColor: '#f0e6d8' }}
                      />
                    </div>
                    <div>
                      <div
                        className="mb-1 text-[10px] font-bold tracking-wider uppercase"
                        style={{ color: '#c96442' }}
                      >
                        Skills
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {['Figma', 'Research', 'Prototyping', 'Design Systems'].map(
                          (skill) => (
                            <span
                              key={skill}
                              className="rounded-full px-2 py-0.5 text-[9px]"
                              style={{
                                backgroundColor: '#f0e6d8',
                                color: '#8b7355',
                              }}
                            >
                              {skill}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Template Previews */}
          <div className="mt-12 text-center md:mt-16">
            <p className="mb-6 text-sm font-medium" style={{ color: '#8b7355' }}>
              <span className="font-bold" style={{ color: '#2c1810' }}>
                40+
              </span>{' '}
              professionally designed templates
            </p>
            <div className="mx-auto grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
              {templatePreviews.map((template, i) => (
                <div
                  key={i}
                  className="group cursor-pointer overflow-hidden rounded-xl p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e8e0d4',
                  }}
                >
                  {/* Mini template */}
                  <div
                    className="mb-2 rounded-lg p-3"
                    style={{ backgroundColor: '#faf7f2' }}
                  >
                    <div
                      className="mb-2 h-1 w-8 rounded"
                      style={{ backgroundColor: template.accent }}
                    />
                    <div
                      className="mb-1 h-1.5 w-12 rounded"
                      style={{ backgroundColor: '#2c1810', opacity: 0.2 }}
                    />
                    <div
                      className="mb-2 h-1 w-8 rounded"
                      style={{ backgroundColor: '#8b7355', opacity: 0.2 }}
                    />
                    <div className="space-y-1">
                      <div
                        className="h-1 w-full rounded"
                        style={{ backgroundColor: '#e8e0d4' }}
                      />
                      <div
                        className="h-1 w-4/5 rounded"
                        style={{ backgroundColor: '#e8e0d4' }}
                      />
                      <div
                        className="h-1 w-3/5 rounded"
                        style={{ backgroundColor: '#e8e0d4' }}
                      />
                    </div>
                  </div>
                  <p
                    className="text-center text-xs font-medium"
                    style={{ color: '#8b7355' }}
                  >
                    {template.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section className="py-20 md:py-28" style={{ backgroundColor: '#f0e6d8' }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
            <p
              className="mb-3 text-sm font-semibold tracking-wider uppercase"
              style={{ color: '#c96442' }}
            >
              How It Works
            </p>
            <h2
              className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
              style={{
                fontFamily: 'var(--font-fraunces), serif',
                color: '#2c1810',
              }}
            >
              Three steps to your dream job
            </h2>
          </div>

          <div className="relative mx-auto max-w-4xl">
            {/* Dotted Connection Line (desktop) */}
            <div
              className="absolute top-16 left-[16.5%] hidden h-0.5 w-[67%] md:block"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(to right, #c96442 0, #c96442 6px, transparent 6px, transparent 14px)',
              }}
            />

            <div className="grid gap-8 md:grid-cols-3 md:gap-12">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div
                  className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl shadow-md"
                  style={{ backgroundColor: '#ffffff' }}
                >
                  <User className="h-7 w-7" style={{ color: '#c96442' }} />
                  <div
                    className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: '#c96442' }}
                  >
                    1
                  </div>
                </div>
                <h3
                  className="mb-2 text-lg font-bold"
                  style={{
                    fontFamily: 'var(--font-fraunces), serif',
                    color: '#2c1810',
                  }}
                >
                  Tell us about yourself
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#8b7355' }}>
                  Import your LinkedIn or fill in your details. Our smart forms
                  make it quick and painless.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div
                  className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl shadow-md"
                  style={{ backgroundColor: '#ffffff' }}
                >
                  <Sparkles className="h-7 w-7" style={{ color: '#2d5a3d' }} />
                  <div
                    className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: '#2d5a3d' }}
                  >
                    2
                  </div>
                </div>
                <h3
                  className="mb-2 text-lg font-bold"
                  style={{
                    fontFamily: 'var(--font-fraunces), serif',
                    color: '#2c1810',
                  }}
                >
                  Let AI do the heavy lifting
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#8b7355' }}>
                  Our AI crafts professional bullet points, optimizes keywords,
                  and tailors your resume to each role.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div
                  className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl shadow-md"
                  style={{ backgroundColor: '#ffffff' }}
                >
                  <Download className="h-7 w-7" style={{ color: '#c96442' }} />
                  <div
                    className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: '#c96442' }}
                  >
                    3
                  </div>
                </div>
                <h3
                  className="mb-2 text-lg font-bold"
                  style={{
                    fontFamily: 'var(--font-fraunces), serif',
                    color: '#2c1810',
                  }}
                >
                  Download & apply with confidence
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#8b7355' }}>
                  Export as PDF, share a link, or apply directly. You are ready to
                  make your next career move.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
      <section className="py-20 md:py-28" style={{ backgroundColor: '#faf7f2' }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
            <p
              className="mb-3 text-sm font-semibold tracking-wider uppercase"
              style={{ color: '#c96442' }}
            >
              Testimonials
            </p>
            <h2
              className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
              style={{
                fontFamily: 'var(--font-fraunces), serif',
                color: '#2c1810',
              }}
            >
              Real stories from real people
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="relative rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:p-10"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e8e0d4',
                }}
              >
                {/* Decorative Quote */}
                <Quote
                  className="mb-4 h-8 w-8 rotate-180"
                  style={{ color: '#e8e0d4' }}
                  fill="#e8e0d4"
                />

                <p
                  className="mb-6 leading-relaxed"
                  style={{
                    fontFamily: 'var(--font-fraunces), serif',
                    fontStyle: 'italic',
                    color: '#2c1810',
                    fontSize: '0.95rem',
                    lineHeight: '1.75',
                  }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{
                      backgroundColor:
                        i === 0 ? '#c96442' : i === 1 ? '#2d5a3d' : '#8b7355',
                    }}
                  >
                    {t.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <div
                      className="text-sm font-bold"
                      style={{ color: '#2c1810' }}
                    >
                      {t.name}
                    </div>
                    <div className="text-xs" style={{ color: '#8b7355' }}>
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA SECTION ═══════════════════ */}
      <section
        className="relative overflow-hidden py-20 md:py-28"
        style={{ backgroundColor: '#c96442' }}
      >
        {/* Organic decorative shapes */}
        <div
          className="absolute -top-20 -left-20 h-64 w-64 opacity-10"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          }}
        />
        <div
          className="absolute -right-16 -bottom-16 h-56 w-56 opacity-10"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '60% 40% 30% 70% / 50% 60% 40% 50%',
          }}
        />

        <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-8">
          <h2
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
            style={{ fontFamily: 'var(--font-fraunces), serif' }}
          >
            Your next chapter starts here.
          </h2>
          <p
            className="mx-auto mt-4 max-w-xl text-lg"
            style={{ color: 'rgba(255, 255, 255, 0.85)' }}
          >
            Join thousands of professionals who found their dream job with a
            resume that truly represents them.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 md:mt-10">
            <button
              type="button"
              onClick={() => openAuth('signup')}
              className="group inline-flex items-center gap-2 rounded-full px-10 py-4 text-base font-bold shadow-lg transition-all duration-300 hover:shadow-xl"
              style={{
                backgroundColor: '#ffffff',
                color: '#c96442',
              }}
            >
              Get Started — It&apos;s Free
              <ChevronRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
            <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              No credit card needed &middot; Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer style={{ backgroundColor: '#faf7f2' }}>
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-8 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4 md:gap-12">
            {/* Brand Column */}
            <div className="md:col-span-1">
              <div className="mb-4 flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ backgroundColor: '#2d5a3d' }}
                >
                  <Leaf className="h-4 w-4 text-white" />
                </div>
                <span
                  className="text-xl font-bold"
                  style={{
                    fontFamily: 'var(--font-fraunces), serif',
                    color: '#2c1810',
                  }}
                >
                  ResuMate
                </span>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: '#8b7355' }}
              >
                AI-powered resume builder that helps you tell your career story
                with confidence.
              </p>
            </div>

            {/* Link Columns */}
            <div>
              <h4
                className="mb-4 text-sm font-bold"
                style={{ color: '#2c1810' }}
              >
                Product
              </h4>
              <ul className="space-y-2.5">
                {['Resume Builder', 'Templates', 'AI Writer', 'ATS Checker', 'Cover Letters'].map(
                  (link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm transition-colors duration-200 hover:opacity-70"
                        style={{ color: '#8b7355' }}
                      >
                        {link}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4
                className="mb-4 text-sm font-bold"
                style={{ color: '#2c1810' }}
              >
                Resources
              </h4>
              <ul className="space-y-2.5">
                {['Blog', 'Career Guide', 'Resume Examples', 'Help Center', 'API'].map(
                  (link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm transition-colors duration-200 hover:opacity-70"
                        style={{ color: '#8b7355' }}
                      >
                        {link}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4
                className="mb-4 text-sm font-bold"
                style={{ color: '#2c1810' }}
              >
                Company
              </h4>
              <ul className="space-y-2.5">
                {['About', 'Careers', 'Privacy', 'Terms', 'Contact'].map(
                  (link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm transition-colors duration-200 hover:opacity-70"
                        style={{ color: '#8b7355' }}
                      >
                        {link}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div
            className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row"
            style={{ borderColor: '#e8e0d4' }}
          >
            <p className="text-sm" style={{ color: '#8b7355' }}>
              Made with care for job seekers everywhere
            </p>
            <p className="text-sm" style={{ color: '#8b7355' }}>
              &copy; {new Date().getFullYear()} ResuMate. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <HomeTwoAuthModal
        isOpen={isAuthOpen}
        mode={authMode}
        onModeChange={setAuthMode}
        onClose={() => setIsAuthOpen(false)}
        onSubmit={handleAuthSubmit}
      />
    </div>
  );
}
