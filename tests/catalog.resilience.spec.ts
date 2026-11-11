import * as allure from 'allure-js-commons';
import { test, expect } from '../src/fixtures/test';
import products from '../src/data/products.json';
import {
  EmptyProductListMock,
  ProductListServerErrorMock,
  SlowProductListMock,
} from '../src/mocks/ProductListMocks';

const SLOW_MS = 2500;

test.describe('Catalog resilience: QUERY /products (mocked API)', () => {
  test.beforeEach(async () => {
    await allure.epic('Toolshop');
    await allure.feature('Catalog');
    await allure.parentSuite('Catalog');
    await allure.suite('Catalog resilience');
    await allure.tags('mock', 'resilience');
  });

  test('empty list: front shows the "no products" message', async ({ useMock, homeFlow, homePage }) => {
    await allure.story('Empty list');
    await allure.severity('critical');
    await useMock(new EmptyProductListMock());

    const response = await homeFlow.openCatalogAndGetListResponse();
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data).toEqual([]);
    expect(body.total).toBe(0);

    await expect(homePage.noResults).toBeVisible();
    await expect(homePage.noResults).toHaveText('There are no products found.');
    await expect(homePage.productCards).toHaveCount(0);
    await expect(homePage.skeletonCards).toHaveCount(0);
    await expect(homePage.pagination).toBeHidden();
  });

  test('500: no products and no error message, the loading placeholders never go away', async ({
    page,
    useMock,
    homeFlow,
    homePage,
  }) => {
    await allure.story('Server error');
    await allure.severity('critical');
    await useMock(new ProductListServerErrorMock());

    const response = await homeFlow.openCatalogAndGetListResponse();
    expect(response.status()).toBe(500);
    expect(await response.json()).toEqual({ message: 'Something went wrong' });

    await expect(homePage.productCards).toHaveCount(0);
    // A failure is not an empty result: the front must not claim "no products found".
    await expect(homePage.noResults).toBeHidden();
    await expect(homePage.pagination).toBeHidden();

    // Current front behaviour: it keeps showing the loader forever and gives no error feedback.
    await expect(homePage.skeletonCards.first()).toBeVisible();
    await page.waitForTimeout(1500); // fixed wait on purpose: proving something does NOT change
    await expect(homePage.skeletonCards.first()).toBeVisible();
    await expect(page.getByRole('alert').filter({ hasNotText: /enjoyed testing this app/i })).toHaveCount(0);
  });

  test('slow response: loading placeholders are shown, then replaced by the products', async ({
    useMock,
    homeFlow,
    homePage,
  }) => {
    await allure.story('Slow response');
    await allure.severity('critical');
    await useMock(new SlowProductListMock(SLOW_MS));

    const startedAt = Date.now();
    const responsePromise = homeFlow.openCatalogAndGetListResponse();

    await test.step('while the request is pending', async () => {
      await expect(homePage.skeletonCards.first()).toBeVisible();
      await expect(homePage.productCards).toHaveCount(0);
      await expect(homePage.noResults).toBeHidden(); // loading must not look like "empty"
      await expect(homePage.pagination).toBeHidden();
    });

    await test.step('when the slow response arrives', async () => {
      expect((await responsePromise).status()).toBe(200);
      await expect(homePage.productCards).toHaveCount(products.data.length);
      await expect(homePage.skeletonCards).toHaveCount(0);
      await expect(homePage.noResults).toBeHidden();
      await expect(homePage.pagination).toBeVisible();
      expect(Date.now() - startedAt).toBeGreaterThanOrEqual(SLOW_MS - 50);
    });
  });
});
