'use client';

import { Download, Sparkles, User } from 'lucide-react';

export const HowItWorks = () => (
  <section id="how-it-works" className="py-20 md:py-28" style={{ backgroundColor: '#f0e6d8' }}>
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
        <div
          className="absolute top-16 left-[16.5%] hidden h-0.5 w-[67%] md:block"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to right, #c96442 0, #c96442 6px, transparent 6px, transparent 14px)',
          }}
        />

        <div className="grid gap-8 md:grid-cols-3 md:gap-12">
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
);
