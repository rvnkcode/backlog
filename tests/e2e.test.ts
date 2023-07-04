// Run $ yarn prisma migrate reset before running e2e tests
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test(`should create a task`, async ({ page }) => {
	const input = page.getByPlaceholder('New To-Do');
	const mockedTask = `test`;

	await input.fill(mockedTask);
	await input.press('Enter');
	await expect(input).toBeEmpty();
	await expect(page.locator('ul > li')).toHaveText([`This is the sample task`, mockedTask]);

	const checkbox = page.getByLabel(mockedTask);
	await expect(checkbox).toHaveAttribute('type', 'checkbox');
	expect(await checkbox.isChecked()).toBeFalsy();
});

// TODO:
// update task's status
// `go to the detail page`
// `should return 403 if id isn't exists`
// `update task's title`
