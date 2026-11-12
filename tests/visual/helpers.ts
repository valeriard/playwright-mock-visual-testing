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
  LOGIN_FORM_INITIAL: 'login-form-initial-state',
  NAVBAR_SIGNED_OUT: 'navbar-signed-out',
  NAVBAR_MOBILE_MENU_OPEN: 'navbar-mobile-menu-open',
  FOOTER_DEFAULT: 'footer-default',
  HOME_BANNER: 'home-banner',
  HOME_SEARCH_BOX: 'home-search-box',
  HOME_SORT_SELECT: 'home-sort-select',
  HOME_FILTERS_PANEL: 'home-filters-panel',
  HOME_PRODUCT_CARD: 'home-product-card-default',
  HOME_PAGINATION_FIRST_PAGE: 'home-pagination-first-page',
  HOME_PRODUCT_CARD_OUT_OF_STOCK: 'home-product-card-out-of-stock',
  HOME_PRODUCT_CARD_LONG_NAME: 'home-product-card-long-name',
  HOME_PAGE_EMPTY_LIST: 'home-page-empty-list',
  HOME_PAGE_LOADING: 'home-page-loading-skeleton',
  HOME_PAGE_LIST_SERVER_ERROR: 'home-page-list-server-error',
  PRODUCT_DETAIL_MAIN_BLOCK_OUT_OF_STOCK: 'product-detail-main-block-out-of-stock',
  PRODUCT_DETAIL_MAIN_BLOCK_LONG_NAME: 'product-detail-main-block-long-name',
  PRODUCT_DETAIL_RELATED_EMPTY: 'product-detail-related-products-empty',
  PRODUCT_DETAIL_RELATED_SERVER_ERROR: 'product-detail-related-products-server-error',
  PRODUCT_DETAIL_NOT_FOUND: 'product-detail-page-not-found',
  PRODUCT_DETAIL_SERVER_ERROR: 'product-detail-page-server-error',
  LOGIN_FORM_INVALID_CREDENTIALS: 'login-form-invalid-credentials-error',
  LOGIN_FORM_SERVER_ERROR: 'login-form-server-error',
  FORGOT_PASSWORD_PAGE: 'forgot-password-page-default',
  REGISTER_PAGE: 'register-page-default',
  REGISTER_PAGE_REQUIRED_FIELDS: 'register-page-required-fields-error',
  CONTACT_PAGE: 'contact-page-default',
  CONTACT_PAGE_REQUIRED_FIELDS: 'contact-page-required-fields-error',
  NAVBAR_SIGNED_IN: 'navbar-signed-in',
  NAVBAR_USER_MENU_OPEN: 'navbar-user-menu-open',
  NAVBAR_CATEGORIES_MENU_OPEN: 'navbar-categories-menu-open',
  ACCOUNT_PAGE: 'account-page-default',
  ACCOUNT_FAVORITES_PAGE: 'account-favorites-page-with-products',
  ACCOUNT_FAVORITES_EMPTY_PAGE: 'account-favorites-page-empty',
  ACCOUNT_PROFILE_PAGE: 'account-profile-page-default',
  ACCOUNT_INVOICES_PAGE: 'account-invoices-page-with-data',
  ACCOUNT_MESSAGES_EMPTY_PAGE: 'account-messages-page-empty',
  CART_WIZARD_WITH_ITEM: 'cart-wizard-with-one-item',
  CART_WIZARD_SIGN_IN_STEP: 'cart-wizard-sign-in-step',
  LANGUAGE_MENU_OPEN: 'language-menu-open',
  NAVBAR_LINK_HOVER: 'navbar-link-hover',
  NAVBAR_LINK_KEYBOARD_FOCUS: 'navbar-link-keyboard-focus',
  HOME_SEARCH_BOX_WITH_TEXT: 'home-search-box-with-text',
  HOME_SEARCH_BOX_FOCUS: 'home-search-box-focus',
  LOGIN_FORM_FIELD_FOCUS: 'login-form-field-focus',
  LOGIN_FORM_BUTTON_HOVER: 'login-form-button-hover',
  PRIVACY_PAGE: 'privacy-page-default',
  HOME_PRODUCT_CARD_HOVER: 'home-product-card-hover',
  HOME_PRODUCT_CARD_ZERO_PRICE: 'home-product-card-zero-price',
  HOME_PRODUCT_GRID_CO2_RATINGS: 'home-product-grid-co2-ratings',
  HOME_FILTERS_PANEL_SELECTED: 'home-filters-panel-selected',
  HOME_PRICE_SLIDER_CHANGED: 'home-price-slider-changed',
  HOME_PAGINATION_MIDDLE_PAGE: 'home-pagination-middle-page',
  CATEGORY_RENTALS_PAGE: 'category-rentals-page',
  PRODUCT_DETAIL_QUANTITY_CHANGED: 'product-detail-quantity-changed',
  PRODUCT_DETAIL_ADD_TO_CART_HOVER: 'product-detail-add-to-cart-hover',
  PRODUCT_DETAIL_ADDED_TOAST: 'product-detail-added-toast',
  PRODUCT_DETAIL_MAIN_BLOCK_ZERO_PRICE: 'product-detail-main-block-zero-price',
  ACCOUNT_PROFILE_PASSWORD_SECTION: 'account-profile-password-section',
  ACCOUNT_PROFILE_TWO_FACTOR_SECTION: 'account-profile-two-factor-section',
  ACCOUNT_INVOICES_PAGINATION: 'account-invoices-pagination',
  CART_WIZARD_BILLING_STEP: 'cart-wizard-billing-step',
  CART_WIZARD_PAYMENT_STEP: 'cart-wizard-payment-step',
  PRODUCT_DETAIL_PAGE: 'product-detail-page-default',
  PRODUCT_DETAIL_MAIN_BLOCK: 'product-detail-main-block',
  PRODUCT_DETAIL_QUANTITY: 'product-detail-quantity-control',
  PRODUCT_DETAIL_BUTTONS: 'product-detail-purchase-buttons',
  PRODUCT_DETAIL_SPECS: 'product-detail-specs',
  PRODUCT_DETAIL_RELATED: 'product-detail-related-products',
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
