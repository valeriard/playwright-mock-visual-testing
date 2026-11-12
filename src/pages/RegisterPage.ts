import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  protected readonly path = '/auth/register';

  readonly form: Locator;
  readonly submitButton: Locator;
  /** One "<field>-error" message per required field that is empty. */
  readonly fieldErrors: Locator;

  constructor(page: Page) {
    super(page);
    this.form = page.getByTestId('register-form');
    this.submitButton = page.getByTestId('register-submit');
    this.fieldErrors = page.locator('[data-test$="-error"]');
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }
}
