import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/user/view-profile:
 *   get:
 *     summary: Get the current authenticated user's profile
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: The user's profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || !session.session || !session.session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.session.userId;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
} 