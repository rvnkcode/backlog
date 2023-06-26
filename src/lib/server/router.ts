import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

import { inboxRouter } from '../../routes/api/trpc/inbox';
import { router } from './trpc';

export const appRouter = router({
	inbox: inboxRouter
});

export type AppRouter = typeof appRouter;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
