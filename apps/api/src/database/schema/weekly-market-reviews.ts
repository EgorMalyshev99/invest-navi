import { jsonb, pgTable, text, timestamp, uuid, uniqueIndex } from 'drizzle-orm/pg-core';

export const weeklyMarketReviews = pgTable(
  'weekly_market_reviews',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    weekStart: timestamp('week_start', { withTimezone: true, mode: 'date' }).notNull(),
    locale: text('locale').notNull(),
    content: jsonb('content').notNull(),
    source: text('source').notNull(),
    generatedAt: timestamp('generated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('weekly_market_reviews_week_locale_idx').on(table.weekStart, table.locale),
  ],
);
