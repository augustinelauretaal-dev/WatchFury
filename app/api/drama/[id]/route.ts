import { NextRequest, NextResponse } from "next/server";
import { getMovieDetails, getSeriesDetails, detectMediaType } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const tmdbId = Number(id);
    const hint = req.nextUrl.searchParams.get('type') as 'tv' | 'movie' | null;

    // Use hint from query param if provided, otherwise detect
    let mediaType = hint;
    if (!mediaType) mediaType = await detectMediaType(tmdbId);

    if (mediaType === 'movie') {
      const movie = await getMovieDetails(tmdbId);
      return NextResponse.json(movie);
    } else if (mediaType === 'tv') {
      const series = await getSeriesDetails(tmdbId);
      return NextResponse.json(series);
    } else {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  } catch (err) {
    console.error("Detail error:", err);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
