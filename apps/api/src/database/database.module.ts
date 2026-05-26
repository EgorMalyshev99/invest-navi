import { Global, Module } from '@nestjs/common';

import { drizzleProvider } from './drizzle.provider';
import { DiaryEntriesRepository } from './repositories/diary-entries.repository';
import { PortfolioPositionsRepository } from './repositories/portfolio-positions.repository';
import { UsersRepository } from './repositories/users.repository';

@Global()
@Module({
  providers: [
    drizzleProvider,
    UsersRepository,
    DiaryEntriesRepository,
    PortfolioPositionsRepository,
  ],
  exports: [drizzleProvider, UsersRepository, DiaryEntriesRepository, PortfolioPositionsRepository],
})
export class DatabaseModule {}
