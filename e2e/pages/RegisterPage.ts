import { Page, expect } from '@playwright/test';
import type { User } from '../helpers/data';

export class RegisterPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto('http://localhost:4200/auth/register');
    }

    async registerUser(data: User) {
        await this.page.locator('[data-test="first-name"]').fill(data.firstName);
        await this.page.locator('[data-test="last-name"]').fill(data.lastName);
        await this.page.locator('[data-test="dob"]').fill(data.dob);
        await this.page.locator('[data-test="country"]').selectOption(data.country);
        await this.page.locator('[data-test="postal_code"]').fill(data.postalCode);
        await this.page.locator('[data-test="house_number"]').fill(data.houseNumber);
        await this.page.locator('[data-test="street"]').fill(data.street);
        await this.page.locator('[data-test="city"]').fill(data.city);
        await this.page.locator('[data-test="state"]').fill(data.state);
        await this.page.locator('[data-test="phone"]').fill(data.phone);
        await this.page.locator('[data-test="email"]').fill(data.email);
        await this.page.locator('[data-test="password"]').fill(data.password);

        await this.page.click('[data-test="register-submit"]');
    }

    async verifyErrorMessage(locator: string, message: RegExp) {
        await expect(this.page.locator(locator)).toBeVisible();
        await expect(this.page.locator(locator)).toContainText(message);
    }
}
