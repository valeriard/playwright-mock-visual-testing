import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ContactPage extends BasePage {
  protected readonly path = '/contact';

  readonly form: Locator;
  readonly submitButton: Locator;
  /** One "<field>-error" message per required field that is empty. */
  readonly fieldErrors: Locator;

  constructor(page: Page) {
    super(page);
    this.form = page.locator('form');
    this.submitButton = page.getByTestId('contact-submit');
    this.fieldErrors = page.locator('[data-test$="-error"]');
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }
}
