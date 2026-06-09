import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { NestFactory } from '@nestjs/core';

import { ApiModule } from '../src/apps/api/api.module';
import { collectSwaggerDocuments } from '../src/apps/api/swagger/swagger.factory';

async function generateOpenApi() {
  try {
    const app = await NestFactory.create(ApiModule, { logger: false });
    const documents = collectSwaggerDocuments(app);
    const outputDir = resolve(__dirname, '../openapi');

    mkdirSync(outputDir, { recursive: true });

    documents.forEach(({ config, document }) => {
      const fileName = `${config.locale}-${config.path.replace(/\//g, '') || 'openapi'}.json`;
      const filePath = resolve(outputDir, fileName);
      writeFileSync(filePath, JSON.stringify(document, null, 2));
    });

    if (documents.length === 0) {
      // eslint-disable-next-line no-console
      console.warn('No Swagger documents generated. Check swagger configuration.');
    }

    await app.close();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to generate OpenAPI document', error);
    process.exitCode = 1;
  }
}

void generateOpenApi();
