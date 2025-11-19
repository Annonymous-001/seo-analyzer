import { NextResponse } from "next/server";
import { getJson } from "serpapi";

/**
 * Estimate search volume (FAKE MODEL for college projects)
 */
function estimateVolume(totalResults: number): number {
  if (totalResults > 1_000_000_000) return 100_000;
  if (totalResults > 100_000_000) return 50_000;
  if (totalResults > 10_000_000) return 10_000;
  if (totalResults > 1_000_000) return 5_000;
  return 1000;
}

/**
 * Estimate CPC (completely custom)
 */
function estimateCPC(adsCount: number): number {
  return adsCount * 0.5 + 0.2; // ₹0.5 increase per ad
}

/**
 * Calculate difficulty score (0–100)
 */
function calculateDifficulty(totalResults: number, adsCount: number, strongDomains: number): number {
  return Math.min(
    100,
    (totalResults / 1_000_000) * 0.5 + adsCount * 7 + strongDomains * 10
  );
}

/**
 * Strong domains list
 */
const STRONG_DOMAINS = ["wikipedia.org", "amazon.com", "google.com"];

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

    const totalResults = data.search_information?.total_results || 0;
    const ads = data.ads_results || [];
    const organic = data.organic_results || [];

    let strongDomainsCount = 0;
    organic.forEach((item: any) => {
      try {
        const url = new URL(item.link);
        const domain = url.hostname.replace("www.", "");
        if (STRONG_DOMAINS.includes(domain)) {
          strongDomainsCount++;
        }
      } catch (e) {
        // Invalid URL, skip
      }
    });

    const result = {
      keyword,
      totalResults,
      adsCount: ads.length,
      volume: estimateVolume(totalResults),
      cpc: estimateCPC(ads.length),
      difficulty: calculateDifficulty(totalResults, ads.length, strongDomainsCount),
      topResults: organic.slice(0, 10),
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

