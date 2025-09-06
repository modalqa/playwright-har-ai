import { test, expect } from '@playwright/test';
import path from 'path';

test('UI test with HAR', async ({ browser }) => {
  const harFilePath = path.join(__dirname, '../results/test.har');

  const context = await browser.newContext({
    recordHar: { path: harFilePath, mode: 'full' }
  });

  const page = await context.newPage();
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await expect(page).toHaveURL(/inventory/);

  await context.close();
});
