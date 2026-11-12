import { Page } from '@playwright/test';
import { ApiMock, API_URL } from './ApiMock';

/** The invoices and messages endpoints take a query string (?page=1), so match on the path only. */
const isApi = (pathname: string) => (url: URL) => url.origin === API_URL && url.pathname === pathname;

/** GET /favorites answering the given list (the page asks for it only when signed in). */
export class FavoritesMock implements ApiMock {
  constructor(private readonly favoritos: object[]) {}

  async register(page: Page): Promise<void> {
    await page.route(isApi('/favorites'), (route) => route.fulfill({ json: this.favoritos }));
  }
}

/** GET /invoices answering the given page of invoices. */
export class InvoicesMock implements ApiMock {
  constructor(private readonly facturas: object) {}

  async register(page: Page): Promise<void> {
    await page.route(isApi('/invoices'), (route) => route.fulfill({ json: this.facturas }));
  }
}

/** GET /messages answering the given page of messages. */
export class MessagesMock implements ApiMock {
  constructor(private readonly mensajes: object) {}

  async register(page: Page): Promise<void> {
    await page.route(isApi('/messages'), (route) => route.fulfill({ json: this.mensajes }));
  }
}

/** POST /totp/setup: the profile page asks for it on load and the demo account is refused (403). */
export class TotpSetupDeniedMock implements ApiMock {
  async register(page: Page): Promise<void> {
    await page.route(isApi('/totp/setup'), (route) =>
      route.fulfill({ status: 403, json: { error: 'TOTP cannot be set up for this account' } }),
    );
  }
}
