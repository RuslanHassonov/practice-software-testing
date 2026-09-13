// @ts-check
import { test, expect } from '@playwright/test';
import { RegisterPage } from './pages/RegisterPage';
import { buildUserData } from './helpers/data';

test('should display customer registration header', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  await registerPage.goto();

  // Expect page "to contain" customer registration header.
  await expect(page.getByRole('heading', { name: 'Customer registration' })).toBeVisible();
});

test.describe('Valid Registration', () => {
  test('should register new user', async ({ page }) => {
    const data = buildUserData();
    const registerPage = new RegisterPage(page);

    await registerPage.goto();

    await registerPage.registerUser(
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

    // Should navigate to login page after successful registration
    await expect(page).toHaveTitle(/Login - Practice Software Testing - Toolshop - v5.0/);
  });
});

test.describe('Invalid Registration', () => {
  let register: RegisterPage;

  test.beforeEach(async ({ page }) => {
    register = new RegisterPage(page);
    await page.goto('http://localhost:4200/auth/register');
  });

  test('should not register user under 18 years old', async () => {
    const data = buildUserData({ dob: '2025-01-01' }); // User under 18 years old

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

    // Expect an error message indicating the user is underage
    await register.verifyErrorMessage('[data-test="register-error"]', /Customer must be 18 years old\./);
  });

  test('should not register user over 75 years old', async () => {
    const data = buildUserData({ dob: '1901-01-01' }); // User over 75 years old

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

    // Expect an error message indicating the user is over 75 years old
    await register.verifyErrorMessage('[data-test="register-error"]', /Customer must be younger than 75 years old\./);
  });

  test('should invalidate incorrect date of birth format', async () => {
    const data = buildUserData({ dob: '01-01-1990' }); // Incorrect date format (should be YYYY-MM-DD)

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

    // Expect an error message indicating invalid date format
    await register.verifyErrorMessage('[data-test="dob-error"]', /Please enter a valid date in YYYY-MM-DD format\./);
  });

  test('should invalidate empty required fields', async () => {
    const data = buildUserData({ firstName: '', lastName: '', phone: '' }); // Empty fields

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

    // Expect messages indicating required fields
    await register.verifyErrorMessage('[data-test="first-name-error"]', /First name is required/);
    await register.verifyErrorMessage('[data-test="last-name-error"]', /Last name is required/);
    await register.verifyErrorMessage('[data-test="phone-error"]', /Phone is required\./);
  });

  test('should invalidate first name if longer than 40 characters', async () => {
    const data = buildUserData({ firstName: 'A'.repeat(41) }); // First name longer than 40 characters

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

    // Expect messages indicating required fields
    await register.verifyErrorMessage('[data-test="register-error"]', /The first name field must not be greater than 40 characters./);
  });

  test('should invalidate last name if longer than 20 characters', async () => {
    const data = buildUserData({ lastName: 'A'.repeat(21) }); // Last name longer than 20 characters

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

    // Expect messages indicating required fields
    await register.verifyErrorMessage('[data-test="register-error"]', /The last name field must not be greater than 20 characters./);
  });

  // Similar tests can be performed for phone, email, and other fields to ensure they meet maximum length requirements.

  test('should invalidate incorrect email format', async () => {
    const data = buildUserData({ email: 'invalid-email' }); // Invalid email format

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

    // Expect message indicating email format is invalid
    await register.verifyErrorMessage('[data-test="email-error"]', /Email format is invalid/);
  });

  test('should invalidate email if it already exists', async () => {
    const data = buildUserData({ email: 'customer@practicesoftwaretesting.com' }); // Email that already exists

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

    // Expect message indicating a customer with this email address already exists
    await register.verifyErrorMessage('[data-test="email-error"]', /A customer with this email address already exists./);
  });

  test('should invalidate incorrect phone format', async () => {
    const data = buildUserData({ phone: '123-123123123' }); // Invalid phone format, contains dashes

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

    // Expect message indicating phone format is invalid
    await register.verifyErrorMessage('[data-test="phone-error"]', /Only numbers are allowed./);
  });
});
