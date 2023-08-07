import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

import { listRouter } from '../../routes/api/trpc/list';
import { taskRouter } from '../../routes/api/trpc/task';
import { router } from './trpc';

export const appRouter = router({
	list: listRouter,
	task: taskRouter
});

export type AppRouter = typeof appRouter;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
