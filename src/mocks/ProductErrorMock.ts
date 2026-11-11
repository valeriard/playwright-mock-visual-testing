import { Page } from '@playwright/test';
import { ApiMock, API_URL } from './ApiMock';
import { stubRelatedProducts } from './relatedProducts';

/** GET /products/{id} failing with an arbitrary HTTP error. */
abstract class ProductErrorMock implements ApiMock {
  protected abstract readonly status: number;
  protected abstract readonly message: string;

  constructor(private readonly productId: string) {}

  async register(page: Page): Promise<void> {
    await stubRelatedProducts(page, this.productId);
    await page.route(`${API_URL}/products/${this.productId}`, (route) =>
      route.fulfill({ status: this.status, json: { message: this.message } }),
    );
  }
}

/** Same body the real API returns for an id that does not exist. */
export class ProductNotFoundMock extends ProductErrorMock {
  protected readonly status = 404;
  protected readonly message = 'Requested item not found';
}

export class ProductServerErrorMock extends ProductErrorMock {
  protected readonly status = 500;
  protected readonly message = 'Something went wrong';
}
