import { pgEnum } from 'drizzle-orm/pg-core';

export const knowledgeLevelEnum = pgEnum('knowledge_level', [
  'beginner',
  'intermediate',
  'advanced',
]);

export const preferredLocaleEnum = pgEnum('preferred_locale', ['ru', 'en']);

export const diaryActionEnum = pgEnum('diary_action', ['observe', 'buy', 'sell', 'hold']);

export const diaryHorizonEnum = pgEnum('diary_horizon', ['1m', '3m', '1y', 'long']);

export const diaryStatusEnum = pgEnum('diary_status', ['active', 'completed', 'cancelled']);
