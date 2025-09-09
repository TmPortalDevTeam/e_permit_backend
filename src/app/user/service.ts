import { getEnv } from '@src/infra/env/service';
import { limitOffset, resp } from '@api/schema/common';
import { err } from '@src/utils';
import {
  UserAddDeposite,
  UserCreate,
  UserGetAll,
  RemoveDeposit,
  DepositBalance
} from '@src/api/schema/user';
import { userRepo as repo } from './repo';
import { permitRepo } from '../permit/repo';
import { paymentRepo } from '../payment/repo';
import { blackHistoryRepo } from '../blackHistory/repo';
import { BlackHistoryGetAll } from '@src/api/schema/blackHistory';
import { OnlinePaymentCreate } from '@src/api/schema/payment';

const deductionAmount = getEnv('DEDUCTION_AMOUNT'); // 450.0


export const getUsers = async (p: UserGetAll) => {
  const { limit, offset } = limitOffset(p);
  const r = await repo.getAll({ ...p, limit, offset });
  return resp.parse({ data: r });
};

export const AddUsers = async (d: UserCreate) => {
  const user = await repo.findOne({ user_id: d.user_id });
  if (user) return resp.parse({ data: user.uuid });

  if (!d.uuid) {
    const created = await repo.create({
      user_id: d.user_id,
      name: d.name,
      email: d.email,
      phone: d.phone,
    });

    if (!created) throw err.InternalServerError('Not created');

    return resp.parse({ data: created });
  }
  else {
    const updated = await repo.edit(d.uuid, { ...d, uuid: undefined });
    if (!updated) throw err.InternalServerError('Not updated');
    return resp.parse({ data: updated });
  }
};

export const addDeposit = async (uuid: string, p: UserAddDeposite) => {

  const user = await repo.findOne({ uuid });
  if (!user) err.NotFound("Not found user");

  const newDepositLegal: number = Number((user?.deposit_legal ?? 0)) + Number(p.deposit_legal);
  const newDepositIndividual: number = Number((user?.deposit_individual ?? 0)) + Number(p.deposit_individual);

  const newUserDeposit = {
    deposit_legal: Number(newDepositLegal.toFixed(2)),
    deposit_individual: Number(newDepositIndividual.toFixed(2))
  }

  const one = await repo.edit(uuid, newUserDeposit);
  if (!one) throw err.Conflict('Not updated');

  return resp.parse({ data: one.uuid });
};

const RemoveDepositLegal = async (d: RemoveDeposit) => {
  const deposit = d.deposit ?? 0;
  if (deposit < deductionAmount) throw err.Conflict("deposit_legal balance < then deductionAmount")

  const deposit_legal = Number((deposit - deductionAmount).toFixed(2));
  const one = await repo.edit(d.uuid, { deposit_legal });
  if (!one) throw err.InternalServerError('Not updated');

  return resp.parse({
    data: {
      uuid: d.uuid,
      new_deposit_balance: one.deposit_legal
    }
  });
}

const RemoveDepositIndividual = async (d: RemoveDeposit) => {
  const deposit = d.deposit ?? 0;
  if (deposit < deductionAmount) throw err.Conflict("deposit_individual balance < then deductionAmount")

  const deposit_individual = Number((deposit - deductionAmount).toFixed(2));
  const one = await repo.edit(d.uuid, { deposit_individual });
  if (!one) throw err.InternalServerError('Not updated');

  return resp.parse({
    data: {
      uuid: d.uuid,
      new_deposit_balance: one.deposit_individual
    }
  });
}

export const removeMoneyFromDeposit = async (uuid: string) => {
  const one = await permitRepo.getLastPermitUser(uuid);
  if (!one) throw err.NotFound("no permit found for user");

  if (one?.is_legal === null || one?.is_legal === undefined) throw err.BadRequest("Permit is_legal = null or undefined");

  const user = await repo.findOne({ uuid });
  if (!user) throw err.NotFound("Not found user");

  return one?.is_legal
    ? await RemoveDepositLegal({ uuid, deposit: user?.deposit_legal })
    : await RemoveDepositIndividual({ uuid, deposit: user?.deposit_individual });
};

export const getBlackHistory = async (p: BlackHistoryGetAll) => {
  const { limit, offset } = limitOffset(p);
  const all = await blackHistoryRepo.getAll({ ...p, limit, offset });
  return resp.parse({ data: all });
};

export const getDepositBalance = async (p: DepositBalance) => {
  const user = await repo.findOne({ uuid: p.user_id });
  if (!user) err.NotFound("Not found user");

  const user_id = user?.uuid;
  const is_legal = p.is_legal;
  const deposit_balance = p.is_legal ? user?.deposit_legal : user?.deposit_individual;

  return {
    user_id,
    is_legal,
    deposit_balance
  }
};

// online toleg
export const addPayment = async (p: OnlinePaymentCreate) => {
  const one = await paymentRepo.addPayment({ ...p, type: 'online' });
  if (!one) err.Conflict("Do not payment add");

  return { message: 'Payment added successfully' }
};

export const getPermitsByUserId = async () => {
  const r = await repo.getUserHistory();
  return resp.parse({ data: r });
};

export const getUserHistoryByUUID = async (userId: string) => {
  const r = await repo.getUserHistoryByUUID(userId);
  return resp.parse({ data: r });
};


export const userService = {
  AddUsers,
  getUsers,
  addDeposit,
  removeMoneyFromDeposit,
  getBlackHistory,
  getDepositBalance,
  addPayment,
  getPermitsByUserId,
  getUserHistoryByUUID
};