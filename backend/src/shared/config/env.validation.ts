import { plainToInstance } from 'class-transformer';
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

  @IsInt()
  @IsPositive()
  HTTP_PORT = 3000;

  @IsInt()
  @IsPositive()
  @IsOptional()
  FRONTEND_PORT?: number;

  @IsString()
  SQLSERVER_HOST!: string;

  @IsInt()
  SQLSERVER_PORT!: number;

  @IsString()
  SQLSERVER_USER!: string;

  @IsString()
  SQLSERVER_PASSWORD!: string;

  @IsString()
  SQLSERVER_DB!: string;

  @IsString()
  REDIS_HOST!: string;

  @IsInt()
  REDIS_PORT!: number;

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
