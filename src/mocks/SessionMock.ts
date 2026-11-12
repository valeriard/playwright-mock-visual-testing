import { Page } from '@playwright/test';
import { ApiMock, API_URL } from './ApiMock';
import { VALID_USER } from '../data/users';

const DEFAULT_PROFILE = {
  id: 'mock-user',
  first_name: 'Jane',
  last_name: 'Doe',
  email: VALID_USER.email,
  role: 'user',
};

/** Mocks GET /users/me: anonymous (401) until a token is sent, then the given profile (a minimal one by default). */
export class SessionMock implements ApiMock {
  constructor(private readonly perfil: object = DEFAULT_PROFILE) {}

  async register(page: Page): Promise<void> {
    await page.route(`${API_URL}/users/me`, async (route) => {
      const auth = route.request().headers()['authorization'];
      if (!auth) {
        await route.fulfill({ status: 401, json: { message: 'Unauthorized' } });
        return;
      }
      await route.fulfill({ json: this.perfil });
    });
  }
}
