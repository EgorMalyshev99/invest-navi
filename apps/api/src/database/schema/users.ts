import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { knowledgeLevelEnum, preferredLocaleEnum } from './enums';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').unique(),
  name: text('name'),
  passwordHash: text('password_hash'),
  avatarUrl: text('avatar_url'),
  knowledgeLevel: knowledgeLevelEnum('knowledge_level').default('beginner').notNull(),
  preferredLocale: preferredLocaleEnum('preferred_locale').default('ru').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
