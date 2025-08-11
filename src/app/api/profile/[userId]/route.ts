import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    const user = await prisma.user.findUnique({
      where: { id: params.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [postsCount, resourcesCount, eventsCount] = await Promise.all([
      prisma.post.count({ where: { authorId: user.id } }),
      prisma.resource.count({ where: { uploadedById: user.id } }),
      prisma.event.count({ where: { createdById: user.id } }),
    ]);

    const [posts, resources, events] = await Promise.all([
      prisma.post.findMany({
        where: { authorId: user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, title: true, createdAt: true },
      }),
      prisma.resource.findMany({
        where: { uploadedById: user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, title: true, createdAt: true },
      }),
      prisma.event.findMany({
        where: { createdById: user.id },
        orderBy: { date: "desc" },
        take: 5,
        select: { id: true, title: true, date: true },
      }),
    ]);

    const memberships = await prisma.groupMember.findMany({
      where: { userId: user.id },
      include: { group: true },
    });

    const suggestedCollaborators = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: user.id } },
          user.university ? { university: { equals: user.university } } : {},
        ],
      },
      take: 5,
      select: { id: true, name: true, image: true, location: true },
    });

    const recentPublicationsRaw = await prisma.post.findMany({
      where: {
        author: user.university ? { university: { equals: user.university } } : undefined,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, title: true },
    });

    const payload = {
      id: user.id,
      name: user.name,
      profileImage: user.image ?? null,
      university: user.university ?? null,
      department: user.department ?? null,
      yearOfStudy: user.yearOfStudy ?? null,
      bio: user.bio ?? null,
      skills: user.skills ?? [],
      researchFocus: user.researchFocus ?? null,
      publications: user.publications ?? [],
      contributions: {
        posts: postsCount,
        resources: resourcesCount,
        events: eventsCount,
      },
      contributionsList: {
        posts,
        resources,
        events,
      },
      communities: memberships.map((m) => ({ id: m.group.id, name: m.group.name })),
      verified: !!user.emailVerified,
      suggestedCollaborators,
      recentPublications: recentPublicationsRaw.map((p) => ({ title: p.title })),
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
