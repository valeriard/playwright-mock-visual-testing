import { Page } from '@playwright/test';
import { ApiMock, API_URL } from './ApiMock';

/** GET /products/{id}/related answering 200 with the given products. */
export class RelatedProductsMock implements ApiMock {
  constructor(
    private readonly productId: string,
    private readonly items: unknown[],
  ) {}

  async register(page: Page): Promise<void> {
    await page.route(`${API_URL}/products/${this.productId}/related`, (route) =>
      route.fulfill({ json: this.items }),
    );
  }
}

/**
 * GET /products/{id}/related failing with a 500 while the main detail endpoint is untouched.
 * Register it AFTER the detail mock: later routes take precedence over the empty related stub.
 */
export class RelatedProductsServerErrorMock implements ApiMock {
  constructor(private readonly productId: string) {}

  async register(page: Page): Promise<void> {
    await page.route(`${API_URL}/products/${this.productId}/related`, (route) =>
      route.fulfill({ status: 500, json: { message: 'Something went wrong' } }),
    );
  }
}
