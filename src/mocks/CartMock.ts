import { Page } from '@playwright/test';
import { ApiMock, API_URL } from './ApiMock';

/** GET /carts/{id} answering the given cart (the page keeps the id in sessionStorage as `cart_id`). */
export class CartMock implements ApiMock {
  constructor(private readonly carrito: { id: string }) {}

  async register(page: Page): Promise<void> {
    await page.route(`${API_URL}/carts/${this.carrito.id}`, (route) => route.fulfill({ json: this.carrito }));
  }
}
