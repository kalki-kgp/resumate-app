import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#c96442',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://resumate.paperknife.app'),
  title: {
    default: 'ResuMate - AI-Powered Resume Builder | ATS-Friendly Resumes',
    template: '%s | ResuMate',
  },
  description: "Build ATS-friendly resumes in minutes with AI. ResuMate crafts professional resumes that pass every ATS screening — 92% pass rate, 3x more interviews. Free to start.",
  keywords: [
    "resume builder", "AI resume builder", "ATS friendly resume", "job application",
    "career tools", "resume maker", "professional resume", "cover letter generator",
    "resume templates", "ATS checker", "AI resume writer", "online resume builder",
  ],
  authors: [{ name: "ResuMate" }],
  creator: "ResuMate",
  publisher: "ResuMate",
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large' as const,
    'max-video-preview': -1,
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  alternates: {
    canonical: 'https://resumate.paperknife.app',
  },
  openGraph: {
    title: "ResuMate - AI-Powered Resume Builder",
    description: "Build ATS-friendly resumes in minutes with AI. 92% ATS pass rate. 3x more interview callbacks. Free to start.",
    type: "website",
    url: "https://resumate.paperknife.app",
    siteName: "ResuMate",
    locale: "en_US",
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'ResuMate - AI-Powered Resume Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ResuMate - AI-Powered Resume Builder',
    description: 'Build ATS-friendly resumes in minutes with AI. 92% ATS pass rate, 3x more interviews.',
    images: ['/opengraph-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "ResuMate",
              "url": "https://resumate.paperknife.app",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web Browser",
              "description": "AI-powered resume builder that creates ATS-friendly resumes. Upload your existing resume or start from scratch — our AI crafts professional content that gets you hired.",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "INR",
                "description": "Free to start, credit packs for AI features"
              },
              "featureList": [
                "AI Resume Writing",
                "ATS Score Checker",
                "Multiple Resume Templates",
                "Cover Letter Generator",
                "Resume Import & Analysis",
                "PDF Export",
                "AI Bullet Point Optimization",
                "Job Board Integration"
              ],
              "screenshot": "https://resumate.paperknife.app/opengraph-image.png",
              "creator": {
                "@type": "Organization",
                "name": "ResuMate"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "50000",
                "bestRating": "5"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Is ResuMate free to use?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! You can create an account and build resumes for free. AI-powered features like smart writing, resume analysis, and cover letter generation use credits which you can purchase in affordable packs."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Will my resume pass ATS screening?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "ResuMate is built specifically for ATS compatibility. 92% of resumes created with ResuMate pass ATS screening on the first try. Our AI optimizes keywords, formatting, and structure for maximum compatibility."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How does the AI resume writer work?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Upload your existing resume or enter your details, and our AI analyzes your experience to generate professional, tailored bullet points and descriptions. You can refine the output, adjust tone, and customize everything before exporting."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I generate cover letters too?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! ResuMate includes an AI cover letter generator that creates tailored cover letters based on your resume and job description. Choose your tone — professional, conversational, confident, or enthusiastic — and refine paragraph by paragraph."
                  }
                }
              ]
            })
          }}
        />
        {children}
        <Script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "e591e101ede545bcb802ab43baf0e518"}'
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
