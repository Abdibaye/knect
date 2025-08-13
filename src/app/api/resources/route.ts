import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/resources:
 *   post:
 *     summary: Create a new resource
 *     tags:
 *       - Resource
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
 *               categories:
 *                 type: array
 *                 items: { type: string }
 *               tags:
 *                 type: array
 *                 items: { type: string }
 *               author: { type: string }
 *               downloadUrl: { type: string }
 *               externalUrl: { type: string }
 *     responses:
 *       201:
 *         description: The created resource
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to create resource
 *   get:
 *     summary: Get the latest 20 resources
 *     tags:
 *       - Resource
 *     responses:
 *       200:
 *         description: List of resources
 *       500:
 *         description: Failed to fetch resources
 */
// POST /api/resources
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || !session.session || !session.session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      categories,
      tags,
      author,
      downloadUrl,
      externalUrl,
    } = body ?? {};

    if (!title || !description || !author || !downloadUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        categories: Array.isArray(categories) ? categories : [],
        tags: Array.isArray(tags) ? tags : [],
        author,
        downloadUrl,
        externalUrl: externalUrl ?? null,
        // rating and downloads use model defaults
        uploadedBy: { connect: { id: session.session.userId } },
      },
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create resource", details: error?.message },
      { status: 500 }
    );
  }
}

// GET /api/resources
export async function GET() {
  try {
    const resources = await prisma.resource.findMany({
      take: 30,
      orderBy: { createdAt: "desc" },
      include: {
        uploadedBy: { select: { id: true, name: true, image: true } },
      },
    });

    return NextResponse.json(resources, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch resources", details: error?.message },
      { status: 500 }
    );
  }
}