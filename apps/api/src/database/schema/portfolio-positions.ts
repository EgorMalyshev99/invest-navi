import { date, numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { users } from './users';

export const portfolioPositions = pgTable('portfolio_positions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  assetSymbol: text('asset_symbol').notNull(),
  quantity: numeric('quantity', { precision: 20, scale: 6 }).notNull(),
  entryPrice: numeric('entry_price', { precision: 20, scale: 6 }).notNull(),
  entryDate: date('entry_date').notNull(),
  goal: text('goal'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
