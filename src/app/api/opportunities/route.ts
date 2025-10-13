import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@/generated/prisma';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/opportunities:
 *   post:
 *     summary: Create a new opportunity
 *     tags:
 *       - Opportunity
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               type: { type: string }
 *               provider: { type: string }
 *               providerLogo: { type: string }
 *               bannerImage: { type: string }
 *               university: { type: string }
 *               department: { type: string }
 *               tags: { type: array, items: { type: string } }
 *               location: { type: string }
 *               applicationUrl: { type: string }
 *               deadline: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: The created opportunity
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to create opportunity
 *   get:
 *     summary: List opportunities (latest first)
 *     tags:
 *       - Opportunity
 *     parameters:
 *       - in: query
 *         name: take
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: skip
 *         schema: { type: integer, default: 0 }
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of opportunities
 *       500:
 *         description: Failed to fetch opportunities
 */
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || !session.session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      type,
      provider,
      providerLogo,
      bannerImage,
      university,
      department,
      tags,
      location,
      applicationUrl,
      deadline,
    } = body ?? {};

    if (!title || !description || !type || !provider || !deadline) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const opportunity = await prisma.opportunity.create({
      data: {
        title,
        description,
        type,
        provider,
        providerLogo,
        bannerImage,
        university,
        department,
        tags,
        location,
        applicationUrl,
        deadline: new Date(deadline),
        postedBy: { connect: { id: session.session.userId } },
      },
      include: {
        postedBy: { select: { id: true, name: true, image: true, university: true, department: true } },
      },
    });

    return NextResponse.json(opportunity, { status: 201 });
  } catch (error: any) {
    console.error('API /api/opportunities POST error:', error);
    return NextResponse.json({ error: 'Failed to create opportunity', details: error?.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get('q') ?? undefined;
    const take = Math.max(1, Math.min(100, Number(url.searchParams.get('take') ?? 20)));
    const skip = Math.max(0, Number(url.searchParams.get('skip') ?? 0));

    const where: Prisma.OpportunityWhereInput | undefined = q
      ? {
          OR: [
            { title: { contains: q, mode: Prisma.QueryMode.insensitive } },
            { description: { contains: q, mode: Prisma.QueryMode.insensitive } },
            { tags: { has: q } },
            { provider: { contains: q, mode: Prisma.QueryMode.insensitive } },
            { university: { contains: q, mode: Prisma.QueryMode.insensitive } },
            { department: { contains: q, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : undefined;

    const opportunities = await prisma.opportunity.findMany({
      where,
      take,
      skip,
      orderBy: { createdAt: 'desc' },
      include: {
        postedBy: { select: { id: true, name: true, image: true, university: true, department: true } },
      },
    });

    return NextResponse.json(opportunities, { status: 200 });
  } catch (error: any) {
    console.error('API /api/opportunities GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch opportunities', details: error?.message }, { status: 500 });
  }
}
