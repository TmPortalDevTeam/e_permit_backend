import { initContract } from '@ts-rest/core';
import { userSchema as schema } from '../schema/user';
import z from 'zod';

const c = initContract();

export const userContract = c.router(
  {
    // getRoles: {
    //   method: 'GET',
    //   path: '/roles',
    //   responses: {
    //     200: schema.getRoles,
    //   },
    // },
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
        201: {} as any,
      },
    },
    //   remove: {
    //     method: 'DELETE',
    //     path: '/:uuid',
    //     pathParams: z.object({ uuid: z.string().uuid() }),
    //     responses: {
    //       201: schema.getOneRes,
    //     },
    //   },
  },
  { pathPrefix: '/api/admin/users' },
);
