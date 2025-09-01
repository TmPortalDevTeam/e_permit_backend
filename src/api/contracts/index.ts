import { initContract } from '@ts-rest/core';
import { adminContract } from './admin';
import { authContract } from './auth';
import { userContract } from './user';
import { permitContract } from './permit';

const c = initContract();

export const contract = c.router({
  admin: adminContract,
  auth: authContract,
  permit: permitContract,
  user: userContract,
});