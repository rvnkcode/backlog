import { TRPCError } from '@trpc/server';

import { publicProcedure } from '$lib/server/trpc';
import { router } from '$lib/server/trpc';
import { idSchema } from '$lib/zod';

export const taskRouter = router({
  getTaskDetail: publicProcedure.input(idSchema).query(async ({ ctx, input }) => {
    const { urls, ...others } = await ctx.prisma.task.findUniqueOrThrow({
      where: { id: input }
    });
    return {
      ...others,
      urls: urls?.split(',')
    };
  }),

  updateStatus: publicProcedure.input(idSchema).mutation(async ({ ctx, input }) => {
    const task = await ctx.prisma.task.findUniqueOrThrow({
      select: {
        isStarted: true,
        isDone: true
      },
      where: { id: input }
    });

    if (task == null) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `The task doesn't exist`
      });
    }

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
  }),

  delete: publicProcedure.input(idSchema).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.task.update({
      data: { isTrashed: true },
      where: { id: input }
    });
  })
});
