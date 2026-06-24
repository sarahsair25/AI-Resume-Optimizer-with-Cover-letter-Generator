import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import PricingSection from "@/components/PricingSection";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white">R</div>
            <span className="text-xl font-bold text-slate-900">
              ResuMatch AI
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="#how-it-works" className="text-slate-600 hover:text-indigo-600 transition-colors hidden md:block">
              How it works
            </Link>
            <Link
              href="#pricing"
              className="text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 font-bold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <Hero />
      <HowItWorks />
      <Features />
      <Testimonials />
      <PricingSection />
      <FAQ />
      <FinalCTA />

      {/* Footer */}
      <footer className="border-t border-slate-100 py-12 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center font-bold text-white text-xs">R</div>
            <span className="text-lg font-bold text-slate-900">ResuMatch AI</span>
          </div>
          <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
            Helping job seekers bypass ATS and land more interviews with data-driven resume optimization.
          </p>
          <div className="text-slate-400 text-xs">
            &copy; {new Date().getFullYear()} ResuMatch AI. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
