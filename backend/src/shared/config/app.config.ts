import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: 'fleetcore-api',
  port: parseInt(process.env.HTTP_PORT ?? '3000', 10),
  globalPrefix: 'api',
}));
