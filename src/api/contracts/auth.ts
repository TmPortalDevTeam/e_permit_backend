import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { authSchema as schema } from '../schema/auth';
import { resp, respBody } from '../schema/common';

const c = initContract();

export const authContract = c.router(
  {
    login: {
      method: 'POST',
      path: '/login',
      body: schema.login,
      responses: { 200: resp }
    },
    getUserData: {
      method: 'GET',
      path: '/get-user-data',
      responses: { 200: resp }
    },
    logout: {
      method: 'GET',
      path: '/logout',
      responses: { 200: respBody },
    },
  },
  { pathPrefix: '/api/admin' },
);