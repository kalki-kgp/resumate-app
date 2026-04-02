import { CheckCircle2, Shield, Sparkles, TrendingUp, Zap, Crown } from 'lucide-react';
import type { CreditPack } from './types';

export const PACKS: CreditPack[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Perfect for a focused job sprint',
    price: 99,
    credits: 100,
    perCredit: 0.99,
    icon: Zap,
    perks: [
      '100 AI credits',
      '~6 full resume analyses',
      '~4 AI-written cover letters',
      '~20 bullet point rewrites',
      'Credits never expire',
    ],
    useCases: ['6 analyses', '4 cover letters'],
  },
  {
    id: 'growth',
    name: 'Growth',
    tagline: 'For job seekers applying every week',
    price: 299,
    credits: 400,
    perCredit: 0.75,
    savingsPct: 24,
    badge: 'Most Popular',
    featured: true,
    icon: TrendingUp,
    perks: [
      '400 AI credits',
      '~26 full resume analyses',
      '~20 AI-written cover letters',
      '~80 bullet point rewrites',
      'Priority AI processing',
      'Credits never expire',
    ],
    useCases: ['26 analyses', '20 cover letters'],
  },
  {
    id: 'power',
    name: 'Power',
    tagline: 'Built for relentless job hunters',
    price: 599,
    credits: 1000,
    perCredit: 0.6,
    savingsPct: 40,
    badge: 'Best Value',
    icon: Crown,
    perks: [
      '1000 AI credits',
      '~66 full resume analyses',
      '~50 AI-written cover letters',
      '~200 bullet point rewrites',
      'Priority AI processing',
      'Bulk edit optimizations',
      'Credits never expire',
    ],
    useCases: ['66 analyses', '50 cover letters'],
  },
];

export const HERO_USAGE = [
  { credits: '5', action: '1 bullet rewrite' },
  { credits: '15', action: '1 resume analysis' },
  { credits: '20', action: '1 cover letter' },
];

export const TRUST_ITEMS = [
  {
    icon: Shield,
    text: 'Payments secured by Razorpay',
    sub: 'PCI-DSS compliant checkout',
  },
  {
    icon: CheckCircle2,
    text: 'Credits added instantly',
    sub: 'Available right in your wallet',
  },
  {
    icon: Zap,
    text: 'Works across all AI tools',
    sub: 'Resume, cover letter, rewrites',
  },
];

export const HERO_ICON = Sparkles;
