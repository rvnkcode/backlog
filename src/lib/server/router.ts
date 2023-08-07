import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

import { contactRouter } from '../../routes/api/trpc/contact';
import { listRouter } from '../../routes/api/trpc/list';
import { taskRouter } from '../../routes/api/trpc/task';
import { router } from './trpc';

export const appRouter = router({
	list: listRouter,
	task: taskRouter,
	contact: contactRouter
});

export type AppRouter = typeof appRouter;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
