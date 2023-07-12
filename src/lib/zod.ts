import type { Prisma } from '@prisma/client';
import { z } from 'zod';

export const idSchema = z.number().positive();

export const taskSchema = z.object({
	id: z.number().positive().optional(),
	title: z.string().trim().min(1),
	note: z.string().trim().nullish(),
	urls: z.string().trim().nullish()
}) satisfies z.ZodType<Prisma.TaskCreateInput>;

export type TaskSchema = typeof taskSchema;
