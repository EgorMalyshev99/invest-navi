import { graphqlRequest } from '@/shared/api/graphql';
import { WeeklyMarketReviewDocument } from '@/shared/api/graphql/generated/graphql';

export async function fetchWeeklyMarketReview(locale: string) {
  const data = await graphqlRequest(WeeklyMarketReviewDocument, { locale });
  return data.weeklyMarketReview;
}
