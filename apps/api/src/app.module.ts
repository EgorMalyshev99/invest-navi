import { join } from 'path';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler';

import { AiModule } from './ai';
import { AppResolver } from './app.resolver';
import { AuthModule } from './auth';
import { GqlExceptionFilter } from './common/filters/gql-exception.filter';
import { GqlThrottlerGuard } from './common/guards/gql-throttler.guard';
import { DatabaseModule } from './database';
import { HealthModule } from './health';
import { MarketModule } from './market';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env'],
    }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000,
        limit: 120,
      },
    ]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req, res }) => ({ req, res }),
      sortSchema: true,
    }),
    DatabaseModule,
    HealthModule,
    AuthModule,
    MarketModule,
    AiModule,
  ],
  controllers: [],
  providers: [
    AppResolver,
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GqlExceptionFilter,
    },
  ],
})
export class AppModule {}
