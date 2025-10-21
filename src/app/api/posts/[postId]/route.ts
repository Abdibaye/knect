import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

// DELETE /api/posts/[postId]
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const postId = url.pathname.split("/").slice(-1)[0];

    if (!postId) {
      return NextResponse.json({ error: 'Post id is required' }, { status: 400 });
    }

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

    // Manually cascade delete related data to avoid FK violations
    await prisma.$transaction(async (tx) => {
      // Delete notifications related to comments on this post
      const commentsForPost = await tx.comment.findMany({
        where: { postId },
        select: { id: true },
      });

      const commentIds = commentsForPost.map((c) => c.id);

      if (commentIds.length > 0) {
        await tx.notification.deleteMany({ where: { commentId: { in: commentIds } } });
      }

      // Delete notifications directly related to the post
      await tx.notification.deleteMany({ where: { postId } });

      // Delete likes for the post
      await tx.like.deleteMany({ where: { postId } });

      // Delete comments for the post
      await tx.comment.deleteMany({ where: { postId } });

      // Finally delete the post
      await tx.post.delete({ where: { id: postId } });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
