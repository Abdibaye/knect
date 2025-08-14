import { NextResponse } from "next/server";

export const runtime = "nodejs";

const CORE_BASE = process.env.CORE_API_BASE || "https://api.core.ac.uk/v3/search/works";

async function safeJson(res: Response) {
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : { error: await res.text() };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("query") || "computer science";
    const apiKey = process.env.CORE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing CORE_API_KEY" }, { status: 500 });
    }

    const upstream = await fetch(`${CORE_BASE}?q=${encodeURIComponent(query)}&limit=10`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      cache: "no-store",
    });

    const data: any = await safeJson(upstream);
    if (!upstream.ok) {
      const message = data?.message || data?.error || "CORE API error";
      return NextResponse.json({ error: message }, { status: upstream.status });
    }

    const results = data?.results ?? data?.data ?? [];
    const papers = results.map((r: any) => ({
      id: r?.id || r?.doi || r?.oai || r?.externalIds?.doi || crypto.randomUUID(),
      title: r?.title || r?.display?.title || "Untitled",
      description: r?.abstract || r?.description || r?.snippet || "",
      downloadUrl:
        r?.downloadUrl ||
        r?.fullTextLink ||
        r?.fullText?.link ||
        r?.links?.pdf ||
        r?.doi ? `https://doi.org/${r.doi}` : undefined,
    }));

    return NextResponse.json({ data: papers });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to fetch research" }, { status: 500 });
  }
}