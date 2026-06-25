import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://resumatch.ai";

export const metadata: Metadata = {
  title: {
    default: "ResuMatch AI — Optimize Your Resume for ATS",
    template: "%s | ResuMatch AI",
  },
  description:
    "Bypass Applicant Tracking Systems with data-driven resume optimization and AI-tailored cover letters. Get more interviews, faster.",
  keywords: [
    "resume optimizer",
    "ATS resume checker",
    "AI cover letter generator",
    "job application tool",
    "resume keyword matching",
    "interview prep",
  ],
  authors: [{ name: "ResuMatch AI" }],
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "ResuMatch AI",
    title: "ResuMatch AI — Optimize Your Resume for ATS",
    description:
      "Bypass Applicant Tracking Systems with data-driven resume optimization and AI-tailored cover letters.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ResuMatch AI - Resume Optimization",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ResuMatch AI — Optimize Your Resume for ATS",
    description:
      "Bypass Applicant Tracking Systems with data-driven resume optimization and AI-tailored cover letters.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    >
      <html lang="en">
        <body className="antialiased">
          <AnalyticsProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}