import type { MarketDataSource } from './data-source.js';

export interface IndexSnapshot {
  code: string;
  name: string;
  currentValue: number;
  changePercent: number;
  valueToday: number;
  dataSource: MarketDataSource;
}
