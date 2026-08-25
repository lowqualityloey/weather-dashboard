import { Card, CardHeader, CardContent } from './ui/card';

export function WeatherSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Current Weather Skeleton */}
      <Card className="bg-muted/40 border-border">
        <CardHeader>
          <div className="h-6 w-40 bg-muted rounded-md" />
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 bg-muted rounded-full shrink-0" />
            <div className="space-y-2">
              <div className="h-10 w-24 bg-muted rounded-md" />
              <div className="h-4 w-32 bg-muted rounded-md" />
            </div>
          </div>
          <div className="space-y-2 text-left sm:text-right w-full sm:w-auto">
            <div className="h-4 w-28 bg-muted rounded-md sm:ml-auto" />
            <div className="h-4 w-24 bg-muted rounded-md sm:ml-auto" />
            <div className="h-4 w-32 bg-muted rounded-md sm:ml-auto" />
          </div>
        </CardContent>
      </Card>

      {/* 24-Hour Forecast Carousel Skeleton */}
      <Card className="bg-muted/30 border-border p-4 space-y-4">
        <div className="h-4 w-36 bg-muted rounded-md" />
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex flex-col items-center space-y-2 shrink-0 min-w-16 p-2">
              <div className="h-3 w-8 bg-muted rounded-sm" />
              <div className="h-8 w-8 bg-muted rounded-full" />
              <div className="h-4 w-6 bg-muted rounded-sm" />
            </div>
          ))}
        </div>
      </Card>

      {/* 5-Day Forecast Grid Skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-32 bg-muted rounded-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card
              key={i}
              className="bg-muted/30 border-border p-4 flex flex-col items-center space-y-3"
            >
              <div className="h-4 w-12 bg-muted rounded-sm" />
              <div className="h-10 w-10 bg-muted rounded-full" />
              <div className="h-3 w-16 bg-muted rounded-sm" />
              <div className="h-4 w-full bg-muted rounded-sm pt-2" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
