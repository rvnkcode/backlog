import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

import prisma from '$lib/server/prisma';
import { taskSchema } from '$lib/zod';

import type { Actions, PageServerLoad } from './$types';

export const load = (async () => ({
	form: await superValidate(taskSchema)
})) satisfies PageServerLoad;

export const actions = {
	createTask: async ({ request }) => {
		const form = await superValidate(request, taskSchema);

		if (!form.valid) {
			return fail(400, { input: form });
		}

		await prisma.task.create({
			data: { ...form.data }
		});
	}
} satisfies Actions;
