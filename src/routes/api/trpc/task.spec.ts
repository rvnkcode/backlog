// https://www.prisma.io/blog/testing-series-1-8eRB5p0Y8o
// https://tawaldevuniverse.hashnode.dev/some-tips-when-using-t3-stack-unit-testing-with-trpc-procedures-environment-setup
import { beforeEach, describe, expect, it, vi } from 'vitest';

import prisma from '$lib/server/__mocks__/prisma';
import { appRouter } from '$lib/server/router';
import { createContext } from '$lib/server/trpc';

vi.mock('$lib/server/prisma');

describe(`tRPC task router unit tests`, () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	const ctx = createContext();
	const caller = appRouter.createCaller({ ...ctx, prisma });

	describe(`update task's status`, () => {
		it('should return exist task', async () => {
			prisma.task.update.mockResolvedValueOnce;
		});
	});
});
