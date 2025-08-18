import { z } from 'zod';

export const uuid = z.string().uuid();
export type UUID = z.infer<typeof uuid>;