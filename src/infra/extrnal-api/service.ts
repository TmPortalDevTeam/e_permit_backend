import { getEnv } from '@src/infra/env/service';
import { limitOffset } from '@api/schema/common';
import { err } from '@src/utils';
import axios from 'axios';

const PERMIT_API_URL = getEnv('E_PERMIT_API');

const auth_API = {
  username: "admin",
  password: "admin",
}

const getAuthorityByCode = async (code: string) => {
  try {
    const response = await axios.get(`${PERMIT_API_URL}/authorities/${code}`, { auth: auth_API });
    return response.data;
  } catch (error) {
    throw new err.Conflict();
  }
}

export const permitServiceAPI = {
  getAuthorityByCode
};
