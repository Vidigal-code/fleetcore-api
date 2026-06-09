import { config as loadEnv } from 'dotenv';
import { resolve } from 'node:path';
import { DataSource, DataSourceOptions } from 'typeorm';

import databaseConfig from '../shared/config/database.config';

loadEnv({ path: resolve(__dirname, '../../../.env') });

const dbConfig = databaseConfig() as unknown as DataSourceOptions;

export default new DataSource({
  ...dbConfig,
  entities: ['dist/**/*.entity.js', 'dist/**/*.orm-entity.js'],
  migrations: ['dist/migrations/*.js'],
});
