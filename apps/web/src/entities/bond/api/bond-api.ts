import { graphqlRequest } from '@/shared/api/graphql';
import { BondDocument, BondsDocument } from '@/shared/api/graphql/generated/graphql';

export async function fetchBonds(limit?: number) {
  const data = await graphqlRequest(BondsDocument, { limit });
  return data.bonds;
}

export async function fetchBond(symbol: string) {
  const data = await graphqlRequest(BondDocument, { symbol });
  return data.bond;
}
