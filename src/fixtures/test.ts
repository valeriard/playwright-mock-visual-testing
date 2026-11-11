import { test as base, expect } from '@playwright/test';
import { ApiMock } from '../mocks/ApiMock';
import { ApiMocker } from '../mocks/ApiMocker';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { AccountPage } from '../pages/AccountPage';
import { LoginFlow } from '../flows/LoginFlow';
import { HomeFlow } from '../flows/HomeFlow';
import { ProductPage } from '../pages/ProductPage';
import { ProductFlow } from '../flows/ProductFlow';

interface Fixtures {
  homePage: HomePage;
  loginPage: LoginPage;
  accountPage: AccountPage;
  loginFlow: LoginFlow;
  homeFlow: HomeFlow;
  productPage: ProductPage;
  productFlow: ProductFlow;
  /** Auto fixture: every test runs against the mocked API. */
  apiMocks: void;
  /** Registers an extra mock for one test; it overrides the default mock for the same endpoint. */
  useMock: (mock: ApiMock) => Promise<void>;
}

export const test = base.extend<Fixtures>({
  apiMocks: [
    async ({ page }, use) => {
      await ApiMocker.default().apply(page);
      await use();
    },
    { auto: true },
  ],
  useMock: async ({ page, apiMocks }, use) => {
    void apiMocks; // ensure defaults are registered first; later routes take precedence
    await use((mock) => mock.register(page));
  },
  homePage: async ({ page }, use) => use(new HomePage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  accountPage: async ({ page }, use) => use(new AccountPage(page)),
  loginFlow: async ({ homePage, loginPage }, use) => use(new LoginFlow(homePage, loginPage)),
  homeFlow: async ({ homePage }, use) => use(new HomeFlow(homePage)),
  productPage: async ({ page }, use) => use(new ProductPage(page)),
  productFlow: async ({ productPage }, use) => use(new ProductFlow(productPage)),
});

export { expect };
