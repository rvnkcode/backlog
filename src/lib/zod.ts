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
      return arg === '' || arg === undefined ? null : arg;
    }),
  urls: z.array(z.string().url()).nullish(),
  allocatedTo: z
    .string()
    .nullish()
    .transform((arg) => {
      return arg === '' || arg === undefined ? null : arg;
    })
});

export type TaskSchema = typeof taskSchema;
