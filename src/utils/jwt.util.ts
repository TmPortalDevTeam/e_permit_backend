import { payload, Payload } from '@src/api/schema/auth';
import { getEnv } from '@src/infra/env/service';
import jwt from 'jsonwebtoken';

const jwtSecret = getEnv('JWT_SECRET');

const sign = async (data: Payload) => {
  const r = await payload.parseAsync(data);
  return jwt.sign(r, jwtSecret);
};

const verify = (token: string) => {
  return jwt.verify(token, jwtSecret);
};

export const jwtService = {
  sign,
  verify,
};
