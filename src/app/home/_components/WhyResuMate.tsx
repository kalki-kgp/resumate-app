'use client';

import { Briefcase, CheckCircle, Sparkles } from 'lucide-react';

export const WhyResuMate = () => (
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
);
