'use client';

import { useQuery } from '@tanstack/react-query';

import { ChangeBadge, fetchIndices, type MarketIndex } from '@/entities/asset';
import { formatCompactNumber } from '@/shared/lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

function IndexCard({ index }: { index: MarketIndex }) {
  return (
    <Card className="bg-card/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{index.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="font-mono text-xl font-semibold tabular-nums">
          {index.currentValue > 0 ? formatCompactNumber(index.currentValue) : '—'}
        </p>
        <ChangeBadge value={index.changePercent} />
      </CardContent>
    </Card>
  );
}

export function MarketIndicesStrip() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['indices'],
    queryFn: fetchIndices,
  });

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (isError || !data?.length) {
    return null;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {data.map((index) => (
        <IndexCard key={index.code} index={index} />
      ))}
    </div>
  );
}
