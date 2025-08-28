import { z } from 'zod';
import { commonQuery, strInt } from './common';

export const payment = z.object({
  uuid: z.string().uuid(),
  order_id: z.string().uuid(),
  permit_id: z.string().uuid(),
  amount: strInt,
});

export const paymentGetOneRes = payment;
export const paymentGetAll = payment.extend({ text: z.string() }).partial().merge(commonQuery);
export const paymentGetAllRes = z.object({
  count: z.number(),
  data: payment.pick({
    uuid: true,
    order_id: true,
    permit_id: true,
    amount: true,
  }).array(),
});

export const paymentCreate = payment.pick({
  order_id: true,
  permit_id: true,
  amount: true,
})


export type Payment = z.infer<typeof payment>;
export type PaymentGetAll = z.infer<typeof paymentGetAll>;
export type PaymentCreate = z.infer<typeof paymentCreate>;


export const paymentSchema = {
  schema: payment,
  create: paymentCreate,
  getAll: paymentGetAll,
  getAllRes: paymentGetAllRes,
  getOneRes: paymentGetOneRes,
};

export type PaymentSchema = {
  Schema: Payment;
  Create: PaymentCreate;
  GetAll: PaymentGetAll;
};