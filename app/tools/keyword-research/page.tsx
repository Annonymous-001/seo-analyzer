'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, SearchIcon, Zap, TrendingUp, DollarSign, BarChart3, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend } from 'recharts';

interface TopResult {
  position: number;
  title: string;
  link: string;
  displayed_link?: string;
  snippet?: string;
  source?: string;
  favicon?: string;
}

interface KeywordData {
  keyword: string;
  totalResults: number;
  adsCount: number;
  volume: number;
  cpc: number;
  difficulty: number;
  topResults: TopResult[];
}

function KeywordResearchContent() {
  const [keyword, setKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<KeywordData | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!keyword) return;
    
    setIsSearching(true);
    setError('');
    setResults(null);
    
    try {
      const response = await fetch('/api/keyword-research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch keyword data');
      }

      setResults(data);
    } catch (err: any) {
      console.error('Error searching keywords:', err);
      setError(err.message || 'An error occurred while searching. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return '#10b981'; // green
    if (difficulty < 60) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty < 30) return 'Easy';
    if (difficulty < 60) return 'Medium';
    return 'Hard';
  };

  // Chart data
  const metricsData = results ? [
    { name: 'Volume', value: results.volume, color: '#3b82f6' },
    { name: 'CPC', value: results.cpc, color: '#10b981' },
    { name: 'Difficulty', value: results.difficulty, color: getDifficultyColor(results.difficulty) },
  ] : [];

  const difficultyData = results ? [
    { name: 'Difficulty', value: results.difficulty, fill: getDifficultyColor(results.difficulty) },
    { name: 'Remaining', value: 100 - results.difficulty, fill: '#e5e7eb' },
  ] : [];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Input Section */}
      <Card className="border border-border mb-8">
        <CardHeader>
          <CardTitle className="text-foreground">Keyword Research Tool</CardTitle>
          <CardDescription>Analyze keywords with search volume, difficulty, and CPC estimates</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Enter keyword (e.g., SEO tools)"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="bg-input text-foreground border-border"
              />
              <Button 
                type="submit" 
                disabled={isSearching}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </div>
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md whitespace-pre-wrap">
                {error}
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {isSearching && (
        <Card className="border border-border">
          <CardContent className="py-16 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Analyzing keyword data...</p>
          </CardContent>
        </Card>
      )}

      {results && (
        <div className="space-y-6">
          {/* Keyword Header */}
          <Card className="border border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <SearchIcon className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground uppercase">Keyword</p>
                  <p className="text-2xl font-bold text-foreground">{results.keyword}</p>
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
                    <p className="text-xs text-muted-foreground uppercase">Search Volume</p>
                    <p className="text-2xl font-bold text-foreground">{results.volume.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">CPC</p>
                    <p className="text-2xl font-bold text-foreground">${results.cpc.toFixed(2)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-accent opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Difficulty</p>
                    <p className="text-2xl font-bold text-foreground">{results.difficulty}</p>
                    <p className="text-xs text-muted-foreground">{getDifficultyLabel(results.difficulty)}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-destructive opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Total Results</p>
                    <p className="text-2xl font-bold text-foreground">{(results.totalResults / 1_000_000).toFixed(1)}M</p>
                  </div>
                  <Zap className="w-8 h-8 text-primary opacity-50" />
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
                <CardDescription>Volume, CPC, and Difficulty comparison</CardDescription>
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

            {/* Difficulty Radial Chart */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Difficulty Score</CardTitle>
                <CardDescription>Keyword ranking difficulty (0-100)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="60%" 
                    outerRadius="90%" 
                    data={difficultyData}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <RadialBar
                      dataKey="value"
                      cornerRadius={10}
                      fill={(entry: any) => entry.fill}
                    />
                    <Legend
                      iconSize={10}
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="text-center mt-4">
                  <p className="text-3xl font-bold" style={{ color: getDifficultyColor(results.difficulty) }}>
                    {results.difficulty}
                  </p>
                  <p className="text-sm text-muted-foreground">{getDifficultyLabel(results.difficulty)} to Rank</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Ads Count</p>
                    <p className="text-2xl font-bold text-foreground">{results.adsCount}</p>
                    <p className="text-xs text-muted-foreground">Sponsored results</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Top Results</p>
                    <p className="text-2xl font-bold text-foreground">{results.topResults.length}</p>
                    <p className="text-xs text-muted-foreground">Organic listings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Results */}
          {results.topResults.length > 0 && (
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Top Search Results</CardTitle>
                <CardDescription>Top {results.topResults.length} organic results for this keyword</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.topResults.map((result, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 rounded-lg border border-border hover:bg-muted/30 transition"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">#{result.position}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 mb-2">
                            {result.favicon && (
                              <img 
                                src={result.favicon} 
                                alt="" 
                                className="w-4 h-4 mt-1 flex-shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            )}
                            <a 
                              href={result.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm font-semibold text-primary hover:underline flex-1"
                            >
                              {result.title}
                              <ExternalLink className="w-3 h-3 inline-block ml-1" />
                            </a>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {result.displayed_link || result.link}
                          </p>
                          {result.snippet && (
                            <p className="text-sm text-foreground line-clamp-2">{result.snippet}</p>
                          )}
                          {result.source && (
                            <p className="text-xs text-muted-foreground mt-2">Source: {result.source}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {!results && !isSearching && (
        <Card className="border border-border">
          <CardContent className="py-16 text-center">
            <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Enter a keyword above to start researching</p>
          </CardContent>
        </Card>
      )}
    </section>
  );
}

export default function KeywordResearchPage() {
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
          <div className="text-2xl font-bold text-primary">Keyword Research</div>
        </div>
      </nav>
      <KeywordResearchContent />
    </div>
  );
}
