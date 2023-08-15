import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

import { appRouter } from '$lib/server/router';
import { createContext } from '$lib/server/trpc';
import { taskSchema } from '$lib/zod.js';

import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
  try {
    const task = appRouter.createCaller(await createContext()).task.getTaskDetail(+params.slug);

    return { task, form: await superValidate(await task, taskSchema) };
  } catch (e) {
    console.error(e);
    throw error(403, 'Not found');
  }
}) satisfies PageServerLoad;
