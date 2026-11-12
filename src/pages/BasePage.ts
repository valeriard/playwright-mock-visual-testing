import { Page } from '@playwright/test';
import { Footer } from './components/Footer';
import { NavBar } from './components/NavBar';

/** Common behaviour shared by every page object (LSP: all pages can be used as BasePage). */
export abstract class BasePage {
  protected abstract readonly path: string;

  /** Parts shared by every screen. */
  readonly navBar: NavBar;
  readonly footer: Footer;

  constructor(protected readonly page: Page) {
    this.navBar = new NavBar(page);
    this.footer = new Footer(page);
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  /** Underlying Playwright page, exposed for assertions that need it (e.g. toHaveURL). */
  get raw(): Page {
    return this.page;
  }
}
