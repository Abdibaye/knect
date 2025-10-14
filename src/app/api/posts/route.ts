import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               summary:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               visibility:
 *                 type: string
 *                 enum: [public, private, friends]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               resourceType:
 *                 type: string
 *               role:
 *                 type: string
 *               university:
 *                 type: string
 *               department:
 *                 type: string
 *               doi:
 *                 type: string
 *               citation:
 *                 type: string
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     url:
 *                       type: string
 *                     type:
 *                       type: string
 *     responses:
 *       201:
 *         description: The created post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to create post
 *   get:
 *     summary: Get the latest 20 posts
 *     tags:
 *       - Post
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PostWithCounts'
 *       500:
 *         description: Failed to fetch posts
 */
// POST /api/posts
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || !session.session || !session.session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const {
      title,
      content,
      summary,
      imageUrl,
      mediaType,
      visibility,
      tags,
      resourceType,
      role,
      university,
      department,
      doi,
      citation,
      attachments,
      eventDetails,
    } = body ?? {};

    if (!content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let post;
    try {
      post = await prisma.post.create({
        data: {
          title,
          content,
          summary,
          imageUrl,
          mediaType,
          visibility,
          tags,
          resourceType,
          role,
          university,
          department,
          doi,
          citation,
          attachments,
          eventDetails: resourceType === 'Event' && eventDetails ? eventDetails : undefined,
          author: { connect: { id: session.session.userId } },
        },
      });
    } catch (err: any) {
      console.error('Prisma post.create error:', err);
      return NextResponse.json({ error: 'Prisma post.create failed', details: err?.message, meta: err?.meta }, { status: 500 });
    }

    try {
      // Notify all users (all roles)
      const users = await prisma.user.findMany();
      // fetch actor name
      const actor = await prisma.user.findUnique({ where: { id: session.session.userId }, select: { name: true } });
      await Promise.all(users.map((user) =>
        prisma.notification.create({
          data: {
            type: 'new_post',
            message: `${actor?.name ?? 'Someone'} created a new post: ${title}`,
            userId: user.id,
            postId: post.id,
          },
        })
      ));
    } catch (err: any) {
      console.error('Notification creation error:', err);
      // Still return the post, but include notification error info
      return NextResponse.json({ post, notificationError: err?.message, notificationMeta: err?.meta }, { status: 201 });
    }
    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error('API /api/posts error:', error);
    return NextResponse.json({ error: 'Failed to create post', details: error?.message, stack: error?.stack }, { status: 500 });
  }
}

// GET /api/posts
export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    const currentUserId = session?.session?.userId;
    let posts;
    try {
      posts = await prisma.post.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, name: true, image: true, university: true, department: true } },
          comments: true,
          likes: { select: { userId: true } },
        },
      });
    } catch (err: any) {
      console.error('Prisma post.findMany error:', err);
      return NextResponse.json({ error: 'Prisma post.findMany failed', details: err?.message, meta: err?.meta }, { status: 500 });
    }

    const postsWithCounts = posts.map((post) => ({
      ...post,
      likeCount: post.likes.length,
      commentCount: post.comments.length,
      likedByMe: currentUserId ? post.likes.some((l: any) => l.userId === currentUserId) : false,
      // If post-level university/department not set, fallback to author's profile
      university: post.university ?? post.author?.university ?? undefined,
      department: post.department ?? post.author?.department ?? undefined,
    }));

    return NextResponse.json(postsWithCounts, { status: 200 });
  } catch (error: any) {
    console.error('API /api/posts GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts', details: error?.message, stack: error?.stack }, { status: 500 });
  }
}