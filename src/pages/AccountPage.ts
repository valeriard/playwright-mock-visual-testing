import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountPage extends BasePage {
  protected readonly path = '/account';

  readonly title: Locator;
  /** Profile: the «Password» form. */
  readonly passwordSection: Locator;
  /** Profile: the «Set up Two-Factor Authentication» block. */
  readonly twoFactorSection: Locator;
  readonly invoicesPagination: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByTestId('page-title');
    this.passwordSection = page.locator('form').filter({ has: page.getByRole('heading', { name: 'Password' }) });
    this.twoFactorSection = page
      .locator('app-profile > .container')
      .filter({ has: page.getByRole('heading', { name: 'Set up Two-Factor Authentication' }) });
    this.invoicesPagination = page.locator('ul.pagination');
  }

  /** Opens one of the account sections (favorites, profile, invoices, messages) and waits for its title. */
  async openSection(section: 'favorites' | 'profile' | 'invoices' | 'messages'): Promise<void> {
    await this.page.goto(`/account/${section}`);
    await this.title.waitFor();
  }
}
