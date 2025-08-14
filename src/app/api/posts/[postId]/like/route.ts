import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

// POST /api/posts/[postId]/like
export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const postId = url.pathname.split("/").slice(-2)[0];
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session || !session.session || !session.session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.session.userId;

  // Toggle like
  const existing = await prisma.like.findUnique({
    where: { postId_userId: { postId, userId } },
  });
  let liked;
  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    liked = false;
  } else {
    await prisma.like.create({ data: { postId, userId } });
    liked = true;
    // Create notification for post author (if not liking own post)
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (post && post.authorId !== userId) {
      await prisma.notification.create({
        data: {
          type: 'like',
          message: 'Someone liked your post',
          userId: post.authorId,
          postId: postId,
        },
      });
    }
  }
  // Get new like count
  const likeCount = await prisma.like.count({ where: { postId } });
  return NextResponse.json({ liked, likeCount });
}
