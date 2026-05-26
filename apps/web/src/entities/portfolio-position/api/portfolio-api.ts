import type {
  CreatePortfolioPositionInput,
  UpdatePortfolioPositionInput,
} from '@/shared/api/graphql/generated/graphql';

import { graphqlRequest } from '@/shared/api/graphql';
import {
  CreatePortfolioPositionDocument,
  DeletePortfolioPositionDocument,
  PortfolioPositionsDocument,
  PortfolioSummaryDocument,
  UpdatePortfolioPositionDocument,
} from '@/shared/api/graphql/generated/graphql';

export async function fetchPortfolioPositions() {
  const data = await graphqlRequest(PortfolioPositionsDocument);
  return data.portfolioPositions;
}

export async function fetchPortfolioSummary() {
  const data = await graphqlRequest(PortfolioSummaryDocument);
  return data.portfolioSummary;
}

export async function createPortfolioPosition(input: CreatePortfolioPositionInput) {
  const data = await graphqlRequest(CreatePortfolioPositionDocument, { input });
  return data.createPortfolioPosition;
}

export async function updatePortfolioPosition(id: string, input: UpdatePortfolioPositionInput) {
  const data = await graphqlRequest(UpdatePortfolioPositionDocument, { id, input });
  return data.updatePortfolioPosition;
}

export async function deletePortfolioPosition(id: string) {
  const data = await graphqlRequest(DeletePortfolioPositionDocument, { id });
  return data.deletePortfolioPosition;
}
