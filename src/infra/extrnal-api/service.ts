import axios from 'axios';
import { getEnv } from '@src/infra/env/service';
import { StrInt } from '@api/schema/common';
import { apiEpermit, apiTUGDK } from './config';
import { err } from '@src/utils';
import { loggerHttp } from '@src/utils/logger';

const PERMIT_API_URL = getEnv('E_PERMIT_API');

const auth_API = {
  username: "admin",
  password: "admin",
}

const auth_API_INET = {
  username: "admin",
  password: "Adm1n_TM_S3cr3t!",
}

const getAuthorityByCode = async (code: string) => {
  try {

    const response = await apiEpermit.get(`${PERMIT_API_URL}/authorities/${code}`, { auth: auth_API_INET });
    // const response = await axios.get(`${PERMIT_API_URL}/authorities/${code}`, { auth: auth_API_INET });
    return response.data;
  } catch (e: any) {
    loggerHttp(e);
    return null;
  }
}

const getAllAuthority = async () => {
  try {
    const response = await apiEpermit.get(`${PERMIT_API_URL}/authorities`, { auth: auth_API_INET });
    // const response = await axios.get(`${PERMIT_API_URL}/authorities`, { auth: auth_API_INET });
    return response.data;
  } catch (e: any) {
    loggerHttp(e);
    return null;
  }
}

const updatePermitStatus = async (permitId: string, status: StrInt) => { // getPermitByID()
  try {
    const response = await apiTUGDK.post("/api/permit/set-status", { permitId, status });
    return response.data;
  } catch (e: any) {
    loggerHttp(e);
    return null;
  }
};




export const permitServiceAPI = {
  getAllAuthority,
  getAuthorityByCode,
};

export const tugdkServiceAPI = {
  updatePermitStatus,
};
