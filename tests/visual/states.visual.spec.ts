import * as allure from 'allure-js-commons';
import { BASELINES, homeVolatileRegions, labelVisualTest, test } from './helpers';

const DESKTOP_ONLY = 'Desktop only';

// Secondary states (hover, focus, open menus) of pieces that do NOT depend on the catalog. Real site, no mocks.
test.describe('Secondary states - visual', () => {
  test.beforeEach(() => labelVisualTest({ feature: 'Common parts', subSuite: 'Secondary states', tags: ['states'] }));

  test('language menu open matches baseline', async ({ loginPage, visual }, testInfo) => {
    await allure.story('Language menu');
    await allure.severity('minor');

    await loginPage.goto();
    // Mobile: the language selector lives inside the collapsed menu.
    if (testInfo.project.metadata.viewport === 'mobile') await loginPage.navBar.openMenu();
    await loginPage.navBar.languageSelect.click();
    await visual.matchElement(loginPage.navBar.languageMenuList, BASELINES.LANGUAGE_MENU_OPEN);
  });

  test('navbar link hover matches baseline', async ({ loginPage, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'desktop', DESKTOP_ONLY);
    await allure.story('Navbar link hover');
    await allure.severity('minor');

    await loginPage.goto();
    await loginPage.navBar.contactLink.hover();
    await visual.matchElement(loginPage.navBar.root, BASELINES.NAVBAR_LINK_HOVER);
  });

  test('navbar link keyboard focus matches baseline', async ({ loginPage, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'desktop', DESKTOP_ONLY);
    await allure.story('Navbar link focus');
    await allure.severity('minor');

    await loginPage.goto();
    await loginPage.navBar.focusContactWithKeyboard();
    await visual.matchElement(loginPage.navBar.root, BASELINES.NAVBAR_LINK_KEYBOARD_FOCUS);
  });

  test('search box with text matches baseline', async ({ homePage, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'desktop', DESKTOP_ONLY);
    await allure.story('Search box with text');
    await allure.severity('minor');

    await homePage.goto();
    await homePage.searchInput.fill('pliers');
    await visual.matchElement(homePage.searchBox, BASELINES.HOME_SEARCH_BOX_WITH_TEXT);
  });

  test('search box focus matches baseline', async ({ homePage, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'desktop', DESKTOP_ONLY);
    await allure.story('Search box focus');
    await allure.severity('minor');

    await homePage.goto();
    await homePage.searchInput.focus();
    await visual.matchElement(homePage.searchBox, BASELINES.HOME_SEARCH_BOX_FOCUS);
  });

  test('login field focus matches baseline', async ({ loginPage, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'desktop', DESKTOP_ONLY);
    await allure.story('Login field focus');
    await allure.severity('minor');

    await loginPage.goto();
    await loginPage.emailInput.focus();
    await visual.matchElement(loginPage.form, BASELINES.LOGIN_FORM_FIELD_FOCUS);
  });

  test('login button hover matches baseline', async ({ loginPage, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'desktop', DESKTOP_ONLY);
    await allure.story('Login button hover');
    await allure.severity('minor');

    await loginPage.goto();
    await loginPage.submitButton.hover();
    await visual.matchElement(loginPage.form, BASELINES.LOGIN_FORM_BUTTON_HOVER);
  });

  test('privacy policy page matches baseline', async ({ page, privacyPage, visual }) => {
    await allure.story('Privacy policy');
    await allure.severity('minor');

    await privacyPage.goto();
    await privacyPage.heading.waitFor();
    await visual.matchPage(BASELINES.PRIVACY_PAGE, { mask: homeVolatileRegions(page) });
  });
});
