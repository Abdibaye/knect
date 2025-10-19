"server only"

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// If a session exists and is valid, redirect the user to the home page
export async function requireGuest() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    // Session exists (not expired), redirect to home
    return redirect("/home");
  }

  // No session (or expired), allow access to guest routes
  return;
}
