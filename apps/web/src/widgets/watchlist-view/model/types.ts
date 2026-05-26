import type { Asset } from '@/entities/asset';
import type { WatchlistEntry } from '@/features/watchlist/model/types';

export type WatchlistRow = WatchlistEntry & {
  quote?: Asset;
};
