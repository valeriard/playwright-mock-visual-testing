import * as allure from 'allure-js-commons';
import {
  PaginatedProductListMock,
  ProductListMock,
  ProductListPendingMock,
  ProductListServerErrorMock,
} from '../../src/mocks/ProductListMocks';
import {
  crearProductos,
  listaVacia,
  productosConTodosLosCo2,
  unSoloProducto,
  unSoloProductoConNombreLargo,
  unSoloProductoConPrecioCero,
} from '../mock/factories';
import { BASELINES, homeVolatileRegions, labelVisualTest, test } from './helpers';

// Only takes the picture: the data is controlled by the `controlledApi` fixture (see ./helpers).
test.describe('Home - visual (controlled data)', () => {
  test.beforeEach(() =>
    labelVisualTest({ feature: 'Catalog', subSuite: 'Home (controlled data)', tags: ['controlled'] }),
  );

  test('initial screen matches baseline', async ({ page, homeFlow, visual }) => {
    await allure.story('Initial screen baseline');
    await allure.severity('normal');

    await homeFlow.openCatalog();
    await visual.matchPage(BASELINES.HOME_PAGE_INITIAL, { mask: homeVolatileRegions(page) });
  });

  test('filter panel matches baseline', async ({ homeFlow, homePage, visual }, testInfo) => {
    await allure.story('Filter panel');
    await allure.severity('critical');

    await homeFlow.openCatalog();
    // Mobile: the panel starts collapsed behind the «Filters» button.
    if (testInfo.project.metadata.viewport === 'mobile') await homePage.openFilters();
    await visual.matchElement(homePage.filterPanel, BASELINES.HOME_FILTERS_PANEL);
  });

  test('product card matches baseline', async ({ homeFlow, homePage, visual }) => {
    await allure.story('Product card');
    await allure.severity('critical');

    await homeFlow.openCatalog();
    await visual.matchElement(homePage.productCards.first(), BASELINES.HOME_PRODUCT_CARD);
  });

  test('pagination on page 1 matches baseline', async ({ homeFlow, homePage, visual }) => {
    await allure.story('Pagination');
    await allure.severity('critical');

    await homeFlow.openCatalog();
    await visual.matchElement(homePage.paginationBar, BASELINES.HOME_PAGINATION_FIRST_PAGE);
  });

  // --- Special states: one more pinned endpoint each (see `pin` in ./helpers) -------------------

  test('product card out of stock matches baseline', async ({ pin, homeFlow, homePage, visual }) => {
    await allure.story('Product card: out of stock');
    await allure.severity('normal');

    await pin(new ProductListMock(unSoloProducto({ in_stock: false })));
    await homeFlow.openCatalog();
    await visual.matchElement(homePage.productCards.first(), BASELINES.HOME_PRODUCT_CARD_OUT_OF_STOCK);
  });

  test('product card with a very long name matches baseline', async ({ pin, homeFlow, homePage, visual }) => {
    await allure.story('Product card: long name');
    await allure.severity('normal');

    await pin(new ProductListMock(unSoloProductoConNombreLargo()));
    await homeFlow.openCatalog();
    await visual.matchElement(homePage.productCards.first(), BASELINES.HOME_PRODUCT_CARD_LONG_NAME);
  });

  test('empty product list matches baseline', async ({ page, pin, homePage, visual }) => {
    await allure.story('Empty list');
    await allure.severity('normal');

    await pin(new ProductListMock(listaVacia()));
    await homePage.goto();
    await homePage.noResults.waitFor();
    await visual.matchPage(BASELINES.HOME_PAGE_EMPTY_LIST, { mask: homeVolatileRegions(page) });
  });

  test('loading state (skeleton cards) matches baseline', async ({ page, pin, homePage, visual }) => {
    await allure.story('Loading list');
    await allure.severity('normal');

    await pin(new ProductListPendingMock());
    await homePage.goto();
    await homePage.skeletonCards.first().waitFor();
    await visual.matchPage(BASELINES.HOME_PAGE_LOADING, { mask: homeVolatileRegions(page) });
  });

  test('list server error (500) matches baseline', async ({ page, pin, homePage, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'desktop', 'Desktop only');
    await allure.story('List server error');
    await allure.severity('normal');

    await pin(new ProductListServerErrorMock());
    await homePage.goto();
    await homePage.skeletonCards.first().waitFor(); // the front shows no error, only skeletons
    await visual.matchPage(BASELINES.HOME_PAGE_LIST_SERVER_ERROR, { mask: homeVolatileRegions(page) });
  });

  test('categories menu open matches baseline', async ({ homePage, homeFlow, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'desktop', 'Desktop only');
    await allure.story('Categories menu');
    await allure.severity('normal');

    await homeFlow.openCatalog();
    await homePage.navBar.categoriesMenu.click();
    await visual.matchElement(homePage.navBar.categoriesMenuList, BASELINES.NAVBAR_CATEGORIES_MENU_OPEN);
  });

  // --- Secondary states (low priority) -----------------------------------------------------------

  test('product card hover matches baseline', async ({ homeFlow, homePage, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'desktop', 'Desktop only');
    await allure.story('Product card hover');
    await allure.severity('minor');

    await homeFlow.openCatalog();
    await homePage.productCards.first().hover();
    await visual.matchElement(homePage.productCards.first(), BASELINES.HOME_PRODUCT_CARD_HOVER);
  });

  test('product card with price 0 matches baseline', async ({ pin, homeFlow, homePage, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'desktop', 'Desktop only');
    await allure.story('Product card: price 0');
    await allure.severity('minor');

    await pin(new ProductListMock(unSoloProductoConPrecioCero()));
    await homeFlow.openCatalog();
    await visual.matchElement(homePage.productCards.first(), BASELINES.HOME_PRODUCT_CARD_ZERO_PRICE);
  });

  test('CO2 ratings A to E match baseline', async ({ pin, homeFlow, homePage, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'desktop', 'Desktop only');
    await allure.story('CO2 rating badges');
    await allure.severity('minor');

    await pin(new ProductListMock(productosConTodosLosCo2()));
    await homeFlow.openCatalog();
    await visual.matchElement(homePage.productGrid, BASELINES.HOME_PRODUCT_GRID_CO2_RATINGS);
  });

  test('selected category and brand match baseline', async ({ homeFlow, homePage, visual }, testInfo) => {
    await allure.story('Filters: selected options');
    await allure.severity('minor');

    await homeFlow.openCatalog();
    if (testInfo.project.metadata.viewport === 'mobile') await homePage.openFilters();
    await homePage.filterOption('Hammer').check();
    await homePage.filterOption('ForgeFlex Tools').check();
    await homePage.waitUntilLoaded(); // each click asks for the list again (same pinned answer)
    await visual.matchElement(homePage.filterPanel, BASELINES.HOME_FILTERS_PANEL_SELECTED);
  });

  test('price slider changed matches baseline', async ({ homeFlow, homePage, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'desktop', 'Desktop only');
    await allure.story('Price slider');
    await allure.severity('minor');

    await homeFlow.openCatalog();
    await homePage.priceSliderMaxHandle.focus();
    for (let i = 0; i < 40; i++) await homePage.raw.keyboard.press('ArrowLeft'); // 100 -> 60
    await homePage.waitUntilLoaded();
    await visual.matchElement(homePage.priceSlider, BASELINES.HOME_PRICE_SLIDER_CHANGED);
  });

  test('pagination on a middle page matches baseline', async ({ pin, homeFlow, homePage, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'desktop', 'Desktop only');
    await allure.story('Pagination: middle page');
    await allure.severity('minor');

    await pin(new PaginatedProductListMock(crearProductos())); // answers with the page that was asked for
    await homeFlow.openCatalog();
    await homePage.pageButton(3).click();
    await homePage.waitUntilLoaded();
    await visual.matchElement(homePage.paginationBar, BASELINES.HOME_PAGINATION_MIDDLE_PAGE);
  });

  test('category Rentals page matches baseline', async ({ page, homePage, visual }) => {
    await allure.story('Category page');
    await allure.severity('minor');

    await homePage.gotoCategory('rentals');
    await homePage.waitUntilLoaded();
    await visual.matchPage(BASELINES.CATEGORY_RENTALS_PAGE, { mask: homeVolatileRegions(page) });
  });
});
