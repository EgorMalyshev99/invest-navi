import { Global, Module } from '@nestjs/common';

import { drizzleProvider } from './drizzle.provider';
import { DiaryEntriesRepository } from './repositories/diary-entries.repository';
import { UsersRepository } from './repositories/users.repository';

@Global()
@Module({
  providers: [drizzleProvider, UsersRepository, DiaryEntriesRepository],
  exports: [drizzleProvider, UsersRepository, DiaryEntriesRepository],
})
export class DatabaseModule {}
