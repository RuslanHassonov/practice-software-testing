import { expect, Page } from '@playwright/test';

export class RegisterPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    private readonly selectors = {
        customerRegistrationHeader: 'h1:has-text("Customer registration")',
    };
    
    async goto() {
        await this.page.goto('http://localhost:4200/auth/register');
    }
}