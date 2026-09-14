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
	private productsUrl = '';
	lastQuery: Record<string, string> = {};

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
		// Wait for the initial product response before navigating to the page
		const responsePromise = this.productResponse();
		await this.page.goto('/');
		const response = await responsePromise;
		this.productsUrl = response.url();
		await this.waitForProducts();
		return response.json() as Promise<ProductResponse>;
	}

	async waitForProducts() {
		await this.page.locator(`${this.locators.products}, ${this.locators.noResults}`).first().waitFor();
	}

	async selectCategory(categoryId: string) {
		return this.selectCheckbox(`${this.locators.categories}[value="${categoryId}"]`);
	}

	async selectBrand(brandId: string) {
		return this.selectCheckbox(`${this.locators.brands}[value="${brandId}"]`);
	}

	async selectCheckbox(selector: string): Promise<ProductResponse> {
		const responsePromise = this.productResponse();
		await this.page.locator(selector).check();
		return this.responseBody(await responsePromise);
	}

	async sortBy(value: 'name,asc' | 'name,desc' | 'price,asc' | 'price,desc'): Promise<ProductResponse> {
		const responsePromise = this.productResponse();
		await this.page.locator(this.locators.sort).selectOption(value);
		return this.responseBody(await responsePromise);
	}

	async setPriceRange(minSteps: number, maxSteps: number): Promise<ProductResponse> {
		const responsePromise = this.productResponse();
		for (let index = 0; index < minSteps; index += 1) {
			await this.page.locator(this.locators.minPriceHandle).press('ArrowRight');
		}
		for (let index = 0; index < maxSteps; index += 1) {
			await this.page.locator(this.locators.maxPriceHandle).press('ArrowLeft');
		}
		return this.responseBody(await responsePromise);
	}

	async resetFilters(): Promise<ProductResponse> {
		const responsePromise = this.productResponse();
		await this.page.locator(this.locators.resetSearch).click();
		return this.responseBody(await responsePromise);
	}

	async queryProducts(criteria: Record<string, string>) {
		const response = await this.page.request.fetch(this.productsUrl, {
			method: 'QUERY',
			data: { page: '1', ...criteria }
		});
		return response.json() as Promise<ProductResponse>;
	}

	async visibleProductNames() {
		return this.page.locator(this.locators.productNames).allTextContents();
	}

	async visibleProductPrices() {
		const prices = await this.page.locator(this.locators.productPrices).allTextContents();
		return prices.map((price) => Number.parseFloat(price.replace('$', '').trim()));
	}

	private productResponse() {
		return this.page.waitForResponse((response: Response) => {
			if (response.request().method() === 'QUERY' && response.url().includes('/products')) {
				this.lastQuery = response.request().postDataJSON() as Record<string, string>;
				return true;
			}
			return false;
		});
	}

	private async responseBody(response: Response) {
		await this.waitForProducts();
		return response.json() as Promise<ProductResponse>;
	}
}
