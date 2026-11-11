import { Page } from '@playwright/test';
import { ApiMock } from './ApiMock';
import { CatalogMock } from './CatalogMock';
import { LoginMock } from './LoginMock';
import { SessionMock } from './SessionMock';

/** Registers a set of mocks; new endpoints are added by passing a new ApiMock (open/closed). */
export class ApiMocker {
  constructor(private readonly mocks: ApiMock[]) {}

  static default(): ApiMocker {
    return new ApiMocker([new CatalogMock(), new SessionMock(), new LoginMock()]);
  }

  async apply(page: Page): Promise<void> {
    for (const mock of this.mocks) await mock.register(page);
  }
}
