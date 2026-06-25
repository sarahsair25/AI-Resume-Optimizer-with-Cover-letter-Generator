import Link from "next/link";

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-12 max-w-lg mx-4 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg
            className="w-10 h-10 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-4">
          Payment Successful!
        </h1>
        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
          Your plan has been activated. You can now start optimizing your resumes
          and generating cover letters.
        </p>

        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="block w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/pricing"
            className="block w-full py-4 border border-slate-200 text-slate-700 font-bold rounded-xl hover:border-indigo-600 hover:text-indigo-600 transition-all"
          >
            Manage Plans
          </Link>
        </div>
      </div>
    </main>
  );
}
