import { z } from 'zod';

export const log = z.object({
  status: z.number().nullable(),
  message: z.string().nullable(),
  data: z.any(),
  api: z.string().nullable(),
});

export type Log = z.infer<typeof log>;
export const userSchema = {
  schema: log
};
export type UserSchema = {
  Schema: Log;
};