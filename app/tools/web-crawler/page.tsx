'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Globe, Link2, Image, FileText, Search, AlertCircle, Clock, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface CrawlData {
  url: string;
  domain: string;
  statusCode: number;
  loadTime: number;
  title: string | null;
  meta: {
    description: string | null;
    keywords: string | null;
    og: {
      title: string | null;
      description: string | null;
      image: string | null;
      url: string | null;
    };
  };
  links: {
    total: number;
    internal: number;
    external: number;
    internalLinks: string[];
    externalLinks: string[];
  };
  images: {
    total: number;
    images: Array<{ src: string; alt: string }>;
  };
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  textPreview: string;
  robotsTxt: string | null;
  sitemapUrl: string | null;
}

function WebCrawlerContent() {
  const [url, setUrl] = useState('');
  const [isCrawling, setIsCrawling] = useState(false);
  const [results, setResults] = useState<CrawlData | null>(null);
  const [error, setError] = useState('');

  const interpretApiError = (status: number, message?: string) => {
    if (status === 429) {
      return "Service is receiving heavy usage. Please wait a moment and try again.";
    }

    if (status >= 500) {
      return "Web crawler API is unavailable right now. Please reload and try again shortly.";
    }

    if (status === 404) {
      return message || "No website found to crawl";
    }

    if (status === 408) {
      return "Request timeout. The website took too long to respond.";
    }

    if (status === 503) {
      return "Cannot connect to the website. It may be down or unreachable.";
    }

    return message || "Unexpected error from the web crawler. Please try again.";
  };

  const handleCrawl = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url) return;
    
    setIsCrawling(true);
    setError('');
    setResults(null);
    
    try {
      const response = await fetch(`/api/web-crawler?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (!response.ok) {
        const friendlyMessage = interpretApiError(response.status, data.error);
        throw new Error(friendlyMessage);
      }

      setResults(data);
    } catch (err: any) {
      console.error('Error crawling website:', err);
      setError(err?.message || 'Web crawler is unreachable. Please reload and try again.');
    } finally {
      setIsCrawling(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Input Section */}
      <Card className="border border-border mb-8">
        <CardHeader>
          <CardTitle className="text-foreground">Web Crawler</CardTitle>
          <CardDescription>Crawl websites and extract links, images, meta tags, and SEO information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCrawl} className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Enter URL (e.g., https://example.com or example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-input text-foreground border-border"
              />
              <Button 
                type="submit" 
                disabled={isCrawling}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isCrawling ? 'Crawling...' : 'Crawl'}
              </Button>
            </div>
            {error && (
              <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="flex-1">{error}</span>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {isCrawling && (
        <Card className="border border-border">
          <CardContent className="py-16 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Crawling website...</p>
          </CardContent>
        </Card>
      )}

      {results && (
        <div className="space-y-6">
          {/* Website Header */}
          <Card className="border border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground uppercase">Website</p>
                    <p className="text-xl font-bold text-foreground break-all">{results.url}</p>
                    <p className="text-xs text-muted-foreground mt-1">{results.domain}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge variant={results.statusCode === 200 ? "default" : "destructive"}>
                      {results.statusCode}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Load Time</p>
                    <div className="flex items-center gap-1 text-sm font-semibold">
                      <Clock className="w-4 h-4" />
                      {results.loadTime}ms
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="border border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Total Links</p>
                    <p className="text-2xl font-bold text-foreground">{results.links.total.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      {results.links.internal} internal, {results.links.external} external
                    </p>
                  </div>
                  <Link2 className="w-8 h-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Images</p>
                    <p className="text-2xl font-bold text-foreground">{results.images.total.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Found on page</p>
                  </div>
                  <Image className="w-8 h-8 text-accent opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Headings</p>
                    <p className="text-2xl font-bold text-foreground">
                      {results.headings.h1.length + results.headings.h2.length + results.headings.h3.length}
                    </p>
                    <p className="text-xs text-muted-foreground">H1-H3 tags</p>
                  </div>
                  <FileText className="w-8 h-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">SEO Files</p>
                    <div className="flex items-center gap-2 mt-1">
                      {results.robotsTxt && (
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          robots.txt
                        </Badge>
                      )}
                      {results.sitemapUrl && (
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          sitemap
                        </Badge>
                      )}
                      {!results.robotsTxt && !results.sitemapUrl && (
                        <span className="text-xs text-muted-foreground">None found</span>
                      )}
                    </div>
                  </div>
                  <Search className="w-8 h-8 text-accent opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Page Title & Meta */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Page Information</CardTitle>
              <CardDescription>Title, meta tags, and Open Graph data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.title && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">Page Title</p>
                  <p className="text-sm font-semibold text-foreground">{results.title}</p>
                </div>
              )}
              {results.meta.description && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">Meta Description</p>
                  <p className="text-sm text-foreground">{results.meta.description}</p>
                </div>
              )}
              {results.meta.og.title && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">Open Graph Title</p>
                  <p className="text-sm font-semibold text-foreground">{results.meta.og.title}</p>
                </div>
              )}
              {results.meta.og.description && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">Open Graph Description</p>
                  <p className="text-sm text-foreground">{results.meta.og.description}</p>
                </div>
              )}
              {results.meta.og.image && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">Open Graph Image</p>
                  <img src={results.meta.og.image} alt="OG Image" className="max-w-xs rounded-md border border-border" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Headings */}
          {(results.headings.h1.length > 0 || results.headings.h2.length > 0 || results.headings.h3.length > 0) && (
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Page Headings</CardTitle>
                <CardDescription>H1, H2, and H3 tags found on the page</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {results.headings.h1.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase mb-2">H1 Tags ({results.headings.h1.length})</p>
                    <ul className="space-y-1">
                      {results.headings.h1.map((h1, i) => (
                        <li key={i} className="text-sm font-semibold text-foreground">• {h1}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {results.headings.h2.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase mb-2">H2 Tags ({results.headings.h2.length})</p>
                    <ul className="space-y-1">
                      {results.headings.h2.map((h2, i) => (
                        <li key={i} className="text-sm text-foreground">• {h2}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {results.headings.h3.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase mb-2">H3 Tags ({results.headings.h3.length})</p>
                    <ul className="space-y-1">
                      {results.headings.h3.map((h3, i) => (
                        <li key={i} className="text-sm text-foreground text-muted-foreground">• {h3}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Internal Links */}
          {results.links.internalLinks.length > 0 && (
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Internal Links</CardTitle>
                <CardDescription>{results.links.internal} internal links found</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {results.links.internalLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline break-all"
                    >
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      {link}
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* External Links */}
          {results.links.externalLinks.length > 0 && (
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-foreground">External Links</CardTitle>
                <CardDescription>{results.links.external} external links found</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {results.links.externalLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline break-all"
                    >
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      {link}
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Images */}
          {results.images.images.length > 0 && (
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Images</CardTitle>
                <CardDescription>{results.images.total} images found on the page</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {results.images.images.map((img, i) => (
                    <div key={i} className="space-y-2">
                      <img
                        src={img.src}
                        alt={img.alt || `Image ${i + 1}`}
                        className="w-full h-24 object-cover rounded-md border border-border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23ccc"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">Image</text></svg>';
                        }}
                      />
                      {img.alt && (
                        <p className="text-xs text-muted-foreground truncate" title={img.alt}>
                          {img.alt}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Text Preview */}
          {results.textPreview && (
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Text Preview</CardTitle>
                <CardDescription>First 500 characters of page content</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground whitespace-pre-wrap">{results.textPreview}...</p>
              </CardContent>
            </Card>
          )}

          {/* Robots.txt */}
          {results.robotsTxt && (
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Robots.txt</CardTitle>
                <CardDescription>Content of robots.txt file</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-xs text-foreground bg-muted p-4 rounded-md overflow-x-auto">
                  {results.robotsTxt}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Sitemap */}
          {results.sitemapUrl && (
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Sitemap</CardTitle>
                <CardDescription>Sitemap URL found</CardDescription>
              </CardHeader>
              <CardContent>
                <a
                  href={results.sitemapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline break-all"
                >
                  <ExternalLink className="w-4 h-4 flex-shrink-0" />
                  {results.sitemapUrl}
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {!results && !isCrawling && (
        <Card className="border border-border">
          <CardContent className="py-16 text-center">
            <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Enter a URL above to start crawling</p>
          </CardContent>
        </Card>
      )}
    </section>
  );
}

export default function WebCrawlerPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/tools">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div className="text-2xl font-bold text-primary">Web Crawler</div>
        </div>
      </nav>
      <WebCrawlerContent />
    </div>
  );
}
