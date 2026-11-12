import { Locator, Page, Response } from '@playwright/test';
import { BasePage } from './BasePage';
import { waitForImages } from './components/images';

export class ProductPage extends BasePage {
  private productId = '';

  readonly name: Locator;
  readonly unitPrice: Locator;
  readonly outOfStock: Locator;
  readonly addToCart: Locator;
  readonly specsTitle: Locator;
  readonly alerts: Locator;
  readonly relatedHeading: Locator;
  /** On the detail page the only product cards are the related ones. */
  readonly relatedCards: Locator;
  readonly skeletonCards: Locator;
  /** Image + name + price + description + quantity and buttons (first block of the detail). */
  readonly mainBlock: Locator;
  readonly quantityControl: Locator;
  /** «Add to cart», «Add to favorites» and «Add to compare». */
  readonly purchaseButtons: Locator;
  /** «Specifications» heading with its table. */
  readonly specsSection: Locator;
  /** «Related products» heading with its cards. */
  readonly relatedSection: Locator;
  readonly increaseQuantity: Locator;
  /** Toast shown after adding to the cart. */
  readonly toast: Locator;

  constructor(page: Page) {
    super(page);
    this.name = page.getByTestId('product-name');
    this.unitPrice = page.getByTestId('unit-price');
    this.outOfStock = page.getByTestId('out-of-stock');
    this.addToCart = page.getByTestId('add-to-cart');
    this.specsTitle = page.getByTestId('specs-title');
    this.alerts = page.getByRole('alert');
    this.relatedHeading = page.getByRole('heading', { name: 'Related products' });
    this.relatedCards = page.locator('a.card');
    this.skeletonCards = page.locator('.card.skeleton');
    this.mainBlock = page.locator('app-detail > .row.my-3');
    this.quantityControl = page.locator('.input-group.quantity');
    this.purchaseButtons = page.locator('.btn-group.mt-2');
    this.specsSection = page.locator('app-detail > .row.mt-4');
    this.increaseQuantity = page.getByTestId('increase-quantity');
    this.toast = page.getByRole('alert');
    this.relatedSection = page.locator('app-detail > .row').filter({ has: this.relatedHeading });
  }

  /** Starts listening for the related-products API response; call before open(). */
  waitForRelatedResponse(productId: string): Promise<Response> {
    return this.page.waitForResponse((r) => r.url().endsWith(`/products/${productId}/related`));
  }

  /** Waits for the main block and (unless `related: false`) the related cards, then for every image (screenshot-safe). */
  async waitUntilLoaded({ related = true }: { related?: boolean } = {}): Promise<void> {
    await this.name.waitFor();
    if (related) await this.relatedCards.first().waitFor();
    await waitForImages(this.page);
  }

  protected get path(): string {
    return `/product/${this.productId}`;
  }

  /** Opens the product and resolves with the API response that feeds the page. */
  async open(productId: string): Promise<Response> {
    this.productId = productId;
    const apiResponse = this.page.waitForResponse((r) => r.url().endsWith(`/products/${productId}`));
    await this.goto();
    return apiResponse;
  }
}
