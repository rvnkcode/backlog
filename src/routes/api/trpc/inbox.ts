import { publicProcedure } from '$lib/server/trpc';
import { router } from '$lib/server/trpc';

export const inboxRouter = router({
	getInbox: publicProcedure.query(async ({ ctx }) => {
		return await ctx.prisma.task.findMany({
			select: {
				id: true,
				title: true,
				isStarted: true,
				isDone: true
			},
			where: { isTrashed: false }
		});
	})
});
