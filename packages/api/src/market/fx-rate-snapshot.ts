import type { MarketDataSource } from './data-source.js';

/** MOEX SELT FX pair quoted as foreign currency per 1 RUB unit (e.g. USD/RUB TOM). */
export interface FxRateSnapshot {
  code: string;
  name: string;
  currentValue: number;
  changePercent: number;
  valueToday: number;
  dataSource: MarketDataSource;
}
