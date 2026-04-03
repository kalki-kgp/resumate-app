'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'Is ResuMate free to use?',
    a: 'Yes! You can create an account, build resumes, and choose from multiple professional templates completely free. AI-powered features like smart writing, resume analysis, and cover letter generation use credits — available in affordable packs with no subscriptions.',
  },
  {
    q: 'Will my resume pass ATS screening?',
    a: "ResuMate is built from the ground up for ATS compatibility. Our templates use clean formatting, proper heading hierarchy, and standard section names that ATS systems recognize. 92% of resumes created with ResuMate pass ATS screening on the first try.",
  },
  {
    q: 'How does the AI resume writer work?',
    a: 'Upload your existing resume or enter your details manually. Our AI analyzes your experience and generates professional, tailored bullet points optimized with industry-relevant keywords. You have full control to refine, edit, and customize every section before exporting.',
  },
  {
    q: 'Can I create cover letters too?',
    a: "Absolutely. ResuMate's AI cover letter generator creates tailored cover letters using your resume data and the job description. Choose your preferred tone — professional, conversational, confident, or enthusiastic — and refine each paragraph with AI assistance.",
  },
  {
    q: 'What resume templates are available?',
    a: 'ResuMate offers four professionally designed templates: Modern, Classic, Creative, and Minimal. All templates render at A4 dimensions, are ATS-optimized, and export as clean PDFs ready for job applications.',
  },
  {
    q: 'How is ResuMate different from other resume builders?',
    a: "Unlike generic resume builders, ResuMate uses advanced AI to understand your career narrative — not just fill in blanks. Our AI writes contextual bullet points, optimizes for specific job roles, scores your ATS compatibility, and generates matching cover letters. It's a complete career toolkit, not just a template filler.",
  },
];

const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b"
      style={{ borderColor: '#e8e0d4' }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span
          className="text-base font-semibold pr-4"
          style={{ color: '#2c1810' }}
        >
          {q}
        </span>
        <ChevronDown
          className="h-5 w-5 shrink-0 transition-transform duration-200"
          style={{
            color: '#8b7355',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{
          maxHeight: open ? '300px' : '0px',
          opacity: open ? 1 : 0,
        }}
      >
        <p
          className="pb-5 text-sm leading-relaxed"
          style={{ color: '#8b7355' }}
        >
          {a}
        </p>
      </div>
    </div>
  );
};

export const SeoContent = () => (
  <section className="py-16 md:py-24" style={{ backgroundColor: '#faf7f2' }}>
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      {/* Keyword-rich content block */}
      <div
        className="mx-auto max-w-4xl rounded-3xl p-8 md:p-12"
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e8e0d4',
        }}
      >
        <h2
          className="mb-4 text-2xl font-bold md:text-3xl"
          style={{
            fontFamily: 'var(--font-fraunces), serif',
            color: '#2c1810',
          }}
        >
          The AI Resume Builder That Understands Your Career
        </h2>
        <p
          className="mb-8 text-base leading-relaxed"
          style={{ color: '#8b7355' }}
        >
          ResuMate is more than a resume maker — it&apos;s your AI-powered career companion. Whether
          you&apos;re a fresh graduate writing your first resume, a professional switching careers, or a
          senior leader updating your executive CV, ResuMate&apos;s AI adapts to your experience level and
          industry. Build ATS-friendly resumes, generate tailored cover letters, and get AI-optimized
          bullet points that highlight your real impact — all from your browser.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3
              className="mb-3 text-lg font-bold"
              style={{
                fontFamily: 'var(--font-fraunces), serif',
                color: '#2c1810',
              }}
            >
              What You Get
            </h3>
            <ol
              className="space-y-2 text-sm leading-relaxed"
              style={{ color: '#8b7355' }}
            >
              <li>
                <strong style={{ color: '#2c1810' }}>AI Resume Writing</strong> — Upload
                your existing resume or start fresh. Our AI generates professional bullet points
                tailored to your target role.
              </li>
              <li>
                <strong style={{ color: '#2c1810' }}>ATS Score Analysis</strong> — Get instant
                feedback on ATS compatibility with actionable suggestions to improve your pass rate.
              </li>
              <li>
                <strong style={{ color: '#2c1810' }}>Professional Templates</strong> — Four
                ATS-optimized templates designed for different industries and seniority levels.
              </li>
              <li>
                <strong style={{ color: '#2c1810' }}>Cover Letter Generator</strong> — Create
                matching cover letters from your resume with customizable tone and paragraph-level
                AI refinement.
              </li>
              <li>
                <strong style={{ color: '#2c1810' }}>Smart Job Board</strong> — Browse remote
                and general job listings, then apply with your ResuMate resume directly.
              </li>
            </ol>
          </div>

          <div>
            <h3
              className="mb-3 text-lg font-bold"
              style={{
                fontFamily: 'var(--font-fraunces), serif',
                color: '#2c1810',
              }}
            >
              How It Works
            </h3>
            <ol
              className="list-decimal space-y-2 pl-5 text-sm leading-relaxed"
              style={{ color: '#8b7355' }}
            >
              <li>
                <strong style={{ color: '#2c1810' }}>Sign up for free</strong> — Create your
                account in seconds. No credit card required.
              </li>
              <li>
                <strong style={{ color: '#2c1810' }}>Import or start fresh</strong> — Upload
                your existing resume for AI analysis, or start with a blank template.
              </li>
              <li>
                <strong style={{ color: '#2c1810' }}>Let AI enhance your content</strong> — Our
                AI rewrites bullet points, optimizes keywords, and structures your resume for
                maximum impact.
              </li>
              <li>
                <strong style={{ color: '#2c1810' }}>Choose a template &amp; export</strong> — Pick from
                Modern, Classic, Creative, or Minimal templates and download as a polished PDF.
              </li>
              <li>
                <strong style={{ color: '#2c1810' }}>Generate a cover letter</strong> — Add a
                job description and let AI create a tailored cover letter in your preferred tone.
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* FAQ section */}
      <div className="mx-auto mt-12 max-w-3xl md:mt-16">
        <h2
          className="mb-2 text-center text-2xl font-bold md:text-3xl"
          style={{
            fontFamily: 'var(--font-fraunces), serif',
            color: '#2c1810',
          }}
        >
          Frequently Asked Questions
        </h2>
        <p
          className="mb-8 text-center text-base"
          style={{ color: '#8b7355' }}
        >
          Everything you need to know about building your resume with ResuMate.
        </p>

        <div>
          {faqs.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </div>
  </section>
);
