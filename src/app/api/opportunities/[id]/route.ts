import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/opportunities/{id}:
 *   get:
 *     summary: Get an opportunity by ID
 *     tags: [Opportunity]
 *   patch:
 *     summary: Update an opportunity (owner only)
 *     tags: [Opportunity]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete an opportunity (owner only)
 *     tags: [Opportunity]
 *     security:
 *       - bearerAuth: []
 */
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: params.id },
      include: {
        postedBy: { select: { id: true, name: true, image: true, university: true, department: true } },
      },
    });
    if (!opportunity) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(opportunity, { status: 200 });
  } catch (error: any) {
    console.error('API /api/opportunities/[id] GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch opportunity', details: error?.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const data: any = {};
    for (const key of [
      'title','description','type','provider','providerLogo','bannerImage','university','department','tags','location','applicationUrl','deadline','isVerified'
    ]) {
      if (key in body) data[key] = body[key];
    }
    if (data.deadline) data.deadline = new Date(data.deadline);

    // authorize owner
    const existing = await prisma.opportunity.findUnique({ where: { id: params.id }, select: { postedById: true } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (existing.postedById !== session.session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updated = await prisma.opportunity.update({
      where: { id: params.id },
      data,
      include: {
        postedBy: { select: { id: true, name: true, image: true, university: true, department: true } },
      },
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    console.error('API /api/opportunities/[id] PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update opportunity', details: error?.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const existing = await prisma.opportunity.findUnique({ where: { id: params.id }, select: { postedById: true } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (existing.postedById !== session.session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    await prisma.opportunity.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('API /api/opportunities/[id] DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete opportunity', details: error?.message }, { status: 500 });
  }
}
