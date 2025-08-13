import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/notifications
export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session || !session.session || !session.session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.session.userId;
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },    take: 50,
  });
  return NextResponse.json(notifications);
}

// PATCH /api/notifications (mark all as read)
export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session || !session.session || !session.session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.session.userId;
  await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
  return NextResponse.json({ success: true });
}
