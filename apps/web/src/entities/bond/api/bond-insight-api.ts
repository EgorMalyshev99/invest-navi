import { graphqlRequest } from '@/shared/api/graphql';
import { BondInsightDocument } from '@/shared/api/graphql/generated/graphql';

export async function fetchBondInsight(symbol: string, locale: string) {
  const data = await graphqlRequest(BondInsightDocument, { symbol, locale });
  return data.bondInsight;
}
