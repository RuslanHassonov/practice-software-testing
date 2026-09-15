import { Page, Response } from '@playwright/test';

export type ProductResponse = {
	data: Array<{
		name?: string;
		price?: number;
		category_id?: number;
		brand_id?: number;
		category?: { id?: number };
		brand?: { id?: number };
	}>;
	total: number;
};

export class ProductListingPage {
	readonly page: Page;
	private productsUrl = ''; 				// API endpoint for products, captured from the initial response
	lastQuery: Record<string, string> = {}; // Stores the last query parameters sent to the products API

	constructor(page: Page) {
		this.page = page;
	}

	readonly locators = {
		sort: '[data-test="sort"]',
		categories: 'input[name="category_id"]',
		brands: 'input[name="brand_id"]',
		products: '[data-test^="product-"]',
		productNames: '[data-test="product-name"]',
		productPrices: '[data-test="product-price"]',
		noResults: '[data-test="no-results"]',
		resetSearch: '[data-test="search-reset"]',
		minPriceHandle: '.ngx-slider-pointer-min',
		maxPriceHandle: '.ngx-slider-pointer-max'
	};

	async goto() {
		const responsePromise = this.productResponsePromise();
		await this.page.goto('');
		const response = await responsePromise;
		this.productsUrl = response.url();
		await this.waitForProductsToLoad();
		return response.json() as Promise<ProductResponse>;
	}

	// Wait for meaningful page state - either products, or 'no results' message 
	// Cannot use fixed timemout, because app may load faster or slower
	async waitForProductsToLoad() {
		await this.page.locator(`${this.locators.products}, ${this.locators.noResults}`).first().waitFor();
	}

	async selectCategory(categoryId: string) {
		return this.selectCheckbox(`${this.locators.categories}[value="${categoryId}"]`);
	}

	async selectBrand(brandId: string) {
		return this.selectCheckbox(`${this.locators.brands}[value="${brandId}"]`);
	}

	async selectCheckbox(selector: string): Promise<ProductResponse> {
		const responsePromise = this.productResponsePromise();
		await this.page.locator(selector).check();
		return this.responseBody(await responsePromise);
	}

	async sortBy(value: 'name,asc' | 'name,desc' | 'price,asc' | 'price,desc'): Promise<ProductResponse> {
		const responsePromise = this.productResponsePromise();
		await this.page.locator(this.locators.sort).selectOption(value);
		return this.responseBody(await responsePromise);
	}

	async setPriceRange(minSteps: number, maxSteps: number): Promise<ProductResponse> {
		const responsePromise = this.productResponsePromise();
		for (let index = 0; index < minSteps; index += 1) {
			await this.page.locator(this.locators.minPriceHandle).press('ArrowRight');
		}
		for (let index = 0; index < maxSteps; index += 1) {
			await this.page.locator(this.locators.maxPriceHandle).press('ArrowLeft');
		}
		return this.responseBody(await responsePromise);
	}

	async resetFilters(): Promise<ProductResponse> {
		const responsePromise = this.productResponsePromise();
		await this.page.locator(this.locators.resetSearch).click();
		return this.responseBody(await responsePromise);
	}
	
	// Sends a QUERY request to the products API with the specified criteria and returns the parsed JSON response
	async queryProducts(criteria: Record<string, string>) {
		const response = await this.page.request.fetch(this.productsUrl, {
			method: 'QUERY',
			data: { page: '1', ...criteria }
		});
		return response.json() as Promise<ProductResponse>;
	}

	// Returns an array of product names currently visible on the page, trimmed and lowercased
	async visibleProductNames() {
		return this.page.locator(this.locators.productNames).allTextContents();
	}

	// Returns an array of product prices currently visible on the page, parsed as numbers
	async visibleProductPrices() {
		const prices = await this.page.locator(this.locators.productPrices).allTextContents();
		return prices.map((price) => Number.parseFloat(price.replace('$', '').trim()));
	}

	// Waits for the next product API response and captures the query parameters sent to the API
	private productResponsePromise() {
		return this.page.waitForResponse((response: Response) => {
			if (response.request().method() === 'QUERY' && response.url().includes('/products')) {
				this.lastQuery = response.request().postDataJSON() as Record<string, string>;
				return true;
			}
			return false;
		});
	}

	// Waits for the next product API response, UI to load the products, and returns the parsed JSON body
	private async responseBody(response: Response) {
		await this.waitForProductsToLoad();
		return response.json() as Promise<ProductResponse>;
	}
}
