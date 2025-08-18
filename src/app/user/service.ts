import { limitOffset } from '@api/schema/common';
import {
  UserAddDeposite,
  UserCreate,
  UserGetAll,
} from '@src/api/schema/user';
import { err } from '@src/utils';
import { userRepo as repo } from './repo';
import { UUID } from '@src/api/schema/uuid';

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

export const addDeposit = async (p: UserAddDeposite & { uuid: UUID }) => {

  const user = await repo.findOne({ uuid: p.uuid });
  if (!user) err.NotFound("Not found user");

  const newDepositLegal: number = (user?.deposit_legal ?? 0) + p.deposit_legal;
  const newDepositIndividual: number = (user?.deposit_individual ?? 0) + p.deposit_individual;

  const newUserDeposit = {
    deposit_legal: newDepositLegal,
    deposit_individual: newDepositIndividual
  }

  const one = await repo.edit(p.uuid, newUserDeposit);
  if (!one) throw err.BadRequest('not updated');

  return one.uuid;
};

// export const getOne = async (id: string) => {
//   const one = await repo.getOne(id);
//   if (!one) throw new err.NotFound();
//   return one;
// };

// export const edit = async (id: string, p: LocationEdit) => {
//   const one = await repo.getOne(id);
//   if (!one) throw new err.NotFound();
//   if (p.parentId) {
//     const parent = await repo.getOne(p.parentId);
//     if (!parent) throw err.NotFound('parent');
//   }
//   await repo.edit(id, p);
//   return one;
// };

// export const remove = async (id: string) => {
//   const one = await repo.getOne(id);
//   if (!one) throw new err.NotFound();
//   await repo.remove(id);
//   return one;
// };

export const userService = {
  create,
  getAll,
  addDeposit,
  // getOne,
  // edit,
  // remove,
};
