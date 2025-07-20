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
 *               imageUrl:
 *                 type: string
 *               visibility:
 *                 type: string
 *                 enum: [PUBLIC, PRIVATE, FRIENDS] # Adjust as needed
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
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
    const { title, content, imageUrl, visibility, tags } = await req.json();
    if (!title || !content || !visibility) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const post = await prisma.post.create({
      data: {
        title,
        content,
        imageUrl,
        tags,
        author: { connect: { id: session.session.userId } },
        // If you want to store visibility, add it to the model and here
      },
    });
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
        author: { select: { name: true, image: true } },
        comments: true,
        likes: true,
      },
    });
    const postsWithCounts = posts.map(post => ({
      ...post,
      likeCount: post.likes.length,
      commentCount: post.comments.length,
      author: post.author,
      // Remove likes/comments arrays if you want only counts
    }));
    return NextResponse.json(postsWithCounts, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch posts', details: error?.message }, { status: 500 });
  }
} 