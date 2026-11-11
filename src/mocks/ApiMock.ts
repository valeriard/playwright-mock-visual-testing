import { Page } from '@playwright/test';

/** Abstraction every API mock implements (DIP: tests depend on this, not on concrete mocks). */
export interface ApiMock {
  register(page: Page): Promise<void>;
}

export const API_URL = 'https://api.practicesoftwaretesting.com';
