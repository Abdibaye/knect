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
      visibility,
      tags,
      resourceType,
      role,
      university,
      department,
      doi,
      citation,
      attachments,
    } = body ?? {};

    if (!title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        summary,
        imageUrl,
        visibility,
        tags,
        resourceType,
        role,
        university,
        department,
        doi,
        citation,
        attachments,
        author: { connect: { id: session.session.userId } },
      },
    });
    // Notify all users (all roles)
    const users = await prisma.user.findMany();
    await Promise.all(users.map((user) =>
      prisma.notification.create({
        data: {
          type: 'new_post',
          message: `A new post was created: ${title}`,
          userId: user.id,
          postId: post.id,
        },
      })
    ));
    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create post', details: error?.message }, { status: 500 });
  }
}

// GET /api/posts
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true, image: true, university: true, department: true } },
        comments: true,
        likes: true,
      },
    });

    const postsWithCounts = posts.map((post) => ({
      ...post,
      likeCount: post.likes.length,
      commentCount: post.comments.length,
      // If post-level university/department not set, fallback to author's profile
      university: post.university ?? post.author?.university ?? undefined,
      department: post.department ?? post.author?.department ?? undefined,
    }));

    return NextResponse.json(postsWithCounts, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch posts', details: error?.message }, { status: 500 });
  }
}