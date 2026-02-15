'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Fraunces, DM_Sans } from 'next/font/google';
import { ApiError, apiRequest, setStoredAccessToken } from '@/lib/api';
import {
  AuthModal,
  Navbar,
  Hero,
  WhyResuMate,
  ProductShowcase,
  HowItWorks,
  Testimonials,
  CTA,
  Footer,
} from '@/app/home/_components';
import type { AuthMode, AuthField, AuthFormState } from '@/app/home/_components';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-fraunces',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

type AuthResponse = {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    full_name: string;
    email: string;
    created_at: string;
  };
};

export default function HomePage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [authForm, setAuthForm] = useState<AuthFormState>({
    fullName: '',
    email: '',
    password: '',
  });
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthError(null);
    setIsAuthOpen(true);
    setMobileMenuOpen(false);
  };

  const handleAuthModeChange = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthError(null);
  };

  const handleAuthFieldChange = (field: AuthField, value: string) => {
    setAuthForm((current) => ({ ...current, [field]: value }));
  };

  const handleAuthSubmit = async () => {
    setAuthError(null);

    const email = authForm.email.trim();
    const password = authForm.password;
    const fullName = authForm.fullName.trim();

    if (!email || !password) {
      setAuthError('Email and password are required.');
      return;
    }

    if (authMode === 'signup' && fullName.length < 2) {
      setAuthError('Please enter your full name.');
      return;
    }

    setIsSubmittingAuth(true);

    try {
      const response = await apiRequest<AuthResponse>(
        authMode === 'signin' ? '/api/v1/auth/signin' : '/api/v1/auth/signup',
        {
          method: 'POST',
          body:
            authMode === 'signin'
              ? { email, password }
              : {
                  full_name: fullName,
                  email,
                  password,
                },
        }
      );

      setStoredAccessToken(response.access_token);
      setIsAuthOpen(false);
      router.push('/dashboard');
    } catch (error) {
      if (error instanceof ApiError) {
        setAuthError(error.detail);
      } else {
        setAuthError('Unable to continue right now. Please try again.');
      }
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isAuthOpen) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsAuthOpen(false);
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isAuthOpen]);

  return (
    <div
      className={`${fraunces.variable} ${dmSans.variable} min-h-screen`}
      style={{
        fontFamily: 'var(--font-dm-sans), sans-serif',
        backgroundColor: '#faf7f2',
        color: '#2c1810',
      }}
    >
      <Navbar
        scrolled={scrolled}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((v) => !v)}
        onOpenAuth={openAuth}
      />
      <Hero onOpenAuth={openAuth} />
      <WhyResuMate />
      <ProductShowcase />
      <HowItWorks />
      <Testimonials />
      <CTA onOpenAuth={openAuth} />
      <Footer />

      <AuthModal
        isOpen={isAuthOpen}
        mode={authMode}
        onModeChange={handleAuthModeChange}
        onClose={() => setIsAuthOpen(false)}
        onSubmit={handleAuthSubmit}
        form={authForm}
        onFieldChange={handleAuthFieldChange}
        isSubmitting={isSubmittingAuth}
        authError={authError}
      />
    </div>
  );
}
