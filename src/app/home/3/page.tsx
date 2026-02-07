'use client';

import { useState } from 'react';
import { Playfair_Display, Source_Sans_3 } from 'next/font/google';
import {
  ArrowRight,
  Star,
  Menu,
  X,
} from 'lucide-react';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-playfair',
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-source-sans',
  display: 'swap',
});

/* ─── Color Constants ─── */
const COLORS = {
  bg: '#fafafa',
  surface: '#ffffff',
  dark: '#111111',
  gold: '#c9a84c',
  charcoal: '#1a1a1a',
  textPrimary: '#111111',
  textMuted: '#666666',
  divider: '#e5e5e5',
} as const;

/* ─── Data ─── */
const NAV_LINKS = ['Features', 'Pricing', 'About'];

const COMPANIES = [
  'Google',
  'Apple',
  'McKinsey',
  'Goldman Sachs',
  'Meta',
  'Deloitte',
];

const FEATURES = [
  {
    title: 'AI Resume Builder',
    subtitle: 'Your experience, perfected by AI',
    description:
      'Our AI analyzes your background and crafts each bullet point with precision. Every word is intentional, every achievement quantified, every section optimized for impact.',
    size: 'large' as const,
  },
  {
    title: 'ATS Optimization',
    subtitle: 'Score 90%+ on every application',
    description:
      'Applicant tracking systems reject 75% of resumes before a human ever sees them. Our engine ensures yours passes every time, matching keywords and formatting to perfection.',
    size: 'large' as const,
  },
  {
    title: 'Job Matching',
    subtitle: 'Discover roles made for you',
    description:
      'Intelligent matching connects your unique skill set with opportunities that align with your ambitions and experience.',
    size: 'small' as const,
  },
  {
    title: 'Cover Letters',
    subtitle: 'Compelling letters in seconds',
    description:
      'Tailored, eloquent cover letters generated instantly for every application. Each one reads as if personally crafted.',
    size: 'small' as const,
  },
];

const STATS = [
  { value: '50K+', label: 'Resumes Built' },
  { value: '92%', label: 'ATS Pass Rate' },
  { value: '3x', label: 'Faster Placement' },
  { value: '4.8', label: 'User Rating' },
];

const TESTIMONIALS = [
  {
    quote:
      'ResuMate transformed my job search entirely. Within two weeks of using the platform, I received three interview invitations from companies I had been targeting for months.',
    name: 'Alexandra Chen',
    role: 'Senior Product Manager, Google',
  },
  {
    quote:
      'The level of sophistication in the AI writing is remarkable. It captured nuances about my career trajectory that I struggled to articulate myself. Truly a premium experience.',
    name: 'Marcus Whitfield',
    role: 'Director of Strategy, McKinsey & Company',
  },
  {
    quote:
      'I have reviewed thousands of resumes in my career. ResuMate produces documents that consistently stand out -- clean, compelling, and perfectly structured for modern hiring.',
    name: 'Dr. Priya Sharma',
    role: 'VP of Talent Acquisition, Meta',
  },
];

const FOOTER_LINKS = {
  Product: ['Resume Builder', 'ATS Checker', 'Job Search', 'Cover Letters', 'Templates'],
  Company: ['About', 'Careers', 'Press', 'Blog'],
  Resources: ['Help Center', 'Guides', 'API', 'Status'],
  Legal: ['Privacy', 'Terms', 'Security', 'Cookies'],
};

/* ─── Component ─── */
export default function EditorialLuxePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      className={`${playfair.variable} ${sourceSans.variable} min-h-screen`}
      style={{ backgroundColor: COLORS.bg, color: COLORS.textPrimary }}
    >
      {/* ════════════════════════════════════════════════════════════
          NAVIGATION
         ════════════════════════════════════════════════════════════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: COLORS.bg,
          borderBottom: `1px solid ${COLORS.divider}`,
        }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="flex h-16 items-center justify-between lg:h-20">
            {/* Logo */}
            <a
              href="#"
              className="font-[family-name:var(--font-playfair)] text-lg font-bold tracking-[0.25em]"
              style={{ color: COLORS.textPrimary }}
            >
              RESUMATE
            </a>

            {/* Desktop Nav */}
            <div className="hidden items-center gap-12 md:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="font-[family-name:var(--font-source-sans)] text-sm font-medium tracking-wide transition-colors duration-200"
                  style={{ color: COLORS.textMuted }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = COLORS.textPrimary)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = COLORS.textMuted)
                  }
                >
                  {link}
                </a>
              ))}
              <a
                href="#"
                className="group relative font-[family-name:var(--font-source-sans)] text-sm font-semibold tracking-wide transition-colors duration-200"
                style={{ color: COLORS.textPrimary }}
              >
                Get Started
                <span
                  className="absolute -bottom-0.5 left-0 h-[1.5px] w-0 transition-all duration-300 group-hover:w-full"
                  style={{ backgroundColor: COLORS.gold }}
                />
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div
            className="border-t md:hidden"
            style={{
              backgroundColor: COLORS.bg,
              borderColor: COLORS.divider,
            }}
          >
            <div className="space-y-1 px-6 py-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block py-2 font-[family-name:var(--font-source-sans)] text-sm font-medium"
                  style={{ color: COLORS.textMuted }}
                >
                  {link}
                </a>
              ))}
              <a
                href="#"
                className="mt-2 block py-2 font-[family-name:var(--font-source-sans)] text-sm font-semibold"
                style={{ color: COLORS.gold }}
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* ════════════════════════════════════════════════════════════
          HERO - ASYMMETRIC LAYOUT
         ════════════════════════════════════════════════════════════ */}
      <section className="pt-28 pb-16 lg:pt-36 lg:pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-5 lg:gap-16">
            {/* Left Column - 60% */}
            <div className="lg:col-span-3">
              <p
                className="mb-6 font-[family-name:var(--font-source-sans)] text-xs font-semibold tracking-[0.3em] uppercase"
                style={{ color: COLORS.gold }}
              >
                AI-Powered Career Tools
              </p>
              <h1 className="font-[family-name:var(--font-playfair)] text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                Resumes
                <br />
                that open
                <br />
                <span style={{ color: COLORS.charcoal }}>doors.</span>
              </h1>
              <p
                className="mt-8 max-w-lg font-[family-name:var(--font-source-sans)] text-lg leading-relaxed"
                style={{ color: COLORS.textMuted }}
              >
                Craft impeccable resumes powered by artificial intelligence.
                Every word calibrated, every section optimized, every application
                poised for success.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 px-8 py-3.5 font-[family-name:var(--font-source-sans)] text-sm font-semibold tracking-wide transition-all duration-300 hover:brightness-110"
                  style={{
                    backgroundColor: COLORS.gold,
                    color: COLORS.dark,
                  }}
                >
                  Create Resume
                  <ArrowRight size={16} strokeWidth={2} />
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 border px-8 py-3.5 font-[family-name:var(--font-source-sans)] text-sm font-semibold tracking-wide transition-all duration-300"
                  style={{
                    borderColor: COLORS.charcoal,
                    color: COLORS.charcoal,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.charcoal;
                    e.currentTarget.style.color = COLORS.surface;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = COLORS.charcoal;
                  }}
                >
                  View Templates
                </a>
              </div>
            </div>

            {/* Right Column - 40% */}
            <div className="flex justify-center lg:col-span-2 lg:justify-end">
              <div
                className="w-full max-w-sm rotate-1 transform transition-transform duration-500 hover:rotate-0"
                style={{
                  backgroundColor: COLORS.surface,
                  borderTop: `4px solid ${COLORS.gold}`,
                  boxShadow: '0 25px 60px -12px rgba(0,0,0,0.12)',
                }}
              >
                <div className="p-8">
                  {/* Resume Preview: Header */}
                  <div className="mb-6 text-center">
                    <div
                      className="mb-1 font-[family-name:var(--font-playfair)] text-xl font-bold tracking-wide"
                      style={{ color: COLORS.textPrimary }}
                    >
                      Alexandra Chen
                    </div>
                    <div
                      className="font-[family-name:var(--font-source-sans)] text-xs tracking-[0.15em] uppercase"
                      style={{ color: COLORS.gold }}
                    >
                      Senior Product Manager
                    </div>
                  </div>

                  {/* Divider */}
                  <div
                    className="mb-5 h-px w-full"
                    style={{ backgroundColor: COLORS.divider }}
                  />

                  {/* Resume Preview: Experience */}
                  <div className="mb-5">
                    <div
                      className="mb-2 font-[family-name:var(--font-source-sans)] text-[10px] font-semibold tracking-[0.2em] uppercase"
                      style={{ color: COLORS.textMuted }}
                    >
                      Experience
                    </div>
                    <div className="space-y-3">
                      {[
                        { company: 'Google', role: 'Sr. Product Manager', years: '2021 - Present' },
                        { company: 'Stripe', role: 'Product Manager', years: '2018 - 2021' },
                      ].map((item) => (
                        <div key={item.company}>
                          <div className="flex items-baseline justify-between">
                            <span
                              className="font-[family-name:var(--font-source-sans)] text-xs font-semibold"
                              style={{ color: COLORS.textPrimary }}
                            >
                              {item.company}
                            </span>
                            <span
                              className="font-[family-name:var(--font-source-sans)] text-[10px]"
                              style={{ color: COLORS.textMuted }}
                            >
                              {item.years}
                            </span>
                          </div>
                          <div
                            className="font-[family-name:var(--font-source-sans)] text-[10px]"
                            style={{ color: COLORS.textMuted }}
                          >
                            {item.role}
                          </div>
                          {/* Skeleton lines */}
                          <div className="mt-1.5 space-y-1">
                            <div
                              className="h-1.5 w-full rounded-full"
                              style={{ backgroundColor: COLORS.divider }}
                            />
                            <div
                              className="h-1.5 w-4/5 rounded-full"
                              style={{ backgroundColor: COLORS.divider }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resume Preview: Education */}
                  <div className="mb-5">
                    <div
                      className="mb-2 font-[family-name:var(--font-source-sans)] text-[10px] font-semibold tracking-[0.2em] uppercase"
                      style={{ color: COLORS.textMuted }}
                    >
                      Education
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span
                        className="font-[family-name:var(--font-source-sans)] text-xs font-semibold"
                        style={{ color: COLORS.textPrimary }}
                      >
                        Stanford University
                      </span>
                      <span
                        className="font-[family-name:var(--font-source-sans)] text-[10px]"
                        style={{ color: COLORS.textMuted }}
                      >
                        2016 - 2018
                      </span>
                    </div>
                    <div
                      className="font-[family-name:var(--font-source-sans)] text-[10px]"
                      style={{ color: COLORS.textMuted }}
                    >
                      MBA, Business Administration
                    </div>
                  </div>

                  {/* Resume Preview: Skills */}
                  <div>
                    <div
                      className="mb-2 font-[family-name:var(--font-source-sans)] text-[10px] font-semibold tracking-[0.2em] uppercase"
                      style={{ color: COLORS.textMuted }}
                    >
                      Skills
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {['Strategy', 'Analytics', 'Leadership', 'Agile', 'SQL'].map(
                        (skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 font-[family-name:var(--font-source-sans)] text-[9px] font-medium"
                            style={{
                              backgroundColor: COLORS.bg,
                              color: COLORS.textMuted,
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

        {/* Gold horizontal rule */}
        <div className="mx-auto mt-20 max-w-7xl px-6 lg:mt-28 lg:px-12">
          <div className="h-px w-full" style={{ backgroundColor: COLORS.gold }} />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SOCIAL PROOF BAR
         ════════════════════════════════════════════════════════════ */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <p
            className="mb-8 text-center font-[family-name:var(--font-source-sans)] text-[10px] font-semibold tracking-[0.35em] uppercase"
            style={{ color: COLORS.textMuted }}
          >
            Trusted by professionals at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:gap-x-16">
            {COMPANIES.map((company) => (
              <span
                key={company}
                className="font-[family-name:var(--font-playfair)] text-lg font-bold tracking-wide sm:text-xl"
                style={{ color: '#b0b0b0' }}
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FEATURES - EDITORIAL GRID
         ════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          {/* Section Header */}
          <div className="mb-16 lg:mb-24">
            <p
              className="mb-4 font-[family-name:var(--font-source-sans)] text-xs font-semibold tracking-[0.3em] uppercase"
              style={{ color: COLORS.gold }}
            >
              What We Offer
            </p>
            <h2 className="max-w-2xl font-[family-name:var(--font-playfair)] text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Intelligent tools for ambitious careers
            </h2>
          </div>

          {/* Editorial Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {FEATURES.map((feature, index) => (
              <div
                key={feature.title}
                className={`group cursor-pointer p-8 transition-all duration-500 hover:-translate-y-1 lg:p-12 ${
                  feature.size === 'large' ? 'md:row-span-1' : ''
                }`}
                style={{
                  backgroundColor: COLORS.surface,
                  borderLeft:
                    index % 2 === 0
                      ? `3px solid ${COLORS.gold}`
                      : `3px solid ${COLORS.divider}`,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderLeftColor = COLORS.gold;
                  e.currentTarget.style.boxShadow =
                    '0 12px 40px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderLeftColor =
                    index % 2 === 0 ? COLORS.gold : COLORS.divider;
                  e.currentTarget.style.boxShadow =
                    '0 1px 3px rgba(0,0,0,0.04)';
                }}
              >
                <p
                  className="mb-3 font-[family-name:var(--font-source-sans)] text-[10px] font-semibold tracking-[0.25em] uppercase"
                  style={{ color: COLORS.gold }}
                >
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="mb-2 font-[family-name:var(--font-playfair)] text-2xl font-bold tracking-tight lg:text-3xl">
                  {feature.title}
                </h3>
                <p
                  className="mb-4 font-[family-name:var(--font-source-sans)] text-sm font-medium italic"
                  style={{ color: COLORS.textMuted }}
                >
                  {feature.subtitle}
                </p>
                <p
                  className="font-[family-name:var(--font-source-sans)] text-sm leading-relaxed"
                  style={{ color: COLORS.textMuted }}
                >
                  {feature.description}
                </p>
                <div className="mt-6 flex items-center gap-2">
                  <span
                    className="font-[family-name:var(--font-source-sans)] text-xs font-semibold tracking-wide transition-colors duration-300"
                    style={{ color: COLORS.textPrimary }}
                  >
                    Learn more
                  </span>
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                    style={{ color: COLORS.gold }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          STATS - FULL-WIDTH DARK SECTION
         ════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28" style={{ backgroundColor: COLORS.dark }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid grid-cols-2 gap-10 sm:gap-12 lg:grid-cols-4 lg:gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="mb-2 font-[family-name:var(--font-playfair)] text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl"
                  style={{ color: COLORS.gold }}
                >
                  {stat.value}
                </div>
                <div
                  className="font-[family-name:var(--font-source-sans)] text-xs font-medium tracking-[0.2em] uppercase"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          TESTIMONIALS - EDITORIAL PULL QUOTES
         ════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-12">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <p
              className="mb-4 font-[family-name:var(--font-source-sans)] text-xs font-semibold tracking-[0.3em] uppercase"
              style={{ color: COLORS.gold }}
            >
              Testimonials
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight sm:text-4xl">
              Words from our community
            </h2>
          </div>

          {/* Testimonials */}
          <div className="space-y-0">
            {TESTIMONIALS.map((testimonial, index) => (
              <div key={testimonial.name}>
                <div className="py-12 lg:py-16">
                  {/* Decorative Gold Quote Mark */}
                  <div
                    className="mb-6 font-[family-name:var(--font-playfair)] text-6xl leading-none select-none lg:text-7xl"
                    style={{ color: COLORS.gold }}
                    aria-hidden="true"
                  >
                    &ldquo;
                  </div>
                  <blockquote
                    className="mb-8 font-[family-name:var(--font-playfair)] text-xl font-bold italic leading-relaxed tracking-tight sm:text-2xl lg:text-3xl lg:leading-relaxed"
                    style={{ color: COLORS.textPrimary }}
                  >
                    {testimonial.quote}
                  </blockquote>
                  <div className="flex items-center gap-3">
                    {/* Avatar Placeholder */}
                    <div
                      className="flex h-10 w-10 items-center justify-center font-[family-name:var(--font-playfair)] text-sm font-bold"
                      style={{
                        backgroundColor: COLORS.gold,
                        color: COLORS.dark,
                      }}
                    >
                      {testimonial.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <div
                        className="font-[family-name:var(--font-source-sans)] text-sm font-semibold"
                        style={{ color: COLORS.textPrimary }}
                      >
                        {testimonial.name}
                      </div>
                      <div
                        className="font-[family-name:var(--font-source-sans)] text-xs"
                        style={{ color: COLORS.textMuted }}
                      >
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Divider between testimonials */}
                {index < TESTIMONIALS.length - 1 && (
                  <div className="flex items-center gap-4">
                    <div
                      className="h-px flex-1"
                      style={{ backgroundColor: COLORS.divider }}
                    />
                    <Star
                      size={12}
                      fill={COLORS.gold}
                      strokeWidth={0}
                      style={{ color: COLORS.gold }}
                    />
                    <div
                      className="h-px flex-1"
                      style={{ backgroundColor: COLORS.divider }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          CTA SECTION
         ════════════════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-36">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-12">
          <h2 className="mb-8 font-[family-name:var(--font-playfair)] text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Your next move,
            <br />
            elevated.
          </h2>
          <p
            className="mx-auto mb-10 max-w-md font-[family-name:var(--font-source-sans)] text-base leading-relaxed"
            style={{ color: COLORS.textMuted }}
          >
            Join thousands of professionals who trust ResuMate to craft their
            career narrative. The tools you need, refined to perfection.
          </p>
          <div className="flex flex-col items-center gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-2 px-10 py-4 font-[family-name:var(--font-source-sans)] text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:brightness-110"
              style={{
                backgroundColor: COLORS.gold,
                color: COLORS.dark,
              }}
            >
              Begin Your Journey
              <ArrowRight size={16} strokeWidth={2} />
            </a>
            <p
              className="font-[family-name:var(--font-source-sans)] text-xs tracking-wide"
              style={{ color: COLORS.textMuted }}
            >
              Free to start &middot; No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FOOTER
         ════════════════════════════════════════════════════════════ */}
      <footer style={{ backgroundColor: COLORS.dark }}>
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-6 lg:gap-8">
            {/* Logo Column */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-2">
              <a
                href="#"
                className="font-[family-name:var(--font-playfair)] text-lg font-bold tracking-[0.25em]"
                style={{ color: COLORS.gold }}
              >
                RESUMATE
              </a>
              <p
                className="mt-4 max-w-xs font-[family-name:var(--font-source-sans)] text-sm leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                Intelligent career tools for the modern professional. Crafted
                with precision, powered by AI.
              </p>
            </div>

            {/* Link Columns */}
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <h4
                  className="mb-4 font-[family-name:var(--font-source-sans)] text-[10px] font-semibold tracking-[0.25em] uppercase"
                  style={{ color: COLORS.gold }}
                >
                  {title}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="font-[family-name:var(--font-source-sans)] text-sm transition-colors duration-200"
                        style={{ color: 'rgba(255,255,255,0.4)' }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = COLORS.gold)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')
                        }
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div
            className="mt-16 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row"
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
          >
            <p
              className="font-[family-name:var(--font-source-sans)] text-xs"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              &copy; {new Date().getFullYear()} ResuMate. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {['Twitter', 'LinkedIn', 'Instagram'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="font-[family-name:var(--font-source-sans)] text-xs transition-colors duration-200"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = COLORS.gold)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')
                  }
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
