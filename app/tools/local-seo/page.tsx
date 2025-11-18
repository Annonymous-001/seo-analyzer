'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Star, MessageSquare, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

function LocalSEOContent() {
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!businessName || !location) return;
    
    setIsSearching(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setResults({
      businessName,
      location,
      googleMapsRank: Math.floor(Math.random() * 20) + 1,
      averageRating: (Math.random() * 2 + 3.5).toFixed(1),
      totalReviews: Math.floor(Math.random() * 500) + 20,
      listingStatus: ['Complete', 'Incomplete', 'Needs Update'][Math.floor(Math.random() * 3)],
      photos: Math.floor(Math.random() * 50) + 5,
      recentReviews: [
        { author: 'John D.', rating: 5, text: 'Great service and friendly staff!' },
        { author: 'Sarah M.', rating: 4, text: 'Good quality, would recommend' },
        { author: 'Mike R.', rating: 5, text: 'Excellent experience, very satisfied' },
      ],
      categories: [
        'Local Business',
        'Service Provider',
        'Retail Store',
      ].sort(() => Math.random() - 0.5).slice(0, 2),
    });
    
    setIsSearching(false);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Input Section */}
      <Card className="border border-border mb-8">
        <CardHeader>
          <CardTitle className="text-foreground">Manage Your Local Business</CardTitle>
          <CardDescription>Search for your business to view and update your local presence</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Business name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="bg-input text-foreground border-border"
              />
              <Input
                placeholder="City/Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-input text-foreground border-border"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isSearching}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
            >
              {isSearching ? 'Searching...' : 'Search Business'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {results && (
        <>
          {/* Summary Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="border border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Maps Rank</p>
                    <p className="text-2xl font-bold text-foreground">#{results.googleMapsRank}</p>
                  </div>
                  <MapPin className="w-8 h-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Rating</p>
                    <p className="text-2xl font-bold text-foreground">{results.averageRating}⭐</p>
                  </div>
                  <Star className="w-8 h-8 text-accent opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Reviews</p>
                    <p className="text-2xl font-bold text-foreground">{results.totalReviews}</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Photos</p>
                    <p className="text-2xl font-bold text-foreground">{results.photos}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-accent opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Business Info */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Listing Status */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Business Listing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs uppercase text-muted-foreground mb-2">Status</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${results.listingStatus === 'Complete' ? 'bg-accent' : results.listingStatus === 'Incomplete' ? 'bg-yellow-500' : 'bg-destructive'}`}></div>
                    <p className="font-semibold text-foreground">{results.listingStatus}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-xs uppercase text-muted-foreground mb-3">Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {results.categories.map((cat, idx) => (
                      <span key={idx} className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
                <Button className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                  Update Listing
                </Button>
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Recent Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {results.recentReviews.map((review, idx) => (
                    <li key={idx} className="pb-4 border-b border-border last:border-0">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-semibold text-foreground">{review.author}</p>
                        <span className="text-accent text-sm">{'⭐'.repeat(review.rating)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.text}</p>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full mt-4 border-border">
                  View All Reviews
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Management Actions */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button variant="outline" className="border-border h-12">
                  Add Photos
                </Button>
                <Button variant="outline" className="border-border h-12">
                  Respond to Reviews
                </Button>
                <Button variant="outline" className="border-border h-12">
                  Edit Info
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!results && (
        <Card className="border border-border">
          <CardContent className="py-16 text-center">
            <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Search for your business above to manage local SEO</p>
          </CardContent>
        </Card>
      )}
    </section>
  );
}

export default function LocalSEOPage() {
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
          <div className="text-2xl font-bold text-primary">Local SEO Management</div>
        </div>
      </nav>
      <LocalSEOContent />
    </div>
  );
}
