export type WatchlistStatus = 'watching' | 'researching' | 'idea' | 'in_portfolio' | 'too_risky';

export interface WatchlistEntry {
  symbol: string;
  name: string;
  status: WatchlistStatus;
  addedAt: string;
}

export type WatchlistStore = Record<string, WatchlistEntry>;
