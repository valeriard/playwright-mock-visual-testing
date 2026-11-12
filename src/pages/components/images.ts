import { Page } from '@playwright/test';

/** Product images load lazily; force them eager and wait, so screenshots are not taken mid-load. */
export async function waitForImages(page: Page): Promise<void> {
  await page.evaluate(() => {
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => img.setAttribute('loading', 'eager'));
  });
  await page.waitForFunction(() => Array.from(document.images).every((img) => img.complete));
}
