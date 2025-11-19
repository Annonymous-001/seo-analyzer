import { NextResponse } from "next/server";
import { getJson } from "serpapi";

export async function POST(req: Request) {
  try {
    const { query, location } = await req.json();

    if (!query || !location) {
      return NextResponse.json(
        { error: "Query and location are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.SERP_API_KEY as string;
    
    // Ensure location has "@" prefix if it's coordinates (SerpAPI format)
    let locationParam = location.trim();
    if (!locationParam.startsWith('@') && /^-?\d+\.?\d*,-?\d+\.?\d*/.test(locationParam)) {
      locationParam = `@${locationParam}`;
    }
    
    const params: any = {
      engine: "google_maps",
      q: query,
      ll: locationParam, // e.g. "@28.6139,77.2090,15z"
      type: "search",
      api_key: apiKey,
    };

    const results = await getJson(params);

    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Error fetching local SEO data:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch local SEO data" },
      { status: 500 }
    );
  }
}

