import type { MarketDataSource } from './data-source.js';
import type { InstrumentType } from './instrument-type.js';

/** Normalized asset snapshot (MOEX + optional Tinkoff enrichment). */
export interface AssetSnapshot {
  symbol: string;
  name: string;
  lastPrice: number;
  changePercent: number;
  lotSize: number;
  valueToday: number;
  instrumentType: InstrumentType;
  currency?: string;
  figi?: string;
  sector?: string;
  dividendYieldPercent?: number;
  dataSource: MarketDataSource;
}
