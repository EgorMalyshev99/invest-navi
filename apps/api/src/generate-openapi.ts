import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { createOpenApiDocument } from './config/setup-swagger';

async function generateOpenApi() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const document = createOpenApiDocument(app);
  const outputPath = join(process.cwd(), 'openapi.json');
  writeFileSync(outputPath, `${JSON.stringify(document, null, 2)}\n`, 'utf8');
  await app.close();
}

void generateOpenApi();
