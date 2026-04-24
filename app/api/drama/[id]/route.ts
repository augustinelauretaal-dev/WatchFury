import { NextRequest, NextResponse } from "next/server";
import { getMovieDetails, getSeriesDetails, detectMediaType } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const tmdbId = Number(id);
    
    // Detect if it's a movie or series
    const mediaType = await detectMediaType(tmdbId);
    
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
