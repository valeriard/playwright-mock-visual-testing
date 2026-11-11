import { Response } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

export class HomeFlow {
  constructor(private readonly home: HomePage) {}

  /** Opens the catalog and waits until products are rendered (happy path). */
  async openCatalog(): Promise<void> {
    await this.home.goto();
    await this.home.waitUntilLoaded();
  }

  /** Opens the catalog without waiting for products; returns the product list API response. */
  async openCatalogAndGetListResponse(): Promise<Response> {
    return this.home.open();
  }
}
