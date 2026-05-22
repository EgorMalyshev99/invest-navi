import { pgTable, smallint, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { diaryActionEnum, diaryHorizonEnum, diaryStatusEnum } from './enums';
import { users } from './users';

export const diaryEntries = pgTable('diary_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  assetSymbol: text('asset_symbol').notNull(),
  action: diaryActionEnum('action').notNull(),
  horizon: diaryHorizonEnum('horizon').notNull(),
  rationale: text('rationale'),
  risks: text('risks'),
  successCriteria: text('success_criteria'),
  failureCriteria: text('failure_criteria'),
  confidence: smallint('confidence'),
  status: diaryStatusEnum('status').default('active').notNull(),
  reviewAt: timestamp('review_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
