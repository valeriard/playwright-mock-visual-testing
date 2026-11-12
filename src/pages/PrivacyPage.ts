import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class PrivacyPage extends BasePage {
  protected readonly path = '/privacy';

  readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Privacy Policy for Toolshop' });
  }
}
