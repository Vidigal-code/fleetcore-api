import type { Page } from '@playwright/test';

/**
 * Reusable Playwright helpers to drive the protected fleet screens without a
 * live backend: they seed an authenticated session and mock the REST API with
 * schema-valid fixtures, so the e2e specs stay deterministic and self-contained.
 */

const TIMESTAMP = '2026-01-10T12:00:00.000Z';

const BRAND_ID = '11111111-1111-4111-8111-111111111111';
const MODEL_ID = '22222222-2222-4222-8222-222222222222';
const VEHICLE_ID = '33333333-3333-4333-8333-333333333333';

export const fleetFixtures = {
  brand: {
    id: BRAND_ID,
    name: 'Aivacol',
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
    createdBy: 'aivacol',
  },
  model: {
    id: MODEL_ID,
    name: 'MegaBus Horizon',
    brandId: BRAND_ID,
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
    createdBy: 'aivacol',
  },
  vehicle: {
    id: VEHICLE_ID,
    licensePlate: 'BRA1A23',
    chassis: '9BG116GW04C400001',
    renavam: '12345678901',
    year: 2024,
    modelId: MODEL_ID,
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
    createdBy: 'aivacol',
  },
};

const authUser = {
  id: '44444444-4444-4444-8444-444444444444',
  nickname: 'aivacol',
  name: 'Aivacol Admin',
  email: 'aivacol@fleetcore.local',
  roles: ['admin'],
};

export const authenticate = async (page: Page): Promise<void> => {
  await page.addInitScript((user) => {
    window.localStorage.setItem('fleetcore:token', 'e2e-token');
    window.localStorage.setItem('fleetcore:user', JSON.stringify(user));
  }, authUser);
};

export const mockFleetApi = async (page: Page): Promise<void> => {
  await page.route('**/api/**', async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname.replace(/^\/api/, '');

    if (request.method() === 'GET' && path === '/brands') {
      await route.fulfill({ json: [fleetFixtures.brand] });
      return;
    }

    if (request.method() === 'GET' && path === '/models') {
      await route.fulfill({ json: [fleetFixtures.model] });
      return;
    }

    if (request.method() === 'GET' && path === '/vehicles') {
      await route.fulfill({
        json: {
          items: [fleetFixtures.vehicle],
          total: 1,
          page: 1,
          limit: 3,
        },
      });
      return;
    }

    await route.fulfill({ status: 200, json: {} });
  });
};

export const startFleetSession = async (page: Page): Promise<void> => {
  await authenticate(page);
  await mockFleetApi(page);
};
