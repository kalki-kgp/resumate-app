'use client';

import { ArrowRight, Lock, Mail, User } from 'lucide-react';

export type AuthMode = 'signin' | 'signup';
export type AuthField = 'fullName' | 'email' | 'password';

export type AuthFormState = {
  fullName: string;
  email: string;
  password: string;
};

export type AuthModalProps = {
  isOpen: boolean;
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
  onSubmit: () => Promise<void> | void;
  form: AuthFormState;
  onFieldChange: (field: AuthField, value: string) => void;
  isSubmitting: boolean;
  authError: string | null;
};

export const AuthModal = ({
  isOpen,
  mode,
  onModeChange,
  onClose,
  onSubmit,
  form,
  onFieldChange,
  isSubmitting,
  authError,
}: AuthModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-4 py-8">
      <button
        type="button"
        className="absolute inset-0 bg-[rgba(44,24,16,0.55)] backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close login modal"
      />

      <div className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-[#eadfce] bg-[#fffaf4] shadow-[0_30px_70px_rgba(44,24,16,0.25)]">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute -left-12 -top-16 h-44 w-44 opacity-70"
            style={{
              backgroundColor: '#f3e7d9',
              borderRadius: '62% 38% 56% 44% / 52% 41% 59% 48%',
            }}
          />
          <div
            className="absolute -right-10 -bottom-10 h-40 w-40 opacity-65"
            style={{
              backgroundColor: '#e6efe7',
              borderRadius: '57% 43% 31% 69% / 42% 53% 47% 58%',
            }}
          />
        </div>

        <div className="relative px-6 pt-7 pb-5 sm:px-8">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <p
                className="text-xs font-semibold tracking-[0.24em] uppercase"
                style={{ color: '#2d5a3d' }}
              >
                Welcome Back
              </p>
              <h3
                className="mt-1 text-3xl font-bold leading-tight"
                style={{
                  color: '#2c1810',
                  fontFamily: 'var(--font-fraunces), serif',
                }}
              >
                {mode === 'signin' ? "Let's pick up where you left off." : 'Create your ResuMate account.'}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{ color: '#8b7355', backgroundColor: '#f4ecdf' }}
            >
              Close
            </button>
          </div>

          <div className="inline-flex rounded-full p-1" style={{ backgroundColor: '#f2e8da' }}>
            <button
              type="button"
              onClick={() => onModeChange('signin')}
              className="rounded-full px-4 py-2 text-xs font-semibold transition-colors"
              style={{
                backgroundColor: mode === 'signin' ? '#ffffff' : 'transparent',
                color: mode === 'signin' ? '#2c1810' : '#8b7355',
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => onModeChange('signup')}
              className="rounded-full px-4 py-2 text-xs font-semibold transition-colors"
              style={{
                backgroundColor: mode === 'signup' ? '#ffffff' : 'transparent',
                color: mode === 'signup' ? '#2c1810' : '#8b7355',
              }}
            >
              Sign Up
            </button>
          </div>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
          className="relative space-y-4 px-6 pb-7 sm:px-8 sm:pb-8"
        >
          {mode === 'signup' && (
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium" style={{ color: '#8b7355' }}>
                Full Name
              </span>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: '#8b7355' }} />
                <input
                  type="text"
                  placeholder="Jordan Lee"
                  value={form.fullName}
                  onChange={(event) => onFieldChange('fullName', event.target.value)}
                  className="w-full rounded-2xl border px-10 py-3 text-sm outline-none transition-all"
                  style={{
                    borderColor: '#eadfce',
                    backgroundColor: '#ffffff',
                    color: '#2c1810',
                  }}
                />
              </div>
            </label>
          )}

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium" style={{ color: '#8b7355' }}>
              Email Address
            </span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: '#8b7355' }} />
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(event) => onFieldChange('email', event.target.value)}
                className="w-full rounded-2xl border px-10 py-3 text-sm outline-none transition-all"
                style={{
                  borderColor: '#eadfce',
                  backgroundColor: '#ffffff',
                  color: '#2c1810',
                }}
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium" style={{ color: '#8b7355' }}>
              Password
            </span>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: '#8b7355' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(event) => onFieldChange('password', event.target.value)}
                className="w-full rounded-2xl border px-10 py-3 text-sm outline-none transition-all"
                style={{
                  borderColor: '#eadfce',
                  backgroundColor: '#ffffff',
                  color: '#2c1810',
                }}
              />
            </div>
          </label>

          {authError && (
            <p className="text-sm font-medium text-[#b6422f]">{authError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg"
            style={{ backgroundColor: '#c96442', opacity: isSubmitting ? 0.8 : 1 }}
          >
            {isSubmitting ? 'Please wait...' : mode === 'signin' ? 'Continue' : 'Create Account'}
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="text-center text-xs font-medium" style={{ color: '#8b7355' }}>
            By continuing, you agree to our terms and privacy policy.
          </p>
        </form>
      </div>
    </div>
  );
};
