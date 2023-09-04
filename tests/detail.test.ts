// Should run $ yarn prisma migrate reset before running tests
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const sampleTask = 'This is the sample task';

test.describe.configure({ mode: 'parallel' });

test.beforeEach(async ({ page }) => {
  await page.goto('/task/1');
});

test('should go to the main page and go back to the task detail page', async ({ page }) => {
  await page.getByRole('link', { name: 'Backlog', exact: true }).click();

  await expect(page).toHaveTitle('Backlog: Inbox');

  await page.getByRole('link', { name: sampleTask }).click();
  await expect(page).toHaveURL(/.task\/1/);
});

test('should not have any automatically detectable accessibility issues', async ({ page }) => {
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});

test.describe('Run in sequence', () => {
  test.describe.configure({ mode: 'serial' });

  test(`should display detail page's elements`, async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Backlog', level: 1 })).toBeVisible();
    expect(await page.getByPlaceholder('New To-Do').inputValue()).toStrictEqual(sampleTask);
    await expect(page.getByLabel('submit')).toBeVisible();
    expect(await page.getByPlaceholder('Notes').inputValue()).toStrictEqual('Some note test');
    await expect(
      page.locator('li').filter({ hasText: 'https://github.com/rvnkcode/backlog' })
    ).toBeVisible();
    await expect(
      page
        .locator('li')
        .filter({ hasText: 'https://hub.docker.com/repository/docker/rvnk/backlog/general' })
    ).toBeVisible();
    await expect(page.getByLabel('show new url input')).toBeVisible();
  });

  test('should not update task', async ({ page }) => {
    const titleInput = page.getByPlaceholder('New To-Do');
    const noteInput = page.getByPlaceholder('Notes');

    await titleInput.fill('asdf');
    await noteInput.clear();
    // Remove URLs from the list
    await page
      .locator('li')
      .filter({ hasText: 'https://github.com/rvnkcode/backlog' })
      .getByLabel('remove url from the list')
      .click();
    await page
      .locator('li')
      .filter({ hasText: 'https://hub.docker.com/repository/docker/rvnk/backlog/general' })
      .getByLabel('remove url from the list')
      .click();
    await page.reload();

    expect(await page.getByPlaceholder('New To-Do').inputValue()).toStrictEqual(sampleTask);
    expect(await page.getByPlaceholder('Notes').inputValue()).toStrictEqual('Some note test');
    await expect(
      page.locator('li').filter({ hasText: 'https://github.com/rvnkcode/backlog' })
    ).toBeVisible();
    await expect(
      page
        .locator('li')
        .filter({ hasText: 'https://hub.docker.com/repository/docker/rvnk/backlog/general' })
    ).toBeVisible();
  });

  test('should update title', async ({ page }) => {
    const newValue = 'Updated task';
    const titleInput = page.getByPlaceholder('New To-Do');
    await titleInput.fill(newValue);
    await page.getByLabel('submit').click();

    await expect(page.getByText('The task was updated successfully!')).toBeVisible(); // Toast notification
    expect(await titleInput.inputValue()).toStrictEqual(newValue);

    await page.goto('/');
    await expect(page.getByRole('link', { name: newValue })).toBeVisible();
  });

  test('should update note', async ({ page }) => {
    const newValue = 'Updated note';
    const noteInput = page.getByPlaceholder('Notes');
    await noteInput.fill(newValue);
    await page.getByLabel('submit').click();

    await expect(page.getByText('The task was updated successfully!')).toBeVisible(); // Toast notification
    expect(await noteInput.inputValue()).toStrictEqual(newValue);

    await page.goto('/');
    await page.locator('label').filter({ hasText: 'Updated task' }).getByLabel('note icon').hover();
    await expect(page.locator('span').filter({ hasText: newValue })).toBeVisible();
  });

  test('should clear the note', async ({ page }) => {
    const noteInput = page.getByPlaceholder('Notes');
    await noteInput.clear();
    await page.getByLabel('submit').click();

    await expect(page.getByText('The task was updated successfully!')).toBeVisible(); // Toast notification
    expect(await noteInput.inputValue()).toEqual('');

    await page.goto('/');
    await expect(
      page.locator('label').filter({ hasText: 'Updated task' }).getByLabel('note icon')
    ).not.toBeVisible();
  });

  test('should add note to the exist task', async ({ page }) => {
    const newValue = 'Added note';
    const noteInput = page.getByPlaceholder('Notes');

    expect(await noteInput.inputValue()).toEqual('');

    await noteInput.fill(newValue);
    await page.getByLabel('submit').click();

    await expect(page.getByText('The task was updated successfully!')).toBeVisible(); // Toast notification
    expect(await noteInput.inputValue()).toStrictEqual(newValue);

    await page.goto('/');
    await page.locator('label').filter({ hasText: 'Updated task' }).getByLabel('note icon').hover();
    await expect(page.locator('span').filter({ hasText: newValue })).toBeVisible();
  });

  test('should remove URL', async ({ page }) => {
    await page
      .locator('li')
      .filter({ hasText: 'https://github.com/rvnkcode/backlog' })
      .getByLabel('remove url from the list')
      .click();
    await page
      .locator('li')
      .filter({ hasText: 'https://hub.docker.com/repository/docker/rvnk/backlog/general' })
      .getByLabel('remove url from the list')
      .click();

    await expect(page.getByRole('form').getByRole('list')).not.toBeVisible();

    await page.getByLabel('submit').click();

    await expect(page.getByText('The task was updated successfully!')).toBeVisible(); // Toast notification
    await expect(page.getByRole('form').getByRole('list')).not.toBeVisible();

    await page.goto('/');
    await expect(page.getByLabel('https://github.com/rvnkcode/backlog')).not.toBeVisible();
    await expect(
      page.getByLabel('https://hub.docker.com/repository/docker/rvnk/backlog/general')
    ).not.toBeVisible();
  });

  test('should add the URL to the exist task', async ({ page }) => {
    const dummyUrl = 'https://www.example.com';

    await page.getByLabel('show new url input').click();
    await page.getByPlaceholder('https://www.example.com').fill(dummyUrl);
    await page.getByLabel('submit').click();

    await expect(page.getByText('The task was updated successfully!')).toBeVisible(); // Toast notification
    await expect(page.getByRole('link', { name: dummyUrl })).toBeVisible();
    await expect(page.getByPlaceholder('https://www.example.com')).not.toBeVisible();
    await expect(page.getByLabel('confirm the url input', { exact: true })).not.toBeVisible();
    await expect(page.getByLabel('edit url', { exact: true })).toBeVisible();
    await expect(page.getByLabel('remove url from the list')).toBeVisible();

    await page.goto('/');
    await expect(page.getByLabel(dummyUrl)).toBeVisible();
  });

  test('should update the URL', async ({ page }) => {
    const dummyUrl = 'https://www.updated.com';

    await page.getByLabel('edit url', { exact: true }).click();
    await page.getByPlaceholder('https://www.example.com').fill(dummyUrl);
    await page.getByLabel('submit').click();

    await expect(page.getByText('The task was updated successfully!')).toBeVisible(); // Toast notification
    await expect(page.getByRole('link', { name: dummyUrl })).toBeVisible();

    await page.goto('/');
    await expect(page.getByLabel(dummyUrl)).toBeVisible();
  });
});

test.describe('Allocated to test', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/task/5');
  });

  test('should display allocated to input and value', async ({ page }) => {
    expect(await page.getByPlaceholder('Allocated to...').inputValue()).toStrictEqual('Name');
  });

  test('should update name of allocator', async ({ page }) => {
    const value = 'farenheart';
    const allocatedToInput = page.getByPlaceholder('Allocated to...');

    await allocatedToInput.fill(value);
    await page.getByLabel('submit').click();

    await expect(page.getByText('The task was updated successfully!')).toBeVisible(); // Toast notification
    expect(await allocatedToInput.inputValue()).toStrictEqual(value);
    await page.goto('/waiting_for');
    await expect(page.getByText(value)).toBeVisible();
  });

  test('should remove name of allocator', async ({ page }) => {
    const allocatedToInput = page.getByPlaceholder('Allocated to...');
    await allocatedToInput.clear();
    await page.getByLabel('submit').click();

    await expect(page.getByText('The task was updated successfully!')).toBeVisible(); // Toast notification
    expect(await allocatedToInput.inputValue()).toEqual('');
    await page.goto('/waiting_for');
    await expect(page.getByRole('link', { name: 'Allocated task' })).not.toBeVisible();
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Allocated task' })).toBeVisible();
  });

  test('should allocate task to someone and display it waiting for page', async ({ page }) => {
    const allocatedToInput = page.getByPlaceholder('Allocated to...');
    const value = 'Name';
    await allocatedToInput.fill(value);
    await page.getByLabel('submit').click();

    await expect(page.getByText('The task was updated successfully!')).toBeVisible(); // Toast notification
    expect(await allocatedToInput.inputValue()).toStrictEqual(value);
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Allocated task' })).not.toBeVisible();
    await page.goto('/waiting_for');
    await expect(page.getByRole('link', { name: 'Allocated task' })).toBeVisible();
    await expect(page.getByText(value)).toBeVisible();
  });
});
