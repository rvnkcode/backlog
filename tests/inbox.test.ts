// Should run $ yarn prisma migrate reset before running tests
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
	const note = 'test note';
	const dummyUrl = 'http://www.example.com';
	const dummyUrl2 = 'http://www.example2.com';

	test.describe.configure({ mode: 'serial' });

	test.beforeEach(async ({ page }) => {
		await page.getByPlaceholder('New To-Do').fill(task);
		await page.getByLabel('show more inputs button').click();
	});

	test.afterEach(async ({ page }) => {
		// Check the task added to the list
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
		const noteInput = page.getByPlaceholder('Notes');

		await noteInput.fill(note);
		await page.getByLabel('submit').click();

		await expect(noteInput).toBeEmpty();

		const noteIcon = page.locator('label').filter({ hasText: task }).locator('svg');
		await expect(noteIcon).toBeVisible();
		await noteIcon.hover();
		await expect(page.locator('span').filter({ hasText: note })).toBeVisible();
	});

	test('should create a new task with links', async ({ page }) => {
		const showNewUrlInputButton = page.getByLabel('show new url input');
		const urlInput = page.getByPlaceholder('https://www.example.com');

		await showNewUrlInputButton.click();
		await urlInput.fill(dummyUrl);
		await page.getByLabel('confirm the url input', { exact: true }).click();
		await showNewUrlInputButton.click();
		await urlInput.fill(dummyUrl2);
		await page.getByLabel('submit').click();

		// should not show URL input and buttons
		await expect(page.locator('form').getByRole('list')).not.toBeVisible();

		// URL icons
		const urlIcon1 = page.getByLabel(dummyUrl);
		const urlIcon2 = page.getByLabel(dummyUrl2);

		await expect(urlIcon1).toBeVisible();
		await expect(urlIcon2).toBeVisible();
		await urlIcon1.hover();
		await expect(page.locator('span').filter({ hasText: dummyUrl })).toBeVisible();
		await page.getByPlaceholder('New To-Do').click(); // To avoid tooltip intercept pointer events
		await urlIcon2.hover();
		await expect(page.locator('span').filter({ hasText: dummyUrl2 })).toBeVisible();
	});

	test('should create a new task with all additional properties', async ({ page }) => {
		const noteInput = page.getByPlaceholder('Notes');
		const showNewUrlInputButton = page.getByLabel('show new url input');
		const urlInput = page.getByPlaceholder('https://www.example.com');

		await noteInput.fill(note);
		await showNewUrlInputButton.click();
		await urlInput.fill(dummyUrl);
		await page.getByLabel('submit').click();

		await expect(noteInput).toBeEmpty();
		await expect(page.locator('form').getByRole('list')).not.toBeVisible();

		const noteIcon = page.locator('label').filter({ hasText: task }).getByLabel('note icon');
		const urlIcon = page.getByLabel(dummyUrl);
		await expect(noteIcon).toBeVisible();
		await expect(urlIcon).toBeVisible();

		await noteIcon.hover();
		await expect(page.locator('span').filter({ hasText: note })).toBeVisible();
		await page.getByPlaceholder('New To-Do').click(); // To avoid tooltip intercept pointer events
		await urlIcon.hover();
		await expect(page.locator('span').filter({ hasText: dummyUrl })).toBeVisible();
	});
});
