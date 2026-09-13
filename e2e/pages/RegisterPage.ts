import { Page, expect } from '@playwright/test';

export class RegisterPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto('http://localhost:4200/auth/register');
    }

    async registerUser(
        firstName: string,
        lastName: string,
        dob: string,
        country: string,
        postalCode: string,
        houseNumber: string,
        street: string,
        city: string,
        state: string,
        phone: string,
        email: string,
        password: string
    ) {
        await this.page.locator('[data-test="first-name"]').fill(firstName);
        await this.page.locator('[data-test="last-name"]').fill(lastName);
        await this.page.locator('[data-test="dob"]').fill(dob);
        await this.page.locator('[data-test="country"]').selectOption(country);
        await this.page.locator('[data-test="postal_code"]').fill(postalCode);
        await this.page.locator('[data-test="house_number"]').fill(houseNumber);
        await this.page.locator('[data-test="street"]').fill(street);
        await this.page.locator('[data-test="city"]').fill(city);
        await this.page.locator('[data-test="state"]').fill(state);
        await this.page.locator('[data-test="phone"]').fill(phone);
        await this.page.locator('[data-test="email"]').fill(email);
        await this.page.locator('[data-test="password"]').fill(password);

        await this.page.click('[data-test="register-submit"]');
    }

    async verifyErrorMessage(locator: string, message: RegExp) {
        await expect(this.page.locator(locator)).toBeVisible();
        await expect(this.page.locator(locator)).toContainText(message);
    }
}
