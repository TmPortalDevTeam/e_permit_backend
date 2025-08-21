import { CommonQuery, limitOffset } from '@api/schema/common';
import { err } from '@src/utils';
import { permitRepo as repo } from './repo';
import { permitServiceAPI } from '@src/infra/extrnal-api/service';
import { GetAllRejectedPermit, PemritCreate } from '@src/api/schema/permit';


const getAuthorityByCode = async (code: string) => {
  const result = await permitServiceAPI.getAuthorityByCode(code);
  return result
}

const createPermit = async (d: PemritCreate) => {
  const one = await repo.createPermit(d);
  if (!one) throw err.InternalServerError();

  return one;
}

const getAllPermits = async (p: CommonQuery) => {
  const { limit, offset } = limitOffset(p);
  const permits = await repo.getAllPermits({ limit, offset });
  if (!permits) throw err.InternalServerError();

  return permits;
}

const getAllRejectedPermits = async (p: GetAllRejectedPermit) => {
  const { limit, offset } = limitOffset(p);
  const permits = await repo.getAllRejectedPermits({ ...p, limit, offset });
  if (!permits) throw err.InternalServerError();

  return permits;
}


export const permitService = {
  getAuthorityByCode,
  createPermit,
  getAllPermits,
  getAllRejectedPermits,
};