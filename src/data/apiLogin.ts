import { APIRequestContext, Page } from '@playwright/test';
import { API_URL } from './realApi';
import { Credentials } from './users';

/** Logs in against the REAL API and returns the access token (no browser navigation involved). */
export async function loginViaApi(request: APIRequestContext, user: Credentials): Promise<string> {
  const response = await request.post(`${API_URL}/users/login`, { data: user });
  if (!response.ok()) {
    throw new Error(`API login failed: ${response.status()} ${response.statusText()}`);
  }
  return (await response.json()).access_token as string;
}

/** Makes the front start already signed in: the token is in localStorage before any page script runs. */
export async function startSignedIn(page: Page, token: string): Promise<void> {
  await page.addInitScript((t) => localStorage.setItem('auth-token', t), token);
}
