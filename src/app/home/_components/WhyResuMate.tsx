'use client';

import { Briefcase, CheckCircle, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const features = [
  {
    icon: Sparkles,
    iconColor: '#c96442',
    iconBg: '#f0e6d8',
    bigText: 'AI',
    bigTextColor: '#c96442',
    title: 'AI That Understands You',
    description:
      'Not just keywords. Our AI captures your unique voice and experience, turning your career story into compelling content that resonates with hiring managers.',
  },
  {
    icon: CheckCircle,
    iconColor: '#2d5a3d',
    iconBg: '#e8f5ed',
    bigText: '92%',
    bigTextColor: '#2d5a3d',
    title: 'Beat Every ATS',
    description:
      '92% of our users pass ATS screening on first try. Our intelligent formatting and keyword optimization ensures your resume never gets lost in the black hole.',
  },
  {
    icon: Briefcase,
    iconColor: '#c96442',
    iconBg: '#f0e6d8',
    bigText: '3x',
    bigTextColor: '#c96442',
    title: 'Land Interviews Faster',
    description:
      'Users report 3x more interview callbacks within 2 weeks. Because when your resume speaks your language, employers listen.',
  },
];

export const WhyResuMate = () => {
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
      id="features"
      className="relative py-16 md:py-24"
    >
      {/* Subtle background accent */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, #c96442 0%, transparent 50%), radial-gradient(circle at 80% 50%, #2d5a3d 0%, transparent 50%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header — big and bold */}
        <div
          className="mx-auto mb-14 max-w-3xl text-center md:mb-20"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          }}
        >
          <p
            className="mb-4 text-sm font-semibold tracking-[0.2em] uppercase md:text-base"
            style={{ color: '#c96442' }}
          >
            Why ResuMate?
          </p>
          <h2
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            style={{
              fontFamily: 'var(--font-fraunces), serif',
              color: '#2c1810',
            }}
          >
            Built for the way you{' '}
            <span className="italic" style={{ color: '#c96442' }}>
              actually
            </span>{' '}
            job search
          </h2>
          <p
            className="mx-auto mt-4 max-w-xl text-base leading-relaxed md:mt-6 md:text-lg"
            style={{ color: '#8b7355' }}
          >
            Stop wrestling with formatting. Start landing interviews.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="group relative overflow-hidden rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:p-10"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e8e0d4',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(40px)',
                  transition: `opacity 0.7s ease-out ${0.2 + i * 0.15}s, transform 0.7s ease-out ${0.2 + i * 0.15}s, box-shadow 0.3s ease, translate 0.3s ease`,
                }}
              >
                {/* Background big text */}
                <div
                  className="pointer-events-none absolute top-4 right-4 text-6xl font-black opacity-[0.06] md:text-7xl"
                  style={{
                    fontFamily: 'var(--font-fraunces), serif',
                    color: feature.bigTextColor,
                  }}
                >
                  {feature.bigText}
                </div>

                <div
                  className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: feature.iconBg }}
                >
                  <Icon className="h-7 w-7" style={{ color: feature.iconColor }} />
                </div>

                <h3
                  className="mb-3 text-xl font-bold md:text-2xl"
                  style={{
                    fontFamily: 'var(--font-fraunces), serif',
                    color: '#2c1810',
                  }}
                >
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed md:text-base" style={{ color: '#8b7355' }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
