import { Page } from '@playwright/test';
import { API_URL } from './ApiMock';

/** The detail page always asks for related products; keep it deterministic and offline. */
export async function stubRelatedProducts(page: Page, productId: string): Promise<void> {
  await page.route(`${API_URL}/products/${productId}/related`, (route) => route.fulfill({ json: [] }));
}
