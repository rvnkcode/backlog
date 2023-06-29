import { publicProcedure } from '$lib/server/trpc';
import { router } from '$lib/server/trpc';
import { idSchema } from '$lib/zod';

export const taskRouter = router({
	getTaskDetail: publicProcedure.input(idSchema).query(async ({ ctx, input }) => {
		return await ctx.prisma.task.findUniqueOrThrow({
			where: { id: input }
		});
	}),

	updateStatus: publicProcedure.input(idSchema).mutation(async ({ ctx, input }) => {
		const task = await ctx.prisma.task.findUniqueOrThrow({
			select: {
				isStarted: true,
				isDone: true
			},
			where: { id: input }
		});

		const today = new Date();

		if (task.isDone) {
			return await ctx.prisma.task.update({
				data: {
					isStarted: false,
					startedAt: null,
					isDone: false,
					completedAt: null
				},
				where: { id: input }
			});
		} else if (task.isStarted) {
			return await ctx.prisma.task.update({
				data: {
					isDone: true,
					completedAt: today
				},
				where: { id: input }
			});
		} else {
			return await ctx.prisma.task.update({
				data: {
					isStarted: true,
					startedAt: today
				},
				where: { id: input }
			});
		}
	})
});
