import { Global, Module } from '@nestjs/common';

import { drizzleProvider } from './drizzle.provider';
import { DiaryEntriesRepository } from './repositories/diary-entries.repository';
import { OAuthAccountsRepository } from './repositories/oauth-accounts.repository';
import { PortfolioPositionsRepository } from './repositories/portfolio-positions.repository';
import { RefreshSessionsRepository } from './repositories/refresh-sessions.repository';
import { WeeklyMarketReviewsRepository } from './repositories/weekly-market-reviews.repository';
import { UsersRepository } from './repositories/users.repository';

@Global()
@Module({
  providers: [
    drizzleProvider,
    UsersRepository,
    OAuthAccountsRepository,
    DiaryEntriesRepository,
    PortfolioPositionsRepository,
    RefreshSessionsRepository,
    WeeklyMarketReviewsRepository,
  ],
  exports: [
    drizzleProvider,
    UsersRepository,
    OAuthAccountsRepository,
    DiaryEntriesRepository,
    PortfolioPositionsRepository,
    RefreshSessionsRepository,
    WeeklyMarketReviewsRepository,
  ],
})
export class DatabaseModule {}
