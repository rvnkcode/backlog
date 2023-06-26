import { beforeEach, describe, expect, test, vi } from 'vitest';

import prisma from '$lib/server/__mocks__/prisma';
import { appRouter } from '$lib/server/router';
import { createContext } from '$lib/server/trpc';

vi.mock('$lib/server/prisma');

describe(`TRPC inbox router unit tests`, () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	const ctx = createContext();
	const caller = appRouter.createCaller({ ...ctx, prisma });

	test(`should get inbox tasks`, async () => {
		prisma.task.findMany.mockResolvedValueOnce([
			{
				id: 1,
				title: 'test',
				isStarted: false,
				startedAt: null,
				isDone: false,
				completedAt: null,
				createdAt: new Date(),
				updatedAt: new Date()
			}
		]);

		const inbox = await caller.inbox.getInbox();

		expect(inbox.length).toEqual(1);
	});
});
