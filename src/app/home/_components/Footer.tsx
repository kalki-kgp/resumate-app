'use client';

import { Leaf } from 'lucide-react';

export const Footer = () => (
  <footer style={{ backgroundColor: '#faf7f2' }}>
    <div className="mx-auto max-w-7xl px-6 pt-16 pb-8 lg:px-8">
      <div className="grid gap-8 md:grid-cols-4 md:gap-12">
        <div className="md:col-span-1">
          <div className="mb-4 flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: '#2d5a3d' }}
            >
              <Leaf className="h-4 w-4 text-white" />
            </div>
            <span
              className="text-xl font-bold"
              style={{
                fontFamily: 'var(--font-fraunces), serif',
                color: '#2c1810',
              }}
            >
              ResuMate
            </span>
          </div>
          <p
            className="text-sm leading-relaxed"
            style={{ color: '#8b7355' }}
          >
            AI-powered resume builder that helps you tell your career story
            with confidence.
          </p>
        </div>

        <div>
          <h4
            className="mb-4 text-sm font-bold"
            style={{ color: '#2c1810' }}
          >
            Product
          </h4>
          <ul className="space-y-2.5">
            {[
              { label: 'Resume Builder', href: '/editor' },
              { label: 'Templates', href: '/home#templates' },
              { label: 'AI Writer', href: '/editor' },
              { label: 'ATS Checker', href: '/dashboard' },
              { label: 'Cover Letters', href: '/cover-letter' },
            ].map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm transition-colors duration-200 hover:opacity-70"
                  style={{ color: '#8b7355' }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4
            className="mb-4 text-sm font-bold"
            style={{ color: '#2c1810' }}
          >
            Resources
          </h4>
          <ul className="space-y-2.5">
            {[
              { label: 'How It Works', href: '/home#how-it-works' },
              { label: 'Testimonials', href: '/home#testimonials' },
              { label: 'Features', href: '/home#features' },
            ].map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm transition-colors duration-200 hover:opacity-70"
                  style={{ color: '#8b7355' }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4
            className="mb-4 text-sm font-bold"
            style={{ color: '#2c1810' }}
          >
            Company
          </h4>
          <ul className="space-y-2.5">
            {[
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' },
            ].map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm transition-colors duration-200 hover:opacity-70"
                  style={{ color: '#8b7355' }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row"
        style={{ borderColor: '#e8e0d4' }}
      >
        <p className="text-sm" style={{ color: '#8b7355' }}>
          Made with care for job seekers everywhere
        </p>
        <p className="text-sm" style={{ color: '#8b7355' }}>
          &copy; {new Date().getFullYear()} ResuMate. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);
