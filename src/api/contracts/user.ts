import z from 'zod';
import { initContract } from '@ts-rest/core';
import { userSchema as schema } from '../schema/user';
import { blackSchema } from '../schema/blackHistory';
import { paymentSchema } from '../schema/payment';
import { paramsUuid, resp, respBody, result } from '../schema/common';

const c = initContract();

export const userContract = c.router(
  {
    getAll: {
      method: 'GET',
      path: '/users',
      query: schema.getAll,
      responses: { 200: resp }
    },
    create: {
      method: 'POST',
      path: '/users',
      body: schema.create,
      responses: { 201: resp }
    },
    addDeposit: {
      method: 'POST',
      path: '/deposit/:uuid',
      pathParams: paramsUuid,
      body: schema.addDeposit,
      responses: { 200: resp }
    },
    removeDeposit: {
      method: 'POST',
      path: '/deposit/:uuid/remove-deposit',
      pathParams: paramsUuid,
      body: z.undefined(),
      responses: { 200: resp }
    },
    getBlackHistory: {
      method: 'GET',
      path: '/black-history',
      query: blackSchema.getAll,
      responses: { 200: resp }
    },
    getBalance: {
      method: 'POST',
      path: '/balance',
      body: schema.getOneDepositBalance,
      responses: { 200: respBody }
    },
    addPayment: {
      method: 'POST',
      path: '/payment',
      body: paymentSchema.create,
      responses: { 200: respBody, }
    },
    history: {   
      method: 'GET',
      path: '/history',
      responses: { 200: resp }
    },
    usr_history: {
      method: 'GET',
      path: '/history/:uuid',
      pathParams: paramsUuid,
      responses: { 200: resp }
    },
  },
  { pathPrefix: '/api/admin' },
);