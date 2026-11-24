import * as allure from 'allure-js-commons';
import { test, expect } from '../../src/fixtures/pages';
import { loginViaApi, startSignedIn } from '../../src/data/apiLogin';
import { hybridUser } from '../../src/data/users';

/**
 * Hybrid: sign in through the REAL API, then reconnect with the front already authenticated.
 * No mocks. Experiment: does /account load in CI (Cloudflare) when we skip the visual login?
 */
test.describe('Account (hybrid: API login + UI)', () => {
  test('signed in via API, the account page loads', async ({ request, page, accountPage }) => {
    await allure.parentSuite('Hybrid');
    await allure.story('API login, UI continues');
    await allure.tags('hybrid');

    const token = await loginViaApi(request, hybridUser());
    await startSignedIn(page, token);

    await accountPage.goto();
    await expect(accountPage.title).toHaveText('My account');
  });
});
