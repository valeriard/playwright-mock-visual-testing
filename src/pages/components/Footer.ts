import { Locator, Page } from '@playwright/test';

export class Footer {
  readonly root: Locator;

  constructor(page: Page) {
    this.root = page.locator('footer');
  }
}
