import { NextRequest, NextResponse } from "next/server";
import { getSeasonDetails } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; season: string }> },
) {
  try {
    const { id, season } = await params;
    const data = await getSeasonDetails(Number(id), Number(season));
    return NextResponse.json(data);
  } catch (err) {
    console.error("Season error:", err);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
