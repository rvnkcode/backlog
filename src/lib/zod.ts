import type { Prisma } from '@prisma/client';
import { z } from 'zod';

export const taskSchema = z.object({
	title: z.string().trim().min(1)
}) satisfies z.ZodType<Prisma.TaskCreateInput>;

export type TaskSchema = typeof taskSchema;
