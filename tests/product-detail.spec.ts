import * as allure from 'allure-js-commons';
import { test, expect } from '../src/fixtures/test';
import inStock from '../src/data/product-in-stock.json';
import outOfStock from '../src/data/product-out-of-stock.json';
import products from '../src/data/products.json';
import { ProductDetailMock } from '../src/mocks/ProductDetailMock';
import { RelatedProductsMock, RelatedProductsServerErrorMock } from '../src/mocks/RelatedProductsMocks';
import { ProductNotFoundMock, ProductServerErrorMock } from '../src/mocks/ProductErrorMock';

const MISSING_ID = '01ZZZZZZZZZZZZZZZZZZZZZZZZ';

test.describe('Product detail (mocked API)', () => {
  test.beforeEach(async () => {
    await allure.epic('Toolshop');
    await allure.feature('Catalog');
    await allure.parentSuite('Catalog');
    await allure.suite('Product detail');
    await allure.tags('mock');
  });

  test('in stock: product is shown and can be added to the cart', async ({ useMock, productFlow, productPage }) => {
    await allure.story('Stock availability');
    await allure.severity('critical');
    await useMock(new ProductDetailMock(inStock));

    const response = await productFlow.openProduct(inStock.id);
    expect(response.status()).toBe(200);
    expect((await response.json()).in_stock).toBe(true);

    await expect(productPage.name).toHaveText(inStock.name);
    await expect(productPage.unitPrice).toHaveText(String(inStock.price));
    await expect(productPage.outOfStock).toBeHidden();
    await expect(productPage.addToCart).toBeEnabled();
  });

  test('out of stock: API answers 200 with in_stock=false, front blocks the purchase', async ({
    useMock,
    productFlow,
    productPage,
  }) => {
    await allure.story('Stock availability');
    await allure.severity('critical');
    await useMock(new ProductDetailMock(outOfStock));

    const response = await productFlow.openProduct(outOfStock.id);
    // Out of stock is NOT an error for the API: 200 + a flag in the body.
    expect(response.status()).toBe(200);
    expect((await response.json()).in_stock).toBe(false);

    await expect(productPage.name).toHaveText(outOfStock.name);
    await expect(productPage.unitPrice).toHaveText(String(outOfStock.price));
    await expect(productPage.outOfStock).toBeVisible();
    await expect(productPage.outOfStock).toHaveText('Out of stock');
    await expect(productPage.addToCart).toBeDisabled();
  });

  test('404 product does not exist: nothing is rendered and purchase is impossible', async ({
    page,
    useMock,
    productFlow,
    productPage,
  }) => {
    await allure.story('Product not found');
    await allure.severity('critical');
    await useMock(new ProductNotFoundMock(MISSING_ID));

    const response = await productFlow.openProduct(MISSING_ID);
    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({ message: 'Requested item not found' });

    await expect(page).toHaveURL(new RegExp(`/product/${MISSING_ID}$`));
    await expect(productPage.name).toBeHidden();
    await expect(productPage.unitPrice).toBeHidden();
    await expect(productPage.addToCart).toBeHidden();
    // Current front behaviour: the page is simply empty, with no error alert.
    await expect(productPage.alerts).toHaveCount(0);
  });

  test('related products OK: they are listed under the product (control for the 500 case)', async ({
    useMock,
    productFlow,
    productPage,
  }) => {
    await allure.story('Related products');
    await allure.severity('normal');
    const items = products.data.slice(0, 3);
    await useMock(new ProductDetailMock(inStock));
    await useMock(new RelatedProductsMock(inStock.id, items));

    const { related } = await productFlow.openProductWithRelated(inStock.id);
    expect(related.status()).toBe(200);

    await expect(productPage.relatedHeading).toBeVisible();
    await expect(productPage.relatedCards).toHaveCount(items.length);
  });

  test('related 500: main detail still renders, related section is empty and nothing breaks', async ({
    useMock,
    productFlow,
    productPage,
  }) => {
    await allure.story('Related products');
    await allure.severity('critical');
    await useMock(new ProductDetailMock(inStock));
    await useMock(new RelatedProductsServerErrorMock(inStock.id));

    const { product, related } = await productFlow.openProductWithRelated(inStock.id);
    expect(product.status()).toBe(200);
    expect(related.status()).toBe(500);
    expect(await related.json()).toEqual({ message: 'Something went wrong' });

    await test.step('main detail is unaffected', async () => {
      await expect(productPage.name).toHaveText(inStock.name);
      await expect(productPage.unitPrice).toHaveText(String(inStock.price));
      await expect(productPage.specsTitle).toBeVisible();
      await expect(productPage.addToCart).toBeEnabled();
    });

    await test.step('related section degrades silently', async () => {
      // Current front behaviour: heading stays, no cards, no loader stuck, no error alert.
      await expect(productPage.relatedHeading).toBeVisible();
      await expect(productPage.relatedCards).toHaveCount(0);
      await expect(productPage.skeletonCards).toHaveCount(0);
      await expect(productPage.alerts).toHaveCount(0);
    });
  });

  test('500 server error: nothing is rendered and purchase is impossible', async ({
    page,
    useMock,
    productFlow,
    productPage,
  }) => {
    await allure.story('Server error');
    await allure.severity('critical');
    await useMock(new ProductServerErrorMock(MISSING_ID));

    const response = await productFlow.openProduct(MISSING_ID);
    expect(response.status()).toBe(500);
    expect(await response.json()).toEqual({ message: 'Something went wrong' });

    await expect(page).toHaveURL(new RegExp(`/product/${MISSING_ID}$`));
    await expect(productPage.name).toBeHidden();
    await expect(productPage.unitPrice).toBeHidden();
    await expect(productPage.addToCart).toBeHidden();
    // Current front behaviour: same empty page as the 404, no error alert.
    await expect(productPage.alerts).toHaveCount(0);
  });
});
