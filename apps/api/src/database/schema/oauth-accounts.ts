import { pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { users } from './users';

export const oauthProviderEnum = pgEnum('oauth_provider', ['yandex', 'google']);

export const oauthAccounts = pgTable(
  'oauth_accounts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    provider: oauthProviderEnum('provider').notNull(),
    providerUserId: text('provider_user_id').notNull(),
    providerEmail: text('provider_email'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('oauth_accounts_provider_user_idx').on(table.provider, table.providerUserId),
    uniqueIndex('oauth_accounts_user_provider_idx').on(table.userId, table.provider),
  ],
);
