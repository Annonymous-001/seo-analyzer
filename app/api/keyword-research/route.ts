import { NextResponse } from "next/server";
import { getJson } from "serpapi";

export async function POST(req: Request) {
  try {
    const { keyword } = await req.json();

    if (!keyword) {
      return NextResponse.json(
        { error: "Keyword is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.SERP_API_KEY as string;
    
    const params: any = {
      engine: "google",
      q: keyword,
      api_key: apiKey,
      google_domain: "google.com",
    };

    const data = await getJson(params);

    const totalResults = data.search_information?.total_results;
    const ads = data.ads_results || [];
    const organic = data.organic_results || [];

    const result = {
      keyword,
      totalResults: totalResults !== undefined && totalResults !== null ? totalResults : null,
      adsCount: ads !== undefined ? ads.length : null,
      topResults: organic && organic.length > 0 ? organic.slice(0, 10) : [],
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error fetching keyword research data:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch keyword research data" },
      { status: 500 }
    );
  }
}

