import type { Metadata } from 'next';
import { HomeClient } from './_components/HomeClient';

export const metadata: Metadata = {
  title: 'ResuMates - AI-Powered Resume Builder',
  description:
    'Build ATS-friendly resumes in minutes with our AI-powered desktop app. Craft the resume that gets you hired.',
  keywords: ['resume builder', 'AI resume', 'ATS friendly', 'job application', 'career tools'],
  openGraph: {
    title: 'ResuMates - AI-Powered Resume Builder',
    description:
      'Build ATS-friendly resumes in minutes with our AI-powered desktop app. Craft the resume that gets you hired.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ResuMates - AI-Powered Resume Builder',
    description:
      'Build ATS-friendly resumes in minutes with our AI-powered desktop app. Craft the resume that gets you hired.',
  },
};

export default function HomePage() {
  return <HomeClient />;
}
