import { Locator, Page } from '@playwright/test';

export class NavBar {
  readonly signIn: Locator;
  readonly userMenu: Locator;
  /** Hamburger button; only visible when the navbar is collapsed (mobile widths). */
  readonly menuToggle: Locator;

  constructor(page: Page) {
    this.signIn = page.getByTestId('nav-sign-in');
    this.userMenu = page.getByTestId('nav-menu');
    this.menuToggle = page.getByRole('button', { name: 'Toggle navigation' });
  }

  /** Works on desktop and mobile: opens the collapsed menu first when needed. */
  async goToSignIn(): Promise<void> {
    // Navbar rendered in either layout: exactly one of the two is visible (both exist in the DOM).
    await this.signIn.or(this.menuToggle).filter({ visible: true }).waitFor();
    if (await this.menuToggle.isVisible()) {
      await this.menuToggle.click();
    }
    await this.signIn.click();
  }
}
