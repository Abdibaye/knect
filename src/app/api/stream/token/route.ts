import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { userId, userName, peerId, peerName, userImage, peerImage } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const key = process.env.STREAM_KEY;
    const secret = process.env.STREAM_SECRET;
    if (!key || !secret) {
      return NextResponse.json({ error: "Missing STREAM_KEY/STREAM_SECRET" }, { status: 500 });
    }

    const serverClient = StreamChat.getInstance(key, secret);

    // Ensure chatting users exist in Stream
    const users: any[] = [{ id: String(userId), name: userName || String(userId), image: userImage }];
    if (peerId) users.push({ id: String(peerId), name: peerName || String(peerId), image: peerImage });
    await serverClient.upsertUsers(users);

    // Create token for current user
    const token = serverClient.createToken(String(userId));
    return NextResponse.json({ token });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Token error" }, { status: 500 });
  }
}