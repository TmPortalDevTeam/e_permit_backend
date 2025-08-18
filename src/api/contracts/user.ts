import { initContract } from '@ts-rest/core';
import { userSchema as schema } from '../schema/user';
import z, { string } from 'zod';
import { uuid } from '../schema/uuid';

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
      path: '/users',
      query: schema.getAll,
      responses: {
        200: schema.getAllRes,
      },
    },
    create: {
      method: 'POST',
      path: '/users',
      body: schema.create,
      responses: {
        201: {} as any,
      },
    },
    addDeposit: {
      method: 'POST',
      path: '/deposit/:uuid',
      pathParams: uuid,
      body: schema.addDeposit,
      responses: {
        200: schema.getOneResDeposit,
      }
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
  { pathPrefix: '/api/admin' },
);
