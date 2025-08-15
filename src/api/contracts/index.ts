import { initContract } from '@ts-rest/core';
import { adminContract } from './admin';
import { authContract } from './auth';
const c = initContract();

export const contract = c.router({
  admin: adminContract,
  auth: authContract,
});
