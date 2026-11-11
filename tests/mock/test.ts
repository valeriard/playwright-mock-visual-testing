import { test as base, expect } from '../../src/fixtures/pages';
import { ApiMock } from '../../src/mocks/ApiMock';
import { ApiMocker } from '../../src/mocks/ApiMocker';
import { CatalogMock } from '../../src/mocks/CatalogMock';
import { LoginMock } from '../../src/mocks/LoginMock';
import { SessionMock } from '../../src/mocks/SessionMock';
import { crearCategorias, crearMarcas, crearProductos } from './factories';

interface MockFixtures {
  /** Auto fixture: every test runs against the mocked API. */
  apiMocks: void;
  /** Registers an extra mock for one test; it overrides the default mock for the same endpoint. */
  useMock: (mock: ApiMock) => Promise<void>;
}

/** Pages and flows (src/fixtures/pages) plus the mocked API with its default data. Mock tests only. */
export const test = base.extend<MockFixtures>({
  apiMocks: [
    async ({ page }, use) => {
      const defaults = new ApiMocker([
        new CatalogMock({
          productos: crearProductos(),
          marcas: crearMarcas(),
          categorias: crearCategorias(),
        }),
        new SessionMock(),
        new LoginMock(),
      ]);
      await defaults.apply(page);
      await use();
    },
    { auto: true },
  ],
  useMock: async ({ page, apiMocks }, use) => {
    void apiMocks; // ensure defaults are registered first; later routes take precedence
    await use((mock) => mock.register(page));
  },
});

export { expect };
