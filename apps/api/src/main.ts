import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const webOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:3001';
  app.enableCors({
    origin: webOrigin,
    credentials: true,
  });

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
}

void bootstrap();
