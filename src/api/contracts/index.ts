import { initContract } from '@ts-rest/core';
import { adminContract } from './admin';
import { authContract } from './auth';
import { userContract } from './user';
const c = initContract();

export const contract = c.router({
  auth: authContract,
  admin: adminContract,
  user: userContract,
});
