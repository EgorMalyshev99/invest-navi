import { Badge } from '@repo/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';

import { getGraphqlUrl } from '@/shared/config/env';
import { formatCompactNumber } from '@/shared/lib/format';

interface MarketIndex {
  code: string;
  name: string;
  currentValue: number;
  changePercent: number;
}

interface IndicesResponse {
  data?: {
    indices?: MarketIndex[];
  };
}

const INDICES_QUERY = /* GraphQL */ `
  query LandingIndices {
    indices {
      code
      name
      currentValue
      changePercent
    }
  }
`;

async function fetchIndices(): Promise<MarketIndex[]> {
  try {
    const response = await fetch(getGraphqlUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: INDICES_QUERY }),
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as IndicesResponse;
    return payload.data?.indices ?? [];
  } catch {
    return [];
  }
}

function ChangeBadge({ value }: { value: number }) {
  const isPositive = value >= 0;

  return (
    <Badge variant="secondary" className={isPositive ? 'text-positive' : 'text-negative'}>
      {isPositive ? '+' : ''}
      {value.toFixed(2)}%
    </Badge>
  );
}

function IndexCard({ index }: { index: MarketIndex }) {
  return (
    <Card className="bg-card/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{index.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <p className="font-mono text-xl font-semibold tabular-nums">
          {index.currentValue > 0 ? formatCompactNumber(index.currentValue) : '—'}
        </p>
        <ChangeBadge value={index.changePercent} />
      </CardContent>
    </Card>
  );
}

export async function MarketIndicesStrip() {
  const data = await fetchIndices();

  if (!data.length) {
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
