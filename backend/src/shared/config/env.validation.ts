import { Transform, plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  validateSync,
} from 'class-validator';

export enum Environment {
  Development = 'development',
  Test = 'test',
  Production = 'production',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') {
      return 3000;
    }
    if (typeof value === 'number') {
      return value;
    }
    const match = `${value}`.match(/\d+/);
    if (!match) {
      return 3000;
    }
    const parsed = Number.parseInt(match[0], 10);
    return Number.isNaN(parsed) ? 3000 : parsed;
  })
  @IsInt()
  @IsPositive()
  HTTP_PORT = 3000;

  @IsInt()
  @IsPositive()
  @IsOptional()
  FRONTEND_PORT?: number;

  @Transform(({ value, obj }) => {
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
    const source = obj as Record<string, unknown>;
    const candidates = [source.SQLSERVER_SERVER, source.DB_HOST];
    for (const candidate of candidates) {
      if (typeof candidate === 'string' && candidate.length > 0) {
        return candidate;
      }
    }
    return 'sqlserver';
  })
  @IsString()
  SQLSERVER_HOST!: string;

  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') {
      return 1433;
    }
    if (typeof value === 'number') {
      return value;
    }
    const match = `${value}`.match(/\d+/);
    if (!match) {
      return 1433;
    }
    const parsed = Number.parseInt(match[0], 10);
    return Number.isNaN(parsed) ? 1433 : parsed;
  })
  @IsInt()
  SQLSERVER_PORT!: number;

  @Transform(({ value, obj }) => {
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
    const source = obj as Record<string, unknown>;
    const saUser = source.SA_USER;
    if (typeof saUser === 'string' && saUser.length > 0) {
      return saUser;
    }
    return 'sa';
  })
  @IsString()
  SQLSERVER_USER!: string;

  @Transform(({ value, obj }) => {
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
    const source = obj as Record<string, unknown>;
    const saPassword = source.SA_PASSWORD;
    if (typeof saPassword === 'string' && saPassword.length > 0) {
      return saPassword;
    }
    return 'YourStrong@Passw0rd';
  })
  @IsString()
  SQLSERVER_PASSWORD!: string;

  @Transform(({ value }) => {
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
    return 'YourStrong@Passw0rd';
  })
  @IsString()
  SQLSERVER_PASSWORD_FALLBACK!: string;

  @IsOptional()
  @IsString()
  SQLSERVER_LEGACY_PASSWORD?: string;

  @Transform(({ value, obj }) => {
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
    const source = obj as Record<string, unknown>;
    const candidates = [source.SQLSERVER_DATABASE, source.DB_NAME];
    for (const candidate of candidates) {
      if (typeof candidate === 'string' && candidate.length > 0) {
        return candidate;
      }
    }
    return 'fleetcore';
  })
  @IsString()
  SQLSERVER_DB!: string;

  @IsString()
  REDIS_HOST!: string;

  @IsInt()
  REDIS_PORT!: number;

  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') {
      return 60;
    }
    if (typeof value === 'number') {
      return value;
    }
    const match = `${value}`.match(/\d+/);
    if (!match) {
      return 60;
    }
    const parsed = Number.parseInt(match[0], 10);
    return Number.isNaN(parsed) ? 60 : parsed;
  })
  @IsInt()
  @IsPositive()
  REDIS_TTL_SECONDS = 60;

  @IsString()
  JWT_SECRET!: string;

  @IsString()
  @Matches(/^[0-9]+(s|m|h|d)$/)
  JWT_EXPIRES_IN!: string;

  @IsString()
  MONGO_URI!: string;

  @IsString()
  RABBITMQ_URI!: string;

  @IsString()
  RABBITMQ_EXCHANGE = 'fleetcore.events';

  @IsString()
  RABBITMQ_QUEUE = 'fleetcore.vehicles';

  @IsOptional()
  @IsString()
  ADMIN_NICKNAME?: string;

  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    if (typeof value === 'number') {
      return value;
    }
    const match = `${value}`.match(/\d+/);
    if (!match) {
      return undefined;
    }
    const parsed = Number.parseInt(match[0], 10);
    return Number.isNaN(parsed) ? undefined : parsed;
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  RABBITMQ_CONNECT_TIMEOUT_MS?: number;

  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    if (typeof value === 'number') {
      return value;
    }
    const match = `${value}`.match(/\d+/);
    if (!match) {
      return undefined;
    }
    const parsed = Number.parseInt(match[0], 10);
    return Number.isNaN(parsed) ? undefined : parsed;
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  RABBITMQ_RECONNECT_SECONDS?: number;

  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    if (typeof value === 'number') {
      return value;
    }
    const match = `${value}`.match(/\d+/);
    if (!match) {
      return undefined;
    }
    const parsed = Number.parseInt(match[0], 10);
    return Number.isNaN(parsed) ? undefined : parsed;
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  RABBITMQ_HEARTBEAT_SECONDS?: number;

  @IsOptional()
  @IsString()
  ADMIN_EMAIL?: string;

  @IsOptional()
  @IsString()
  ADMIN_NAME?: string;

  @IsOptional()
  @IsString()
  ADMIN_PASSWORD?: string;

  @IsOptional()
  @IsInt()
  AUTH_SESSION_TTL_SECONDS?: number;

  @IsOptional()
  @IsString()
  DATABASE_TYPE?: string;

  @IsOptional()
  @IsString()
  DATABASE_SQLITE_PATH?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  REDIS_LOCK_TTL?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  WORKER_CONCURRENCY?: number;

  @IsOptional()
  @IsString()
  RABBITMQ_AUDIT_QUEUE?: string;

  @IsOptional()
  @IsString()
  RABBITMQ_RETRY_QUEUE?: string;

  @IsOptional()
  @IsString()
  RABBITMQ_DLQ?: string;

  @IsOptional()
  @IsString()
  RATE_LIMIT_ENABLED?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  RATE_LIMIT_WINDOW_SECONDS?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  RATE_LIMIT_MAX_REQUESTS?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  RATE_LIMIT_AUTH_MAX_REQUESTS?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  RATE_LIMIT_AUTH_WINDOW_SECONDS?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  RETRY_MAX_ATTEMPTS?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  RETRY_INITIAL_DELAY?: number;
}

export const validateEnvironment = (config: Record<string, unknown>) => {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validated, {
    skipMissingProperties: false,
  });
  if (errors.length > 0) {
    throw new Error(
      `Environment validation error: ${errors
        .map((err) => Object.values(err.constraints ?? {}).join(', '))
        .join('; ')}`,
    );
  }
  return validated;
};
