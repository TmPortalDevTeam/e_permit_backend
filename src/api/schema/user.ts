import { z } from 'zod';
import { commonQuery, strBool } from './common';

export const user = z.object({
  uuid: z.string().uuid(),
  user_id: z.number()
    .refine((val) => Number.isInteger(val), { message: 'Must be an integer' })
    .nullable(),
  name: z.string().nullable(),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
  deposit_legal: z.number().nullable(),
  deposit_individual: z.number().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
  deposit: z.number()
    .refine((val) => Number.isInteger(val), { message: 'Must be an integer' })
    .nullable()
});

export const userDeposit = z.object({
  deposit_legal: z.number(),
  deposit_individual: z.number(),
});

export const depositBalance = user.pick({ uuid: true }).extend({ is_legal: strBool.default(true) });

export const removeDeposit = user.pick({ uuid: true }).extend({ deposit: z.number().nullable().optional() });

export const userDepositGetOneRes = z.object({ data: z.string() });

export const userRemoveDepositGetOneRes = z.object({
  uuid: z.string().uuid(),
  deposit_balance: z.number().nullable(),
});

export const userGetOneRes = user;
export const userGetAll = user.extend({ text: z.string() }).partial().merge(commonQuery);
export const userGetAllRes = z.object({
  count: z.number(),
  data: user.pick({
    uuid: true,
    user_id: true,
    name: true,
    email: true,
    phone: true,
    deposit_legal: true,
    deposit_individual: true,
  }).array(),
});

export const userCreate = user
  .pick({
    user_id: true,
    name: true,
    email: true,
    phone: true,
    deposit_legal: true,
    deposit_individual: true,
    deposit: true,
  })
  .extend({ uuid: z.string().uuid().nullable() });

export const userDepositAdd = userDeposit.pick({
  deposit_legal: true,
  deposit_individual: true
});


export type User = z.infer<typeof user>;
export type UserGetAll = z.infer<typeof userGetAll>;
export type UserCreate = z.infer<typeof userCreate>;
export type UserAddDeposite = z.infer<typeof userDepositAdd>;
export type RemoveDeposit = z.infer<typeof removeDeposit>;
export type DepositBalance = z.infer<typeof depositBalance>;


export const userSchema = {
  schema: user,
  getAll: userGetAll,
  getAllRes: userGetAllRes,
  getOneRes: userGetOneRes,
  create: userCreate,
  addDeposit: userDepositAdd,
  getOneResDeposit: userDepositGetOneRes,
  getOneResDepositRemove: userRemoveDepositGetOneRes,
  removeDeposit,
  getOneDepositBalance: depositBalance
};

export type UserSchema = {
  Schema: User;
  GetAll: UserGetAll;
  Create: UserCreate;
  AddDeposit: UserAddDeposite;
  RemoveDeposit: RemoveDeposit;

};