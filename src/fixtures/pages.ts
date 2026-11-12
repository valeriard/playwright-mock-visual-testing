import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { AccountPage } from '../pages/AccountPage';
import { ProductPage } from '../pages/ProductPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { RegisterPage } from '../pages/RegisterPage';
import { PrivacyPage } from '../pages/PrivacyPage';
import { CartPage } from '../pages/CartPage';
import { ContactPage } from '../pages/ContactPage';
import { LoginFlow } from '../flows/LoginFlow';
import { HomeFlow } from '../flows/HomeFlow';
import { ProductFlow } from '../flows/ProductFlow';

interface PageFixtures {
  homePage: HomePage;
  loginPage: LoginPage;
  accountPage: AccountPage;
  productPage: ProductPage;
  forgotPasswordPage: ForgotPasswordPage;
  registerPage: RegisterPage;
  contactPage: ContactPage;
  cartPage: CartPage;
  privacyPage: PrivacyPage;
  loginFlow: LoginFlow;
  homeFlow: HomeFlow;
  productFlow: ProductFlow;
}

/** Page objects and flows only: no API mocking. Visual tests build on this layer. */
export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => use(new HomePage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  accountPage: async ({ page }, use) => use(new AccountPage(page)),
  productPage: async ({ page }, use) => use(new ProductPage(page)),
  forgotPasswordPage: async ({ page }, use) => use(new ForgotPasswordPage(page)),
  registerPage: async ({ page }, use) => use(new RegisterPage(page)),
  contactPage: async ({ page }, use) => use(new ContactPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  privacyPage: async ({ page }, use) => use(new PrivacyPage(page)),
  loginFlow: async ({ homePage, loginPage }, use) => use(new LoginFlow(homePage, loginPage)),
  homeFlow: async ({ homePage }, use) => use(new HomeFlow(homePage)),
  productFlow: async ({ productPage }, use) => use(new ProductFlow(productPage)),
});

export { expect };
