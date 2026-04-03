import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing - Affordable AI Resume Credits',
  description:
    'Get started free with ResuMate. Purchase affordable credit packs for AI resume writing, ATS analysis, cover letter generation, and more. No subscriptions — pay only for what you use.',
  alternates: {
    canonical: 'https://resumate.paperknife.app/pricing',
  },
  openGraph: {
    title: 'ResuMate Pricing - Affordable AI Resume Credits',
    description:
      'No subscriptions. Buy credit packs for AI resume features — writing, analysis, cover letters. Start free.',
    url: 'https://resumate.paperknife.app/pricing',
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
