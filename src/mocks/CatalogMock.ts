import { Page } from '@playwright/test';
import { ApiMock, API_URL } from './ApiMock';
import products from '../data/products.json';
import brands from '../data/brands.json';
import categoriesTree from '../data/categories-tree.json';
import productSpecs from '../data/product-specs.json';

/**
 * The app lists products with `QUERY /products` (filters travel in the body, no query string),
 * so match on the path only; a glob like `/products?**` would never match.
 */
export const isProductList = (url: URL): boolean =>
  url.origin === API_URL && url.pathname === '/products';

/** Deterministic home-page data so visual baselines never depend on the real API. */
export class CatalogMock implements ApiMock {
  async register(page: Page): Promise<void> {
    await page.route(isProductList, (route) => route.fulfill({ json: products }));
    await page.route(`${API_URL}/brands`, (route) => route.fulfill({ json: brands }));
    await page.route(`${API_URL}/categories/tree`, (route) => route.fulfill({ json: categoriesTree }));
    await page.route(`${API_URL}/product-specs/names`, (route) => route.fulfill({ json: productSpecs }));
  }
}
