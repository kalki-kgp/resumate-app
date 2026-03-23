'use client';

import { ChevronRight } from 'lucide-react';
import type { AuthMode } from './AuthModal';

export type CTAProps = {
  onOpenAuth: (mode: AuthMode) => void;
};

export const CTA = ({ onOpenAuth }: CTAProps) => (
  <section
    className="relative overflow-hidden py-16 md:py-24"
    style={{ backgroundColor: '#c96442' }}
  >
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
          onClick={() => onOpenAuth('signup')}
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
);
