import z from 'zod';
import { initContract } from '@ts-rest/core';
import { permitSchema as schema } from '../schema/permit';
import { commonQuery, paramsId, paramsPermitId, resp } from '../schema/common';

const c = initContract();

export const permitContract = c.router(
  {
    adminAddPermit: {
      method: 'POST',
      path: '/e-permit',
      body: schema.create,
      responses: { 200: resp }
    },
    adminGetPermit: {
      method: 'GET',
      path: '/e-permit',
      query: commonQuery,
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
      responses: { 200: resp }
    },
    adminAddPermits: {
      method: 'POST',
      path: '/permits',
      body: schema.permitCreateExternalApi,
      responses: { 200: resp }
    },
    adminPermitsID: {
      method: 'GET',
      path: '/permits/:permitID',
      pathParams: z.object({ permitID: z.string().uuid() }),
      responses: { 200: resp }
    },





    getQuotas: {
      method: 'GET',
      path: '/quotas/:code',
      pathParams: z.object({ code: z.string().trim() }),
      responses: {
        200: z.object({
          data: z.any(),
        }),
      },
    },
    getAllQuotas: {
      method: 'GET',
      path: '/quotas',
      responses: {
        200: z.object({
          data: z.any(),
        }),
      },
    },






    /** Externel API */

  },
  { pathPrefix: '/api/admin' },
);