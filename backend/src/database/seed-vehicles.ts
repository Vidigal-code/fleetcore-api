import { join } from 'node:path';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { ApiModule } from '../apps/api/api.module';
import { FleetSeederService } from '../modules/fleet/application/fleet-seeder.service';

const resolveSeedFile = (): string =>
  process.env.SEED_VEHICLES_FILE ??
  join(process.cwd(), 'seeds', 'seed_vehicles.json');

async function run(): Promise<void> {
  const logger = new Logger('SeedVehicles');
  const app = await NestFactory.createApplicationContext(ApiModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const seeder = app.get(FleetSeederService);
    const file = resolveSeedFile();
    logger.log(`Seeding fleet from ${file}`);
    const summary = await seeder.seedFromFile(file);
    logger.log(`Done: ${JSON.stringify(summary)}`);
  } finally {
    await app.close();
  }
}

run().catch((error) => {
  new Logger('SeedVehicles').error(error);
  process.exitCode = 1;
});
