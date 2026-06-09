import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  const type = (process.env.DATABASE_TYPE ?? 'mssql').toLowerCase();

  if (type === 'sqlite') {
    return {
      type: 'sqlite' as const,
      database: process.env.DATABASE_SQLITE_PATH ?? ':memory:',
      synchronize: true,
      autoLoadEntities: true,
      migrationsRun: false,
      logging: false,
    };
  }

  return {
    type: 'mssql' as const,
    host: process.env.SQLSERVER_HOST,
    port: parseInt(process.env.SQLSERVER_PORT ?? '1433', 10),
    username: process.env.SQLSERVER_USER,
    password: process.env.SQLSERVER_PASSWORD,
    database: process.env.SQLSERVER_DB,
    synchronize: false,
    autoLoadEntities: true,
    logging: process.env.NODE_ENV === 'development',
    migrationsRun: true,
    migrations: ['dist/migrations/*.js'],
  };
});
