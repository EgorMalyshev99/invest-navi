import { DiaryHorizon } from '../dto/diary-horizon.enum';

const HORIZON_REVIEW_DAYS: Record<DiaryHorizon, number> = {
  [DiaryHorizon.ONE_MONTH]: 30,
  [DiaryHorizon.THREE_MONTHS]: 90,
  [DiaryHorizon.ONE_YEAR]: 365,
  [DiaryHorizon.LONG]: 180,
};

export function computeReviewAt(horizon: DiaryHorizon, from = new Date()): Date {
  const days = HORIZON_REVIEW_DAYS[horizon];
  const reviewAt = new Date(from);
  reviewAt.setDate(reviewAt.getDate() + days);
  return reviewAt;
}
