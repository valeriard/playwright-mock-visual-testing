import { Page } from '@playwright/test';
import { API_URL } from './ApiMock';

/** The detail page always asks for related products; answer it so no test reaches the real API. */
export async function stubRelatedProducts(
  page: Page,
  productId: string,
  relacionados: object[] = [],
): Promise<void> {
  await page.route(`${API_URL}/products/${productId}/related`, (route) =>
    route.fulfill({ json: relacionados }),
  );
}
