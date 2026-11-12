import { Page } from '@playwright/test';
import { ApiMock, API_URL } from './ApiMock';

/** GET /postcode-lookup?country=&postcode=&house_number=: the billing step asks for it when it opens. */
export class PostcodeLookupMock implements ApiMock {
  constructor(private readonly direccion: object) {}

  async register(page: Page): Promise<void> {
    await page.route(
      (url) => url.origin === API_URL && url.pathname === '/postcode-lookup',
      (route) => route.fulfill({ json: this.direccion }),
    );
  }
}

/** What «Add to cart» does: POST /carts creates the cart, POST /carts/{id} adds the item. */
export class AddToCartMock implements ApiMock {
  constructor(private readonly cartId: string) {}

  async register(page: Page): Promise<void> {
    await page.route(`${API_URL}/carts`, (route) => route.fulfill({ status: 201, json: { id: this.cartId } }));
    await page.route(`${API_URL}/carts/${this.cartId}`, async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ json: { result: 'item added or updated' } });
      } else {
        await route.fallback(); // GET: the CartMock answers
      }
    });
  }
}
