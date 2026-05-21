import { join } from 'path';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import { AiModule } from './ai';
import { AppResolver } from './app.resolver';
import { AuthModule } from './auth';
import { DatabaseModule } from './database';
import { MarketModule } from './market';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env'],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req }) => ({ req }),
      sortSchema: true,
    }),
    AuthModule,
    DatabaseModule,
    MarketModule,
    AiModule,
  ],
  controllers: [],
  providers: [AppResolver],
})
export class AppModule {}
