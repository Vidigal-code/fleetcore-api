import type { JwtPayload } from '../domain/jwt-payload.interface';

export const resolveActor = (
  user: Pick<JwtPayload, 'nickname'> | undefined,
  fallback = 'system',
): string => user?.nickname ?? fallback;
