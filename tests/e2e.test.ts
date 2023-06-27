// Run $ yarn prisma migrate reset before running e2e tests
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test('should have page title', async ({ page }) => {
	await expect(page).toHaveTitle(/Inbox/);
});

test(`should display elements`, async ({ page }) => {
	await expect(page.getByRole('heading', { name: 'Backlog', level: 1 })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Inbox', level: 2 })).toBeVisible();
	await expect(page.getByPlaceholder('New To-Do')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
	await expect(page.getByRole('list')).toBeVisible();
	await expect(page.locator('ul > li > span')).toHaveText(['This is the sample task']);
	await expect(page.locator('ul > li > input')).toHaveAttribute('type', 'checkbox');
});

test(`should create a task with enter key`, async ({ page }) => {
	const input = page.getByPlaceholder('New To-Do');
	const mockedTask = `test`;

	await input.fill(mockedTask);
	await input.press('Enter');
	await expect(input).toBeEmpty();
	await expect(page.locator('ul > li')).toHaveText([`This is the sample task`, mockedTask]);

	const checkbox = page.getByLabel(mockedTask);
	await expect(checkbox).toBeAttached();
	await expect(checkbox).toHaveAttribute('type', 'checkbox');
	await expect(checkbox).toBeEditable();
});

test(`should create a task with submit button`, async ({ page }) => {
	const input = page.getByPlaceholder(`New To-Do`);
	const submitButton = page.getByRole(`button`, { name: `Add` });
	const mockedTask = `test2`;

	await input.fill(mockedTask);
	await submitButton.click();
	await expect(input).toBeEmpty();
	await expect(page.locator('ul > li')).toHaveText([`This is the sample task`, `test`, mockedTask]);

	const checkbox = page.getByLabel(mockedTask);
	await expect(checkbox).toBeAttached();
	await expect(checkbox).toHaveAttribute('type', 'checkbox');
	await expect(checkbox).toBeEditable();
});
