import type { FxRatesQuery, InstrumentType } from '@/shared/api/graphql/generated/graphql';

export type { Asset, MarketIndex, SectorIndex } from '@/shared/types/market';
export type { InstrumentType };

export type FxRate = FxRatesQuery['fxRates'][number];
