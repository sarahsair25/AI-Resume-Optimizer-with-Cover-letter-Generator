import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payment Canceled",
  description: "Your payment was not processed. You can try again anytime.",
};

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-12 max-w-lg mx-4 text-center">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg
            className="w-10 h-10 text-amber-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-4">
          Payment Canceled
        </h1>
        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
          No worries! Your payment was not processed. You can still use the free
          plan or try again whenever you&apos;re ready.
        </p>

        <div className="space-y-4">
          <Link
            href="/pricing"
            className="block w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            Back to Pricing
          </Link>
          <Link
            href="/dashboard"
            className="block w-full py-4 border border-slate-200 text-slate-700 font-bold rounded-xl hover:border-indigo-600 hover:text-indigo-600 transition-all"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
