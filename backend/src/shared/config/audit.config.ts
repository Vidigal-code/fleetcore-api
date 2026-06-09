import { registerAs } from '@nestjs/config';

export default registerAs('audit', () => ({
  mongoUri: process.env.MONGO_URI,
  collection: 'audit_events',
}));
