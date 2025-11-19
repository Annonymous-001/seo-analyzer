'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Star, MessageSquare, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface BusinessResult {
  position: number;
  title: string;
  place_id: string;
  rating?: number;
  reviews?: number | string;
  type?: string;
  types?: string[];
  address?: string;
  phone?: string;
  website?: string;
  open_state?: string;
  price?: string;
  gps_coordinates?: {
    latitude: number;
    longitude: number;
  };
  user_review?: string;
  thumbnail?: string;
  description?: string;
}

function LocalSEOContent() {
  const [businessName, setBusinessName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<BusinessResult[]>([]);
  const [error, setError] = useState('');
  
  // Fixed location coordinates (Delhi, India) - SerpAPI format with @ prefix and zoom
  const FIXED_LOCATION = '@28.6139,77.2090,15z';

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!businessName) return;
    
    setIsSearching(true);
    setError('');
    setResults([]);
    
    try {
      const response = await fetch('/api/local-seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: businessName,
          location: FIXED_LOCATION,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || 'Failed to fetch business data';
        const errorDetails = data.details ? `\n\n${data.details}` : '';
        throw new Error(errorMessage + errorDetails);
      }

      // Parse SerpAPI response
      const localResults = data.local_results || [];
      
      if (localResults.length === 0) {
        setError('No businesses found. Try a different search term or location.');
        setIsSearching(false);
        return;
      }

      // Map all results to our BusinessResult interface
      const parsedResults: BusinessResult[] = localResults.map((result: any) => ({
        position: result.position || 0,
        title: result.title || '',
        place_id: result.place_id || '',
        rating: result.rating,
        reviews: result.reviews,
        type: result.type,
        types: result.types || [],
        address: result.address,
        phone: result.phone,
        website: result.website,
        open_state: result.open_state,
        price: result.price,
        gps_coordinates: result.gps_coordinates,
        user_review: result.user_review,
        thumbnail: result.thumbnail || result.serpapi_thumbnail,
        description: result.description,
      }));
      
      setResults(parsedResults);
    } catch (err: any) {
      console.error('Error searching business:', err);
      setError(err.message || 'An error occurred while searching. Please try again.');
    } finally {
      setIsSearching(false);
    }
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
            <div>
              <Input
                placeholder="Business name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="bg-input text-foreground border-border"
              />
              <p className="text-xs text-muted-foreground mt-2 ml-1">
                Location: Delhi, India (@28.6139, 77.2090, 15z)
              </p>
            </div>
            <Button 
              type="submit" 
              disabled={isSearching}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
            >
              {isSearching ? 'Searching...' : 'Search Business'}
            </Button>
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md whitespace-pre-wrap">
                {error}
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <>
          {/* Results Summary */}
          <Card className="border border-border mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Results</p>
                  <p className="text-2xl font-bold text-foreground">{results.length} businesses found</p>
                </div>
                <MapPin className="w-8 h-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          {/* All Business Results */}
          <div className="space-y-4">
            {results.map((business) => (
              <Card key={business.place_id} className="border border-border hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Business Image */}
                    {business.thumbnail && (
                      <div className="flex-shrink-0">
                        <img 
                          src={business.thumbnail} 
                          alt={business.title}
                          className="w-32 h-32 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Business Info */}
                    <div className="flex-1 space-y-3">
                      {/* Position and Title */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">#{business.position}</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-foreground">{business.title}</h3>
                            {business.type && (
                              <p className="text-sm text-muted-foreground">{business.type}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Rating and Reviews */}
                      <div className="flex items-center gap-4 flex-wrap">
                        {business.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-accent fill-current" />
                            <span className="font-semibold text-foreground">{business.rating}</span>
                          </div>
                        )}
                        {business.reviews && (
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {typeof business.reviews === 'number' 
                                ? business.reviews.toLocaleString() 
                                : business.reviews} reviews
                            </span>
                          </div>
                        )}
                        {business.price && (
                          <span className="text-sm font-medium text-foreground">{business.price}</span>
                        )}
                        {business.open_state && (
                          <span className="text-sm text-muted-foreground">{business.open_state}</span>
                        )}
                      </div>

                      {/* Address */}
                      {business.address && (
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{business.address}</p>
                        </div>
                      )}

                      {/* Description */}
                      {business.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{business.description}</p>
                      )}

                      {/* User Review */}
                      {business.user_review && (
                        <div className="bg-muted/50 p-3 rounded-md">
                          <p className="text-sm text-foreground italic">"{business.user_review}"</p>
                        </div>
                      )}

                      {/* Types/Categories */}
                      {business.types && business.types.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {business.types.slice(0, 5).map((type, idx) => (
                            <span 
                              key={idx} 
                              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
                            >
                              {type}
                            </span>
                          ))}
                          {business.types.length > 5 && (
                            <span className="px-2 py-1 text-xs text-muted-foreground">
                              +{business.types.length - 5} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Contact Info */}
                      <div className="flex flex-wrap gap-4 pt-2 border-t border-border">
                        {business.phone && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Phone:</span>
                            <a 
                              href={`tel:${business.phone}`}
                              className="text-sm text-primary hover:underline"
                            >
                              {business.phone}
                            </a>
                          </div>
                        )}
                        {business.website && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Website:</span>
                            <a 
                              href={business.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline truncate max-w-xs"
                            >
                              {business.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {isSearching && (
        <Card className="border border-border">
          <CardContent className="py-16 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Searching for businesses...</p>
          </CardContent>
        </Card>
      )}

      {results.length === 0 && !isSearching && (
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
