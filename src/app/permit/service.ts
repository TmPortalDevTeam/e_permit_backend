import { limitOffset } from '@api/schema/common';
import { err } from '@src/utils';
import { permitRepo as repo } from './repo';
import { permitServiceAPI } from '@src/infra/extrnal-api/service';
import { PemritCreate } from '@src/api/schema/permit';


const getAuthorityByCode = async (code: string) => {
  const result = await permitServiceAPI.getAuthorityByCode(code);
  return result
}

const createPermit = async (d: PemritCreate) => {
  const one = await repo.createPermit(d);
  if (!one) throw err.InternalServerError();

  return one;
}

const getAllPermits = async () => {
  const one = await repo.getAllPermits();
  if (!one) throw err.InternalServerError();

  return one;
}


export const permitService = {
  getAuthorityByCode,
  createPermit,
  getAllPermits,
};
