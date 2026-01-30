'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useTheme } from '@/hooks';
import { Navbar, Footer } from '@/components';
import {
  Hero,
  Features,
  Templates,
  Testimonials,
  Pricing,
  CTA
} from './_components';

const ThreeBackground = dynamic(
  () => import('./_components/ThreeBackground').then(mod => ({ default: mod.ThreeBackground })),
  {
    ssr: false,
    loading: () => <div className="fixed inset-0 -z-10 bg-slate-50 dark:bg-slate-900" />
  }
);

const AuthModal = dynamic(
  () => import('@/components/ui/AuthModal').then(mod => ({ default: mod.AuthModal })),
  { ssr: false }
);

export default function HomePage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [theme, toggleTheme] = useTheme();

  const openAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <div className={`min-h-screen font-sans antialiased selection:bg-blue-100 selection:text-blue-900 transition-colors duration-500 ${
      theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-slate-50/50 text-slate-900'
    }`}>
      <ThreeBackground theme={theme} />
      <Navbar onOpenAuth={openAuth} theme={theme} toggleTheme={toggleTheme} />
      
      <main>
        <Hero onOpenAuth={openAuth} />
        <Features />
        <Templates />
        <Testimonials />
        <Pricing />
        <CTA onOpenAuth={openAuth} />
      </main>
      
      <Footer />
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        initialMode={authMode} 
      />
    </div>
  );
}
