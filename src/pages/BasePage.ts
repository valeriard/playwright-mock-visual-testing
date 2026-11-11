import { Page } from '@playwright/test';

/** Common behaviour shared by every page object (LSP: all pages can be used as BasePage). */
export abstract class BasePage {
  protected abstract readonly path: string;

  constructor(protected readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  /** Underlying Playwright page, exposed for assertions that need it (e.g. toHaveURL). */
  get raw(): Page {
    return this.page;
  }
}
