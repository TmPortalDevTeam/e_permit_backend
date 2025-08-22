import z from 'zod';
import { initContract } from '@ts-rest/core';
import { permitSchema as schema } from '../schema/permit';
import { commonQuery, paramsId, paramsPermitId, resp } from '../schema/common';

const c = initContract();

export const permitContract = c.router(
  {
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
    addPermit: {
      method: 'POST',
      path: '/e-permit',
      body: schema.create,
      responses: {
        200: z.object({
          data: z.string().nullable(),
        }),
      },
    },
    getPermits: {
      method: 'GET',
      path: '/e-permit',
      query: commonQuery,
      responses: {
        200: z.object({
          data: z.any(),
        }),
      },
    },
    getAllRejectedPermits: {
      method: 'GET',
      path: '/rejected',
      query: schema.getAllRejectedPermit,
      responses: {
        200: z.object({
          data: z.any(),
        }),
      },
    },
    adminGetPermitID: {
      method: 'GET',
      path: '/e-permit/:id',
      pathParams: paramsId,
      responses: {
        200: z.object({ data: z.any() }),
      },
    },
    adminChangestatusto3: {
      method: 'POST',
      path: '/e-permit-change-statusto3',
      body: paramsPermitId,
      responses: { 200: resp }
    },
  },
  { pathPrefix: '/api/admin' },
);