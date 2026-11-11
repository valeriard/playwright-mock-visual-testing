import path from 'node:path';
import * as allure from 'allure-js-commons';
import { Locator, Page } from '@playwright/test';
import { test as pagesTest, expect } from '../../src/fixtures/pages';
import { ViewportName, viewportLabel } from '../../src/visual/viewports';

/*
 * Everything the visual specs need, in one place. Visual tests do NOT use API mocks:
 * they build on the page-object fixtures only (src/fixtures/pages.ts).
 */

// ---------------------------------------------------------------------------------------------
// Baseline names
// ---------------------------------------------------------------------------------------------

/**
 * Descriptive baseline names: <screen>-<what is captured>-<state>.
 * VisualChecker appends the viewport, e.g. "login-form-required-fields-error-mobile-375x812.png".
 */
export const BASELINES = {
  HOME_PAGE_INITIAL: 'home-page-initial-load',
  LOGIN_FORM_REQUIRED_FIELDS: 'login-form-required-fields-error',
} as const;

// ---------------------------------------------------------------------------------------------
// Masks
// ---------------------------------------------------------------------------------------------

/** Home page elements whose content changes between runs or deployments. */
export function homeVolatileRegions(page: Page): Locator[] {
  return [
    page.getByTestId('notification-bar'),
    page.getByTestId('course-promo'),
    page.getByText(/Built \d{4}-\d{2}-\d{2}/),
  ];
}

// ---------------------------------------------------------------------------------------------
// Screenshot comparison and the waits that happen before every capture
// ---------------------------------------------------------------------------------------------

export interface VisualOptions {
  /** Regions covered with a solid box so volatile content does not cause false diffs. */
  mask?: Locator[];
}

/** Applied to EVERY screenshot; the only place where the comparison policy lives. */
const COMPARISON = {
  animations: 'disabled',
  maxDiffPixelRatio: 0.01,
  stylePath: path.resolve(__dirname, 'hide-floating-widgets.css'),
} as const;

/**
 * Single place that decides HOW screenshots are compared. Specs only say WHAT to compare
 * (a descriptive baseline name); the viewport label is appended automatically.
 */
export class VisualChecker {
  constructor(
    private readonly page: Page,
    private readonly viewport: ViewportName,
  ) {}

  /** Full-page screenshot of the current page against its baseline. */
  async matchPage(baseline: string, { mask = [] }: VisualOptions = {}): Promise<void> {
    await this.page.locator('body').waitFor({ state: 'visible' });
    await this.waitForFonts();
    await expect(this.page).toHaveScreenshot(this.fileName(baseline), {
      ...COMPARISON,
      fullPage: true,
      mask,
    });
  }

  /** Screenshot of a single element against its baseline. */
  async matchElement(target: Locator, baseline: string, { mask = [] }: VisualOptions = {}): Promise<void> {
    await target.waitFor({ state: 'visible' });
    await this.waitForFonts();
    await expect(target).toHaveScreenshot(this.fileName(baseline), { ...COMPARISON, mask });
  }

  private fileName(baseline: string): string {
    return `${baseline}-${viewportLabel(this.viewport)}.png`;
  }

  private async waitForFonts(): Promise<void> {
    await this.page.evaluate(() => document.fonts.ready);
  }
}

// ---------------------------------------------------------------------------------------------
// Allure labels shared by every visual spec
// ---------------------------------------------------------------------------------------------

interface VisualLabels {
  feature: string;
  subSuite: string;
  tags?: string[];
}

/** Call from `test.beforeEach`; groups the test under Visual > <feature> > <subSuite> in Allure. */
export async function labelVisualTest({ feature, subSuite, tags = [] }: VisualLabels): Promise<void> {
  await allure.epic('Toolshop');
  await allure.feature(feature);
  await allure.parentSuite('Visual');
  await allure.suite(feature);
  await allure.subSuite(subSuite);
  await allure.tags('visual', ...tags);
}

// ---------------------------------------------------------------------------------------------
// Test with the `visual` fixture (viewport comes from the project's metadata, see config)
// ---------------------------------------------------------------------------------------------

interface VisualFixtures {
  visual: VisualChecker;
}

export const test = pagesTest.extend<VisualFixtures>({
  visual: async ({ page }, use, testInfo) => {
    const viewport = testInfo.project.metadata.viewport as ViewportName;
    await use(new VisualChecker(page, viewport));
  },
});

export { expect };
