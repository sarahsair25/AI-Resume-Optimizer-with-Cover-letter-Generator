/**
 * History page — shows past resume analyses and cover letters for the current user.
 */

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HistoryPage() {
  const session = await auth();
  const user = await currentUser();

  if (!session.userId) {
    redirect("/sign-in");
  }

  const userName = user?.fullName ?? user?.firstName ?? "User";

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-xl font-bold text-primary-600">
              ResuMatch AI
            </Link>
            <span className="text-sm text-gray-400">/</span>
            <span className="text-sm font-medium text-gray-600">History</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Dashboard
            </Link>
            <span className="text-sm text-gray-400">
              {user?.emailAddresses?.[0]?.emailAddress ?? userName}
            </span>
          </div>
        </nav>
      </header>

      {/* Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Analysis History
          </h1>
          <p className="mt-2 text-gray-600">
            View your past resume optimizations and cover letters.
          </p>
        </div>

        {/* Placeholder for now — history data will be loaded by the db */}
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-16 text-center">
          <div className="mb-4 text-5xl">📋</div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            No analyses yet
          </h2>
          <p className="mb-6 text-gray-600">
            Your saved resume analyses and cover letters will appear here once
            you run your first optimization.
          </p>
          <Link
            href="/dashboard"
            className="inline-block rounded-lg bg-primary-600 px-6 py-3 text-sm font-medium text-white hover:bg-primary-700"
          >
            Analyze Your First Resume
          </Link>
        </div>
      </section>
    </main>
  );
}