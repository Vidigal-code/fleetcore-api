import type { ThemeMode } from '@/shared/config/theme';

export interface AppConfig {
  appName: string;
  apiUrl: string;
  cacheTtlSeconds: number;
  startTheme: ThemeMode;
}

const parseNumber = (value: string | undefined, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseTheme = (value: string | undefined): ThemeMode => {
  if (!value) {
    return 'light';
  }
  const normalized = value.toLowerCase();
  return normalized === 'dark' ? 'dark' : 'light';
};

export const appConfig: AppConfig = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'Fleetcore Web',
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api',
  cacheTtlSeconds: parseNumber(process.env.NEXT_PUBLIC_CACHE_TTL_SECONDS, 60),
  startTheme: parseTheme(process.env.NEXT_PUBLIC_START_THEME),
};
