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
import { DiaryModule } from './diary';
import { HealthModule } from './health';
import { MarketModule } from './market';
import { PortfolioModule } from './portfolio';

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
      // Vercel: read-only FS — generate schema in memory. Local/Railway: write src/schema.gql.
      autoSchemaFile: process.env.VERCEL === '1' ? true : join(process.cwd(), 'src/schema.gql'),
      context: ({ req, res }) => ({ req, res }),
      sortSchema: true,
    }),
    DatabaseModule,
    HealthModule,
    AuthModule,
    MarketModule,
    AiModule,
    DiaryModule,
    PortfolioModule,
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
