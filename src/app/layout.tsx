import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL('https://resumate.paperknife.app'),
  title: "ResuMates - AI-Powered Resume Builder",
  description: "Build ATS-friendly resumes in minutes with our AI-powered desktop app. Craft the resume that gets you hired.",
  keywords: ["resume builder", "AI resume", "ATS friendly", "job application", "career tools"],
  authors: [{ name: "ResuMates" }],
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: "ResuMates - AI-Powered Resume Builder",
    description: "Build ATS-friendly resumes in minutes with our AI-powered desktop app.",
    type: "website",
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
