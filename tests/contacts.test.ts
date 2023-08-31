// Should run $ yarn prisma migrate reset before running tests
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });

test.beforeEach(async ({ page }) => {
  await page.goto('/settings');
});

test('should have a title', async ({ page }) => {
  await expect(page).toHaveTitle('Backlog: Settings');
});

test('should display page elements', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Settings' }).locator('span')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Contacts' })).toBeVisible();
  await expect(
    page.getByRole('main').locator('div').filter({ hasText: 'Select all Deactivated' })
  ).toBeVisible();
  await expect(
    page.getByRole('main').locator('div').filter({ hasText: 'Select all Activated' })
  ).toBeVisible();
  await expect(page.getByLabel('Activate contact', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Deactivate contact', { exact: true })).toBeVisible();
});

test('should not have any automatically detectable accessibility issues', async ({ page }) => {
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  await page.getByLabel('Toggle hamburger menu button').click();
  expect(accessibilityScanResults.violations).toEqual([]);
});

test.describe('contact CRUD test on the activated list', () => {
  test.describe.configure({ mode: 'serial' });
  const task = 'Fight for the dragon!';
  const contact = 'janny';
  const updatedContact = 'Jake';

  test('should display new contact on the activated contacts list', async ({ page }) => {
    // Add new task with new contact
    await page.getByRole('link', { name: 'Backlog' }).click();
    await page.getByPlaceholder('New To-Do').fill(task);
    await page.getByLabel('show more inputs button').click();
    await page.getByLabel('show allocated to input', { exact: true }).click();
    await page.getByPlaceholder('Allocated to...').fill(contact);
    await page.getByLabel('submit').click();
    await page.getByRole('link', { name: 'Settings icon Settings' }).click();

    await expect(
      page
        .getByRole('main')
        .locator('div')
        .filter({ hasText: 'Select all Activated' })
        .locator('ul')
        .getByText(contact)
    ).toBeVisible();
    await expect(
      page.locator('li').filter({ hasText: contact }).getByRole('button', { name: 'Rename' })
    ).toBeVisible();
    await expect(
      page.locator('li').filter({ hasText: contact }).getByRole('button', { name: 'Remove' })
    ).toBeVisible();
  });

  test('should not update the contact', async ({ page }) => {
    await page
      .locator('li')
      .filter({ hasText: contact })
      .getByRole('button', { name: 'Rename' })
      .click();
    expect(await page.getByPlaceholder('Enter the new name').inputValue()).toStrictEqual(contact);

    await page.getByPlaceholder('Enter the new name').fill(updatedContact);
    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(page.getByText(updatedContact)).not.toBeVisible();

    await page
      .locator('li')
      .filter({ hasText: contact })
      .getByRole('button', { name: 'Rename' })
      .click();
    expect(await page.getByPlaceholder('Enter the new name').inputValue()).toStrictEqual(contact);
  });

  test('should rename the contact', async ({ page }) => {
    await page
      .locator('li')
      .filter({ hasText: contact })
      .getByRole('button', { name: 'Rename' })
      .click();
    await page.getByPlaceholder('Enter the new name').fill(updatedContact);
    await page.getByRole('button', { name: 'Confirm' }).click();

    await expect(page.getByText(contact)).not.toBeVisible();
    await expect(page.getByText(updatedContact)).toBeVisible();

    await page
      .locator('li')
      .filter({ hasText: updatedContact })
      .getByRole('button', { name: 'Rename' })
      .click();
    expect(await page.getByPlaceholder('Enter the new name').inputValue()).toStrictEqual(
      updatedContact
    );
  });

  test('should display renamed contact on the waiting for page', async ({ page }) => {
    await page.goto('/waiting_for');
    expect(
      await page.locator('li').filter({ hasText: task }).locator('span').innerText()
    ).toStrictEqual(updatedContact);
  });

  test('should not delete the contact', async ({ page }) => {
    await page.locator('li').filter({ hasText: updatedContact }).getByRole('button', { name: 'Remove' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByText(updatedContact)).toBeVisible();
  })

  test('should remove contact', async ({ page }) => {
    await page.locator('li').filter({ hasText: updatedContact }).getByRole('button', { name: 'Remove' }).click();

    await page.getByRole('button', { name: 'OK' }).click();
    // TODO
  });

  // TODO:
  // should task moved to the inbox list
});

// test.describe('contact CRUD test on the deactivate list', () => {});

// should deactivate single contact
// should not display deactivated contact on the input list // Can I test this?
// CRUD on the deactivated list

// should check all checkbox on the list(activated)
// should check all checkbox on the list(deactivated)
// should activate single contact
// should deactivate multiple contact
// should activate multiple contact
// should deactivate all contact
// should activate all contact
