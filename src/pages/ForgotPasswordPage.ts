import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ForgotPasswordPage extends BasePage {
  protected readonly path = '/auth/forgot-password';

  readonly form: Locator;

  constructor(page: Page) {
    super(page);
    this.form = page.getByTestId('forgot-password-form');
  }
}
