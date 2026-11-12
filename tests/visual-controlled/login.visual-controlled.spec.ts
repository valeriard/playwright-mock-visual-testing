import * as allure from 'allure-js-commons';
import { INVALID_USER, VALID_USER } from '../../src/data/users';
import { LoginMock } from '../../src/mocks/LoginMock';
import { LoginServerErrorMock } from '../../src/mocks/LoginServerErrorMock';
import { BASELINES, expect, labelVisualTest, test } from './helpers';

// Only takes the picture: the login answer is pinned with `pin` (see ./helpers); the only wait is for the
// message to be on screen.
test.describe('Login - visual (controlled data)', () => {
  test.beforeEach(() =>
    labelVisualTest({ feature: 'Authentication', subSuite: 'Login (controlled data)', tags: ['controlled'] }),
  );

  test('invalid credentials message matches baseline', async ({ pin, loginPage, visual }) => {
    await allure.story('Invalid credentials');
    await allure.severity('normal');

    await pin(new LoginMock()); // accepts VALID_USER only, so INVALID_USER gets the 401
    await loginPage.goto();
    await loginPage.fillCredentials(INVALID_USER);
    await loginPage.submit();
    await expect(loginPage.loginError).toBeVisible();
    await visual.matchElement(loginPage.card, BASELINES.LOGIN_FORM_INVALID_CREDENTIALS);
  });

  test('server error (500) message matches baseline', async ({ pin, loginPage, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'desktop', 'Desktop only');
    await allure.story('Login server error');
    await allure.severity('normal');

    await pin(new LoginServerErrorMock());
    await loginPage.goto();
    await loginPage.fillCredentials(VALID_USER);
    await loginPage.submit();
    await expect(loginPage.loginError).toBeVisible();
    await visual.matchElement(loginPage.card, BASELINES.LOGIN_FORM_SERVER_ERROR);
  });
});
