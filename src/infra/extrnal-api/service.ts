import { getEnv } from '@src/infra/env/service';
import { StrInt } from '@api/schema/common';
import { apiEpermit, apiTUGDK } from './config';
import { loggerHttp } from '@src/utils/logger';
import { url } from 'node:inspector';
import { CreateAuthoritiesExternalApi, PermitCreateExternalApi, UpdatePermitStatus7 } from '@src/api/schema/permit';
import { err } from '@src/utils';

const PERMIT_API_URL = getEnv('E_PERMIT_API');
const TUGDK_API_URL = getEnv('TUGDK_API');
const API_PERMIT_SET_STATUS = '/api/permit/set-status';

// const auth_API_INET = {
//   username: "admin",
//   password: "Adm1n_TM_S3cr3t!",
// }

const basicAuth = {
  auth: {
    username: "admin",
    password: "Adm1n_TM_S3cr3t!",
  }
};




const getAllAuthority = async () => {
  const url: string = '/authorities';
  try {
    const response = await apiEpermit.get(url, basicAuth);
    return response.data;
  } catch (e: any) {
    loggerHttp(e, PERMIT_API_URL + url);
    return null;
  }
}

const updatePermitStatus = async (permitId: string, status: StrInt) => { // getPermitByID()
  try {
    const response = await apiTUGDK.post(API_PERMIT_SET_STATUS, { permitId, status });
    return response.data;
  } catch (e: any) {
    loggerHttp(e, TUGDK_API_URL + API_PERMIT_SET_STATUS);
    return null;
  }
};

const permitSetStatus = async (permitId: string, status: number) => {
  try {
    const response = await apiTUGDK.post(API_PERMIT_SET_STATUS, { permitId, status });
    return response.data;
  } catch (e: any) {
    loggerHttp(e, TUGDK_API_URL + API_PERMIT_SET_STATUS);
    return null;
  }
};

const permitSetStatus7 = async (data: UpdatePermitStatus7) => {
  try {
    const response = await apiTUGDK.post(API_PERMIT_SET_STATUS, data);
    return response.data;
  } catch (e: any) {
    loggerHttp(e, TUGDK_API_URL + API_PERMIT_SET_STATUS);
    return null;
  }
};

const getPermits = async () => {
  const url: string = '/permits';
  try {
    const response = await apiEpermit.get(url, basicAuth);
    return response.data;
  } catch (e: any) {
    loggerHttp(e, PERMIT_API_URL + url);
    return null;
  }
};

const addPermits = async (data: PermitCreateExternalApi) => {
  const url: string = '/test/permits'; // TEST request /test/ need remove in url
  try {
    const response = await apiEpermit.post(url, data, basicAuth);
    return response.data;
  } catch (e: any) {
    loggerHttp(e, PERMIT_API_URL + url);
    return null;
  }
};

const getPermitsByID = async (permitID: string) => {
  const url: string = `/permits/${permitID}`;
  try {
    const response = await apiEpermit.get(url, basicAuth);
    return response.data;
  } catch (e: any) {
    loggerHttp(e, PERMIT_API_URL + url);
    return null;
  }
};

const revokePermit = async (permitID: string) => {
  const url: string = `/permits/${permitID}`;
  try {
    const response = await apiEpermit.delete(url, basicAuth);
    return response.data;
  } catch (e: any) {
    loggerHttp(e, PERMIT_API_URL + url);
    return null;
  }
};

const getPermitPDF = async (permitID: string) => {
  const url: string = `/permits/${permitID}/pdf`;
  try {
    const response = await apiEpermit.get(url, basicAuth);
    return response.data;
  } catch (e: any) {
    loggerHttp(e, PERMIT_API_URL + url);
    return null;
  }
};

const findPermit = async (permitID: string) => {
  const url: string = `/permits/find/${permitID}`;
  try {
    const response = await apiEpermit.get(url, basicAuth);
    return response.data;
  } catch (e: any) {
    loggerHttp(e, PERMIT_API_URL + url);
    return null;
  }
};

const getAuthorities = async () => {
  const url: string = '/authorities';
  try {
    const response = await apiEpermit.get(url, basicAuth);
    return response.data;
  } catch (e: any) {
    loggerHttp(e, PERMIT_API_URL + url);
    return null;
  }
};

const postAuthorities = async (data: CreateAuthoritiesExternalApi) => {
  const url: string = '/authorities';
  try {
    const response = await apiEpermit.post(url, data, basicAuth);
    return response.data;
  } catch (e: any) {
    loggerHttp(e, PERMIT_API_URL + url);
    return null;
  }
};

const getAuthorityByCode = async (authorityCode: string) => {
  const url: string = `/authorities/${authorityCode}`;
  try {
    const response = await apiEpermit.get(url, basicAuth);
    return response.data;
  } catch (e: any) {
    loggerHttp(e, PERMIT_API_URL + url);
    return null;
  }
}






export const permitServiceAPI = {
  getAllAuthority,
  getAuthorityByCode,
  getPermits,
  addPermits,
  getPermitsByID,
  revokePermit,
  getPermitPDF,
  findPermit,
  getAuthorities,
  postAuthorities,


};

export const tugdkServiceAPI = {
  updatePermitStatus,
  permitSetStatus,
  permitSetStatus7
};
