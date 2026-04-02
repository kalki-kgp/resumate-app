'use client';

import { HERO_ICON, HERO_USAGE } from './constants';

export const PricingHero = () => {
  const Sparkles = HERO_ICON;

  return (
    <section className="relative mx-auto max-w-5xl px-4 pb-8 pt-8 md:px-8 md:pb-8 md:pt-10 text-center">
      <div
        className="pointer-events-none absolute -left-4 top-10 h-16 w-16 rotate-12 border opacity-30"
        style={{ borderColor: '#cf8f68' }}
      />
      <div
        className="pointer-events-none absolute right-8 top-20 h-24 w-24 rounded-full border opacity-20"
        style={{ borderColor: '#d6c4a0' }}
      />

      <p
        className="mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest"
        style={{
          borderColor: '#d5c4af',
          color: '#875f47',
          backgroundColor: 'rgba(255,255,255,0.65)',
        }}
      >
        <Sparkles className="h-3.5 w-3.5" />
        Credit Store
      </p>

      <h1
        className="text-3xl leading-tight md:text-[2.7rem] md:leading-[1.15]"
        style={{ fontFamily: 'var(--font-fraunces), serif', color: '#2f1e16' }}
      >
        Your dream job is a few <em className="not-italic" style={{ color: '#c46f45' }}>credits</em>{' '}
        away.
      </h1>
      <p className="mt-3 mx-auto max-w-2xl text-sm leading-relaxed md:text-base" style={{ color: '#705447' }}>
        Pay once, use whenever. Credits never expire and work across every AI tool on
        ResuMate - from resume rewrites to cover letters.
      </p>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {HERO_USAGE.map(item => (
          <div
            key={item.action}
            className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs md:text-sm"
            style={{
              borderColor: '#deccb8',
              backgroundColor: 'rgba(255,255,255,0.7)',
              color: '#5e4235',
            }}
          >
            <span className="font-bold" style={{ color: '#c46f45' }}>
              {item.credits} credits
            </span>
            <span style={{ color: '#c3aa92' }}>=</span>
            <span>{item.action}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
