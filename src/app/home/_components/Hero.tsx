'use client';

import { ArrowRight, ChevronDown } from 'lucide-react';
import { useRef, useSyncExternalStore } from 'react';
import type { AuthMode } from './AuthModal';

const avatars = [
  { initials: 'SK', bg: '#c96442' },
  { initials: 'JM', bg: '#2d5a3d' },
  { initials: 'AL', bg: '#8b7355' },
  { initials: 'RW', bg: '#c96442' },
  { initials: 'TP', bg: '#2d5a3d' },
];

const stats = [
  { value: '50K+', label: 'Resumes Created' },
  { value: '92%', label: 'ATS Pass Rate' },
  { value: '3x', label: 'More Interviews' },
];

const emptySubscribe = () => () => {};

export type HeroProps = {
  onOpenAuth: (mode: AuthMode) => void;
};

export const Hero = ({ onOpenAuth }: HeroProps) => {
  const mountedRef = useRef(false);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => {
      mountedRef.current = true;
      return true;
    },
    () => false
  );

  return (
    <section className="relative flex min-h-dvh flex-col overflow-hidden">
      {/* Background blobs */}
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
        className="absolute bottom-32 left-1/3 h-48 w-48 opacity-20 md:h-64 md:w-64"
        style={{
          backgroundColor: '#2d5a3d',
          borderRadius: '50% 50% 30% 70% / 40% 60% 40% 60%',
          filter: 'blur(60px)',
        }}
      />

      {/* Main content — centered vertically */}
      <div className="relative flex flex-1 items-center pt-20 md:pt-24">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1
              className="text-5xl leading-[1.1] font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
              style={{
                fontFamily: 'var(--font-fraunces), serif',
                color: '#2c1810',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
              }}
            >
              Your story deserves
              <br />
              to be told{' '}
              <span className="relative inline-block">
                right
                <svg
                  className="absolute -bottom-1 left-0 w-full sm:-bottom-2"
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
                    style={{
                      strokeDasharray: 200,
                      strokeDashoffset: mounted ? 0 : 200,
                      transition: 'stroke-dashoffset 1.2s ease-out 0.5s',
                    }}
                  />
                </svg>
              </span>
              .
            </h1>

            <p
              className="mx-auto mt-5 max-w-2xl text-base leading-relaxed sm:text-lg md:mt-6 md:text-xl"
              style={{
                color: '#8b7355',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(15px)',
                transition: 'opacity 0.8s ease-out 0.3s, transform 0.8s ease-out 0.3s',
              }}
            >
              ResuMate helps you craft resumes that capture who you really are
              — and gets them past every ATS.
            </p>

            <div
              className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:mt-8"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(15px)',
                transition: 'opacity 0.8s ease-out 0.5s, transform 0.8s ease-out 0.5s',
              }}
            >
              <button
                type="button"
                onClick={() => onOpenAuth('signup')}
                className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                style={{ backgroundColor: '#c96442' }}
              >
                Create Your Resume
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 rounded-full px-6 py-4 text-sm font-medium transition-all duration-200 hover:opacity-80"
                style={{ color: '#8b7355' }}
              >
                See how it works
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            {/* Social proof row */}
            <div
              className="mt-10 flex flex-col items-center gap-4 md:mt-12"
              style={{
                opacity: mounted ? 1 : 0,
                transition: 'opacity 0.8s ease-out 0.7s',
              }}
            >
              <div className="flex -space-x-2">
                {avatars.map((avatar, i) => (
                  <div
                    key={i}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 text-[10px] font-bold text-white sm:h-10 sm:w-10 sm:text-xs"
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

          {/* Stats bar */}
          <div
            className="mx-auto mt-12 max-w-2xl md:mt-14"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.8s ease-out 0.9s, transform 0.8s ease-out 0.9s',
            }}
          >
            <div
              className="flex items-center justify-center rounded-2xl px-2 py-4 sm:px-4 sm:py-5"
              style={{
                backgroundColor: 'rgba(255,255,255,0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid #e8e0d4',
              }}
            >
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="flex-1 text-center px-2 sm:px-6"
                  style={{
                    borderRight: i < stats.length - 1 ? '1px solid #e8e0d4' : 'none',
                  }}
                >
                  <div
                    className="text-xl font-bold sm:text-2xl md:text-3xl"
                    style={{
                      fontFamily: 'var(--font-fraunces), serif',
                      color: '#c96442',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="mt-0.5 text-[10px] font-medium tracking-wide uppercase sm:text-xs"
                    style={{ color: '#8b7355' }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative pb-6 pt-4 text-center md:pb-8">
        <a
          href="#features"
          className="inline-flex flex-col items-center gap-1 transition-opacity duration-300 hover:opacity-70"
          style={{ color: '#8b7355' }}
          aria-label="Scroll to features"
        >
          <span className="text-[10px] font-medium tracking-widest uppercase">
            Scroll to explore
          </span>
          <ChevronDown className="h-5 w-5 animate-bounce-subtle" />
        </a>
      </div>
    </section>
  );
};
