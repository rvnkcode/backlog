import { z } from 'zod';

export const idSchema = z.number().positive();

export const taskSchema = z.object({
	id: z.number().positive().optional(),
	title: z.string().trim().min(1),
	note: z
		.string()
		.trim()
		.nullish()
		.transform((arg) => {
			arg === '' ? null : arg;
		}),
	urls: z.array(z.string().url()).nullish()
});

export type TaskSchema = typeof taskSchema;
