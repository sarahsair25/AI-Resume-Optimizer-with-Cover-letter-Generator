import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResuMatch AI — Optimize Your Resume for ATS",
  description:
    "Bypass Applicant Tracking Systems with data-driven resume optimization and AI-tailored cover letters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}