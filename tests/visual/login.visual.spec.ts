import * as allure from 'allure-js-commons';
import { BASELINES, labelVisualTest, test } from './helpers';

// Runs once per viewport project (desktop 1280x720 and mobile 375x812).
test.describe('Login - visual', () => {
  test.beforeEach(() => labelVisualTest({ feature: 'Authentication', subSuite: 'Login', tags: ['validation'] }));

  test('required-field messages match baseline', async ({ loginFlow, loginPage, visual }) => {
    await allure.story('Required field validation');
    await allure.severity('normal');

    await loginFlow.submitEmptyForm();
    await visual.matchElement(loginPage.form, BASELINES.LOGIN_FORM_REQUIRED_FIELDS);
  });
});
