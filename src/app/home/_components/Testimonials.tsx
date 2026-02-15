'use client';

import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote:
      "After being laid off, I felt lost. ResuMate helped me rediscover my strengths and present them in a way that actually resonated with hiring managers. I landed a senior role within three weeks.",
    name: 'Sarah Kim',
    role: 'Senior Product Designer at Figma',
  },
  {
    quote:
      "I was switching from teaching to tech and had no idea how to translate my experience. ResuMate's AI understood my story and helped me craft a resume that got me 5 interviews in my first week.",
    name: 'James Moreno',
    role: 'Software Engineer at Shopify',
  },
  {
    quote:
      "The ATS optimization is a game-changer. I'd been applying for months with no callbacks. After using ResuMate, I started hearing back within days. It genuinely changed my job search.",
    name: 'Amara Okafor',
    role: 'Marketing Manager at Stripe',
  },
];

export const Testimonials = () => (
  <section className="py-20 md:py-28" style={{ backgroundColor: '#faf7f2' }}>
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
        <p
          className="mb-3 text-sm font-semibold tracking-wider uppercase"
          style={{ color: '#c96442' }}
        >
          Testimonials
        </p>
        <h2
          className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
          style={{
            fontFamily: 'var(--font-fraunces), serif',
            color: '#2c1810',
          }}
        >
          Real stories from real people
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3 md:gap-8">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="relative rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:p-10"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e8e0d4',
            }}
          >
            <Quote
              className="mb-4 h-8 w-8 rotate-180"
              style={{ color: '#e8e0d4' }}
              fill="#e8e0d4"
            />

            <p
              className="mb-6 leading-relaxed"
              style={{
                fontFamily: 'var(--font-fraunces), serif',
                fontStyle: 'italic',
                color: '#2c1810',
                fontSize: '0.95rem',
                lineHeight: '1.75',
              }}
            >
              &ldquo;{t.quote}&rdquo;
            </p>

            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{
                  backgroundColor:
                    i === 0 ? '#c96442' : i === 1 ? '#2d5a3d' : '#8b7355',
                }}
              >
                {t.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div>
                <div
                  className="text-sm font-bold"
                  style={{ color: '#2c1810' }}
                >
                  {t.name}
                </div>
                <div className="text-xs" style={{ color: '#8b7355' }}>
                  {t.role}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
