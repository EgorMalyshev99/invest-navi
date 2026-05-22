import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

import { AppModule } from './app.module';

import type { INestApplication } from '@nestjs/common';
import type { Express } from 'express';

export async function createNestApp(httpAdapter?: ExpressAdapter): Promise<INestApplication> {
  const app = httpAdapter
    ? await NestFactory.create(AppModule, httpAdapter)
    : await NestFactory.create(AppModule);

  const webOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:3001';
  app.enableCors({
    origin: webOrigin,
    credentials: true,
  });

  return app;
}

/** Express app for Vercel serverless (init without listen). */
export async function createExpressNestApp(): Promise<Express> {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  const app = await createNestApp(adapter);
  await app.init();
  return expressApp;
}
