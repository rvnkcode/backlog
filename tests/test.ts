import { expect, test } from '@playwright/test';

test('display test', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Backlog' })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Inbox' })).toBeVisible();
	await expect(page.getByPlaceholder('New To-Do')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
});
