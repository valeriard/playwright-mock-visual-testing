import * as allure from 'allure-js-commons';
import { test, expect } from './test';
import { INVALID_USER, VALID_USER } from '../../src/data/users';
import { LoginMock } from '../../src/mocks/LoginMock';
import { LoginServerErrorMock } from '../../src/mocks/LoginServerErrorMock';
import { LoginTimeoutMock } from '../../src/mocks/LoginTimeoutMock';

const SLOW_MS = 2000;
const TIMEOUT_MS = 1500;

test.describe('Login resilience (mocked API)', () => {
  test.beforeEach(async () => {
    await allure.epic('Toolshop');
    await allure.feature('Authentication');
    await allure.parentSuite('Mock');
    await allure.suite('Authentication');
    await allure.subSuite('Login resilience');
    await allure.tags('mock', 'resilience');
  });

  test('slow /users/login: front waits without errors or redirects, then completes', async ({
    page,
    useMock,
    loginFlow,
    loginPage,
    accountPage,
  }) => {
    await allure.story('Slow response');
    await allure.severity('critical');
    await useMock(new LoginMock(VALID_USER, { delayMs: SLOW_MS }));

    const requestSent = page.waitForRequest((r) => r.url().endsWith('/users/login'));
    const startedAt = Date.now();
    await loginFlow.loginAs(VALID_USER);
    await requestSent;

    await test.step('while the request is pending', async () => {
      // Current front behaviour: no spinner and no error; the user stays on the login page.
      await expect(loginPage.loginError).toBeHidden();
      await expect(page).toHaveURL(/\/auth\/login/);
      await expect(loginPage.emailInput).toHaveValue(VALID_USER.email);
    });

    await test.step('when the slow response arrives', async () => {
      await expect(accountPage.title).toHaveText('My account', { timeout: SLOW_MS + 8000 });
      await expect(page).toHaveURL(/\/account/);
      expect(Date.now() - startedAt).toBeGreaterThanOrEqual(SLOW_MS - 50);
    });
  });

  test('slow /users/login with bad credentials: error appears only after the response', async ({
    page,
    useMock,
    loginFlow,
    loginPage,
  }) => {
    await allure.story('Slow response');
    await allure.severity('normal');
    await useMock(new LoginMock(VALID_USER, { delayMs: SLOW_MS }));

    const requestSent = page.waitForRequest((r) => r.url().endsWith('/users/login'));
    await loginFlow.loginAs(INVALID_USER);
    await requestSent;

    await expect(loginPage.loginError).toBeHidden();
    await expect(loginPage.loginError).toHaveText(/invalid email or password/i, { timeout: SLOW_MS + 8000 });
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('timeout on /users/login: front stays quiet while waiting, then shows a generic failure', async ({
    page,
    useMock,
    loginFlow,
    loginPage,
  }) => {
    await allure.story('Network timeout');
    await allure.severity('critical');
    await useMock(new LoginTimeoutMock({ afterMs: TIMEOUT_MS }));

    const requestFailed = page.waitForEvent('requestfailed', (r) => r.url().endsWith('/users/login'));
    await loginFlow.loginAs(VALID_USER);

    await test.step('while the connection hangs', async () => {
      await expect(loginPage.loginError).toBeHidden();
      await expect(page).toHaveURL(/\/auth\/login/);
    });

    await test.step('when the request times out', async () => {
      await requestFailed; // no HTTP response at all: the request itself fails
      await expect(loginPage.loginError).toBeVisible();
      await expect(loginPage.loginError).toHaveText('Login failed');
      await expect(loginPage.loginError).not.toHaveText(/invalid email or password/i);
    });

    await test.step('user is not logged in and can retry', async () => {
      await expect(page).toHaveURL(/\/auth\/login/);
      await expect(loginPage.emailInput).toHaveValue(VALID_USER.email);
      await expect(loginPage.submitButton).toBeEnabled();
    });
  });

  test('500 from /users/login: front shows a generic failure and stays usable', async ({
    page,
    useMock,
    loginFlow,
    loginPage,
  }) => {
    await allure.story('Server error');
    await allure.severity('critical');
    await useMock(new LoginServerErrorMock());

    const responsePromise = page.waitForResponse((r) => r.url().endsWith('/users/login'));
    await loginFlow.loginAs(VALID_USER);
    expect((await responsePromise).status()).toBe(500);

    await test.step('error feedback', async () => {
      await expect(loginPage.loginError).toBeVisible();
      await expect(loginPage.loginError).toHaveText('Login failed');
      // A 500 must not be presented as a credentials problem (that is the 401 message).
      await expect(loginPage.loginError).not.toHaveText(/invalid email or password/i);
    });

    await test.step('user is not logged in and can retry', async () => {
      await expect(page).toHaveURL(/\/auth\/login/);
      await expect(loginPage.emailInput).toHaveValue(VALID_USER.email);
      await expect(loginPage.passwordInput).toHaveValue(VALID_USER.password);
      await expect(loginPage.submitButton).toBeEnabled();
    });
  });
});
