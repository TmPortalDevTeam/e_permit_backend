import { z } from 'zod';
import { commonQuery, strInt, strDate, typePayment } from './common';

export const payment = z.object({
  uuid: z.string().uuid(),
  order_id: z.string().uuid(),
  permit_id: z.string().uuid(),
  amount: strInt,
  type: typePayment,
  pay_date: z.coerce.date(),
  document_number: z.string(),
  filename: z.any(),
  createdAt: z.coerce.date(),
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

export const onlinePaymentCreate = payment.pick({
  order_id: true,
  permit_id: true,
  amount: true,
})

const createOflinePayment = z.custom<{
  file: any,
  permit_id: string,
  amount: number,
  type: string,
  pay_date: Date,
  document_number: string,
}>();

export type Payment = z.infer<typeof payment>;
export type PaymentGetAll = z.infer<typeof paymentGetAll>;
export type OnlinePaymentCreate = z.infer<typeof onlinePaymentCreate>;
export type CreateOflinePayment = z.infer<typeof createOflinePayment>;

export const paymentSchema = {
  schema: payment,
  createOnlinePayment: onlinePaymentCreate,
  getAll: paymentGetAll,
  getAllRes: paymentGetAllRes,
  getOneRes: paymentGetOneRes,
  createOflinePayment,
};

export type PaymentSchema = {
  Schema: Payment;
  Create: OnlinePaymentCreate;
  GetAll: PaymentGetAll;
  CreateOflinePayment: CreateOflinePayment
};