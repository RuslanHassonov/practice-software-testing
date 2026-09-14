import { test, expect } from '@playwright/test';
import { ProductListingPage } from './pages/ProductListingPage';
import { buildProductData, isAscending, isDescending } from './helpers/ProductData.ts';

test.describe('Product listing', () => {
	test('filters products by category and brand', async ({ page }) => {
		const listing = new ProductListingPage(page);
		const initialResponse = await listing.goto();

		const category = (initialResponse.data[0].category_id ?? initialResponse.data[0].category?.id)?.toString();
		const categoryResponse = await listing.selectCategory(category!);
		expect(categoryResponse.total).toBeGreaterThan(0);
		expect(listing.lastQuery.by_category).toBe(category);

		const brand = (initialResponse.data[0].brand_id ?? initialResponse.data[0].brand?.id)?.toString();
		const brandResponse = await listing.selectBrand(brand!);
		expect(brandResponse.total).toBeGreaterThan(0);
		expect(listing.lastQuery.by_brand).toBe(brand);
	});

	test.describe('sorting', () => {
		for (const sort of buildProductData().sortDirections) {
			test(`${sort} orders the results`, async ({ page }) => {
				const listing = new ProductListingPage(page);
				await listing.goto();
				await listing.sortBy(sort);

				if (sort.startsWith('name')) {
					const names = (await listing.visibleProductNames()).map((name) => name.trim().toLowerCase());
					  expect(sort.endsWith('asc') ? isAscending(names, (left: string, right: string) => left.localeCompare(right)) : isDescending(names, (left: string, right: string) => left.localeCompare(right))).toBe(true);
				} else {
					const prices = await listing.visibleProductPrices();
					  expect(sort.endsWith('asc') ? isAscending(prices, (left: number, right: number) => left - right) : isDescending(prices, (left: number, right: number) => left - right)).toBe(true);
				}
			});
		}
	});

	test('combines category, brand, and price sorting', async ({ page }) => {
		const listing = new ProductListingPage(page);
		const initialResponse = await listing.goto();
		const category = (initialResponse.data[0].category_id ?? initialResponse.data[0].category?.id)?.toString();
		const brand = (initialResponse.data[0].brand_id ?? initialResponse.data[0].brand?.id)?.toString();

		await listing.selectCategory(category!);
		const response = await listing.selectBrand(brand!);
		await listing.sortBy('price,asc');

		const prices = await listing.visibleProductPrices();
		expect(response.total).toBeGreaterThan(0);
		expect(listing.lastQuery.by_category).toBe(category);
		expect(listing.lastQuery.by_brand).toBe(brand);
		expect(isAscending(prices, (left: number, right: number) => left - right)).toBe(true);
	});

	test('filters products by price range', async ({ page }) => {
		const listing = new ProductListingPage(page);
		const data = buildProductData();
		await listing.goto();
		await listing.setPriceRange(data.priceRangeSteps, data.priceRangeSteps);

		const prices = await listing.visibleProductPrices();
		expect(prices.length).toBeGreaterThan(0);
		expect(Math.max(...prices) - Math.min(...prices)).toBeLessThanOrEqual(100);
	});

	test('handles an invalid category without showing products', async ({ page }) => {
		const listing = new ProductListingPage(page);
		const data = buildProductData();
		await listing.goto();
		const response = await listing.queryProducts({ by_category: data.invalidCategoryId });

		expect(response.total).toBe(0);
	});

	test('reset search clears filters and restores the full listing', async ({ page }) => {
		const listing = new ProductListingPage(page);
		await listing.goto();
		const initialCount = await page.locator(listing.locators.products).count();
		const category = await page.locator(listing.locators.categories).first().getAttribute('value');
		await listing.selectCategory(category!);
		await listing.resetFilters();

		await expect(page.locator(`${listing.locators.categories}:checked`)).toHaveCount(0);
		await expect(page.locator(`${listing.locators.brands}:checked`)).toHaveCount(0);
		expect(await page.locator(listing.locators.products).count()).toBe(initialCount);
	});
});
