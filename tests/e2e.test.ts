// Should run $ yarn prisma migrate reset before running e2e tests
import { expect, test } from '@playwright/test';

// Global const
const tasks = [
	`This is the sample task`,
	`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
	`test`
];
const updateValue = `Completely different value`;

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test(`should have a title`, async ({ page }) => {
	await expect(page).toHaveTitle('Backlog: Inbox');
});

test(`should display some elements`, async ({ page }) => {
	await expect(page.getByRole('heading', { name: 'Backlog', level: 1 })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Inbox', level: 2 })).toBeVisible();

	await expect(page.getByPlaceholder('New To-Do')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();

	await expect(page.getByRole('list')).toBeVisible();
	await expect(page.locator('ul > li > label > a')).toHaveText([tasks[0], tasks[1]]);

	const checkbox = page.getByLabel(tasks[0]);
	await expect(checkbox).toHaveAttribute('type', 'checkbox');
	expect(await checkbox.isChecked()).toBeFalsy();
});

test(`should create a task`, async ({ page }) => {
	const input = page.getByPlaceholder('New To-Do');

	await input.fill(tasks[2]);
	await input.press('Enter');
	await expect(input).toBeEmpty();
	await expect(page.locator('ul > li > label > a')).toHaveText(tasks);

	const checkbox = page.getByLabel(tasks[2]);
	await expect(checkbox).toHaveAttribute('type', 'checkbox');
	expect(await checkbox.isChecked()).toBeFalsy();
});

test(`should go to the task detail page`, async ({ page }) => {
	const links = page.getByRole('link');

	await links.nth(0).click();
	await expect(page).toHaveURL(/.task\/1/);
	await expect(page.getByRole('heading', { name: 'Backlog', level: 1 })).toBeVisible();
	expect(await page.getByRole('textbox').inputValue()).toStrictEqual(tasks[0]);
	await expect(page.getByRole('button', { name: 'Update' })).toBeVisible();
});

test(`should update task's title`, async ({ page }) => {
	const link = page.getByRole('link', { name: tasks[2] });
	await link.click();
	await expect(page).toHaveURL(/.task\/3/);

	const input = page.getByRole('textbox');
	await input.fill(updateValue);
	await input.press(`Enter`);
	expect(await input.inputValue()).toStrictEqual(updateValue);

	await page.goBack();
	await expect(page.locator('ul > li')).toHaveText([tasks[0], tasks[1], updateValue]);
});

test(`should display updated list`, async ({ page }) => {
	await expect(page.locator('ul > li')).toHaveText([tasks[0], tasks[1], updateValue]);
});

test(`should display 403 error page`, async ({ page }) => {
	await page.goto('/task/99');
	await expect(page.getByRole('heading', { name: 'Backlog', level: 1 })).toBeVisible();
	await expect(page.getByRole('textbox')).not.toBeVisible();
	await expect(page.getByRole('button')).not.toBeVisible();
	await expect(page.getByText('403')).toBeVisible();
	await expect(page.getByText('Not found')).toBeVisible();
});

// TODO:
// test update task's status
