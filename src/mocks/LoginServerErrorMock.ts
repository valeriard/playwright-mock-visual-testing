import { Page } from '@playwright/test';
import { ApiMock, API_URL } from './ApiMock';

/** Mocks POST /users/login failing with a 500 (the real API does this when it is unhealthy). */
export class LoginServerErrorMock implements ApiMock {
  async register(page: Page): Promise<void> {
    await page.route(`${API_URL}/users/login`, (route) =>
      route.fulfill({ status: 500, json: { message: 'Something went wrong' } }),
    );
  }
}
