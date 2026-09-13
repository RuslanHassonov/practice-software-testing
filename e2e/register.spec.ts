// @ts-check
import { test, expect } from '@playwright/test';
import { RegisterPage } from './pages/RegisterPage';

test('should display customer registration header', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  await registerPage.goto();

  // Expect page "to contain" customer registration header.
  await expect(page.getByRole('heading', { name: 'Customer registration' })).toBeVisible();
});

test.describe('Valid Registration', () => {
  
});

test.describe('Invalid Registration', () => {

});