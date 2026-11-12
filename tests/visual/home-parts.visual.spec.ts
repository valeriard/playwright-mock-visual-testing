import * as allure from 'allure-js-commons';
import { BASELINES, labelVisualTest, test } from './helpers';

// Home pieces that do NOT depend on the catalog (real site, no mocks).
test.describe('Home parts - visual', () => {
  test.beforeEach(async ({ homePage }) => {
    await labelVisualTest({ feature: 'Catalog', subSuite: 'Home parts' });
    await homePage.goto();
  });

  test('banner matches baseline', async ({ homePage, visual }) => {
    await allure.story('Banner');
    await allure.severity('normal');

    await homePage.waitForBanner();
    await visual.matchElement(homePage.banner, BASELINES.HOME_BANNER);
  });

  // On mobile search and sort sit inside the collapsed filter panel, covered by visual-controlled.
  test('search box matches baseline', async ({ homePage, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'desktop', 'Desktop only: hidden behind «Filters» on mobile');
    await allure.story('Search box');
    await allure.severity('critical');

    await visual.matchElement(homePage.searchBox, BASELINES.HOME_SEARCH_BOX);
  });

  test('sort select matches baseline', async ({ homePage, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'desktop', 'Desktop only: hidden behind «Filters» on mobile');
    await allure.story('Sort select');
    await allure.severity('critical');

    await visual.matchElement(homePage.sortSelect, BASELINES.HOME_SORT_SELECT);
  });
});
