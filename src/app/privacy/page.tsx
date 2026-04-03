import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'ResuMate Privacy Policy — how we collect, use, and protect your data. Your resumes and personal information are handled with care.',
  alternates: {
    canonical: 'https://resumate.paperknife.app/privacy',
  },
};

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="mb-10 text-sm" style={{ color: '#8b7355' }}>
          Last updated: April 3, 2026
        </p>

        <div className="space-y-8 text-base leading-relaxed" style={{ color: '#5a4a3a' }}>
          <section>
            <h2 className="mb-3 text-xl font-bold" style={{ color: '#2c1810' }}>
              1. Information We Collect
            </h2>
            <p className="mb-3">
              When you use ResuMate, we collect information you provide directly:
            </p>
            <ul className="list-disc space-y-1.5 pl-6">
              <li>
                <strong>Account information:</strong> your name, email address, and password (stored
                as a secure hash).
              </li>
              <li>
                <strong>Resume data:</strong> the content you enter into the resume editor,
                including personal details, work experience, education, and skills.
              </li>
              <li>
                <strong>Uploaded documents:</strong> resumes you upload for AI analysis.
              </li>
              <li>
                <strong>Cover letters:</strong> content generated through our cover letter tool.
              </li>
              <li>
                <strong>Payment information:</strong> processed securely through Razorpay. We do not
                store your card details.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold" style={{ color: '#2c1810' }}>
              2. How We Use Your Information
            </h2>
            <ul className="list-disc space-y-1.5 pl-6">
              <li>To provide and improve our resume building and AI writing services.</li>
              <li>To process your AI feature requests (resume analysis, writing, cover letters).</li>
              <li>To manage your account and credit balance.</li>
              <li>To send important service-related communications.</li>
              <li>To detect and prevent fraud or abuse.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold" style={{ color: '#2c1810' }}>
              3. AI Processing
            </h2>
            <p>
              When you use AI features, your resume content is sent to third-party AI providers for
              processing. This data is used solely to generate your requested output (analysis,
              rewritten bullet points, cover letters) and is not stored by AI providers for training
              purposes. We select AI providers that offer data processing agreements and do not
              retain user data beyond the request lifecycle.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold" style={{ color: '#2c1810' }}>
              4. Data Storage &amp; Security
            </h2>
            <p>
              Your data is stored on secure servers with encryption at rest and in transit. Passwords
              are hashed using PBKDF2-SHA256. Session tokens are stored as SHA-256 hashes — we never
              store raw tokens. We implement rate limiting and access controls to protect against
              unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold" style={{ color: '#2c1810' }}>
              5. Data Sharing
            </h2>
            <p>
              We do not sell your personal information. We share data only with:
            </p>
            <ul className="list-disc space-y-1.5 pl-6">
              <li>
                <strong>AI service providers</strong> — to process your AI feature requests.
              </li>
              <li>
                <strong>Razorpay</strong> — to process payments securely.
              </li>
              <li>
                <strong>Cloudflare</strong> — for analytics and performance monitoring.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold" style={{ color: '#2c1810' }}>
              6. Your Rights
            </h2>
            <p>You have the right to:</p>
            <ul className="list-disc space-y-1.5 pl-6">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your account and associated data.</li>
              <li>Export your resume data.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold" style={{ color: '#2c1810' }}>
              7. Cookies &amp; Analytics
            </h2>
            <p>
              We use Cloudflare Web Analytics for privacy-respecting usage analytics. We do not use
              third-party advertising cookies. Essential cookies are used only for authentication
              session management.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold" style={{ color: '#2c1810' }}>
              8. Changes to This Policy
            </h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any
              material changes by posting the new policy on this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold" style={{ color: '#2c1810' }}>
              9. Contact
            </h2>
            <p>
              If you have questions about this privacy policy or your data, reach out to us at the
              contact information provided on our website.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
