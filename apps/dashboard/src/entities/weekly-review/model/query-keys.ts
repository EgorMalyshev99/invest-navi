export const weeklyReviewKeys = {
  all: ['weekly-review'] as const,
  detail: (locale: string) => [...weeklyReviewKeys.all, locale] as const,
};
