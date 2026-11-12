import { Locator, Page } from '@playwright/test';

export class NavBar {
  /** The whole bar (links, language selector). The notification bar and promo sit above it, outside. */
  readonly root: Locator;
  readonly signIn: Locator;
  readonly userMenu: Locator;
  /** Dropdown list that opens under the signed-in user's name (desktop). */
  readonly userMenuList: Locator;
  readonly contactLink: Locator;
  readonly languageSelect: Locator;
  readonly languageMenuList: Locator;
  readonly categoriesMenu: Locator;
  /** Dropdown list that opens under «Categories» (desktop). */
  readonly categoriesMenuList: Locator;
  /** Hamburger button; only visible when the navbar is collapsed (mobile widths). */
  readonly menuToggle: Locator;

  constructor(page: Page) {
    this.root = page.locator('nav.navbar');
    this.signIn = page.getByTestId('nav-sign-in');
    this.userMenu = page.getByTestId('nav-menu');
    this.userMenuList = this.userMenu.locator('xpath=following-sibling::ul[contains(@class, "dropdown-menu")]');
    this.languageSelect = page.getByTestId('language-select');
    this.languageMenuList = this.languageSelect.locator('xpath=following-sibling::ul[contains(@class, "dropdown-menu")]');
    this.contactLink = page.getByTestId('nav-contact');
    this.categoriesMenu = page.getByTestId('nav-categories');
    this.categoriesMenuList = this.categoriesMenu.locator('xpath=following-sibling::ul[contains(@class, "dropdown-menu")]');
    this.menuToggle = page.getByRole('button', { name: 'Toggle navigation' });
  }

  /** Moves focus to the «Contact» link the way a keyboard user does (so the focus ring is shown). */
  async focusContactWithKeyboard(): Promise<void> {
    await this.contactLink.focus();
    await this.contactLink.page().keyboard.press('Shift+Tab');
    await this.contactLink.page().keyboard.press('Tab');
  }

  /** Mobile only: opens the collapsed menu and waits until its slide animation has finished. */
  async openMenu(): Promise<void> {
    await this.menuToggle.click();
    await this.root.locator('.navbar-collapse.show').waitFor();
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
