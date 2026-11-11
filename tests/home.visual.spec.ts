import * as allure from 'allure-js-commons';
import { test, expect } from '../src/fixtures/test';

test.describe('Home - visual', () => {
  test.beforeEach(async () => {
    await allure.epic('Toolshop');
    await allure.feature('Catalog');
    await allure.parentSuite('Catalog');
    await allure.suite('Home visual');
  });

  test('initial screen matches baseline', async ({ page, homeFlow, homePage }) => {
    await allure.story('Initial screen baseline');
    await allure.severity('normal');
    await allure.tags('visual', 'mock');

    await homeFlow.openCatalog();
    await expect(page).toHaveScreenshot('home-initial.png', {
      fullPage: true,
      animations: 'disabled',
      mask: homePage.volatileRegions,
    });
  });
});
