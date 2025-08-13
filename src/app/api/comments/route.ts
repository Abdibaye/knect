import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

// POST /api/comments (for replies)
export async function POST(req: NextRequest) {
  const { content, postId, parentId } = await req.json();
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session || !session.session || !session.session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!content || !postId || !parentId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  try {
    const reply = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: session.session.userId,
        // parentId: parentId, // Uncomment if you have a self-relation for replies
      },
    });
    // Notify parent comment author (if not replying to self)
    const parentComment = await prisma.comment.findUnique({ where: { id: parentId } });
    if (parentComment && parentComment.authorId !== session.session.userId) {
      await prisma.notification.create({
        data: {
          type: 'reply',
          message: 'Someone replied to your comment',
          userId: parentComment.authorId,
          postId: postId,
          commentId: reply.id,
        },
      });
    }
    return NextResponse.json(reply, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create reply' }, { status: 500 });
  }
}
