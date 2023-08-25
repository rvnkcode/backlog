import { publicProcedure, router } from '$lib/server/trpc';

export const contactRouter = router({
  getContacts: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.people.findMany({
      select: {
        name: true
      },
      where: {
        isActive: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return result.map((item) => item.name);
  }),

  getAllContacts: publicProcedure.query(async ({ ctx }) => {
    const [activated, disabled] = await Promise.all([
      await ctx.prisma.people.findMany({
        where: {
          isActive: true
        }
      }),
      await ctx.prisma.people.findMany({
        where: {
          isActive: false
        }
      })
    ]);

    return { activated, disabled };
  })
});
