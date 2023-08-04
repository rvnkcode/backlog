import type { Prisma } from '@prisma/client';

import { publicProcedure } from '$lib/server/trpc';
import { router } from '$lib/server/trpc';

const filter: Prisma.TaskWhereInput = {
	isTrashed: false,
	isDone: false
};

export const inboxRouter = router({
	getInbox: publicProcedure.query(async ({ ctx }) => {
		const result = await ctx.prisma.task.findMany({
			select: {
				id: true,
				title: true,
				isStarted: true,
				isDone: true,
				urls: true,
				note: true
			},
			where: { isTrashed: false }
		});

		return result.map((task) => {
			const { urls, ...others } = task;
			return {
				...others,
				urls: urls?.split(',')
			};
		});
	}),

	getCounts: publicProcedure.query(async ({ ctx }) => {
		const [inboxCount] = await Promise.all([
			await ctx.prisma.task.count({
				where: { ...filter }
			})
		]);

		return { inboxCount };
	})
});
