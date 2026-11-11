import { Page } from '@playwright/test';
import { ApiMock, API_URL } from './ApiMock';

/**
 * The app lists products with `QUERY /products` (filters travel in the body, no query string),
 * so match on the path only; a glob like `/products?**` would never match.
 */
export const isProductList = (url: URL): boolean =>
  url.origin === API_URL && url.pathname === '/products';

/** Data served by the catalog endpoints; the caller (a test) owns it, this mock only serves it. */
export interface DatosCatalogo {
  /** Body of `QUERY /products`. */
  productos: object;
  /** Body of `GET /brands`. */
  marcas: object[];
  /** Body of `GET /categories/tree`. */
  categorias: object[];
}

/** Home-page catalog endpoints, answered with the data it is given. */
export class CatalogMock implements ApiMock {
  constructor(private readonly datos: DatosCatalogo) {}

  async register(page: Page): Promise<void> {
    await page.route(isProductList, (route) => route.fulfill({ json: this.datos.productos }));
    await page.route(`${API_URL}/brands`, (route) => route.fulfill({ json: this.datos.marcas }));
    await page.route(`${API_URL}/categories/tree`, (route) => route.fulfill({ json: this.datos.categorias }));
    // Not captured as a fixture: the app only needs an empty list here.
    await page.route(`${API_URL}/product-specs/names`, (route) => route.fulfill({ json: [] }));
  }
}
