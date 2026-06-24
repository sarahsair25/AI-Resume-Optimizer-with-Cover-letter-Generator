import Link from "next/link";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4">
          <span className="text-xl font-bold text-primary-600">
            ResuMatch AI
          </span>
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Home
          </Link>
        </nav>
      </header>

      <section className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          Resume Analyzer
        </h1>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Upload Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Upload Your Resume
            </h2>
            <p className="mb-6 text-sm text-gray-600">
              Supports PDF, DOCX, and plain text files.
            </p>
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12">
              <p className="mb-2 text-4xl">📄</p>
              <p className="mb-1 text-sm font-medium text-gray-700">
                Drop your resume here or click to browse
              </p>
              <p className="text-xs text-gray-500">
                PDF, DOCX, or TXT (max 10MB)
              </p>
            </div>
          </div>

          {/* Job Description Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Paste Job Description
            </h2>
            <p className="mb-6 text-sm text-gray-600">
              Paste the full job description to analyze keyword match.
            </p>
            <textarea
              className="min-h-[200px] w-full rounded-lg border border-gray-300 p-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="Paste job description here..."
              readOnly
            />
            <button
              className="mt-4 w-full rounded-lg bg-primary-600 px-6 py-3 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
              disabled
            >
              Analyze Match — Coming Soon
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}