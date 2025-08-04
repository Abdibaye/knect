import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

// POST /api/comments
// { content, postId, parentId? }
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session || !session.session || !session.session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { content, postId, parentId } = await req.json();
  if (!content || !postId) {
    return NextResponse.json({ error: 'Content and postId are required' }, { status: 400 });
  }
  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: session.session.userId,
        parentId: parentId || null,
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
        replies: true,
      },
    });
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
