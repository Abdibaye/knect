import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

function normalizeList(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    return value.map(String).map((s) => s.trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);
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
      bio,
      image,
      university,
      department,
      yearOfStudy,
      skills,
      researchFocus,
      publications,
      username,
      location,
    } = body ?? {};

    const skillsArr = normalizeList(skills);
    const publicationsArr = normalizeList(publications);

    const data: any = {};
    if (typeof name === "string") data.name = name;
    if (typeof bio === "string") data.bio = bio;
    if (typeof image === "string") data.image = image;
    if (typeof university === "string") data.university = university;
    if (typeof department === "string") data.department = department;
    if (typeof yearOfStudy === "string") data.yearOfStudy = yearOfStudy;
    if (typeof researchFocus === "string") data.researchFocus = researchFocus;
    if (typeof username === "string") data.username = username;
    if (typeof location === "string") data.location = location;
    if (skillsArr) data.skills = skillsArr;
    if (publicationsArr) data.publications = publicationsArr;

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
