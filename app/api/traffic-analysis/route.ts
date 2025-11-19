import { NextResponse } from "next/server";
import { getJson } from "serpapi";
import whois from "whois-json";
import dns from "node:dns/promises";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get('domain');

    if (!domain) {
      return NextResponse.json(
        { error: "Domain is required" },
        { status: 400 }
      );
    }

    // Clean domain (remove http/https/www)
    const cleanDomain = domain
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0]
      .trim();

    if (!cleanDomain) {
      return NextResponse.json(
        { error: "Invalid domain format" },
        { status: 400 }
      );
    }

    const domainExists = await checkDomainExists(cleanDomain);
    if (!domainExists) {
      return NextResponse.json(
        {
          error: "Domain does not exist or has no DNS records",
          domain: cleanDomain,
        },
        { status: 404 }
      );
    }

    const apiKey = process.env.SERP_API_KEY as string;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "SERP_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // 1. SERP indexed pages
    let indexedPages = 0;
    try {
      const serp = await getJson({
        engine: "google",
        q: `site:${cleanDomain}`,
        api_key: apiKey,
      });
      indexedPages = serp.search_information?.total_results || 0;
    } catch (error: any) {
      console.error("Error fetching indexed pages:", error);
      // Continue with 0 indexed pages if this fails
    }

    if (indexedPages === 0) {
      return NextResponse.json(
        {
          error: "No pages indexed for this domain",
          domain: cleanDomain,
          indexedPages: 0,
        },
        { status: 404 }
      );
    }

    // 2. WHOIS domain age
    let domainAgeYears = 1;
    let whoisData: any = {};
    try {
      whoisData = await whois(cleanDomain);
      if (whoisData.creationDate) {
        const created = new Date(whoisData.creationDate);
        const now = new Date();
        const diff = now.getTime() - created.getTime();
        domainAgeYears = Math.max(diff / (1000 * 60 * 60 * 24 * 365), 1);
      }
    } catch (error: any) {
      console.error("Error fetching WHOIS data:", error);
      // Continue with default values if WHOIS fails
    }

    // 3. Estimate backlinks (simplified - using indexed pages as proxy)
    // The Bing hack doesn't work well in serverless, so we'll estimate based on indexed pages
    const backlinks = Math.round((indexedPages / 10) * 50); // Rough estimate

    // 4. Traffic estimation
    const score =
      (indexedPages / 1_000_000) * 40 +
      (backlinks / 5000) * 30 +
      domainAgeYears * 5;

    const monthlyTraffic = Math.round(score * 1000);

    // Check if we have any meaningful data
    if (indexedPages === 0 && backlinks === 0 && domainAgeYears === 1) {
      return NextResponse.json(
        { 
          error: "No data found for this domain. The domain may not be indexed or may not exist.",
          domain: cleanDomain,
          indexedPages: 0,
          backlinks: 0,
          domainAgeYears: 1,
          estimatedTraffic: 0,
          whois: {
            creationDate: null,
            registrar: null,
          }
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      domain: cleanDomain,
      indexedPages,
      backlinks,
      domainAgeYears: Math.round(domainAgeYears * 10) / 10, // Round to 1 decimal
      estimatedTraffic: monthlyTraffic,
      whois: {
        creationDate: whoisData.creationDate || null,
        registrar: whoisData.registrar || null,
      }
    });
  } catch (error: any) {
    console.error("Error analyzing website:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze website" },
      { status: 500 }
    );
  }
}

async function checkDomainExists(domain: string): Promise<boolean> {
  const resolvers: Array<() => Promise<unknown>> = [
    () => dns.resolve4(domain),
    () => dns.resolve6(domain),
    () => dns.resolveCname(domain),
    () => dns.resolveAny(domain),
  ];

  for (const resolve of resolvers) {
    try {
      const records = await resolve();
      if (Array.isArray(records) && records.length > 0) {
        return true;
      }
      if (records) {
        return true;
      }
    } catch (error: any) {
      const benignErrors = ["ENODATA", "ENOTFOUND", "ESERVFAIL", "EREFUSED", "NOTFOUND"];
      if (!benignErrors.includes(error?.code)) {
        console.error("DNS lookup failed:", error);
      }
    }
  }

  return false;
}

