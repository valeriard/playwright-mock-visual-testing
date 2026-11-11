import { Page } from '@playwright/test';
import { ApiMock } from './ApiMock';
import { isProductList } from './CatalogMock';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** QUERY /products answering 200 with the given body (a populated list, an empty one, one product...). */
export class ProductListMock implements ApiMock {
  constructor(private readonly datos: object) {}

  async register(page: Page): Promise<void> {
    await page.route(isProductList, (route) => route.fulfill({ json: this.datos }));
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

/** QUERY /products answering the given body, but only after `delayMs`. */
export class SlowProductListMock implements ApiMock {
  constructor(
    private readonly delayMs: number,
    private readonly datos: object,
  ) {}

  async register(page: Page): Promise<void> {
    await page.route(isProductList, async (route) => {
      await wait(this.delayMs);
      await route.fulfill({ json: this.datos });
    });
  }
}
