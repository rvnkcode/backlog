import { publicProcedure } from '$lib/server/trpc';
import { router } from '$lib/server/trpc';
import { idSchema } from '$lib/zod';

export const taskRouter = router({
	getTaskDetail: publicProcedure.input(idSchema).query(async ({ ctx, input }) => {
		return await ctx.prisma.task.findUniqueOrThrow({
			where: {
				id: input
			}
		});
	})
});
