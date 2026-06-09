import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  adminNickname: process.env.ADMIN_NICKNAME ?? 'aivacol',
  adminEmail: process.env.ADMIN_EMAIL ?? 'aivacol@fleetcore.local',
  adminName: process.env.ADMIN_NAME ?? 'Aivacol Admin',
  adminPassword: process.env.ADMIN_PASSWORD ?? 'aivacol123!',
  sessionTtlSeconds: parseInt(
    process.env.AUTH_SESSION_TTL_SECONDS ?? '3600',
    10,
  ),
}));
