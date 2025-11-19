'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Globe, Users, TrendingUp, Calendar, Link2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';

interface TrafficData {
  domain: string;
  indexedPages: number;
  backlinks: number;
  domainAgeYears: number;
  estimatedTraffic: number;
  whois: {
    creationDate: string | null;
    registrar: string | null;
  };
}

const normalizeTrafficData = (data: any, fallbackDomain: string): TrafficData => ({
  domain: typeof data?.domain === 'string' && data.domain.trim().length > 0 ? data.domain : fallbackDomain,
  indexedPages: Number.isFinite(Number(data?.indexedPages)) ? Number(data.indexedPages) : 0,
  backlinks: Number.isFinite(Number(data?.backlinks)) ? Number(data.backlinks) : 0,
  domainAgeYears: Number.isFinite(Number(data?.domainAgeYears)) ? Number(data.domainAgeYears) : 0,
  estimatedTraffic: Number.isFinite(Number(data?.estimatedTraffic)) ? Number(data.estimatedTraffic) : 0,
  whois: {
    creationDate: data?.whois?.creationDate ?? null,
    registrar: data?.whois?.registrar ?? null,
  },
});

function TrafficAnalysisContent() {
  const [domain, setDomain] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<TrafficData | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!domain) return;
    
    setIsAnalyzing(true);
    setError('');
    setResults(null);
    
    try {
      const response = await fetch(`/api/traffic-analysis?domain=${encodeURIComponent(domain)}`);

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          // Show the data even if it's a 404 (no results found)
          setResults(normalizeTrafficData(data, domain));
          setError(data.error || 'Limited data available for this domain');
        } else {
          throw new Error(data.error || 'Failed to analyze domain');
        }
      } else {
        setResults(normalizeTrafficData(data, domain));
      }
    } catch (err: any) {
      console.error('Error analyzing domain:', err);
      setError(err.message || 'An error occurred while analyzing. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Chart data
  const metricsData = results ? [
    { name: 'Indexed Pages', value: results.indexedPages, color: '#3b82f6' },
    { name: 'Backlinks', value: results.backlinks, color: '#10b981' },
    { name: 'Est. Traffic', value: results.estimatedTraffic, color: '#f59e0b' },
  ] : [];

  const trafficBreakdown = results ? [
    { name: 'Indexed Pages', value: results.indexedPages, fill: '#3b82f6' },
    { name: 'Backlinks', value: results.backlinks, fill: '#10b981' },
  ] : [];

  const trafficOverTime = results ? [
    { month: '3M ago', traffic: Math.round(results.estimatedTraffic * 0.7) },
    { month: '2M ago', traffic: Math.round(results.estimatedTraffic * 0.85) },
    { month: '1M ago', traffic: Math.round(results.estimatedTraffic * 0.95) },
    { month: 'Current', traffic: results.estimatedTraffic },
  ] : [];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Input Section */}
      <Card className="border border-border mb-8">
        <CardHeader>
          <CardTitle className="text-foreground">Website Traffic Analysis</CardTitle>
          <CardDescription>Analyze domain metrics including indexed pages, backlinks, domain age, and estimated traffic</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Enter domain (e.g., youtube.com or example.com)"
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
            {error && (
              <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="flex-1">{error}</span>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {isAnalyzing && (
        <Card className="border border-border">
          <CardContent className="py-16 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Analyzing domain data...</p>
          </CardContent>
        </Card>
      )}

      {results && (
        <div className="space-y-6">
          {/* Domain Header */}
          <Card className="border border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground uppercase">Domain</p>
                  <p className="text-2xl font-bold text-foreground">{results.domain}</p>
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
                    <p className="text-xs text-muted-foreground uppercase">Estimated Traffic</p>
                    <p className="text-2xl font-bold text-foreground">
                      {results.estimatedTraffic >= 1000 
                        ? `${(results.estimatedTraffic / 1000).toFixed(1)}K`
                        : results.estimatedTraffic.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Monthly visitors</p>
                  </div>
                  <Users className="w-8 h-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Indexed Pages</p>
                    <p className="text-2xl font-bold text-foreground">
                      {results.indexedPages >= 1000 
                        ? `${(results.indexedPages / 1000).toFixed(1)}K`
                        : results.indexedPages.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Google indexed</p>
                  </div>
                  <Link2 className="w-8 h-8 text-accent opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Backlinks</p>
                    <p className="text-2xl font-bold text-foreground">
                      {results.backlinks >= 1000 
                        ? `${(results.backlinks / 1000).toFixed(1)}K`
                        : results.backlinks.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Estimated links</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Domain Age</p>
                    <p className="text-2xl font-bold text-foreground">{results.domainAgeYears.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">Years old</p>
                  </div>
                  <Calendar className="w-8 h-8 text-accent opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Metrics Bar Chart */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Key Metrics</CardTitle>
                <CardDescription>Indexed pages, backlinks, and estimated traffic</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metricsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => value.toLocaleString()}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {metricsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Traffic Over Time */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Traffic Trend</CardTitle>
                <CardDescription>Estimated monthly traffic over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trafficOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => value.toLocaleString()}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="traffic" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Pie Chart */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-foreground">SEO Metrics Breakdown</CardTitle>
              <CardDescription>Distribution of indexed pages and backlinks</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={trafficBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {trafficBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => value.toLocaleString()}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* WHOIS Information */}
          {(results.whois.creationDate || results.whois.registrar) && (
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Domain Information</CardTitle>
                <CardDescription>WHOIS registration details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {results.whois.creationDate && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase mb-1">Creation Date</p>
                    <p className="text-sm font-semibold text-foreground">
                      {new Date(results.whois.creationDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
                {results.whois.registrar && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase mb-1">Registrar</p>
                    <p className="text-sm font-semibold text-foreground">{results.whois.registrar}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* No Data Warning */}
          {results.indexedPages === 0 && results.backlinks === 0 && (
            <Card className="border border-yellow-500 bg-yellow-500/10">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">Limited Data Available</p>
                    <p className="text-sm text-muted-foreground">
                      This domain may not be indexed by Google or may be very new. The traffic estimate is based on limited data.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {!results && !isAnalyzing && (
        <Card className="border border-border">
          <CardContent className="py-16 text-center">
            <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Enter a domain above to start analyzing traffic</p>
          </CardContent>
        </Card>
      )}
    </section>
  );
}

export default function TrafficAnalysisPage() {
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
      <TrafficAnalysisContent />
    </div>
  );
}
