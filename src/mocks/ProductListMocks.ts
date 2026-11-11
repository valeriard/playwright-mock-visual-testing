import { Page } from '@playwright/test';
import { ApiMock } from './ApiMock';
import { isProductList } from './CatalogMock';
import products from '../data/products.json';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** QUERY /products answering 200 with no products (what the API sends when filters match nothing). */
export class EmptyProductListMock implements ApiMock {
  async register(page: Page): Promise<void> {
    await page.route(isProductList, (route) =>
      route.fulfill({
        json: { current_page: 1, data: [], from: null, last_page: 1, per_page: 9, to: null, total: 0 },
      }),
    );
  }
}

/** QUERY /products failing with a 500. */
export class ProductListServerErrorMock implements ApiMock {
  async register(page: Page): Promise<void> {
    await page.route(isProductList, (route) =>
      route.fulfill({ status: 500, json: { message: 'Something went wrong' } }),
    );
  }
}

/** QUERY /products answering the normal catalog, but only after `delayMs`. */
export class SlowProductListMock implements ApiMock {
  constructor(private readonly delayMs: number) {}

  async register(page: Page): Promise<void> {
    await page.route(isProductList, async (route) => {
      await wait(this.delayMs);
      await route.fulfill({ json: products });
    });
  }
}
