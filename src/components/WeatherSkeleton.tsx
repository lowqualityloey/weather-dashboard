import { Card, CardHeader, CardContent } from './ui/card';

export function WeatherSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Current Weather Skeleton */}
      <Card className="bg-muted/40 border-border">
        <CardHeader>
          <div className="h-6 w-40 bg-muted rounded-md" />
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 bg-muted rounded-full" />
            <div className="space-y-2">
              <div className="h-10 w-24 bg-muted rounded-md" />
              <div className="h-4 w-32 bg-muted rounded-md" />
            </div>
          </div>
          <div className="space-y-2 text-right">
            <div className="h-4 w-28 bg-muted rounded-md ml-auto" />
            <div className="h-4 w-24 bg-muted rounded-md ml-auto" />
            <div className="h-4 w-32 bg-muted rounded-md ml-auto" />
          </div>
        </CardContent>
      </Card>

      {/* 5-Day Forecast Skeleton Grid */}
      <div>
        <div className="h-6 w-36 bg-muted rounded-md mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="bg-muted/30 border-border p-4">
              <div className="flex items-center justify-between">
                <div className="h-5 w-12 bg-muted rounded-md" />
                <div className="h-10 w-10 bg-muted rounded-full" />
                <div className="h-5 w-16 bg-muted rounded-md" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
