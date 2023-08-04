// https://www.prisma.io/blog/testing-series-1-8eRB5p0Y8o
// https://tawaldevuniverse.hashnode.dev/some-tips-when-using-t3-stack-unit-testing-with-trpc-procedures-environment-setup
import { isSameDay } from 'date-fns';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import prisma from '$lib/server/__mocks__/prisma';
import { appRouter } from '$lib/server/router';
import { createContext } from '$lib/server/trpc';

vi.mock('$lib/server/prisma');

describe(`tRPC task router unit tests`, () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	// mocking tRPC
	const ctx = createContext();
	const caller = appRouter.createCaller({ ...ctx, prisma });

	const today = new Date();
	// TODO: If a new schema has been added, add also here too
	const generalValues = {
		id: 1,
		title: `Test`,
		isTrashed: false,
		note: null,
		urls: null,
		createdAt: today,
		updatedAt: today
	};

	describe(`update task's status`, () => {
		beforeEach(() => {
			prisma.$transaction.mockImplementationOnce((callback) => callback(prisma));
		});

		it(`should update task's status to the indeterminate`, async () => {
			const taskGeneralValues = {
				...generalValues,
				isDone: false,
				completedAt: null
			};

			prisma.task.findUniqueOrThrow.mockResolvedValueOnce({
				...taskGeneralValues,
				isStarted: false,
				startedAt: null
			});

			prisma.task.update.mockResolvedValueOnce({
				...taskGeneralValues,
				isStarted: true,
				startedAt: today
			});

			const updated = await caller.task.updateStatus(1);
			expect(updated).contain({ isStarted: true });
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			expect(isSameDay(updated.startedAt!, today)).toBeTruthy;
		});

		it(`should update task's status to be completed`, async () => {
			const taskGeneralValues = {
				...generalValues,
				isStarted: true,
				startedAt: today
			};

			prisma.task.findUniqueOrThrow.mockResolvedValueOnce({
				...taskGeneralValues,
				isDone: false,
				completedAt: null
			});

			prisma.task.update.mockResolvedValueOnce({
				...taskGeneralValues,
				isDone: true,
				completedAt: today
			});

			const updated = await caller.task.updateStatus(1);
			expect(updated).contain({ isDone: true });
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			expect(isSameDay(updated.startedAt!, today)).toBeTruthy;
		});

		it(`should reset task's status `, async () => {
			prisma.task.findUniqueOrThrow.mockResolvedValueOnce({
				...generalValues,
				isStarted: true,
				startedAt: today,
				isDone: true,
				completedAt: today
			});

			prisma.task.update.mockResolvedValueOnce({
				...generalValues,
				isStarted: false,
				startedAt: null,
				isDone: false,
				completedAt: null
			});

			const updated = await caller.task.updateStatus(1);
			expect(prisma.task.update).toHaveBeenCalledWith({
				data: {
					isStarted: false,
					startedAt: null,
					isDone: false,
					completedAt: null
				},
				where: { id: 1 }
			});
			expect(updated).contain({
				isStarted: false,
				startedAt: null,
				isDone: false,
				completedAt: null
			});
		});

		it(`should rejected with doesn't exist id`, async () => {
			await expect(caller.task.updateStatus(1)).rejects.toThrow(`The task doesn't exist`);
		});
	});
});
