import z from 'zod';
import { initContract } from '@ts-rest/core';
import { permitSchema as schema } from '../schema/permit';
import { addFile, paramsCode, paramsId, paramsPermitID, paramsPermitId, resp, respBody } from '../schema/common';
import { authoritiesSchema } from '../schema/authorities';
import { getAllPermitsExternalApi, getPermitsExternalApi } from '../schema/permitExternalApi';

const c = initContract();

export const permitContract = c.router(
  {
    adminAddPermit: {
      method: 'POST',
      path: '/e-permit',
      body: schema.create,
      responses: { 201: resp }
    },
    adminGetPermit: {
      method: 'GET',
      path: '/e-permit',
      query: schema.getAll,
      responses: { 200: resp }
    },
    rejectedPermit: {
      method: 'GET',
      path: '/rejected',
      query: schema.getAllRejectedPermit,
      responses: { 200: resp }
    },
    adminGetPermitID: {
      method: 'GET',
      path: '/e-permit/:id',
      pathParams: paramsId,
      responses: { 200: resp }
    },
    adminChangestatusto3: {
      method: 'POST',
      path: '/e-permit-change-statusto3',
      body: paramsPermitId,
      responses: { 200: resp }
    },
    adminChangestatusto4: {
      method: 'POST',
      path: '/e-permit-change-statusto4',
      body: schema.updatePermitStatus,
      responses: { 200: resp }
    },
    adminSetstatus7: {
      method: 'POST',
      path: '/e-permit-setstatus7',
      body: schema.updatePermitStatus7,
      responses: { 200: resp }
    },
    adminChangePermitStatus: {
      method: 'POST',
      path: '/e-permit-change-status',
      body: schema.permitStatusUpdateRequest,
      responses: { 200: resp }
    },
    adminGetPermits: {
      method: 'GET',
      path: '/permits',
      query: getPermitsExternalApi,
      responses: { 200: resp }
    },
    adminGetAllPermitsExternalApi: {
      method: 'GET',
      path: '/permits/all',
      query: getAllPermitsExternalApi,
      responses: { 200: resp }
    },
    adminAddPermits: {
      method: 'POST',
      path: '/permits',
      body: schema.permitCreateExternalApi,
      responses: { 201: resp }
    },
    adminPermitsID: {
      method: 'GET',
      path: '/permits/:permitID',
      pathParams: paramsPermitID,
      responses: { 200: resp }
    },
    adminPermitsIdRevoke: {
      method: 'DELETE',
      path: '/permits/:permitID',
      pathParams: paramsPermitID,
      responses: { 200: resp }
    },
    getPermitPDFID: {
      method: 'GET',
      path: '/permits/:permitID/pdf',
      pathParams: paramsPermitID,
      responses: { 200: resp }
    },
    findPermitID: {
      method: 'GET',
      path: '/permits/find/:permitID',
      pathParams: paramsPermitID,
      responses: { 200: resp }
    },
    getAutorities: {
      method: 'GET',
      path: '/authorities',
      responses: { 200: resp }
    },
    postAutorities: {
      method: 'POST',
      path: '/authorities',
      body: authoritiesSchema.authoritiesCreate,
      responses: { 200: resp }
    },
    getQuotas: {
      method: 'GET',
      path: '/quotas/:code',
      pathParams: paramsCode,
      responses: { 200: resp }
    },
    quotas: {
      method: 'POST',
      path: '/authorities/:code/quotas',
      pathParams: paramsCode,
      body: authoritiesSchema.authoritiesQuotaCreate,
      responses: { 200: resp }
    },
    addPermitActivity: {
      method: 'POST',
      path: '/permit-activity/:permitID/activities',
      pathParams: z.object({ permitID: z.string() }),
      body: schema.permitActivityCreate,
      responses: { 200: resp }
    },
    addEmail: {
      method: 'POST',
      path: '/send-email/:ledgerID',
      contentType: 'multipart/form-data',
      pathParams: z.object({ ledgerID: z.string().uuid() }),
      body: addFile,
      responses: { 200: respBody }
    },
    permitStatus: {
      method: 'GET',
      path: '/permit/:permitUUID/status',
      pathParams: z.object({ permitUUID: z.string().uuid() }),
      responses: { 200: respBody }
    },

    permitPrice: {
      method: 'GET',
      path: '/permit/price',
      responses: { 200: respBody }
    },
  },
  { pathPrefix: '/api/admin' },
);