import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** /checkout: a wizard (cart, sign in, billing address, payment). */
export class CartPage extends BasePage {
  protected readonly path = '/checkout';

  /** The whole wizard: step header plus the current step. */
  readonly wizard: Locator;
  readonly proceedToSignIn: Locator;
  readonly lineTotal: Locator;
  readonly proceedFromSignIn: Locator;
  readonly proceedFromBilling: Locator;
  readonly paymentMethod: Locator;

  constructor(page: Page) {
    super(page);
    this.wizard = page.locator('aw-wizard');
    this.proceedToSignIn = page.getByTestId('proceed-1');
    this.proceedFromSignIn = page.getByTestId('proceed-2');
    this.proceedFromBilling = page.getByTestId('proceed-3');
    this.paymentMethod = page.getByTestId('payment-method');
    this.lineTotal = page.getByTestId('line-price');
  }
}
