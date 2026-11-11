import * as allure from 'allure-js-commons';
import { test, expect } from '../src/fixtures/test';
import { INVALID_USER, VALID_USER } from '../src/data/users';

test.describe('Login (mocked API)', () => {
  test.beforeEach(async () => {
    await allure.epic('Toolshop');
    await allure.feature('Authentication');
    await allure.parentSuite('Authentication');
    await allure.suite('Login');
  });

  test('valid credentials land on the account page', async ({ loginFlow, accountPage }) => {
    await allure.story('Successful login');
    await allure.severity('critical');
    await allure.tags('mock', 'smoke');

    await loginFlow.loginAs(VALID_USER);
    await expect(accountPage.raw).toHaveURL(/\/account/);
    await expect(accountPage.title).toHaveText('My account');
  });

  test('bad credentials: API answers 401 and the error is shown', async ({ page, loginFlow, loginPage }) => {
    await allure.story('Failed login');
    await allure.severity('critical');
    await allure.tags('mock', 'negative');

    const responsePromise = page.waitForResponse((r) => r.url().endsWith('/users/login'));
    await loginFlow.loginAs(INVALID_USER);
    expect((await responsePromise).status()).toBe(401);
    await expect(loginPage.loginError).toBeVisible();
    await expect(loginPage.loginError).toHaveText(/invalid email or password/i);
  });
});

test.describe('Login - visual', () => {
  test.beforeEach(async () => {
    await allure.epic('Toolshop');
    await allure.feature('Authentication');
    await allure.parentSuite('Authentication');
    await allure.suite('Login visual');
  });

  test('required-field messages match baseline', async ({ loginFlow, loginPage }) => {
    await allure.story('Required field validation');
    await allure.severity('normal');
    await allure.tags('visual', 'validation');

    await loginFlow.submitEmptyForm();
    await expect(loginPage.emailError).toHaveText('Email is required');
    await expect(loginPage.passwordError).toHaveText('Password is required');
    await expect(loginPage.form).toHaveScreenshot('login-required-fields.png', { animations: 'disabled' });
  });
});
