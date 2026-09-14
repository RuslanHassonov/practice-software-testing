import { Page, expect } from '@playwright/test';
import type { User } from '../helpers/data';

export class RegisterPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto('/auth/register');
    }

    readonly locators = {
        firstName: '[data-test="first-name"]',
        lastName: '[data-test="last-name"]',
        dob: '[data-test="dob"]',
        country: '[data-test="country"]',
        postalCode: '[data-test="postal_code"]',
        houseNumber: '[data-test="house_number"]',
        street: '[data-test="street"]',
        city: '[data-test="city"]',
        state: '[data-test="state"]',
        phone: '[data-test="phone"]',
        email: '[data-test="email"]',
        password: '[data-test="password"]'
    };

    readonly errorLocators = {
        firstNameError: '[data-test="first-name-error"]',
        lastNameError: '[data-test="last-name-error"]',
        dobError: '[data-test="dob-error"]',
        countryError: '[data-test="country-error"]',
        postalCodeError: '[data-test="postal_code-error"]',
        houseNumberError: '[data-test="house_number-error"]',
        streetError: '[data-test="street-error"]',
        cityError: '[data-test="city-error"]',
        stateError: '[data-test="state-error"]',
        phoneError: '[data-test="phone-error"]',
        emailError: '[data-test="email-error"]',
        passwordError: '[data-test="password-error"]',
        registerError: '[data-test="register-error"]'
    };

    async registerUser(data: User) {
        await this.page.locator(this.locators.firstName).fill(data.firstName);
        await this.page.locator(this.locators.lastName).fill(data.lastName);
        await this.page.locator(this.locators.dob).fill(data.dob);
        await this.page.locator(this.locators.country).selectOption(data.country);
        await this.page.locator(this.locators.postalCode).fill(data.postalCode);
        await this.page.locator(this.locators.houseNumber).fill(data.houseNumber);
        await this.page.locator(this.locators.street).fill(data.street);
        await this.page.locator(this.locators.city).fill(data.city);
        await this.page.locator(this.locators.state).fill(data.state);
        await this.page.locator(this.locators.phone).fill(data.phone);
        await this.page.locator(this.locators.email).fill(data.email);
        await this.page.locator(this.locators.password).fill(data.password);

        await this.page.click('[data-test="register-submit"]');
    }

    async verifyErrorMessage(locator: string, message: RegExp) {
        await expect(this.page.locator(locator)).toBeVisible();
        await expect(this.page.locator(locator)).toContainText(message);
    }
}
