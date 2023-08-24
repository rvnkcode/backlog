import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });

test.beforeEach(async ({ page }) => {
  await page.goto('/waiting_for');
});

test('should not have any automatically detectable accessibility issues', async ({ page }) => {
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});

test.describe('create task with allocated to property', () => {
  const task = 'Allocated to test task';
  const note = 'Allocated to test note';
  const dummyUrl = 'http://www.allocated.com';
  const contact = 'Test';
  const newContact = 'New contact';

  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await page.getByPlaceholder('New To-Do').fill(task);
    await page.getByLabel('show more inputs button').click();
    await page.getByLabel('show allocated to input', { exact: true }).click();
  });

  test('should create a new task', async ({ page }) => {
    await page.getByPlaceholder('Allocated to...').fill(contact);
    await page.getByLabel('submit').click();

    await expect(page.getByPlaceholder('Allocated to...')).toBeEmpty();
    await expect(page.locator('label').filter({ hasText: task }).locator('span')).toBeVisible();
  });

  test('shoudl create a new task with new contact', async ({ page }) => {
    await page.getByPlaceholder('Allocated to...').fill(newContact);
    await page.getByLabel('submit').click();

    await expect(page.getByPlaceholder('Allocated to...')).toBeEmpty();
    await expect(page.getByText(newContact)).toBeVisible();
  });

  test('should create a new task with other properties', async ({ page }) => {
    await page.getByPlaceholder('Allocated to...').fill(contact);

    const noteInput = page.getByPlaceholder('Notes');
    const showNewUrlInputButton = page.getByLabel('show new url input');
    const urlInput = page.getByPlaceholder('https://www.example.com');

    await noteInput.fill(note);
    await showNewUrlInputButton.click();
    await urlInput.fill(dummyUrl);
    await page.getByLabel('submit').click();

    await expect(noteInput).toBeEmpty();
    await expect(page.locator('form').getByRole('list')).not.toBeVisible();
    await expect(page.getByPlaceholder('Allocated to...')).toBeEmpty();

    const noteIcon = page.locator('label').filter({ hasText: task }).getByLabel('note icon');
    const urlIcon = page.getByLabel(dummyUrl);
    await expect(noteIcon).toBeVisible();
    await expect(urlIcon).toBeVisible();
    await expect(page.locator('label').filter({ hasText: task }).locator('span')).toBeVisible();

    await noteIcon.hover();
    await expect(page.locator('span').filter({ hasText: note })).toBeVisible();
    await page.getByPlaceholder('New To-Do').click(); // To avoid tooltip intercept pointer events
    await urlIcon.hover();
    await expect(page.locator('span').filter({ hasText: dummyUrl })).toBeVisible();
  });

  test('should not display created task without allocated to property', async ({ page }) => {
    await page.getByLabel('submit').click();
    await expect(page.getByRole('link', { name: task })).not.toBeVisible();

    // Go to the inbox page
    await page.getByLabel('Toggle hamburger menu button').click();
    await page.locator('aside > nav > ul > li').filter({ hasText: 'inbox' }).click();
  });

  test.afterEach(async ({ page }) => {
    await expect(page.getByPlaceholder('New To-Do')).toBeEmpty();
    await expect(page.getByRole('link', { name: task })).toBeVisible();

    const checkbox = page.getByLabel(task);
    await expect(checkbox).toHaveAttribute('type', 'checkbox');
    expect(await checkbox.isChecked()).toBeFalsy();

    // Delete task
    const newItem = page.locator('li').filter({ hasText: task });
    await newItem.hover();
    await newItem.getByRole('button', { name: 'delete task' }).click();
    await expect(page.getByRole('link', { name: task })).not.toBeVisible();
  });
});
