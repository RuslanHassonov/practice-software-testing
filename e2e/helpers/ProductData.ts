export type ProductSort = 'name,asc' | 'name,desc' | 'price,asc' | 'price,desc';

export interface ProductData {
    invalidCategoryId: string;
    priceRangeSteps: number;
    sortDirections: ProductSort[];
}

export function buildProductData(overrides: Partial<ProductData> = {}): ProductData {
    return {
        invalidCategoryId: '999999999',
        priceRangeSteps: 5,
        sortDirections: ['name,asc', 'name,desc', 'price,asc', 'price,desc'],
        ...overrides
    };
}

export function isAscending<T>(values: T[], compare: (left: T, right: T) => number) {
    return values.every((value, index) => index === 0 || compare(values[index - 1], value) <= 0);
}

export function isDescending<T>(values: T[], compare: (left: T, right: T) => number) {
    return values.every((value, index) => index === 0 || compare(values[index - 1], value) >= 0);
}