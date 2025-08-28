import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // Your Better Auth server instance

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    // Better Auth: read session from cookies/headers
    const session = await auth.api.getSession({ headers: req.headers });
    const user = session?.user
      ? {
          id: String(session.user.id),
          name: session.user.name ?? null,
          image: session.user.image ?? null,
        }
      : null;

    return NextResponse.json({ user });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to read session" }, { status: 500 });
  }
}