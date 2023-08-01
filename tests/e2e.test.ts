// Should run $ yarn prisma migrate reset before running e2e tests
import { expect, test } from '@playwright/test';

import { inboxTitles as tasks, trashTitles as trashes } from './const';

// Global const
const updateValue = `Completely different value`;

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test(`should have a title`, async ({ page }) => {
	await expect(page).toHaveTitle('Backlog: Inbox');
});

test(`should display some elements`, async ({ page }) => {
	// Headings
	await expect(page.getByRole('heading', { name: 'Backlog', level: 1 })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Inbox', level: 2 })).toBeVisible();

	// Form
	await expect(page.getByPlaceholder('New To-Do')).toBeVisible();
	await expect(page.getByTestId('show-more-button')).toBeVisible();
	await expect(page.locator('button[type="submit"]')).toBeVisible();

	// List
	await expect(page.getByRole('list')).toBeVisible();
	await expect(page.locator('ul > li > label > a')).toHaveText([tasks[0], tasks[1], tasks[2]]);
	await expect(page.locator(`ul > li > label > a`)).not.toHaveText(trashes);

	const checkboxes = page.getByRole('checkbox');
	expect(await checkboxes.count()).toEqual(3);
	expect(await checkboxes.nth(0).isChecked()).toBeFalsy();
	expect(await checkboxes.nth(1).isChecked()).toBeFalsy();
	expect(await checkboxes.nth(2).isChecked()).toBeTruthy();

	const deleteButtons = page.getByTestId('delete-button');
	expect(await deleteButtons.count()).toEqual(3);

	const urls = page.locator('ul > li > label > div > a');
	await expect(urls).toHaveCount(2);
});

test(`should go to the task detail page and display elements`, async ({ page }) => {
	const links = page.getByRole('link');

	await links.nth(1).click();
	await expect(page).toHaveURL(/.task\/1/);
	await expect(page.getByRole('heading', { name: 'Backlog', level: 1 })).toBeVisible();

	const inputs = page.getByRole('textbox');
	expect(await inputs.nth(0).inputValue()).toStrictEqual(tasks[0]); // Title input
	expect(await inputs.nth(1).inputValue()).toStrictEqual(`Some note test`); // Note input
	await expect(page.locator('button[type="submit"]')).toBeVisible();

	// URLs
	const urls = page.locator('ul > li > div > a');
	await expect(urls).toHaveCount(2);

	const editButtons = page.getByTestId('edit-button');
	expect(await editButtons.count()).toEqual(2);

	const removeButtons = page.getByTestId('remove-button');
	expect(await removeButtons.count()).toEqual(2);

	await expect(page.getByTestId('add-new-url')).toBeVisible();
});

test(`should create a task`, async ({ page }) => {
	const input = page.getByPlaceholder('New To-Do');

	await input.fill(tasks[3]);
	await input.press('Enter');
	await expect(input).toBeEmpty();
	await expect(page.locator('ul > li > label > a')).toHaveText([
		tasks[0],
		tasks[1],
		tasks[2],
		tasks[3]
	]);

	const checkbox = page.getByLabel(tasks[3]);
	await expect(checkbox).toHaveAttribute('type', 'checkbox');
	expect(await checkbox.isChecked()).toBeFalsy();
});

test('should create a task with a note, URL', async ({ page }) => {
	const titleInput = page.getByPlaceholder('New To-Do');
	const submitButton = page.locator(`button[type="submit"]`);
	const showMore = page.getByTestId('show-more-button');
	await showMore.click();

	const noteInput = page.getByPlaceholder('Notes');
	await expect(noteInput).toBeVisible();
	const addNewUrl = page.getByTestId('add-new-url');
	await expect(addNewUrl).toBeVisible();

	await titleInput.fill(tasks[4]);
	await noteInput.fill(`note test`);

	await addNewUrl.click();
	const urlInput = page.locator('input[type="url"]');
	const confirmUrlButton = page.getByTestId('confirm-url-button');
	await expect(urlInput).toBeVisible();
	await expect(confirmUrlButton).toBeVisible();
	await expect(page.getByTestId('remove-button')).toBeVisible();
	await urlInput.fill('https://www.example.com');

	await submitButton.click();

	await expect(titleInput).toBeEmpty();
	await expect(noteInput).toBeEmpty();
	await expect(urlInput).not.toBeVisible();
	await expect(page.locator('ul > li > label > a')).toHaveText(tasks);

	const checkbox = page.getByLabel(tasks[4]);
	await expect(checkbox).toHaveAttribute('type', 'checkbox');
	expect(await checkbox.isChecked()).toBeFalsy();

	await expect(page.locator('ul > li > label > div > a')).toHaveCount(3);
});

test(`should update task's title`, async ({ page }) => {
	const link = page.getByRole('link', { name: tasks[3] });
	await link.click();
	await expect(page).toHaveURL(/.task\/5/); // Because 4 is trashed task

	const input = page.getByRole('textbox').nth(0);
	await input.fill(updateValue);
	await input.press(`Enter`);
	expect(await input.inputValue()).toStrictEqual(updateValue);

	await page.goBack();
	await expect(page.locator('ul > li > label > a')).toHaveText([
		tasks[0],
		tasks[1],
		tasks[2],
		updateValue,
		tasks[4]
	]);
});

test(`should display updated list`, async ({ page }) => {
	await expect(page.locator('ul > li > label > a')).toHaveText([
		tasks[0],
		tasks[1],
		tasks[2],
		updateValue,
		tasks[4]
	]);
});

test(`should display 403 error page`, async ({ page }) => {
	await page.goto('/task/99');
	await expect(page.getByRole('heading', { name: 'Backlog', level: 1 })).toBeVisible();
	await expect(page.getByRole('textbox')).not.toBeVisible();
	await expect(page.getByRole('button')).not.toBeVisible();
	await expect(page.getByText('403')).toBeVisible();
	await expect(page.getByText('Not found')).toBeVisible();
});

// Trash feature test
test(`should delete selected task`, async ({ page }) => {
	const deleteButtons = page.getByTestId('delete-button');

	await deleteButtons.nth(1).click();
	await expect(page.locator('ul > li > label > a')).toHaveText([
		tasks[0],
		tasks[2],
		updateValue,
		tasks[4]
	]);
	await expect(page.locator('ul > li > label > a')).not.toHaveText([tasks[1]]);
});

// Note feature test
test(`should update task with a note`, async ({ page }) => {
	await page.goto('/task/6');
	const noteInput = page.getByRole('textbox').nth(1);

	const updated = `Note updated`;

	await noteInput.fill(updated);
	await page.locator('button[type="submit"]').click();
	expect(await noteInput.inputValue()).toStrictEqual(updated);
});

test(`should empty the note`, async ({ page }) => {
	await page.goto('/task/6');
	const noteInput = page.getByRole('textbox').nth(1);

	await noteInput.clear();
	await page.locator('button[type="submit"]').click();
	await expect(noteInput).toBeEmpty();
	await page.reload();
	await expect(noteInput).toBeEmpty();
});

test(`should add new note to the exist task`, async ({ page }) => {
	await page.goto('/task/5');
	const noteInput = page.getByRole('textbox').nth(1);

	const note = 'Note added';

	await expect(noteInput).toBeEmpty();
	await noteInput.fill(note);
	await page.locator('button[type="submit"]').click();
	expect(await noteInput.inputValue()).toStrictEqual(note);
	await page.reload();
	expect(await noteInput.inputValue()).toStrictEqual(note);
});

// TODO:
// test update task's status
// separate each page of test
