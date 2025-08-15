import { initContract } from '@ts-rest/core';
import { adminSchema as schema } from '../schema/admin';
import z from 'zod';

const c = initContract();

export const adminContract = c.router(
  {
    getRoles: {
      method: 'GET',
      path: '/roles',
      responses: {
        200: schema.getRoles,
      },
    },
    getAll: {
      method: 'GET',
      path: '',
      query: schema.getAll,
      responses: {
        200: schema.getAllRes,
      },
    },
    create: {
      method: 'POST',
      path: '',
      body: schema.create,
      responses: {
        201: schema.getOneRes,
      },
    },
    remove: {
      method: 'DELETE',
      path: '/:uuid',
      pathParams: z.object({ uuid: z.string().uuid() }),
      responses: {
        201: schema.getOneRes,
      },
    },
  },
  { pathPrefix: '/api/admins' },
);
