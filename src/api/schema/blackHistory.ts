import { z } from 'zod';
import { commonQuery } from './common';

export const blackHistory = z.object({
  uuid: z.string().uuid(),
  permit_id: z.string(),
  company_name: z.string().nullable(),
  moved_at: z.date(),
});

export const blackHistoryGetOneRes = blackHistory;
export const blackHistoryGetAll = blackHistory.extend({ text: z.string() }).partial().merge(commonQuery);
export const blackHistoryGetAllRes = z.object({
  count: z.number(),
  data: blackHistory.pick({
    uuid: true,
    permit_id: true,
    company_name: true,
    moved_at: true,
  }).array()
});

export type BlackHistory = z.infer<typeof blackHistory>;
export type BlackHistoryGetAll = z.infer<typeof blackHistoryGetAll>;

export const blackSchema = {
  schema: blackHistory,
  getOneRes: blackHistoryGetOneRes,
  getAll: blackHistoryGetAll,
  getAllRes: blackHistoryGetAllRes,
};

export type BlackSchema = {
  Schema: BlackHistory;
  GetAll: BlackHistoryGetAll;
};