'use client';

import { Leaf, Menu, X } from 'lucide-react';
import type { AuthMode } from './AuthModal';

export type NavbarProps = {
  scrolled: boolean;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onOpenAuth: (mode: AuthMode) => void;
};

export const Navbar = ({ scrolled, mobileMenuOpen, onToggleMobileMenu, onOpenAuth }: NavbarProps) => (
  <nav
    className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'shadow-md' : ''
    }`}
    style={{
      backgroundColor: scrolled ? 'rgba(250, 247, 242, 0.95)' : '#faf7f2',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
    }}
  >
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between md:h-20">
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ backgroundColor: '#2d5a3d' }}
          >
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <span
            className="text-xl font-bold tracking-tight md:text-2xl"
            style={{
              fontFamily: 'var(--font-fraunces), serif',
              color: '#2c1810',
            }}
          >
            ResuMate
          </span>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          {['Features', 'Templates', 'Pricing', 'Blog'].map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm font-medium transition-colors duration-200 hover:opacity-80"
              style={{ color: '#8b7355' }}
            >
              {link}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <button
            type="button"
            onClick={() => onOpenAuth('signin')}
            className="text-sm font-medium transition-colors duration-200 hover:opacity-80"
            style={{ color: '#2c1810' }}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => onOpenAuth('signup')}
            className="rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg"
            style={{ backgroundColor: '#c96442' }}
          >
            Start Free
          </button>
        </div>

        <button
          className="md:hidden"
          onClick={onToggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" style={{ color: '#2c1810' }} />
          ) : (
            <Menu className="h-6 w-6" style={{ color: '#2c1810' }} />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t pb-6 md:hidden" style={{ borderColor: '#e8e0d4' }}>
          <div className="flex flex-col gap-4 pt-4">
            {['Features', 'Templates', 'Pricing', 'Blog'].map((link) => (
              <a
                key={link}
                href="#"
                className="text-base font-medium"
                style={{ color: '#8b7355' }}
              >
                {link}
              </a>
            ))}
            <div className="flex flex-col gap-3 pt-4">
              <button
                type="button"
                onClick={() => onOpenAuth('signin')}
                className="text-left text-base font-medium"
                style={{ color: '#2c1810' }}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('signup')}
                className="inline-block rounded-full px-6 py-2.5 text-center text-sm font-semibold text-white"
                style={{ backgroundColor: '#c96442' }}
              >
                Start Free
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </nav>
);
