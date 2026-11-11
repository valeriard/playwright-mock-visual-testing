import { Page } from '@playwright/test';
import { ApiMock } from './ApiMock';

/** Registers a set of mocks; new endpoints are added by passing a new ApiMock (open/closed). */
export class ApiMocker {
  constructor(private readonly mocks: ApiMock[]) {}

  async apply(page: Page): Promise<void> {
    for (const mock of this.mocks) await mock.register(page);
  }
}
