import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/user/create-profile:
 *   post:
 *     summary: Update the current authenticated user's profile
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               username:
 *                 type: string
 *               image:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || !session.session || !session.session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.session.userId;

    const { name, bio, username, image, location } = await request.json();

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, bio, username, image, locationimport { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/user/create-profile:
 *   post:
 *     summary: Update the current authenticated user's profile
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               username:
 *                 type: string
 *               image:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || !session.session || !session.session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.session.userId;

    const { name, bio, username, image, location } = await request.json();

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, bio, username, image, location },
    });

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
 },
    });

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
