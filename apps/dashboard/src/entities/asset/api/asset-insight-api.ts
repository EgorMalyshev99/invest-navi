import { graphqlRequest } from '@/shared/api/graphql';
import { AssetInsightDocument } from '@/shared/api/graphql/generated/graphql';

export type AssetInsightSource = 'AI' | 'FALLBACK';

export interface AssetInsightResult {
  symbol: string;
  source: AssetInsightSource;
  provider?: string | null;
  whatIs: string;
  whatChanged: string;
  whyMatters: string;
  risks: string[];
  forInvestor: string;
  vsIndex?: string | null;
}

export async function fetchAssetInsight(
  symbol: string,
  locale: string,
): Promise<AssetInsightResult> {
  const data = await graphqlRequest(AssetInsightDocument, { symbol, locale });
  return data.assetInsight;
}
