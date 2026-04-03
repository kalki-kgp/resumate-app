import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'ResuMate Terms of Service — the rules and guidelines for using our AI-powered resume builder.',
  alternates: {
    canonical: 'https://resumate.paperknife.app/terms',
  },
};

export default function TermsPage() {
  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: '#faf7f2',
        color: '#2c1810',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <Link
          href="/home"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: '#8b7355' }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <h1
          className="mb-2 text-3xl font-bold md:text-4xl"
          style={{ color: '#2c1810' }}
        >
          Terms of Service
        </h1>
        <p className="mb-10 text-sm" style={{ color: '#8b7355' }}>
          Last updated: April 3, 2026
        </p>

        <div className="space-y-8 text-base leading-relaxed" style={{ color: '#5a4a3a' }}>
          <section>
            <h2 className="mb-3 text-xl font-bold" style={{ color: '#2c1810' }}>
              1. Acceptance of Terms
            </h2>
            <p>
              By creating an account or using ResuMate, you agree to these Terms of Service. If you
              do not agree, please do not use the service. We may update these terms from time to
              time — continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold" style={{ color: '#2c1810' }}>
              2. Description of Service
            </h2>
            <p>
              ResuMate is an AI-powered resume builder that helps users create professional,
              ATS-friendly resumes and cover letters. The service includes a resume editor, AI
              writing assistance, resume analysis, cover letter generation, and a job board
              aggregator.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold" style={{ color: '#2c1810' }}>
              3. Accounts &amp; Registration
            </h2>
            <ul className="list-disc space-y-1.5 pl-6">
              <li>You must provide accurate information when creating an account.</li>
              <li>You are responsible for maintaining the security of your account credentials.</li>
              <li>You must be at least 16 years old to use ResuMate.</li>
              <li>One account per person. Shared or automated accounts are not permitted.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold" style={{ color: '#2c1810' }}>
              4. Credits &amp; Payments
            </h2>
            <ul className="list-disc space-y-1.5 pl-6">
              <li>
                AI features (resume analysis, AI writing, cover letter generation) require credits.
              </li>
              <li>Credits are purchased in packs and are non-refundable once used.</li>
              <li>Payments are processed securely through Razorpay.</li>
              <li>Prices are listed in INR and may change with notice.</li>
              <li>
                Unused credits do not expire, but we reserve the right to modify this with
                reasonable notice.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold" style={{ color: '#2c1810' }}>
              5. Your Content
            </h2>
            <p>
              You retain full ownership of all content you create using ResuMate, including resumes,
              cover letters, and any personal information you enter. We do not claim any intellectual
              property rights over your content. You grant us a limited license to store and process
              your content solely to provide the service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold" style={{ color: '#2c1810' }}>
              6. AI-Generated Content
            </h2>
            <p>
              AI-generated content (bullet points, analysis, cover letters) is provided as
              suggestions. You are responsible for reviewing, editing, and verifying all AI output
              before using it in job applications. ResuMate does not guarantee the accuracy,
              completeness, or suitability of AI-generated content for any specific purpose.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold" style={{ color: '#2c1810' }}>
              7. Acceptable Use
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc space-y-1.5 pl-6">
              <li>Use the service for any unlawful purpose.</li>
              <li>Submit false or misleading information in resumes.</li>
              <li>Attempt to circumvent rate limits, security measures, or credit systems.</li>
              <li>Reverse engineer, scrape, or abuse our AI services.</li>
              <li>Share your account with others or create automated/bot accounts.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold" style={{ color: '#2c1810' }}>
              8. Job Board
            </h2>
            <p>
              Job listings displayed on ResuMate are aggregated from third-party sources (Remotive,
              Arbeitnow). We do not control, verify, or endorse any job listings. Apply at your own
              discretion.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold" style={{ color: '#2c1810' }}>
              9. Limitation of Liability
            </h2>
            <p>
              ResuMate is provided &ldquo;as is&rdquo; without warranties of any kind. We are not
              liable for any damages arising from your use of the service, including but not limited
              to unsuccessful job applications, lost data, or service interruptions. Our total
              liability shall not exceed the amount you paid for credits in the preceding 12 months.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold" style={{ color: '#2c1810' }}>
              10. Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate your account for violations of these
              terms. You may delete your account at any time. Upon termination, your data will be
              deleted in accordance with our{' '}
              <Link href="/privacy" className="underline" style={{ color: '#c96442' }}>
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold" style={{ color: '#2c1810' }}>
              11. Governing Law
            </h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of India.
              Any disputes shall be subject to the exclusive jurisdiction of the courts in India.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
