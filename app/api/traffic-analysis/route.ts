import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import dns from "node:dns/promises";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Normalize URL
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(normalizedUrl);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    const domain = parsedUrl.hostname.replace(/^www\./, '');
    
    // Check if domain exists
    const domainExists = await checkDomainExists(domain);
    if (!domainExists) {
      return NextResponse.json(
        {
          error: "Domain does not exist or has no DNS records",
          url: normalizedUrl,
        },
        { status: 404 }
      );
    }

    // Fetch the page
    const startTime = Date.now();
    let response: Response;
    let html: string;
    let statusCode: number;

    try {
      response = await fetch(normalizedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });
      statusCode = response.status;
      html = await response.text();
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { error: "Request timeout. The website took too long to respond." },
          { status: 408 }
        );
      }
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        return NextResponse.json(
          { error: "Cannot connect to the website. It may be down or unreachable." },
          { status: 503 }
        );
      }
      throw error;
    }

    const loadTime = Date.now() - startTime;

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Website returned status ${statusCode}`,
          url: normalizedUrl,
          statusCode,
        },
        { status: response.status }
      );
    }

    // Parse HTML
    const $ = cheerio.load(html);

    // Extract data
    const title = $('title').text().trim() || null;
    const metaDescription = $('meta[name="description"]').attr('content') || null;
    const metaKeywords = $('meta[name="keywords"]').attr('content') || null;
    
    // Open Graph tags
    const ogTitle = $('meta[property="og:title"]').attr('content') || null;
    const ogDescription = $('meta[property="og:description"]').attr('content') || null;
    const ogImage = $('meta[property="og:image"]').attr('content') || null;
    const ogUrl = $('meta[property="og:url"]').attr('content') || null;

    // Extract links
    const allLinks: string[] = [];
    const internalLinks: string[] = [];
    const externalLinks: string[] = [];

    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (!href) return;

      try {
        const linkUrl = new URL(href, normalizedUrl);
        const linkDomain = linkUrl.hostname.replace(/^www\./, '');
        allLinks.push(linkUrl.href);

        if (linkDomain === domain) {
          internalLinks.push(linkUrl.href);
        } else {
          externalLinks.push(linkUrl.href);
        }
      } catch {
        // Invalid URL, skip
      }
    });

    // Extract images
    const images: Array<{ src: string; alt: string }> = [];
    $('img').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      const alt = $(el).attr('alt') || '';
      if (src) {
        try {
          const imageUrl = new URL(src, normalizedUrl);
          images.push({ src: imageUrl.href, alt });
        } catch {
          // Invalid URL, skip
        }
      }
    });

    // Extract headings
    const headings = {
      h1: $('h1').map((_, el) => $(el).text().trim()).get(),
      h2: $('h2').map((_, el) => $(el).text().trim()).get(),
      h3: $('h3').map((_, el) => $(el).text().trim()).get(),
    };

    // Extract text content (first 500 chars)
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 500);

    // Check for robots.txt and sitemap
    let robotsTxt: string | null = null;
    let sitemapUrl: string | null = null;

    try {
      const robotsUrl = new URL('/robots.txt', normalizedUrl);
      const robotsResponse = await fetch(robotsUrl.href, {
        signal: AbortSignal.timeout(5000),
      });
      if (robotsResponse.ok) {
        robotsTxt = await robotsResponse.text();
        // Try to extract sitemap from robots.txt
        const sitemapMatch = robotsTxt.match(/Sitemap:\s*(.+)/i);
        if (sitemapMatch) {
          sitemapUrl = sitemapMatch[1].trim();
        }
      }
    } catch {
      // robots.txt not found or error
    }

    // If no sitemap in robots.txt, try common sitemap locations
    if (!sitemapUrl) {
      const commonSitemaps = ['/sitemap.xml', '/sitemap_index.xml'];
      for (const sitemapPath of commonSitemaps) {
        try {
          const sitemapCheckUrl = new URL(sitemapPath, normalizedUrl);
          const sitemapResponse = await fetch(sitemapCheckUrl.href, {
            signal: AbortSignal.timeout(5000),
          });
          if (sitemapResponse.ok) {
            sitemapUrl = sitemapCheckUrl.href;
            break;
          }
        } catch {
          // Continue
        }
      }
    }

    return NextResponse.json({
      url: normalizedUrl,
      domain,
      statusCode,
      loadTime,
      title,
      meta: {
        description: metaDescription,
        keywords: metaKeywords,
        og: {
          title: ogTitle,
          description: ogDescription,
          image: ogImage,
          url: ogUrl,
        },
      },
      links: {
        total: allLinks.length,
        internal: internalLinks.length,
        external: externalLinks.length,
        internalLinks: [...new Set(internalLinks)].slice(0, 50), // Unique, limit to 50
        externalLinks: [...new Set(externalLinks)].slice(0, 50), // Unique, limit to 50
      },
      images: {
        total: images.length,
        images: images.slice(0, 20), // Limit to 20
      },
      headings,
      textPreview: bodyText,
      robotsTxt: robotsTxt ? robotsTxt.substring(0, 1000) : null, // Limit to 1000 chars
      sitemapUrl,
    });
  } catch (error: any) {
    console.error("Error crawling website:", error);
    
    if (error.message?.includes('fetch failed') || error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { error: "Cannot connect to the website. It may be down or unreachable." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to crawl website" },
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
