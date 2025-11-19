'use client';

import Link from 'next/link';
import { ArrowRight, TrendingUp, Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">SEO Analyzer</div>
          <div className="hidden md:flex gap-8">
            <Link href="#features" className="text-foreground hover:text-primary transition">Tools</Link>
          </div>
          <div className="flex gap-4">
            <Link href="/signin">
              <Button variant="outline" className="border-border hover:border-primary">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
          Master Your SEO Strategy
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 text-balance">
          Complete analysis platform for website traffic, keyword research, and local SEO management. Get instant insights to boost your online visibility.
        </p>
        <Link href="/tools">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            Start Analyzing <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-foreground">Powerful SEO Tools</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Web Crawler */}
          <Card className="border border-border hover:border-primary/50 transition">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-foreground">Web Crawler</CardTitle>
              <CardDescription>Crawl websites and extract links, images, meta tags, and SEO information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-muted-foreground">Extract links and images</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-muted-foreground">Meta tags and Open Graph data
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-muted-foreground">Robots.txt and sitemap detection
                  </span>
                </li>
              </ul>
              <Link href="/tools/traffic-analysis" className="block mt-6">
                <Button variant="outline" className="w-full border-border hover:border-primary">
                  Crawl Now
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Keyword Research */}
          <Card className="border border-border hover:border-primary/50 transition md:mt-0">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-foreground">Keyword Research</CardTitle>
              <CardDescription>Find easy-to-rank keywords</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-muted-foreground">Search volume data</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-muted-foreground">Keyword difficulty scores</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-muted-foreground">Rankable opportunities</span>
                </li>
              </ul>
              <Link href="/tools/keyword-research" className="block mt-6">
                <Button variant="outline" className="w-full border-border hover:border-primary">
                  Research Keywords
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Local SEO */}
          <Card className="border border-border hover:border-primary/50 transition">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-foreground">Local SEO Management</CardTitle>
              <CardDescription>Manage local presence</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-muted-foreground">Business listing updates</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-muted-foreground">Google Maps ranking</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-muted-foreground">Review management</span>
                </li>
              </ul>
              <Link href="/tools/local-seo" className="block mt-6">
                <Button variant="outline" className="w-full border-border hover:border-primary">
                  Manage Local SEO
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-primary text-primary-foreground rounded-2xl p-12 md:p-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">Ready to Optimize Your SEO?</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8 text-balance">
            Get instant access to all three tools and start improving your search rankings today.
          </p>
          <Link href="/tools">
            <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              Access All Tools
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="text-foreground font-semibold">SEO Analyzer</div>
            <div className="text-sm text-muted-foreground">© 2025 All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
