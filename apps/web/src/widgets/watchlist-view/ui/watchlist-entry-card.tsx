'use client';

import { useTranslations } from 'next-intl';

import type { WatchlistRow } from '../model/types';

import { ChangeBadge } from '@/entities/asset';
import { WatchlistStatusSelect } from '@/features/watchlist';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface WatchlistEntryCardProps {
  row: WatchlistRow;
  onRemove: (symbol: string) => void;
  onStatusChange: (symbol: string, status: WatchlistRow['status']) => void;
}

export function WatchlistEntryCard({ row, onRemove, onStatusChange }: WatchlistEntryCardProps) {
  const t = useTranslations('watchlist');

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="text-base">
            <Link href={`/market/${row.symbol}`} className="hover:text-primary">
              {row.name}
            </Link>
          </CardTitle>
          <p className="text-muted-foreground font-mono text-sm tabular-nums">{row.symbol}</p>
        </div>
        {row.quote ? <ChangeBadge value={row.quote.changePercent} /> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <WatchlistStatusSelect
          value={row.status}
          onValueChange={(status) => onStatusChange(row.symbol, status)}
        />
        <Button type="button" variant="ghost" size="sm" onClick={() => onRemove(row.symbol)}>
          {t('remove')}
        </Button>
      </CardContent>
    </Card>
  );
}
