import { expect, test } from '@playwright/test';
import { createMock } from 'zodock';

import { taskSchema } from '../src/lib/zod';

const mockedTask = createMock(taskSchema);

test(`should create a task`, async ({ request }) => {
	const task = await request.post('/?/create_task', {
		form: { ...mockedTask }
	});

	expect(task.ok()).toBeTruthy();
});
