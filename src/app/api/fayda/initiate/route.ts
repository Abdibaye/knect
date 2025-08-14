import { NextResponse } from "next/server";

export const runtime = "nodejs";

const BASE_URL = process.env.FAYDA_BASE_URL || "https://fayda-auth.vercel.app";

async function safeJson(res: Response) {
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : { error: await res.text() };
}

export async function POST(req: Request) {
  try {
    const { fcn } = await req.json();
    if (!fcn || typeof fcn !== "string") {
      return NextResponse.json({ error: "Invalid FCN" }, { status: 400 });
    }
    const apiKey = process.env.FAYDA_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing FAYDA_API_KEY" }, { status: 500 });
    }

    const upstream = await fetch(`${BASE_URL}/api/fayda/otp/initiate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({ fcn }),
      cache: "no-store",
    });

    const data: any = await safeJson(upstream);
    if (!upstream.ok) {
      return NextResponse.json({ error: data.message || data.error || "Failed to initiate OTP" }, { status: upstream.status });
    }

    const transactionId = data.transactionId ?? data.data?.transactionId;
    const maskedMobile = data.maskedMobile ?? data.data?.maskedMobile;

    return NextResponse.json({ transactionId, maskedMobile });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to initiate OTP" }, { status: 500 });
  }
}