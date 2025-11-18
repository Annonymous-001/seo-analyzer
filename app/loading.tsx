'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="border border-border">
        <CardContent className="py-16 px-8">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-foreground font-medium">Loading...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
