'use client';

import { FileText, Sparkles, Star } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const templatePreviews = [
  { name: 'Classic', accent: '#c96442' },
  { name: 'Modern', accent: '#2d5a3d' },
  { name: 'Minimal', accent: '#8b7355' },
  { name: 'Creative', accent: '#c96442' },
];

export const ProductShowcase = () => {
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
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="templates" className="py-16 md:py-24">
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
            Product
          </p>
          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
            style={{
              fontFamily: 'var(--font-fraunces), serif',
              color: '#2c1810',
            }}
          >
            See it in action
          </h2>
        </div>

        <div
          className="mx-auto max-w-5xl overflow-hidden rounded-2xl md:rounded-3xl"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e8e0d4',
            boxShadow: '0 25px 60px -12px rgba(44, 24, 16, 0.12)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.98)',
            transition: 'opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s',
          }}
        >
          <div
            className="flex items-center gap-2 border-b px-4 py-3 md:px-6"
            style={{ borderColor: '#e8e0d4', backgroundColor: '#faf7f2' }}
          >
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#e8e0d4' }} />
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#e8e0d4' }} />
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#e8e0d4' }} />
            </div>
            <div
              className="ml-4 flex-1 rounded-lg px-4 py-1.5 text-center text-xs"
              style={{ backgroundColor: '#f0e6d8', color: '#8b7355' }}
            >
              resumate.app/editor
            </div>
          </div>

          <div className="grid md:grid-cols-2">
            <div
              className="border-b p-6 md:border-r md:border-b-0 md:p-8"
              style={{ borderColor: '#e8e0d4' }}
            >
              <div className="mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5" style={{ color: '#c96442' }} />
                <span className="text-sm font-semibold" style={{ color: '#2c1810' }}>
                  Resume Editor
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    className="mb-1.5 block text-xs font-medium"
                    style={{ color: '#8b7355' }}
                  >
                    Full Name
                  </label>
                  <div
                    className="rounded-xl px-4 py-3 text-sm"
                    style={{
                      backgroundColor: '#faf7f2',
                      border: '1px solid #e8e0d4',
                      color: '#2c1810',
                    }}
                  >
                    Sarah Kim
                  </div>
                </div>
                <div>
                  <label
                    className="mb-1.5 block text-xs font-medium"
                    style={{ color: '#8b7355' }}
                  >
                    Job Title
                  </label>
                  <div
                    className="rounded-xl px-4 py-3 text-sm"
                    style={{
                      backgroundColor: '#faf7f2',
                      border: '1px solid #e8e0d4',
                      color: '#2c1810',
                    }}
                  >
                    Senior Product Designer
                  </div>
                </div>
                <div>
                  <label
                    className="mb-1.5 block text-xs font-medium"
                    style={{ color: '#8b7355' }}
                  >
                    Professional Summary
                  </label>
                  <div
                    className="rounded-xl px-4 py-3 text-sm leading-relaxed"
                    style={{
                      backgroundColor: '#faf7f2',
                      border: '1px solid #e8e0d4',
                      color: '#2c1810',
                      minHeight: '80px',
                    }}
                  >
                    Creative product designer with 8+ years of experience building
                    user-centered digital experiences...
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <div
                    className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-white"
                    style={{ backgroundColor: '#c96442' }}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    AI Enhance
                  </div>
                  <div
                    className="rounded-lg px-3 py-2 text-xs font-medium"
                    style={{
                      color: '#8b7355',
                      border: '1px solid #e8e0d4',
                    }}
                  >
                    + Add Section
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8" style={{ backgroundColor: '#faf7f2' }}>
              <div className="mb-6 flex items-center gap-2">
                <Star className="h-5 w-5" style={{ color: '#2d5a3d' }} />
                <span className="text-sm font-semibold" style={{ color: '#2c1810' }}>
                  Live Preview
                </span>
              </div>

              <div
                className="overflow-hidden rounded-xl p-6 shadow-sm"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e8e0d4',
                }}
              >
                <div
                  className="mb-1 h-2 w-16 rounded"
                  style={{ backgroundColor: '#c96442' }}
                />
                <div className="mt-3 space-y-0.5">
                  <div
                    className="text-base font-bold"
                    style={{
                      fontFamily: 'var(--font-fraunces), serif',
                      color: '#2c1810',
                    }}
                  >
                    Sarah Kim
                  </div>
                  <div className="text-xs" style={{ color: '#8b7355' }}>
                    Senior Product Designer
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <div
                      className="mb-1 text-[10px] font-bold tracking-wider uppercase"
                      style={{ color: '#c96442' }}
                    >
                      Summary
                    </div>
                    <div
                      className="h-2 w-full rounded"
                      style={{ backgroundColor: '#f0e6d8' }}
                    />
                    <div
                      className="mt-1 h-2 w-4/5 rounded"
                      style={{ backgroundColor: '#f0e6d8' }}
                    />
                    <div
                      className="mt-1 h-2 w-3/5 rounded"
                      style={{ backgroundColor: '#f0e6d8' }}
                    />
                  </div>
                  <div>
                    <div
                      className="mb-1 text-[10px] font-bold tracking-wider uppercase"
                      style={{ color: '#c96442' }}
                    >
                      Experience
                    </div>
                    <div
                      className="h-2 w-full rounded"
                      style={{ backgroundColor: '#f0e6d8' }}
                    />
                    <div
                      className="mt-1 h-2 w-5/6 rounded"
                      style={{ backgroundColor: '#f0e6d8' }}
                    />
                    <div
                      className="mt-1 h-2 w-4/5 rounded"
                      style={{ backgroundColor: '#f0e6d8' }}
                    />
                    <div
                      className="mt-1 h-2 w-2/3 rounded"
                      style={{ backgroundColor: '#f0e6d8' }}
                    />
                  </div>
                  <div>
                    <div
                      className="mb-1 text-[10px] font-bold tracking-wider uppercase"
                      style={{ color: '#c96442' }}
                    >
                      Skills
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {['Figma', 'Research', 'Prototyping', 'Design Systems'].map(
                        (skill) => (
                          <span
                            key={skill}
                            className="rounded-full px-2 py-0.5 text-[9px]"
                            style={{
                              backgroundColor: '#f0e6d8',
                              color: '#8b7355',
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

        <div
          className="mt-10 text-center md:mt-14"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.8s ease-out 0.4s',
          }}
        >
          <p className="mb-6 text-sm font-medium" style={{ color: '#8b7355' }}>
            <span className="font-bold" style={{ color: '#2c1810' }}>
              40+
            </span>{' '}
            professionally designed templates
          </p>
          <div className="mx-auto grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {templatePreviews.map((template, i) => (
              <div
                key={i}
                className="group cursor-pointer overflow-hidden rounded-xl p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e8e0d4',
                }}
              >
                <div
                  className="mb-2 rounded-lg p-3"
                  style={{ backgroundColor: '#faf7f2' }}
                >
                  <div
                    className="mb-2 h-1 w-8 rounded"
                    style={{ backgroundColor: template.accent }}
                  />
                  <div
                    className="mb-1 h-1.5 w-12 rounded"
                    style={{ backgroundColor: '#2c1810', opacity: 0.2 }}
                  />
                  <div
                    className="mb-2 h-1 w-8 rounded"
                    style={{ backgroundColor: '#8b7355', opacity: 0.2 }}
                  />
                  <div className="space-y-1">
                    <div
                      className="h-1 w-full rounded"
                      style={{ backgroundColor: '#e8e0d4' }}
                    />
                    <div
                      className="h-1 w-4/5 rounded"
                      style={{ backgroundColor: '#e8e0d4' }}
                    />
                    <div
                      className="h-1 w-3/5 rounded"
                      style={{ backgroundColor: '#e8e0d4' }}
                    />
                  </div>
                </div>
                <p
                  className="text-center text-xs font-medium"
                  style={{ color: '#8b7355' }}
                >
                  {template.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
