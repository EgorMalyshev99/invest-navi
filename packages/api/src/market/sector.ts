import type { MarketDataSource } from './data-source.js';

export interface SectorSnapshot {
  code: string;
  name: string;
  currentValue: number;
  changePercent: number;
  dataSource: MarketDataSource;
}
