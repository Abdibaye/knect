// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// export const runtime = "nodejs";

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const exclude = searchParams.get("exclude") || undefined;
//     const q = searchParams.get("q") || undefined;
//     const take = Math.min(Number(searchParams.get("take") || 50), 100);

//     const where: any = {};
//     if (exclude) where.id = { not: exclude };
//     if (q) {
//       where.OR = [
//         { name: { contains: q, mode: "insensitive" } },
//         { email: { contains: q, mode: "insensitive" } },
//       ];
//     }

//     const users = await prisma.user.findMany({
//       where,
//       select: { id: true, name: true, image: true },
//       take,
//       orderBy: { name: "asc" },
//     });

//     return NextResponse.json({ users });
//   } catch (e: any) {
//     return NextResponse.json({ error: e?.message || "Failed to load users" }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const exclude = searchParams.get("exclude") || undefined;
    const q = searchParams.get("q") || undefined;
    const take = Math.min(Number(searchParams.get("take") || 50), 100);

    // Build where with optional exclude and search
    const where: any = {};
    if (exclude) {
      // Support numeric or string primary keys
      if (/^\d+$/.test(exclude)) {
        where.id = { not: Number(exclude) };
      } else {
        where.id = { not: exclude };
      }
    }
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: { id: true, name: true, image: true },
      orderBy: { name: "asc" },
      take,
    });

    return NextResponse.json({ users });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to load users" }, { status: 500 });
  }
}