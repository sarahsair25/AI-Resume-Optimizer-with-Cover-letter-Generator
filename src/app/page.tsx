import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="border-b border-gray-100">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary-600">
              ResuMatch AI
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/pricing"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Pricing
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1">
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
            Land More Interviews with{" "}
            <span className="text-primary-600">AI-Powered</span> Resume
            Optimization
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600">
            ResuMatch AI analyzes your resume against any job description,
            identifies missing keywords, and rewrites bullet points to help you
            bypass Applicant Tracking Systems.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-lg bg-primary-600 px-8 py-3 text-base font-medium text-white hover:bg-primary-700"
            >
              Analyze Your Resume Free
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-lg border border-gray-300 px-8 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              How It Works
            </Link>
          </div>

          {/* Feature highlights */}
          <div className="mt-24 grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-gray-100 p-6 text-left">
              <div className="mb-4 text-3xl">📄</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Smart Resume Parsing
              </h3>
              <p className="text-sm text-gray-600">
                Upload your PDF or DOCX resume. Our parser extracts every word
                accurately using advanced text extraction.
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 p-6 text-left">
              <div className="mb-4 text-3xl">🎯</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                ATS Keyword Matching
              </h3>
              <p className="text-sm text-gray-600">
                Paste any job description and get a precise match score with
                detailed keyword gap analysis.
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 p-6 text-left">
              <div className="mb-4 text-3xl">✍️</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                AI Rewrites & Cover Letters
              </h3>
              <p className="text-sm text-gray-600">
                Get impact-driven bullet point rewrites and tailored cover
                letters powered by advanced AI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} ResuMatch AI. All rights reserved.
      </footer>
    </main>
  );
}