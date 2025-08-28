import { initContract } from '@ts-rest/core';
import { adminSchema as schema } from '../schema/admin';
import { paramsUuid, respBody } from '../schema/common';

const c = initContract();

export const adminContract = c.router(
  {
    getRoles: {
      method: 'GET',
      path: '/roles',
      responses: { 200: respBody },
    },
    create: {
      method: 'POST',
      path: '',
      body: schema.create,
      responses: {
        201: schema.getOneRes,
      },
    },
    getAll: {
      method: 'GET',
      path: '',
      query: schema.getAll,
      responses: { 200: respBody },
    },
    remove: {
      method: 'DELETE',
      path: '/:uuid',
      pathParams: paramsUuid,
      responses: { 204: respBody },
    },
  },
  { pathPrefix: '/api/admin' },
);