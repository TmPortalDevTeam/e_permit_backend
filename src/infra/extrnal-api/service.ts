import { getEnv } from '@src/infra/env/service';
import { StrInt } from '@api/schema/common';
import { apiEpermit, apiTUGDK } from './config';
import { loggerHttp } from '@src/utils/logger';
import { url } from 'node:inspector';

const PERMIT_API_URL = getEnv('E_PERMIT_API');
const TUGDK_API_URL = getEnv('TUGDK_API');

const auth_API_INET = {
  username: "admin",
  password: "Adm1n_TM_S3cr3t!", //admin
}

const getAuthorityByCode = async (code: string) => {
  try {
    const url: string = `/authorities/${code}`;
    const response = await apiEpermit.get(url, { auth: auth_API_INET });
    return response.data;
  } catch (e: any) {
    loggerHttp(e, PERMIT_API_URL + url);
    return null;
  }
}

const getAllAuthority = async () => {
  const url: string = '/authorities';
  try {
    const response = await apiEpermit.get(url, { auth: auth_API_INET });
    return response.data;
  } catch (e: any) {
    loggerHttp(e, PERMIT_API_URL + url);
    return null;
  }
}

const updatePermitStatus = async (permitId: string, status: StrInt) => { // getPermitByID()
  const url: string = '/api/permit/set-status';
  try {
    const response = await apiTUGDK.post(url, { permitId, status });
    return response.data;
  } catch (e: any) {
    loggerHttp(e, TUGDK_API_URL + url);
    return null;
  }
};

const permitSetStatus3 = async (permitId: string) => {
  const url: string = '/api/permit/set-status';
  try {
    const response = await apiTUGDK.post(url, { permitId, status: 3 });
    return response.data;
  } catch (e: any) {
    loggerHttp(e, TUGDK_API_URL + url);
    return null;
  }
};




export const permitServiceAPI = {
  getAllAuthority,
  getAuthorityByCode,
};

export const tugdkServiceAPI = {
  updatePermitStatus,
  permitSetStatus3,
  
};
