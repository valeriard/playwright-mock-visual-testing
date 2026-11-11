import { Page } from '@playwright/test';
import { ApiMock, API_URL } from './ApiMock';
import { stubRelatedProducts } from './relatedProducts';

/**
 * GET /products/{id} answering 200 with the given product (stock is just a field of the body),
 * plus GET /products/{id}/related answering the given related products (none by default).
 */
export class ProductDetailMock implements ApiMock {
  constructor(
    private readonly detalle: { id: string },
    private readonly relacionados: object[] = [],
  ) {}

  async register(page: Page): Promise<void> {
    await stubRelatedProducts(page, this.detalle.id, this.relacionados);
    await page.route(`${API_URL}/products/${this.detalle.id}`, (route) => route.fulfill({ json: this.detalle }));
  }
}
