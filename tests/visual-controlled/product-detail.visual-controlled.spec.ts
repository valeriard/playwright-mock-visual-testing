import * as allure from 'allure-js-commons';
import { AddToCartMock } from '../../src/mocks/CheckoutMocks';
import { CartMock } from '../../src/mocks/CartMock';
import { crearCarrito, ID_CARRITO } from '../mock/account.factories';
import { ProductDetailMock } from '../../src/mocks/ProductDetailMock';
import { ProductNotFoundMock, ProductServerErrorMock } from '../../src/mocks/ProductErrorMock';
import { RelatedProductsServerErrorMock } from '../../src/mocks/RelatedProductsMocks';
import {
  crearDetalleProducto,
  crearRelacionados,
  detalleConNombreLargo,
  detalleConPrecioCero,
  detalleSinStock,
  relacionadosVacios,
} from '../mock/factories';
import { BASELINES, homeVolatileRegions, labelVisualTest, test } from './helpers';

const MISSING_ID = '01ZZZZZZZZZZZZZZZZZZZZZZZZ';

// Only takes the pictures: the product and its related ones come from the `productoControlado` fixture.
test.describe('Product detail - visual (controlled data)', () => {
  test.beforeEach(async ({ productFlow, productPage, productoControlado }) => {
    await labelVisualTest({ feature: 'Catalog', subSuite: 'Product detail (controlled data)', tags: ['controlled'] });
    await productFlow.openProduct(productoControlado.id);
    await productPage.waitUntilLoaded();
  });

  test('full page matches baseline', async ({ page, visual }) => {
    await allure.story('Detail page baseline');
    await allure.severity('critical');

    await visual.matchPage(BASELINES.PRODUCT_DETAIL_PAGE, { mask: homeVolatileRegions(page) });
  });

  test('main block matches baseline', async ({ productPage, visual }) => {
    await allure.story('Main block');
    await allure.severity('critical');

    await visual.matchElement(productPage.mainBlock, BASELINES.PRODUCT_DETAIL_MAIN_BLOCK);
  });

  test('quantity and purchase buttons match baseline', async ({ productPage, visual }) => {
    await allure.story('Quantity and add to cart');
    await allure.severity('critical');

    await visual.matchElement(productPage.quantityControl, BASELINES.PRODUCT_DETAIL_QUANTITY);
    await visual.matchElement(productPage.purchaseButtons, BASELINES.PRODUCT_DETAIL_BUTTONS);
  });

  test('specifications match baseline', async ({ productPage, visual }) => {
    await allure.story('Specifications');
    await allure.severity('critical');

    await visual.matchElement(productPage.specsSection, BASELINES.PRODUCT_DETAIL_SPECS);
  });

  test('related products match baseline', async ({ productPage, visual }) => {
    await allure.story('Related products');
    await allure.severity('critical');

    await visual.matchElement(productPage.relatedSection, BASELINES.PRODUCT_DETAIL_RELATED);
  });
});

// Special states: each test pins its own endpoints (see `pin` in ./helpers) and opens the product itself.
test.describe('Product detail states - visual (controlled data)', () => {
  test.beforeEach(() =>
    labelVisualTest({ feature: 'Catalog', subSuite: 'Product detail states (controlled data)', tags: ['controlled'] }),
  );

  test('out of stock main block matches baseline', async ({ pin, productFlow, productPage, visual }) => {
    await allure.story('Out of stock');
    await allure.severity('normal');
    const detalle = detalleSinStock();

    await pin(new ProductDetailMock(detalle, crearRelacionados()));
    await productFlow.openProduct(detalle.id);
    await productPage.waitUntilLoaded();
    await visual.matchElement(productPage.mainBlock, BASELINES.PRODUCT_DETAIL_MAIN_BLOCK_OUT_OF_STOCK);
  });

  test('very long name main block matches baseline', async ({ pin, productFlow, productPage, visual }) => {
    await allure.story('Long name');
    await allure.severity('normal');
    const detalle = detalleConNombreLargo();

    await pin(new ProductDetailMock(detalle, crearRelacionados()));
    await productFlow.openProduct(detalle.id);
    await productPage.waitUntilLoaded();
    await visual.matchElement(productPage.mainBlock, BASELINES.PRODUCT_DETAIL_MAIN_BLOCK_LONG_NAME);
  });

  test('related products: empty matches baseline', async ({ pin, productFlow, productPage, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'desktop', 'Desktop only');
    await allure.story('Related products: empty');
    await allure.severity('normal');
    const detalle = crearDetalleProducto();

    await pin(new ProductDetailMock(detalle, relacionadosVacios()));
    await productFlow.openProduct(detalle.id);
    await productPage.waitUntilLoaded({ related: false });
    await visual.matchElement(productPage.relatedSection, BASELINES.PRODUCT_DETAIL_RELATED_EMPTY);
  });

  test('related products: server error matches baseline', async ({ pin, productFlow, productPage, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'desktop', 'Desktop only');
    await allure.story('Related products: server error');
    await allure.severity('normal');
    const detalle = crearDetalleProducto();

    await pin(new ProductDetailMock(detalle, crearRelacionados()));
    await pin(new RelatedProductsServerErrorMock(detalle.id)); // after the detail mock: it takes precedence
    await productFlow.openProduct(detalle.id);
    await productPage.waitUntilLoaded({ related: false });
    await visual.matchElement(productPage.relatedSection, BASELINES.PRODUCT_DETAIL_RELATED_SERVER_ERROR);
  });

  test('product not found (404) matches baseline', async ({ page, pin, productFlow, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'desktop', 'Desktop only');
    await allure.story('Product not found');
    await allure.severity('normal');

    await pin(new ProductNotFoundMock(MISSING_ID));
    await productFlow.openProduct(MISSING_ID);
    await visual.matchPage(BASELINES.PRODUCT_DETAIL_NOT_FOUND, { mask: homeVolatileRegions(page) });
  });

  test('product server error (500) matches baseline', async ({ page, pin, productFlow, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'desktop', 'Desktop only');
    await allure.story('Product server error');
    await allure.severity('normal');

    await pin(new ProductServerErrorMock(MISSING_ID));
    await productFlow.openProduct(MISSING_ID);
    await visual.matchPage(BASELINES.PRODUCT_DETAIL_SERVER_ERROR, { mask: homeVolatileRegions(page) });
  });

  // --- Secondary states (low priority) -----------------------------------------------------------

  test('quantity changed matches baseline', async ({ pin, productFlow, productPage, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'desktop', 'Desktop only');
    await allure.story('Quantity changed');
    await allure.severity('minor');
    const detalle = crearDetalleProducto();

    await pin(new ProductDetailMock(detalle, crearRelacionados()));
    await productFlow.openProduct(detalle.id);
    await productPage.waitUntilLoaded();
    await productPage.increaseQuantity.click();
    await productPage.increaseQuantity.click();
    await visual.matchElement(productPage.quantityControl, BASELINES.PRODUCT_DETAIL_QUANTITY_CHANGED);
  });

  test('add to cart hover matches baseline', async ({ pin, productFlow, productPage, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'desktop', 'Desktop only');
    await allure.story('Add to cart hover');
    await allure.severity('minor');
    const detalle = crearDetalleProducto();

    await pin(new ProductDetailMock(detalle, crearRelacionados()));
    await productFlow.openProduct(detalle.id);
    await productPage.waitUntilLoaded();
    await productPage.addToCart.hover();
    await visual.matchElement(productPage.purchaseButtons, BASELINES.PRODUCT_DETAIL_ADD_TO_CART_HOVER);
  });

  test('added to cart message matches baseline', async ({ pin, productFlow, productPage, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'desktop', 'Desktop only');
    await allure.story('Added to cart message');
    await allure.severity('minor');
    const detalle = crearDetalleProducto();

    await pin(new ProductDetailMock(detalle, crearRelacionados()));
    await pin(new AddToCartMock(ID_CARRITO));
    await pin(new CartMock(crearCarrito()));
    await productFlow.openProduct(detalle.id);
    await productPage.waitUntilLoaded();
    await productPage.addToCart.click();
    await productPage.toast.waitFor();
    await visual.matchElement(productPage.toast, BASELINES.PRODUCT_DETAIL_ADDED_TOAST);
  });

  test('price 0 main block matches baseline', async ({ pin, productFlow, productPage, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'desktop', 'Desktop only');
    await allure.story('Price 0');
    await allure.severity('minor');
    const detalle = detalleConPrecioCero();

    await pin(new ProductDetailMock(detalle, crearRelacionados()));
    await productFlow.openProduct(detalle.id);
    await productPage.waitUntilLoaded();
    await visual.matchElement(productPage.mainBlock, BASELINES.PRODUCT_DETAIL_MAIN_BLOCK_ZERO_PRICE);
  });
});
