import * as allure from 'allure-js-commons';
import { BASELINES, homeVolatileRegions, labelVisualTest, test } from './helpers';

test.describe('Home - visual', () => {
  test.beforeEach(() => labelVisualTest({ feature: 'Catalog', subSuite: 'Home' }));

  test('initial screen matches baseline', async ({ page, homeFlow, visual }) => {
    await allure.story('Initial screen baseline');
    await allure.severity('normal');

    await homeFlow.openCatalog();
    await visual.matchPage(BASELINES.HOME_PAGE_INITIAL, { mask: homeVolatileRegions(page) });
  });
});
