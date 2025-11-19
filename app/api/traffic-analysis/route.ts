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

    // 1b. Brand authority via general search volume
    let brandSignal = 0;
    try {
      const brandSerp = await getJson({
        engine: "google",
        q: cleanDomain,
        api_key: apiKey,
      });
      brandSignal = brandSerp.search_information?.total_results || 0;
    } catch (error: any) {
      console.error("Error fetching brand signal:", error);
      // Continue if this fails
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

    // 3. Estimate backlinks using indexed pages + brand signal
    const backlinks = estimateBacklinks(indexedPages, brandSignal);

    // 4. Traffic estimation with logarithmic scaling so large domains score higher
    const monthlyTraffic = estimateMonthlyTraffic(indexedPages, backlinks, domainAgeYears, brandSignal);

    // Check if we have any meaningful data
    if (indexedPages === 0 && backlinks === 0 && domainAgeYears === 1 && brandSignal === 0) {
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

function estimateBacklinks(indexedPages: number, brandSignal: number): number {
  if ((!indexedPages || indexedPages <= 0) && (!brandSignal || brandSignal <= 0)) {
    return 0;
  }

  const safeIndexed = Math.max(indexedPages, 1);
  const safeBrand = Math.max(brandSignal, 1);

  const baseline = safeIndexed * 2;
  const indexedGrowth = Math.pow(safeIndexed, 0.85);
  const brandBoost = Math.pow(safeBrand, 0.6);
  const estimated = baseline + indexedGrowth + brandBoost * 0.3;

  return Math.round(Math.min(estimated, 200_000_000));
}

function estimateMonthlyTraffic(indexedPages: number, backlinks: number, domainAgeYears: number, brandSignal: number): number {
  const safeIndexed = Math.max(indexedPages, 0);
  const safeBacklinks = Math.max(backlinks, 0);
  const safeDomainAge = Math.max(domainAgeYears, 1);
  const safeBrand = Math.max(brandSignal, 0);

  const indexedContribution = Math.pow(Math.max(safeIndexed, 1), 0.95) * 30;
  const backlinkContribution = Math.pow(Math.max(safeBacklinks, 1), 0.8) * 5;
  const brandContribution = Math.pow(Math.max(safeBrand, 1), 0.7) * 2;
  const authorityBoost = 1 + Math.log10(safeDomainAge + 1);

  const estimated = (indexedContribution + backlinkContribution + brandContribution) * authorityBoost;
  return Math.round(Math.min(estimated, 30_000_000_000));
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

