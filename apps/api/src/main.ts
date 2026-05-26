import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { assertProductionEnv } from './config/jwt.config';

async function bootstrap() {
  assertProductionEnv();

  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();

  const webOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:3001';
  app.enableCors({
    origin: webOrigin,
    credentials: true,
  });

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
}

void bootstrap();
