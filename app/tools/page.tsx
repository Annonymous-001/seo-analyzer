'use client';

import Link from 'next/link';
import { TrendingUp, Search, MapPin, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div className="text-2xl font-bold text-primary">SEO Tools</div>
        </div>
      </nav>

      {/* Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-12 text-balance">SEO Analysis Tools</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Traffic Analysis Card */}
          <Card className="border border-border hover:border-primary/50 transition overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-foreground">Website Traffic Analysis</CardTitle>
              <CardDescription>Analyze visitor metrics and performance</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Features:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-accent">✓</span> Total visitor counts
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-accent">✓</span> Traffic source breakdown
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-accent">✓</span> 30-day performance trends
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-accent">✓</span> Device analysis
                  </li>
                </ul>
              </div>
              <Link href="/tools/traffic-analysis" className="block">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Open Tool
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Keyword Research Card */}
          <Card className="border border-border hover:border-primary/50 transition overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-foreground">Keyword Research</CardTitle>
              <CardDescription>Find high-opportunity keywords</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Features:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-accent">✓</span> Search volume data
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-accent">✓</span> Keyword difficulty scores
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-accent">✓</span> Competition analysis
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-accent">✓</span> Related keywords
                  </li>
                </ul>
              </div>
              <Link href="/tools/keyword-research" className="block">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Open Tool
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Local SEO Card */}
          <Card className="border border-border hover:border-primary/50 transition overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-foreground">Local SEO Management</CardTitle>
              <CardDescription>Manage local business presence</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Features:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-accent">✓</span> Business info management
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-accent">✓</span> Google Maps tracking
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-accent">✓</span> Review monitoring
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-accent">✓</span> Local ranking reports
                  </li>
                </ul>
              </div>
              <Link href="/tools/local-seo" className="block">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Open Tool
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
