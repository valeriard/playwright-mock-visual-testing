import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { Credentials } from '../data/users';

/** Business flows compose page objects; tests describe intent, not clicks. */
export class LoginFlow {
  constructor(
    private readonly home: HomePage,
    private readonly login: LoginPage,
  ) {}

  async openFromHome(): Promise<void> {
    await this.home.goto();
    await this.home.navBar.goToSignIn();
    await this.login.form.waitFor();
  }

  async loginAs(credentials: Credentials): Promise<void> {
    await this.openFromHome();
    await this.login.fillCredentials(credentials);
    await this.login.submit();
  }

  async submitEmptyForm(): Promise<void> {
    await this.openFromHome();
    await this.login.submit();
  }
}
