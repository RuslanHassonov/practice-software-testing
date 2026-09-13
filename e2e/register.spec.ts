// @ts-check
import { test, expect } from '@playwright/test';
import { RegisterPage } from './pages/RegisterPage';
import { buildUser } from './helpers/data';

test('should display customer registration header', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  await registerPage.goto();

  // Expect page "to contain" customer registration header.
  await expect(page.getByRole('heading', { name: 'Customer registration' })).toBeVisible();
});

test.describe('Valid Registration', () => {
  test('should register new user', async ({ page }) => {
    const data = buildUser();
    const register = new RegisterPage(page);

    await register.goto();

    await register.registerUser(
      data.firstName,
      data.lastName,
      data.dob,
      data.country,
      data.postalCode,
      data.houseNumber,
      data.street,
      data.city,
      data.state,
      data.phone,
      data.email,
      data.password
    );
    
    // Should navigate user to login page after successful registration
    await expect(page).toHaveTitle(/Login - Practice Software Testing - Toolshop - v5.0/);
  });
});

test.describe('Invalid Registration', () => {

});