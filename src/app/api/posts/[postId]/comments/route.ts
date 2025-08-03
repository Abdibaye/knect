
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/posts/[postId]/comments
export async function GET(req: NextRequest) {
  // Next.js 15 dynamic route: get params from req
  const url = new URL(req.url);
  const postId = url.pathname.split("/").slice(-2)[0];
  try {
    // Fetch all comments for the post, including author and replies (1 level deep)
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        author: { select: { id: true, name: true, image: true } },
        // To include replies, you must define a self-relation in your Prisma schema (e.g., 'replies' as a relation field).
        // If your schema has a self-relation, use the correct relation field name here.
        // Otherwise, remove this block and fetch replies in a separate query if needed.
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}


// POST /api/posts/[postId]/comments
export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const postId = url.pathname.split("/").slice(-2)[0];
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session || !session.session || !session.session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { content } = await req.json();
  if (!content) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }
  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: session.session.userId,
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
      },
    });
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
