/**
 * Clerk user utilities for ResuMatch AI
 * 
 * Helpers for getting the current user ID and syncing with the local DB.
 */

import { auth, currentUser } from "@clerk/nextjs/server";

/**
 * Get the current authenticated user's Clerk ID.
 * Returns null if not authenticated.
 */
export async function getUserId(): Promise<string | null> {
  const session = await auth();
  return session.userId;
}

/**
 * Get the current user's email from Clerk.
 */
export async function getUserEmail(): Promise<string | null> {
  const user = await currentUser();
  return user?.emailAddresses?.[0]?.emailAddress ?? null;
}

/**
 * Get the current user's name from Clerk.
 */
export async function getUserName(): Promise<string | null> {
  const user = await currentUser();
  return user?.fullName ?? user?.firstName ?? null;
}

/**
 * Ensure a local user record exists for the current Clerk user.
 * Call this in API routes that need to save user-associated data.
 */
export async function ensureLocalUser(db: any) {
  const clerkId = await getUserId();
  if (!clerkId) return null;

  const email = await getUserEmail();
  const name = await getUserName();

  // Try to find existing user
  try {
    const existing = db.select().from(schema.users).where(
      (eq: any) => eq(schema.users.id, clerkId)
    ).get();

    if (existing) return existing;

    // Create new user record
    db.insert(schema.users).values({
      id: clerkId,
      email: email ?? "unknown@email.com",
      name: name,
      plan: "free",
      creditsRemaining: "5",
    }).run();

    return { id: clerkId, email, name, plan: "free" };
  } catch {
    return { id: clerkId, email, name, plan: "free" };
  }
}

// Import for types — avoids circular dependency at runtime
import * as schema from "@/lib/schema";