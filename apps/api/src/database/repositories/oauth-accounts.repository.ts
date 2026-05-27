import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

import { DRIZZLE } from '../drizzle.provider';
import { oauthAccounts, type oauthProviderEnum } from '../schema/oauth-accounts';

import type { DrizzleDB } from '../drizzle.provider';

type OAuthProvider = (typeof oauthProviderEnum.enumValues)[number];

@Injectable()
export class OAuthAccountsRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  findByProvider(provider: OAuthProvider, providerUserId: string) {
    return this.db.query.oauthAccounts.findFirst({
      where: and(
        eq(oauthAccounts.provider, provider),
        eq(oauthAccounts.providerUserId, providerUserId),
      ),
    });
  }

  create(values: typeof oauthAccounts.$inferInsert) {
    return this.db.insert(oauthAccounts).values(values).returning();
  }
}
