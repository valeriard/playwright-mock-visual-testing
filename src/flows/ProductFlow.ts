import { Response } from '@playwright/test';
import { ProductPage } from '../pages/ProductPage';

export class ProductFlow {
  constructor(private readonly product: ProductPage) {}

  /** Navigates straight to a product detail and returns the API response behind it. */
  async openProduct(productId: string): Promise<Response> {
    return this.product.open(productId);
  }

  /** Same as openProduct, but also returns the related-products response. */
  async openProductWithRelated(productId: string): Promise<{ product: Response; related: Response }> {
    const related = this.product.waitForRelatedResponse(productId);
    const product = await this.product.open(productId);
    return { product, related: await related };
  }
}
