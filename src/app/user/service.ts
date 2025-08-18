import { getEnv } from '@src/infra/env/service';
import { limitOffset } from '@api/schema/common';
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
import { PaymentCreate } from '@src/api/schema/payment';

const deductionAmount = getEnv('DEDUCTION_AMOUNT'); // 450.0



export const getAll = async (p: UserGetAll) => {
  const { limit, offset } = limitOffset(p);
  return repo.getAll({ ...p, limit, offset });
};

export const create = async (p: UserCreate) => {

  const user = await repo.findOne({ user_id: p.user_id });
  if (user) return { uuid: user.uuid }

  if (p.uuid === null) {
    const one = await repo.create({
      user_id: p.user_id,
      name: p.name,
      email: p.email,
      phone: p.phone,
    });
    if (!one) throw err.BadRequest('not created');
    return one
  }
  else {
    const one = await repo.edit(p.uuid, { ...p, uuid: undefined });
    if (!one) throw err.BadRequest('not updated');
    return one
  }

};

export const addDeposit = async (p: UserAddDeposite & { uuid: string }) => {

  const user = await repo.findOne({ uuid: p.uuid });
  if (!user) err.NotFound("Not found user");

  const newDepositLegal: number = (user?.deposit_legal ?? 0) + p.deposit_legal;
  const newDepositIndividual: number = (user?.deposit_individual ?? 0) + p.deposit_individual;

  const newUserDeposit = {
    deposit_legal: Number(newDepositLegal.toFixed(2)),
    deposit_individual: Number(newDepositIndividual.toFixed(2))
  }

  const one = await repo.edit(p.uuid, newUserDeposit);
  if (!one) throw err.Conflict('Not updated');

  return one.uuid;
};

const RemoveDepositLegal = async (d: RemoveDeposit) => {
  const deposit_legal = Number(((d.deposit ?? 0) - deductionAmount).toFixed(2));
  const one = await repo.edit(d.uuid, { deposit_legal });
  if (!one) throw err.Conflict('Not updated');

  return {
    uuid: d.uuid,
    deposit_balance: one.deposit_legal
  }
}

const RemoveDepositIndividual = async (d: RemoveDeposit) => {
  const deposit_individual = Number(((d.deposit ?? 0) - deductionAmount).toFixed(2));
  const one = await repo.edit(d.uuid, { deposit_individual });
  if (!one) throw err.Conflict('Not updated');

  return {
    uuid: d.uuid,
    deposit_balance: one.deposit_individual
  }
}

export const removeMoneyFromDeposit = async (uuid: string) => {
  const permitIslegal = await permitRepo.getLastPermitUser(uuid);
  if (permitIslegal === undefined) err.NotFound("Not found permit");

  const user = await repo.findOne({ uuid });
  if (!user) err.NotFound("Not found user");

  return permitIslegal
    ? await RemoveDepositLegal({ uuid, deposit: user?.deposit_legal })
    : await RemoveDepositIndividual({ uuid, deposit: user?.deposit_individual });
};

export const getBlackHistory = async (p: BlackHistoryGetAll) => {
  const { limit, offset } = limitOffset(p);
  return blackHistoryRepo.getAll({ ...p, limit, offset });
};

export const getDepositBalance = async (p: DepositBalance) => {
  const user = await repo.findOne({ uuid: p.uuid });
  if (!user) err.NotFound("Not found user");

  return p.is_legal ? user?.deposit_legal : user?.deposit_individual;
};

export const addPayment = async (p: PaymentCreate) => {
  const one = await paymentRepo.addPayment(p);
  if (!one) err.Conflict("Do not payment add");

  return { success: one }
};


export const userService = {
  create,
  getAll,
  addDeposit,
  removeMoneyFromDeposit,
  getBlackHistory,
  getDepositBalance,
  addPayment,
};
