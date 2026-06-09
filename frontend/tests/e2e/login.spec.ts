import { test, expect } from '@playwright/test';

test.describe('Login page', () => {
  test('exibe formulário de autenticação', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('heading', { name: 'Gestão de Frota com inteligência operacional' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Usuário ou e-mail' })).toBeVisible();
    await expect(page.getByLabel('Senha')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
  });
});
