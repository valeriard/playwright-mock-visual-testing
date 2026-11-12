import * as allure from 'allure-js-commons';
import {
  FavoritesMock,
  InvoicesMock,
  MessagesMock,
  TotpSetupDeniedMock,
} from '../../src/mocks/AccountMocks';
import { crearFacturas, crearFavoritos, crearMensajesVacios } from '../mock/account.factories';
import { BASELINES, expect, homeVolatileRegions, labelVisualTest, test } from './helpers';
import { waitForImages } from '../../src/pages/components/images';

// Signed-in screens. Only takes the pictures: the session and every endpoint come from fixtures + factories
// with FICTIONAL data (see `sesionIniciada` and `pin` in ./helpers).
test.describe('Account - visual (controlled data)', () => {
  test.beforeEach(async ({ sesionIniciada }) => {
    void sesionIniciada;
    await labelVisualTest({ feature: 'Account', subSuite: 'Account (controlled data)', tags: ['controlled', 'session'] });
  });

  test('navbar signed in matches baseline', async ({ homePage, accountPage, visual }, testInfo) => {
    await allure.story('Navbar signed in');
    await allure.severity('normal');

    await accountPage.goto();
    await accountPage.title.waitFor();
    // Mobile: the user name lives inside the collapsed menu.
    if (testInfo.project.metadata.viewport === 'mobile') await homePage.navBar.openMenu();
    await visual.matchElement(homePage.navBar.root, BASELINES.NAVBAR_SIGNED_IN);
  });

  test('user menu open matches baseline', async ({ accountPage, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'desktop', 'Desktop only');
    await allure.story('User menu');
    await allure.severity('normal');

    await accountPage.goto();
    await accountPage.title.waitFor();
    await accountPage.navBar.userMenu.click();
    await visual.matchElement(accountPage.navBar.userMenuList, BASELINES.NAVBAR_USER_MENU_OPEN);
  });

  test('my account page matches baseline', async ({ page, accountPage, visual }) => {
    await allure.story('My account');
    await allure.severity('normal');

    await accountPage.goto();
    await accountPage.title.waitFor();
    await visual.matchPage(BASELINES.ACCOUNT_PAGE, { mask: homeVolatileRegions(page) });
  });

  test('favorites with products matches baseline', async ({ page, pin, accountPage, visual }) => {
    await allure.story('Favorites with products');
    await allure.severity('normal');

    await pin(new FavoritesMock(crearFavoritos(2)));
    await accountPage.openSection('favorites');
    await page.getByTestId(/^favorite-/).first().waitFor();
    await waitForImages(page);
    await visual.matchPage(BASELINES.ACCOUNT_FAVORITES_PAGE, { mask: homeVolatileRegions(page) });
  });

  test('favorites empty matches baseline', async ({ page, pin, accountPage, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'desktop', 'Desktop only');
    await allure.story('Favorites empty');
    await allure.severity('normal');

    await pin(new FavoritesMock(crearFavoritos(0)));
    await accountPage.openSection('favorites');
    await visual.matchPage(BASELINES.ACCOUNT_FAVORITES_EMPTY_PAGE, { mask: homeVolatileRegions(page) });
  });

  test('profile page matches baseline', async ({ page, pin, accountPage, visual, sesionIniciada }) => {
    await allure.story('Profile');
    await allure.severity('normal');

    await pin(new TotpSetupDeniedMock()); // the page asks for it on load
    await accountPage.openSection('profile');
    await expect(page.getByTestId('first-name')).toHaveValue(sesionIniciada.first_name);
    await visual.matchPage(BASELINES.ACCOUNT_PROFILE_PAGE, { mask: homeVolatileRegions(page) });
  });

  test('invoices with data matches baseline', async ({ page, pin, accountPage, visual }) => {
    await allure.story('Invoices with data');
    await allure.severity('normal');

    await pin(new InvoicesMock(crearFacturas(5)));
    await accountPage.openSection('invoices');
    await page.locator('table tbody tr').first().waitFor();
    await visual.matchPage(BASELINES.ACCOUNT_INVOICES_PAGE, { mask: homeVolatileRegions(page) });
  });

  test('messages empty matches baseline', async ({ page, pin, accountPage, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'desktop', 'Desktop only');
    await allure.story('Messages empty');
    await allure.severity('normal');

    const response = page.waitForResponse((r) => new URL(r.url()).pathname === '/messages');
    await pin(new MessagesMock(crearMensajesVacios()));
    await accountPage.openSection('messages');
    await response;
    await visual.matchPage(BASELINES.ACCOUNT_MESSAGES_EMPTY_PAGE, { mask: homeVolatileRegions(page) });
  });

  // --- Secondary states (low priority) -----------------------------------------------------------

  test('profile password and two-factor sections match baseline', async ({ pin, accountPage, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'desktop', 'Desktop only');
    await allure.story('Profile: password and 2FA');
    await allure.severity('minor');

    await pin(new TotpSetupDeniedMock());
    await accountPage.openSection('profile');
    await accountPage.twoFactorSection.getByTestId('totp-error').waitFor();
    await visual.matchElement(accountPage.passwordSection, BASELINES.ACCOUNT_PROFILE_PASSWORD_SECTION);
    await visual.matchElement(accountPage.twoFactorSection, BASELINES.ACCOUNT_PROFILE_TWO_FACTOR_SECTION);
  });

  test('invoices pagination matches baseline', async ({ page, pin, accountPage, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'desktop', 'Desktop only');
    await allure.story('Invoices pagination');
    await allure.severity('minor');

    await pin(new InvoicesMock(crearFacturas(5, 3))); // the API declares 3 pages
    await accountPage.openSection('invoices');
    await page.locator('table tbody tr').first().waitFor();
    await visual.matchElement(accountPage.invoicesPagination, BASELINES.ACCOUNT_INVOICES_PAGINATION);
  });
});
