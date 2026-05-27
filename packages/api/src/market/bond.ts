import type { MarketDataSource } from './data-source.js';

/** Normalized bond snapshot from MOEX ISS (TQOB board). */
export interface BondSnapshot {
  symbol: string;
  name: string;
  lastPrice: number;
  changePercent: number;
  lotSize: number;
  valueToday: number;
  couponPercent?: number;
  maturityDate?: string;
  yieldAtPrice?: number;
  faceValue?: number;
  currency?: string;
  dataSource: MarketDataSource;
}
