import { z } from 'zod';
import { isDate } from 'node:util/types';

export const commonQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().max(100).default(20),
});

export type CommonQuery = z.infer<typeof commonQuery>;

export const limitOffset = (d: CommonQuery) => ({
  offset: (d.page - 1) * d.perPage,
  limit: d.perPage,
});
export type LimitOffset = { limit: number; offset: number };

export const result = z.object({ success: z.boolean() });

export const sortDirection = z.enum(['asc', 'desc']);

export const strBool = z.union([z.enum(['true', 'false']), z.boolean()]).transform(v => v === 'true' || v === true);

export const paramsId = z.object({ id: z.string().uuid() });

export const paramsUuid = z.object({ uuid: z.string().uuid() });

export const paramsPermitId = z.object({ permitId: z.string().uuid() });

export const addFile = z.custom<{ file: any }>();

export const paramsCode = z.object({ code: z.string() });

export const paramsPermitID = z.object({ permitID: z.string().uuid() });

export const strInt = z.union([z.string(), z.number().int()]).refine((v) => Number.isInteger(+v)).transform((v) => +v);
export type StrInt = z.infer<typeof strInt>;


export const strNumber = z.union([z.string(), z.number()]).refine((v) => !isNaN(+v)).transform((v) => +v);
export type StrNumber = z.infer<typeof strNumber>;

export const strDate = z.string().transform((v) => new Date(v)).refine((v) => isDate(v));


export const respBody = z.any();

export const resp = z.object({
  status: strBool.default(true),
  message: z.string().default('good job !!!'),
  code: z.string().default('SS-10000'),
  data: z.any().default(null)
});