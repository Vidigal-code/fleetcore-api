export interface AppConfig {
  appName: string;
  apiUrl: string;
  cacheTtlSeconds: number;
}

const parseNumber = (value: string | undefined, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const appConfig: AppConfig = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'Fleetcore Web',
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api',
  cacheTtlSeconds: parseNumber(process.env.NEXT_PUBLIC_CACHE_TTL_SECONDS, 60),
};
