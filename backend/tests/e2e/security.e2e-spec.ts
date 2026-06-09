/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { INestApplication } from '@nestjs/common/interfaces';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import securityConfig from '../../src/shared/config/security.config';
import { applySecurity } from '../../src/apps/api/security/security-setup';

@Controller('health')
class HealthController {
  @Get()
  check() {
    return { status: 'ok' };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [securityConfig],
    }),
  ],
  controllers: [HealthController],
})
class TestApplicationModule {}

describe('Security configuration (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.SECURITY_CORS_ALLOWED_ORIGINS = 'http://trusted.test';
    process.env.SECURITY_PERMISSIONS_POLICY = 'geolocation=()';

    const moduleRef = await Test.createTestingModule({
      imports: [TestApplicationModule],
    }).compile();

    app = moduleRef.createNestApplication();
    applySecurity(app);
    await app.init();
  });

  afterAll(async () => {
    delete process.env.SECURITY_CORS_ALLOWED_ORIGINS;
    delete process.env.SECURITY_PERMISSIONS_POLICY;

    await app.close();
  });

  it('exposes hardened headers for allowed requests', async () => {
    const response = await request(app.getHttpServer())
      .get('/health')
      .set('Origin', 'http://trusted.test')
      .expect(200);

    expect(response.headers).toHaveProperty('x-request-id');
    expect(response.headers['content-security-policy']).toContain(
      "default-src 'self'",
    );
    expect(response.headers['permissions-policy']).toBe('geolocation=()');
    expect(response.headers['strict-transport-security']).toContain('max-age');
  });

  it('rejects disallowed origins', async () => {
    const result = await request(app.getHttpServer())
      .get('/health')
      .set('Origin', 'http://blocked.test');

    expect(result.status).toBeGreaterThanOrEqual(400);
  });
});
