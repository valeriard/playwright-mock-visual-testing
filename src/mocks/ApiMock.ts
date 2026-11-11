import { Page } from '@playwright/test';

export { API_URL } from '../data/realApi';

/** Abstraction every API mock implements (DIP: tests depend on this, not on concrete mocks). */
export interface ApiMock {
  register(page: Page): Promise<void>;
}
