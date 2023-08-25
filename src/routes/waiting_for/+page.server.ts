import { superValidate } from 'sveltekit-superforms/server';

import { appRouter } from '$lib/server/router';
import { createContext } from '$lib/server/trpc';
import { taskSchema } from '$lib/zod';

import type { PageServerLoad } from '../$types';

export const load = (async () => ({
  form: await superValidate(taskSchema),
  tasks: appRouter.createCaller(await createContext()).list.getAllocatedTasks()
})) satisfies PageServerLoad;
