import type { Asset, FxRate, MarketIndex, SectorIndex } from '../model/types';

import { graphqlRequest } from '@/shared/api/graphql';
import {
  AssetDocument,
  AssetsDocument,
  FxRatesDocument,
  IndicesDocument,
  SectorsDocument,
} from '@/shared/api/graphql/generated/graphql';

export async function fetchAssets(limit = 50): Promise<Asset[]> {
  const data = await graphqlRequest(AssetsDocument, { limit });
  return data.assets;
}

export async function fetchAssetDetail(symbol: string): Promise<{
  asset: Asset;
  sectors: SectorIndex[];
  indices: MarketIndex[];
}> {
  const data = await graphqlRequest(AssetDocument, { symbol });
  return {
    asset: data.asset,
    sectors: data.sectors,
    indices: data.indices,
  };
}

export async function fetchIndices(): Promise<MarketIndex[]> {
  const data = await graphqlRequest(IndicesDocument);
  return data.indices;
}

export async function fetchSectors(): Promise<SectorIndex[]> {
  const data = await graphqlRequest(SectorsDocument);
  return data.sectors;
}

export async function fetchFxRates(): Promise<FxRate[]> {
  const data = await graphqlRequest(FxRatesDocument);
  return data.fxRates;
}
