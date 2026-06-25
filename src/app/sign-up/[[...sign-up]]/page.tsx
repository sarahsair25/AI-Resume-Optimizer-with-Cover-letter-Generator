/**
 * Sign-Up page using Clerk's <SignUp /> component
 */

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Create Your Account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign up to save your resume analyses and track your progress
          </p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl rounded-2xl border border-gray-200",
            },
          }}
        />
      </div>
    </div>
  );
}