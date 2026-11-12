import * as allure from 'allure-js-commons';
import { BASELINES, expect, homeVolatileRegions, labelVisualTest, test } from './helpers';

// Forms that do NOT depend on the catalog (real site, no mocks). Whole page, so the layout is what is checked.
test.describe('Forms - visual', () => {
  test.beforeEach(() => labelVisualTest({ feature: 'Forms', subSuite: 'Forms' }));

  test('forgot password page matches baseline', async ({ page, forgotPasswordPage, visual }) => {
    await allure.story('Forgot password');
    await allure.severity('normal');

    await forgotPasswordPage.goto();
    await forgotPasswordPage.form.waitFor();
    await visual.matchPage(BASELINES.FORGOT_PASSWORD_PAGE, { mask: homeVolatileRegions(page) });
  });

  test('registration page matches baseline', async ({ page, registerPage, visual }) => {
    await allure.story('Registration form');
    await allure.severity('normal');

    await registerPage.goto();
    await registerPage.form.waitFor();
    await visual.matchPage(BASELINES.REGISTER_PAGE, { mask: homeVolatileRegions(page) });
  });

  test('registration required-field messages match baseline', async ({ page, registerPage, visual }) => {
    await allure.story('Registration form: required fields');
    await allure.severity('normal');

    await registerPage.goto();
    await registerPage.submit();
    await expect(registerPage.fieldErrors).toHaveCount(12);
    await visual.matchPage(BASELINES.REGISTER_PAGE_REQUIRED_FIELDS, { mask: homeVolatileRegions(page) });
  });

  test('contact page matches baseline', async ({ page, contactPage, visual }) => {
    await allure.story('Contact form');
    await allure.severity('normal');

    await contactPage.goto();
    await contactPage.form.waitFor();
    await visual.matchPage(BASELINES.CONTACT_PAGE, { mask: homeVolatileRegions(page) });
  });

  test('contact required-field messages match baseline', async ({ page, contactPage, visual }) => {
    await allure.story('Contact form: required fields');
    await allure.severity('normal');

    await contactPage.goto();
    await contactPage.submit();
    await expect(contactPage.fieldErrors).toHaveCount(5);
    await visual.matchPage(BASELINES.CONTACT_PAGE_REQUIRED_FIELDS, { mask: homeVolatileRegions(page) });
  });
});
