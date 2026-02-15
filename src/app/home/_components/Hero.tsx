'use client';

import { ArrowRight } from 'lucide-react';
import type { AuthMode } from './AuthModal';

const avatars = [
  { initials: 'SK', bg: '#c96442' },
  { initials: 'JM', bg: '#2d5a3d' },
  { initials: 'AL', bg: '#8b7355' },
  { initials: 'RW', bg: '#c96442' },
  { initials: 'TP', bg: '#2d5a3d' },
];

export type HeroProps = {
  onOpenAuth: (mode: AuthMode) => void;
};

export const Hero = ({ onOpenAuth }: HeroProps) => (
  <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
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
            onClick={() => onOpenAuth('signup')}
            className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
            style={{ backgroundColor: '#c96442' }}
          >
            Create Your Resume
            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

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
);
