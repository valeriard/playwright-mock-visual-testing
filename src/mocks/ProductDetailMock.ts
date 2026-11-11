import { Page } from '@playwright/test';
import { ApiMock, API_URL } from './ApiMock';
import { stubRelatedProducts } from './relatedProducts';

export interface ProductDetail {
  id: string;
  in_stock: boolean;
  [key: string]: unknown;
}

/** GET /products/{id} answering 200 with the given product (in stock or not: stock is just a field). */
export class ProductDetailMock implements ApiMock {
  constructor(private readonly product: ProductDetail) {}

  async register(page: Page): Promise<void> {
    await stubRelatedProducts(page, this.product.id);
    await page.route(`${API_URL}/products/${this.product.id}`, (route) => route.fulfill({ json: this.product }));
  }
}
