import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

function normalizeCommaString(value: unknown): string | undefined {
  // Accept string or array and return a normalized comma+space separated string
  if (Array.isArray(value)) {
    const items = value.map(String).map((s) => s.trim()).filter(Boolean);
    return items.length ? items.join(", ") : "";
  }
  if (typeof value === "string") {
    const items = value
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);
    return items.length ? items.join(", ") : "";
  }
  return undefined;
}

export async function PATCH(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.session.userId;
  
    const body = await request.json();
    const {
      name,
      about,
      image,
      university,
      department,
      yearOfStudy,
      researchFocusSkills,
      // Back-compat legacy fields that may still be sent by older clients
      bio: legacyBio,
      skills: legacySkills,
      researchFocus: legacyResearchFocus,
      publications: _legacyPublications,
      username,
      location,
    } = body ?? {};

    const data: any = {};
    if (typeof name === "string") data.name = name;
    // Prefer explicit `about`, fallback to legacy `bio`
    if (typeof about === "string") data.about = about;
    else if (typeof legacyBio === "string") data.about = legacyBio;
    if (typeof image === "string") data.image = image;
    if (typeof university === "string") data.university = university;
    if (typeof department === "string") data.department = department;
    if (typeof yearOfStudy === "string") data.yearOfStudy = yearOfStudy;
    if (typeof username === "string") data.username = username;
    if (typeof location === "string") data.location = location;

    // Compute researchFocusSkills normalized string
    const normalizedRfs = normalizeCommaString(researchFocusSkills);
    if (normalizedRfs !== undefined) {
      data.researchFocusSkills = normalizedRfs;
    } else {
      // Backward compatibility: merge legacy researchFocus (string) and skills (array/string)
      const legacyParts: string[] = [];
      const fromFocus = normalizeCommaString(legacyResearchFocus);
      const fromSkills = normalizeCommaString(legacySkills);
      if (fromFocus) legacyParts.push(...fromFocus.split(", ").map((s) => s.trim()).filter(Boolean));
      if (fromSkills) legacyParts.push(...fromSkills.split(", ").map((s) => s.trim()).filter(Boolean));
      if (legacyParts.length) {
        data.researchFocusSkills = Array.from(new Set(legacyParts)).join(", ");
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.session.userId;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
