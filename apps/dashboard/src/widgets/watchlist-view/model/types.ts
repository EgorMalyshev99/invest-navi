import type { Asset } from '@/entities/asset';
import type { WatchlistEntry } from '@/features/watchlist';

export type WatchlistRow = WatchlistEntry & {
  quote?: Asset;
};
