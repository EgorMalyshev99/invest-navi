import type {
  AssetQuery,
  AssetsQuery,
  IndicesQuery,
  InstrumentType,
} from '@/shared/api/graphql/generated/graphql';

export type { InstrumentType };

export type Asset = AssetsQuery['assets'][number];
export type MarketIndex = IndicesQuery['indices'][number];
export type SectorIndex = AssetQuery['sectors'][number];
