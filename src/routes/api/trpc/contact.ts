import { z } from 'zod';

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
  }),

  updateName: publicProcedure
    .input(z.object({ id: z.number().positive(), name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.people.update({
        data: {
          name: input.name
        },
        where: {
          id: input.id
        }
      });
    }),

  deactivateSelectedContacts: publicProcedure
    .input(z.number().array())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.people.updateMany({
        data: {
          isActive: false
        },
        where: {
          id: {
            in: input
          }
        }
      });
    }),

  activateSelectedContacts: publicProcedure
    .input(z.number().array())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.people.updateMany({
        data: {
          isActive: true
        },
        where: {
          id: {
            in: input
          }
        }
      });
    }),

  removeContact: publicProcedure.input(z.number().positive()).mutation(async ({ ctx, input }) => {
    await ctx.prisma.people.delete({
      where: {
        id: input
      }
    });
  })
});
