import { limitOffset, resp } from '@api/schema/common';
import { AdminCreate, AdminGetAll } from '@api/schema/admin';
import { adminRepo as repo } from './repo';
import { bcryptService, err } from '@src/utils';

export const getRoles = async () => {
  return await repo.getRoles();
}

export const getAll = async (p: AdminGetAll) => {
  const { limit, offset } = limitOffset(p);
  return await repo.getAll({ ...p, limit, offset });
};

export const create = async (p: AdminCreate) => {
  const roleExist = await repo.findOneByIdRole(p.role_id)
  if (!roleExist) throw err.NotFound();

  const adminExist = await repo.findOne({ username: p.username });
  if (adminExist) throw err.BadRequest('username exist');

  const password = await bcryptService.hashPass(p.password);
  const password_name = p.password;

  const one = await repo.create({ ...p, password, password_name });
  if (!one) throw err.InternalServerError('Not created admin');

  return one;
};

export const remove = async (uuid: string) => {
  const one = await repo.findOne({ uuid });
  if (!one) throw new err.NotFound();

  await repo.remove(uuid);
  return true;
};


export const adminService = {
  getAll,
  getRoles,
  create,
  remove,
};