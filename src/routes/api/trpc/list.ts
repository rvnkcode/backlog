import type { Prisma } from '@prisma/client';

import { publicProcedure } from '$lib/server/trpc';
import { router } from '$lib/server/trpc';

const filter: Prisma.TaskWhereInput = {
  isTrashed: false,
  isDone: false
};

const selectCondition: Prisma.TaskSelect = {
  id: true,
  title: true,
  isStarted: true,
  isDone: true,
  urls: true,
  note: true
};

export const listRouter = router({
  getInbox: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.task.findMany({
      select: {
        ...selectCondition
      },
      where: { isTrashed: false, allocatedTo: null }
    });

    return result.map((task) => {
      const { urls, ...others } = task;
      return {
        ...others,
        urls: urls?.split(',')
      };
    });
  }),

  getAllocatedTasks: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.task.findMany({
      select: {
        ...selectCondition,
        allocatedTo: true
      },
      where: {
        isTrashed: false,
        NOT: {
          allocatedTo: null
        }
      }
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
    const [inboxCount, waitingForCount] = await Promise.all([
      await ctx.prisma.task.count({
        where: { ...filter, allocatedTo: null }
      }),
      await ctx.prisma.task.count({
        where: { ...filter, NOT: { allocatedTo: null } }
      })
    ]);

    return { inboxCount, waitingForCount };
  }),

  getAllTasks: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.task.findMany();
  })
});
