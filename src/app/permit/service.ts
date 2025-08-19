import { limitOffset } from '@api/schema/common';
import { err } from '@src/utils';
import { permitRepo as repo } from './repo';
import { permitServiceAPI } from '@src/infra/extrnal-api/service';
import { PemritCreate } from '@src/api/schema/permit';


const getAuthorityByCode = async (code: string) => {
  const result = await permitServiceAPI.getAuthorityByCode(code);
  return result
}

const createPermit = async (d: PemritCreate, code: string) => {
  


}

export const permitService = {
  getAuthorityByCode,
  createPermit
};
