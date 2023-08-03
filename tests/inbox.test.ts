// Should run $ yarn prisma migrate reset before running e2e tests
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test('should have a title', async ({ page }) => {
	await expect(page).toHaveTitle('Backlog: Inbox');
});

test('should display some elements', async ({ page }) => {
	// Headings
	await expect(page.getByRole('heading', { name: 'Backlog', level: 1 })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Inbox', level: 2 })).toBeVisible();

	// Form
	await expect(page.getByPlaceholder('New To-Do')).toBeVisible();
	await expect(page.getByRole('button').first()).toBeVisible();
	await expect(page.getByRole('button').nth(1)).toBeVisible();
});

test('should not have any automatically detectable accessibility issues', async ({ page }) => {
	const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
	expect(accessibilityScanResults.violations).toEqual([]);
});

test(`should display 403 error page`, async ({ page }) => {
	await page.goto('/task/test');
	await expect(page.getByRole('heading', { name: 'Backlog', level: 1 })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Inbox', level: 2 })).not.toBeVisible();
	await expect(page.getByRole('textbox')).not.toBeVisible();
	await expect(page.getByRole('button')).not.toBeVisible();
	await expect(page.getByText('403')).toBeVisible();
	await expect(page.getByText('Not found')).toBeVisible();
});

test.describe('create task tests', () => {
	const task = 'test';

	test.describe.configure({ mode: 'serial' });

	test.beforeAll(async ({ page }) => {
		await page.getByLabel('show more inputs button').click();
	});

	test.beforeEach(async ({ page }) => {
		await page.getByPlaceholder('New To-Do').fill(task);
	});

	test.afterEach(async ({ page }) => {
		// Check task added to the list successfully
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

	test('should create a new task', async ({ page }) => {
		await page.getByPlaceholder('New To-Do').press('Enter');
	});

	test('should create a new task with a note', async ({ page }) => {
		const note = 'test note';
		const noteInput = page.getByPlaceholder('Notes');

		await noteInput.fill(note);
		await page.getByLabel('submit').click();

		await expect(noteInput).toBeEmpty();

		const noteIcon = page.locator('label').filter({ hasText: task }).locator('svg');
		await expect(noteIcon).toBeVisible();
		await noteIcon.hover();
		await expect(page.locator('span').filter({ hasText: note })).toBeVisible();
	});

	// TODO: should create a new task with links
});
