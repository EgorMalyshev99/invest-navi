import { Global, Module } from '@nestjs/common';

import { drizzleProvider } from './drizzle.provider';
import { DiaryEntriesRepository } from './repositories/diary-entries.repository';
import { OAuthAccountsRepository } from './repositories/oauth-accounts.repository';
import { PortfolioPositionsRepository } from './repositories/portfolio-positions.repository';
import { UsersRepository } from './repositories/users.repository';

@Global()
@Module({
  providers: [
    drizzleProvider,
    UsersRepository,
    OAuthAccountsRepository,
    DiaryEntriesRepository,
    PortfolioPositionsRepository,
  ],
  exports: [
    drizzleProvider,
    UsersRepository,
    OAuthAccountsRepository,
    DiaryEntriesRepository,
    PortfolioPositionsRepository,
  ],
})
export class DatabaseModule {}
