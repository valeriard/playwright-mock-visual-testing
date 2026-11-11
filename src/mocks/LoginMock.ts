import { Page } from '@playwright/test';
import { ApiMock, API_URL } from './ApiMock';
import { fakeJwt } from './fakeJwt';
import { Credentials, VALID_USER } from '../data/users';

export interface LoginMockOptions {
  /** Simulated server latency before answering, in ms. */
  delayMs?: number;
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Mocks POST /users/login: 200 for the accepted user, 401 for anything else. */
export class LoginMock implements ApiMock {
  constructor(
    private readonly accepted: Credentials = VALID_USER,
    private readonly options: LoginMockOptions = {},
  ) {}

  async register(page: Page): Promise<void> {
    await page.route(`${API_URL}/users/login`, async (route) => {
      if (this.options.delayMs) await wait(this.options.delayMs);
      const body = route.request().postDataJSON() as Credentials;
      const ok = body.email === this.accepted.email && body.password === this.accepted.password;
      if (ok) {
        await route.fulfill({
          status: 200,
          json: { access_token: fakeJwt(), token_type: 'bearer', expires_in: 300 },
        });
      } else {
        await route.fulfill({ status: 401, json: { error: 'Unauthorized' } });
      }
    });
  }
}
