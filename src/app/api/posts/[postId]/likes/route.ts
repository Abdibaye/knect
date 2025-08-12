import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

// GET /api/posts/[postId]/likes
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const postId = url.pathname.split("/").slice(-2)[0];
  const likes = await prisma.like.findMany({
    where: { postId },
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
  });
  return NextResponse.json(likes.map(like => like.user));
}
