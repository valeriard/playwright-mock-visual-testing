import * as allure from 'allure-js-commons';
import { BASELINES, homeVolatileRegions, labelVisualTest, test } from './helpers';

// Parts shared by every screen. Photographed on the login page: it does not depend on the catalog.
test.describe('Common parts - visual', () => {
  test.beforeEach(async ({ loginPage }) => {
    await labelVisualTest({ feature: 'Common parts', subSuite: 'Layout' });
    await loginPage.goto();
  });

  // Desktop: expanded navbar. Mobile: collapsed navbar (hamburger), i.e. the "menu closed" state.
  test('navbar (signed out) matches baseline', async ({ loginPage, visual }) => {
    await allure.story('Navbar');
    await allure.severity('critical');

    await visual.matchElement(loginPage.navBar.root, BASELINES.NAVBAR_SIGNED_OUT);
  });

  test('mobile menu open matches baseline', async ({ loginPage, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'mobile', 'The hamburger menu only exists on mobile');
    await allure.story('Mobile menu');
    await allure.severity('critical');

    await loginPage.navBar.openMenu();
    await visual.matchElement(loginPage.navBar.root, BASELINES.NAVBAR_MOBILE_MENU_OPEN);
  });

  test('footer matches baseline', async ({ page, loginPage, visual }) => {
    await allure.story('Footer');
    await allure.severity('normal');

    await visual.matchElement(loginPage.footer.root, BASELINES.FOOTER_DEFAULT, {
      mask: homeVolatileRegions(page), // only the "Built …" text applies here
    });
  });
});
