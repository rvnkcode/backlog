import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

import prisma from '$lib/server/prisma';
import { appRouter } from '$lib/server/router';
import { createContext } from '$lib/server/trpc';
import { taskSchema } from '$lib/zod';

import type { Actions, PageServerLoad } from './$types';

export const load = (async () => ({
	form: await superValidate(taskSchema),
	tasks: appRouter.createCaller(await createContext()).inbox.getInbox()
})) satisfies PageServerLoad;

export const actions = {
	create_task: async ({ request }) => {
		const form = await superValidate(request, taskSchema);

		if (!form.valid) {
			return fail(400, { input: form });
		}

		const { urls, ...data } = form.data;
		await prisma.task.create({
			data: { ...data, urls: urls?.length ? urls.join(',') : undefined }
		});
	},

	update_task: async ({ request }) => {
		const form = await superValidate(request, taskSchema);

		if (!form.valid) {
			return fail(400, { input: form });
		}

		const { id, urls, ...others } = form.data;

		if (id == null) {
			return fail(403, { input: form });
		}

		try {
			await prisma.task.update({
				data: { ...others, urls: urls?.length ? urls?.join(',') : null },
				where: { id }
			});
		} catch (error) {
			console.error(error);
			return fail(400, { input: form });
		}
	}
} satisfies Actions;
