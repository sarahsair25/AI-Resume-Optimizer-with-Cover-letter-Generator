import Link from "next/link";

export default function Pricing() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4">
          <span className="text-xl font-bold text-primary-600">
            ResuMatch AI
          </span>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Get Started Free
            </Link>
          </div>
        </nav>
      </header>

      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-gray-600">
            Start free, upgrade when you need unlimited optimizations.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
          {/* Free */}
          <div className="rounded-xl border border-gray-200 bg-white p-8">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Free</h3>
            <p className="mb-4 text-3xl font-bold text-gray-900">$0</p>
            <ul className="mb-8 space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">✅ 1 resume analysis</li>
              <li className="flex items-center gap-2">✅ Basic match score</li>
              <li className="flex items-center gap-2">✅ Keyword suggestions</li>
              <li className="flex items-center gap-2 text-gray-400">❌ Bullet rewrites</li>
              <li className="flex items-center gap-2 text-gray-400">❌ Cover letters</li>
            </ul>
            <Link
              href="/dashboard"
              className="block rounded-lg border border-gray-300 px-6 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Get Started
            </Link>
          </div>

          {/* Premium (Recommended) */}
          <div className="rounded-xl border-2 border-primary-500 bg-white p-8 shadow-lg">
            <div className="mb-2 inline-block rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
              RECOMMENDED
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Premium
            </h3>
            <p className="mb-4 text-3xl font-bold text-gray-900">
              $15<span className="text-base font-normal text-gray-500">/mo</span>
            </p>
            <ul className="mb-8 space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">✅ Unlimited analyses</li>
              <li className="flex items-center gap-2">✅ Full match score + gaps</li>
              <li className="flex items-center gap-2">✅ AI bullet rewrites</li>
              <li className="flex items-center gap-2">✅ AI cover letters</li>
              <li className="flex items-center gap-2">✅ Missing skills detection</li>
            </ul>
            <Link
              href="/dashboard"
              className="block rounded-lg bg-primary-600 px-6 py-3 text-center text-sm font-medium text-white hover:bg-primary-700"
            >
              Subscribe — Coming Soon
            </Link>
          </div>

          {/* Pay-per-Credit */}
          <div className="rounded-xl border border-gray-200 bg-white p-8">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Pay-per-Credit
            </h3>
            <p className="mb-4 text-3xl font-bold text-gray-900">
              $5<span className="text-base font-normal text-gray-500">/ea</span>
            </p>
            <ul className="mb-8 space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">✅ 1 full optimization</li>
              <li className="flex items-center gap-2">✅ Match score + gaps</li>
              <li className="flex items-center gap-2">✅ Bullet rewrites</li>
              <li className="flex items-center gap-2">✅ Cover letter</li>
              <li className="flex items-center gap-2">✅ No subscription</li>
            </ul>
            <Link
              href="/dashboard"
              className="block rounded-lg border border-gray-300 px-6 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Buy Credits — Coming Soon
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}