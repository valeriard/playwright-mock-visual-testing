import { Locator, Page, Response } from '@playwright/test';
import { BasePage } from './BasePage';
import { waitForImages } from './components/images';

export class HomePage extends BasePage {
  protected readonly path = '/';

  readonly productCards: Locator;
  readonly productNames: Locator;
  /** Hero image under the navbar (a static asset, not part of the catalog). */
  readonly banner: Locator;
  /** Left column: sort, price range, search and filters. On mobile it is collapsed behind `filtersToggle`. */
  readonly filterPanel: Locator;
  /** The «Filters» button; it only exists (is displayed) on mobile. */
  readonly filtersToggle: Locator;
  readonly sortSelect: Locator;
  /** Search field with its reset and submit buttons. */
  readonly searchBox: Locator;
  readonly paginationBar: Locator;
  readonly searchInput: Locator;
  /** Every product card, inside the right-hand column. */
  readonly productGrid: Locator;
  /** The price range slider with its labels (parent of the slider itself, which is only 4 px tall). */
  readonly priceSlider: Locator;
  readonly priceSliderMaxHandle: Locator;

  constructor(page: Page) {
    super(page);
    this.productCards = page.locator('a.card');
    this.productNames = page.getByTestId('product-name');
    this.banner = page.locator('.lead img');
    this.filterPanel = page.locator('#filters'); // the button has the same data-test, so use the id
    this.filtersToggle = page.locator('button[data-test="filters"]');
    this.sortSelect = page.getByTestId('sort');
    this.searchBox = page.locator('.input-group').filter({ has: page.getByTestId('search-query') });
    this.paginationBar = page.locator('ul.pagination');
    this.searchInput = page.getByTestId('search-query');
    this.productGrid = page.locator('.col-md-9 > .container');
    this.priceSliderMaxHandle = page.locator('.ngx-slider-pointer-max');
    this.priceSlider = page.locator('ngx-slider').locator('xpath=..');
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

  pageButton(n: number): Locator {
    return this.page.getByRole('button', { name: `Page-${n}` });
  }

  /** Filter checkbox by its visible label (a category or a brand). */
  filterOption(label: string): Locator {
    return this.filterPanel.getByLabel(label, { exact: true });
  }

  async gotoCategory(slug: string): Promise<void> {
    await this.page.goto(`/category/${slug}`);
  }

  /** Mobile only: the filter column starts collapsed; opens it and waits for the slide to finish. */
  async openFilters(): Promise<void> {
    await this.filtersToggle.click();
    await this.page.locator('#filters.show').waitFor();
  }

  /** The banner is an image: wait until it is decoded so a screenshot does not catch it half loaded. */
  async waitForBanner(): Promise<void> {
    await this.banner.waitFor();
    await this.banner.evaluate((img: HTMLImageElement) => img.decode());
  }

  async waitUntilLoaded(): Promise<void> {
    await this.productNames.first().waitFor();
    await waitForImages(this.page);
  }
}
