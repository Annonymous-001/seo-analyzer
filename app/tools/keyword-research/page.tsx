'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, SearchIcon, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

function KeywordResearchContent() {
  const [keyword, setKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keyword) return;
    
    setIsSearching(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const generateKeywords = () => {
      const variations = [
        keyword,
        `best ${keyword}`,
        `${keyword} guide`,
        `how to ${keyword}`,
        `${keyword} tools`,
        `${keyword} tips`,
        `cheap ${keyword}`,
        `${keyword} for beginners`,
      ];
      
      return variations.map((kw, idx) => ({
        keyword: kw,
        searchVolume: Math.floor(Math.random() * 50000) + 1000,
        difficulty: Math.floor(Math.random() * 100),
        cpc: (Math.random() * 5 + 0.5).toFixed(2),
      }));
    };
    
    setResults(generateKeywords());
    setIsSearching(false);
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty < 30) return 'text-accent';
    if (difficulty < 60) return 'text-yellow-500';
    return 'text-destructive';
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Input Section */}
      <Card className="border border-border mb-8">
        <CardHeader>
          <CardTitle className="text-foreground">Find Rankable Keywords</CardTitle>
          <CardDescription>Search for keywords with volume and difficulty data</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Enter seed keyword (e.g., SEO tools)"
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
          </form>
        </CardContent>
      </Card>

      {results && (
        <>
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Found <span className="font-bold text-foreground">{results.length}</span> keyword variations
            </p>
          </div>

          <Card className="border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Keyword</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Search Volume</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Difficulty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">CPC</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Opportunity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {results.map((item, idx) => {
                    const opportunity = (item.searchVolume / item.difficulty) * 100;
                    return (
                      <tr key={idx} className="hover:bg-muted/30 transition">
                        <td className="px-6 py-4 text-sm font-medium text-foreground">{item.keyword}</td>
                        <td className="px-6 py-4 text-sm text-foreground">{item.searchVolume.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-muted rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${item.difficulty < 30 ? 'bg-accent' : item.difficulty < 60 ? 'bg-yellow-500' : 'bg-destructive'}`}
                                style={{ width: `${item.difficulty}%` }}
                              />
                            </div>
                            <span className={`text-xs font-semibold ${getDifficultyColor(item.difficulty)}`}>
                              {item.difficulty}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">${item.cpc}</td>
                        <td className="px-6 py-4 text-sm">
                          {opportunity > 500 && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-md text-xs font-semibold">
                              <Zap className="w-3 h-3" />
                              High
                            </span>
                          )}
                          {opportunity <= 500 && opportunity > 100 && (
                            <span className="inline-flex items-center px-2 py-1 bg-muted rounded-md text-xs font-semibold text-foreground">
                              Medium
                            </span>
                          )}
                          {opportunity <= 100 && (
                            <span className="inline-flex items-center px-2 py-1 bg-muted rounded-md text-xs font-semibold text-muted-foreground">
                              Low
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {!results && (
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
