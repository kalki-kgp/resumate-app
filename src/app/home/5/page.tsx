'use client';

import { useState, useEffect, useRef } from 'react';
import { Anton, Work_Sans } from 'next/font/google';
import {
  PenTool,
  Target,
  Briefcase,
  Zap,
  ArrowRight,
  Menu,
  X,
  Star,
  ChevronUp,
} from 'lucide-react';

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-anton',
});

const workSans = Work_Sans({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-work-sans',
});

/* ------------------------------------------------------------------ */
/*  Animated counter hook                                              */
/* ------------------------------------------------------------------ */
function useCountUp(
  end: number,
  suffix: string,
  duration: number = 2000,
  triggerRef: React.RefObject<HTMLElement | null>,
) {
  const [value, setValue] = useState('0');
  const hasRun = useRef(false);

  useEffect(() => {
    const node = triggerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true;
          const start = 0;
          const startTime = performance.now();

          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (end - start) * eased);
            setValue(current.toLocaleString() + suffix);
            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [end, suffix, duration, triggerRef]);

  return value;
}

/* ------------------------------------------------------------------ */
/*  Fade-in-on-scroll wrapper                                          */
/* ------------------------------------------------------------------ */
function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ================================================================== */
/*  PAGE                                                                */
/* ================================================================== */
export default function BoldImpactPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const resumesBuilt = useCountUp(50247, '', 2200, statsRef);
  const atsRate = useCountUp(92, '%', 1800, statsRef);

  /* -------------------------------------------------------------- */
  /*  Features data                                                   */
  /* -------------------------------------------------------------- */
  const features = [
    {
      num: '01',
      title: 'AI RESUME WRITER',
      desc: 'Our AI writes. You approve. Get a polished, professional resume in minutes -- not hours.',
      icon: PenTool,
    },
    {
      num: '02',
      title: 'ATS OPTIMIZER',
      desc: 'Score 90%+ every single time. Our engine reverse-engineers what hiring software wants.',
      icon: Target,
    },
    {
      num: '03',
      title: 'JOB MATCHER',
      desc: 'We find jobs. You pick the best. AI-powered matching based on your skills and goals.',
      icon: Briefcase,
    },
    {
      num: '04',
      title: 'ONE-CLICK APPLY',
      desc: 'Apply to 50 jobs in 10 minutes. Auto-fill applications across every major platform.',
      icon: Zap,
    },
  ];

  const testimonials = [
    {
      quote:
        '"I went from zero callbacks to 8 interviews in two weeks. This thing is aggressive in the best way."',
      name: 'MARCUS T.',
      role: 'Software Engineer',
    },
    {
      quote:
        '"My resume finally passes ATS filters. I used to get ghosted constantly -- not anymore."',
      name: 'PRIYA S.',
      role: 'Product Manager',
    },
    {
      quote:
        '"The one-click apply feature alone saved me 20+ hours of repetitive form filling."',
      name: 'JORDAN K.',
      role: 'Marketing Lead',
    },
  ];

  return (
    <div
      className={`${anton.variable} ${workSans.variable} min-h-screen`}
      style={{ backgroundColor: '#f0ede6', color: '#111111' }}
    >
      {/* ========================================================== */}
      {/*  NAVIGATION                                                 */}
      {/* ========================================================== */}
      <nav
        className="sticky top-0 z-50"
        style={{
          backgroundColor: '#f0ede6',
          borderBottom: '3px solid #111111',
        }}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 lg:px-10">
          {/* Logo */}
          <a
            href="#"
            className="select-none text-3xl tracking-tight lg:text-4xl"
            style={{ fontFamily: 'var(--font-anton)' }}
          >
            RESUMATE
          </a>

          {/* Desktop links */}
          <div className="hidden items-center gap-10 md:flex">
            {['FEATURES', 'STATS', 'TESTIMONIALS'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-xs font-medium tracking-[0.25em] transition-colors hover:opacity-60"
                style={{ fontFamily: 'var(--font-work-sans)' }}
              >
                {link}
              </a>
            ))}
            <a
              href="#cta"
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold tracking-[0.2em] transition-opacity hover:opacity-80"
              style={{
                fontFamily: 'var(--font-work-sans)',
                backgroundColor: '#ff4d00',
                color: '#fff',
              }}
            >
              START NOW
              <ArrowRight size={14} strokeWidth={2.5} />
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div
            className="flex flex-col gap-6 px-6 pb-8 pt-2 md:hidden"
            style={{
              backgroundColor: '#f0ede6',
              borderTop: '1px solid #111111',
            }}
          >
            {['FEATURES', 'STATS', 'TESTIMONIALS'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium tracking-[0.2em]"
                style={{ fontFamily: 'var(--font-work-sans)' }}
              >
                {link}
              </a>
            ))}
            <a
              href="#cta"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex w-fit items-center gap-2 px-6 py-3 text-xs font-semibold tracking-[0.2em]"
              style={{
                fontFamily: 'var(--font-work-sans)',
                backgroundColor: '#ff4d00',
                color: '#fff',
              }}
            >
              START NOW
              <ArrowRight size={14} strokeWidth={2.5} />
            </a>
          </div>
        )}
      </nav>

      {/* ========================================================== */}
      {/*  HERO                                                        */}
      {/* ========================================================== */}
      <section className="relative overflow-hidden px-6 pb-16 pt-16 lg:px-10 lg:pb-24 lg:pt-24">
        <div className="mx-auto max-w-[1400px]">
          {/* Massive headline */}
          <Reveal>
            <h1
              className="leading-[0.9] tracking-tight"
              style={{ fontFamily: 'var(--font-anton)' }}
            >
              <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
                STOP SENDING
              </span>

              <span className="relative mt-2 block text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
                <span
                  className="line-through decoration-4"
                  style={{ color: '#ff4d00', textDecorationColor: '#ff4d00' }}
                >
                  BORING
                </span>
              </span>

              <span
                className="mt-1 block text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
                style={{ color: '#ff4d00' }}
              >
                WINNING
              </span>

              <span className="mt-2 block text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
                RESUMES.
              </span>
            </h1>
          </Reveal>

          {/* Sub-text */}
          <Reveal delay={200}>
            <p
              className="mt-10 max-w-xl text-lg leading-relaxed md:text-xl"
              style={{
                fontFamily: 'var(--font-work-sans)',
                color: '#555555',
              }}
            >
              AI-powered resumes that crush applicant tracking systems.
              Find matching jobs. Apply in bulk. Land interviews faster
              than ever before.
            </p>
          </Reveal>

          {/* CTA Button */}
          <Reveal delay={350}>
            <a
              href="#cta"
              className="mt-10 inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold tracking-[0.15em] transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{
                fontFamily: 'var(--font-work-sans)',
                backgroundColor: '#111111',
                color: '#ffffff',
              }}
            >
              BUILD YOURS NOW
              <ArrowRight size={20} strokeWidth={2.5} />
            </a>
          </Reveal>

          {/* Stat bar */}
          <Reveal delay={500}>
            <div
              ref={statsRef}
              className="mt-16 flex flex-col gap-8 sm:flex-row sm:items-end sm:gap-16"
              style={{ borderTop: '2px solid #111111' }}
            >
              {[
                { value: resumesBuilt, label: 'RESUMES BUILT' },
                { value: atsRate, label: 'ATS PASS RATE' },
                { value: '4.8/5', label: 'USER RATED' },
              ].map((stat, i) => (
                <div key={i} className="pt-6">
                  <span
                    className="block text-4xl tracking-tight md:text-5xl"
                    style={{ fontFamily: 'var(--font-anton)' }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="mt-1 block text-[10px] font-medium tracking-[0.3em]"
                    style={{
                      fontFamily: 'var(--font-work-sans)',
                      color: '#555555',
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================== */}
      {/*  FEATURES                                                    */}
      {/* ========================================================== */}
      <section id="features">
        {/* Section title */}
        <div
          className="px-6 py-12 lg:px-10 lg:py-16"
          style={{ borderTop: '3px solid #111111' }}
        >
          <div className="mx-auto max-w-[1400px]">
            <Reveal>
              <h2
                className="text-5xl tracking-tight md:text-7xl"
                style={{ fontFamily: 'var(--font-anton)' }}
              >
                WHAT YOU GET.
              </h2>
            </Reveal>
          </div>
        </div>

        {/* Feature bands */}
        {features.map((f, i) => {
          const isDark = i % 2 === 0;
          const Icon = f.icon;

          return (
            <div
              key={f.num}
              className="relative overflow-hidden"
              style={{
                backgroundColor: isDark ? '#111111' : '#f0ede6',
                color: isDark ? '#ffffff' : '#111111',
                borderTop: isDark ? 'none' : '2px solid #111111',
                borderBottom: isDark ? 'none' : '2px solid #111111',
              }}
            >
              {/* Giant background number */}
              <span
                className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 select-none text-[16rem] leading-none tracking-tighter sm:text-[22rem] md:text-[28rem]"
                style={{
                  fontFamily: 'var(--font-anton)',
                  opacity: isDark ? 0.06 : 0.07,
                }}
              >
                {f.num}
              </span>

              <div className="relative mx-auto flex max-w-[1400px] flex-col gap-6 px-6 py-16 md:flex-row md:items-center md:gap-16 lg:px-10 lg:py-24">
                {/* Icon */}
                <Reveal>
                  <div
                    className="flex h-20 w-20 flex-shrink-0 items-center justify-center"
                    style={{
                      border: `2px solid ${isDark ? '#ffffff' : '#111111'}`,
                    }}
                  >
                    <Icon
                      size={36}
                      strokeWidth={1.5}
                      color={isDark ? '#ff4d00' : '#ff4d00'}
                    />
                  </div>
                </Reveal>

                {/* Text */}
                <div>
                  <Reveal delay={100}>
                    <span
                      className="text-xs font-medium tracking-[0.3em]"
                      style={{
                        fontFamily: 'var(--font-work-sans)',
                        color: '#ff4d00',
                      }}
                    >
                      {f.num}
                    </span>
                    <h3
                      className="mt-2 text-4xl tracking-tight md:text-5xl lg:text-6xl"
                      style={{ fontFamily: 'var(--font-anton)' }}
                    >
                      {f.title}
                    </h3>
                  </Reveal>
                  <Reveal delay={200}>
                    <p
                      className="mt-4 max-w-lg text-lg leading-relaxed"
                      style={{
                        fontFamily: 'var(--font-work-sans)',
                        color: isDark ? '#aaaaaa' : '#555555',
                      }}
                    >
                      {f.desc}
                    </p>
                  </Reveal>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* ========================================================== */}
      {/*  STATS                                                       */}
      {/* ========================================================== */}
      <section
        id="stats"
        className="px-6 py-24 lg:px-10 lg:py-32"
        style={{
          backgroundColor: '#f0ede6',
          borderTop: '3px solid #111111',
        }}
      >
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <h2
              className="mb-20 text-5xl tracking-tight md:text-7xl"
              style={{ fontFamily: 'var(--font-anton)' }}
            >
              THE NUMBERS.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 gap-16 md:grid-cols-3 md:gap-8">
            {[
              {
                value: '50K+',
                label: 'Resumes built',
                color: '#ff4d00',
              },
              {
                value: '92%',
                label: 'ATS pass rate',
                color: '#111111',
              },
              {
                value: '3X',
                label: 'Faster job placement',
                color: '#0055ff',
              },
            ].map((stat, i) => (
              <Reveal key={i} delay={i * 150}>
                <div className="text-center md:text-left">
                  <span
                    className="block text-8xl tracking-tight sm:text-9xl lg:text-[10rem] xl:text-[12rem]"
                    style={{
                      fontFamily: 'var(--font-anton)',
                      color: stat.color,
                      lineHeight: '0.85',
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="mt-4 block text-sm font-medium tracking-[0.25em] uppercase"
                    style={{
                      fontFamily: 'var(--font-work-sans)',
                      color: '#555555',
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/*  TESTIMONIALS                                                */}
      {/* ========================================================== */}
      <section
        id="testimonials"
        className="px-6 py-24 lg:px-10 lg:py-32"
        style={{
          backgroundColor: '#f0ede6',
          borderTop: '3px solid #111111',
        }}
      >
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <h2
              className="mb-16 text-5xl tracking-tight md:text-7xl"
              style={{ fontFamily: 'var(--font-anton)' }}
            >
              WHAT PEOPLE SAY.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 150}>
                <div
                  className="flex h-full flex-col justify-between p-8"
                  style={{
                    backgroundColor: '#ffffff',
                    borderTop: '4px solid #ff4d00',
                    border: '2px solid #111111',
                    borderTopWidth: '4px',
                    borderTopColor: '#ff4d00',
                  }}
                >
                  <div>
                    {/* Stars */}
                    <div className="mb-6 flex gap-1">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Star
                          key={si}
                          size={16}
                          fill="#ff4d00"
                          color="#ff4d00"
                        />
                      ))}
                    </div>

                    <p
                      className="text-lg leading-relaxed"
                      style={{ fontFamily: 'var(--font-work-sans)' }}
                    >
                      {t.quote}
                    </p>
                  </div>

                  <div className="mt-8">
                    <span
                      className="block text-sm font-semibold tracking-[0.15em]"
                      style={{ fontFamily: 'var(--font-work-sans)' }}
                    >
                      {t.name}
                    </span>
                    <span
                      className="mt-1 block text-xs tracking-[0.2em]"
                      style={{
                        fontFamily: 'var(--font-work-sans)',
                        color: '#555555',
                      }}
                    >
                      {t.role.toUpperCase()}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/*  CTA                                                         */}
      {/* ========================================================== */}
      <section
        id="cta"
        className="relative overflow-hidden px-6 py-28 lg:px-10 lg:py-40"
        style={{ backgroundColor: '#111111' }}
      >
        {/* Decorative background text */}
        <span
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[18rem] leading-none tracking-tighter sm:text-[26rem] md:text-[32rem]"
          style={{
            fontFamily: 'var(--font-anton)',
            color: '#ffffff',
            opacity: 0.03,
          }}
        >
          GO
        </span>

        <div className="relative mx-auto max-w-[1400px] text-center">
          <Reveal>
            <h2
              className="text-7xl tracking-tight md:text-8xl lg:text-9xl"
              style={{ fontFamily: 'var(--font-anton)', color: '#ffffff' }}
            >
              READY?
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p
              className="mx-auto mt-6 max-w-md text-lg"
              style={{
                fontFamily: 'var(--font-work-sans)',
                color: '#888888',
              }}
            >
              Your next career move starts with a resume that actually
              works. Build it now.
            </p>
          </Reveal>
          <Reveal delay={350}>
            <a
              href="#"
              className="mt-12 inline-flex items-center gap-3 px-12 py-6 text-lg font-semibold tracking-[0.2em] transition-transform hover:scale-[1.03] active:scale-[0.98]"
              style={{
                fontFamily: 'var(--font-work-sans)',
                backgroundColor: '#ff4d00',
                color: '#ffffff',
              }}
            >
              LET&apos;S GO
              <ArrowRight size={20} strokeWidth={2.5} />
            </a>
          </Reveal>
        </div>
      </section>

      {/* ========================================================== */}
      {/*  FOOTER                                                      */}
      {/* ========================================================== */}
      <footer
        className="px-6 py-16 lg:px-10"
        style={{
          backgroundColor: '#f0ede6',
          borderTop: '3px solid #111111',
        }}
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
            {/* Brand */}
            <div>
              <span
                className="block text-4xl tracking-tight"
                style={{ fontFamily: 'var(--font-anton)' }}
              >
                RESUMATE
              </span>
              <span
                className="mt-2 block text-xs font-medium tracking-[0.3em]"
                style={{
                  fontFamily: 'var(--font-work-sans)',
                  color: '#555555',
                }}
              >
                BUILT DIFFERENT.
              </span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-x-12 gap-y-4">
              {[
                'FEATURES',
                'PRICING',
                'BLOG',
                'CAREERS',
                'CONTACT',
                'PRIVACY',
                'TERMS',
              ].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-xs font-medium tracking-[0.25em] transition-opacity hover:opacity-60"
                  style={{
                    fontFamily: 'var(--font-work-sans)',
                    color: '#555555',
                  }}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="mt-12 flex flex-col items-start justify-between gap-4 pt-8 sm:flex-row sm:items-center"
            style={{ borderTop: '1px solid #111111' }}
          >
            <span
              className="text-xs tracking-[0.15em]"
              style={{
                fontFamily: 'var(--font-work-sans)',
                color: '#555555',
              }}
            >
              &copy; {new Date().getFullYear()} RESUMATE. ALL RIGHTS
              RESERVED.
            </span>
          </div>
        </div>
      </footer>

      {/* ========================================================== */}
      {/*  BACK TO TOP                                                 */}
      {/* ========================================================== */}
      <BackToTop />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Back-to-top button                                                 */
/* ------------------------------------------------------------------ */
function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center transition-transform hover:scale-110 active:scale-95"
      style={{ backgroundColor: '#111111', color: '#ffffff' }}
      aria-label="Back to top"
    >
      <ChevronUp size={22} strokeWidth={2.5} />
    </button>
  );
}
