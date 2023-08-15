import { type inferAsyncReturnType, initTRPC } from '@trpc/server';
import superjson from 'superjson';

import prisma from './prisma';

export const createContext = async () => {
  return { prisma };
};

export type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create({
  transformer: superjson
});

export const router = t.router;
export const publicProcedure = t.procedure;
