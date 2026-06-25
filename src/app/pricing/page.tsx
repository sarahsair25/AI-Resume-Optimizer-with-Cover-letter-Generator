"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const plans = [
  {
    id: "freemium",
    name: "Freemium",
    price: "0",
    description: "Perfect for a quick check-up.",
    features: [
      "1 resume analysis",
      "Basic match score",
      "Keyword suggestions",
    ],
    notIncluded: [
      "AI Bullet point rewrites",
      "Tailored cover letters",
      "Priority processing",
    ],
    cta: "Get Started",
    href: "/dashboard",
    highlight: false,
    checkout: false,
  },
  {
    id: "premium",
    name: "Subscription",
    price: "19",
    description: "Everything you need to land the job.",
    features: [
      "Unlimited analyses",
      "AI Bullet point rewrites",
      "Tailored cover letters",
      "Missing skills detection",
      "Formatting check",
    ],
    notIncluded: [],
    cta: "Start Subscription",
    href: "#",
    highlight: true,
    checkout: true,
  },
  {
    id: "credit",
    name: "Pay-per-Credit",
    price: "5",
    unit: "/ea",
    description: "No commitment, just results.",
    features: [
      "1 full optimization",
      "AI Bullet point rewrites",
      "Tailored cover letter",
      "Lifetime access to result",
    ],
    notIncluded: [],
    cta: "Buy Credit",
    href: "#",
    highlight: false,
    checkout: true,
  },
];

export default function Pricing() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (plan: "premium" | "credit") => {
    if (!isSignedIn) {
      router.push("/sign-in?redirect_url=/pricing");
      return;
    }

    setLoading(plan);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Checkout error:", data.error);
        alert("Something went wrong. Please try again.");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout fetch error:", error);
      alert("Network error. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">R</div>
            <span className="text-xl font-bold text-slate-900">
              ResuMatch AI
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
            >
              {isSignedIn ? "Dashboard" : "Get Started"}
            </Link>
          </div>
        </nav>
      </header>

      <section className="container mx-auto px-4 py-24">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <h1 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3">Pricing Plans</h1>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6">
            Invest in your career
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed">
            Choose the plan that fits your job search needs. Get started for free and upgrade anytime.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`relative flex flex-col p-8 bg-white rounded-3xl border transition-all duration-300 ${
                plan.highlight 
                  ? 'border-indigo-600 shadow-xl shadow-indigo-100 scale-105 z-10' 
                  : 'border-slate-200 hover:border-indigo-300 shadow-sm'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-slate-500">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-extrabold text-slate-900">${plan.price}</span>
                <span className="text-slate-500 font-medium">{plan.unit || '/mo'}</span>
              </div>

              <ul className="flex-1 space-y-4 mb-10 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-slate-700">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
                {plan.notIncluded.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-slate-400">
                    <svg className="w-5 h-5 text-slate-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.checkout ? (
                <button
                  onClick={() => handleCheckout(plan.id as "premium" | "credit")}
                  disabled={loading === plan.id}
                  className={`w-full py-4 text-center font-bold rounded-xl transition-all ${
                    plan.highlight
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-indigo-600 hover:text-indigo-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading === plan.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    plan.cta
                  )}
                </button>
              ) : (
                <Link
                  href={plan.href}
                  className={`block w-full py-4 text-center font-bold rounded-xl transition-all ${
                    plan.highlight
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-indigo-600 hover:text-indigo-600'
                  }`}
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="mt-24 bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Not sure which one to pick?</h3>
          <p className="text-slate-600 mb-8">All users get their first match score for free. No credit card required.</p>
          <Link href="/dashboard" className="text-indigo-600 font-bold hover:text-indigo-700 flex items-center justify-center gap-2">
            Try a free analysis now
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="text-slate-400 text-xs">
            &copy; {new Date().getFullYear()} ResuMatch AI. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
