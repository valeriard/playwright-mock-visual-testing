import { Locator, Page, Response } from '@playwright/test';
import { BasePage } from './BasePage';

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
  }

  /** Starts listening for the related-products API response; call before open(). */
  waitForRelatedResponse(productId: string): Promise<Response> {
    return this.page.waitForResponse((r) => r.url().endsWith(`/products/${productId}/related`));
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
