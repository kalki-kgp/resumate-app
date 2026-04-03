import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Resume Builder - Create ATS-Friendly Resumes in Minutes',
  description:
    'ResuMate is a free AI-powered resume builder. Craft professional, ATS-optimized resumes with AI writing, smart templates, and cover letter generation. 50,000+ professionals trust ResuMate.',
  alternates: {
    canonical: 'https://resumate.paperknife.app/home',
  },
  openGraph: {
    title: 'ResuMate - AI Resume Builder That Gets You Hired',
    description:
      'Build professional resumes with AI. 92% ATS pass rate, 3x more interview callbacks. Smart templates, AI writing, and cover letter generation.',
    url: 'https://resumate.paperknife.app/home',
  },
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
