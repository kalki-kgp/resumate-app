'use client';

import { useEffect, useState } from 'react';
import { Fraunces, DM_Sans } from 'next/font/google';
import { ApiError, apiRequest, getStoredAccessToken, setStoredAccessToken } from '@/lib/api';
import { AuthModal } from '@/app/home/_components';
import type { AuthField, AuthFormState, AuthMode } from '@/app/home/_components';
import {
  PACKS,
  PricingCard,
  PricingHero,
  PricingTrust,
  RazorpayCheckout,
} from './_components';
import type { AuthResponse, CreditPack, CreditPackId } from './_components';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-fraunces',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export default function PricingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [authForm, setAuthForm] = useState<AuthFormState>({
    fullName: '',
    email: '',
    password: '',
  });
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [pendingPackId, setPendingPackId] = useState<CreditPackId | null>(null);
  const [checkoutPack, setCheckoutPack] = useState<CreditPack | null>(null);

  useEffect(() => {
    setIsLoggedIn(!!getStoredAccessToken());
  }, []);

  const openCheckout = (packId: CreditPackId) => {
    const pack = PACKS.find(p => p.id === packId);
    if (!pack) return;

    if (!isLoggedIn) {
      setPendingPackId(packId);
      setAuthMode('signup');
      setAuthError(null);
      setAuthForm({ fullName: '', email: '', password: '' });
      setIsAuthOpen(true);
      return;
    }

    setCheckoutPack(pack);
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
              : { full_name: fullName, email, password },
        }
      );

      setStoredAccessToken(response.access_token);
      setIsLoggedIn(true);
      setIsAuthOpen(false);

      if (pendingPackId) {
        const pack = PACKS.find(p => p.id === pendingPackId);
        if (pack) setCheckoutPack(pack);
        setPendingPackId(null);
      }
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

  return (
    <main
      className={`${fraunces.variable} ${dmSans.variable} min-h-screen overflow-hidden`}
      style={{
        fontFamily: 'var(--font-dm-sans), sans-serif',
        background:
          'radial-gradient(circle at 18% 12%, #f5e0cd 0%, transparent 34%), radial-gradient(circle at 82% 8%, #f0eddc 0%, transparent 28%), #f8f4ee',
        color: '#2f1e16',
      }}
    >
      <PricingHero />

      <section className="mx-auto grid max-w-5xl gap-3 px-4 pb-6 md:grid-cols-3 md:px-8 md:pb-8">
        {PACKS.map(pack => (
          <PricingCard key={pack.id} pack={pack} onBuy={openCheckout} />
        ))}
      </section>

      <PricingTrust />

      <AuthModal
        isOpen={isAuthOpen}
        mode={authMode}
        onModeChange={mode => {
          setAuthMode(mode);
          setAuthError(null);
        }}
        onClose={() => {
          setIsAuthOpen(false);
          setPendingPackId(null);
        }}
        onSubmit={handleAuthSubmit}
        form={authForm}
        onFieldChange={(field: AuthField, value: string) =>
          setAuthForm(prev => ({ ...prev, [field]: value }))
        }
        isSubmitting={isSubmittingAuth}
        authError={authError}
      />

      {checkoutPack ? (
        <RazorpayCheckout pack={checkoutPack} onClose={() => setCheckoutPack(null)} />
      ) : null}
    </main>
  );
}
