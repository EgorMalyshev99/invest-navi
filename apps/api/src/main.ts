import 'reflect-metadata';

import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { parseAppOrigins } from './config/app-origins';
import { setupSwagger } from './config/setup-swagger';
import { assertProductionEnv } from './config/jwt.config';

async function bootstrap() {
  assertProductionEnv();

  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableShutdownHooks();

  const allowedOrigins = parseAppOrigins(process.env);
  app.enableCors({
    origin: (origin, callback) => {
      const normalizedOrigin = typeof origin === 'string' ? origin.replace(/\/$/, '') : undefined;
      if (!normalizedOrigin || allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Origin is not allowed by CORS'));
    },
    credentials: true,
  });

  setupSwagger(app);

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
}

void bootstrap();
