import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Correctly define the function signature to accept params
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params; // Now you can safely destructure id

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}