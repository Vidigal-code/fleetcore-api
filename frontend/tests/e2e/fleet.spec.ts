import { test, expect } from '@playwright/test';

import { fleetFixtures, startFleetSession } from './support/fleet';

test.describe('Fleet management (authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    await startFleetSession(page);
  });

  test('lists registered vehicles and shows the register form', async ({
    page,
  }) => {
    await page.goto('/vehicles');

    await expect(
      page.getByRole('heading', { name: 'Registrar novo veículo' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Veículos cadastrados' }),
    ).toBeVisible();
    await expect(
      page.getByText(fleetFixtures.vehicle.licensePlate).first(),
    ).toBeVisible();
  });

  test('lists brands', async ({ page }) => {
    await page.goto('/brands');

    await expect(
      page.getByRole('heading', { name: 'Marcas', exact: true }),
    ).toBeVisible();
    await expect(page.getByText(fleetFixtures.brand.name).first()).toBeVisible();
  });

  test('lists models', async ({ page }) => {
    await page.goto('/models');

    await expect(
      page.getByRole('heading', { name: 'Modelos', exact: true }),
    ).toBeVisible();
    await expect(page.getByText(fleetFixtures.model.name).first()).toBeVisible();
  });
});
