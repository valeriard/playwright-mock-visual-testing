import * as allure from 'allure-js-commons';
import { PostcodeLookupMock } from '../../src/mocks/CheckoutMocks';
import { BASELINES, expect, labelVisualTest, test } from './helpers';

// The cart is set up as the page keeps it (sessionStorage `cart_id`) and GET /carts/{id} is pinned.
test.describe('Cart - visual (controlled data)', () => {
  test.beforeEach(async ({ carritoControlado }) => {
    void carritoControlado;
    await labelVisualTest({ feature: 'Cart', subSuite: 'Cart (controlled data)', tags: ['controlled'] });
  });

  test('cart with one item matches baseline', async ({ cartPage, visual }) => {
    await allure.story('Cart with one item');
    await allure.severity('normal');

    await cartPage.goto();
    await expect(cartPage.lineTotal).toBeVisible();
    await visual.matchElement(cartPage.wizard, BASELINES.CART_WIZARD_WITH_ITEM);
  });

  test('sign in step matches baseline', async ({ cartPage, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'desktop', 'Desktop only');
    await allure.story('Checkout sign in step');
    await allure.severity('normal');

    await cartPage.goto();
    await cartPage.proceedToSignIn.click();
    await expect(cartPage.raw.getByTestId('login-submit')).toBeVisible();
    await visual.matchElement(cartPage.wizard, BASELINES.CART_WIZARD_SIGN_IN_STEP);
  });
});

// Signed in: the sign-in step says «you are already logged in», so the next steps can be reached.
test.describe('Checkout steps - visual (controlled data)', () => {
  test.beforeEach(async ({ pin, sesionIniciada, carritoControlado }) => {
    void carritoControlado;
    await labelVisualTest({ feature: 'Cart', subSuite: 'Checkout steps (controlled data)', tags: ['controlled', 'session'] });
    // The billing step looks the address up by postcode: answer with the profile's own address.
    const a = sesionIniciada.address;
    await pin(
      new PostcodeLookupMock({
        street: a.street,
        house_number: a.house_number,
        city: a.city,
        state: a.state,
        country: a.country,
        postcode: a.postal_code,
      }),
    );
  });

  test('billing address step matches baseline', async ({ cartPage, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'desktop', 'Desktop only');
    await allure.story('Billing address step');
    await allure.severity('minor');

    await cartPage.goto();
    await cartPage.proceedToSignIn.click();
    await cartPage.proceedFromSignIn.click();
    await expect(cartPage.proceedFromBilling).toBeVisible();
    await visual.matchElement(cartPage.wizard, BASELINES.CART_WIZARD_BILLING_STEP);
  });

  test('payment step matches baseline', async ({ cartPage, visual }, testInfo) => {
    test.skip(testInfo.project.metadata.viewport !== 'desktop', 'Desktop only');
    await allure.story('Payment step');
    await allure.severity('minor');

    await cartPage.goto();
    await cartPage.proceedToSignIn.click();
    await cartPage.proceedFromSignIn.click();
    await cartPage.proceedFromBilling.click();
    await expect(cartPage.paymentMethod).toBeVisible();
    await visual.matchElement(cartPage.wizard, BASELINES.CART_WIZARD_PAYMENT_STEP);
  });
});
