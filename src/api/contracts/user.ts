import z from 'zod';
import { initContract } from '@ts-rest/core';
import { userSchema as schema } from '../schema/user';
import { blackSchema } from '../schema/blackHistory';
import { paymentSchema } from '../schema/payment';
import { paramsUuid, result } from '../schema/common';

const c = initContract();

export const userContract = c.router(
  {
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
        200: {} as any,
      },
    },
    addDeposit: {
      method: 'POST',
      path: '/deposit/:uuid',
      pathParams: paramsUuid,
      body: schema.addDeposit,
      responses: {
        200: schema.getOneResDeposit,
      }
    },
    removeDeposit: {
      method: 'POST',
      path: '/deposit/:uuid/remove-deposit',
      pathParams: paramsUuid,
      body: z.undefined(),
      responses: {
        200: schema.getOneResDepositRemove,
      },
    },
    getBlackHistory: {
      method: 'GET',
      path: '/black-history',
      query: blackSchema.getAll,
      responses: {
        200: blackSchema.getAllRes,
      },
    },
    getBalance: {
      method: 'POST',
      path: '/balance',
      body: schema.getOneDepositBalance,
      responses: {
        200: {} as any,
      },
    },
    addPayment: {
      method: 'POST',
      path: '/payment',
      body: paymentSchema.create,
      responses: {
        200: result,
      }
    },
  },
  { pathPrefix: '/api/admin' },
);