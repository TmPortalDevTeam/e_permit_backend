import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { authSchema as schema } from '../schema/auth';

const c = initContract();

export const authContract = c.router(
  {
    login: {
      method: 'POST',
      path: '/login',
      body: schema.login,
      responses: {
        201: schema.loginRes,
      },
    },
    me: {
      method: 'GET',
      path: '/me',
      responses: {
        200: schema.meRes,
      },
    },
    logout: {
      method: 'GET',
      path: '/logout',
      responses: {
        200: z.any(),
      },
    },
  },
  { pathPrefix: '/api/auth' },
);
