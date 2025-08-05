import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

// DELETE /api/posts/[postId]
export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const postId = url.pathname.split("/").slice(-1)[0];
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session || !session.session || !session.session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Find post and check ownership
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  if (post.authorId !== session.session.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  await prisma.post.delete({ where: { id: postId } });
  return NextResponse.json({ success: true });
}
