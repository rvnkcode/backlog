import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });

test.beforeEach(async ({ page }) => {
	await page.goto('/');
	await page.getByLabel('show more inputs button').click();
});

test('should display additional inputs', async ({ page }) => {
	await expect(page.getByPlaceholder('Notes')).toBeVisible();
	await expect(page.getByLabel('show new url input')).toBeVisible();
	// TODO: await expect(allocatedToInput).toBeVisible()
});

test.describe('URL input tests', () => {
	test.beforeEach(async ({ page }) => {
		await page.getByLabel('show new url input').click();
	});

	test('should display URL input', async ({ page }) => {
		await expect(page.getByPlaceholder('https://www.example.com')).toBeVisible();
		await expect(page.getByLabel('confirm the url input', { exact: true })).toBeVisible();
		await expect(page.getByLabel('remove url from the list')).toBeVisible();
	});

	test('should remove URL input', async ({ page }) => {
		await page.getByLabel('remove url from the list').click();

		await expect(page.getByPlaceholder('https://www.example.com')).not.toBeVisible();
		await expect(page.getByLabel('confirm the url input', { exact: true })).not.toBeVisible();
		await expect(page.getByLabel('remove url from the list')).not.toBeVisible();
	});

	test('should not add URL if URL input is empty', async ({ page }) => {
		await page.getByLabel('confirm the url input', { exact: true }).click();

		await expect(page.getByPlaceholder('https://www.example.com')).toBeVisible();
		await expect(page.getByLabel('confirm the url input', { exact: true })).toBeVisible();
		await expect(page.getByLabel('remove url from the list')).toBeVisible();
		await expect(page.getByLabel('edit url')).not.toBeVisible();
	});

	test.describe('CRUD on the URL input and list', () => {
		const dummyUrl = 'https://www.example.com';

		test.beforeEach(async ({ page }) => {
			await page.getByPlaceholder('https://www.example.com').fill(dummyUrl);
			await page.getByLabel('confirm the url input', { exact: true }).click();
		});

		test('should add the URL to the list', async ({ page }) => {
			await expect(page.getByPlaceholder('https://www.example.com')).not.toBeVisible();
			await expect(page.getByLabel('confirm the url input', { exact: true })).not.toBeVisible();
			await expect(page.getByRole('link', { name: dummyUrl })).toBeVisible();
			await expect(page.getByLabel('edit url', { exact: true })).toBeVisible();
			await expect(page.getByLabel('remove url from the list')).toBeVisible();
		});

		test('should remove URL from the list', async ({ page }) => {
			await page.getByLabel('remove url from the list').click();

			await expect(page.getByRole('link', { name: dummyUrl })).not.toBeVisible();
			await expect(page.getByLabel('edit url', { exact: true })).not.toBeVisible();
			await expect(page.getByLabel('remove url from the list')).not.toBeVisible();
		});

		test('should update URL', async ({ page }) => {
			const newValue = 'http://www.updated.com';

			await page.getByLabel('edit url', { exact: true }).click();

			await expect(page.getByRole('link', { name: dummyUrl })).not.toBeVisible();
			await expect(page.getByLabel('edit url', { exact: true })).not.toBeVisible();
			await expect(page.getByLabel('confirm the url input', { exact: true })).toBeVisible();
			await expect(page.getByLabel('remove url from the list')).toBeVisible();

			const urlInput = page.getByPlaceholder('https://www.example.com');
			expect(await urlInput.inputValue()).toStrictEqual(dummyUrl);
			await urlInput.fill(newValue);
			await page.getByLabel('confirm the url input', { exact: true }).click();

			await expect(urlInput).not.toBeVisible();
			await expect(page.getByLabel('confirm the url input', { exact: true })).not.toBeVisible();
			await expect(page.getByLabel('edit url', { exact: true })).toBeVisible();
			await expect(page.getByLabel('remove url from the list')).toBeVisible();
			await expect(page.getByRole('link', { name: newValue })).toBeVisible();
		});
	});

	test.describe('invalid URL test', () => {
		const invalid = 'asdf';

		test.beforeEach(async ({ page }) => {
			await page.getByPlaceholder('https://www.example.com').fill(invalid);
		});

		test('should display error message if URL is invalid', async ({ page }) => {
			await page.locator('html').click();

			await expect(page.getByText('Invalid url')).toBeVisible();
		});

		test('should not add URL to the list if URL is invalid', async ({ page }) => {
			await page.getByLabel('confirm the url input', { exact: true }).click();

			await expect(page.getByText('Invalid url')).toBeVisible(); // Error message
			expect(await page.getByPlaceholder('https://www.example.com').inputValue()).toStrictEqual(
				invalid
			);
			await expect(page.getByLabel('edit url')).not.toBeVisible();
			await expect(page.getByRole('link', { name: invalid })).not.toBeVisible();
		});
	});
});

// TODO: allocated to input test
