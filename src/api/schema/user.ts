import { z } from 'zod';
import { commonQuery, strBool, strDate, strInt, strNumber } from './common';

export const user = z.object({
  uuid: z.string().uuid(),
  user_id: strInt.nullable(),
  name: z.string().nullable(),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
  deposit_legal: strNumber.nullable(),
  deposit_individual: strNumber.nullable(),
  deposit: strInt.nullable(),
  created_at: strDate,
  updated_at: strDate,
});

export const userDeposit = z.object({
  deposit_legal: strNumber,
  deposit_individual: strNumber,
});

export const depositBalance = z.object({
  user_id: z.string().uuid(),
  is_legal: strBool
});

export const removeDeposit = user.pick({ uuid: true }).extend({ deposit: strInt.nullable().optional() });

export const userDepositGetOneRes = z.object({ data: z.string() });

export const userRemoveDepositGetOneRes = z.object({
  uuid: z.string().uuid(),
  deposit_balance: strInt.nullable(),
});

export const userGetOneRes = user;
export const userGetAll = user.extend({ text: z.string() }).partial().merge(commonQuery);
export const userGetAllRes = z.object({
  count: strInt,
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
  })
  .extend({ uuid: z.string().uuid().optional() });

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