'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Globe, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function TrafficAnalysisPage() {
  const [domain, setDomain] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!domain) return;
    
    setIsAnalyzing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setResults({
      domain,
      totalVisitors: Math.floor(Math.random() * 1000000) + 10000,
      monthlyGrowth: Math.floor(Math.random() * 50) - 10,
      trafficSources: [
        { name: 'Organic Search', percentage: 45, value: Math.floor(Math.random() * 100000) },
        { name: 'Direct', percentage: 25, value: Math.floor(Math.random() * 50000) },
        { name: 'Social Media', percentage: 18, value: Math.floor(Math.random() * 40000) },
        { name: 'Referral', percentage: 12, value: Math.floor(Math.random() * 30000) },
      ],
      devices: [
        { name: 'Desktop', percentage: 55 },
        { name: 'Mobile', percentage: 38 },
        { name: 'Tablet', percentage: 7 },
      ],
      topPages: [
        { url: '/products', visitors: Math.floor(Math.random() * 50000) },
        { url: '/about', visitors: Math.floor(Math.random() * 40000) },
        { url: '/blog', visitors: Math.floor(Math.random() * 35000) },
        { url: '/contact', visitors: Math.floor(Math.random() * 20000) },
      ]
    });
    
    setIsAnalyzing(false);
  };

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
          <div className="text-2xl font-bold text-primary">Website Traffic Analysis</div>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Input Section */}
        <Card className="border border-border mb-8">
          <CardHeader>
            <CardTitle className="text-foreground">Analyze Website Traffic</CardTitle>
            <CardDescription>Enter any domain to see visitor metrics and traffic sources</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAnalyze} className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Enter domain (e.g., example.com)"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="bg-input text-foreground border-border"
                />
                <Button 
                  type="submit" 
                  disabled={isAnalyzing}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {results && (
          <>
            {/* Summary Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="border border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Visitors (Last 30 days)</p>
                      <p className="text-3xl font-bold text-foreground mt-2">
                        {(results.totalVisitors / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Growth</p>
                      <p className={`text-3xl font-bold mt-2 ${results.monthlyGrowth >= 0 ? 'text-accent' : 'text-destructive'}`}>
                        {results.monthlyGrowth > 0 ? '+' : ''}{results.monthlyGrowth}%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Domain</p>
                      <p className="text-lg font-bold text-foreground mt-2">{results.domain}</p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Globe className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Traffic Sources */}
            <Card className="border border-border mb-8">
              <CardHeader>
                <CardTitle className="text-foreground">Traffic Sources</CardTitle>
                <CardDescription>Where your visitors are coming from</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {results.trafficSources.map((source, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{source.name}</span>
                      <span className="text-sm text-muted-foreground">{source.percentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{(source.value / 1000).toFixed(1)}K visitors</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Device Breakdown */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Device Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {results.devices.map((device, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">{device.name}</span>
                        <span className="text-sm text-muted-foreground">{device.percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-accent h-2 rounded-full" 
                          style={{ width: `${device.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Top Pages */}
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Top Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {results.topPages.map((page, idx) => (
                      <li key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <span className="text-sm font-medium text-foreground truncate">{page.url}</span>
                        <span className="text-sm text-accent font-semibold">{(page.visitors / 1000).toFixed(1)}K</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {!results && (
          <Card className="border border-border">
            <CardContent className="py-16 text-center">
              <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">Enter a domain above to start analyzing traffic</p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
