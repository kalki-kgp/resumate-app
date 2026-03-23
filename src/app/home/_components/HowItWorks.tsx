'use client';

import { Download, Sparkles, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const steps = [
  {
    icon: User,
    color: '#c96442',
    title: 'Tell us about yourself',
    description:
      'Import your LinkedIn or fill in your details. Our smart forms make it quick and painless.',
  },
  {
    icon: Sparkles,
    color: '#2d5a3d',
    title: 'Let AI do the heavy lifting',
    description:
      'Our AI crafts professional bullet points, optimizes keywords, and tailors your resume to each role.',
  },
  {
    icon: Download,
    color: '#c96442',
    title: 'Download & apply with confidence',
    description:
      'Export as PDF, share a link, or apply directly. You are ready to make your next career move.',
  },
];

export const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="py-16 md:py-24"
      style={{ backgroundColor: '#f0e6d8' }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          className="mx-auto mb-10 max-w-2xl text-center md:mb-14"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          }}
        >
          <p
            className="mb-3 text-sm font-semibold tracking-[0.2em] uppercase md:text-base"
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
              opacity: visible ? 1 : 0,
              transition: 'opacity 1s ease-out 0.5s',
            }}
          />

          <div className="grid gap-8 md:grid-cols-3 md:gap-10">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="flex flex-col items-center text-center"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(30px)',
                    transition: `opacity 0.7s ease-out ${0.2 + i * 0.15}s, transform 0.7s ease-out ${0.2 + i * 0.15}s`,
                  }}
                >
                  <div
                    className="relative z-10 mb-5 flex h-16 w-16 items-center justify-center rounded-2xl shadow-md"
                    style={{ backgroundColor: '#ffffff' }}
                  >
                    <Icon className="h-7 w-7" style={{ color: step.color }} />
                    <div
                      className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: step.color }}
                    >
                      {i + 1}
                    </div>
                  </div>
                  <h3
                    className="mb-2 text-lg font-bold"
                    style={{
                      fontFamily: 'var(--font-fraunces), serif',
                      color: '#2c1810',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#8b7355' }}>
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
