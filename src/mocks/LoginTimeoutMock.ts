import { Page } from '@playwright/test';
import { ApiMock, API_URL } from './ApiMock';

export interface LoginTimeoutMockOptions {
  /** How long the request hangs before the connection times out, in ms. */
  afterMs?: number;
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Mocks POST /users/login never answering: the request hangs, then fails with a network timeout. */
export class LoginTimeoutMock implements ApiMock {
  constructor(private readonly options: LoginTimeoutMockOptions = {}) {}

  async register(page: Page): Promise<void> {
    await page.route(`${API_URL}/users/login`, async (route) => {
      if (this.options.afterMs) await wait(this.options.afterMs);
      await route.abort('timedout');
    });
  }
}
