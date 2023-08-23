// Should run $ yarn prisma migrate reset before running tests
import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Toggle hamburger menu button').click();
});

test('Should toggle side menu', async ({ page }) => {
  await expect(page.getByRole('link', { name: 'inbox menu file tray icon Inbox 2' })).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'waiting for menu icon Waiting for 1' })
  ).toBeVisible();
  // TODO: Add navigation menus

  await page.getByLabel('Toggle hamburger menu button').click();
  await expect(
    page.getByRole('link', { name: 'inbox menu file tray icon Inbox 2' })
  ).not.toBeVisible();
  await expect(
    page.getByRole('link', { name: 'waiting for menu icon Waiting for 1' })
  ).not.toBeVisible();
});

test('Should navigate to the waiting for page', async ({ page }) => {
  await page.getByRole('link', { name: 'waiting for menu icon Waiting for 1' }).click();

  await expect(page).toHaveTitle('Backlog: Waiting for');
  await expect(
    page.getByRole('heading', { name: 'Waiting for page title icon Waiting for' })
  ).toBeVisible();
  await expect(page.getByPlaceholder('New To-Do')).toBeVisible();
  await expect(page.getByRole('button').first()).toBeVisible();
  await expect(page.getByRole('button').nth(1)).toBeVisible();
});

test('Should navigate to the inbox page', async ({ page }) => {
  await page.getByRole('link', { name: 'inbox menu file tray icon Inbox 2' }).click();
  await expect(page.getByRole('heading', { name: 'Inbox', level: 2 })).toBeVisible();
});
