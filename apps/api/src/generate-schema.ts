import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { NestFactory } from '@nestjs/core';
import { GraphQLSchemaHost } from '@nestjs/graphql';
import { printSchema } from 'graphql';

import { AppModule } from './app.module';

async function main(): Promise<void> {
  process.env.DATABASE_URL ??= 'postgresql://localhost:5432/invest_navi';
  process.env.JWT_SECRET ??= 'dev-access-secret';
  process.env.JWT_REFRESH_SECRET ??= 'dev-refresh-secret';

  const app = await NestFactory.create(AppModule, { logger: ['error'] });
  await app.init();

  const { schema } = app.get(GraphQLSchemaHost);
  const outputPath = join(process.cwd(), 'src/schema.gql');
  writeFileSync(outputPath, `${printSchema(schema)}\n`);

  await app.close();
}

void main();
