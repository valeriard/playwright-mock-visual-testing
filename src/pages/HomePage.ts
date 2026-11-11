import { Locator, Page, Response } from '@playwright/test';
import { BasePage } from './BasePage';
import { NavBar } from './components/NavBar';

export class HomePage extends BasePage {
  protected readonly path = '/';

  readonly navBar: NavBar;
  readonly productCards: Locator;
  readonly productNames: Locator;
  /** Elements whose content changes between runs; masked in visual tests. */
  readonly volatileRegions: Locator[];

  constructor(page: Page) {
    super(page);
    this.navBar = new NavBar(page);
    this.productCards = page.locator('a.card');
    this.productNames = page.getByTestId('product-name');
    this.volatileRegions = [
      page.getByTestId('notification-bar'),
      page.getByTestId('course-promo'),
      page.getByTestId('chat-toggle'),
      page.getByTestId('live-activity-toggle'),
      page.getByText(/Built \d{4}-\d{2}-\d{2}/),
    ];
  }

  /** Placeholder cards the front shows while the product list is loading. */
  get skeletonCards(): Locator {
    return this.page.locator('.card.skeleton');
  }

  get noResults(): Locator {
    return this.page.getByTestId('no-results');
  }

  get pagination(): Locator {
    return this.page.getByTestId('pagination-next');
  }

  /** Opens the home page and resolves with the product list response, whatever its status. */
  async open(): Promise<Response> {
    const listResponse = this.page.waitForResponse(
      (r) => new URL(r.url()).pathname === '/products' && r.request().method() === 'QUERY',
    );
    await this.goto();
    return listResponse;
  }

  async waitUntilLoaded(): Promise<void> {
    await this.productNames.first().waitFor();
    await this.waitForImages();
  }

  /** Product images load lazily; wait so screenshots are not taken mid-load. */
  private async waitForImages(): Promise<void> {
    await this.page.evaluate(() => {
      document.querySelectorAll('img[loading="lazy"]').forEach((img) => img.setAttribute('loading', 'eager'));
    });
    await this.page.waitForFunction(() => Array.from(document.images).every((img) => img.complete));
  }
}
