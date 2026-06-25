/**
 * Clerk middleware for ResuMatch AI
 * 
 * Protects dashboard/history routes behind authentication.
 * Public routes: landing page, pricing, sign-in, sign-up
 */

import { clerkMiddleware, createRouteMatcher, redirectToSignIn } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/pricing",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/checkout(.*)",
  "/api/public(.*)",
  "/api/webhook(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    const { userId } = auth();
    if (!userId) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};