'use client';

import { WatchlistEntryCard } from './watchlist-entry-card';

import type { WatchlistRow } from '../model/types';
import type { WatchlistStatus } from '@/features/watchlist/model/types';

interface WatchlistCardListProps {
  rows: WatchlistRow[];
  onRemove: (symbol: string) => void;
  onStatusChange: (symbol: string, status: WatchlistStatus) => void;
}

export function WatchlistCardList({ rows, onRemove, onStatusChange }: WatchlistCardListProps) {
  return (
    <div className="grid gap-4">
      {rows.map((row) => (
        <WatchlistEntryCard
          key={row.symbol}
          row={row}
          onRemove={onRemove}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
