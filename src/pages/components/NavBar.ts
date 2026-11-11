import { Locator, Page } from '@playwright/test';

export class NavBar {
  readonly signIn: Locator;
  readonly userMenu: Locator;

  constructor(page: Page) {
    this.signIn = page.getByTestId('nav-sign-in');
    this.userMenu = page.getByTestId('nav-menu');
  }

  async goToSignIn(): Promise<void> {
    await this.signIn.click();
  }
}
