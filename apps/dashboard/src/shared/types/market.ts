import type { AssetQuery, AssetsQuery, IndicesQuery } from '@/shared/api/graphql/generated/graphql';

export type Asset = AssetsQuery['assets'][number];
export type MarketIndex = IndicesQuery['indices'][number];
export type SectorIndex = AssetQuery['sectors'][number];
